if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/device",
	"base/dom",
	"base/time",
	"core/scene",
	"core/input/input",
	"core/canvasrenderer",
	"core/webglrenderer",
    ],
    function( Class, Device, Dom, Time, Scene, Input, CanvasRenderer, WebGLRenderer ){
	"use strict";
	
	var floor = Math.floor,
	    addEvent = Dom.addEvent;
	
	
	function Game( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.debug = opts.debug !== undefined ? opts.debug : false;
	    
	    this.camera = undefined;
            this.scene = undefined;
	    
	    this.scenes = [];
            
	    if( Device.webgl && !opts.forceCanvas ){
		this.renderer = new WebGLRenderer( opts );
	    }
	    else if( Device.canvas ){
		this.renderer = new CanvasRenderer( opts );
	    }
	    else{
		throw new Error("Game: Could not get rendering context");
	    }
	    
	    Input.init( this.renderer.canvas.element );
            
	    this.pause = false;
	    
            addEvent( window, "focus", this.handleFocus, this );
            addEvent( window, "blur", this.handleBlur, this );
	}
        
	Class.extend( Game, Class );
	
	
	Game.prototype.addScene = function(){
            var scenes = this.scenes,
                scene, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index === -1 ){
                    
		    if( scene instanceof Scene ){
			scenes.push( scene );
			scene.game = this;
			
			scene.trigger("addtogame");
			this.trigger("addscene", scene );
		    }
		    else{
			console.warn("Game.add: Object is not an instance of Scene");
		    }
                }
		else{
		    console.warn("Game.add: "+ scene.name +" is already added to game");
		}
            }
        };
        
        
        Game.prototype.removeScene = function(){
            var scenes = this.scenes,
                scene, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index !== -1 ){
                    
                    scenes.splice( index, 1 );
		    scene.game = undefined;
                    
                    scene.trigger("removefromgame");
                    this.trigger("removescene", scene );
                }
		else{
		    console.warn("Game.remove: "+ scene.name +" is not in game");
		}
            }
        };
	
	
	Game.prototype.setScene = function( scene ){
            var index, newScene;
	    
            if( scene instanceof Scene ){
                index = this.scenes.indexOf( scene );
		
		if( index === -1 ){
		    console.warn("Game.setScene: scene not added to Game, adding it...");
		    this.addScene( scene );
		}
		
                this.scene = scene;
            }
            else if( Utils.isString( scene ) ){
		
                this.scene = this.getScene( scene );
            }
	    
	    if( !this.scene ){
		console.warn("Game.setScene: could not find scene in Game "+ scene );
	    }
        };
	
	
	Game.prototype.setCamera = function( camera ){
            var index,
		scene = this.scene;
		
	    if( !scene ){
		console.warn("Game.setCamera: no active scene for camera.");
		return;
	    }
	    
	    if( camera.matrixProjection ){
		index = scene.children.indexOf( camera );
		
		if( index === -1 ){
		    console.warn("Game.setCamera: camera not added to Scene, adding it...");
		    scene.add( camera );
		}
		
		this.camera = camera;
	    }
            else if( isString( camera ) ){
                this.camera = scene.findByName( camera );
            }
	    
            if( !this.camera ){
                console.warn("Scene.setCamera: no camera found "+ camera );
            }
        };
	
	
	Game.prototype.init = function(){
	    
	    this.trigger("init");
	    this.animate();
	};
	
	
	Game.prototype.update = function(){
	    var scene = this.scene;
            
	    Input.update();
	    
	    if( !this.pause ){
		Time.start();
		
		this.trigger("update");
		
		if( scene ){
		    scene.update();
		}
		
		this.trigger("lateupdate");
		
		Time.end();
	    }
	};
	
	
	Game.prototype.render = function(){
	    var scene = this.scene,
		camera = this.camera;
            
            if( scene && camera ){
		this.renderer.render( scene, camera );
            }
	};
	
	
	Game.prototype.animate = function(){
	    var fpsDisplay = document.createElement("p"),
		last = 0;
	    
	    fpsDisplay.style.cssText = [
		"z-index: 1000;",
		"position: absolute;",
		"margin: 0px;",
		"padding: 0px;",
		"color: #ddd;",
		"text-shadow: 1px 1px #333"
	    ].join("\n");
	    
	    document.body.appendChild( fpsDisplay );
	    
	    return function(){
		
		if( last + 0.5 <= Time.sinceStart ){
		    fpsDisplay.innerHTML = ( Time.fps ).toFixed(2) + "fps";
		    last = Time.sinceStart;
		}
		
		this.update();
		this.render();
		
		Dom.requestAnimFrame( this.animate.bind( this ) );
		
		Time.sinceStart = Time.now();
	    };
	}();
        
        
        Game.prototype.handleFocus = function( e ){
	    
	    this.trigger("focus", e );
        };
        
        
        Game.prototype.handleBlur = function( e ){
	    
	    this.trigger("blur", e );
        };
	
	
	return Game;
    }
);