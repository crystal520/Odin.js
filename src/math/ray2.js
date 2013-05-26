if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/vec2"
    ],
    function( Vec2 ){
        "use strict";
        
	var vEquals = Vec2.equals;
	
        
        function Ray2( origin, direction ){
            
            this.origin = origin instanceof Vec2 ? origin : new Vec2;
            this.direction = direction instanceof Vec2 ? direction : new Vec2;
	}
        
        
        Ray2.prototype.clone = function(){
            
            return new Ray2(
		this.origin.clone(),
		this.direction.clone()
	    );
	};
        
        
        Ray2.prototype.copy = function( other ){;
            
            this.origin.copy( other.origin );
            this.direction.copy( other.direction );
            
            return this;
	};
        
        
        Ray2.prototype.set = function( origin, direction ){;
            
            this.origin.copy( origin );
            this.direction.copy( direction );
            
            return this;
	};
        
        
        Ray2.prototype.at = function( length, target ){
            target = target || new Vec2;
	    
            return target.copy( this.direction ).smul( length ).add( this.origin );
        };
	
	
	Ray2.prototype.applyAffine = function( m ){
	    
	    this.direction.add( this.origin ).applyAffine( m );
	    this.origin.applyAffine( m );
	    this.direction.sub( this.origin );
	    
	    return this;
	};
	
	
	Ray2.prototype.applyMat3 = function( m ){
	    
	    this.direction.add( this.origin ).applyMat3( m );
	    this.origin.applyMat3( m );
	    this.direction.sub( this.origin );
	    
	    return this;
	};
	
	
	Ray2.prototype.applyMat4 = function( m ){
	    
	    this.direction.add( this.origin ).applyMat4( m );
	    this.origin.applyMat4( m );
	    this.direction.sub( this.origin );
	    
	    return this;
	};
        
        
        Ray2.prototype.toString = function(){
            var origin = this.origin, direction = this.direction;
	    
            return "Ray2( origin: "+ origin.x +", "+ origin.y +", max: "+ direction.x +", "+ direction.y +" )";
	};
        
        
        Ray2.prototype.equals = function( other ){
            
            return !(
                !vEquals( this.origin, other.origin ) ||
                !vEquals( this.direction, other.direction )
            );
	};
        
        
        Ray2.equals = function( a, b ){
            
            return !(
                !vEquals( a.origin, b.origin ) ||
                !vEquals( a.direction, b.direction )
            );
	};
        
        return Ray2;
    }
);