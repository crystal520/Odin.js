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
	    
	    Class.call( this );
	    
	    this.type = PBody2D.DYNAMIC;
	    
	    this.world = undefined;
	    
	    this.filterGroup = opts.filterGroup  !== undefined ? opts.filterGroup  : 1;
	    this.filterMask = opts.filterMask  !== undefined ? opts.filterMask  : 1;
	}
	
	Class.extend( PBody2D, Class );
	
	
	PBody2D.DYNAMIC = 0;
	PBody2D.STATIC = 1;
	PBody2D.KINEMATIC = 2;
	
	
	return PBody2D;
    }
);