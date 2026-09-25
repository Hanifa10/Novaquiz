const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
});

req.on('error', (e) => {
  console.error('Problem with request:', e.message);
});
req.end();
