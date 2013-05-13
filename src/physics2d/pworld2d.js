if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/body/pbody2d"
    ],
    function( Class, Vec2, PBody2D ){
	"use strict";
	
	var pow = Math.pow,
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.bodies = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	}
	
	Class.extend( PWorld2D, Class );
	
	
	PWorld2D.prototype.add = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index === -1 ){
		body.world = this;
		bodies.push( body );
	    }
	};
	
	
	PWorld2D.prototype.remove = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index !== -1 ){
		body.world = undefined;
		bodies.splice( index, 1 );
	    }
	};
	
	
	PWorld2D.prototype.step = function(){
	    var linearDamping = new Vec2;
	    
	    return function( dt ){
		var bodies = this.bodies,
		    gravity = this.gravity,
		    body, i, il,
		    type, mass, invMass, invInertia, force, torque,
		    vel, aVel, angularDamping,
		    pos;
		
		for( i = 0, il = bodies.length; i < il; i++ ){
		    body = bodies[i];
		    type = body.type;
		    mass = body.mass;
		    force = body.force;
		    torque = body.torque;
		    vel = body.velocity;
		    aVel = body.angularVelocity;
		    pos = body.position;
		    
		    if( type === DYNAMIC ){
			force.x += gravity.x * mass;
			force.y += gravity.y * mass;
			
			linearDamping.set(
			    pow( 1 - body.linearDamping.x, dt ),
			    pow( 1 - body.linearDamping.y, dt )
			);
			
			vel.mul( linearDamping );
			
			if( aVel ){
			    angularDamping = pow( 1 - body.angularDamping, dt );
			    aVel *= angularDamping;
			}
		    }
		    
		    if( type === DYNAMIC || type === KINEMATIC ){
			invMass = body.invMass;
			invInertia = body.invInertia;
			
			vel.x += force.x * invMass * dt;
			vel.y += force.y * invMass * dt;
			
			if( aVel ){
			    aVel += torque * invMass * dt;
			}
			
			if( !body.isSleeping() ){
			    pos.x += vel.x * dt;
			    pos.y += vel.y * dt;
			    
			    if( aVel ){
				body.rotation += aVel * dt;
			    }
			    
			    if( body.aabb ){
				body.aabbNeedsUpdate = true;
			    }
			}
		    }
		    
		    force.zero();
		    
		    if( torque ){
			body.torque = 0;
		    }
		}
	    };
	}();
	
	
	return PWorld2D;
    }
);