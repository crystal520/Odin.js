if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/vec3"
    ],
    function( Vec3 ){
        "use strict";
        
	var vEquals = Vec3.equals;
	
        
        function Ray3( origin, direction ){
            
            this.origin = origin instanceof Vec3 ? origin : new Vec3;
            this.direction = direction instanceof Vec3 ? direction : new Vec3;
	}
        
        
        Ray3.prototype.clone = function(){
            
            return new Ray3(
		this.origin.clone(),
		this.direction.clone()
	    );
	};
        
        
        Ray3.prototype.copy = function( other ){;
            
            this.origin.copy( other.origin );
            this.direction.copy( other.direction );
            
            return this;
	};
        
        
        Ray3.prototype.set = function( origin, direction ){;
            
            this.origin.copy( origin );
            this.direction.copy( direction );
            
            return this;
	};
        
        
        Ray3.prototype.at = function( length, target ){
            target = target || new Vec3;
	    
            return target.copy( this.direction ).smul( length ).add( this.origin );
        };
	
	
	Ray3.prototype.applyMat3 = function( m ){
	    
	    this.direction.add( this.origin ).applyMat3( m );
	    this.origin.applyMat3( m );
	    this.direction.sub( this.origin );
	    
	    return this;
	};
	
	
	Ray3.prototype.applyMat4 = function( m ){
	    
	    this.direction.add( this.origin ).applyMat4( m );
	    this.origin.applyMat4( m );
	    this.direction.sub( this.origin );
	    
	    return this;
	};
        
        
        Ray3.prototype.toString = function(){
            var origin = this.origin, direction = this.direction;
	    
            return "Ray3( origin: "+ origin.x +", "+ origin.y +", "+ origin.z +", max: "+ direction.x +", "+ direction.y +", "+ direction.z +" )";
	};
        
        
        Ray3.prototype.equals = function( other ){
            
            return !(
                !vEquals( this.origin, other.origin ) ||
                !vEquals( this.direction, other.direction )
            );
	};
        
        
        Ray3.equals = function( a, b ){
            
            return !(
                !vEquals( a.origin, b.origin ) ||
                !vEquals( a.direction, b.direction )
            );
	};
        
        return Ray3;
    }
);