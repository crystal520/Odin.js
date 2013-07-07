if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        
	function PConstraint2D( bi, bj ){
	    
	    Class.call( this );
	    
	    this.bi = bi;
	    this.bj = bj;
	    
	    this.equations = [];
	}
	
	Class.extend( PConstraint2D, Class );
	
	
	PConstraint2D.prototype.update = function(){};
        
        return PConstraint2D;
    }
);