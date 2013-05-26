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
	
	
	function PBroadphase2D( aabbBroadphase ){
	    
	    Class.call( this );
	    
	    this.aabbBroadphase = aabbBroadphase !== undefined ? aabbBroadphase : true;
	}
	
	Class.extend( PBroadphase2D, Class );
	
	
	PBroadphase2D.prototype.needBroadphaseTest = function( bi, bj ){
	    
	    if( bi.filterGroup !== bj.filterGroup ){
		return false;
	    }
	    
	    if( ( bi.type === KINEMATIC || bi.type === STATIC || bi.isSleeping() ) &&
		( bj.type === KINEMATIC || bj.type === STATIC || bj.isSleeping() )
	    ){
		return false;
	    }
	    
	    if( !bi.shape && !bj.shape ){
		return false;
	    }
	    
	    return true;
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
	    
	    if( this.aabbBroadphase ){
		this.doAABBBroadphase( bi, bj, pairsi, pairsj );
	    }
	    else{
		this.doBoundingRadiusBroadphase( bi, bj, pairsi, pairsj );
	    }
	};
	
	
	PBroadphase2D.prototype.doAABBBroadphase = function( bi, bj, pairsi, pairsj ){
	    
	    if( bi.aabbNeedsUpdate ){
		bi.calculateAABB();
	    }
	    if( bj.aabbNeedsUpdate ){
		bj.calculateAABB();
	    }
	    
	    if( bi.aabb.intersects( bj.aabb ) ){
		
		pairsi.push( bi );
		pairsj.push( bj );
	    }
	};
	
	
	PBroadphase2D.prototype.doBoundingRadiusBroadphase = function(){
	    var dist = new Vec2;
	    
	    return function( bi, bj, pairsi, pairsj ){
		var si = bi.shape, sj = bj.shape,
		    radius, radiusSq;
		
		if( si.boundingRadiusNeedsUpdate ){
		    si.calculateBoundingRadius();
		}
		if( sj.boundingRadiusNeedsUpdate ){
		    sj.calculateBoundingRadius();
		}
		
		radius = si.boundingRadius + sj.boundingRadius;
		radiusSq = radius * radius;
		
		dist.vsub( bi.position, bj.position );
		
		if( dist.lenSq() <= radiusSq ){
		    pairsi.push( bi );
		    pairsj.push( bj );
		}
	    };
	}();
	
	
	PBroadphase2D.prototype.makePairsUnique = function(){
	    var pi = [], pj = [], tmp = [];
	    
	    return function( world, pairsi, pairsj ){
		var idx, idi, idj, i, il = pairsi.length;
		
		for( i = 0; i < il; i++ ){
		    pi[i] = pairsi[i];
		    pj[i] = pairsj[i];
		}
		
		pairsA.length = pairsB.length = 0;
		
		for( i = 0; i < il; i++ ){
		    idi = pi[i]._id;
		    idj = pj[i]._id;
		    idx = idi < idj ? idi +","+ idj : idj +","+ idj;
		    tmp[ idx ] = i;
		}
		
		for( idx in tmp ){
		    i = tmp[ idx ];
		    pairsi.push( pi[i] );
		    pairsj.push( pj[i] );
		    delete tmp[ idx ];
		}
	    };
	}();
	
	
	return PBroadphase2D;
    }
);