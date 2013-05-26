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
	    
	    this.shape = opts.shape instanceof PShape2D ? opts.shape : new PRect;
	    
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0.01;
	    
	    this.inertia = this.shape.calculateInertia( this.mass );
	    this.invInertia = this.inertia === 0 ? 0 : 1 / this.inertia;
	    
	    this.torque = 0;
	    this.wlambda = 0;
	    
	    this.aabb = new AABB2;
	    this.aabbNeedsUpdate = true;
	    
	    this._sleepAngularVelocityLimit = 0.05;
	}
	
	Class.extend( PRigidBody2D, PBody2D );
	
	
	PRigidBody2D.prototype.calculateAABB = function(){
	    
	    this.shape.calculateWorldAABB( this.position, this.rotation, this.aabb );
	    this.aabbNeedsUpdate = false;
	};
	
	
	PRigidBody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    aVelSq = this.angularVelocity * this.angularVelocity,
		    
		    sleepVelLimitSq = this._sleepVelocityLimit * this._sleepVelocityLimit,
		    sleepAVelLimitSq = this._sleepAngularVelocityLimit * this._sleepAngularVelocityLimit;
		
		if( sleepState === AWAKE && velSq < sleepVelLimitSq && aVelSq < sleepAVelLimitSq ){
		    
		    this.sleepy();
		    this._timeLastSleepy = time;
		}
		else if( sleepState === SLEEPY && ( velSq > sleepVelLimitSq || aVelSq > sleepAVelLimitSq ) ){
		    
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._timeLastSleepy ) > this._timeLastSleepy ){
		    
		    this.sleep();
		}
	    }
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