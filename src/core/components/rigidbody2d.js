if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/renderable2d",
	"physics2d/body/pbody2d",
	"physics2d/body/prigidbody2d",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pcircle2d",
	"physics2d/shape/pbox2d",
	"physics2d/shape/pconvex2d"
    ],
    function( Class, Time, Renderable2D, PBody2D, PRigidBody2D, PShape2D, PCircle2D, PBox2D, PConvex2D ){
        "use strict";
	
        
        function RigidBody2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this );
	    
	    this.radius = undefined;
	    this.extents = undefined;
	    this.vertices = undefined;
	    
	    var shape;
	    
	    if( opts.radius ){
		shape = new PCircle2D( opts.radius );
		this.radius = opts.radius || shape.radius;
		this.updateCircle();
	    }
	    if( opts.extents ){
		shape = new PBox2D( opts.extents );
		this.extents = opts.extents || shape.extents;
		this.updateBox();
	    }
	    if( opts.vertices ){
		shape = new PConvex2D( opts.vertices );
		this.vertices = opts.vertices || shape.vertices;
		this.updatePoly();
	    }
	    
	    opts.shape = shape instanceof PShape2D ? shape : undefined;
	    this.body = new PRigidBody2D( opts );
	    
	    this.listenTo( this.body, "collide", function( pbody2d ){
		this.trigger("collide", pbody2d.userData, Time.time );
	    }, this );
	    
	    this.line = true;
	    this.alpha = 0.25;
	    
	    switch( this.body.type ){
		
		case RigidBody2D.DYNAMIC:
		    this.color.setArgs( 0, 1, 0, 1 );
		    break;
		    
		case RigidBody2D.STATIC:
		    this.color.setArgs( 0, 0, 1, 1 );
		    break;
		    
		case RigidBody2D.KINEMATIC:
		    this.color.setArgs( 1, 0, 0, 1 );
		    break;
	    }
        }
        
	Class.extend( RigidBody2D, Renderable2D );
	
	
	RigidBody2D.prototype.init = function(){
	    var body = this.body,
		gameObject = this.gameObject;
	    
	    body.position.copy( gameObject.position );
	    body.rotation = gameObject.rotation;
	};
	
	
	RigidBody2D.prototype.update = function(){
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
	
	
	RigidBody2D.prototype.applyForce = function( force, worldPoint, wake ){
	    
	    this.body.applyForce( force, worldPoint, wake );
	};
	
	
	RigidBody2D.prototype.applyTorque = function( torque, wake ){
	    
	    this.body.applyTorque( torque, wake );
	};
	
	
	RigidBody2D.prototype.applyImpulse = function( impulse, worldPoint, wake ){
	    
	    this.body.applyImpulse( impulse, worldPoint, wake );
	};
	
	
	RigidBody2D.DYNAMIC = PBody2D.DYNAMIC;
	RigidBody2D.STATIC = PBody2D.STATIC;
	RigidBody2D.KINEMATIC = PBody2D.KINEMATIC;
	
        
        return RigidBody2D;
    }
);