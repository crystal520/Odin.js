if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/time",
	"core/components/component",
	"math/vec2"
    ],
    function( Time, Component, Vec2 ){
        "use strict";
        
	var defaultImg = new Image;
	defaultImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
        
        function Sprite( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.visible = opts.visible !== undefined ? opts.visible : true;
	    
	    this.image = opts.image instanceof Image ? opts.image : defaultImg;
	    
	    this.offset = opts.offset instanceof Vec2 ? opts.offset : new Vec2;
	    
	    this.width = opts.width || this.image.width;
	    this.height = opts.height || this.image.height;
	    
            this.x = opts.x || 0;
            this.y = opts.y || 0;
            
            this.w = opts.w || this.image.width;
            this.h = opts.h || this.image.height;
	    
	    this.animations = opts.animations || {
		idle: {
		    frames: [
			[ this.x, this.y, this.w, this.h ]
		    ],
		    rate: 0.25
		}
	    };
	    
	    this.animation = this.animations["idle"];
	    
	    this.mode = Sprite.loop;
	    
	    this._last = 0;
	    this._frame = 0
	    
	    this.playing = this.animation !== undefined ? true : false;
        }
        
        Sprite.prototype = Object.create( Component.prototype );
        Sprite.prototype.constructor = Sprite;
	
	
	Sprite.prototype.play = function( name, mode ){
	    
	    if( this.playing && this.animation === this.animations[ name ] ){
		this.animation = this.animations[ name ];
		
		switch( mode ){
		    
		    case Sprite.loop:
		    case "loop":
			this.mode = Sprite.loop;
			break;
		    
		    case Sprite.pingPong:
		    case "pingpong":
			this.mode = Sprite.pingPong;
			break;
		    
		    case Sprite.once:
		    case "once":
			this.mode = Sprite.once;
			break;
		    
		    default:
			this.mode = Sprite.loop;
		}
		
		this.playing = true;
	    }
	};
	
	
	Sprite.prototype.stop = function(){
	    
	    this.playing = false;
	};
	
	
	Sprite.prototype.update = function(){
	    var animation = this.animation,
		currentFrame;
	    
	    if( animation && this.playing ){
		
		if( this._last + ( animation.rate / Time.scale ) <= Time.time ){
		    this._last = Time.time;
		    
		    currentFrame = animation.frames[ this._frame ];
		    
		    if( currentFrame ){
			this.x = currentFrame[0];
			this.y = currentFrame[1];
			this.w = currentFrame[2];
			this.h = currentFrame[3];
		    }
		    
		    if( this._frame >= animation.frames.length - 1 ){
			if( this.mode === Sprite.loop ){
			    this._frame = 0;
			}
			else if( this.mode === Sprite.once ){
			    this.stop();
			}
		    }
		    else{
			this._frame++;
		    }
		}
	    }
	};
	
	
	Sprite.once = 0;
	Sprite.loop = 1;
	Sprite.pingPong = 2;
	
        
        return Sprite;
    }
);