if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/physics/objects/pbody"
    ],
    function( Class, PBody ){
	"use strict";
	
	var STATIC = PBody.STATIC,
	    KINEMATIC = PBody.KINEMATIC;
	
	
        function PBroadphase( world ){
            
            Class.call( this );
	    
	    this.world = world;
        }
        
	Class.extend( PBroadphase, Class );
	
	
	PBroadphase.prototype.needBroadphaseCollision = function( a, b ){
	    
	    if( !a.shape && !b.shape ||
		a.type === STATIC || a.type === KINEMATIC || a.isSleeping() &&
		b.type === STATIC || b.type === KINEMATIC || b.isSleeping()
	    ){
		return false;
	    }
	    
	    return true;
	};
	
	
	PBroadphase.prototype.intersectionTest = function(){
	    var world = this.world,
		bodies = world.bodies,
		a, b, i, j, n = bodies.length;
	    
	    world.contacts.length = 0;
	    
	    for( i = 0; i !== n; i++ ){
		for( j = 0; j !== i; j++ ){
		    a = bodies[i];
		    b = bodies[j];
		    
		    if( !this.needBroadphaseCollision( a, b ) ){
			continue;
		    }
		    
		    world.contacts.push( a, b );
		}
	    }
	};
	
        
        return PBroadphase;
    }
);