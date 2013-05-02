if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/device",
	"base/dom",
	"base/time",
	"core/input/input",
	"core/canvasrenderer",
	"core/webglrenderer",
    ],
    function( Class, Device, Dom, Time, Input, CanvasRenderer, WebGLRenderer ){
	"use strict";
	
	var floor = Math.floor,
	    addEvent = Dom.addEvent;
	
	
	function Game( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.scene = undefined;
            this.scenes = [];
            
	    if( Device.webgl ){
		this.renderer = new WebGLRenderer( opts );
	    }
	    else{
		this.renderer = new CanvasRenderer( opts );
	    }
	    
	    Input.init( this.renderer.canvas.element );
	    
            this.addScene.apply( this, opts.scenes );
            
	    this.pause = false;
	    
            addEvent( window, "focus", this.handleFocus, this );
            addEvent( window, "blur", this.handleBlur, this );
	}
	
	Game.prototype = Object.create( Class.prototype );
        Game.prototype.constructor = Game;
	
	
	Game.prototype.addScene = function(){
            var scenes = this.scenes,
                scene, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                scene = arguments[i];
                index = scenes.indexOf( scene );
                
                if( index === -1 && scene instanceof Scene ){
                    
                    scenes.push( scene );
		    scene.game = this;
                    
                    scene.trigger("addToGame");
                    this.trigger("addScene", scene );
		    
		    if( !this.scene ){
			this.setScene( scene );
		    };
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
                    
                    scene.trigger("removeFromGame");
                    this.trigger("removeScene", scene );
		    
		    if( this.scene === scene ){
			this.scene = undefined;
		    }
                }
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
		
		this.trigger("lateUpdate");
		
		Time.end();
	    }
	};
	
	
	Game.prototype.render = function(){
	    var scene = this.scene;
            
            if( scene && scene.camera ){
		this.renderer.render( scene );
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
		    fpsDisplay.innerHTML = ( floor( Time.ms * 100 ) * 0.01 ) + "ms";
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