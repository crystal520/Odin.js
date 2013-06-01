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
	"physics2d/constraints/pfriction2d",
	"physics2d/shape/pshape2d",
	"physics2d/body/pparticle2d",
	"physics2d/body/pbody2d"
    ],
    function( Class, Mathf, Vec2, PSolver2D, PBroadphase2D, PNearphase2D, PFriction2D, PShape2D, PParticle2D, PBody2D ){
        "use strict";
	
	var pow = Math.pow,
	    mMax = Math.max,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    BOX = PShape2D.BOX,
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
	    this.frictions = [];
	    
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
		frictionsPool = [],
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
		    gn = gravity.len(),
		    bodies = this.bodies,
		    solver = this.solver,
		    solverConstraints = solver.constraints,
		    pairsi = this.pairsi, pairsj = this.pairsj,
		    c, c1, c2, bi, bj, mu, mug,
		    frictions = this.frictions, contacts = this.contacts,
		    
		    body, type, force, vel, linearDamping, pos, mass, invMass,
		    i, il;
		
		this.time = time += dt;
		
		accumulator += time - lastTime;
		accumulator = accumulator > max ? max : accumulator;
		this.dt = dt = dt !== 0 ? dt : ddt;
		
		while( accumulator >= dt ){
		    
		    for( i = 0, il = bodies.length; i < il; i++ ){
			body = bodies[i];
			force = body.force;
			mass = body.mass;
			
			if( body.type === DYNAMIC ){
			    force.x += gravity.x * mass;
			    force.y += gravity.y * mass;
			}
		    }
		    
		    if( debug ) profileStart = now();
		    
		    this.broadphase.collisionPairs( this, pairsi, pairsj );
		    
		    if( debug ) profile.broadphase = now() - profileStart;
		    
		    
		    if( debug ) profileStart = now();
		    
		    for( i = 0, il = frictions.length; i < il; i++ ){
			frictionsPool.push( frictions[i] );
		    }
		    frictions.length = 0;
		    
		    this.nearphase.collisions( this, pairsi, pairsj, contacts );
		    
		    for( i = 0, il = contacts.length; i < il; i++ ){
			c = contacts[i];
			solverConstraints.push( c );
			
			bi = c.bi; bj = c.bj;
			mu = mMax( bi.friction, bj.friction );
			
			if( mu > 0 ){
			    mug = mu / gn;
			    mass = bi.invMass + bj.invMass;
			    mass = mass > 0 ? 1 / mass : mass;
			    
			    c1 = frictionsPool.length ? frictionsPool.pop() : new PFriction2D( bi, bj, mug * mass );
			    c2 = frictionsPool.length ? frictionsPool.pop() : new PFriction2D( bi, bj, mug * mass );
			    frictions.push( c1, c2 );
			    
			    c1.bi = c2.bi = bi;
			    c1.bj = c2.bj = bj;
			    c1.min = c2.min = -mug * mass;
			    c1.max = c2.max = mug * mass;
			    
			    c1.ri.x = c2.ri.x = c.ri.x;
			    c1.ri.y = c2.ri.y = c.ri.y;
			    
			    c1.rj.x = c2.rj.x = c.rj.x;
			    c1.rj.y = c2.rj.y = c.rj.y;
			    
			    c1.t.x = c.n.y;
			    c1.t.y = -c.n.x;
			    
			    c2.t.x = -c.n.y;
			    c2.t.y = c.n.x;
			    
			    solverConstraints.push( c1, c2 );
			}
		    }
		    
		    if( debug ) profile.nearphase = now() - profileStart;
		    
		    
		    if( debug ) profileStart = now();
		    
		    solver.solve( this, dt );
		    solverConstraints.length = 0;
		    
		    if( debug ) profile.solve = now() - profileStart;
		    
		    
		    if( debug ) profileStart = now();
		    
		    for( i = 0, il = bodies.length; i < il; i++ ){
			body = bodies[i];
			
			type = body.type;
			force = body.force;
			vel = body.velocity;
			linearDamping = body.linearDamping;
			pos = body.position;
			mass = body.mass;
			invMass = body.invMass;
			
			body.trigger("prestep");
			
			if( type === DYNAMIC ){
			    
			    vel.x *= pow( 1 - linearDamping.x, dt );
			    vel.y *= pow( 1 - linearDamping.y, dt );
			    
			    if( body.angularVelocity !== undefined ) body.angularVelocity *= pow( 1 - body.angularDamping, dt );
			}
			
			if( type === DYNAMIC || type === KINEMATIC ){
			    
			    vel.x += force.x * invMass * dt;
			    vel.y += force.y * invMass * dt;
			    
			    if( body.angularVelocity !== undefined ) body.angularVelocity += body.torque * body.invInertia * dt;
			    
			    if( body.sleepState !== SLEEPING ){
				pos.x += vel.x * dt;
				pos.y += vel.y * dt;
				
				if( body.angularVelocity !== undefined ) body.rotation += body.angularVelocity * dt;
				
				if( body.aabb ) body.aabbNeedsUpdate = true;
			    }
			}
			
			force.x = 0;
			force.y = 0;
			
			if( body.torque ) body.torque = 0;
			
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