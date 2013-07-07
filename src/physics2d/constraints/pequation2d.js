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
	    
	    this.minForce = minForce !== undefined ? minForce : -1e6;
	    this.maxForce = maxForce !== undefined ? maxForce : 1e6;
	    
	    this.stiffness = 1e7;
	    this.relaxation = 5;
	    
	    this.a = 0;
	    this.b = 0;
	    this.eps = 0;
	}
	
	Class.extend( PEquation2D, Class );
	
	
	PEquation2D.prototype.calculateConstants = function( h ){
	    var d = this.relaxation,
		k = this.stiffness;
	    
	    this.a = 4 / ( h * ( 1 + 4 * d ) );
	    this.b = ( 4 * d ) / ( 1 + 4 * d );
	    this.eps = 4 / ( h * h * k * ( 1 + 4 * d ) );
	};
	
        
        return PEquation2D;
    }
);