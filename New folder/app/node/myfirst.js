
var http = require('http');
var date = require('./firstmodule');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('data /n'+date.myDateTime());
  res.write(req.url);
  res.end('/nHello World!');
}).listen(8080);