if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/aabb2",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pconvex2d"
    ],
    function( Class, Mathf, Vec2, AABB2, PShape2D, PConvex2D ){
	"use strict";
	
	
	function PRect( extents ){
	    
	    this.extents = extents instanceof Vec2 ? extents : new Vec2( 0.5, 0.5 );
	    
	    var w = this.extents.x,
		h = this.extents.y,
		vertices = [
		    new Vec2( w, h ),
		    new Vec2( -w, h ),
		    new Vec2( -w, -h ),
		    new Vec2( w, -h )
		];
	    
	    PConvex2D.call( this, vertices );
	    
	    this.type = PShape2D.RECT;
	    
	    this.calculateBoundingRadius();
	}
	
	Class.extend( PRect, PConvex2D );
	
	
	PRect.prototype.calculateAABB = function(){
	    var extents = this.extents,
		aabb = this.aabb;
	    
	    aabb.min.copy( extents ).negate();
	    aabb.max.copy( extents );
	    this.aabbNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PRect.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadius = this.extents.len();
	    this.boundingRadiusNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PRect.prototype.calculateInertia = function( mass ){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2;
	    
	    return ( mass * ( w * w + h * h ) ) / 12;
	};
	
	
	return PRect;
    }
);