if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/bounds"
    ],
    function( Class, Bounds ){
	"use strict";
	
	
        function PShape(){
            
            Class.call( this );
	    
	    this.type = 0;
	    
	    this.aabb = new Bounds;
	    
	    this.boundingRadius = 0;
	    this.boundingRadiusNeedsUpdate = true;
        }
        
	Class.extend( PShape, Class );
	
	
	PShape.prototype.calculateBoundingRadius = function(){
	    
	    throw new Error("PShape.calculateBoundingRadius: not implemented for shape type "+ this.type );
	};
	
	
	PShape.prototype.calculateAABB = function(){
	    
	    throw new Error("PShape.calculateAABB: not implemented for shape type "+ this.type );
	};
	
	
	PShape.prototype.calculateInertia = function(){
	    
	    throw new Error("PShape.calculateInertia: not implemented for shape type "+ this.type );
	};
	
	
	PShape.prototype.volume = function(){
	    
	    throw new Error("PShape.volume: not implemented for shape type "+ this.type );
	};
	
	
	PShape.CIRCLE = 0;
	PShape.RECT = 1;
	
        
        return PShape;
    }
);