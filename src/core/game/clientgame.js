if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time",
	"base/device",
	"core/input/input",
	"core/input/mouse",
	"core/input/touches",
	"core/input/keyboard",
	"core/input/accelerometer",
	"core/input/orientation",
	"core/scene/scene2d",
	"core/game/game",
	"core/objects/camera2d",
	"core/objects/gameobject2d",
	"core/objects/transform2d"
	
    ],
    function( require, Class, Time, Device, Input, Mouse, Touches, Keyboard, Accelerometer, Orientation,
	Scene2D, Game, Camera2D, GameObject2D, Transform2D
    ){
	"use strict";
	
	var objectTypes = {
		Scene2D: Scene2D,
		Camera2D: Camera2D,
		GameObject2D: GameObject2D,
		Transform2D: Transform2D
	    };
	
	
	function ClientGame( opts ){
	    opts || ( opts = {} );
	    
	    Game.call( this, opts );
	    
	    this.id = undefined;
	    
	    this.host = opts.host || "127.0.0.1";
	    this.port = opts.port || 3000;
	    
	    var self = this, socket,
		scenes, jsonObject, object, i;
	    
	    this.socket = socket = io.connect("http://"+ this.host, { port: this.port });
	    
	    socket.on("connection", function( id, scenes ){
		
		self.id = id;
		socket.emit("device", Device );
		
		for( i = scenes.length; i--; ){
		    jsonObject = scenes[i];
		    object = new objectTypes[ jsonObject.type ];
		    object.fromJSON( jsonObject );
		    self.addScene( object );
		}
		
		
		socket.on("sync", function( timeStamp ){
		    
		    socket.emit("clientOffset", Time.stamp() - timeStamp );
		});
		
		
		socket.on("gameObjectMoved", function( scene, gameObject, position ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    gameObject = scene.findByServerId( gameObject );
		    if( !gameObject ) return;
		    
		    gameObject.position.copy( position );
		    gameObject.updateMatrices();
		});
		
		socket.on("gameObjectScaled", function( scene, gameObject, scale ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    gameObject = scene.findByServerId( gameObject );
		    if( !gameObject ) return;
		    
		    gameObject.scale.copy( scale );
		    gameObject.updateMatrices();
		});
		
		socket.on("gameObjectRotated", function( scene, gameObject, rotation ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    gameObject = scene.findByServerId( gameObject );
		    if( !gameObject ) return;
		    
		    gameObject.rotation = rotation;
		    gameObject.updateMatrices();
		});
		
		
		socket.on("addComponent", function( scene, gameObject, component ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    gameObject = scene.findByServerId( gameObject );
		    if( !gameObject ) return;
		    
		    object = new objectTypes[ component.type ];
		    object.fromJSON( component );
		    gameObject.addComponent( object );
		});
		
		
		socket.on("removeComponent", function( scene, gameObject, component ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    gameObject = scene.findByServerId( gameObject );
		    if( !gameObject ) return;
		    
		    gameObject.removeComponent( gameObject.getComponent( component ) );
		});
		
		
		socket.on("addGameObject", function( scene, gameObject ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    object = new objectTypes[ gameObject.type ];
		    object.fromJSON( gameObject );
		    scene.add( object );
		});
		
		
		socket.on("removeGameObject", function( scene, gameObject ){
		    scene = self.findSceneByServerId( scene );
		    if( !scene ) return;
		    
		    gameObject = scene.findByServerId( gameObject );
		    if( !gameObject ) return;
		    
		    scene.remove( gameObject );
		});
		
		
		socket.on("addScene", function( scene ){
		    object = new objectTypes[ scene.type ];
		    object.fromJSON( scene );
		    self.add( object );
		});
		
		
		socket.on("removeScene", function( scene ){
		    scene = self.findSceneByServerId( scene );
		    if( scene ) self.removeScene( scene );
		});
		
		
		socket.on("setScene", function( scene ){
		    scene = self.findSceneByServerId( scene );
		    if( scene ) self.setScene( scene );
		});
		
		socket.on("setCamera", function( camera ){
		    camera = self.scene.findByServerId( camera );
		    if( camera ) self.setCamera( camera );
		});
		
		
		socket.on("log", function(){
		    console.log.apply( console, arguments );
		});
		
		
		Accelerometer.on("accelerometerchange", function(){ socket.emit("accelerometerchange", Accelerometer ); });
		Orientation.on("orientationchange", function( mode, orientation ){ socket.emit("orientationchange", mode, orientation ); });
		
		Keyboard.on("keydown", function( key ){ socket.emit("keydown", key ); });
		Keyboard.on("keyup", function( key ){ socket.emit("keyup", key ); });
		
		Touches.on("start", function( touch ){ socket.emit("touchstart", touch ); });
		Touches.on("end", function( touch ){ socket.emit("touchend", touch ); });
		Touches.on("move", function( touch ){ socket.emit("touchmove", touch ); });
		
		Mouse.on("down", function(){ socket.emit("mousedown", Mouse ); });
		Mouse.on("up", function(){ socket.emit("mouseup", Mouse ); });
		Mouse.on("out", function(){ socket.emit("mouseout", Mouse ); });
		Mouse.on("move", function(){ socket.emit("mousemove", Mouse ); });
		Mouse.on("wheel", function(){ socket.emit("mousewheel", Mouse ); });
	    });
	}
        
	Class.extend( ClientGame, Game );
	
	
	return ClientGame;
    }
);