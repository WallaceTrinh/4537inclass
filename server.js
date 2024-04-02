const http = require('http');
const server = http.createServer((req, res) => {
  // if you run the client from sth like file:///C:/nodejs/10httonlyCookie1/index.html
  // it would mean HTML file is being served via the file:// protocol directly from your filesystem rather than over HTTP or HTTPS.
  console.log('Request origin:', req.headers.origin);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');// Adjust the port if necessary
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    // Preflight request automatically sends by browser for many reasons
    res.writeHead(204);//success with no content to return to the client
    res.end();
    return;
  }
  /*\ /login */
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {body += chunk.toString();});
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body); 
        if (username === 'admin' && password === '111') {
          res.writeHead(200, {
            'Set-Cookie': 'token=123456; HttpOnly;Max-Age=60000 ',
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ message: 'Logged in successfully' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Unauthorized' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
      }
    });
    /*\ /something, A protected route example which is only accessable to logged in users */
  } else if (req.url === '/something' && req.method === 'GET') {
    // Check if the user is logged in by checking the cookie that the browser still holds for this origin
    const cookie = req.headers.cookie;
    if (cookie && cookie.includes('token=123456')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'You are logged in, treasure:GDENEAR' }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized: You are not logged in.' }));
    }
  } else {
    // For any other route, return 404 not found
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404 Not Found');
  }
});
server.listen(7777, () => {
  console.log('Server running on port 7777');
});//**  Generated mostly by chatGPT ver. 4 **/
