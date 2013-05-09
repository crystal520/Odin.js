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
	
	var PI = Math.PI;
	
	
        function PSphere( radius ){
            
            PShape.call( this );
	    
	    this.radius = radius !== undefined ? radius : 0.5;
	    this.type = PShape.circle;
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
        }
        
	Class.extend( PSphere, PShape );
	
	
	PSphere.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadiusNeedsUpdate = false;
	    this.boundingRadius = this.radius;
	}
	
	
	PSphere.prototype.calculateAABB = function(){
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
	
	
	PSphere.prototype.calculateInertia = function(){
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
	
	
	PSphere.prototype.volume = function(){
	    var r = this.radius;
	    
	    return PI * r * r;
	}
	
        
        return PSphere;
    }
);