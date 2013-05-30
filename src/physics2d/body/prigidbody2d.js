if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2",
	"physics2d/body/pbody2d",
	"physics2d/body/pparticle2d",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pbox2d",
    ],
    function( Class, Vec2, AABB2, PBody2D, PParticle2D, PShape2D, PBox2D ){
        "use strict";
	
	var AWAKE = PParticle2D.AWAKE,
	    SLEEPY = PParticle2D.SLEEPY,
	    SLEEPING = PParticle2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
        
	function PRigidBody2D( opts ){
	    opts || ( opts = {} );
	    
	    PParticle2D.call( this, opts );
	    
	    this.shape = opts.shape instanceof PShape2D ? opts.shape : new PBox2D;
	    this.shape.body = this;
	    
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0;
	    
	    this.aabb = new AABB2;
	    this.aabbNeedsUpdate = true;
	    
	    this.torque = 0;
	    
	    this.inertia = this.shape.calculateInertia( this.mass );
	    this.invInertia = this.inertia > 0 ? 1 / this.inertia : 0;
	    
	    this.wlambda = 0;
	    
	    this._sleepMinAngularVelocity = 0.1;
	}
	
	Class.extend( PRigidBody2D, PParticle2D );
	
	
	PRigidBody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    angularVelSq = this.angularVelocity * this.angularVelocity,
		    
		    sleepMinVel = this._sleepMinVelocity,
		    sleepMinVelSq = sleepMinVel * sleepMinVel,
		    
		    sleepMinAngularVel = this._sleepMinAngularVelocity,
		    sleepMinAngularVelSq = sleepMinAngularVel * sleepMinAngularVel;
		
		if( sleepState === AWAKE && velSq < sleepMinVelSq && angularVelSq < sleepMinAngularVelSq ){
		    this.sleepState = SLEEPY;
		    this._sleepLastSleepy = time;
		    this.trigger("sleepy");
		}
		else if( sleepState === SLEEPY && velSq > sleepMinVelSq && angularVelSq > sleepMinAngularVelSq ){
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this.timeLastSleepy ) > this._sleepTimeLimit ){
		    this.sleep();
		}
	    }
	};
	
	
	PRigidBody2D.prototype.calculateAABB = function(){
	    
	    this.shape.calculateWorldAABB( this.position, this.rotation, this.aabb );
	    this.aabbNeedsUpdate = false;
	};


	PRigidBody2D.prototype.applyForce = function(){
	    var point = new Vec2;
	    
	    return function( force, worldPoint, wake ){
		var position = this.position;
		
		worldPoint = worldPoint || position;
		
		if( this.type === STATIC ){
		    return;
		}
		
		if( wake && this.sleepState === SLEEPING ){
		    this.wake();
		}
		
		point.x = worldPoint.x - position.x;
		point.y = worldPoint.y - position.y;
		
		this.force.add( force );
		this.torque += point.cross( force );
	    };
	}();
	
	
	PRigidBody2D.prototype.applyImpulse = function(){
	    var point = new Vec2,
		vel = new Vec2;
		
	    return function( impulse, worldPoint, wake ){
		var position = this.position,
		    velocity = this.velocity,
		    invMass = this.invMass;
		
		worldPoint = worldPoint || position;
		
		if( this.type === STATIC ){
		    return;
		}
		
		if( wake && this.sleepState === SLEEPING ){
		    this.wake();
		}
		
		velocity.x += impulse.x * invMass;
		velocity.y += impulse.y * invMass;
		
		point.x = worldPoint.x - position.x;
		point.y = worldPoint.y - position.y;
		
		this.angularVelocity += this.invInertia * point.cross( impulse );
	    };
	}();
	
        
        return PRigidBody2D;
    }
);