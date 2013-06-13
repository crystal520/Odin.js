if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/psolver2d",
	"physics2d/constraints/pfriction2d",
	"physics2d/collision/pbroadphase2d",
	"physics2d/collision/pnearphase2d",
	"physics2d/shape/pshape2d",
	"physics2d/body/pparticle2d",
	"physics2d/body/pbody2d"
    ],
    function( Class, Mathf, Vec2, PSolver2D, PFriction2D, PBroadphase2D, PNearphase2D, PShape2D, PParticle2D, PBody2D ){
        "use strict";
	
	var pow = Math.pow,
	    min = Math.min,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    BOX = PShape2D.BOX,
	    CONVEX = PShape2D.CONVEX,
	    
	    AWAKE = PParticle2D.AWAKE,
	    SLEEPY = PParticle2D.SLEEPY,
	    SLEEPING = PParticle2D.SLEEPING,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    frictionPool = [];
	
        
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.allowSleep = opts.allowSleep !== undefined ? opts.allowSleep : true;
	    
	    this.dt = 1 / 60;
	    this.time = 0;
	    
	    this.bodies = [];
	    
	    this.contacts = [];
	    this.frictions = [];
	    
	    this.pairsi = [];
	    this.pairsj = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.solver = new PSolver2D();
	    
	    this.broadphase = new PBroadphase2D( opts );
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
		removeList = this._removeList,
		body, index, i, il;
	    
	    for( i = removeList.length; i--; ){
		body = removeList[i];
		index = bodies.indexOf( body );
		
		if( index !== -1 ){
		    bodies.splice( index, 1 );
		    body.trigger("remove");
		}
	    }
	    
	    removeList.length = 0;
	};
	
	
	PWorld2D.prototype.now = function(){
	    var startTime = Date.now(),
		w = window || {},
		performance = w.performance || function(){
		    this.now = function(){
			return Date.now() - startTime;
		    }
		};
	    
	    return function(){
		
		return performance.now() * 0.001;
	    }
	}();
	
	
	PWorld2D.prototype.step = function( dt ){
	    var debug = this.debug,
		now = this.now,
		profile = this.profile, profileStart,
		
		gravity = this.gravity,
		gn = gravity.len(),
		bodies = this.bodies,
		solver = this.solver,
		solverConstraints = solver.constraints,
		pairsi = this.pairsi, pairsj = this.pairsj,
		contacts = this.contacts, frictions = this.frictions,
		c, bi, bj, um, umg, c1, c2,
		
		body, shape, shapeType, type, force, vel, aVel, linearDamping, pos, mass, invMass,
		i;
	    
	    this.time += dt;
	    
	    for( i = bodies.length; i--; ){
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
	    
	    this.nearphase.collisions( this, pairsi, pairsj, contacts );
	    
	    for( i = frictions.length; i--; ){
		frictionPool.push( frictions[i] );
	    }
	    frictions.length = 0;
	    
	    for( i = contacts.length; i--; ){
		c = contacts[i];
		bi = c.bi; bj = c.bj;
		
		solverConstraints.push( c );
		
		um = min( bi.friction, bj.friction );
		
		if( um > 0 ){
		    umg = um * gn;
		    mass = bi.invMass + bj.invMass;
		    mass = mass > 0 ? 1 / mass : 0;
		    
		    c1 = frictionPool.length ? frictionPool.pop() : new PFriction2D( bi, bj, umg * mass );
		    c2 = frictionPool.length ? frictionPool.pop() : new PFriction2D( bi, bj, umg * mass );
		    
		    frictions.push( c1, c2 );
		    
		    c1.bi = c2.bi = bi;
		    c1.bj = c2.bj = bj;
		    c1.minForce = c2.minForce = -umg * mass;
		    c1.maxForce = c2.maxForce = umg * mass;
		    
		    c1.ri.x = c2.ri.x = c.ri.x;
		    c1.ri.y = c2.ri.y = c.ri.y;
		    c1.rj.x = c2.rj.x = c.rj.x;
		    c1.rj.y = c2.rj.y = c.rj.y;
		    
		    c1.t.copy( c.n ).perpL();
		    c2.t.copy( c.n ).perpR();
		    
		    solverConstraints.push( c1, c2 );
		}
	    }
	    
	    if( debug ) profile.nearphase = now() - profileStart;
	    
	    
	    if( debug ) profileStart = now();
	    
	    solver.solve( this, dt );
	    solverConstraints.length = 0;
	    
	    if( debug ) profile.solve = now() - profileStart;
	    
	    
	    if( debug ) profileStart = now();
	    
	    for( i = bodies.length; i--; ){
		body = bodies[i];
		
		shape = body.shape;
		shapeType = shape.type;
		
		type = body.type;
		force = body.force;
		vel = body.velocity;
		aVel = body.angularVelocity;
		linearDamping = body.linearDamping;
		pos = body.position;
		invMass = body.invMass;
		
		body.trigger("prestep");
		
		if( type === DYNAMIC ){
		    
		    vel.x *= pow( 1 - linearDamping.x, dt );
		    vel.y *= pow( 1 - linearDamping.y, dt );
		    
		    if( aVel !== undefined ) body.angularVelocity *= pow( 1 - body.angularDamping, dt );
		}
		
		if( type === DYNAMIC || type === KINEMATIC ){
		    
		    vel.x += force.x * invMass * dt;
		    vel.y += force.y * invMass * dt;
		    
		    if( aVel !== undefined ) body.angularVelocity += body.torque * body.invInertia * dt;
		    
		    if( body.sleepState !== SLEEPING ){
			pos.x += vel.x * dt;
			pos.y += vel.y * dt;
			
			if( aVel !== undefined ) body.rotation += aVel * dt;
			
			if( body.aabb ) body.aabbNeedsUpdate = true;
		    }
		}
		
		body.R.setRotation( body.rotation );
		
		force.x = 0;
		force.y = 0;
		
		if( body.torque ) body.torque = 0;
		
		if( this.allowSleep ) body.sleepTick( this.time );
		
		body.trigger("poststep");
	    }
	    
	    if( debug ) profile.integration = now() - profileStart;
	    
	    if( this._removeList.length ){
		this._remove();
	    }
	};
	
        
        return PWorld2D;
    }
);