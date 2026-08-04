import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Eye, Pencil, CheckCircle2, XCircle, Trash2, X } from 'lucide-react';
import api from '../lib/api';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState('');
  const [loadError, setLoadError] = useState('');

  const location = useLocation();

  const statusFilter = (() => {
    const segments = location.pathname.toLowerCase().split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    if (lastSegment === 'pending') return 'Pending';
    if (lastSegment === 'approved') return 'Approved';
    if (lastSegment === 'rejected') return 'Rejected';
    return 'All';
  })();

  const loadMembers = async (status = null, searchTerm = '') => {
    setLoadError('');
    setLoadingMembers(true);
    try {
      const params = [];
      if (status && status !== 'All') params.push(`status=${encodeURIComponent(status)}`);
      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      const url = params.length ? `/members?${params.join('&')}` : '/members';
      const response = await api.get(url);
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      setMembers([]);
      setLoadError(error.response?.data?.message || 'Unable to load members.');
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => loadMembers(statusFilter, search), 350);
    return () => clearTimeout(t);
  }, [statusFilter, search, location.pathname]);

  const filteredMembers = members;

  const handleView = async (memberId) => {
    setLoadingAction(true);
    setActionError('');
    try {
      const response = await api.get(`/members/${memberId}`);
      setSelectedMember(response.data);
    } catch (error) {
      console.error(error);
      setActionError('Unable to load member details.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleApprove = async (memberId) => {
    setLoadingAction(true);
    setActionError('');
    try {
      await api.patch(`/members/${memberId}/status`, { status: 'Approved' });
      await loadMembers(statusFilter);
      if (selectedMember?.id === memberId) {
        setSelectedMember({ ...selectedMember, registrationStatus: 'Approved' });
      }
    } catch (error) {
      console.error(error);
      setActionError('Unable to approve member.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReject = async (memberId) => {
    const reason = window.prompt('Enter rejection reason');
    if (reason === null) return;

    setLoadingAction(true);
    setActionError('');
    try {
      await api.patch(`/members/${memberId}/status`, { status: 'Rejected', rejectionReason: reason });
      await loadMembers(statusFilter);
      if (selectedMember?.id === memberId) {
        setSelectedMember({ ...selectedMember, registrationStatus: 'Rejected', rejectionReason: reason });
      }
    } catch (error) {
      console.error(error);
      setActionError('Unable to reject member.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Delete this member permanently?')) return;

    setLoadingAction(true);
    setActionError('');
    try {
      await api.delete(`/members/${memberId}`);
      await loadMembers(statusFilter);
      if (selectedMember?.id === memberId) {
        setSelectedMember(null);
      }
    } catch (error) {
      console.error(error);
      setActionError('Unable to delete member.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setEditData({
      id: member.id,
      firstName: member.firstName,
      surname: member.surname,
      phone: member.phone,
      email: member.email,
      membershipStatus: member.membershipStatus,
    });
    setSelectedMember(member);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    setLoadingAction(true);
    setActionError('');
    try {
      await api.put(`/members/${editData.id}`, {
        firstName: editData.firstName,
        surname: editData.surname,
        phone: editData.phone,
        email: editData.email,
        membershipStatus: editData.membershipStatus,
      });
      await loadMembers(statusFilter);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setActionError('Unable to save member edits.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const closeDetails = () => {
    setSelectedMember(null);
    setIsEditing(false);
    setEditData(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Member Management</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{statusFilter === 'All' ? 'All Registered Members' : `${statusFilter} Members`}</h2>
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-600">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, phone, or registration ID" className="w-full border-0 outline-none" />
          </label>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Registration ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadError ? (
                <tr>
                  <td className="px-4 py-6 text-center text-rose-700" colSpan={6}>
                    {loadError}
                  </td>
                </tr>
              ) : loadingMembers ? (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                    Loading members...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                    No members found for this filter.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-slate-900">{member.registrationId}</td>
                    <td className="px-4 py-3">{member.firstName} {member.surname}</td>
                    <td className="px-4 py-3">{member.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.registrationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : member.registrationStatus === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-[#022969]/10 text-[#022969]'}`}>{member.registrationStatus}</span>
                    </td>
                    <td className="px-4 py-3">{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleView(member.id)} className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" title="View details">
                          <Eye size={16} />
                        </button>
                        <button type="button" onClick={() => handleEdit(member)} className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" title="Edit member">
                          <Pencil size={16} />
                        </button>
                        {statusFilter !== 'Approved' && (
                          <>
                            <button type="button" onClick={() => handleApprove(member.id)} className="rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100" title="Approve member">
                              <CheckCircle2 size={16} />
                            </button>
                            <button type="button" onClick={() => handleReject(member.id)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100" title="Reject member">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button type="button" onClick={() => handleDelete(member.id)} className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" title="Delete member">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMember && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#022969]">Member {isEditing ? 'Edit' : 'Details'}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedMember.firstName} {selectedMember.surname}</h2>
            </div>
            <button type="button" onClick={closeDetails} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-500">Registration ID</p>
              <p className="mt-2 text-slate-900">{selectedMember.registrationId}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Status</p>
              <p className="mt-2 text-slate-900">{selectedMember.registrationStatus}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(event) => handleEditChange('email', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-slate-900 outline-none"
                />
              ) : (
                <p className="mt-2 text-slate-900">{selectedMember.email}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(event) => handleEditChange('phone', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-slate-900 outline-none"
                />
              ) : (
                <p className="mt-2 text-slate-900">{selectedMember.phone}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">First Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(event) => handleEditChange('firstName', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-slate-900 outline-none"
                />
              ) : (
                <p className="mt-2 text-slate-900">{selectedMember.firstName}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Surname</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.surname}
                  onChange={(event) => handleEditChange('surname', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-slate-900 outline-none"
                />
              ) : (
                <p className="mt-2 text-slate-900">{selectedMember.surname}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Membership Status</p>
              {isEditing ? (
                <select
                  value={editData.membershipStatus || ''}
                  onChange={(event) => handleEditChange('membershipStatus', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-slate-900 outline-none"
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Reserve">Reserve</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-2 text-slate-900">{selectedMember.membershipStatus || 'N/A'}</p>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleSaveEdit} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Save Changes
              </button>
              <button type="button" onClick={handleCancelEdit} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          ) : selectedMember.rejectionReason ? (
            <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-rose-700">
              <p className="text-sm font-semibold">Rejection Reason</p>
              <p className="mt-2 text-sm">{selectedMember.rejectionReason}</p>
            </div>
          ) : null}
        </div>
      )}

      {actionError && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {actionError}
        </div>
      )}
    </div>
  );
};

export default MembersPage;
