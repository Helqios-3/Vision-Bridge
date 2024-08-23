
// This is pretty much not my code I found with another action sample then simply change it to serve YAML files.
// I tried to learn what does what but I need much more experience with this side of JS.

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/yaml-files') {
    // If requrest is yaml-files try to respond with files if not raise error
    fs.readdir('.', (error, files) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unable to scan directory' }));
        return;
      }
      // Filter through file types and send back file array.
      const yamlFiles = files.filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(yamlFiles));
    });

// After this part its all copy paste.

  } else {
    // Existing code to serve files
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.yml': 'text/yaml',
      '.yaml': 'text/yaml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if(error.code == 'ENOENT') {
          fs.readFile('./404.html', function(error, content) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        }
        else {
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        }
      }
      else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});