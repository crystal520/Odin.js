if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pconvex2d"
    ],
    function( Class, Vec2, PShape2D, PConvex2D ){
        "use strict";
	
	var sqrt = Math.sqrt;
	
        
	function PBox2D( extents ){
	    
	    this.extents = extents instanceof Vec2 ? extents : new Vec2( 0.5, 0.5 );
	    
	    var x = this.extents.x, y = this.extents.y;
	    
	    var vertices = [
		new Vec2( x, y ),
		new Vec2( -x, y ),
		new Vec2( -x, -y ),
		new Vec2( x, -y ),
	    ]; 
	    
	    PConvex2D.call( this, vertices );
	    
	    this.type = PShape2D.BOX;
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
	    this.calculateVolume();
	}
	
	Class.extend( PBox2D, PConvex2D );
	
	
	PBox2D.prototype.calculateAABB = function(){
	    var extents = this.extents,
		x = extents.x, y = extents.y,
		aabb = this.aabb, min = aabb.min, max = aabb.max;
	    
	    min.x = -x
	    min.y = -y;
	    max.x = x
	    max.y = y;
	};
	
	
	PBox2D.prototype.calculateInertia = function( mass ){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2;
	    
	    return ( mass * ( w * w + h * h ) ) / 12;
	};
	
	
	PBox2D.prototype.calculateBoundingRadius = function(){
	    var extents = this.extents,
		x = extents.x, y = extents.y,
		l = x * x + y * y;
	    
	    this.boundingRadius = l !== 0 ? sqrt( l ) : 0;
	};
	
	
	PBox2D.prototype.calculateVolume = function(){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2;
	    
	    this.volume = w * h;
	};
	
        
        return PBox2D;
    }
);