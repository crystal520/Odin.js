if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"base/device",
	"base/dom",
	"base/time",
	"core/input/input",
	"core/scene/scene2d",
	"core/canvas",
	"core/canvasrenderer2d",
	"core/webglrenderer2d"
    ],
    function( Class, Utils, Device, Dom, Time, Input, Scene2D, Canvas, CanvasRenderer2D, WebGLRenderer2D ){
	"use strict";
	
	var requestAnimFrame = Dom.requestAnimFrame,
	    floor = Math.floor,
	    addEvent = Dom.addEvent;
	
	
	function Game( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.debug = opts.debug !== undefined ? !!opts.debug : false;
	    this.forceCanvas = opts.forceCanvas !== undefined ? !!opts.forceCanvas : false;
	    
	    this.camera = undefined;
            this.scene = undefined;
	    
	    this.scenes = [];
	    
	    this.WebGLRenderer2D = new WebGLRenderer2D( opts );
	    this.CanvasRenderer2D = new CanvasRenderer2D( opts );
	    
	    this.renderer = this.WebGLRenderer2D;
	    
	    Input.init( this.renderer.canvas.element );
            
	    this.pause = false;
	    
            addEvent( window, "focus", this.handleFocus, this );
            addEvent( window, "blur", this.handleBlur, this );
	}
        
	Class.extend( Game, Class );
	
	
	Game.prototype.init = function(){
	    
	    this.trigger("init");
	    this.animate();
	};
	
	
	Game.prototype.updateRenderer = function( scene ){
	    
	    this.renderer.canvas.element.style.zIndex = -1;
	    
            if( scene instanceof Scene2D ){
		if( Device.webgl && !this.forceCanvas ){
		    this.renderer = this.WebGLRenderer2D;
		}
		else if( Device.canvas ){
		    this.renderer = this.CanvasRenderer2D;
		}
		else{
		    throw new Error("Game: Could not get a renderer");
		}
	    }
	    
	    Input.clear();
	    Input.init( this.renderer.canvas.element );
	    
	    this.renderer.canvas.element.style.zIndex = 1;
        };
	
	
	Game.prototype.addScene = function(){
            var scenes = this.scenes,
                scene, index, i;
            
            for( i = arguments.length; i--; ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index === -1 ){
		    scenes.push( scene );
		    scene.game = this;
		    
		    scene.trigger("addToGame");
		    this.trigger("addScene", scene );
                }
		else{
		    console.warn("Game.add: "+ scene.name +" is already added to game");
		}
            }
        };
        
        
        Game.prototype.removeScene = function(){
            var scenes = this.scenes,
                scene, index, i;
            
            for( i = arguments.length; i--; ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index !== -1 ){
                    scenes.splice( index, 1 );
		    scene.game = undefined;
                    
                    scene.trigger("removeFromGame");
                    this.trigger("removeScene", scene );
                }
		else{
		    console.warn("Game.remove: "+ scene.name +" is not in game");
		}
            }
        };
	
	
	Game.prototype.setScene = function( scene ){
	    var type = typeof scene,
		index;
	    
	    if( type === "string" ){
		scene = this.findSceneByName( scene );
	    }
	    else if( type === "number" ){
		scene = this.findSceneById( scene );
	    }
	    
	    index = this.scenes.indexOf( scene );
	    
	    if( index === -1 ){
		console.warn("Game.setScene: scene not added to Game, adding it...");
		this.addScene( scene );
	    }
	    
	    this.scene = scene;
	    
	    if( !this.scene ){
		console.warn("Game.setScene: could not find scene in Game "+ scene );
	    }
	    else{
		this.updateRenderer( this.scene );
	    }
        };
	
	
	Game.prototype.setCamera = function( camera ){
            var type = typeof camera,
		scene = this.scene,
		index;
	    
	    if( !scene ){
		console.warn("Game.setCamera: no active scene for camera.");
		return;
	    }
	    
	    if( type === "string" ){
		this.camera = scene.findByName( camera );
	    }
	    else if( type === "number" ){
		camera = scene.findById( camera );
	    }
	    else{
		index = scene.children.indexOf( camera );
		
		if( index === -1 ){
		    console.warn("Game.setCamera: camera not added to Scene, adding it...");
		    scene.add( camera );
		}
		
		this.camera = camera;
	    }
	    
            if( !this.camera ){
                console.warn("Game.setCamera: no camera found "+ camera );
            }
        };
	
	
	Game.prototype.findSceneByName = function( name ){
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
        
        
        Game.prototype.findSceneById = function( id ){
            var scenes = this.scenes,
                scene, i;
            
            for( i = scenes.length; i--; ){
                scene = scenes[i];
                
                if( scene._id === id ) return scene;
            }
            
            return undefined;
        };
        
        
        Game.prototype.findSceneByServerId = function( id ){
            var scenes = this.scenes,
                scene, i;
            
            for( i = scenes.length; i--; ){
                scene = scenes[i];
                
                if( scene._SERVER_ID === id ) return scene;
            }
            
            return undefined;
        };
	
	
	Game.prototype.update = function(){
	    var scene = this.scene;
            
	    Time.sinceStart = Time.now();
	    Input.update();
	    
	    if( !this.pause ){
		Time.update();
		
		this.trigger("update");
		
		if( scene ){
		    scene.update();
		}
		
		this.trigger("lateUpdate");
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
		
		if( this.debug ){
		    if( last + 0.5 <= Time.sinceStart ){
			fpsDisplay.innerHTML = ( Time.fps ).toFixed(2) + "fps";
			last = Time.sinceStart;
		    }
		}
		
		this.update();
		this.render();
		
		requestAnimFrame( this.animate.bind( this ) );
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