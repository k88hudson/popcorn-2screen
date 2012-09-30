document.addEventListener( "DOMContentLoaded", function() {
  var socket = io.connect('http://192.168.1.110:7777'),
      TEMPLATE_FRAG = document.getElementById( "TEMPLATE" ),
      list = document.querySelector( ".feed" ),
      PREFIX = "commentary-";

  function pause() {
    socket.emit( "remote", {
      e: "pause"
    });
  }

  function jumpTo( timestamp ) {
    socket.emit( "remote", {
      e: "play",
      time: timestamp
    });
  }

  function createLi( popcornData, data ) {
    var newEl = TEMPLATE_FRAG.querySelector( ".commentary-block").cloneNode( true ),
        nameContainer = newEl.querySelector( ".full-name" ),
        profile = newEl.querySelector( "img" ),
        textContainer = newEl.querySelector( "p" );

    nameContainer.innerHTML = data.author_info.full_name;
    profile = data.author_info.thumbnail;
    textContainer.innerHTML = data.text;
    newEl.id = PREFIX + data.index;
    newEl.addEventListener( "click", function() {
      jumpTo( popcornData.data.start );
    }, false );

    list.appendChild( newEl );
  }

  function init( annotations ) {
  
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

    console.log( annotations );

    //Setup!
    socket.on( "setup", onSetup );
    socket.on( "start", onStart );
    socket.on( "end", onEnd );
  }

  //Grab the annotation data.
  Popcorn.xhr({
    url: "data/annotations.json",
    dataType: "json",
    success: init
  });
  
}, false);
