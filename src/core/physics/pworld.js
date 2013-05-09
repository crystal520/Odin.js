if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"core/physics/collision/pbroadphase",
	"core/physics/objects/prigidbody"
    ],
    function( Class, Time, Vec2, PBroadphase, PRigidBody ){
	"use strict";
	
	var DYNAMIC = PRigidBody.DYNAMIC,
	    KINEMATIC = PRigidBody.KINEMATIC,
	    STATIC = PRigidBody.STATIC;
	
	
        function PWorld( opts ){
            opts || ( opts = {} );
	    
            Class.call( this );
	    
	    this.broadphase = new PBroadphase( this );
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, 0 );
	    
	    this.bodies = [];
	    
	    this.contacts = [];
        }
        
	Class.extend( PWorld, Class );
	
	
	PWorld.prototype.add = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index === -1 ){
		body.world = this;
		bodies.push( body );
	    }
	};
	
	
	PWorld.prototype.remove = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index !== -1 ){
		body.world = undefined;
		bodies.splice( index, 1 );
	    }
	};
	
	
	PWorld.prototype.step = function( dt ){
	    var bodies = this.bodies,
		gravity = this.gravity,
		n = bodies.length,
		body, mass, i, il,
		force, torque,
		vel, aVel, pos, invMass, invInertia;
	    
	    this.broadphase.intersectionTest();
	    
	    for( i = 0; i !== n; i++ ){
		body = bodies[i];
		
		if( body.type === DYNAMIC ){
		    mass = body.mass;
		    body.force.add( gravity ).smul( mass );
		}
	    }
	    
	    
	    for( i = 0; i !== n; i++ ){
		body = bodies[i];
		force = body.force;
		torque = body.torque;
		
		if( body.type === DYNAMIC || body.type === KINEMATIC ){
		    vel = body.velocity;
		    aVel = body.angularVelocity;
		    pos = body.position;
		    invMass = body.invMass;
		    invInertia = body.invInertia;
		    
		    vel.x += force.x * invMass * dt;
		    vel.y += force.y * invMass * dt;
		    
		    if( aVel ){
			aVel += torque * invInertia * dt;
		    }
		    
		    if( !body.isSleeping() ){
			pos.x += vel.x * dt;
			pos.y += vel.y * dt;
			
			if( aVel ){
			    body.rotation += aVel * dt;
			}
		    }
		}
		
		force.zero();
		if( torque ){
		    torque = 0;
		}
	    }
	};
	
        
        return PWorld;
    }
);