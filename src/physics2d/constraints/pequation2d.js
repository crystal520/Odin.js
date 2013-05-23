if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	
	function PEquation2D( bi, bj, minForce, maxForce ){
	    
	    Class.call( this );
	    
	    this.bi = bi;
	    this.bj = bj;
	    
	    this.minForce = minForce !== undefined ? minForce : -1000000;
	    this.maxForce = maxForce !== undefined ? maxForce : 1000000;
	    
	    this.stiffness = 10000000;
	    this.regularizationTime = 5;
	    
	    this.a = 0;
	    this.b = 0;
	    this.eps = 0;
	    
	    this.spookParamsNeedsUpdate = true;
	}
	
	Class.extend( PEquation2D, Class );
	
	
	PEquation2D.prototype.updateSpookParams = function( dt ){
	    var d = this.regularizationTime,
		k = this.stiffness,
		i = 1 + 4 * d;
	    
	    this.a = 4 / ( dt * i );
	    this.b = ( 4 * d ) / i;
	    this.eps = 4 / ( dt * dt * k * i );
	    
	    this.spookParamsNeedsUpdate = false;
	};
	
	
	return PEquation2D;
    }
);