if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"physics2d/constraints/pconstraint2d",
	"physics2d/constraints/pcontact2d"
    ],
    function( Class, PConstraint2D, PContact2D ){
        "use strict";
	
        
	function PDistanceConstraint2D( bi, bj, distance, maxForce ){
	    
	    PConstraint2D.call( this, bi, bj );
	    
	    this.distance = distance !== undefined ? distance : 1;
	    this.maxForce = maxForce !== undefined ? maxForce : 1e6;
	    
	    this.equations.push( new PContact2D( bi, bj ) );
	    
	    this.normal = this.equations[0];
	    this.normal.minForce = -maxForce;
	    this.normal.maxForce = maxForce;
	}
	
	Class.extend( PDistanceConstraint2D, PConstraint2D );
	
	
	PDistanceConstraint2D.prototype.update = function(){
	    var normal = this.normal, n = normal.n,
		dist = this.distance;
	    
	    n.vsub( this.bj.position, this.bi.position ).norm();
	    
	    normal.ri.copy( n ).smul( dist * 0.5 );
	    normal.rj.copy( n ).smul( -dist * 0.5 );
	};
	
        
        return PDistanceConstraint2D;
    }
);