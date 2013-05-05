if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time"
    ],
    function( require, Class, Time ){
	"use strict";
	
	var http = require("http"),
	    io = require("socket.io");
	
	
	function Server( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this._http = http;
	    this._io = io;
	    
	    this.host = opts.host || "127.0.0.1";
	    this.port = opts.port || 8080;
	    
	    this.server = undefined;
	    
	    this.init();
	}
	
	Server.prototype = Object.create( Class.prototype );
        Server.prototype.constructor = Server;
	
	
	Server.prototype.init = function(){
	    
	    this.server = http.createServer( this.onRequest.bind( this ) );
	    this.server.listen( this.port, this.host );
	};
	
	
	Server.prototype.onRequest = function( req, res ){
	    
	    res.end();
	};
	
	
	return Server;
    }
);