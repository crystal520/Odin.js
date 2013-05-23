if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec2"
    ],
    function( Mathf, Vec2 ){
        "use strict";
	
	var cos = Math.cos,
	    sin = Math.sin,
	    atan2 = Math.atan2,
	    abs = Math.abs,
	    sqrt = Math.sqrt,
	    HALF_PI = Math.PI * 0.5,
	    lerp = Mathf.lerp,
	    equals = Mathf.equals;
        
        
        function Affine( a, b, c, d, x, y ){
	    
            this.a = a !== undefined ? a : 1;
            this.b = b || 0;
            this.c = c || 0;
            this.d = d !== undefined ? d : 1;
            this.x = x || 0;
            this.y = y || 0;
	}
	
	
	Affine.prototype.clone = function(){
            
            return new Affine(
                this.a, this.b,
		this.c, this.d,
		this.x, this.y
            );
        };
	
	
	Affine.prototype.copy = function( other ){
	    
	    this.a = other.a; this.b = other.b;
            this.c = other.c; this.d = other.d;
            this.x = other.x; this.y = other.y;
	    
	    return this
        };
	
        
        Affine.prototype.set = function( a, b, c, d, x, y ){
            
            this.a = a; this.b = b;
            this.c = c; this.d = d;
            this.x = x; this.y = y;
            
            return this;
        };
	
	
	Affine.prototype.toGL = function(){
            var m = Affine._mat4;
	    
	    m[0] = this.a; m[4] = this.b;
	    m[1] = this.c; m[5] = this.d;
	    m[12] = this.x; m[13] = this.y;
	    
            return m;
        };
	
	
	Affine.prototype.identity = function(){
            
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.x = 0;
            this.y = 0;
            
            return this;
        };
	
	
	Affine.prototype.mmul = function( a, b ){
	    var aa = a.a, ab = a.b,
		ac = a.c, ad = a.d,
		ax = a.x, ay = a.y,
		
		ba = b.a, bb = b.b,
		bc = b.c, bd = b.d,
		bx = b.x, by = b.y;
            
	    this.a = aa * ba + ab * bc;
	    this.b = aa * bb + ab * bd;
	    
	    this.c = ac * ba + ad * bc;
	    this.d = ac * bb + ad * bd;
	    
	    this.x = ax * ba + ay * bc + bx;
	    this.y = ax * bb + ay * bd + by;
	    
            return this;
	};
	
	
	Affine.prototype.mul = function( other ){
            
            return this.mmul( this, other );
        };
	
	
	Affine.prototype.smul = function( s ){
	    
	    this.a *= s;
            this.b *= s;
	    this.c *= s;
            this.d *= s;
	    this.x *= s;
            this.y *= s;
	    
	    return this;
        };
        
        
        Affine.prototype.sdiv = function( s ){
	    
	    s = s !== 0 ? 1 / s : 1;
	    
	    this.a *= s;
            this.b *= s;
	    this.c *= s;
            this.d *= s;
	    this.x *= s;
            this.y *= s;
            
            return this;
        };
	
	
	Affine.prototype.transpose = function(){
            var tmp = this.c; this.c = this.b; this.b = tmp;
	    
	    return this;
        };
	
	
	Affine.prototype.minv = function( other ){
	    var a = other.a, b = other.b,
		c = other.c, d = other.d,
		x = other.x, y = other.y,
		det;
            
	    this.a = d;
	    this.b = -b;
	    this.c = -c;
	    this.d = a;
	    
	    this.x = c * y - d * x;
	    this.y = -( a * y - b * x );
	    
	    this.smul( a * d - b * c );
	    
            return this;
	};
	
	
	Affine.prototype.inv = function(){
	    
            return this.getInverse( this );
	};
	
	
	Affine.prototype.alerp = function( a, b, t ){
	    var aa = a.a, ab = a.b,
		ac = a.c, ad = a.d,
		ax = a.x, ay = a.y,
		
		ba = b.a, bb = b.b,
		bc = b.c, bd = b.d,
		bx = b.x, by = b.y;
		
	    this.a = lerp( aa, ba, t );
	    this.b = lerp( ab, bb, t );
	    this.c = lerp( ac, bc, t );
	    this.d = lerp( ad, bd, t );
	    this.x = lerp( ax, bx, t );
	    this.y = lerp( ay, by, t );
	    
	    return this;
        };
	
	
	Affine.prototype.lerp = function( other, t ){
	    
	    this.a = lerp( this.a, other.a, t );
	    this.b = lerp( this.b, other.b, t );
	    this.c = lerp( this.c, other.c, t );
	    this.d = lerp( this.d, other.d, t );
	    this.x = lerp( this.x, other.x, t );
	    this.y = lerp( this.y, other.y, t );
	    
	    return this;
        };
	
	
	Affine.prototype.abs = function(){
	    
	    this.a = abs( this.a );
            this.b = abs( this.b );
	    this.c = abs( this.c );
            this.d = abs( this.d );
	    this.x = abs( this.x );
            this.y = abs( this.y );
	    
	    return this;
        };
	
	
	Affine.prototype.setTranslation = function( v ){
	    
	    this.x = v.x;
	    this.y = v.y;
	    
	    return this;
        };
	
	
	Affine.prototype.setRotation = function( angle ){
	    var s = sin( angle ), c = cos( angle );
	    
	    this.a = c;
	    this.b = s;
	    this.c = -s;
	    this.d = c;
	    
	    return this;
        };
	
	
	Affine.prototype.getTranslation = function( v ){
	    
	    v.x = this.x;
	    v.y = this.y;
	    
	    return v;
        };
	
	
	Affine.prototype.getRotation = function(){
	    var a = this.a, b = this.b,
		c = this.c, d = this.d,
		
		x = a * a + c * c,
		y = b * b + d * d,
		
		sx = x === 0 ? 1 : 1 / sqrt( x ),
		sy = y === 0 ? 1 : 1 / sqrt( y );
		
	    return atan2( b * sy, a * sx );
        };
	
	
	Affine.prototype.extractPosition = function( other ){
	    
	    this.x = other.x;
	    this.y = other.y;
	    
	    return this;
        };
	
	
	Affine.prototype.extractRotation = function( other ){
	    var a = other.a, b = other.b,
		c = other.c, d = other.d,
		
		x = a * a + c * c,
		y = b * b + d * d,
		
		sx = x !== 0 ? 1 / sqrt( x ) : 0,
		sy = y !== 0 ? 1 / sqrt( y ) : 0;
		
	    this.a = a * sx;
	    this.c = c * sx;
	    
	    this.b = b * sy;
	    this.d = d * sy;
	    
	    return this;
	};
	
	
	Affine.prototype.lookAt = function( eye, target ){
	    var x = target.x - eye.x,
		y = target.y - eye.y,
		a = atan2( y, x ) - HALF_PI,
		c = cos( a ), s = sin( a );
	    
	    this.a = c;
	    this.b = s;
	    this.c = -s;
	    this.d = c;
	    
	    return this;
	};
	
	
	Affine.prototype.translate = function( v ){
	    var x = v.x, y = v.y;
	    
	    this.x = this.a * x + this.b * y + this.x;
	    this.y = this.c * x + this.d * y + this.y;
	    
	    return this;
        };
	
	
	Affine.prototype.scale = function( v ){
	    var x = v.x, y = v.y;
	    
	    this.a *= x; this.b *= y;
	    this.c *= x; this.d *= y;
	    this.x *= x; this.y *= y;
	    
	    return this;
        };
	
	
	Affine.prototype.rotate = function( angle ){
	    var s = sin( angle ), c = sin( angle ),
		ta = this.a, tb = this.b,
		tc = this.c, td = this.d,
		tx = this.x, ty = this.y;
	    
	    this.a = ta * c - tb * s;
	    this.b = ta * s + tb * c;
	    this.c = tc * c - td * s;
	    this.d = tc * s + td * c;
	    
	    this.x = tx * c - ty * s;
	    this.y = ty * s + ty * c;
	    
	    return this;
        };
	
	
	Affine.prototype.skew = function( v ){
	    var x = v.x, y = v.y;
	    
	    this.b += y;
	    this.c += x;
	    
	    return this;
        };
	
	
	Affine.prototype.orthographic = function( left, right, top, bottom ){
	    var w = 1 / ( right - left ),
		h = 1 / ( top - bottom ),
		x = -( right + left ) * w,
		y = -( top + bottom ) * h;
	    
	    this.a = 2 * w;
	    this.b = 0;
	    this.c = 0;
	    this.d = 2 * -h;
	    
	    this.x = x;
	    this.y = y;
            
            return this;
        };
	
	
	Affine.prototype.toString = function(){
	    
            return (
		"Affine["+ this.a +", "+ this.b +"]\n" +
		"       ["+ this.c +", "+ this.d +"]\n" +
		"       ["+ this.x +", "+ this.y +"]"
	    );
	};
        
        
        Affine.prototype.equals = function( other ){
            
            return !(
		!equals( this.a, other.a ) ||
		!equals( this.b, other.b ) ||
		!equals( this.c, other.c ) ||
		!equals( this.d, other.d ) ||
		!equals( this.x, other.x ) ||
		!equals( this.y, other.y )
	    );
        };
	
        
	Affine.equals = function( a, b ){
	    
            return !(
		!equals( a.a, b.a ) ||
		!equals( a.b, b.b ) ||
		!equals( a.c, b.c ) ||
		!equals( a.d, b.d ) ||
		!equals( a.x, b.x ) ||
		!equals( a.y, b.y )
	    );
        };
	
        
	Affine._mat4 = new Float32Array([
	    1, 0, 0, 0,
	    0, 1, 0, 0,
	    0, 0, 1, 0,
	    0, 0, 0, 1
	]);
	
        
        return Affine;
    }
);