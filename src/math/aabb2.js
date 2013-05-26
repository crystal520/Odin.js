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
        
        
        AABB2.prototype.copy = function( other ){
            var amin = this.min, bmin = other.min,
		amax = this.max, bmax = other.max;
	    
	    amin.x = bmin.x;
	    amin.y = bmin.y;
	    
	    amax.x = bmax.x;
	    amax.y = bmax.y;
            
            return this;
	};
        
        
        AABB2.prototype.setFromPoints = function( points ){
            var v, i = 0, il = points.length,
		minx, miny, maxx, maxy,
		min = this.min, max = this.max;
            
            if( il > 0 ){
                
		minx = miny = Infinity;
		maxx = maxy = -Infinity;
                
                for( i; i < il; i++ ){
                    v = points[i];
		    
		    minx = minx > v.x ? v.x : minx;
		    miny = miny > v.y ? v.y : miny;
		    
		    maxx = maxx < v.x ? v.x : maxx;
		    maxy = maxy < v.y ? v.y : maxy;
                }
		
		min.x = minx; min.y = miny;
		max.x = maxx; max.y = maxy;
            }
            else{
                min.x = min.y = max.x = max.y = 0;
            }
            
            return this;
        };
        
        
        AABB2.prototype.expandByPoint = function( point ){
            var min = this.min, max = this.max;
            
	    min.x = min.x > point.x ? point.x : min.x;
	    min.y = min.y > point.y ? point.y : min.y;
            
	    max.x = max.x < point.x ? point.x : max.x;
	    max.y = max.y < point.y ? point.y : max.y;
	    
            return this;
        };
        
        
        AABB2.prototype.clear = function(){
            var min = this.min, max = this.max;
	    
	    min.x = min.y = max.x = max.y = 0;
            
            return this;
        };
        
        
        AABB2.prototype.setCenter = function( center ){
	    var min = this.min, max = this.max;
	    
	    min.x += center.x;
	    min.y += center.y;
	    
	    max.x += center.x;
	    max.y += center.y;
	    
	    return this;
	};
        
        
        AABB2.prototype.contains = function( point ){
            
	    return !(
		point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y
	    );
	};
        
        
        AABB2.prototype.intersects = function( other ){
            var aMin = this.min, aMax = this.max,
		bMin = other.min, bMax = other.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || 
                aMin.x > bMax.x || aMin.y > bMax.y
	    );
	};
        
        
        AABB2.prototype.toString = function(){
            var min = this.min, max = this.max;
	    
            return "AABB2( min: "+ min.x +", "+ min.y +", max: "+ max.x +", "+ max.y +" )";
	};
        
        
        AABB2.prototype.equals = function( other ){
            var amin = this.min, amax = this.max,
		bmin = other.min, bmax = other.max;
	    
            return !(
                !equals( amin.x, bmin.x ) ||
                !equals( amin.y, bmin.y ) ||
                !equals( amax.x, bmax.x ) ||
                !equals( amax.y, bmax.y )
            );
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
            var amin = a.min, amax = a.max,
		bmin = b.min, bmax = b.max;
	    
            return !(
                !equals( amin.x, bmin.x ) ||
                !equals( amin.y, bmin.y ) ||
                !equals( amax.x, bmax.x ) ||
                !equals( amax.y, bmax.y )
            );
	};
        
        return AABB2;
    }
);