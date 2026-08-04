import fetch from 'node-fetch';
const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@mowogun.gov.ng', password: 'Admin@123' }),
});
const loginJson = await loginRes.json();
console.log('login', loginRes.status, loginJson);
if (loginRes.ok) {
  const token = loginJson.token;
  for (const status of ['All', 'Pending', 'Approved', 'Rejected']) {
    let url = 'http://127.0.0.1:5000/api/members';
    if (status !== 'All') url += `?status=${encodeURIComponent(status)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const text = await res.text();
    console.log(status, res.status, text);
  }
}
