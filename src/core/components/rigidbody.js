if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/component",
	"math/vec2"
    ],
    function( Class, Time, Component, Vec2 ){
        "use strict";
	
        
        function RigidBody( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.mass = !!opts.mass ? opts.mass : 0;
            
            this.radius = opts.radius !== undefined ? opts.radius : 0.5;
	    this.extents = opts.extents instanceof Vec2 ? opts.extents : new Vec2( 0.5, 0.5 );
        }
        
	Class.extend( RigidBody, Component );
	
	
	RigidBody.prototype.init = function(){
	    
	};
	
	
	RigidBody.prototype.update = function(){
	    
	};
	
	
	RigidBody.prototype.applyForce = function( force, point ){
	    
	};
	
	
	RigidBody.CIRCLE = 0;
	RigidBody.RECT = 1;
	
        
        return RigidBody;
    }
);