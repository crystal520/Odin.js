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
	    
	    this.image = opts.image !== undefined ? opts.image : "default";
	    
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
	    
	    this.animation = "idle";
	    
	    this.mode = Sprite2D.loop;
	    
	    this._last = 0;
	    this._frame = 0
	    
	    this.playing = this.animations[ this.animation ] !== undefined ? true : false;
	    this.calculateSprite();
        }
        
	Class.extend( Sprite2D, Renderable2D );
        
	
	Sprite2D.prototype.copy = function( other ){
	    var animations = other.animations,
		animation, key, value, i;
	    
	    Renderable2D.call( this, other );
	    
	    this.image = other.image;
	    
	    this.width = other.width;
	    this.height = other.height;
	    
            this.x = other.x;
            this.y = other.y;
            
            this.w = other.w;
            this.h = other.h;
	    
	    for( key in animations ){
		value = animations[ key ];
		
		for( i = value.length; i--; ){
		    this.animations[key][i] = value[i];
		}
	    }
	    
	    this.animation = this.animations["idle"];
	    
	    this.mode = other.mode;
	    
	    this._last = other._last;
	    this._frame = other._frame;
	    
	    this.playing = other.playing;
	    
	    return this;
	};
	
	
	Sprite2D.prototype.play = function( name, mode ){
	    
	    if( this.animations[ name ] ){
		this.animation = name;
		
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
	    else{
		console.warn("Sprite2D.play: no animation with name "+ name );
	    }
	};
	
	
	Sprite2D.prototype.stop = function(){
	    
	    this.playing = false;
	};
	
	
	Sprite2D.prototype.update = function(){
	    var animation = this.animations[ this.animation ],
		currentFrame = animation[ this._frame ],
		rate = currentFrame[4],
		currentFrame;
	    
	    if( this.playing ){
		
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
        
        
        Sprite2D.prototype.toJSON = function(){
            var json = this._JSON,
		animations = this.animations,
		animation, i, j;
	    
	    json.type = "Sprite2D";
	    json._SERVER_ID = this._id;
	    
	    json.visible = this.visible;
	    json.offset = this.offset;
	    
	    json.alpha = this.alpha;
	    
	    json.fill = this.fill;
	    json.color = this.color;
	    
	    json.line = this.line;
	    json.lineColor = this.lineColor;
	    json.lineWidth = this.lineWidth;
	    
	    json.image = this.image;
	    
	    json.x = this.x;
	    json.y = this.y;
	    json.w = this.w;
	    json.h = this.h;
	    
	    json.animations = json.animations || {};
	    
	    for( i in animations ){
		json.animations[i] = json.animations[i] || [];
		animation = animations[i];
		
		for( j = animation.length; j--; ){
		    json.animations[i][j] = animation[j];
		}
	    }
	    
	    json.animation = this.animation;
	    json.playing = this.playing;
	    json.mode = this.mode;
	    json._last = this._last;
	    json._from = this._frame;
	    
	    return json;
        };
        
        
        Sprite2D.prototype.fromJSON = function( json ){
	    var animations = json.animations,
		animation, i, j;
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
            this.visible = json.visible;
	    this.offset.fromJSON( json.offset );
	    
	    this.alpha = json.alpha;
	    
	    this.fill = json.fill;
	    this.color.fromJSON( json.color );
	    
	    this.line = json.line;
	    this.lineColor.fromJSON( json.lineColor );
	    this.lineWidth = json.lineWidth;
	    
	    this.image = json.image;
	    
	    this.x = json.x;
	    this.y = json.y;
	    this.w = json.w;
	    this.h = json.h;
	    
	    for( i in animations ){
		this.animations[i] = animations[i];
		animation = animations[i];
		
		for( j = animation.length; j--; ){
		    this.animations[i][j] = animation[j];
		}
	    }
	    
	    this.animation = json.animation;
	    this.playing = json.playing;
	    this.mode = json.mode;
	    this._last = json._last;
	    this._from = json._frame;
	    
	    return this;
        };
	
	
	Sprite2D.ONCE = 0;
	Sprite2D.LOOP = 1;
	Sprite2D.PINGPONG = 2;
	
        
        return Sprite2D;
    }
);