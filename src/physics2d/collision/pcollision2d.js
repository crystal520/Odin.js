if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/line2"
    ],
    function( Class, Mathf, Vec2, Line2 ){
        "use strict";
	
	var sqrt = Math.sqrt,
	    equals = Mathf.equals,
	    
	    MIN_VALUE = Number.MIN_VALUE,
	    MAX_VALUE = Number.MAX_VALUE,
	    
	    findMinSeparation,
	    findMaxSeparatingEdge,
	    findManifolds;
	
        
	function PCollision2D(){
	    
	    Class.call( this );
	}
	
	Class.extend( PCollision2D, Class );
	
	
	PCollision2D.prototype.findMinSeparation = findMinSeparation = function(){
	    var dist = new Vec2;
	    
	    return function( worldVerticesi, worldVerticesj, worldNormalsi, worldNormalsj, si, sj, xi, xj, axis ){
		var normalsNumi = si.normals.length, normalsNumj = sj.normals.length,
		    vertsNumi = si.vertices.length, vertsNumj = sj.vertices.length,
		    
		    dx = xj.x - xi.x,
		    dy = xj.y - xi.y,
		    
		    dot, j, jl, aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity,
		    d, d1, d2, dmin = Infinity,
		    testAxis, ax, ay, tmp, i, il, j, jl;
		
		for( i = 0, il = normalsNumi + normalsNumj; i < il; i++ ){
		    testAxis = worldNormalsi[i] || worldNormalsj[ i - normalsNumi ];
		    
		    for( j = 0; j < vertsNumi; j++ ){
			dot = testAxis.dot( worldVerticesi[j] );
			aMin = dot < aMin ? dot : aMin;
			aMax = dot > aMax ? dot : aMax;
		    }
		    if( aMin > aMax ){
			tmp = aMin; aMin = aMax; aMax = tmp;
		    }
		    
		    for( j = 0; j < vertsNumj; j++ ){
			dot = testAxis.dot( worldVerticesj[j] );
			bMin = dot < bMin ? dot : bMin;
			bMax = dot > bMax ? dot : bMax;
		    }
		    if( bMin > bMax ){
			tmp = bMin; bMin = bMax; bMax = tmp;
		    }
		    
		    if( aMax < bMin || bMax < aMin ) return false;
		    
		    ax = testAxis.x;
		    ay = testAxis.y;
		    
		    d1 = aMax - bMin;
		    d2 = bMax - aMin;
		    d = d1 < d2 ? d1 : d2;
		    
		    if( d < dmin ){
			dmin = d;
			
			if( dx * ax + dy * ay < 0 ){
			    axis.x = -ax;
			    axis.y = -ay;
			}
			else{
			    axis.x = ax;
			    axis.y = ay;
			}
		    }
		}
		
		return dmin;
	    };
	}();
	
	
	PCollision2D.prototype.findMaxSeparatingEdge = findMaxSeparatingEdge = function(){
	    var left = new Vec2, right = new Vec2;
	    
	    return function( shape, worldVertices, axis, edge, max ){
		var vertices = shape.vertices, d, dmax = -Infinity, v, v1, v2,
		    next, prev, idx, i, il;
		    
		for( i = 0, il = vertices.length; i < il; i++ ){
		    d = axis.dot( worldVertices[i] );
		    
		    if( d > dmax ){
			dmax = d;
			idx = i;
		    }
		}
		
		v = worldVertices[ idx ];
		prev = idx - 1 < 0 ? il - 1 : idx - 1;
		next = idx + 1 > il ? 0 : 0;
		
		v1 = worldVertices[ prev ];
		v2 = worldVertices[ next ];
		
		right.vsub( v, v1 );
		left.vsub( v, v2 );
		
		max.x = v.x;
		max.y = v.y;
		
		if( right.dot( axis ) <= left.dot( axis ) ){
		    edge.set( v1, v );
		}
		else{
		    edge.set( v, v2 );
		}
	    };
	}();
	
	
	PCollision2D.prototype.collideConvexConvex = function(){
	    var axis = new Vec2,
		worldVerticesi = [], worldVerticesj = [],
		worldNormalsi = [], worldNormalsj = [],
		e1 = new Line2, e2 = new Line2,
		max1 = new Vec2, max2 = new Vec2,
		vec = new Vec2, e = new Vec2, refNorm = new Vec2;
	    
	    function clipPoints( v1, v2, axis, offset, manifold ){
		var d1 = axis.dot( v1 ) - offset,
		    d2 = axis.dot( v2 ) - offset,
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
	    
	    return function( si, sj, xi, xj, wi, wj, manifold ){
		var verticesi = si.vertices, verticesj = sj.vertices, vertex,
		    normalsi = si.normals, normalsj = sj.normals,
		    
		    depth, flip = false, offset1, offset2, maxVertex,
		    ref, inc, tmp, max, m1, m2, i, il;
		
		for( i = 0, il = verticesi.length; i < il; i++ ){
		    vertex = worldVerticesi[i];
		    if( !vertex ) worldVerticesi[i] = vertex = new Vec2;
		    
		    vertex.copy( verticesi[i] );
		    vertex.rotate( wi );
		    vertex.add( xi );
		}
		
		for( i = 0, il = verticesj.length; i < il; i++ ){
		    vertex = worldVerticesj[i];
		    if( !vertex ) worldVerticesj[i] = vertex = new Vec2;
		    
		    vertex.copy( verticesj[i] );
		    vertex.rotate( wj );
		    vertex.add( xj );
		}
		
		for( i = 0, il = normalsi.length; i < il; i++ ){
		    vertex = worldNormalsi[i];
		    if( !vertex ) worldNormalsi[i] = vertex = new Vec2;
		    
		    vertex.copy( normalsi[i] );
		    vertex.rotate( wi );
		}
		
		for( i = 0, il = normalsj.length; i < il; i++ ){
		    vertex = worldNormalsj[i];
		    if( !vertex ) worldNormalsj[i] = vertex = new Vec2;
		    
		    vertex.copy( normalsj[i] );
		    vertex.rotate( wj );
		}
		
		depth = findMinSeparation( worldVerticesi, worldVerticesj, worldNormalsi, worldNormalsj, si, sj, xi, xj, axis )
		
		if( !depth ) return depth;
		
		findMaxSeparatingEdge( si, worldVerticesi, axis, e1, max1 );
		findMaxSeparatingEdge( sj, worldVerticesj, vec.copy( axis ).negate(), e2, max2 );
		
		manifold.clear();
		manifold.normal.copy( axis );
		
		if( e1.dot( axis ) <= e2.dot( axis ) ){
		    ref = e1;
		    inc = e2;
		    maxVertex = max1;
		}
		else{
		    ref = e2;
		    inc = e1;
		    maxVertex = max2;
		    flip = true;
		}
		
		ref.norm();
		
		offset1 = ref.dot( ref.start );
		
		clipPoints( inc.start, inc.end, ref.vec( vec ).negate(), offset1, manifold );
		
		if( manifold.length < 2 ) return depth;
		
		offset2 = ref.dot( ref.end );
		clipPoints( manifold[0].point, manifold[1].point, ref.vec( vec ), offset2, manifold );
		
		if( manifold.length < 2 ) return depth;
		
		ref.vec( refNorm );
		
		tmp = refNorm.x;
		refNorm.x = -refNorm.y;
		refNorm.y = tmp;
		
		if( flip ){
		    refNorm.negate();
		}
		
		max = refNorm.dot( maxVertex );
		manifold.filter( refNorm, max );
		
		return depth;
	    };
	}();
	
	
	PCollision2D.prototype.collideCircleConvex = function(){
	    var vec = new Vec2,
		worldVertices = [], worldNormals = [];
	    
	    return function( si, sj, xi, xj, wi, wj, normal, point ){
		var vertices = sj.vertices, normals = sj.normals,
		    radius = si.radius, vertex,
		    
		    dist, invDist, u, px, py, dx, dy,
		    
		    next, v1, v2, ex, ey, length, invLength,
		    
		    normalIndex = 0, s, separation = -MAX_VALUE,
		    i, il;
		
		for( i = 0, il = vertices.length; i < il; i++ ){
		    vertex = worldVertices[i];
		    if( !vertex ) worldVertices[i] = vertex = new Vec2;
		    
		    vertex.copy( vertices[i] );
		    vertex.rotate( wj );
		    vertex.add( xj );
		}
		
		for( i = 0, il = normals.length; i < il; i++ ){
		    vertex = worldNormals[i];
		    if( !vertex ) worldNormals[i] = vertex = new Vec2;
		    
		    vertex.copy( normals[i] );
		    vertex.rotate( wj );
		}
		
		for( i = 0, il = vertices.length; i < il; i++ ){
		    s = worldNormals[i].x * ( xi.x - worldVertices[i].x ) + worldNormals[i].y * ( xi.y - worldVertices[i].y );
		    
		    if( s > radius ) return false;
		    if( s > separation ){
			separation = s;
			normalIndex = i;
		    }
		}
		
		if( separation < MIN_VALUE ){
		    normal.copy( worldNormals[ normalIndex ] );
		    
		    point.x = xi.x - radius * normal.x;
		    point.y = xi.y - radius * normal.y;
		    
		    return separation;
		}
		
		v1 = worldVertices[ normalIndex ];
		
		next = normalIndex + 1 < vertices.length ? normalIndex + 1 : 0;
		v2 = worldVertices[ next ];
		
		ex = v2.x - v1.x;
		ey = v2.y - v1.y;
		
		length = sqrt( ex * ex + ey * ey );
		invLength = 1 / length;
		
		ex *= invLength;
		ey *= invLength;
		
		if( length < MIN_VALUE ){
		    dx = v1.x - xi.x;
		    dy = v1.y - xi.y;
		    
		    dist = sqrt( dx * dx + dy * dy );
		    
		    if( dist > radius ) return false;
		    
		    invDist = 1 / dist;
		    
		    normal.x = dx * invDist;
		    normal.y = dy * invDist;
		    
		    point.x = xi.x + radius * normal.x;
		    point.y = xi.y + radius * normal.y;
		    
		    return dist;
		}
		
		u = ( xi.x - v1.x ) * ex + ( xi.y - v1.y ) * ey;
		
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
		
		dx = px - xi.x;
		dy = py - xi.y;
		dist = sqrt( dx * dx + dy * dy );
		
		if( dist > radius ) return false;
		
		invDist = 1 / dist;
		dx *= invDist;
		dy *= invDist;
		
		normal.x = dx;
		normal.y = dy;
		
		point.x = xi.x - radius * normal.x;
		point.y = xi.y - radius * normal.y;
		
		return dist;
	    };
	}();
	
        
        return new PCollision2D;
    }
);