if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"core/physics/pshape"
    ],
    function( Class, Vec2, PShape ){
	"use strict";
	
	
        function PRect( extents ){
            
            PShape.call( this );
	    
	    this.extents = extents instanceof Vec2 ? extents : new Vec2( 0.5, 0.5 );
	    this.type = PShape.rect;
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
        }
        
	Class.extend( PRect, PShape );
	
	
	PRect.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadiusNeedsUpdate = false;
	    this.boundingRadius = this.extents.len();
	}
	
	
	PRect.prototype.calculateAABB = function(){
	    var min = new Vec2,
		max = new Vec2;
	    
	    return function(){
		var extents = this.extents;
		
		min.copy( extents ).inverse();
		max.copy( extents );
		
		this.aabb.setMinMax( min, max );
		
		return this;
	    }
	}();
	
	
	PRect.prototype.calculateInertia = function(){
	    var vec = new Vec2;
	    
	    return function( mass, target ){
		target = target || vec;
		mass = mass || 1;
		
		var extents = this.extents,
		    w = extents.x * 2,
		    h = extents.y * 2,
		    I = ( mass * ( h*h + w*w ) ) / 12;
		
		target.set( I, I );
		
		return target;
	    }
	}();
	
	
	PRect.prototype.volume = function(){
	    
	    return this.width * this.height;
	}
	
        
        return PRect;
    }
);