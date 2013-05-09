if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	
        function PBody(){
            
            Class.call( this );
	    
	    this.type = PBody.dynamic;
	    
	    this.world = undefined;
        }
        
	Class.extend( PBody, Class );
	
	
	PBody.STATIC = 0;
	PBody.DYNAMIC = 1;
	PBody.KINEMATIC = 2;
	
        
        return PBody;
    }
);