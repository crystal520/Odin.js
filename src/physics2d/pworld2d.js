if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/psolver2d",
	"physics2d/collision/pbroadphase2d",
	"physics2d//collision/pnearphase2d",
	"physics2d/shape/pshape2d",
	"physics2d/body/pbody2d",
	"physics2d/constraints/pfrictionequation2d"
    ],
    function( Class, Mathf, Vec2, PSolver2D, PBroadphase2D, PNearphase2D, PShape2D, PBody2D, PFrictionEquation2D ){
	"use strict";
	
	var pow = Math.pow,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    RECT = PShape2D.RECT,
	    CONVEX = PShape2D.CONVEX,
	    
	    AWAKE = PBody2D.AWAKE,
	    SLEEPY = PBody2D.SLEEPY,
	    SLEEPING = PBody2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.time = 0;
	    this.allowSleep = true;
	    
	    this.bodies = [];
	    
	    this.contacts = [];
	    this.frictionEquations = [];
	    
	    this.pairsi = [];
	    this.pairsj = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.broadphase = new PBroadphase2D( opts.aabbBroadphase );
	    this.nearphase = new PNearphase2D();
	    this.solver = new PSolver2D();
	    
	    this.removeList = [];
	}
	
	Class.extend( PWorld2D, Class );
	
	
	PWorld2D.prototype.add = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index === -1 ){
		body.world = this;
		bodies.push( body );
		body.trigger("add");
	    }
	};
	
	
	PWorld2D.prototype.remove = function( body ){
	    
	    this._removeList.push( body );
	};
	
	
	PWorld2D.prototype._remove = function(){
	    var bodies = this.bodies,
		removeList = this.removeList,
		body, index, i, il;
	    
	    for( i = 0, il = removeList.length; i < il; i++ ){
		body = removeList[i];
		index = bodies.indexOf( body );
		
		if( index !== -1 ){
		    bodies.splice( index, 1 );
		    body.trigger("remove");
		}
	    }
	};
	
	
	PWorld2D.prototype.step = function(){
	    var accumulator = 0,
		frictionPool = [],
		max = 0.25,
		lastTime = 0,
		mindt = 1 / 60,
		time = 0;
	    
	    return function( dt ){
		var gravity = this.gravity,
		    bodies = this.bodies,
		    solver = this.solver,
		    pairsi = this.pairsi, pairsj = this.pairsj,
		    c, contacts = this.contacts, frictionEquations = this.frictionEquations,
		    
		    body, sleepState, type, shape, shapeType, force, vel, linearDamping, pos, mass, invMass, invInertia,
		    i, il;
		
		this.time = time += dt;
		
		accumulator += time - lastTime;
		accumulator = accumulator > max ? max : accumulator;
		dt = dt !== 0 ? dt : mindt;
		
		if( this.removeList.length ){
		    this._remove();
		}
		
		while( accumulator >= dt ){
		    
		    for( i = 0, il = frictionEquations.length; i < il; i++ ){
			frictionPool.push( frictionEquations[i] );
		    }
		    frictionEquations.length = 0;
		    
		    this.broadphase.collisionPairs( this, pairsi, pairsj );
		    this.nearphase.collisions( this, pairsi, pairsj, contacts );
		    
		    for( i = 0, il = contacts.length; i < il; i++ ){
			c = contacts[i];
			solver.add( c );
		    }
		    
		    solver.solve( dt, this );
		    solver.clear();
		    
		    for( i = 0, il = bodies.length; i < il; i++ ){
			body = bodies[i];
			
			sleepState = body.sleepState;
			type = body.type;
			shape = body.shape;
			shapeType = shape.type
			force = body.force;
			vel = body.velocity;
			linearDamping = body.linearDamping;
			pos = body.position;
			mass = body.mass;
			invMass = body.invMass;
			invInertia = body.invInertia;
			
			body.trigger("prestep");
			
			if( type === DYNAMIC ){
			    force.x += gravity.x * mass;
			    force.y += gravity.y * mass;
			    
			    vel.x *= pow( 1 - linearDamping.x, dt );
			    vel.y *= pow( 1 - linearDamping.y, dt );
			    
			    if( body.angularVelocity !== undefined ) body.angularVelocity *= pow( 1 - body.angularDamping, dt );
			}
			
			if( type === DYNAMIC || type === KINEMATIC ){
			    
			    vel.x += force.x * invMass * dt;
			    vel.y += force.y * invMass * dt;
			    
			    if( body.angularVelocity !== undefined ) body.angularVelocity += body.torque * invInertia * dt;
			    
			    if( sleepState !== SLEEPING ){
				pos.x += vel.x * dt;
				pos.y += vel.y * dt;
				
				if( body.angularVelocity !== undefined ) body.rotation += body.angularVelocity * dt;
				
				body.aabbNeedsUpdate = true;
				
				if( shapeType === RECT || shapeType === CONVEX ){
				    body.worldVerticesNeedsUpdate = true;
				    body.worldNormalsNeedsUpdate = true;
				}
			    }
			}
			
			force.x = 0;
			force.y = 0;
			body.torque = 0;
			
			if( this.allowSleep ) body.sleepTick( time );
			
			body.trigger("poststep");
		    }
		    
		    accumulator -= dt;
		}
		
		lastTime = time;
	    };
	}();
	
	
	return PWorld2D;
    }
);