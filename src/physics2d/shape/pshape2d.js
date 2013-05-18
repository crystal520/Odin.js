if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/aabb2",
	"math/vec2",
	"math/affine"
    ],
    function( Class, AABB2, Vec2, Affine ){
	"use strict";
	
	
	function PShape2D(){
	    
	    Class.call( this );
	    
	    this.min = 0;
	    this.max = 0;
	    
	    this.aabb = new AABB2;
	    this.aabbNeedsUpdate = true;
	    
	    this.boundingRadius = 0;
	    this.boundingRadiusNeedsUpdate = true;
	    
	    this.calculateBoundingRadius();
	}
	
	Class.extend( PShape2D, Class );
	
	
	PShape2D.prototype.project = function( axis ){
	    return this;
	};
	
	
	PShape2D.prototype.calculateBoundingRadius = function(){
	    return this;
	};
	
	
	PShape2D.prototype.calculateWorldAABB = function( position, rotation, aabb ){
	    var thisAABB = this.aabb,
		min = thisAABB.min, max = thisAABB.max;
	    
	    if( this.aabbNeedsUpdate ){
		this.calculateAABB();
	    }
	    
	    aabb.min.vadd( min, position );
	    aabb.max.vadd( max, position );
	    aabb.rotate( rotation );
	    
	    return aabb;
	};
	
	
	PShape2D.prototype.calculateInertia = function( mass ){
	    return this;
	};
	
	
	PShape2D.CIRCLE = 0;
	PShape2D.RECT = 1;
	PShape2D.POLY = 2;
	
	
	return PShape2D;
    }
);