if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}

require.config({
    name: "odin"
});

define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/line2",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Mathf, Vec2, Line2, PShape2D ){
        "use strict";
	
	var EPSILON = Mathf.EPSILON,
	    clamp01 = Mathf.clamp01,
	    equals = Mathf.equals,
	    
	    abs = Math.abs,
	    sqrt = Math.sqrt,
	    min = Math.min,
	    max = Math.max,
	    
	    BOX = PShape2D.BOX,
	    CIRCLE = PShape2D.CIRCLE,
	    CONVEX = PShape2D.CONVEX,
	    
	    contactPool = [];
	
	
	function createContact( bi, bj, contacts ){
	    var c = contactPool.length ? contactPool.pop() : new PContact2D( bi, bj );
	    
	    c.bi = bi;
	    c.bj = bj;
	    
	    contacts.push( c );
	    
	    return c;
	}
	
	
	function findMaxSeparation( si, sj, xi, xj, Ri, Rj, edgeOut ){
	    var verticesi = si.vertices, normalsi = si.normals, counti = verticesi.length,
		verticesj = sj.vertices, normalsj = sj.normals, countj = verticesj.length,
		
		Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3],
		Rj11 = Rj[0], Rj12 = Rj[2], Rj21 = Rj[1], Rj22 = Rj[3],
		
		xix = xi.x, xiy = xi.y,
		xjx = xj.x, xjy = xj.y,
		
		dx = xjx - xix,
		dy = xjy - xiy,
		
		localx = dx * Ri11 + dy * Ri12,
		localy = dx * Ri21 + dy * Ri22,
		
		normal, x, y, nx, ny, d, dmax = -Infinity, edgeIndex = 0,
		s, sPrev, sNext, prevEdge, nextEdge, bestEdge = 0, bestSeparation, increment = 0,
		i;
	    
	    for( i = counti; i--; ){
		normal = normalsi[i];
		d = normal.x * localx + normal.y * localy;
		
		if( d > dmax ){
		    dmax = d;
		    edgeIndex = i;
		}
	    }
	    
	    s = edgeSeparation( si, sj, xi, xj, Ri, Rj, edgeIndex );
	    if( s > 0 ) return s;
	    
	    prevEdge = edgeIndex - 1 > -1 ? edgeIndex - 1 : counti - 1;
	    sPrev = edgeSeparation( si, sj, xi, xj, Ri, Rj, prevEdge );
	    if( sPrev > 0 ) return sPrev;
	    
	    nextEdge = edgeIndex + 1 < counti ? edgeIndex + 1 : 0;
	    sNext = edgeSeparation( si, sj, xi, xj, Ri, Rj, nextEdge );
	    if( sNext > 0 ) return sNext;
	    
	    if( sPrev > s && sPrev > sNext ){
		increment = -1;
		bestEdge = prevEdge;
		bestSeparation = sPrev;
	    }
	    else if( sNext > s ){
		increment = 1;
		bestEdge = nextEdge;
		bestSeparation = sNext;
	    }
	    else{
		edgeOut[0] = edgeIndex;
		return s;
	    }
	    
	    while( true ){
		
		if( increment === -1 ){
		    edgeIndex = bestEdge - 1 > -1 ? bestEdge - 1 : counti - 1;
		}
		else{
		    edgeIndex = bestEdge + 1 < counti ? bestEdge + 1 : 0;
		}
		
		s = edgeSeparation( si, sj, xi, xj, Ri, Rj, edgeIndex );
		if( s > 0 ) return s;
		
		if( s > bestSeparation ){
		    bestEdge = edgeIndex;
		    bestSeparation = s;
		}
		else{
		    break;
		}
	    }
	    
	    edgeOut[0] = bestEdge;
	    return bestSeparation;
	}
	
	
	function edgeSeparation( si, sj, xi, xj, Ri, Rj, edgeIndexi ){
	    var verticesj = sj.vertices,
		
		Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3],
		Rj11 = Rj[0], Rj12 = Rj[2], Rj21 = Rj[1], Rj22 = Rj[3],
		
		xix = xi.x, xiy = xi.y,
		xjx = xj.x, xjy = xj.y,
		
		normal = si.normals[ edgeIndexi ],
		x = normal.x, y = normal.y,
		nx = x * Ri11 + y * Ri12,
		ny = x * Ri21 + y * Ri22,
		
		vertex, x, y, vx, vy, v1x, v1y, v2x, v2y,
		edgeIndexj = 0, d, dmax = -Infinity,
		i;
	    
	    
	    for( i = verticesj.length; i--; ){
		vertex = verticesj[i];
		x = vertex.x; y = vertex.y;
		vx = xjx + ( x * Rj11 + y * Rj12 );
		vy = xjy + ( x * Rj21 + y * Rj22 );
		
		d = vx * -nx + vy * -ny;
		if( d > dmax ){
		    dmax = d;
		    edgeIndexj = i;
		    v2x = vx;
		    v2y = vy;
		}
	    }
	    
	    vertex = si.vertices[ edgeIndexi ];
	    x = vertex.x; y = vertex.y;
	    v1x = xix + ( x * Ri11 + y * Ri12 );
	    v1y = xiy + ( x * Ri21 + y * Ri22 );
	    
	    v2x -= v1x;
	    v2y -= v1y;
	    
	    return v2x * nx + v2y * ny;
	}
	
	
	function findEdge( si, xi, Ri, edgeIndex, edge ){
	    var vertices = si.vertices, count = vertices.length,
		
		Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3],
		xix = xi.x, xiy = xi.y,
		
		vertex, x, y, v1x, v1y, v2x, v2y;
	    
	    vertex = vertices[ edgeIndex ];
	    x = vertex.x; y = vertex.y;
	    v1x = xix + ( x * Ri11 + y * Ri12 );
	    v1y = xiy + ( x * Ri21 + y * Ri22 );
	    
	    vertex = edgeIndex + 1 < count ? vertices[ edgeIndex + 1 ] : vertices[0];
	    x = vertex.x; y = vertex.y;
	    v2x = xix + ( x * Ri11 + y * Ri12 );
	    v2y = xiy + ( x * Ri21 + y * Ri22 );
	    
	    edge.start.set( v1x, v1y );
	    edge.end.set( v2x, v2y );
	}
	
        
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
	    var edgei = new Line2, edgej = new Line2,
		edgeOuti = [0], edgeOutj = [0],
		relativeTol = 0.98, absoluteTol = 0.001,
		axis = new Vec2, vec = new Vec2;
	    
	    return function( bi, bj, si, sj, xi, xj, Ri, Rj, contacts ){
		var separationi, separationj, edgeIndexi, edgeIndexj,
		    edgeiStart, edgeiEnd, edgejStart, edgejEnd,
		    normal, x, y, nx, ny, offset, s, tmp,
		    c, n, ri, rj;
		
		separationi = findMaxSeparation( si, sj, xi, xj, Ri, Rj, edgeOuti );
		edgeIndexi = edgeOuti[0];
		if( separationi > 0 ) return;
		
		separationj = findMaxSeparation( sj, si, xj, xi, Rj, Ri, edgeOutj );
		edgeIndexj = edgeOutj[0];
		if( separationj > 0 ) return;
		
		findEdge( si, xi, Ri, edgeIndexi, edgei );
		findEdge( sj, xj, Rj, edgeIndexj, edgej );
		
		normal = si.normals[ edgeIndexi ];
		x = normal.x; y = normal.y;
		axis.x = nx = x * Ri[0] + y * Ri[2];
		axis.y = ny = x * Ri[1] + y * Ri[3];
		
		if( edgej.dot( axis ) > edgei.dot( axis ) * relativeTol + absoluteTol ){
		    tmp = bj; bj = bi; bi = tmp;
		    tmp = sj; sj = si; si = tmp;
		    tmp = xj; xj = xi; xi = tmp;
		    tmp = Rj; Rj = Ri; Ri = tmp;
		    tmp = edgeIndexj; edgeIndexj = edgeIndexi; edgeIndexi = tmp;
		    tmp = edgej; edgej = edgei; edgei = tmp;
		    nx = -axis.x;
		    ny = -axis.y;
		}
		
		edgeiStart = edgei.start; edgeiEnd = edgei.end;
		edgejStart = edgej.start; edgejEnd = edgej.end;
		
		offset = nx * edgeiStart.x + ny * edgeiStart.y;
		
		edgei.closestPoint( edgejStart, vec );
		s = ( nx * edgejStart.x + ny * edgejStart.y ) - offset;
		
		if( s <= 0 ){
		    c = createContact( bi, bj, contacts );
		    n = c.n; ri = c.ri; rj = c.rj;
		    
		    n.x = nx;
		    n.y = ny;
		    
		    edgei.closestPoint( vec, ri ).sub( xi );
		    edgej.closestPoint( vec, rj ).sub( xj );
		}
		
		
		edgei.closestPoint( edgejEnd, vec );
		s = ( nx * edgejEnd.x + ny * edgejEnd.y ) - offset;
		
		if( s <= 0 ){
		    c = createContact( bi, bj, contacts );
		    n = c.n; ri = c.ri; rj = c.rj;
		    
		    n.x = nx;
		    n.y = ny;
		    
		    edgei.closestPoint( vec, ri ).sub( xi );
		    edgej.closestPoint( vec, rj ).sub( xj );
		}
		
		bi.wake();
		bj.wake();
		bi.trigger("collide", bj );
		bj.trigger("collide", bi );
	    };
	}();
	
	
	PNearphase2D.prototype.convexCircle = function( bi, bj, si, sj, xi, xj, Ri, contacts ){
	    var vertices = si.vertices, normals = si.normals, count = vertices.length,
		radius = sj.radius,
		
		Ri11 = Ri[0], Ri12 = Ri[2],
		Ri21 = Ri[1], Ri22 = Ri[3],
		
		xix = xi.x, xiy = xi.y,
		xjx = xj.x, xjy = xj.y,
		
		x, y, vertex, vx, vy, normal, nx, ny, s, separation = -Infinity, normalIndex = 0,
		v1x, v1y, v2x, v2y, ex, ey, u, px, py, dx, dy,
		
		c, n, nx, ny, ri, rj,
		i;
	    
	    for( i = count; i--; ){
		vertex = vertices[i]; x = vertex.x; y = vertex.y;
		vx = xix + ( x * Ri11 + y * Ri12 );
		vy = xiy + ( x * Ri21 + y * Ri22 );
		
		normal = normals[i]; x = normal.x; y = normal.y;
		nx = x * Ri11 + y * Ri12;
		ny = x * Ri21 + y * Ri22;
		
		s = nx * ( xjx - vx ) + ny * ( xjy - vy );
		
		if( s > radius ) return;
		
		if( s > separation ){
		    separation = s;
		    normalIndex = i;
		}
	    }
	    
	    normal = normals[ normalIndex ];
	    x = normal.x; y = normal.y;
	    nx = x * Ri11 + y * Ri12;
	    ny = x * Ri21 + y * Ri22;
	    
	    vertex = vertices[ normalIndex ];
	    x = vertex.x; y = vertex.y;
	    v1x = xix + ( x * Ri11 + y * Ri12 );
	    v1y = xiy + ( x * Ri21 + y * Ri22 );
	    
	    vertex = normalIndex + 1 < count ? vertices[ normalIndex + 1 ] : vertices[0];
	    x = vertex.x; y = vertex.y;
	    v2x = xix + ( x * Ri11 + y * Ri12 );
	    v2y = xiy + ( x * Ri21 + y * Ri22 );
	    
	    ex = v2x - v1x;
	    ey = v2y - v1y;
	    
	    dx = xjx - v1x;
	    dy = xjy - v1y;
	    
	    u = clamp01( ( ex * dx + ey * dy ) / ( ex * ex + ey * ey ) );
	    
	    px = v1x + ex * u;
	    py = v1y + ey * u;
	    
	    c = createContact( bi, bj, contacts );
	    n = c.n; ri = c.ri; rj = c.rj;
	    
	    n.x = nx;
	    n.y = ny;
	    
	    ri.x = px - xix;
	    ri.y = py - xiy;
	    
	    rj.x = -radius * nx;
	    rj.y = -radius * ny;
	    
	    bi.wake();
	    bj.wake();
	    bi.trigger("collide", bj );
	    bj.trigger("collide", bi );
	};
	
	
	PNearphase2D.prototype.circleCircle = function( bi, bj, si, sj, xi, xj, contacts ){
	    var dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		dist = dx * dx + dy * dy,
		invDist,
		
		radiusi = si.radius,
		radiusj = sj.radius,
		r = radiusi + radiusj,
		
		c, n, nx, ny, ri, rj;
	    
	    if( dist > r * r ) return;
	    
	    c = createContact( bi, bj, contacts );
	    n = c.n; ri = c.ri; rj = c.rj;
	    
	    if( dist < EPSILON ){
		nx = 0;
		ny = 1;
	    }
	    else{
		dist = sqrt( dist );
		invDist = 1 / dist;
		
		nx = dx * invDist;
		ny = dy * invDist;
	    }
	    
	    n.x = nx;
	    n.y = ny;
	    
	    ri.x = radiusi * nx;
	    ri.y = radiusi * ny;
	    
	    rj.x = -radiusj * nx;
	    rj.y = -radiusj * ny;
	    
	    bi.wake();
	    bj.wake();
	    bi.trigger("collide", bj );
	    bj.trigger("collide", bi );
	};
	
	
	PNearphase2D.prototype.nearphase = function( bi, bj, si, sj, xi, xj, Ri, Rj, contacts ){
	    
	    if( si && sj ){
		
		if( si.type === CIRCLE ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.circleCircle( bi, bj, si, sj, xi, xj, contacts );
			    break;
			
			case BOX:
			case CONVEX:
			    this.convexCircle( bj, bi, sj, si, xj, xi, Rj, contacts );
			    break;
		    }
		}
		else if( si.type === BOX || si.type === CONVEX ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.convexCircle( bi, bj, si, sj, xi, xj, Ri, contacts );
			    break;
			
			case BOX:
			case CONVEX:
			    this.convexConvex( bi, bj, si, sj, xi, xj, Ri, Rj, contacts );
			    break;
		    }
		}
	    }
	};
	
        
        return PNearphase2D;
    }
);