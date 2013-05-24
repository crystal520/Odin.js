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
	    var r = this.radius,
		aabb = this.aabb, min = aabb.min, max = aabb.max;
	    
	    min.x = -r;
	    min.y = -r;
	    
	    max.x = r;
	    max.y = r;
	    
	    this.aabbNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateWorldAABB = function( position, rotation, aabb ){
	    
	    if( this.aabbNeedsUpdate ){
		this.calculateAABB();
	    }
	    
	    aabb.copy( this.aabb );
	    aabb.setCenter( position );
	    
	    return aabb;
	};
	
	
	PCircle.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadius = this.radius;
	    this.boundingRadiusNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PCircle.prototype.calculateInertia = function(){
	    var s = 2 / 5;
	    
	    return function( mass ){
		var r = this.radius;
		
		return ( mass * r * r ) * s;
	    };
	}();
	
	
	return PCircle;
    }
);