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
            
            return this.vadd( this, other );
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
            
            return this.vsub( this, other );
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
            
            return this.vmul( this, other );
        };
        
        
        Vec2.prototype.smul = function( s ){
            
            this.x *= s;
            this.y *= s;
            
            return this;
        };
        
        
        Vec2.prototype.vdiv = function( a, b ){
            var x = b.x, y = b.y;
            
            if( x !== 0 && y !== 0 ){
                this.x = a.x / x;
                this.y = a.y / y;
            }
            else{
                this.x = 0;
                this.y = 0;
            }
            
            return this;
        };
        
        
        Vec2.prototype.div = function( other ){
            
            return this.vdiv( this, other );
        };
        
        
        Vec2.prototype.sdiv = function( s ){
            
            if( s !== 0 ){
		s = 1 / s;
		
                this.x *= s;
                this.y *= s;
            }
            else{
                this.x = 0;
                this.y = 0;
            }
            
            return this;
        };
        
        
        Vec2.vdot = Vec2.prototype.vdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y;
        };
        
        
        Vec2.prototype.dot = function( other ){
            
            return this.vdot( this, other );
        };
        
        
        Vec2.prototype.vlerp = function( a, b, t ){
            
            this.x = lerp( a.x, b.x, t );
            this.y = lerp( a.y, b.y, t );
            
            return this;
        };
        
        
        Vec2.prototype.lerp = function( other, t ){
            
            return this.vlerp( this, other, t );
        };
        
        
        Vec2.prototype.vslerp = function(){
	    var start = new Vec2(),
		end = new Vec2(),
		vec = new Vec2(),
		relative = new Vec2();
	    
	    return function( a, b, t ){
		var dot = clamp( Vec3.vdot( a, b ), -1, 1 ),
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
        
        
        Vec2.prototype.slerp = function( other, t ){
            
            return this.vslerp( this, other, t );
        };
        
        
        Vec2.prototype.applyMat3 = function( m ){
            var x = this.x, y = this.y,
                me = m.elements;
                
            this.x = me[0] * x + me[3] * y + me[6];
            this.y = me[1] * x + me[4] * y + me[7];
            
            return this;
        };
        
        
        Vec2.prototype.applyProjection = function( m ){
            var x = this.x, y = this.y,
                me = m.elements,
                d = 1 / ( me[2] * x + me[5] * y + me[8] );
	    
            this.x = ( me[0] * x + me[3] * y + me[6] ) * d;
            this.y = ( me[1] * x + me[4] * y + me[7] ) * d;
            
            return this;
        };
        
        
        Vec2.prototype.getPositionMat3 = function( m ){
            var me = m.elements;
            
            this.x = me[6];
            this.y = me[7];
            
            return this;
        };
        
        
        Vec2.prototype.getScaleMat3 = function( m ){
            var me = m.elements,
                sx = this.set( me[0], me[1] ).len(),
                sy = this.set( me[3], me[4] ).len();
            
            this.x = sx;
            this.y = sy;
            
            return this;
        };
        
        
        Vec2.prototype.lenSq = function(){
            
            return this.dot( this );
        };
        
        
        Vec2.prototype.len = function(){
	    
            return sqrt( this.lenSq() );
        };
        
        
        Vec2.prototype.norm = function(){
            
            return this.sdiv( this.len() );
        };
        
        
        Vec2.prototype.setLen = function( len ){
            
            return this.norm().smul( len );
        };
        
        
        Vec2.prototype.inverse = function(){
            
            return this.smul( -1 );
        };
        
        
        Vec2.prototype.abs = function(){
	    
	    this.x = abs( this.x );
	    this.y = abs( this.y );
            
            return this;
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
        
        
        Vec2.distSq = Vec2.prototype.distSq = function(){
	    var dist = new Vec2();
	    
	    return function( a, b ){
		
		return dist.vsub( a, b ).lenSq();
	    };
        }();
        
        
        Vec2.dist = Vec2.prototype.dist = function( a, b ){
            
            return sqrt( Vec2.distSq( a, b ) );
        };
        
        
        Vec2.prototype.toString = function(){
            
            return "Vec2( "+ this.x +", "+ this.y +" )";
        };
	
        
        Vec2.prototype.equals = function( other ){
            
            return Vec2.equals( this, other );
        };
        
        
        Vec2.equals = function( a, b ){
	    
            return (
                equals( a.x, b.x ) &&
                equals( a.y, b.y )
            );
        };
	
	
	return Vec2;
    }
);