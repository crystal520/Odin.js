if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2"
    ],
    function( Class, Vec2, AABB2 ){
        "use strict";
	
        
	function PShape2D(){
	    
	    Class.call( this );
	    
	    this.body = undefined;
	    
	    this.type = 0;
	    
	    this.aabb = new AABB2;
	    
	    this.volume = 0;
	    
	    this.boundingRadius = 0;
	}
	
	Class.extend( PShape2D, Class );
	
	
	PShape2D.prototype.calculateAABB = function(){
	    throw new Error("calculateAABB not implemented for shape type "+ this.type );
	};
	
	
	PShape2D.prototype.calculateWorldAABB = function( position, rotation ){
	    throw new Error("calculateWorldAABB not implemented for shape type "+ this.type );
	};
	
	
	PShape2D.prototype.calculateInertia = function(){
	    throw new Error("calculateInertia not implemented for shape type "+ this.type );
	};
	
	
	PShape2D.prototype.calculateBoundingRadius = function(){
	    throw new Error("calculateBoundingRadius not implemented for shape type "+ this.type );
	};
	
	
	PShape2D.prototype.calculateVolume = function(){
	    throw new Error("calculateVolume not implemented for shape type "+ this.type );
	};
	
	
	PShape2D.BOX = 1;
	PShape2D.CIRCLE = 2;
	PShape2D.CONVEX = 3;
	
        
        return PShape2D;
    }
);