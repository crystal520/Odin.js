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
	
	
	function Vec3( x, y, z ){
	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;
	}
        
        
        Vec3.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Vec3.prototype.clone = function(){
            
            return new Vec3( this.x, this.y, this.z );
        };
        
        
        Vec3.prototype.copy = function( other ){
            
            this.x = other.x;
            this.y = other.y;
	    this.z = other.z;
            
            return this;
        };
        
        
        Vec3.prototype.set = function( x, y, z ){
            
            this.x = x;
            this.y = y;
	    this.z = z;
            
            return this;
        };
        
        
        Vec3.prototype.vadd = function( a, b ){
            
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            
            return this;
        };
        
        
        Vec3.prototype.add = function( other ){
            
            this.x += other.x;
	    this.y += other.y;
	    this.z += other.z;
            
            return this;
        };
        
        
        Vec3.prototype.sadd = function( s ){
            
            this.x += s;
            this.y += s;
            this.z += s;
            
            return this;
        };
        
        
        Vec3.prototype.vsub = function( a, b ){
            
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            
            return this;
        };
        
        
        Vec3.prototype.sub = function( other ){
            
            this.x -= other.x;
	    this.y -= other.y;
	    this.z -= other.z;
            
            return this;
        };
        
        
        Vec3.prototype.ssub = function( s ){
            
            this.x -= s;
            this.y -= s;
            this.z -= s;
            
            return this;
        };
        
        
        Vec3.prototype.vmul = function( a, b ){
            
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            
            return this;
        };
        
        
        Vec3.prototype.mul = function( other ){
            
            this.x *= other.x;
	    this.y *= other.y;
	    this.z *= other.z;
            
            return this;
        };
        
        
        Vec3.prototype.smul = function( s ){
            
            this.x *= s;
            this.y *= s;
	    this.z *= s;
            
            return this;
        };
        
        
        Vec3.prototype.vdiv = function( a, b ){
            var x = b.x, y = b.y, z = b.z;
            
	    this.x = x !== 0 ? a.x / x : 0;
	    this.y = y !== 0 ? a.y / y : 0;
	    this.z = z !== 0 ? a.z / z : 0;
            
            return this;
        };
        
        
        Vec3.prototype.div = function( other ){
            var x = other.x, y = other.y, z = other.z;
            
	    this.x = x !== 0 ? this.x / x : 0;
	    this.y = y !== 0 ? this.y / y : 0;
	    this.z = z !== 0 ? this.z / z : 0;
            
            return this;
        };
        
        
        Vec3.prototype.sdiv = function( s ){
	    s = s !== 0 ? 1 / s : 0;
	    
	    this.x *= s;
	    this.y *= s;
	    this.z *= s;
            
            return this;
        };
        
        
        Vec3.vdot = Vec3.prototype.vdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        
        
        Vec3.prototype.dot = function( other ){
            
	    return this.x * other.x + this.y * other.y + this.z * other.z;
        };
        
        
        Vec3.prototype.vlerp = function( a, b, t ){
            
            this.x = lerp( a.x, b.x, t );
            this.y = lerp( a.y, b.y, t );
            this.z = lerp( a.z, b.z, t );
            
            return this;
        };
        
        
        Vec3.prototype.lerp = function( other, t ){
            
            this.x = lerp( this.x, other.x, t );
            this.y = lerp( this.y, other.y, t );
            this.z = lerp( this.z, other.z, t );
            
            return this;
        };
        
        
        Vec3.prototype.vslerp = function(){
	    var start = new Vec3(),
		end = new Vec3(),
		vec = new Vec3(),
		relative = new Vec3();
	    
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
        
        
        Vec3.prototype.slerp = function(){
	    var start = new Vec3(),
		end = new Vec3(),
		vec = new Vec3(),
		relative = new Vec3();
	    
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
        
        
        Vec3.vcross = Vec3.prototype.vcross = function( a, b ){
	    var ax = a.x, ay = a.y, az = a.z,
                bx = b.x, by = b.y, bz = b.z;
            
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            
            return this;
        };
        
        
        Vec3.prototype.cross = function( other ){
	    var ax = this.x, ay = this.y, az = this.z,
                bx = other.x, by = other.y, bz = other.z;
            
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            
            return this;
        };
	
	
	Vec3.prototype.vproj = function( a, b ){
	    var dp = a.dot( b ),
		l = b.dot( b );
		
	    l = l !== 0 ? 1 / l : 0;
	    
	    this.x = dp * l * b.x;
	    this.y = dp * l * b.y;
	    this.z = dp * l * b.z;
	    
	    return this;
        };
	
	
	Vec3.prototype.proj = function( other ){
	    var dp = this.dot( other ),
		l = other.dot( other );
		
	    l = l !== 0 ? 1 / l : 0;
	    
	    this.x = dp * l * other.x;
	    this.y = dp * l * other.y;
	    this.z = dp * l * other.z;
	    
	    return this;
        };
	
	
	Vec3.prototype.vprojN = function( a, b ){
	    var dp = a.dot( b );
	    
	    this.x = dp * b.x;
	    this.y = dp * b.y;
	    this.z = dp * b.z;
	    
	    return this;
        };
	
	
	Vec3.prototype.projN = function( other ){
	    var dp = this.dot( other );
	    
	    this.x = dp * other.x;
	    this.y = dp * other.y;
	    this.z = dp * other.z;
	    
	    return this;
        };
        
        
        Vec3.prototype.applyMat3 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[3] + z * me[6];
            this.y = x * me[1] + y * me[4] + z * me[7];
            this.z = x * me[2] + y * me[5] + z * me[8];
            
            return this;
        };
        
        
        Vec3.prototype.applyMat4 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[4] + z * me[8] + me[12];
            this.y = x * me[1] + y * me[5] + z * me[9] + me[13];
            this.z = x * me[2] + y * me[6] + z * me[10] + me[14];
            
            return this;
        };
        
        
        Vec3.prototype.applyProj = function( m ){
            var me = m.elements,
		x = this.x, y = this.y, z = this.z,
                d = 1 / ( x * me[3] + y * me[7] + z * me[11] + me[15] );
	    
            this.x = ( me[0] * x + me[4] * y + me[8] + z * me[12] ) * d;
            this.y = ( me[1] * x + me[5] * y + me[9] + z * me[13] ) * d;
            this.z = ( me[2] * x + me[6] * y + me[10] + z * me[14] ) * d;
            
            return this;
        };
        
        
        Vec3.prototype.applyQuat = function( q ){
            var x = this.x, y = this.y, z = this.z,
		qx = q.x, qy = q.y, qz = q.z, qw = q.w,
		
		ix =  qw * x + qy * z - qz * y,
		iy =  qw * y + qz * x - qx * z,
		iz =  qw * z + qx * y - qy * x,
		iw = -qx * x - qy * y - qz * z;
		
	    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    
	    return this;
        };
        
        
        Vec3.prototype.getPositionMat4 = function( m ){
            var me = m.elements;
	    
            this.x = me[12];
            this.y = me[13];
            
            return this;
        };
        
        
        Vec3.prototype.getScaleMat3 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1], me[2] ).len(),
                sy = this.set( me[3], me[4], me[5] ).len(),
                sz = this.set( me[6], me[7], me[8] ).len();
            
            this.x = sx;
            this.y = sy;
            this.y = sz;
            
            return this;
        };
        
        
        Vec3.prototype.getScaleMat4 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1], me[2] ).len(),
                sy = this.set( me[4], me[5], me[6] ).len(),
                sz = this.set( me[8], me[9], me[10] ).len();
            
            this.x = sx;
            this.y = sy;
            this.z = sz;
            
            return this;
        };
        
        
        Vec3.prototype.lenSq = function(){
            var x = this.x, y = this.y, z = this.z;
	    
            return x * x + y * y + z * z;
        };
        
        
        Vec3.prototype.len = function(){
            var x = this.x, y = this.y, z = this.z;
	    
            return sqrt( x * x + y * y + z * z );
        };
        
        
        Vec3.prototype.norm = function(){
            var x = this.x, y = this.y, z = this.z,
		l = x * x + y * y + z * z;
	    
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l;
	    this.y *= l;
	    this.z *= l;
	    
            return this;
        };
        
        
        Vec3.prototype.negate = function(){
            
	    this.x = -this.x;
	    this.y = -this.y;
	    this.z = -this.z;
	    
            return this;
        };
	
        
        Vec3.prototype.abs = function(){
	    
	    this.x = abs( this.x );
	    this.y = abs( this.y );
	    this.z = abs( this.z );
            
            return this;
        };
        
        
        Vec3.prototype.min = function( other ){
            var x = other.x, y = other.y, z = other.z;
            
	    this.x = x < this.x ? x : this.x;
	    this.y = y < this.y ? y : this.y;
	    this.z = z < this.z ? z : this.z;
            
            return this;
        };
        
        
        Vec3.prototype.max = function( other ){
            var x = other.x, y = other.y, z = other.z;
            
	    this.x = x > this.x ? x : this.x;
	    this.y = y > this.y ? y : this.y;
	    this.z = z > this.z ? z : this.z;
            
            return this;
        };
	
        
        Vec3.prototype.clamp = function( min, max ){
            
            this.x = clamp( this.x, min.x, max.x );
            this.y = clamp( this.y, min.y, max.y );
            this.z = clamp( this.z, min.z, max.z );
            
            return this;
        };
        
        
        Vec3.distSq = Vec3.prototype.distSq = function( a, b ){
	    var x = b.x - a.x,
		y = b.y - a.y,
		z = b.z - a.z;
	    
	    return x * x + y * y + z * z;
	};
        
        
        Vec3.dist = Vec3.prototype.dist = function( a, b ){
            var x = b.x - a.x,
		y = b.y - a.y,
		z = b.z - a.z,
		d = x * x + y * y + z * z;
	    
	    return d !== 0 ? sqrt( d ) : 0;
        };
        
        
        Vec3.prototype.toString = function(){
            
            return "Vec3( "+ this.x +", "+ this.y +", "+ this.z +" )";
        };
	
        
        Vec3.prototype.equals = function( other, e ){
            
            return !(
                !equals( this.x, other.x, e ) ||
                !equals( this.y, other.y, e ) ||
                !equals( this.z, other.z, e )
            );
        };
        
        
        Vec3.equals = function( a, b, e ){
	    
            return !(
                !equals( a.x, b.x, e ) ||
                !equals( a.y, b.y, e ) ||
                !equals( a.z, b.z, e )
            );
        };
	
	
	return Vec3;
    }
);