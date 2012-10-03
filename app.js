var app = require( "express" )(),
    server = require( "http" ).createServer( app ),
    io = require( "socket.io" ).listen( server );

server.listen( 7777 );

io.sockets.on( "connection", function( socket ) {

  socket.on( "setRoom", function( data ) {
    socket.join( data.room );
    socket.broadcast.to( data.room ).emit( "connected", data );
    if ( data.view ) {
      socket.emit( "connected-view" );
    }
  });

  socket.on( "up", function( data ) {
    socket.broadcast.to( data.room ).emit( data.e, data );
  });

  socket.on( "remote", function( data ) {
    socket.broadcast.to( data.room ).emit( "remote", data );
  });
});

app.get( "/2screen/view", function( req, res ) {
  res.sendfile( __dirname + "/views/primary.html" );
});

app.get( "/2screen", function( req, res ) {
  res.sendfile( __dirname + "/views/secondary.html" );
});

app.get( "/2screen/*", function( req, res ) {
  res.sendfile( __dirname + "/public/" + req.params[ 0 ] );
});
