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
	    this.useAABBBroadphase = aabbBroadphase !== undefined ? aabbBroadphase : true;
	}
	
	Class.extend( PBroadphase2D, Class );
	
	
	PBroadphase2D.prototype.needBroadphaseCollision = function( a, b ){
	    
	    return !(
		a.filterGroup !== b.filterGroup ||
		!a.shape && !b.shape ||
		(( a.type === DYNAMIC || a.type === STATIC || a.isSleeping() ) && ( b.type === DYNAMIC || b.type === STATIC || b.isSleeping() ))
	    );
	};
	
	
	PBroadphase2D.prototype.collisionPairs = function(){
	    
	    if( this.useAABBBroadphase ){
		this.aabbBroadphase();
	    }
	    else{
		this.boundingRadiusBroadphase();
	    }
	};
	
	
	PBroadphase2D.prototype.aabbBroadphase = function(){
	    var world = this.world,
		bodies = world.bodies,
		pairsA = world._pairsA, pairsB = world._pairsB,
		aBody, bBody,
		i, j, il;
	    
	    pairsA.length = 0;
	    pairsB.length = 0;
	    
	    for( i = 0, il = bodies.length; i < il; i++ ) for( j = 0; j !== i; j++ ){
		aBody = bodies[i];
		bBody = bodies[j];
		
		if( this.needBroadphaseCollision( aBody, bBody ) ){
		    continue;
		}
		
		if( aBody.aabbNeedsUpdate ){
		    aBody.calculateAABB();
		}
		if( bBody.aabbNeedsUpdate ){
		    bBody.calculateAABB();
		}
		
		if( AABB2.intersects( aBody.aabb, bBody.aabb ) ){
		    pairsA.push( aBody );
		    pairsB.push( bBody );
		}
	    }
	};
	
	
	PBroadphase2D.prototype.boundingRadiusBroadphase = function(){
	    var dist = new Vec2;
	    
	    return function(){
		var world = this.world,
		    bodies = world.bodies,
		    pairsA = world._pairsA, pairsB = world._pairsB,
		    aBody, bBody, aShape, bShape,
		    radius, radiusSq, distSq,
		    i, j, il;
		
		pairsA.length = 0;
		pairsB.length = 0;
		
		for( i = 0, il = bodies.length; i < il; i++ ) for( j = 0; j !== i; j++ ){
		    aBody = bodies[i];
		    aShape = aBody.shape;
		    
		    bBody = bodies[j];
		    bShape = bBody.shape;
		    
		    if( this.needBroadphaseCollision( aBody, bBody ) ){
			continue;
		    }
		    
		    if( aShape.boundingRadiusNeedsUpdate ){
			aShape.calculateBoundingRadius();
		    }
		    if( bShape.boundingRadiusNeedsUpdate ){
			bShape.calculateBoundingRadius();
		    }
		    
		    radius = aShape.boundingRadius + bShape.boundingRadius;
		    radiusSq = radius * radius;
		    
		    distSq = dist.vsub( aBody.position, bBody.position ).lenSq();
		    
		    if( distSq <= radiusSq ){
			pairsA.push( aBody );
			pairsB.push( bBody );
		    }
		}
	    };
	}();
	
	
	return PBroadphase2D;
    }
);