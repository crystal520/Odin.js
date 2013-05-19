if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/vec2"
    ],
    function( Vec2 ){
        "use strict";
        
	var vEquals = Vec2.equals,
	    abs = Math.abs,
	    cos = Math.cos,
	    sin = Math.sin;
	
        
        function AABB2( min, max ){
            
            this.min = min instanceof Vec2 ? min : new Vec2;
            this.max = max instanceof Vec2 ? max : new Vec2;
	}
        
        
        AABB2.prototype.clone = function(){
            
            return new AABB2(
		this.min.clone(),
		this.max.clone()
	    );
	};
        
        
        AABB2.prototype.copy = function( other ){;
            
            this.min.copy( other.min );
            this.max.copy( other.max );
            
            return this;
	};
        
        
        AABB2.prototype.setFromPoints = function( points ){
            var point, i = 0, il = points.length,
		min = this.min, max = this.max;
            
            if( il > 0 ){
                
                min.set( Infinity, Infinity );
                max.set( -Infinity, -Infinity );
                
                for( i; i < il; i++ ){
                    point = points[i];
                    
                    if( point.x < min.x ){
                        min.x = point.x;
                    }
                    else if( point.x > max.x ){
                        max.x = point.x;
                    }
                    
                    if( point.y < min.y ){
                        min.y = point.y;
                    }
                    else if( point.y > max.y ){
                        max.y = point.y;
                    }
                }
            }
            else{
                this.clear();
            }
            
            return this;
        };
        
        
        AABB2.prototype.clear = function(){
            
            this.min.set( 0, 0 );
            this.max.set( 0, 0 );
            
            return this;
        };
        
        
        AABB2.prototype.rotate = function(){
	    var min = new Vec2,
		max = new Vec2,
		points = [ new Vec2, new Vec2, new Vec2, new Vec2 ];
	    
	    return function( a ){
		min.copy( this.min );
		max.copy( this.max );
		
		points[0].set( min.x, max.y ).rotate( a );
		points[1].set( max.x, max.y ).rotate( a );
		points[2].set( max.x, min.y ).rotate( a );
		points[3].set( min.x, min.y ).rotate( a );
		
		this.setFromPoints( points );
		
		return this;
	    };
	}();
        
        
        AABB2.prototype.contains = function( point ){
            
	    return !(
		point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y
	    );
	};
        
        
        AABB2.prototype.intersects = function( other ){
            
	    return AABB2.intersects( this, other );
	};
        
        
        AABB2.prototype.toString = function(){
            var min = this.min, max = this.max;
	    
            return "AABB2( min: "+ min.x +", "+ min.y +", max: "+ max.x +", "+ max.y +" )";
	};
        
        
        AABB2.prototype.equals = function( other ){
            
            return AABB2.equals( this, other );
	};
        
        
        AABB2.intersects = function( a, b ){
            var aMin = a.min, aMax = a.max,
		bMin = b.min, bMax = b.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || 
                aMin.x > bMax.x || aMin.y > bMax.y
	    );
	};
        
        
        AABB2.equals = function( a, b ){
            
            return !(
                !vEquals( a.min, b.min ) ||
                !vEquals( a.max, b.max )
            );
	};
        
        return AABB2;
    }
);