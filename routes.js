var url = require('url');
var fs = require('fs');

function renderHTML(path, res) {
  fs.readFile(path, null, function(error, data) {
    if (error) {
      res.writeHead(404);
      res.writeHead('File not found!');
    } else {
      res.write(data);
    }
    res.end()
  });
}

module.exports = {
  hadleRequest: function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var path = url.parse(req.url).pathname;
    switch (path) {
      case '/':

    }
  }
};
