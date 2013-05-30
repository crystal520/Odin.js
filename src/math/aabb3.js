if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/vec3"
    ],
    function( Vec3 ){
        "use strict";
        
	var vEquals = Vec3.equals,
	    abs = Math.abs,
	    cos = Math.cos,
	    sin = Math.sin;
	
        
        function AABB3( min, max ){
            
            this.min = min instanceof Vec3 ? min : new Vec3;
            this.max = max instanceof Vec3 ? max : new Vec3;
	}
        
        
        AABB3.prototype.clone = function(){
            
            return new AABB3(
		this.min.clone(),
		this.max.clone()
	    );
	};
        
        
        AABB3.prototype.copy = function( other ){
            
            this.min.copy( other.min );
            this.max.copy( other.max );
            
            return this;
	};
        
        
        AABB3.prototype.setFromPoints = function( points ){
            var v, i = 0, il = points.length,
		minx, miny, minz, maxx, maxy, maxz,
		min = this.min, max = this.max,
		x, y, z;
            
            if( il > 0 ){
                
		minx = miny = minz = Infinity;
		maxx = maxy = maxz = -Infinity;
                
                for( i; i < il; i++ ){
                    v = points[i];
		    x = v.x; y = v.y; z = v.z;
		    
		    minx = minx > x ? x : minx;
		    miny = miny > y ? y : miny;
		    minz = minz > z ? z : minz;
		    
		    maxx = maxx < x ? x : maxx;
		    maxy = maxy < y ? y : maxy;
		    maxz = maxz < z ? z : maxz;
                }
		
		min.x = minx; min.y = miny; min.x = minz;
		max.x = maxx; max.y = maxy; max.x = maxz;
            }
            else{
                min.x = min.y = min.z = max.x = max.y = max.z = 0;
            }
            
            return this;
        };
        
        
        AABB3.prototype.contains = function( point ){
            
	    return !(
		point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y ||
                point.z < this.min.z || point.z > this.max.z
	    );
	};
        
        
        AABB3.prototype.intersects = function( other ){
            var aMin = this.min, aMax = this.max,
		bMin = other.min, bMax = other.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || 
                aMin.x > bMax.x || aMin.y > bMax.y || 
                aMin.z > bMax.z || aMin.z > bMax.z
	    );
	};
        
        
        AABB3.prototype.toString = function(){
            var min = this.min, max = this.max;
	    
            return "AABB3( min: "+ min.x +", "+ min.y +", "+ min.z +", max: "+ max.x +", "+ max.y +", "+ max.z +" )";
	};
        
        
        AABB3.prototype.equals = function( other ){
            
            return !(
                !vEquals( this.min, other.min ) ||
                !vEquals( this.max, other.max )
            );
	};
        
        
        AABB3.intersects = function( a, b ){
            var aMin = a.min, aMax = a.max,
		bMin = b.min, bMax = b.max;
	    
	    return !(
		aMax.x < bMin.x || aMax.y < bMin.y || aMax.z < bMin.z ||
                aMin.x > bMax.x || aMin.y > bMax.y || aMin.z > bMax.z
	    );
	};
        
        
        AABB3.equals = function( a, b ){
            
            return !(
                !vEquals( a.min, b.min ) ||
                !vEquals( a.max, b.max )
            );
	};
        
        return AABB3;
    }
);