if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/aabb2",
	"physics2d/body/pbody2d",
	"physics2d/shape/pshape2d",
	"physics2d/shape/prect"
    ],
    function( Class, Mathf, Vec2, AABB2, PBody2D, PShape2D, PRect ){
	"use strict";
	
	var pow = Math.pow,
	    
	    AWAKE = PBody2D.AWAKE,
	    SLEEPY = PBody2D.SLEEPY,
	    SLEEPING = PBody2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    RECT = PShape2D.RECT,
	    CONVEX = PShape2D.CONVEX;
	
	
	function PRigidBody2D( opts ){
	    opts || ( opts = {} );
	    
	    PBody2D.call( this, opts );
	    
	    this.shape = opts.shape !== undefined ? opts.shape : new PRect;
	    
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0;
	    
	    this.inertia = this.shape.calculateInertia( this.mass );
	    this.invInertia = this.inertia === 0 ? 0 : 1 / this.inertia;
	    
	    this.torque = 0;
	    this.wlambda = 0;
	    
	    this.aabb = new AABB2;
	    this.aabbNeedsUpdate = true;
	}
	
	Class.extend( PRigidBody2D, PBody2D );
	
	
	PRigidBody2D.prototype.calculateAABB = function(){
	    
	    this.shape.calculateWorldAABB( this.position, this.rotation, this.aabb );
	    this.aabbNeedsUpdate = false;
	};
	
	
	PRigidBody2D.prototype.applyForce = function(){
	    var point = new Vec2;
	    
	    return function( force, worldPoint, wake ){
		
		if( this.type === STATIC ){
		    return;
		}
		
		if( wake && this.sleepState === SLEEPING ){
		    this.wake();
		}
		
		point.vsub( worldPoint || this.position, this.position );
		
		this.force.add( force );
		this.torque += point.cross( force );
	    };
	}();
	
	
	PRigidBody2D.prototype.applyTorque = function( torque, wake ){
	    
	    if( this.type === STATIC ){
		return;
	    }
	    
	    if( wake && this.sleepState === SLEEPING ){
		this.wake();
	    }
	    
	    this.torque += torque;
	};
	
	
	PRigidBody2D.prototype.applyImpulse = function(){
	    var point = new Vec2,
		vel = new Vec2;
	    
	    return function( impulse, worldPoint, wake ){
		
		if( this.type === STATIC ){
		    return;
		}
		
		if( wake && this.sleepState === SLEEPING ){
		    this.wake();
		}
		
		vel.copy( impulse ).smul( this.invMass );
		this.velocity.add( vel );
		
		point.vsub( worldPoint || this.position, this.position );
		this.angularVelocity += this.invInertia * point.cross( impulse );
	    };
	}();
	
	
	return PRigidBody2D;
    }
);