if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/mat2",
	"math/aabb2",
	"physics2d/body/pbody2d",
	"physics2d/body/pparticle2d",
	"physics2d/shape/pshape2d",
	"physics2d/shape/pbox2d",
    ],
    function( Class, Vec2, Mat2, AABB2, PBody2D, PParticle2D, PShape2D, PBox2D ){
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
	    this.R = new Mat2;
	    
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0.1;
	    
	    this.aabb = new AABB2;
	    this.aabbNeedsUpdate = true;
	    
	    this.torque = 0;
	    
	    this.inertia = this.shape.calculateInertia( this.mass );
	    this.invInertia = this.inertia > 0 ? 1 / this.inertia : 0;
	    
	    this.density = this.mass / this.shape.volume;
	    
	    this.wlambda = 0;
	    
	    this._sleepAngularVelocity = 0.001;
	}
	
	Class.extend( PRigidBody2D, PParticle2D );
	
	
	PRigidBody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    
		    aVel = this.angularVelocity,
		    aVelSq = aVel * aVel,
		    
		    sleepVel = this._sleepVelocity,
		    sleepVelSq = sleepVel * sleepVel,
		    
		    sleepAVel = this._sleepAngularVelocity,
		    sleepAVelSq = sleepAVel * sleepAVel;
		
		if( sleepState === AWAKE && ( velSq < sleepVelSq || aVelSq < sleepAVelSq ) ){
		    this._sleepLastSleepy = time;
		    this.sleepState = SLEEPY;
		    this.trigger("sleepy");
		}
		else if( sleepState === SLEEPY && ( velSq > sleepVelSq || aVelSq > sleepAVelSq ) ){
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._sleepLastSleepy ) > this._sleepTimeLimit ){
		    this.sleep();
		}
	    }
	};
	
	
	PRigidBody2D.prototype.calculateAABB = function(){
	    
	    this.shape.calculateWorldAABB( this.position, this.R.elements, this.aabb );
	    this.aabbNeedsUpdate = false;
	};
	
	
	PRigidBody2D.prototype.applyForce = function( addForce, worldPoint, wake ){
	    var pos = this.position,
		force = this.force,
		fx = addForce.x, fy = addForce.y,
		px, py;
	    
	    worldPoint = worldPoint || pos;
	    
	    if( this.type === STATIC ){
		return;
	    }
	    
	    if( wake && this.sleepState === SLEEPING ){
		this.wake();
	    }
	    
	    px = worldPoint.x - pos.x;
	    py = worldPoint.y - pos.y;
	    
	    force.x += fx;
	    force.y += fy;
	    
	    this.torque += px * fy - py * fx;
	};
	
	
	PRigidBody2D.prototype.applyTorque = function( torque, wake ){
	    
	    if( this.type === STATIC ){
		return;
	    }
	    
	    if( wake && this.sleepState === SLEEPING ){
		this.wake();
	    }
	    
	    this.torque += torque;
	};
	
	
	PRigidBody2D.prototype.applyImpulse = function( impulse, worldPoint, wake ){
	    var pos = this.position,
		invMass = this.invMass,
		velocity = this.velocity,
		ix = impulse.x, iy = impulse.y,
		px, py;
	    
	    worldPoint = worldPoint || pos;
	    
	    if( this.type === STATIC ){
		return;
	    }
	    
	    if( wake && this.sleepState === SLEEPING ){
		this.wake();
	    }
	    
	    px = worldPoint.x - pos.x;
	    py = worldPoint.y - pos.y;
	    
	    velocity.x += ix * invMass;
	    velocity.y += iy * invMass;
	    
	    this.angularVelocity += ( px * iy - py * ix ) * this.invInertia;
	};
	
        
        return PRigidBody2D;
    }
);