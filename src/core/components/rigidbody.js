if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/component",
	"physics2d/body/prigidbody2d",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pcircle2d",
	"physics2d/shape/pbox2d",
	"physics2d/shape/pconvex2d"
    ],
    function( Class, Time, Component, PRigidBody2D, PShape2D, PCircle2D, PBox2D, PConvex2D ){
        "use strict";
	
        
        function RigidBody( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    var shape;
	    
	    switch( opts.shape ){
		
		case RigidBody.CIRCLE:
		    
		    shape = new PCircle2D( opts.radius );
		    break;
		    
		case RigidBody.CONVEX:
		    
		    shape = new PConvex2D( opts.vertices );
		    break;
		    
		case RigidBody.BOX:
		default:
		    
		    shape = new PBox2D( opts.extents );
		    break;
	    }
	    
	    opts.shape = shape;
	    this.body = new PRigidBody2D( opts );
	    
	    this.listenTo( this.body, "collide", function( pbody2d ){
		this.trigger("collide", pbody2d.userData, Time.time );
	    }, this );
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
	    
	    if( body.mass > 0 ){
		gameObject.position.copy( body.position );
		gameObject.rotation = body.rotation;
	    }
	    else{
		body.position.copy( gameObject.position );
		body.rotation = gameObject.rotation;
	    }
	};
	
	
	RigidBody.prototype.applyForce = function( force, worldPoint, wake ){
	    
	    this.body.applyForce( force, worldPoint, wake );
	};
	
	
	RigidBody.prototype.applyTorque = function( torque, wake ){
	    
	    this.body.applyTorque( torque, wake );
	};
	
	
	RigidBody.prototype.applyImpulse = function( impulse, worldPoint, wake ){
	    
	    this.body.applyImpulse( impulse, worldPoint, wake );
	};
	
	
	RigidBody.BOX = 1;
	RigidBody.CIRCLE = 2;
	RigidBody.CONVEX = 3;
	
        
        return RigidBody;
    }
);