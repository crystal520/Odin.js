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
	    path = require("path"),
	    fs = require("fs"),
	    io = require("socket.io");
	
	
	function ServerGame( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.name = opts.name || ( this._class +"-"+ this._id );
	    
	    this.clients = [];
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
	    
	    this.io.sockets.on("connection", this.onConnect.bind( this ) );
	    
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
		uri = url.parse( req.url ).pathname,
		filename = path.join( process.cwd(), uri ),
		mime = ServerGame.mime[ uri.split(".").pop() ] || "text/plain";
	    
	    fs.exists( filename, function( exists ){
		
		if( !exists ){
		    res.writeHead( 404, {"Content-Type": "text/plain"});
		    res.write("404 Not Found");
		    res.end();
		    return;
		}
		
		if( fs.statSync( filename ).isDirectory() ){
		    filename += "index.html";
		    mime = "text/html";
		}
		
		fs.readFile( filename, function( error, file ){
		    console.log( req.method +": "+ filename +" "+ mime );
		    
		    if( error ){
			res.writeHead( 500, {"Content-Type": "text/plain"});
			res.write( err + "\n");
			res.end();
			return;
		    }
		    
		    res.writeHead( 200, {"Content-Type": mime });
		    res.write( file, mime );
		    res.end();
		});
	    });
	};
	
	
	ServerGame.prototype.onConnect = function( socket ){
	    var self = this,
		clients = this.clients,
		client, i, il;
	    
	    socket.on("newclient", function(){
		
		clients.push({
		    id: socket.id,
		    connectTime: Time.now()
		});
		
		console.log("ServerGame: new Client with id "+ socket.id +" at "+ Time.now() );
	    });
	    
	    socket.on("disconnect", function( data ){
		
		for( i = 0, il = self.clients.length; i < il; i++ ){
		    client = clients[i];
		    
		    if( client.id === socket.id ){
			console.log("ServerGame: Client with id "+ socket.id +" has left at "+ Time.now() );
			clients.splice( i, 1 );
			break;
		    }
		}
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