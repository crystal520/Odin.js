if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	var random = Math.random,
	    floor = Math.floor,
	    abs = Math.abs,
	    atan2 = Math.atan2,
	    EPSILON = 0.000001,
	    PI = 3.141592653589793,
	    TO_RADS = PI / 180,
	    TO_DEGS = 180 / PI;
	
	
	function Mathf(){
	    
	    this.PI = PI;
	    this.TWO_PI = PI * 2;
	    this.HALF_PI = PI * 0.5;
	    
	    this.EPSILON = 0.000001;
	    
	    this.TO_RADS = TO_RADS;
	    this.TO_DEGS = TO_DEGS;
	}
	
	
	Mathf.prototype.acos = Math.acos;
	Mathf.prototype.asin = Math.asin;
	Mathf.prototype.atan = Math.atan;
	Mathf.prototype.atan2 = Math.atan2;
	
	Mathf.prototype.cos = Math.cos;
	Mathf.prototype.sin = Math.sin;
	Mathf.prototype.tan = Math.tan;
	
	Mathf.prototype.abs = Math.abs;
	Mathf.prototype.ceil = Math.ceil;
	Mathf.prototype.exp = Math.exp;
	Mathf.prototype.floor = Math.floor;
	Mathf.prototype.log = Math.log;
	Mathf.prototype.max = Math.max;
	Mathf.prototype.min = Math.min;
	Mathf.prototype.pow = Math.pow;
	Mathf.prototype.random = Math.random;
	Mathf.prototype.round = Math.round;
	Mathf.prototype.sqrt = Math.sqrt;
	
	
	Mathf.prototype.equals = function( a, b ){
	    
	    return abs( a - b ) <= EPSILON;
	};
	
	
	Mathf.prototype.modulo = function( a, b ){
            var r = a % b;
            
            return ( r * b < 0 ) ? r + b : r;
        };
	
	
	Mathf.prototype.standardRadian = function( x ){
	    
	    return this.modulo( x, this.TWO_PI );
	};
	
	
	Mathf.prototype.standardAngle = function( x ){
	    
	    return this.modulo( x, 360 );
	};
	
	
	Mathf.prototype.sign = function( x ){
	    
	    return x < 0 ? -1 : 1;
	};
	
	
	Mathf.prototype.clamp = function( x, min, max ){
	    
	    return x < min ? min : x > max ? max : x;
	};
	
	
	Mathf.prototype.clampBottom = function( x, min ){
	    
	    return x < min ? min : x;
	};
	
	
	Mathf.prototype.clampTop = function( x, max ){
	    
	    return x > max ? max : x;
	};
	
	
	Mathf.prototype.clamp01 = function( x ){
	    
	    return x < 0 ? 0 : x > 1 ? 1 : x;
	};
	
	
	Mathf.prototype.lerp = function( a, b, t ){
	    
	    return a + ( b - a ) * this.clamp01( t );
	};
	
	
	Mathf.prototype.lerpAngle = function( a, b, t ){
	    
	    return this.standardRadian( a + ( b - a ) * this.clamp01( t ) );
	};
	
	
	Mathf.prototype.smoothStep = function( x, min, max ){
            x = ( this.clamp01( x ) - min ) / ( max - min );
            
            return x * x * ( 3 - 2 * t );
        };
        
        
        Mathf.prototype.smootherStep = function( x, min, max ){
            x = ( this.clamp01( x ) - min ) / ( max - min );
            
            return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
        };
        
        
        Mathf.prototype.pingPong = function( t, length ){
	    length || ( length = 1 );
	    
	    return length - abs( t % ( 2 * length ) - length );
        };
        
        
        Mathf.prototype.toRadians = function( x ){
	    
	    return this.standardRadian( x * TO_RADS );
        };
        
        
        Mathf.prototype.toDegrees = function( x ){
	    
	    return this.standardAngle( x * TO_DEGS );
        };
	
        
        Mathf.prototype.randInt = function( min, max ){
	    
	    return floor( this.randomRange( min, max + 1 ) );
        };
        
        
        Mathf.prototype.randFloat = function( min, max ){
	    
	    return min + ( random() * ( max - min ) );
        };
        
        
        Mathf.prototype.randChoice = function( array ){
	    
	    return array[ floor( random() * array.length ) ]
        };
        
        
        Mathf.prototype.isPowerOfTwo = function( x ){
	    
	    return ( x & -x ) === x;
        };
        
        
        Mathf.prototype.nextPowerOfTwo = function( x ){
	    var i = 2;
	    
	    while( i < x ){
		i *= 2;
	    }
	    
	    return i;
        };
        
        
        Mathf.prototype.direction = function( x, y ){
	    
	    if( abs( x ) >= abs( y ) ){
		
		return x > 0 ? "right" : "left"
	    }
	    
	    return y > 0 ? "up" : "down"
	};
	
	
	return new Mathf;
    }
);