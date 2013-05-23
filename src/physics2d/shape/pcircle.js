if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Mathf, PShape2D ){
	"use strict";
	
	var PI = Mathf.PI;
	
	
	function PCircle( radius ){
	    
	    PShape2D.call( this );
	    
	    this.radius = radius !== undefined ? radius : 0.5;
	    
	    this.type = PShape2D.CIRCLE;
	    
	    this.calculateBoundingRadius();
	}
	
	Class.extend( PCircle, PShape2D );
	
	
	PCircle.prototype.calculateAABB = function(){
	    var r = this.radius;
	    
	    this.aabb.min.set( -r, -r );
	    this.aabb.max.set( r, r );
	    this.aabbNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateWorldAABB = function( position, rotation, aabb ){
	    return this;
	};
	
	
	PCircle.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadius = this.radius;
	    this.boundingRadiusNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateInertia = function( mass ){
	    var r = this.radius;
	    
	    return ( mass * r * r ) * 0.5;
	};
	
	
	return PCircle;
    }
);