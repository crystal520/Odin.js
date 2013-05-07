if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time",
	"core/scene"
    ],
    function( require, Class, Time, Scene ){
	"use strict";
	
	var http = require("http"),
	    url = require("url"),
	    fs = require("fs"),
	    io = require("socket.io");
	
	
	function ServerGame( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.name = opts.name || ( this._class +"-"+ this._id );
	    
	    this.scenes = [];
	    
	    this.host = opts.host || "127.0.0.1";
	    this.port = opts.port || 8080;
	    
	    this.server = undefined;
	    this.io = undefined;
	    
	    this.init();
	}
        
	Class.extend( ServerGame, Class );
	
	
	ServerGame.prototype.init = function(){
	    
	    this.trigger("init");
	    this.animate();
	    
	    this.server = http.createServer( this.onRequest.bind( this ) );
	    
	    this.io = io.listen( this.server );
	    this.server.listen( this.port, this.host );
	    
	    this.io.sockets.on("connection", this.onConnection.bind( this ) );
	    
	    console.log("Game started at "+ this.host +":"+ this.port );
	};
	
	
	ServerGame.prototype.sendMessage = function( name, data ){
	    
	    this.io.emit( name, data );
	};
	
	
	ServerGame.prototype.onMessage = function( name, fn ){
	    
	    this.io.on( name, fn );
	};
	
	
	ServerGame.prototype.onRequest = function( req, res ){
	    var self = this,
		path = url.parse( req.url ).pathname,
		parts = path.split("/");
	    
	    fs.stat( path, function( error, stat ){
		
		if( error ){
		    console.log( error );
		    return self;
		}
		
		return self.sendFile( req, res, path );
	    });
	};
	
	
	ServerGame.prototype.onConnection = function( socket ){
	    
	};
	
	
	ServerGame.prototype.sendFile = function( req, res, path ){
	    var self = this,
		file = fs.createReadStream( path );
	    
	    res.writeHead( 200, {
		"Content-Type": ServerGame.mime[ path.split(".").pop() ] || "text/plain"
	    });
	    
	    file.on("data", res.write.bind( res ) );
	    
	    file.on("close", function() {
		res.end();
	    });
	    
	    file.on("error", function( error ){
		console.log( error );
	    });
	};
	
	
	ServerGame.prototype.update = function(){
	    var scene = this.scene;
	    
	    Time.start();
	    
	    
	    
	    Time.end();
	};
	
	
	ServerGame.prototype.animate = function(){
	    
	    this.update();
	    
	    setTimeout( this.animate.bind( this ), 0 );
	    
	    Time.sinceStart = Time.now();
	};
	
	
	ServerGame.mime = {
	    "txt": "text/plain",
	    "html": "text/html",
	    "css": "text/css",
	    "xml": "application/xml",
	    "json": "application/json",
	    "js": "application/javascript",
	    "jpg": "image/jpeg",
	    "jpeg": "image/jpeg",
	    "gif": "image/gif",
	    "png": "image/png",
	    "svg": "image/svg+xml"
	};
	
	
	return ServerGame;
    }
);