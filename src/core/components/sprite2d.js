if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/renderable2d",
	"math/vec2"
    ],
    function( Class, Time, Renderable2D, Vec2 ){
        "use strict";
	
        
        function Sprite2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    this.image = opts.image instanceof Image ? opts.image : undefined;
	    
	    this.width = opts.width || 1;
	    this.height = opts.height || 1;
	    
            this.x = opts.x || 0;
            this.y = opts.y || 0;
            
            this.w = opts.w || this.image.width;
            this.h = opts.h || this.image.height;
	    
	    this.animations = opts.animations || {
		idle: [
		    [ this.x, this.y, this.w, this.h, 0.25 ]
		]
	    };
	    
	    this.animation = this.animations["idle"];
	    
	    this.mode = Sprite2D.loop;
	    
	    this._last = 0;
	    this._frame = 0
	    
	    this.playing = this.animation !== undefined ? true : false;
	    
	    this.updateSprite();
        }
        
	Class.extend( Sprite2D, Renderable2D );
	
	
	Sprite2D.prototype.play = function( name, mode ){
	    
	    if( this.playing && this.animation === this.animations[ name ] ){
		this.animation = this.animations[ name ];
		
		switch( mode ){
		    
		    case Sprite2D.LOOP:
		    case "loop":
			this.mode = Sprite2D.LOOP;
			break;
		    
		    case Sprite2D.PINGPONG:
		    case "pingpong":
			this.mode = Sprite2D.PINGPONG;
			break;
		    
		    case Sprite2D.ONCE:
		    case "once":
			this.mode = Sprite2D.ONCE;
			break;
		    
		    default:
			this.mode = Sprite2D.LOOP;
		}
		
		this.playing = true;
	    }
	};
	
	
	Sprite2D.prototype.stop = function(){
	    
	    this.playing = false;
	};
	
	
	Sprite2D.prototype.update = function(){
	    var animation = this.animation,
		currentFrame = animation[ this._frame ],
		rate = currentFrame[4],
		currentFrame;
	    
	    if( animation && this.playing ){
		
		if( this._last + ( rate / Time.scale ) <= Time.time ){
		    this._last = Time.time;
		    
		    if( currentFrame ){
			this.x = currentFrame[0];
			this.y = currentFrame[1];
			this.w = currentFrame[2];
			this.h = currentFrame[3];
		    }
		    
		    if( this._frame >= animation.length - 1 ){
			if( this.mode === Sprite2D.loop ){
			    this._frame = 0;
			}
			else if( this.mode === Sprite2D.ONCE ){
			    this.stop();
			}
		    }
		    else{
			this._frame++;
		    }
		}
	    }
	};
	
	
	Sprite2D.ONCE = 0;
	Sprite2D.LOOP = 1;
	Sprite2D.PINGPONG = 2;
	
        
        return Sprite2D;
    }
);