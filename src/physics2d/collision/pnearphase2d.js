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
	
	
	function findEdgeIndex( si, sj, xi, xj, Ri, Rj ){
	    var verticesi = si.vertices, normalsi = si.normals, counti = verticesi.length,
		verticesj = sj.vertices, normalsj = sj.normals, countj = verticesj.length,
		
		Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3],
		Rj11 = Rj[0], Rj12 = Rj[2], Rj21 = Rj[1], Rj22 = Rj[3],
		
		xix = xi.x, xiy = xi.y,
		xjx = xj.x, xjy = xj.y,
		
		dx = xjx - xix,
		dy = xjy - xiy,
		
		normal, x, y, nx, ny, d, dmax = -Infinity, edgeIndex = 0,
		i;
	    
	    for( i = counti; i--; ){
		normal = normalsi[i];
		x = normal.x; y = normal.y;
		nx = x * Ri11 + y * Ri12;
		ny = x * Ri21 + y * Ri22;
		
		d = nx * dx + ny * dy;
		if( d > dmax ){
		    dmax = d;
		    edgeIndex = i;
		}
	    }
	    
	    return edgeIndex;
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
	
	
	function edgeSeparation( si, sj, xi, xj, Ri, Rj, edgeIndexi, edgeIndexj ){
	    var Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3],
		
		normal = si.normals[ edgeIndexi ],
		x = normal.x, y = normal.y,
		nx = x * Ri11 + y * Ri12,
		ny = x * Ri21 + y * Ri22,
		
		vertex, x, y, v1x, v1y, v2x, v2y;
	    
	    
	    vertex = si.vertices[ edgeIndexi ];
	    x = vertex.x; y = vertex.y;
	    v1x = xi.x + ( x * Ri11 + y * Ri12 );
	    v1y = xi.y + ( x * Ri21 + y * Ri22 );
	    
	    vertex = sj.vertices[ edgeIndexj ];
	    x = vertex.x; y = vertex.y;
	    v2x = xj.x + ( x * Rj[0] + y * Rj[2] );
	    v2y = xj.y + ( x * Rj[1] + y * Rj[3] );
	    
	    v2x -= v1x;
	    v2y -= v1y;
	    
	    return v2x * nx + v2y * ny;
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
	    var axisi = new Vec2, axisj = new Vec2,
		edgei = new Line2, edgej = new Line2,
		edgeOuti = [0], edgeOutj = [0],
		tmp1 = new Vec2, tmp2 = new Vec2;
	    
	    return function( bi, bj, si, sj, xi, xj, Ri, Rj, contacts ){
		var separation, separationj, edgeIndexi, edgeIndexj,
		    edgeiStart, edgeiEnd, edgejStart, edgejEnd,
		    normal, x, y, nx, ny,
		    c, n, ri, rj;
		
		edgeIndexi = findEdgeIndex( si, sj, xi, xj, Ri, Rj );
		edgeIndexj = findEdgeIndex( sj, si, xj, xi, Rj, Ri );
		
		console.log( edgeIndexi, edgeIndexj );
		
		findEdge( si, xi, Ri, edgeIndexi, edgei );
		findEdge( sj, xj, Rj, edgeIndexj, edgej );
		
		edgeiStart = edgei.start; edgeiEnd = edgei.end;
		edgejStart = edgej.start; edgejEnd = edgej.end;
		
		normal = si.normals[ edgeIndexi ];
		x = normal.x; y = normal.y;
		nx = x * Ri[0] + y * Ri[2];
		ny = x * Ri[1] + y * Ri[3];
		
		
		edgei.closestPoint( edgej.start, tmp1 );
		
		c = createContact( bi, bj, contacts );
		n = c.n; ri = c.ri; rj = c.rj;
		
		n.x = nx; n.y = ny;
		
		edgei.closestPoint( tmp1, ri ).sub( xi );
		edgej.closestPoint( tmp1, rj ).sub( xj );
		
		
		edgei.closestPoint( edgej.end, tmp2 );
		
		c = createContact( bi, bj, contacts );
		n = c.n; ri = c.ri; rj = c.rj;
		
		n.x = nx; n.y = ny;
		
		edgei.closestPoint( tmp2, ri ).sub( xi );
		edgej.closestPoint( tmp2, rj ).sub( xj );
		
		bi.wake();
		bj.wake();
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