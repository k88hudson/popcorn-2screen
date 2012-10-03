document.addEventListener( "DOMContentLoaded", function() {
  var socket = io.connect( "http://" + window.location.host ),
      TEMPLATE_FRAG = document.getElementById( "TEMPLATE" ),
      list = document.querySelector( ".feed" ),
      PREFIX = "commentary-",
      room;

  function pause() {
    socket.emit( "remote", {
      e: "pause",
      room: room
    });
  }

  function jumpTo( timestamp ) {
    socket.emit( "remote", {
      e: "play",
      time: timestamp,
      room: room
    });
  }

  function createLi( popcornData, data ) {
    var newEl = TEMPLATE_FRAG.querySelector( ".commentary-block").cloneNode( true ),
        nameContainer = newEl.querySelector( ".full-name" ),
        profile = newEl.querySelector( ".photo" ),
        textContainer = newEl.querySelector( "p" );

    nameContainer.innerHTML = data.author_info.full_name;
    if ( data.author_info.thumbnail ) {
      profile.classList.remove( "hidden" );
      profile.src = data.author_info.thumbnail;
    }
    textContainer.innerHTML = data.text;
    newEl.id = PREFIX + data.index;
    newEl.addEventListener( "click", function() {
      jumpTo( popcornData.data.start );
    }, false );

    list.appendChild( newEl );
  }

  function init( annotations ) {
    var connectBtn = document.getElementById( "connect" ),
        connectInput = document.getElementById( "connect-input" ),
        spinny = document.querySelector( ".spinny" ),
        room;

    connectBtn.addEventListener( "click", function() {
      room = connectInput.value;
      socket.emit( "setRoom", {
        room: room
      });

      spinny.classList.remove( "hidden" );
      connectBtn.classList.add( "hidden" );
    }, false );

    function onConnected( data ) {
      if ( data.room === room ) {
        connectBtn.innerHTML = ":) Connected!";
        connectBtn.classList.remove( "hidden" );
        spinny.classList.add( "hidden" );
      }
    }
  
    function onStart( data ) {
      console.log( data );
      var container = document.getElementById( PREFIX  + data.key );
      container.classList.remove( "hidden" );
    }

    function onEnd( data ) {
      var container = document.getElementById( PREFIX + data.key );
      container.classList.add( "hidden" );
    }

    function onSetup( data ) {
      var key = data.key;
      if ( annotations[ key ] && !document.getElementById( PREFIX + key ) ) {
        createLi( data, annotations[ key ][ 0 ] );
      }
    }

    socket.on( "connected", onConnected );
    socket.on( "setup", onSetup );
    socket.on( "start", onStart );
    socket.on( "end", onEnd );

  } //init


  //Grab the annotation data.
  Popcorn.xhr({
    url: "/2screen/data/annotations.json",
    dataType: "json",
    success: init
  });
  
}, false);
