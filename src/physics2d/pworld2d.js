if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/psolver2d",
	"physics2d/collision/pbroadphase2d",
	"physics2d/collision/pnearphase2d",
	"physics2d/shape/pshape2d",
	"physics2d/body/pparticle2d",
	"physics2d/body/pbody2d"
    ],
    function( Class, Mathf, Vec2, PSolver2D, PBroadphase2D, PNearphase2D, PShape2D, PParticle2D, PBody2D ){
        "use strict";
	
	var pow = Math.pow,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    RECT = PShape2D.RECT,
	    CONVEX = PShape2D.CONVEX,
	    
	    AWAKE = PParticle2D.AWAKE,
	    SLEEPY = PParticle2D.SLEEPY,
	    SLEEPING = PParticle2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
        
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.allowSleep = opts.allowSleep !== undefined ? opts.allowSleep : true;
	    
	    this.dt = 1 / 60;
	    
	    this.bodies = [];
	    
	    this.contacts = [];
	    
	    this.pairsi = [];
	    this.pairsj = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.solver = new PSolver2D();
	    
	    this.broadphase = new PBroadphase2D( opts.useBoundingRadius );
	    this.nearphase = new PNearphase2D;
	    
	    this.debug = opts.debug !== undefined ? opts.debug : true;
	    
	    this.profile = {
		solve: 0,
		integration: 0,
		broadphase:0,
		nearphase:0
	    };
	    
	    this._removeList = [];
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
		max = 0.25,
		lastTime = 0,
		ddt = 1 / 60,
		time = 0,
		now, startTime = Date.now(),
		performance = performance || {};
		
		now = performance.now = function(){
		    return (
			performance.now ||
			performance.mozNow ||
			performance.msNow ||
			performance.oNow ||
			performance.webkitNow ||
			function(){
			    return Date.now() - startTime; 
			}
		    );
		}();
		
	    return function( dt ){
		var debug = this.debug,
		    profile = this.profile, profileStart,
		    
		    gravity = this.gravity,
		    bodies = this.bodies,
		    solver = this.solver,
		    solverConstraints = solver.constraints,
		    pairsi = this.pairsi, pairsj = this.pairsj,
		    c, contacts = this.contacts,
		    
		    body, sleepState, type, shape, shapeType, force, vel, linearDamping, pos, mass, invMass, invInertia,
		    i, il;
		    
		this.time = time += dt;
		
		accumulator += time - lastTime;
		accumulator = accumulator > max ? max : accumulator;
		this.dt = dt = dt !== 0 ? dt : ddt;
		
		while( accumulator >= dt ){
		    
		    if( debug ) profileStart = now();
		    this.broadphase.collisionPairs( this, pairsi, pairsj );
		    if( debug ) profile.broadphase = now() - profileStart;
		    
		    
		    if( debug ) profileStart = now();
		    this.nearphase.collisions( this, pairsi, pairsj, contacts );
		    
		    for( i = 0, il = contacts.length; i < il; i++ ){
			solverConstraints.push( contacts[i] );
		    }
		    if( debug ) profile.nearphase = now() - profileStart;
		    
		    
		    if( debug ) profileStart = now();
		    solver.solve( this, dt );
		    solverConstraints.length = 0;
		    if( debug ) profile.solve = now() - profileStart;
		    
		    
		    if( debug ) profileStart = now();
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
			
			force.x = 0;
			force.y = 0;
			
			if( body.torque ) body.torque = 0;
			
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
			
			if( this.allowSleep ) body.sleepTick( time );
			
			body.trigger("poststep");
		    }
		    if( debug ) profile.integration = now() - profileStart;
		    
		    accumulator -= dt;
		}
		
		if( this._removeList.length ){
		    this._remove();
		}
		
		lastTime = time;
	    };
	}();
	
        
        return PWorld2D;
    }
);