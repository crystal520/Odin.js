if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time",
	"core/game/client",
	"core/scene/scene2d"
    ],
    function( require, Class, Time, Client, Scene2D ){
	"use strict";
	
	var http = require("http"),
	    url = require("url"),
	    path = require("path"),
	    fs = require("fs"),
	    io = require("socket.io"),
	    scenesList = [];
	
	
	function ServerGame( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.scenes = [];
	    this.clients = {};
	    
	    this.host = opts.host || "127.0.0.1";
	    this.port = opts.port || 8080;
	    
	    this.server = http.createServer( this._onRequest.bind( this ) );
	    this.server.listen( this.port, this.host );
	    
	    this.io = io.listen( this.server );
	    this.io.set("log level", opts.logLevel || 2 );
	    
	    var self = this;
	    this.io.sockets.on("connection", function( socket ){
		var scenes = self.scenes,
		    client = new Client({
			id: socket.id,
			socket: socket,
			connectTime: Time.stamp()
		    }),
		    i;
		
		scenesList.length = 0;
		
		for( i = scenes.length; i--; ){
		    scenesList[i] = scenes[i].toJSON();
		}
		
		self.clients[ socket.id ] = client;
		
		socket.emit("connected", socket.id, scenesList );
		self.trigger("connected", socket.id );
		
		console.log("ServerGame: new Client with id "+ socket.id );
		
		socket.on("disconnect", function(){
		    console.log("ServerGame: Client with id "+ socket.id +" disconnected");
		    self.trigger("disconnect", socket.id );
		});
		
		socket.on("device", function( device ){ client.device = device; });
		
		socket.on("clientoffset", function( offset ){
		    client.offset = offset;
		    
		    if( offset > 10 ){
			console.log("ServerGame: disconnected Client with id "+ socket.id +" due to slow connection");
			self.trigger("disconnect", socket.id );
			socket.disconnect();
		    }
		});
		
		socket.on("accelerometerchange", function( Accelerometer ){ client.trigger("accelerometerchange", Accelerometer ); });
		socket.on("orientationchange", function( mode, orientation ){ client.trigger("orientationchange", mode, orientation ); });
		
		socket.on("keydown", function( key ){ client.trigger("keydown", key ); });
		socket.on("keyup", function( key ){ client.trigger("keyup", key ); });
		
		socket.on("touchstart", function( touch ){ client.trigger("touchstart", touch ); });
		socket.on("touchend", function( touch ){ client.trigger("touchend", touch ); });
		socket.on("touchmove", function( touch ){ client.trigger("touchmove", touch ); });
		
		socket.on("mousedown", function( Mouse ){ client.trigger("mousedown", Mouse ); });
		socket.on("mouseup", function( Mouse ){ client.trigger("mouseup", Mouse ); });
		socket.on("mouseout", function( Mouse ){ client.trigger("mouseout", Mouse ); });
		socket.on("mousemove", function( Mouse ){ client.trigger("mousemove", Mouse ); });
		socket.on("mousewheel", function( Mouse ){ client.trigger("mousewheel", Mouse ); });
	    });
	}
        
	Class.extend( ServerGame, Class );
	
	
	ServerGame.prototype.init = function(){
	    
	    this.trigger("init");
	    this.animate();
	    
	    console.log("Game started at "+ this.host +":"+ this.port );
	};
	
	
	ServerGame.prototype.addScene = function(){
            var scenes = this.scenes,
		sockets = this.io.sockets,
                scene, index, i;
            
            for( i = arguments.length; i--; ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index === -1 ){
		    scenes.push( scene );
		    scene.game = this;
		    
		    scene.trigger("addtogame");
		    this.trigger("addscene", scene );
		    sockets.emit("addscene", scene.toJSON() );
		    
		    scene.on("addgameobject", function( gameObject ){
			sockets.emit("addgameobject", this.name, gameObject.toJSON() );
			
			gameObject.on("addcomponent", function( component ){
			    sockets.emit("addcomponent", this.scene.name, this.name, component.toJSON() );
			});
			
			gameObject.on("removecomponent", function( component ){
			    sockets.emit("removecomponent", this.scene.name, this.name, component._class );
			});
			
			gameObject.on("moved", function(){
			    sockets.emit("gameObject_moved", this.scene.name, this.name, this.position );
			});
			gameObject.on("scaled", function(){
			    sockets.emit("gameObject_scaled", this.scene.name, this.name, this.scale );
			});
			gameObject.on("rotated", function(){
			    sockets.emit("gameObject_rotated", this.scene.name, this.name, this.rotation );
			});
		    });
		    
		    scene.on("removegameobject", function( gameObject ){
			sockets.emit("removegameobject", this.name, gameObject.name );
			gameObject.off("addcomponent");
			gameObject.off("removecomponent");
		    });
                }
		else{
		    console.warn("ServerGame.add: "+ scene.name +" is already added to game");
		}
            }
        };
        
        
        ServerGame.prototype.removeScene = function(){
            var scenes = this.scenes,
		sockets = this.io.sockets,
                scene, index, i;
            
            for( i = arguments.length; i--; ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index !== -1 ){
                    scenes.splice( index, 1 );
		    scene.game = undefined;
                    
                    scene.trigger("removefromgame");
                    this.trigger("removescene", scene );
		    sockets.emit("removescene", scene.name );
		    
		    scene.off("addgameobject");
		    scene.off("removegameobject");
                }
		else{
		    console.warn("ServerGame.remove: "+ scene.name +" is not in game");
		}
            }
        };
        
        
        ServerGame.prototype.setScene = function( client, scene ){
            var index = this.scenes.indexOf( scene ),
		socket = this.io.sockets.sockets[ client.id ];
	    
	    if( index === -1 ){
		console.warn("ServerGame.setScene: scene not added to Game, adding it...");
		this.addScene( scene );
	    }
	    
	    client.scene = scene.name;
	    socket.emit("setscene", scene.name );
	    
	    if( !client.scene ){
		console.warn("ServerGame.setScene: could not find scene in Game "+ scene );
	    }
        };
        
        
        ServerGame.prototype.setCamera = function( client, scene, camera ){
            var index = scene.children.indexOf( camera ),
		socket = this.io.sockets.sockets[ client.id ];
	    
	    if( index === -1 ){
		console.warn("ServerGame.setCamera: camera not added to scene, adding it...");
		scene.addScene( camera );
	    }
	    
	    client.camera = camera.name;
	    socket.emit("setcamera", camera.name );
	    
	    if( !client.camera ){
		console.warn("ServerGame.setCamera: could not find camera in scene "+ scene );
	    }
        };
	
	
	ServerGame.prototype.findSceneByName = function( name ){
            var scenes = this.scenes,
                scene, i;
            
            for( i = scenes.length; i--; ){
                scene = scenes[i];
                
                if( scene.name === name ){
                    
                    return scene;
                }
            }
            
            return undefined;
        };
	
	
	ServerGame.prototype.update = function(){
	    var scenes = this.scenes, scene, i;
	    
	    Time.sinceStart = Time.now();
	    Time.update();
	    
	    for( i = scenes.length; i--; ) scenes[i].update();
	    
	    this.io.sockets.emit("sync", Time.stamp() );
	};
	
	
	ServerGame.prototype.animate = function(){
	    
	    this.update();
	    
	    setTimeout( this.animate.bind( this ), 0 );
	};
	
	
	ServerGame.prototype._onRequest = function(){
	    var mimeTypes = {
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
	    
	    return function( req, res ){
		var uri = url.parse( req.url ).pathname,
		    filename = path.join( process.cwd(), uri ),
		    mime = mimeTypes[ uri.split(".").pop() ] || "text/plain";
		    
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
	}();
	
	
	return ServerGame;
    }
);