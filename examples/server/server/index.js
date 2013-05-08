var requirejs = require("requirejs");

requirejs(
    {
        baseUrl: "../",
        nodeRequire: require
    },
    [
        "odin"
    ],
    function( Odin ){
        var game = new Odin.ServerGame({
            name: "Game",
            host: "127.0.0.1",
            port: 8080,
            debug: true
        });
    }
);