if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	
	function PSolver2D(){
	    
	    Class.call( this );
	    
	    this.equations = [];
	    
	    this.iterations = 10;
	    this.tolerance = 0;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function( dt, world ){
	    var iter = 0,
		maxIter = this.iterations,
		toleranceSq = this.tolerance * this.tolerance,
		eqs = this.equations,
		bodies = world.bodies,
		i, il;
	    
	    for( i = 0; i < maxIter; i++ ){
		
	    }
	    
	    return 0;
	};
	
	
	PSolver2D.prototype.add = function( eq ){
	    
	    this.equations.push( eq );
	};
	
	
	PSolver2D.prototype.remove = function( eq ){
	    var eqs = this.equations,
		index = eqs.indexOf( eq );
	    
	    if( index !== -1 ){
		eqs.splice( index, 1 );
	    }
	};
	
	
	PSolver2D.prototype.clear = function(){
	    
	    this.equations.length = 0;
	};
	
	
	return PSolver2D;
    }
);