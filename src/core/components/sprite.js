if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/component",
	"math/vec2"
    ],
    function( Class, Time, Component, Vec2 ){
        "use strict";
	
        
        function Sprite( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.visible = opts.visible !== undefined ? opts.visible : true;
	    
	    this.image = opts.image instanceof Image ? opts.image : undefined;
	    
	    this.offset = opts.offset instanceof Vec2 ? opts.offset : new Vec2;
	    
	    this.width = opts.width || 1;
	    this.height = opts.height || 1;
	    
            this.x = opts.x || 0;
            this.y = opts.y || 0;
            
            this.w = opts.w || 1;
            this.h = opts.h || 1;
	    
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
        
	Class.extend( Sprite, Component );
	
	
	Sprite.prototype.play = function( name, mode ){
	    
	    if( this.playing && this.animation === this.animations[ name ] ){
		this.animation = this.animations[ name ];
		
		switch( mode ){
		    
		    case Sprite.LOOP:
		    case "loop":
			this.mode = Sprite.LOOP;
			break;
		    
		    case Sprite.PINGPONG:
		    case "pingpong":
			this.mode = Sprite.PINGPONG;
			break;
		    
		    case Sprite.ONCE:
		    case "once":
			this.mode = Sprite.ONCE;
			break;
		    
		    default:
			this.mode = Sprite.LOOP;
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
			else if( this.mode === Sprite.ONCE ){
			    this.stop();
			}
		    }
		    else{
			this._frame++;
		    }
		}
	    }
	};
	
	
	Sprite.ONCE = 0;
	Sprite.LOOP = 1;
	Sprite.PINGPONG = 2;
	
        
        return Sprite;
    }
);