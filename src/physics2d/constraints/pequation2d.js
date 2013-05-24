if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	
	function PEquation2D( bi, bj ){
	    
	    Class.call( this );
	    
	    this.bi = bi;
	    this.bj = bj;
	    
	    this.stabilize = 5;
	    this.springConstant = 1e7;
	    
	    this.a = 0;
	    this.b = 0;
	    this.eps = 0;
	}
	
	Class.extend( PEquation2D, Class );
	
	
	PEquation2D.prototype.solve = function( dt ){
	    
	};
	
	
	PEquation2D.prototype.updateConstants = function( h ){
	    var d = this.stabilize,
		k = this.springConstant;
	    
	    this.a = 4 / ( h * ( 1 + 4 * d ) );
	    this.b = ( 4 * d ) / ( 1 + 4 * d );
	    this.eps = 4 / ( h * h * k * ( 1 + 4 * d ) );
	};
	
	
	return PEquation2D;
    }
);