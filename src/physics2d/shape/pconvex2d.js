if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Vec2, PShape2D ){
        "use strict";
	
	var abs = Math.abs,
	    sqrt = Math.sqrt;
	
        
	function PConvex2D( vertices ){
	    var v1, v2, normal, verts, normals,
		worldVertices, worldNormals,
		i, il;
	    
	    PShape2D.call( this );
	    
	    this.type = PShape2D.CONVEX;
	    
	    this.vertices = verts = vertices instanceof Array ? vertices : [
		new Vec2( 0.5, 0.5 ),
		new Vec2( -0.5, 0.5 ),
		new Vec2( -0.5, -0.5 ),
		new Vec2( 0.5, -0.5 )
	    ];
	    
	    this.normals = normals = [];
	    
	    for( i = 0, il = verts.length; i < il; i++ ){
		v1 = verts[i];
		v2 = verts[i+1] || verts[0];
		
		normals[i] = new Vec2(
		    v2.y - v1.y,
		    -( v2.x - v1.x )
		).norm();
	    }
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
	    this.calculateVolume();
	}
	
	Class.extend( PConvex2D, PShape2D );
	
	
	PConvex2D.prototype.calculateAABB = function(){
	    var vertices = this.vertices,
		aabb = this.aabb, min = aabb.min, max = aabb.max,
		minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity,
		v, x, y, i;
	    
	    for( i = vertices.length; i--; ){
		v = vertices[i];
		x = v.x; y = v.y
		
		minx = x < minx ? x : minx;
		miny = y < miny ? y : miny;
		
		maxx = x > maxx ? x : maxx;
		maxy = y > maxy ? y : maxy;
	    }
	    
	    min.x = minx;
	    min.y = miny;
	    max.x = maxx;
	    max.y = maxy;
	};
	
	
	PConvex2D.prototype.calculateWorldAABB = function(){
	    var v = new Vec2;
	    
	    return function( position, R, aabb ){
		var vertices = this.vertices,
		    px = position.x, py = position.y,
		    min = aabb.min, max = aabb.max,
		    minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity,
		    R11 = R[0], R12 = R[2], R21 = R[1], R22 = R[3],
		    vertex, ox, oy, x, y, i, il;
		
		for( i = vertices.length; i--; ){
		    vertex = vertices[i];
		    ox = vertex.x; oy = vertex.y;
		    
		    x = px + ( ox * R11 + oy * R12 );
		    y = py + ( ox * R21 + oy * R22 );
		    
		    minx = x < minx ? x : minx;
		    miny = y < miny ? y : miny;
		    
		    maxx = x > maxx ? x : maxx;
		    maxy = y > maxy ? y : maxy;
		}
		
		min.x = minx;
		min.y = miny;
		max.x = maxx;
		max.y = maxy;
	    };
	}();
	
	
	PConvex2D.prototype.calculateInertia = function( mass ){
	    var vertices = this.vertices,
		v1, v2, v1x, v1y, v2x, v2y,
		a, b, d = 0, n = 0,
		i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		v1x = v1.x; v1y = v1.y;
		v2x = v2.x; v2y = v2.y;
		
		a = abs( v1x * v2y - v1y * v2x );
		b = ( v2x * v2x + v2y * v2y ) + ( v2x * v1x + v2y * v1y ) + ( v1x * v1x + v1y * v1y );
		
		d += a * b;
		n += a;
	    }
	    
	    return ( mass / 6 ) * ( d / n );
	};
	
	
	PConvex2D.prototype.calculateBoundingRadius = function(){
	    var vertices = this.vertices,
		radiusSq = -Infinity,
		vertex, x, y, lenSq, i, il;
		
	    for( i = vertices.length; i--; ){
		vertex = vertices[i];
		x = vertex.x; y = vertex.y;
		
		lenSq = x * x + y * y;
		radiusSq = lenSq > radiusSq ? lenSq : radiusSq;
	    }
	    
	    this.boundingRadius = sqrt( radiusSq );
	};
	
	
	PConvex2D.prototype.calculateVolume = function(){
	    var vertices = this.vertices,
		v1, v2, volume = 0, i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		volume += v1.x * v2.y - v1.y * v2.x;
	    }
	    
	    this.volume = volume;
	};
	
	
	PConvex2D.prototype.calculateVolume = function(){
	    var vertices = this.vertices,
		v1, v2, volume = 0, i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		volume += v1.x * v2.y - v1.y * v2.x;
	    }
	    
	    this.volume = volume;
	};
	
        
        return PConvex2D;
    }
);