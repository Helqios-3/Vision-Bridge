const http = require('http');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); // Parse masterConfig.yml

// Load and parse masterConfig
const masterConfig = yaml.load(fs.readFileSync('./masterConfig.yml', 'utf8')).datasource; // Load and parse masterConfig then assign its main object datasource to a variable
let lastLoadedHTML = ""; // Keep check of last loaded HTML file for fetching YAML files

// Create the server
const server = http.createServer((req, res) => {
  // Handle YAML files request
  if (req.url === '/yaml-files') {
    fs.readdir('.', (error, files) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unable to scan directory' }));
        return;
      }
      let yamlFiles = [];
      // Determine the yaml files to return
      Object.keys(masterConfig.pages).forEach(element => {
        if (lastLoadedHTML === `./${element}.html`) {
          yamlFiles = masterConfig.pages[element];
        }
      });
      Object.keys(masterConfig.urls).forEach(element => {
        if (lastLoadedHTML === `.${element}.html`) {
          yamlFiles = masterConfig.urls[element];
        }
      });
      Object.keys(masterConfig.hosts).forEach(element => {
        if (lastLoadedHTML === `./${element.replace(".com", "")}.html`) {
          yamlFiles = masterConfig.hosts[element];
        }
      });
      console.log(yamlFiles);
      // Answer the fetch request with correct YAML files
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(yamlFiles));
    });
  } else {
    // Determine the file path based on request URL and host
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './home.html'; // Default to index.html
    }

    // Mapping URLs and hosts to specific HTML files
    const mappings = {
      '/about': './about.html',
      '/contact': './contact.html',
      '/products': './products.html',
      '/orders': './orders.html',
      'example.com': './example.html',
      'another-example.com': './another-example.html'
    };

    if (mappings[req.url]) {
      filePath = mappings[req.url];
    } else if (mappings[req.headers.host]) {
      filePath = mappings[req.headers.host];
    }
    // Keep track of last loaded page in browser so skip specific requests of JavaScript code
    if (filePath === "/yamlFiles" ||  filePath === "./app.js") {
      lastLoadedHTML = lastLoadedHTML;
    }
    else {
      lastLoadedHTML = filePath;
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
        if (error.code == 'ENOENT') {
          fs.readFile('./404.html', (error, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});
