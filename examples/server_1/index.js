var requirejs = require("requirejs");

requirejs(
    {
	baseUrl: __dirname +"/../../src/",
	nodeRequire: require
    },
    [
	"core/server"
    ],
    function( Server ){
	
	var server = new Server;
	
    }
);