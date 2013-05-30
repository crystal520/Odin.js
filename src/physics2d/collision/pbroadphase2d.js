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
	    KINEMATIC = PBody2D.KINEMATIC,
	    
	    intersects = AABB2.intersects;
	
        
	function PBroadphase2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.useBoundingRadius = opts.useBoundingRadius !== undefined ? opts.useBoundingRadius : false;
	}
	
	Class.extend( PBroadphase2D, Class );
	
	
	PBroadphase2D.prototype.needBroadphaseTest = function( bi, bj ){
	    
	    return !(
		bi.filterGroup !== bj.filterGroup ||
		( bi.type === KINEMATIC || bi.type === STATIC || bi.isSleeping() ) &&
		( bj.type === KINEMATIC || bj.type === STATIC || bj.isSleeping() ) ||
		!bi.shape && !bj.shape
	    );
	};
	
	
	PBroadphase2D.prototype.collisionPairs = function( world, pairsi, pairsj ){
	    var bodies = world.bodies,
		bi, bj, i, j, il;
	    
	    pairsi.length = pairsj.length = 0;
	    
	    for( i = 0, il = bodies.length; i < il; i++ ) for( j = 0; j !== i; j++ ){
		bi = bodies[i];
		bj = bodies[j];
		
		if( !this.needBroadphaseTest( bi, bj ) ){
		    continue;
		}
		
		this.intersectionTest( bi, bj, pairsi, pairsj );
	    }
	};
	
	
	PBroadphase2D.prototype.intersectionTest = function( bi, bj, pairsi, pairsj ){
	    
	    if( this.useBoundingRadius ){
		this.boundingRadiusBroadphase( bi, bj, pairsi, pairsj );
	    }
	    else{
		this.AABBBroadphase( bi, bj, pairsi, pairsj );
	    }
	};
	
	
	PBroadphase2D.prototype.AABBBroadphase = function( bi, bj, pairsi, pairsj ){
	    
	    if( bi.aabbNeedsUpdate ){
		bi.calculateAABB();
	    }
	    if( bj.aabbNeedsUpdate ){
		bj.calculateAABB();
	    }
	    
	    if( intersects( bi.aabb, bj.aabb ) ){
		pairsi.push( bi );
		pairsj.push( bj );
	    }
	};
	
	
	PBroadphase2D.prototype.boundingRadiusBroadphase = function( bi, bj, pairsi, pairsj ){
	    var si = bi.shape, sj = bj.shape,
		
		r = si.boundingRadius + sj.boundingRadius,
		
		xi = bi.position, xj = bj.position,
		
		dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		
		d = dx * dx + dy * dy;
	    
	    if( d <= r * r ){
		pairsi.push( bi );
		pairsj.push( bj );
	    }
	};
	
        
        return PBroadphase2D;
    }
);