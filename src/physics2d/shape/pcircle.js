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
	}
	
	Class.extend( PCircle, PShape2D );
	
	
	PCircle.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadiusNeedsUpdate = false;
	    this.boundingRadius = this.radius;
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateVolume = function(){
	    var r = this.radius;
	    
	    this.volumeNeedsUpdate = false;
	    this.volume = PI * r * r;
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateAABB = function(){
	    var r = this.radius;
	    
	    this.aabb.min.set( -r, -r );
	    this.aabb.max.set( r, r );
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateInertia = function( mass, v ){
	    var r = this.radius,
		I = ( mass * r * r ) * 0.5;
	    
	    return v.set( I, I );
	};
	
	
	return PCircle;
    }
);