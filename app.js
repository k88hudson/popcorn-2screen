var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(7777);

app.get('/*', function (req, res) {
  var file = req.params[0];

  if ( file === "1" ) {
    res.sendfile(__dirname + '/views/primary.html');
  } else if (file === "2" ) {
    res.sendfile(__dirname + '/views/secondary.html');
  } else {
    res.sendfile(__dirname + '/public/' + file );
  }
  
});
 
io.sockets.on('connection', function ( socket ) {
  socket.on('popcornEvent', function ( data ) {
    console.log( data );
    io.sockets.emit( data.e, {
      key: data ? data.key : false,
      data: data ? data.data : {}
    });
  });
});
