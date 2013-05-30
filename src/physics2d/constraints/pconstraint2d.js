if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        
	function PConstraint2D( bi, bj, minForce, maxForce ){
	    
	    Class.call( this );
	    
	    this.bi = bi;
	    this.bj = bj;
	    
	    this.minForce = minForce !== undefined ? minForce : -1e6;
	    this.maxForce = maxForce !== undefined ? maxForce : 1e6;
	    
	    this.stiffness = 1e7;
	    this.stabilizeSteps = 5;
	    
	    this.a = 0;
	    this.b = 0;
	    this.eps = 0;
	}
	
	Class.extend( PConstraint2D, Class );
	
	
	PConstraint2D.prototype.updateSpook = function( h ){
	    var d = this.stabilizeSteps,
		k = this.stiffness;
	    
	    this.a = 4 / ( h * ( 1 + 4 * d ) );
	    this.b = ( 4 * d ) / ( 1 + 4 * d );
	    this.eps = 4 / ( h * h * k * ( 1 + 4 * d ) );
	};
	
        
        return PConstraint2D;
    }
);