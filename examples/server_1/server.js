var requirejs = require("requirejs");

requirejs(
    {
	baseUrl: __dirname +"/../../src/",
	nodeRequire: require
    },
    [
	"core/game/servergame"
    ],
    function( ServerGame ){
	
	var server = new ServerGame({
	    name: "Test",
	    host: "192.168.1.173",
	    dirname: __dirname,
	    client: "index"
	});
	
	server.onMessage("connection", function( socket ){
	    socket.emit("connect", "hey");
	});
    }
);