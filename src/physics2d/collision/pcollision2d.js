if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/line2",
	"physics2d/collision/pmanifold2d",
	"physics2d/constraints/pcontact2d"
    ],
    function( Class, Mathf, Vec2, Line2, PManifold2D, PContact2D ){
        "use strict";
	
	var abs = Math.abs,
	    sqrt = Math.sqrt,
	    equals = Mathf.equals,
	    
	    findMaxSeparation = PCollision2D.findMaxSeparation,
	    edgeSeparation = PCollision2D.edgeSeparation,
	    findIncidentEdge = PCollision2D.findIncidentEdge,
	    
	    contactPool = [];
	
	
	function createContact( bi, bj, contacts ){
	    var c = contactPool.length ? contactPool.pop() : new PContact2D( bi, bj );
	    
	    c.bi = bi;
	    c.bj = bj;
	    
	    contacts.push( c );
	    
	    return c;
	};
	
        
	function PCollision2D(){
	    
	    Class.call( this );
	}
	
	Class.extend( PCollision2D, Class );
	
	
	PCollision2D.prototype.clear = function( contacts ){
	    var i, il;
	    
	    for( i = 0, il = contacts.length; i < il; i++ ){
		contactPool.push( contacts[i] );
	    }
	    contacts.length = 0;
	};
	
	
	PCollision2D.prototype.convexConvex = function(){
	    var manifold = new PManifold2D,
		normal = new Vec2, vec = new Vec2, e = new Vec2, refNorm = new Vec2,
		edgei = new Line2, edgej = new Line2;
	    
	    
	    function clipPoints( v1, v2, n, o ){
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
	    
	    
	    function buildContacts( bi, bj, xi, xj, contacts ){
		var m, mnormal, mpoint, mdepth, c, n, ri, rj,
		    i, il;
		
		for( i = manifold.length; i--; ){
		    m = manifold[i];
		    mnormal = m.normal;
		    mpoint = m.point;
		    mdepth = m.depth;
		    
		    c = createContact( bi, bj, contacts );
		    n = c.n; ri = c.ri; rj = c.rj;
		    
		    n.x = mnormal.x;
		    n.y = mnormal.y;
		    
		    ri.x = ( mpoint.x + mnormal.x * mdepth ) - xi.x;
		    ri.y = ( mpoint.y + mnormal.y * mdepth ) - xi.y;
		    
		    rj.x = mpoint.x - xj.x;
		    rj.y = mpoint.y - xj.y;
		}
	    }
	    
	    
	    return function( bi, bj, si, sj, xi, xj, Ri, Rj, contacts ){
		var vertsi = si.vertices, vertsj = sj.vertices,
		    counti = vertsi.length, countj = vertsj.length,
		    
		    normsi = si.normals, normsj = sj.normals,
		    
		    dx = xj.x - xi.x,
		    dy = xj.y - xi.y,
		    
		    Ri11 = Ri[0], Ri21 = Ri[1], Ri12 = Ri[2], Ri22 = Ri[3],
		    Rj11 = Rj[0], Rj21 = Rj[1], Rj12 = Rj[2], Rj22 = Rj[3],
		    
		    n, vertex, x, y, nx, ny, dot, tmp, d, depth = Infinity, d1, d2,
		    mini = Infinity, maxi = -Infinity, minj = Infinity, maxj = -Infinity,
		    
		    dmaxi = -Infinity, dmaxj = -Infinity, edgeIndexi = 0, edgeIndexj = 0,
		    normalx, normaly, v, v1, v2, next, prev, leftx, lefty, rightx, righty,
		    
		    mnormal = manifold.normal, ref, inc, max1, max2, maxVertex, flip = false, offset1, offset2,
		    
		    i, j, il;
		
		for( i = 0, il = counti + countj; i < il; i++ ){
		    
		    if( i < counti ){
			n = normsi[i];
			x = n.x; y = n.y;
			
			nx = x * Ri11 + y * Ri12;
			ny = x * Ri21 + y * Ri22;
		    }
		    else{
			n = normsj[ i - counti ];
			x = n.x; y = n.y;
			
			nx = x * Rj11 + y * Rj12;
			ny = x * Rj21 + y * Rj22;
		    }
		    
		    for( j = counti; j--; ){
			vertex = vertsi[j];
			x = xi.x + ( vertex.x * Ri11 + vertex.y * Ri12 );
			y = xi.y + ( vertex.x * Ri21 + vertex.y * Ri22 );
			
			dot = x * nx + y * ny;
			mini = dot < mini ? dot : mini;
			maxi = dot > maxi ? dot : maxi;
		    }
		    if( mini > maxi ){
			tmp = mini; mini = maxi; maxi = tmp;
		    }
		    
		    for( j = countj; j--; ){
			vertex = vertsj[j];
			x = xj.x + ( vertex.x * Rj11 + vertex.y * Rj12 );
			y = xj.y + ( vertex.x * Rj21 + vertex.y * Rj22 );
			
			dot = x * nx + y * ny;
			minj = dot < minj ? dot : minj;
			maxj = dot > maxj ? dot : maxj;
		    }
		    if( minj > maxj ){
			tmp = minj; minj = maxj; maxj = tmp;
		    }
		    
		    if( maxi < minj || maxj < mini ) return;
		    
		    d1 = maxi - minj;
		    d2 = maxj - mini;
		    d = d1 < d2 ? d1 : d2;
		    
		    x = n.x;
		    y = n.y;
		    
		    if( d < depth ){
			depth = d;
			normal.x = x;
			normal.y = y;
			
			if( dx * x + dy * y < 0 ){
			    normal.x = -x;
			    normal.y = -y;
			}
		    }
		}
		
		normalx = normal.x;
		normaly = normal.y;
		
		for( i = counti; i--; ){
		    vertex = vertsi[i];
		    x = xi.x + ( vertex.x * Ri11 + vertex.y * Ri12 );
		    y = xi.y + ( vertex.x * Ri21 + vertex.y * Ri22 );
		    
		    dot = x * normalx + y * normaly;
		    if( dot > dmaxi ){
			dmaxi = dot;
			edgeIndexi = i;
		    }
		}
		
		v = vertsi[ edgeIndexi ];
		prev = edgeIndexi - 1 < 0 ? counti - 1 : edgeIndexi - 1;
		next = edgeIndexi + 1 < counti ? edgeIndexi + 1 : 0;
		
		v1 = vertsi[ prev ];
		v2 = vertsi[ next ];
		
		tmp = v.x - v1.x;
		righty = v.y - v1.y;
		
		rightx = xi.x + ( tmp * Ri11 + righty * Ri12 );
		righty = xi.y + ( tmp * Ri21 + righty * Ri22 );
		
		tmp = v.x - v2.x;
		lefty = v.y - v2.y;
		
		leftx = xi.x + ( tmp * Ri11 + lefty * Ri12 );
		lefty = xi.y + ( tmp * Ri21 + lefty * Ri22 );
		
		max1 = v;
		
		if( rightx * normalx + righty * normaly <= leftx * normalx + lefty * normaly ){
		    edgei.set( v1, v );
		}
		else{
		    edgei.set( v, v2 );
		}
		
		for( i = counti; i--; ){
		    vertex = vertsj[i];
		    x = xj.x + ( vertex.x * Rj11 + vertex.y * Rj12 );
		    y = xj.y + ( vertex.x * Rj21 + vertex.y * Rj22 );
		    
		    dot = x * -normalx + y * -normaly;
		    if( dot > dmaxj ){
			dmaxj = dot;
			edgeIndexj = i;
		    }
		}
		
		v = vertsj[ edgeIndexj ];
		prev = edgeIndexj - 1 < 0 ? counti - 1 : edgeIndexj - 1;
		next = edgeIndexj + 1 < counti ? edgeIndexj + 1 : 0;
		
		v1 = vertsj[ prev ];
		v2 = vertsj[ next ];
		
		tmp = v.x - v1.x;
		righty = v.y - v1.y;
		
		rightx = xj.x + ( tmp * Rj11 + righty * Rj12 );
		righty = xj.y + ( tmp * Rj21 + righty * Rj22 );
		
		tmp = v.x - v2.x;
		lefty = v.y - v2.y;
		
		leftx = xj.x + ( tmp * Rj11 + lefty * Rj12 );
		lefty = xj.y + ( tmp * Rj21 + lefty * Rj22 );
		
		max2 = v;
		
		if( rightx * -normalx + righty * -normaly <= leftx * -normalx + lefty * -normaly ){
		    edgej.set( v1, v );
		}
		else{
		    edgej.set( v, v2 );
		}
		
		manifold.clear();
		mnormal.x = normalx;
		mnormal.y = normaly;
		
		if( edgei.dot( normal ) <= edgej.dot( normal ) ){
		    ref = edgei;
		    inc = edgej;
		    maxVertex = max1;
		}
		else{
		    ref = edgej;
		    inc = edgei;
		    maxVertex = max2;
		    flip = true;
		}
		
		ref.norm();
		
		offset1 = ref.dot( ref.start );
		clipPoints( inc.start, inc.end, ref.delta( vec ), offset1 );
		
		if( manifold.length < 2 ){
		    manifold.filter( refNorm, refNorm.dot( maxVertex ) );
		    buildContacts( bi, bj, xi, xj, contacts );
		    return;
		}
		
		offset2 = ref.dot( ref.end );
		clipPoints(  manifold[0].point, manifold[1].point, ref.delta( vec ).negate(), offset2 );
		
		if( manifold.length < 2 ){
		    manifold.filter( refNorm, refNorm.dot( maxVertex ) );
		    buildContacts( bi, bj, xi, xj, contacts );
		    return;
		}
		
		ref.delta( refNorm );
		
		tmp = refNorm.x;
		refNorm.x = -refNorm.y;
		refNorm.y = tmp;
		
		if( flip ) refNorm.negate();
		
		manifold.filter( refNorm, refNorm.dot( maxVertex ) );
		
		buildContacts( bi, bj, xi, xj, contacts );
	    };
	}();
	
	
	PCollision2D.prototype.convexCircle = function( si, sj, xi, xj, normal, point ){
	    var vertices = si.worldVertices, normals = si.worldNormals, count = vertices.length, radius = sj.radius,
		vert, norm, v1, v2, len, invLen, dist, invDist,
		
		dx, dy, ex, ey, u, px, py,
		
		s, separation = -Infinity, normIndex, i;
		
	    for( i = count; i--; ){
		vert = vertices[i]; norm = normals[i];
		
		s = norm.x * ( xj.x - vert.x ) + norm.y * ( xj.y - vert.y );
		
		if( s > radius ) return false;
		
		if( s > separation ){
		    separation = s;
		    normIndex = i;
		}
	    }
	    
	    if( separation > 0 ){
		norm = normals[ normIndex ];
		
		normal.x = norm.x;
		normal.y = norm.y;
		
		point.x = xj.x - radius * normal.x;
		point.y = xj.y - radius * normal.y;
	    }
	    
	    v1 = vertices[ normIndex ];
	    v2 = vertices[ normIndex + 1 ] || vertices[0];
	    
	    ex = v1.x - v2.x;
	    ey = v1.y - v2.y;
	    
	    len = sqrt( ex * ex + ey * ey );
	    invLen = len !== 0 ? 1 / len : 0;
	    
	    ex *= invLen;
	    ey *= invLen;
	    
	    if( len < 0 ){
		dx = xj.x - v2.x;
		dy = xj.y - v2.y;
		
		dist = sqrt( dx * dx + dy * dy );
		if( dist > radius ) return false;
		
		invDist = dist !== 0 ? 1 / dist : 0;
		
		dx *= invDist;
		dy *= invDist;
		
		normal.x = dx;
		normal.y = dy;
		
		point.x = xj.x - radius * dx;
		point.y = xj.y - radius * dy;
	    }
	    
	    u = ( xj.x - v2.x ) * ex + ( xj.y - v2.y ) * ey;
	    
	    if( u <= 0 ){
		px = v2.x;
		py = v2.y;
	    }
	    else if( u >= len ){
		px = v1.x;
		py = v1.y;
	    }
	    else{
		px = ex * u + v2.x;
		py = ey * u + v2.y;
	    }
	    
	    dx = xj.x - px;
	    dy = xj.y - py;
	    
	    dist = sqrt( dx * dx + dy * dy );
	    if( dist > radius ) return false;
	    
	    invDist = dist !== 0 ? 1 / dist : 0;
	    
	    dx *= invDist;
	    dy *= invDist;
	    
	    normal.x = dx;
	    normal.y = dy;
	    
	    point.x = xj.x - radius * dx;
	    point.y = xj.y - radius * dy;
 	    
	    return true;
	};
	
	
	PCollision2D.prototype.circleCircle = function( si, sj, xi, xj, normal ){
	    var dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		d, dsq = dx * dx + dy * dy,
		
		radiusi = si.radius, radiusj = sj.radius,
		r = radiusi + radiusj;
	    
	    if( dsq > r * r ) return false;
	    
	    if( dsq < 0 ){
		normal.x = 0;
		normal.y = -1;
	    }
	    else{
		d = 1 / sqrt( dsq );
		normal.x = dx * d;
		normal.y = dy * d;
	    }
	    
	    return true;
	};
	
        
        return new PCollision2D;
    }
);