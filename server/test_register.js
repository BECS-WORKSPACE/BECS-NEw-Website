const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/register', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'student'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
})();
