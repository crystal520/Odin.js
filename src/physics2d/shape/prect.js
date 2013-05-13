if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Mathf, Vec2, PShape2D ){
	"use strict";
	
	
	function PRect( extents ){
	    
	    PShape2D.call( this );
	    
	    this.extents = extents instanceof Vec2 ? extents : new Vec2( 0.5, 0.5 );
	    
	    this.type = PShape2D.CIRCLE;
	    
	    this._vertices = [];
	    this._edges = [];
	}
	
	Class.extend( PRect, PShape2D );
	
	
	PRect.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadiusNeedsUpdate = false;
	    this.boundingRadius = this.extents.len();
	    
	    return this;
	};
	
	
	PRect.prototype.calculateVolume = function(){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2;
	    
	    this.volumeNeedsUpdate = false;
	    this.volume = w * h;
	    
	    return this;
	};
	
	
	PRect.prototype.calculateAABB = function(){
	    var extents = this.extents;
	    
	    this.aabb.min.copy( extents ).negate();
	    this.aabb.max.copy( extents );
	    
	    return this;
	};
	
	
	PRect.prototype.calculateInertia = function( mass, v ){
	    var extents = this.extents,
		w = extents.x * 2,
		h = extents.y * 2,
		I = ( mass * ( w * w + h * h ) ) / 12;
	    
	    return v.set( I, I );
	};
	
	
	return PRect;
    }
);