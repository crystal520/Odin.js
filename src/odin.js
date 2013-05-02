if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
	"use strict";
	
	
	var Odin = {};
	
	
	Odin.globalize = function(){
	    
	    for( var key in this ){
		window[ key ] = this[ key ];
	    }
	    window.Odin = this;
	};
	
	
	Odin.Bounds = require("math/bounds");
	Odin.Color = require("math/color");
	Odin.Mat3 = require("math/mat3");
	Odin.Mathf = require("math/mathf");
	Odin.Vec2 = require("math/vec2");
	
	
	return Odin;
    }
);