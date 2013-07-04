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
	
	
	function Vec2( x, y ){
	    this.x = x || 0;
	    this.y = y || 0;
	}
        
        
        Vec2.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Vec2.prototype.clone = function(){
            
            return new Vec2( this.x, this.y );
        };
        
        
        Vec2.prototype.copy = function( other ){
            
            this.x = other.x;
            this.y = other.y;
            
            return this;
        };
        
        
        Vec2.prototype.set = function( x, y ){
            
            this.x = x;
            this.y = y;
            
            return this;
        };
        
        
        Vec2.prototype.vadd = function( a, b ){
            
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            
            return this;
        };
        
        
        Vec2.prototype.add = function( other ){
            
            this.x += other.x;
	    this.y += other.y;
            
            return this;
        };
        
        
        Vec2.prototype.sadd = function( s ){
            
            this.x += s;
            this.y += s;
            
            return this;
        };
        
        
        Vec2.prototype.vsub = function( a, b ){
            
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            
            return this;
        };
        
        
        Vec2.prototype.sub = function( other ){
            
            this.x -= other.x;
	    this.y -= other.y;
            
            return this;
        };
        
        
        Vec2.prototype.ssub = function( s ){
            
            this.x -= s;
            this.y -= s;
            
            return this;
        };
        
        
        Vec2.prototype.vmul = function( a, b ){
            
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            
            return this;
        };
        
        
        Vec2.prototype.mul = function( other ){
            
            this.x *= other.x;
	    this.y *= other.y;
            
            return this;
        };
        
        
        Vec2.prototype.smul = function( s ){
            
            this.x *= s;
            this.y *= s;
            
            return this;
        };
        
        
        Vec2.prototype.vdiv = function( a, b ){
            var x = b.x, y = b.y;
            
	    this.x = x !== 0 ? a.x / x : 0;
	    this.y = y !== 0 ? a.y / y : 0;
            
            return this;
        };
        
        
        Vec2.prototype.div = function( other ){
            var x = other.x, y = other.y;
            
	    this.x = x !== 0 ? this.x / x : 0;
	    this.y = y !== 0 ? this.y / y : 0;
            
            return this;
        };
        
        
        Vec2.prototype.sdiv = function( s ){
	    s = s !== 0 ? 1 / s : 0;
	    
	    this.x *= s;
	    this.y *= s;
            
            return this;
        };
        
        
        Vec2.vdot = Vec2.prototype.vdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y;
        };
        
        
        Vec2.prototype.dot = function( other ){
            
	    return this.x * other.x + this.y * other.y;
        };
        
        
        Vec2.prototype.vlerp = function( a, b, t ){
            
            this.x = lerp( a.x, b.x, t );
            this.y = lerp( a.y, b.y, t );
            
            return this;
        };
        
        
        Vec2.prototype.lerp = function( other, t ){
            
            this.x = lerp( this.x, other.x, t );
            this.y = lerp( this.y, other.y, t );
            
            return this;
        };
        
        
        Vec2.prototype.vslerp = function(){
	    var start = new Vec2(),
		end = new Vec2(),
		vec = new Vec2(),
		relative = new Vec2();
	    
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
        
        
        Vec2.prototype.slerp = function(){
	    var start = new Vec2(),
		end = new Vec2(),
		vec = new Vec2(),
		relative = new Vec2();
	    
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
        
        
        Vec2.vcross = Vec2.prototype.vcross = function( a, b ){
	    
            return a.x * b.y - a.y * b.x;
        };
        
        
        Vec2.prototype.cross = function( other ){
	    
	    return this.x * other.y - this.y * other.x;
        };
	
	
	Vec2.prototype.vproj = function( a, b ){
	    var ax = a.x, ay = a.y,
		bx = b.x, by = b.y,
		
		d = ax * bx + ay * by,
		l = bx * bx + by * by;
		
	    l = l !== 0 ? 1 / l : 0;
	    
	    this.x = d * l * bx;
	    this.y = d * l * by;
	    
	    return this;
        };
	
	
	Vec2.prototype.proj = function( other ){
	    var ax = this.x, ay = this.y,
		bx = other.x, by = other.y,
		
		d = ax * bx + ay * by,
		l = bx * bx + by * by;
		
	    l = l !== 0 ? 1 / l : 0;
	    
	    this.x = d * l * bx;
	    this.y = d * l * by;
	    
	    return this;
        };
	
	
	Vec2.prototype.vprojN = function( a, b ){
	    var bx = b.x, by = b.y,
		d = a.x * bx + a.y * by;
	    
	    this.x = d * bx;
	    this.y = d * by;
	    
	    return this;
        };
	
	
	Vec2.prototype.projN = function( other ){
	    var bx = other.x, by = other.y,
		d = this.x * bx + this.y * by;
	    
	    this.x = d * bx;
	    this.y = d * by;
	    
	    return this;
        };
	
	
	Vec2.prototype.vreflect = function( a, b ){
	    var bx = b.x, by = b.y,
		d = a.x * bx + a.y * by;
	    
	    this.x = d * bx * 2 - 2;
	    this.y = d * by * 2 - 2;
	    
	    return this;
        };
	
	
	Vec2.prototype.reflect = function( other ){
	    var bx = other.x, by = other.y,
		d = this.x * bx + this.y * by;
	    
	    this.x = d * bx * 2 - 2;
	    this.y = d * by * 2 - 2;
	    
	    return this;
        };
	
	
	Vec2.prototype.vreflectN = function( a, b ){
	    var bx = b.x, by = b.y,
		d = a.x * bx + a.y * by,
		l = bx * bx + by * by;
	    
	    l = l !== 0 ? 1 / l : 0;
	    
	    this.x = d * l * bx * 2 - 2;
	    this.y = d * l * by * 2 - 2;
	    
	    return this;
        };
	
	
	Vec2.prototype.reflectN = function( other ){
	    var bx = other.x, by = other.y,
		d = this.x * bx + this.y * by,
		l = bx * bx + by * by;
	    
	    l = l !== 0 ? 1 / l : 0;
	    
	    this.x = d * l * bx * 2 - 2;
	    this.y = d * l * by * 2 - 2;
	    
	    return this;
        };
        
        
        Vec2.prototype.applyMat2 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[2];
            this.y = x * me[1] + y * me[3];
            
            return this;
        };
        
        
        Vec2.prototype.applyMat32 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[2] + me[4];
            this.y = x * me[1] + y * me[3] + me[5];
            
            return this;
        };
        
        
        Vec2.prototype.applyMat3 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[3] + me[6];
            this.y = x * me[1] + y * me[4] + me[7];
            
            return this;
        };
        
        
        Vec2.prototype.applyMat4 = function( m ){
            var me = m.elements,
		x = this.x, y = this.y;
            
            this.x = x * me[0] + y * me[4] + me[8] + me[12];
            this.y = x * me[1] + y * me[5] + me[9] + me[13];
            
            return this;
        };
        
        
        Vec2.prototype.applyProj = function( m ){
            var me = m.elements,
		x = this.x, y = this.y,
                d = 1 / ( x * me[3] + y * me[7] + me[11] + me[15] );
	    
            this.x = ( me[0] * x + me[4] * y + me[8] + me[12] ) * d;
            this.y = ( me[1] * x + me[5] * y + me[9] + me[13] ) * d;
            
            return this;
        };
        
        
        Vec2.prototype.applyQuat = function( q ){
            var x = this.x, y = this.y,
		
		qx = q.x, qy = q.y, qz = q.z, qw = q.w,
		
		ix =  qw * x + qy - qz * y,
		iy =  qw * y + qz * x - qx,
		iz =  qw + qx * y - qy * x,
		iw = -qx * x - qy * y - qz;
	    
	    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    
	    return this;
        };
        
        
        Vec2.prototype.getPositionMat32 = function( m ){
            var me = m.elements
	    
            this.x = me[4];
            this.y = me[5];
            
            return this;
        };
        
        
        Vec2.prototype.getPositionMat4 = function( m ){
            var me = m.elements;
	    
            this.x = me[12];
            this.y = me[13];
            
            return this;
        };
        
        
        Vec2.prototype.getScaleMat32 = function( m ){
            var me = m.elements,
		sx = this.set( m[0], m[1] ).len(),
                sy = this.set( m[2], m[3] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        
        Vec2.prototype.getScaleMat3 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1], me[2] ).len(),
                sy = this.set( me[3], me[4], me[5] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        
        Vec2.prototype.getScaleMat4 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1], me[2] ).len(),
                sy = this.set( me[4], me[5], me[6] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        
        Vec2.prototype.lenSq = function(){
            var x = this.x, y = this.y;
	    
            return x * x + y * y;
        };
        
        
        Vec2.prototype.len = function(){
	    var x = this.x, y = this.y;
	    
            return sqrt( x * x + y * y );
        };
        
        
        Vec2.prototype.norm = function(){
            var x = this.x, y = this.y,
		l = x * x + y * y;
	    
	    l = l !== 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l;
	    this.y *= l;
	    
            return this;
        };
        
        
        Vec2.prototype.negate = function(){
            
	    this.x = -this.x;
	    this.y = -this.y;
	    
            return this;
        };
        
        
        Vec2.prototype.perpL = function(){
            var x = this.x, y = this.y;
	    
	    this.x = -y;
	    this.y = x;
	    
            return this;
        };
        
        
        Vec2.prototype.perpR = function(){
            var x = this.x, y = this.y;
	    
	    this.x = y;
	    this.y = -x;
	    
            return this;
        };
        
        
        Vec2.prototype.abs = function(){
	    
	    this.x = abs( this.x );
	    this.y = abs( this.y );
            
            return this;
        };
        
        
        Vec2.prototype.rotate = function( a ){
            var x = this.x, y = this.y,
		c = cos( a ), s = sin( a );
	    
	    this.x = x * c - y * s;
	    this.y = x * s + y * c;
	    
            return this;
        };
        
        
        Vec2.prototype.rotateAround = function( a, v ){
	    
	    return this.sub( v ).rotate( a ).add( v );
	};
        
        
        Vec2.prototype.min = function( other ){
            var x = other.x, y = other.y;
            
	    this.x = x < this.x ? x : this.x;
	    this.y = y < this.y ? y : this.y;
            
            return this;
        };
        
        
        Vec2.prototype.max = function( other ){
            var x = other.x, y = other.y;
            
	    this.x = x > this.x ? x : this.x;
	    this.y = y > this.y ? y : this.y;
            
            return this;
        };
	
        
        Vec2.prototype.clamp = function( min, max ){
            
            this.x = clamp( this.x, min.x, max.x );
            this.y = clamp( this.y, min.y, max.y );
            
            return this;
        };
        
        
        Vec2.distSq = Vec2.prototype.distSq = function( a, b ){
	    var x = b.x - a.x,
		y = b.y - a.y;
	    
	    return x * x + y * y;
	};
        
        
        Vec2.dist = Vec2.prototype.dist = function( a, b ){
            var x = b.x - a.x,
		y = b.y - a.y,
		d = x * x + y * y;
	    
	    return d !== 0 ? sqrt( d ) : 0;
        };
        
        
        Vec2.prototype.toString = function(){
            
            return "Vec2( "+ this.x +", "+ this.y +" )";
        };
	
        
        Vec2.prototype.equals = function( other, e ){
            
            return !(
                !equals( this.x, other.x, e ) ||
                !equals( this.y, other.y, e )
            );
        };
        
        
        Vec2.equals = function( a, b, e ){
	    
            return !(
                !equals( a.x, b.x, e ) ||
                !equals( a.y, b.y, e )
            );
        };
	
	
	return Vec2;
    }
);