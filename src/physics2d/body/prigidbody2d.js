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
	    POLY = PShape2D.POLY;
	
	
	function PRigidBody2D( opts ){
	    opts || ( opts = {} );
	    
	    PBody2D.call( this, opts );
	    
	    this.shape = opts.shape !== undefined ? opts.shape : new PRect;
	    
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0;
	    
	    this.elasticity = opts.elasticity !== undefined ? opts.elasticity : 0.5;
	    this.friction = opts.friction !== undefined ? opts.friction : 0.25;
	    
	    this.inertia = this.shape.calculateInertia( this.mass );
	    this.invInertia = this.inertia <= 0 ? 0 : 1 / this.inertia;
	    
	    this.torque = 0;
	    
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
	    
	    return function( force, worldPoint ){
		worldPoint = worldPoint || this.position;
		
		point.vsub( worldPoint, this.position );
		
		this.force.add( force );
		this.torque += point.cross( force );
	    };
	}();
	
	
	PRigidBody2D.prototype.applyImpulse = function(){
	    var point = new Vec2,
		vel = new Vec2;
	    
	    return function( impulse, worldPoint ){
		worldPoint = worldPoint || this.position;
		
		point.vsub( worldPoint, this.position );
		
		vel.copy( impulse );
		vel.smul( this.invMass );
		
		this.velocity.add( vel );
		this.angularVelocity += this.invInertia * point.cross( impulse );
	    };
	}();
	
	
	PRigidBody2D.prototype.updateShape = function(){
	    
	    this.shape.update( this );
	};
	
	
	PRigidBody2D.prototype.update = function(){
	    var linearDamping = new Vec2;
	    
	    return function( dt ){
		var world = this.world,
		    gravity = world.gravity,
		    
		    sleepState = this.sleepState,
		    type = this.type,
		    
		    shape = this.shape,
		    shapeType = shape.type,
		    
		    force = this.force,
		    vel = this.velocity,
		    pos = this.position,
		    mass = this.mass, invMass = this.invMass,
		    invInertia = this.invInertia;
		
		this.trigger("prestep");
		
		if( type === DYNAMIC ){
		    force.x += gravity.x * mass;
		    force.y += gravity.y * mass;
		    
		    linearDamping.x = pow( 1 - this.linearDamping.x, dt );
		    linearDamping.y = pow( 1 - this.linearDamping.y, dt );
		    
		    vel.mul( linearDamping );
		    
		    this.angularVelocity *= pow( 1 - this.angularDamping, dt );
		}
		
		if( type === DYNAMIC || type === KINEMATIC ){
		    vel.x += force.x * invMass * dt;
		    vel.y += force.y * invMass * dt;
		    
		    this.angularVelocity += this.torque * invInertia * dt;
		    
		    if( sleepState !== SLEEPING ){
			pos.x += vel.x * dt;
			pos.y += vel.y * dt;
			
			this.rotation += this.angularVelocity * dt;
			
			this.aabbNeedsUpdate = true;
			
			if( shapeType === RECT || shapeType === POLY ){
			    shape.calculateWorldVertices( pos, this.rotation );
			    shape.calculateWorldNormals( this.rotation );
			}
		    }
		}
		
		force.x = 0;
		force.y = 0;
		this.torque = 0;
		
		this.trigger("poststep");
		
		if( world.allowSleep ){
		    this.sleepTick( world.time );
		}
	    };
	}();
	
	
	return PRigidBody2D;
    }
);