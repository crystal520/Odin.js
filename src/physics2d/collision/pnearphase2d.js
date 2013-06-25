if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/line2",
	"physics2d/collision/pcollision2d",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Mathf, Vec2, Line2, PCollision2D, PShape2D ){
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
	    
	    findSeparatingAxis,
	    findBestEdge,
	    clipPoints,
	    createContact,
	    
	    findMaxSeparation,
	    edgeSeparation,
	    
	    contactPool = [];
	
        
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
	
	
	PNearphase2D.prototype.createContact = createContact = function( bi, bj, contacts ){
	    var c = contactPool.length ? contactPool.pop() : new PContact2D( bi, bj );
	    
	    c.bi = bi;
	    c.bj = bj;
	    
	    contacts.push( c );
	    
	    return c;
	};
	
	
	
	PNearphase2D.prototype.clipPoints = clipPoints = function(){
	    var vec = new Vec2;
	    
	    return function( v1, v2, n, o, contactPoints ){
		var d1 = n.dot( v1 ) - o,
		    d2 = n.dot( v2 ) - o,
		    interp;
		
		if( d1 >= 0 ) contactPoints.push( v1 );
		if( d2 >= 0 ) contactPoints.push( v2 );
		
		if( d1 * d2 < 0 ){
		    interp = d1 / ( d1 - d2 );
		    vec.x = v1.x + interp * ( v2.x - v1.x );
		    vec.y = v1.y + interp * ( v2.y - v1.y );
		    contactPoints.push( vec );
		}
	    };
	}();
	
	
	PNearphase2D.prototype.findBestEdge = findBestEdge = function( vertices, position, R, normal, edge ){
	    var count = vertices.length, start = edge.start, end = edge.end,
		
		R11 = R[0], R21 = R[1], R12 = R[2], R22 = R[3],
		posx = position.x, posy = position.y,
		nx = normal.x, ny = normal.y,
		
		vert, vx, vy, x, y, d, dmax = -Infinity, index = 0, prev, next,
		vx, vy, v1x, v1y, v2x, v2y, leftx, lefty, rightx, righty, tmp,
		i;
	    
	    for( i = count; i--; ){
		vert = vertices[i]; vx = vert.x; vy = vert.y;
		x = posx + ( vx * R11 + vy * R12 );
		y = posy + ( vx * R21 + vy * R22 );
		
		d = x * nx + y * ny;
		if( d > dmax ){
		    dmax = d;
		    index = i;
		}
	    }
	    
	    vert = vertices[ index ];
	    prev = index - 1 < 0 ? vertices[ count - 1 ] : vertices[ index - 1 ];
	    next = index + 1 < count ? vertices[ index + 1 ] : vertices[0];
	    
	    x = vert.x; y = vert.y;
	    vx = posx + ( x * R11 + y * R12 );
	    vy = posy + ( x * R21 + y * R22 );
	    
	    x = prev.x; y = prev.y;
	    v1x = posx + ( x * R11 + y * R12 );
	    v1y = posy + ( x * R21 + y * R22 );
	    
	    x = next.x; y = next.y;
	    v2x = posx + ( x * R11 + y * R12 );
	    v2y = posy + ( x * R21 + y * R22 );
	    
	    rightx = vx - v1x;
	    righty = vy - v1y;
	    
	    leftx = vx - v2x;
	    lefty = vy - v2y;
	    
	    if( rightx * nx + righty * ny <= leftx * nx + lefty * ny ){
		start.x = v1x;
		start.y = v1y;
		end.x = vx;
		end.y = vy;
	    }
	    else{
		start.x = vx;
		start.y = vy;
		end.x = v2x;
		end.y = v2y;
	    }
	};
	
	
	PNearphase2D.prototype.findSeparatingAxis = findSeparatingAxis = function( si, sj, xi, xj, Ri, Rj, axis ){
	    var verticesi = si.vertices, normalsi = si.normals, counti = normalsi.length,
		verticesj = sj.vertices, normalsj = sj.normals, countj = normalsj.length,
		
		xix = xi.x, xiy = xi.y,
		Ri11 = Ri[0], Ri12 = Ri[2],
		Ri21 = Ri[1], Ri22 = Ri[3],
		
		xjx = xj.x, xjy = xj.y,
		Rj11 = Rj[0], Rj12 = Rj[2],
		Rj21 = Rj[1], Rj22 = Ri[3],
		
		dx = xjx - xix,
		dy = xjy - xiy,
		
		vertex, vx, vy, normal, nx, ny, x, y, dot, tmp, d, d1, d2, dmax = Infinity,
		mini = Infinity, maxi = -Infinity, minj = Infinity, maxj = -Infinity,
		
		i, il, j;
	    
	    for( i = 0, il = counti + countj; i < il; i++ ){
		if( i < counti ){
		    normal = normalsi[i]; x = normal.x; y = normal.y;
		    
		    nx = x * Ri11 + y * Ri12;
		    ny = x * Ri21 + y * Ri22;
		}
		else{
		    normal = normalsj[ i - counti ]; x = normal.x; y = normal.y;
		    
		    nx = x * Rj11 + y * Rj12;
		    ny = x * Rj21 + y * Rj22;
		}
		
		for( j = counti; j--; ){
		    vertex = verticesi[j]; vx = vertex.x, vy = vertex.y;
		    x = xix + ( vx * Ri11 + vy * Ri12 );
		    y = xiy + ( vx * Ri21 + vy * Ri22 );
		    
		    dot = x * nx + y * ny;
		    mini = dot < mini ? dot : mini;
		    maxi = dot > maxi ? dot : maxi;
		}
		if( mini > maxi ){
		    tmp = mini; mini = maxi; maxi = tmp;
		}
		
		for( j = countj; j--; ){
		    vertex = verticesj[j]; vx = vertex.x, vy = vertex.y;
		    x = xjx + ( vx * Rj11 + vy * Rj12 );
		    y = xjy + ( vx * Rj21 + vy * Rj22 );
		    
		    dot = x * nx + y * ny;
		    minj = dot < minj ? dot : minj;
		    maxj = dot > maxj ? dot : maxj;
		}
		if( minj > maxj ){
		    tmp = minj; minj = maxj; maxj = tmp;
		}
		
		if( maxi < minj || maxj < mini ) return false;
		
		d1 = maxi - minj;
		d2 = maxj - mini;
		d = d1 < d2 ? d1 : d2;
		
		if( d < dmax ){
		    dmax = d;
		    
		    axis.x = nx;
		    axis.y = ny;
		    
		    if( dx * x + dy * y < 0 ){
			axis.x = -nx;
			axis.y = -ny;
		    }
		}
	    }
	    
	    return true;
	};
	
	
	PNearphase2D.prototype.edgeSeparation = edgeSeparation = function( si, sj, xi, xj, Ri, Rj, edge ){
	    var verticesi = si.vertices, normalsi = si.normals, counti = verticesi.length,
		verticesj = sj.vertices, normalsj = sj.normals, countj = verticesj.length,
		
		Ri11 = Ri[0], Ri21 = Ri[1], Ri12 = Ri[2], Ri22 = Ri[3],
		Rj11 = Rj[0], Rj21 = Rj[1], Rj12 = Rj[2], Rj22 = Rj[3],
		
		normal = normalsi[ edge ],
		x = normal.x, y = normal.y,
		
		nx = x * Ri11 + y * Ri12,
		ny = x * Ri21 + y * Ri22,
		
		vertex, d, dmin, vertexIndex, v1, v2, v1x, v1y, v2x, v2y,
		i;
	    
	    for( i = countj; i--; ){
		vertex = verticesj[i];
		
		d = vertex * nx + vertex.y * ny;
		
		if( d < dmin ){
		    dmin = d;
		    vertexIndex = i;
		}
	    }
	    
	    console.log(vertexIndex);
	    
	    v1 = verticesi[ edge ];
	    x = v1.x; y = v1.y;
	    
	    v1x = xi.x + ( x * Ri11 + y * Ri12 );
	    v1y = xi.y + ( x * Ri21 + y * Ri22 );
	    
	    v2 = verticesj[ vertexIndex ];
	    x = v2.x; y = v2.y;
	    
	    v2x = xj.x + ( x * Rj11 + y * Rj12 );
	    v2y = xj.y + ( x * Rj21 + y * Rj22 );
	    
	    v2x -= v1x;
	    v2y -= v1y;
	    
	    return v2x * nx + v2y * ny;
	};
	
	
	PNearphase2D.prototype.findMaxSeparation = findMaxSeparation = function( si, sj, xi, xj, Ri, Rj, edge ){
	    var normals = si.normals, count = normals.length,
		
		dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		
		localx = dx * Ri[0] + dy * Ri[2],
		localy = dx * Ri[1] + dy * Ri[3],
		
		edgeIndex = 0, d, dmax = -Infinity, normal,
		i;
	    
	    for( i = count; i--; ){
		normal = normals[i];
		
		d = normal.x * localx + normal.y * localy;
		
		if( d > dmax ){
		    dmax = d;
		    edgeIndex = i;
		}
	    }
	    
	    s = edgeSeparation( si, sj, xi, xj, Ri, Rj, edgeIndex );
	    
	    console.log( s );
	    
	    edge[i] = edgeIndex;
	};
	
	
	PNearphase2D.prototype.convexConvex = function(){
	    var edgei = new Line2, edgej = new Line2,
		vec = new Vec2, axis = new Vec2,
		edge = [0],
		contactPoints = [];
	    
	    return function( bi, bj, si, sj, xi, xj, Ri, Rj, contacts ){
		var ref, refStart, refEnd, inc, flip = false,
		    
		    dvx, dvy, length, invLength,
		    sideNormalx, sideNormaly, frontNormalx, frontNormaly,
		    frontOffset, sideOffset1, sideOffset2, separation, contactPoint,
		    
		    nx, ny, c, n, ri, rj,
		    i;
		
		findMaxSeparation( si, sj, xi, xj, Ri, Rj, edge );
		
		if( !findSeparatingAxis( si, sj, xi, xj, Ri, Rj, axis ) ) return;
		
		findBestEdge( si.vertices, xi, Ri, axis, edgei );
		
		vec.x = -axis.x; vec.y = -axis.y;
		findBestEdge( sj.vertices, xj, Rj, vec, edgej );
		
		contactPoints.length = 0;
		
		if( edgei.dot( axis ) <= edgej.dot( axis ) ){
		    ref = edgei;
		    inc = edgej;
		}
		else{
		    ref = edgej;
		    inc = edgei;
		    flip = true;
		}
		
		refStart = ref.start;
		refEnd = ref.end;
		
		dvx = ref.start.x - ref.end.x;
		dvy = ref.start.y - ref.end.y;
		
		sideNormalx = dvx;
		sideNormaly = dvy;
		
		length = sqrt( sideNormalx * sideNormalx + sideNormaly * sideNormaly );
		invLength = 1 / length;
		
		sideNormalx *= invLength;
		sideNormaly *= invLength;
		
		frontNormalx = sideNormaly;
		frontNormaly = -sideNormalx;
		
		frontOffset = frontNormalx * refStart.x + frontNormaly * refStart.y;
		sideOffset1 = -( sideNormalx * refStart.x + sideNormaly * refStart.y );
		sideOffset2 = sideNormalx * refEnd.x + sideNormaly * refEnd.y;
		
		vec.x = -sideNormalx;
		vec.y = -sideNormaly;
		clipPoints( inc.start, inc.end, axis, sideOffset1, contactPoints );
		
		if( contactPoints.length < 2 ) return;
		
		vec.x = sideNormalx;
		vec.y = sideNormaly;
		clipPoints( contactPoints[0], contactPoints[1], vec, sideOffset2, contactPoints );
		
		if( contactPoints.length < 2 ) return;
		
		if( flip ){
		    nx = frontNormalx;
		    ny = frontNormaly;
		}
		else{
		    nx = -frontNormalx;
		    ny = -frontNormaly;
		}
		
		for( i = contactPoints.length; i--; ){
		    contactPoint = contactPoints[i];
		    separation = ( frontNormalx * contactPoint.x + frontNormaly * contactPoint.y ) - frontOffset;
		    
		    if( separation >= 0 ){
			c = createContact( bi, bj, contacts );
			n = c.n; ri = c.ri; rj = c.rj;
			
			n.x = nx;
			n.y = ny;
			
			ri.x = contactPoint.x - xi.x;
			ri.y = contactPoint.y - xi.y;
			
			rj.x = contactPoint.x - xj.x;
			rj.y = contactPoint.y - xj.y;
		    }
		    
		    bi.wake();
		    bj.wake();
		}
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
		v1, v2, v1x, v1y, v2x, v2y, ex, ey, u, px, py, dx, dy,
		
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
	    
	    normal = normals[ normalIndex ]; x = normal.x; y = normal.y;
	    nx = x * Ri11 + y * Ri12;
	    ny = x * Ri21 + y * Ri22;
	    
	    v1 = vertices[ normalIndex ]; x = v1.x; y = v1.y;
	    v1x = xix + ( x * Ri11 + y * Ri12 );
	    v1y = xiy + ( x * Ri21 + y * Ri22 );
	    
	    v2 = normalIndex + 1 < count ? vertices[ normalIndex + 1 ] : vertices[0]; x = v2.x; y = v2.y;
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