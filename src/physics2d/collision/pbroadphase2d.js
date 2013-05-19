if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2",
	"physics2d/body/pbody2d"
    ],
    function( Class, Vec2, AABB2, PBody2D ){
	"use strict";
	
	var DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PBroadphase2D( world, aabbBroadphase ){
	    
	    Class.call( this );
	    
	    this.world = world;
	    this.aabbBroadphase = aabbBroadphase !== undefined ? aabbBroadphase : true;
	}
	
	Class.extend( PBroadphase2D, Class );
	
	
	PBroadphase2D.prototype.needBroadphaseTest = function( a, b ){
	    
	    if( a.filterGroup !== b.filterGroup ){
		return false;
	    }
	    
	    if( !a.shape && !b.shape ){
		return false;
	    }
	    
	    if( ( a.type === DYNAMIC || a.type === STATIC || a.isSleeping() ) && ( b.type === DYNAMIC || b.type === STATIC || b.isSleeping() ) ){
		return false;
	    }
	    
	    return true;
	};
	
	
	PBroadphase2D.prototype.collisionPairs = function(){
	    var world = this.world,
		pairsA = world.pairsA, pairsB = world.pairsB,
		bodies = world.bodies,
		bodyA, bodyB,
		i, j, il;
	    
	    pairsA.length = pairsB.length = 0;
	    
	    for( i = 0, il = bodies.length; i < il; i++ ) for( j = 0; j !== i; j++ ){
		bodyA = bodies[i];
		bodyB = bodies[j];
		
		if( this.needBroadphaseTest( bodyA, bodyB ) ){
		    continue;
		}
		
		this.intersectionTest( bodyA, bodyB, pairsA, pairsB );
	    }
	};
	
	
	PBroadphase2D.prototype.intersectionTest = function( bodyA, bodyB, pairsA, pairsB ){
	    
	    if( this.aabbBroadphase ){
		this.doAABBBroadphase( bodyA, bodyB, pairsA, pairsB );
	    }
	    else{
		this.doBoundingRadiusBroadphase( bodyA, bodyB, pairsA, pairsB );
	    }
	};
	
	
	PBroadphase2D.prototype.doAABBBroadphase = function( bodyA, bodyB, pairsA, pairsB ){
	    
	    if( bodyA.aabbNeedsUpdate ){
		bodyA.calculateAABB();
	    }
	    if( bodyB.aabbNeedsUpdate ){
		bodyB.calculateAABB();
	    }
	    
	    if( AABB2.intersects( bodyA.aabb, bodyB.aabb ) ){
		pairsA.push( bodyA );
		pairsB.push( bodyB );
	    }
	};
	
	
	PBroadphase2D.prototype.doBoundingRadiusBroadphase = function(){
	    var dist = new Vec2;
	    
	    return function( bodyA, bodyB, pairsA, pairsB ){
		var aShape = bodyA.shape, bShape = bodyB.shape,
		    radius, radiusSq, distSq;
		    
		if( aShape.boundingRadiusNeedsUpdate ){
		    aShape.calculateBoundingRadius();
		}
		if( bShape.boundingRadiusNeedsUpdate ){
		    bShape.calculateBoundingRadius();
		}
		
		radius = aShape.boundingRadius + bShape.boundingRadius;
		radiusSq = radius * radius;
		
		distSq = dist.vsub( bodyA.position, bodyB.position ).lenSq();
		
		if( distSq <= radiusSq ){
		    pairsA.push( bodyA );
		    pairsB.push( bodyB );
		}
	    };
	}();
	
	
	PBroadphase2D.prototype.makePairsUnique = function(){
	    var pA = [], pB = [], tmp = [];
	    
	    return function(){
		var world = this.world,
		    pairsA = world._pairsA, pairsB = world._pairsB,
		    idx, idA, idB, i, il = pairsA.length;
		    
		for( i = 0; i < il; i++ ){
		    pA[i] = pairsA[i];
		    pB[i] = pairsB[i];
		}
		
		pairsA.length = pairsB.length = 0;
		
		for( i = 0; i < il; i++ ){
		    idA = pA[i]._id;
		    idB = pB[i]._id;
		    idx = idA < idB ? idA +","+ idB : idB +","+ idB;
		    tmp[ idx ] = i;
		}
		
		for( idx in tmp ){
		    i = tmp[ idx ];
		    pairsA.push( pA[i] );
		    pairsB.push( pB[i] );
		    delete tmp[ idx ];
		}
	    };
	}();
	
	
	return PBroadphase2D;
    }
);