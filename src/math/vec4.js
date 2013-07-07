if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf"
    ],
    function( Mathf ){
	"use strict";
	
	
	var abs = Math.abs,
	    sqrt = Math.sqrt,
	    acos = Math.acos,
	    sin = Math.sin,
	    cos = Math.cos,
	    lerp = Mathf.lerp,
	    clamp = Mathf.clamp,
	    equals= Mathf.equals;
	
	
	function Vec4( x, y, z, w ){
	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;
            this.w = w !== undefined ? w : 1;
	}
        
        
        Vec4.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Vec4.prototype.clone = function(){
            
            return new Vec4( this.x, this.y, this.z, this.w );
        };
        
        
        Vec4.prototype.copy = function( other ){
            
            this.x = other.x;
            this.y = other.y;
	    this.z = other.z;
	    this.w = other.w;
            
            return this;
        };
        
        
        Vec4.prototype.set = function( x, y, z, w ){
            
            this.x = x;
            this.y = y;
	    this.z = z;
	    this.w = w;
            
            return this;
        };
        
        
        Vec4.prototype.vadd = function( a, b ){
            
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            
            return this;
        };
        
        
        Vec4.prototype.add = function( other ){
            
            this.x += other.x;
	    this.y += other.y;
	    this.z += other.z;
	    this.w += other.w;
            
            return this;
        };
        
        
        Vec4.prototype.sadd = function( s ){
            
            this.x += s;
            this.y += s;
            this.z += s;
            this.w += s;
            
            return this;
        };
        
        
        Vec4.prototype.vsub = function( a, b ){
            
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            
            return this;
        };
        
        
        Vec4.prototype.sub = function( other ){
            
            this.x -= other.x;
	    this.y -= other.y;
	    this.z -= other.z;
	    this.w -= other.w;
            
            return this;
        };
        
        
        Vec4.prototype.ssub = function( s ){
            
            this.x -= s;
            this.y -= s;
            this.z -= s;
            this.w -= s;
            
            return this;
        };
        
        
        Vec4.prototype.vmul = function( a, b ){
            
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            this.w = a.w * b.w;
            
            return this;
        };
        
        
        Vec4.prototype.mul = function( other ){
            
            this.x *= other.x;
	    this.y *= other.y;
	    this.z *= other.z;
	    this.w *= other.w;
            
            return this;
        };
        
        
        Vec4.prototype.smul = function( s ){
            
            this.x *= s;
            this.y *= s;
	    this.z *= s;
	    this.w *= s;
            
            return this;
        };
        
        
        Vec4.prototype.vdiv = function( a, b ){
            var x = b.x, y = b.y, z = b.z, w = b.w;
            
	    this.x = x !== 0 ? a.x / x : 0;
	    this.y = y !== 0 ? a.y / y : 0;
	    this.z = z !== 0 ? a.z / z : 0;
	    this.w = w !== 0 ? a.w / w : 0;
            
            return this;
        };
        
        
        Vec4.prototype.div = function( other ){
            var x = other.x, y = other.y, z = other.z, w = other.w;
            
	    this.x = x !== 0 ? this.x / x : 0;
	    this.y = y !== 0 ? this.y / y : 0;
	    this.z = z !== 0 ? this.z / z : 0;
	    this.w = w !== 0 ? this.w / w : 0;
            
            return this;
        };
        
        
        Vec4.prototype.sdiv = function( s ){
	    s = s !== 0 ? 1 / s : 0;
	    
	    this.x *= s;
	    this.y *= s;
	    this.z *= s;
	    this.w *= s;
            
            return this;
        };
        
        
        Vec4.vdot = Vec4.prototype.vdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        };
        
        
        Vec4.prototype.dot = function( other ){
            
	    return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
        };
        
        
        Vec4.prototype.vlerp = function( a, b, t ){
            
            this.x = lerp( a.x, b.x, t );
            this.y = lerp( a.y, b.y, t );
            this.z = lerp( a.z, b.z, t );
            this.w = lerp( a.w, b.w, t );
            
            return this;
        };
        
        
        Vec4.prototype.lerp = function( other, t ){
            
            this.x = lerp( this.x, other.x, t );
            this.y = lerp( this.y, other.y, t );
            this.z = lerp( this.z, other.z, t );
            this.w = lerp( this.w, other.w, t );
            
            return this;
        };
        
        
        Vec4.prototype.vslerp = function(){
	    var start = new Vec4(),
		end = new Vec4(),
		vec = new Vec4(),
		relative = new Vec4();
	    
	    return function( a, b, t ){
		var dot = clamp( a.dot( b ), -1, 1 ),
		    theta = acos( dot ) * t;
		
		start.copy( a );
		end.copy( b );
		
		vec.copy( start );
		relative.vsub( end, vec.smul( dot ) );
		
		relative.norm();
		
		return this.vadd(
		    start.smul( cos( theta ) ),
		    relative.smul( sin( theta ) )
		);
	    };
	}();
        
        
        Vec4.prototype.slerp = function(){
	    var start = new Vec4(),
		end = new Vec4(),
		vec = new Vec4(),
		relative = new Vec4();
	    
	    return function( other, t ){
		var dot = clamp( this.dot( other ), -1, 1 ),
		    theta = acos( dot ) * t;
		
		start.copy( this );
		end.copy( other );
		
		vec.copy( start );
		relative.vsub( end, vec.smul( dot ) );
		
		relative.norm();
		
		return this.vadd(
		    start.smul( cos( theta ) ),
		    relative.smul( sin( theta ) )
		);
	    };
	}();
        
        
        Vec4.prototype.applyMat4 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y, z = this.z, w = this.w;
            
            this.x = x * me[0] + y * me[4] + z * me[8] + w * me[12];
            this.y = x * me[1] + y * me[5] + z * me[9] +w *  me[13];
            this.z = x * me[2] + y * me[6] + z * me[10] + w * me[14];
            this.w = x * me[3] + y * me[7] + z * me[11] + w * me[15];
            
            return this;
        };
        
        
        Vec4.prototype.applyProj = function( m ){
            var me = m.elements,
		x = this.x, y = this.y, z = this.z, w = this.w
                d = 1 / ( x * me[3] + y * me[7] + z * me[11] + w * me[15] );
	    
            this.x = ( me[0] * x + me[4] * y + me[8] + z * me[12] ) * d;
            this.y = ( me[1] * x + me[5] * y + me[9] + z * me[13] ) * d;
            this.z = ( me[2] * x + me[6] * y + me[10] + z * me[14] ) * d;
            this.z = ( me[3] * x + me[7] * y + me[11] + z * me[15] ) * d;
            
            return this;
        };
        
        
        Vec4.prototype.lenSq = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w;
	    
            return x * x + y * y + z * z + w * w;
        };
        
        
        Vec4.prototype.len = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w,
		l = x * x + y * y + z * z + w * w;
	    
            return sqrt( x * x + y * y + z * z + w * w );
        };
        
        
        Vec4.prototype.norm = function(){
            var x = this.x, y = this.y, z = this.z, w = this.w,
		l = x * x + y * y + z * z + w * w;
	    
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l;
	    this.y *= l;
	    this.z *= l;
	    
            return this;
        };
        
        
        Vec4.prototype.negate = function(){
            
	    this.x = -this.x;
	    this.y = -this.y;
	    this.z = -this.z;
	    this.w = -this.w;
	    
            return this;
        };
	
        
        Vec4.prototype.abs = function(){
	    
	    this.x = abs( this.x );
	    this.y = abs( this.y );
	    this.z = abs( this.z );
	    this.w = abs( this.w );
            
            return this;
        };
        
        
        Vec4.prototype.min = function( other ){
            var x = other.x, y = other.y, z = other.z, w = other.w;
            
	    this.x = x < this.x ? x : this.x;
	    this.y = y < this.y ? y : this.y;
	    this.z = z < this.z ? z : this.z;
	    this.w = w < this.w ? w : this.w;
            
            return this;
        };
        
        
        Vec4.prototype.max = function( other ){
            var x = other.x, y = other.y, z = other.z, w = other.w;
            
	    this.x = x > this.x ? x : this.x;
	    this.y = y > this.y ? y : this.y;
	    this.z = z > this.z ? z : this.z;
	    this.w = w > this.w ? w : this.w;
            
            return this;
        };
	
        
        Vec4.prototype.clamp = function( min, max ){
            
            this.x = clamp( this.x, min.x, max.x );
            this.y = clamp( this.y, min.y, max.y );
            this.z = clamp( this.z, min.z, max.z );
            this.w = clamp( this.w, min.w, max.w );
            
            return this;
        };
        
        
        Vec4.distSq = Vec4.prototype.distSq = function( a, b ){
	    var x = b.x - a.x,
		y = b.y - a.y,
		z = b.z - a.z,
		w = b.w - a.w;
	    
	    return x * x + y * y + z * z + w * w;
	};
        
        
        Vec4.dist = Vec4.prototype.dist = function( a, b ){
            var x = b.x - a.x,
		y = b.y - a.y,
		z = b.z - a.z,
		w = b.w - a.w,
		d = x * x + y * y + z * z + w * w;
	    
	    return d !== 0 ? sqrt( d ) : 0;
        };
        
        
        Vec4.prototype.toString = function(){
            
            return "Vec4( "+ this.x +", "+ this.y +", "+ this.z +", "+ this.w +" )";
        };
	
        
        Vec4.prototype.equals = function( other, e ){
            
            return !(
                !equals( this.x, other.x, e ) ||
                !equals( this.y, other.y, e ) ||
                !equals( this.z, other.z, e ) ||
                !equals( this.w, other.w, e )
            );
        };
        
        
        Vec4.equals = function( a, b, e ){
	    
            return !(
                !equals( a.x, b.x, e ) ||
                !equals( a.y, b.y, e ) ||
                !equals( a.z, b.z, e ) ||
                !equals( a.w, b.w, e )
            );
        };
	
	
	return Vec4;
    }
);