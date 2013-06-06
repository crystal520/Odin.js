if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/collision/pcollision2d",
	"physics2d/collision/pmanifold2d",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Mathf, Vec2, PCollision2D, PManifold2D, PShape2D ){
        "use strict";
	
	var sqrt = Math.sqrt,
	    equals = Mathf.equals,
	    
	    BOX = PShape2D.BOX,
	    CIRCLE = PShape2D.CIRCLE,
	    CONVEX = PShape2D.CONVEX,
	    
	    convexConvex = PCollision2D.convexConvex,
	    convexCircle = PCollision2D.convexCircle,
	    circleCircle = PCollision2D.circleCircle,
	    
	    contactPool = [];
	
	
	function createContact( bi, bj, contacts ){
	    var c = contactPool.length ? contactPool.pop() : new PContact2D( bi, bj );
	    
	    c.bi = bi;
	    c.bj = bj;
	    
	    contacts.push( c );
	    
	    return c;
	};
	
        
	function PNearphase2D(){
	    
	    Class.call( this );
	}
	
	Class.extend( PNearphase2D, Class );
	
	
	PNearphase2D.prototype.collisions = function( world, pairsi, pairsj, contacts ){
	    var bi, bj, i;
	    
	    for( i = contacts.length; i--; ){
		contactPool.push( contacts[i] );
	    }
	    contacts.length = 0;
	    
	    
	    for( i = pairsi.length; i--; ){
		bi = pairsi[i];
		bj = pairsj[i];
		
		this.nearphase( bi, bj, bi.shape, bj.shape, bi.position, bj.position, bi.R.elements, bj.R.elements, contacts );
	    }
	};
	
	
	PNearphase2D.prototype.convexConvex = function(){
	    var manifold = new PManifold2D;
	    
	    return function( bi, bj, si, sj, xi, xj, contacts ){
		
		if( convexConvex( si, sj, xi, xj, manifold ) ){
		    
		}
	    };
	}();
	
	
	PNearphase2D.prototype.convexCircle = function(){
	    var normal = new Vec2, point = new Vec2,
		radius, c, n, nx, ny, ri, rj;
	    
	    return function( bi, bj, si, sj, xi, xj, contacts ){
		
		if( convexCircle( si, sj, xi, xj, normal, point ) ){
		    c = createContact( bi, bj, contacts );
		    n = c.n, ri = c.ri, rj = c.rj;
		    
		    radius = sj.radius;
		    
		    n.x = nx = normal.x;
		    n.y = ny = normal.y;
		    
		    ri.x = point.x - xi.x;
		    ri.y = point.y - xi.y;
		    
		    rj.x = -radius * nx;
		    rj.y = -radius * ny;
		}
	    };
	}();
	
	
	PNearphase2D.prototype.circleCircle = function(){
	    var normal = new Vec2,
		radiusi, radiusj,
		c, n, nx, ny, ri, rj;
	    
	    return function( bi, bj, si, sj, xi, xj, contacts ){
		
		if( circleCircle( si, sj, xi, xj, normal ) ){
		    c = createContact( bi, bj, contacts );
		    n = c.n, ri = c.ri, rj = c.rj;
		    
		    radiusi = si.radius;
		    radiusj = sj.radius;
		    
		    n.x = nx = normal.x;
		    n.y = ny = normal.y;
		    
		    ri.x = radiusi * nx;
		    ri.y = radiusi * ny;
		    
		    rj.x = -radiusj * nx;
		    rj.y = -radiusj * ny;
		}
	    };
	}();
	
	
	PNearphase2D.prototype.nearphase = function( bi, bj, si, sj, xi, xj, Ri, Rj, contacts ){
	    
	    if( si && sj ){
		
		if( si.type === CIRCLE ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.circleCircle( bi, bj, si, sj, xi, xj, contacts );
			    break;
			
			case BOX:
			case CONVEX:
			    
			    sj.calculateWorldVertices( xj, Rj );
			    sj.calculateWorldNormals( Rj );
			    
			    this.convexCircle( bj, bi, sj, si, xj, xi, contacts );
			    break;
		    }
		}
		else if( si.type === BOX || si.type === CONVEX ){
		    
		    si.calculateWorldVertices( xi, Ri );
		    si.calculateWorldNormals( Ri );
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.convexCircle( bi, bj, si, sj, bi.position, bj.position, contacts );
			    break;
			
			case BOX:
			case CONVEX:
			    
			    sj.calculateWorldVertices( xj, Rj );
			    sj.calculateWorldNormals( Rj );
			    
			    convexConvex( bi, bj, si, sj, bi.position, bj.position, contacts );
			    break;
		    }
		}
	    }
	};
	
        
        return PNearphase2D;
    }
);