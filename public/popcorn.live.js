// PLUGIN: livecredits

(function ( Popcorn ) {

  var socket = io.connect('http://192.168.1.110:7777');

  /**
   * livecredits Popcorn plug-in
   * Based on popcorn.text.js by @humph
   * @param {Object} options
   *
   * Example:
  
   **/

  Popcorn.plugin( "livecredits", {

    manifest: {
      about: {
        name: "Popcorn livecredits Plugin",
        version: "0.1",
        author: "@k88hudson"
      },
      options: {
        start: {
          elem: "input",
          type: "text",
          label: "In"
        },
        end: {
          elem: "input",
          type: "text",
          label: "Out"
        },
        text: {
          elem: "input",
          type: "text",
          label: "Text",
          "default": "Popcorn.js"
        }
      }
    },

    _setup: function( options ) {
      options.key = options.key === undefined ? Popcorn.guid() : options.key;
      console.log( options.key );
      socket.emit( "popcornEvent", {
        e: "setup",
        key: options.key,
        data: options
      });
    },

    /**
     * @member livecredits
     * The start function will be executed when the currentTime
     * of the video  reaches the start time provided by the
     * options variable
     */
    start: function( event, options ) {
      socket.emit( "popcornEvent", {
        e: "start",
        key: options.key,
        data: options
      });
    },
    /**
     * @member livecredits
     * The end function will be executed when the currentTime
     * of the video  reaches the end time provided by the
     * options variable
     */
    end: function( event, options ) {
      socket.emit( "popcornEvent", {
        e: "end",
        key: options.key,
        data: options
      });
    },
    _teardown: function( options ) {
      //
    }
  });
})( Popcorn );
