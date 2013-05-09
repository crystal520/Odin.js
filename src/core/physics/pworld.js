if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	
        function PWorld(){
            
            Class.call( this );
	    
	    
        }
        
	Class.extend( PWorld, Class );
	
	
	PWorld.prototype.step = function( dt ){
	    
	}
	
        
        return PWorld;
    }
);