if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2"
    ],
    function( Class, Mathf, Vec2 ){
	"use strict";
	
	
	function PCollision2D( a, b, axis, overlap ){
	    
	    Class.call( this );
	    
	    this.a = a;
	    this.b = b;
	    this.axis = axis;
	    this.overlap = overlap;
	}
	
	Class.extend( PCollision2D, Class );
	
	
	PCollision2D.prototype.solve = function(){
	    var vec = new Vec2;
	    
	    return function(){
		
	    };
	}();
	
	
	return PCollision2D;
    }
);