if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        
	function PBody2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.filterGroup = opts.filterGroup !== undefined ? opts.filterGroup : 0;
	    
	    this.world = undefined;
	    
	    this.userData = undefined;
	}
	
	Class.extend( PBody2D, Class );
	
	
	PBody2D.DYNAMIC = 1;
	PBody2D.STATIC = 2;
	PBody2D.KINEMATIC = 3;
	
        
        return PBody2D;
    }
);