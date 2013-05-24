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
	    
	    this.aabb = new AABB2;
	    this.aabbNeedsUpdate = true;
	    
	    this.boundingRadius = 0;
	    this.boundingRadiusNeedsUpdate = true;
	}
	
	Class.extend( PShape2D, Class );
	
	
	PShape2D.prototype.calculateBoundingRadius = function(){
	    return this;
	};
	
	
	PShape2D.prototype.calculateInertia = function( mass ){
	    return this;
	};
	
	
	PShape2D.CIRCLE = 0;
	PShape2D.RECT = 1;
	PShape2D.CONVEX = 2;
	
	
	return PShape2D;
    }
);