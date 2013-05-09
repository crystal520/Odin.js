if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"core/physics/objects/pshape"
    ],
    function( Class, Vec2, PShape ){
	"use strict";
	
	var PI = Math.PI;
	
	
        function PCircle( radius ){
            
            PShape.call( this );
	    
	    this.radius = radius !== undefined ? radius : 0.5;
	    this.type = PShape.CIRCLE;
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
        }
        
	Class.extend( PCircle, PShape );
	
	
	PCircle.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadiusNeedsUpdate = false;
	    this.boundingRadius = this.radius;
	};
	
	
	PCircle.prototype.calculateAABB = function(){
	    var min = new Vec2,
		max = new Vec2;
	    
	    return function(){
		var r = this.radius;
		
		this.aabb.setMinMax(
		    min.set( -r, -r ),
		    max.set( r, r )
		);
		
		return this;
	    }
	}();
	
	
	PCircle.prototype.calculateInertia = function(){
	    var vec = new Vec2;
	    
	    return function( mass, target ){
		target = target || vec;
		mass = mass || 1;
		
		var r = this.radius,
		    I = mass * r * r / 2;
		
		target.set( I, I );
		
		return target;
	    }
	}();
	
	
	PCircle.prototype.volume = function(){
	    var r = this.radius;
	    
	    return PI * r * r;
	};
	
        
        return PCircle;
    }
);