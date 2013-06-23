if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/line2",
	"physics2d/constraints/pcontact2d"
    ],
    function( Class, Mathf, Vec2, Line2, PContact2D ){
        "use strict";
	
	var abs = Math.abs,
	    sqrt = Math.sqrt,
	    equals = Mathf.equals,
	    EPSILON = Mathf.EPSILON,
	    
	    findBestEdge,
	    findSeparatingAxis;
	
        
	function PCollision2D(){
	    
	    Class.call( this );
	}
	
	Class.extend( PCollision2D, Class );
	
	
	PCollision2D.prototype.findBestEdge = findBestEdge = function( vertices, position, R, normal, edge ){
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
	
	
	PCollision2D.prototype.findSeparatingAxis = findSeparatingAxis = function( si, sj, xi, xj, Ri, Rj, axis ){
	    var verticesi = si.vertices, normalsi = si.normals, counti = normalsi.length,
		verticesj = sj.vertices, normalsj = sj.normals, countj = normalsj.length,
		
		xix = xi.x, xiy = xi.y,
		Ri11 = Ri[0], Ri21 = Ri[1], Ri12 = Ri[2], Ri22 = Ri[3],
		
		xjx = xj.x, xjy = xj.y,
		Rj11 = Rj[0], Rj21 = Rj[1], Rj12 = Rj[2], Rj22 = Ri[3],
		
		dx = xjx - xix,
		dy = xjy - xiy,
		
		normal, nx, ny, vert, vx, vy, x, y, dot, tmp, d, d1, d2, dmax = Infinity,
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
		    vert = verticesi[j]; vx = vert.x, vy = vert.y;
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
		    vert = verticesj[j]; vx = vert.x, vy = vert.y;
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
	
	
	PCollision2D.prototype.convexConvex = function(){
	    var edgei = new Line2, edgej = new Line2,
		e = new Vec2, vec = new Vec2, axis = new Vec2;
	    
	    function clipPoints( v1, v2, n, o, manifold ){
		var d1 = n.dot( v1 ) - o,
		    d2 = n.dot( v2 ) - o,
		    interp;
		    
		if( d1 >= 0 ) manifold.add( v1 );
		if( d2 >= 0 ) manifold.add( v2 );
		
		if( d1 * d2 < 0 ){
		    interp = d1 / ( d1 - d2 );
		    e.x = v1.x + interp * ( v2.x - v1.x );
		    e.y = v1.y + interp * ( v2.y - v1.y );
		    manifold.add( e );
		}
	    }
	    
	    return function( si, sj, xi, xj, Ri, Rj, manifold ){
		var ref, refStart, refEnd, inc, flip = false,
		    
		    dvx, dvy, length, invLength,
		    sideNormalx, sideNormaly, frontNormalx, frontNormaly,
		    frontOffset, sideOffset1, sideOffset2, separation,
		    
		    mn = manifold.normal;
		
		if( !findSeparatingAxis( si, sj, xi, xj, Ri, Rj, axis ) ) return false;
		
		findBestEdge( si.vertices, xi, Ri, axis, edgei );
		
		vec.x = -axis.x; vec.y = -axis.y;
		findBestEdge( sj.vertices, xj, Rj, vec, edgej );
		
		manifold.clear();
		
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
		clipPoints( inc.start, inc.end, axis, sideOffset1, manifold );
		
		if( manifold.length < 2 ) return true;
		
		vec.x = sideNormalx;
		vec.y = sideNormaly;
		clipPoints( manifold[0].position, manifold[1].position, vec, sideOffset2, manifold );
		
		if( manifold.length < 2 ) return true;
		
		if( flip ){
		    mn.x = frontNormalx;
		    mn.y = frontNormaly;
		    manifold.flip = true;
		}
		else{
		    mn.x = -frontNormalx;
		    mn.y = -frontNormaly;
		}
		
		vec.x = frontNormalx;
		vec.y = frontNormaly;
		manifold.filter( vec, frontOffset );
		
		return true;
	    };
	}();
	
	
	PCollision2D.prototype.convexCircle = function( si, sj, xi, xj, Ri, normal, point ){
	    var vertices = si.vertices, normals = si.normals, vert, norm,
		count = vertices.length, radius = sj.radius,
		
		Ri11 = Ri[0], Ri21 = Ri[1], Ri12 = Ri[2], Ri22 = Ri[3],
		
		dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		
		localx = dx * Ri[0] + dy * Ri[2],
		localy = dx * Ri[1] + dy * Ri[3],
		
		v1, v2, ex, ey, length, invLength, dist, invDist, u, px, py,
		
		s, separation = -Infinity, normIndex, i;
	    
	    for( i = count; i--; ){
		vert = vertices[i]; norm = normals[i];
		
		s = norm.x * ( localx - vert.x ) + norm.y * ( localy - vert.y );
		
		if( s > radius ) return false;
		
		if( s > separation ){
		    separation = s;
		    normIndex = i;
		}
	    }
	    
	    if( separation < EPSILON ){
		norm = normals[ normIndex ];
		
		normal.x = norm.x;
		normal.y = norm.y;
		
		point.x = xj.x - radius * normal.x;
		point.y = xj.y - radius * normal.y;
		
		return true;
	    }
	    
	    v1 = vertices[ normIndex ];
	    v2 = vertices[ normIndex + 1 ] || vertices[0];
	    
	    ex = v2.x - v1.x;
	    ey = v2.y - v1.y;
	    
	    length = sqrt( ex * ex + ey * ey )
	    invLength = 1 / length;
	    
	    ex *= invLength;
	    ey *= invLength;
	    
	    if( length < EPSILON ){
		dx = localx - xi.x;
		dy = localy - xi.y;
		
		dist = sqrt( dx * dx + dy * dy );
		invDist = 1 / dist;
		
		dx *= invDist;
		dy *= invDist;
		
		if( dist > radius ) return false;
		
		normal.x = dx;
		normal.y = dy;
		
		point.x = xj.x - radius * dx;
		point.y = xj.y - radius * dy;
		
		return true;
	    }
	    
	    u = ( localx - v1.x ) * ex + ( localy - v1.y ) * ey;
	    
	    if( u <= 0 ){
		px = v1.x;
		py = v1.y;
	    }
	    else if( u >= length ){
		px = v2.x;
		py = v2.y;
	    }
	    else{
		px = ex * u + v1.x;
		py = ey * u + v1.y;
	    }
	    
	    dx = localx - px;
	    dy = localy - py;
	    
	    dist = sqrt( dx * dx + dy * dy );
	    if( dist > radius ) return false;
	    invDist = 1 / dist;
	    
	    dx *= invDist;
	    dy *= invDist;
	    
	    normal.x = dx;
	    normal.y = dy;
	    
	    point.x = xj.x - radius * dx;
	    point.y = xj.y - radius * dy;
	    
	    return true;
	};
	
	
	PCollision2D.prototype.circleCircle = function(){
	    var dx, dy, dist, invDist, radiusi, radiusj, r, separation,
		mnormal, point, vec = new Vec2;
	    
	    return function( si, sj, xi, xj, manifold ){
		dx = xj.x - xi.x;
		dy = xj.y - xi.y;
		dist = dx * dx + dy * dy
		
		radiusi = si.radius;
		radiusj = sj.radius;
		r = radiusi + radiusj;
		
		if( dist > r * r ) return false;
		
		manifold.clear();
		mnormal = manifold.normal;
		
		if( dist < EPSILON ){
		    mnormal.x = 0;
		    mnormal.y = 1;
		    separation = r;
		}
		else{
		    dist = sqrt( dist );
		    invDist = 1 / dist;
		    mnormal.x = dx * invDist;
		    mnormal.y = dy * invDist;
		    separation = dist - r;
		}
		
		manifold.add( vec );
		
		point = manifold[0];
		point.position.x = xj.x - ( radiusi * mnormal.x );
		point.position.y = xj.y - ( radiusi * mnormal.y );
		
		point.separation = separation;
		
		return true;
	    };
	}();
	
        
        return new PCollision2D;
    }
);