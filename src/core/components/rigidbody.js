if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/component",
	"math/vec2",
	"physics2d/shape/pcircle",
	"physics2d/shape/prect",
	"physics2d/body/prigidbody2d"
    ],
    function( Class, Time, Component, Vec2, PCircle, PRect, PRigidBody2D ){
        "use strict";
	
        
        function RigidBody( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    var shape;
	    
	    switch( opts.shape ){
		
		case RigidBody.CIRCLE:
		    
		    shape = new PCircle( this.radius );
		    break;
		    
		case RigidBody.RECT:
		default:
		    
		    shape = new PRect( this.extents );
		    break;
	    }
	    
	    opts.shape = shape;
	    this.body = new PRigidBody2D( opts );
        }
        
	Class.extend( RigidBody, Component );
	
	
	RigidBody.prototype.init = function(){
	    var body = this.body,
		gameObject = this.gameObject;
	    
	    body.position.copy( gameObject.position );
	    body.rotation = gameObject.rotation;
	};
	
	
	RigidBody.prototype.update = function(){
	    var body = this.body,
		gameObject = this.gameObject;
	    
	    if( body.mass <= 0 ){
		body.position.copy( gameObject.position );
		body.rotation = gameObject.rotation;
	    }
	    else{
		gameObject.position.copy( body.position );
		gameObject.rotation = body.rotation;
	    }
	};
	
	
	RigidBody.prototype.applyForce = function( force, worldPoint ){
	    
	    this.body.applyForce( force, worldPoint );
	};
	
	
	RigidBody.prototype.applyImpulse = function( impulse, worldPoint ){
	    
	    this.body.applyImpulse( impulse, worldPoint );
	};
	
	
	RigidBody.CIRCLE = 0;
	RigidBody.RECT = 1;
	
        
        return RigidBody;
    }
);