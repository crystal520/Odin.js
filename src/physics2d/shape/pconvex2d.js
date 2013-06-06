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
	    cos = Math.cos,
	    sin = Math.sin,
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
	    
	    this.worldVertices = worldVertices = [];
	    this.worldNormals = worldNormals = [];
	    
	    for( i = 0, il = verts.length; i < il; i++ ){
		v1 = verts[i];
		v2 = verts[i+1] || verts[0];
		
		normals[i] = normal = new Vec2().vsub( v2, v1 ).perpR().norm();
		
		worldVertices[i] = v1.clone();
		worldNormals[i] = normal.clone();
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
	    
	    return function( position, rotation, aabb ){
		var vertices = this.vertices,
		    min = aabb.min, max = aabb.max,
		    minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity,
		    c = cos( rotation ), s = sin( rotation ),
		    vertex, ox, oy, x, y, i, il;
		
		for( i = vertices.length; i--; ){
		    vertex = vertices[i];
		    ox = vertex.x; oy = vertex.y;
		    
		    x = position.x + ( ox * c - oy * s );
		    y = position.y + ( ox * s + oy * c );
		    
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
	
	
	PConvex2D.prototype.calculateWorldVertices = function( position, R ){
	    var vertices = this.vertices, worldVertices = this.worldVertices,
		vertex, worldVertex, x, y, i, il;
	    
	    for( i = vertices.length; i--; ){
		vertex = vertices[i];
		worldVertex = worldVertices[i];
		x = vertex.x; y = vertex.y;
		
		worldVertex.x = position.x + ( x * R[0] + y * R[2] );
		worldVertex.y = position.y + ( x * R[1] + y * R[3] );
	    }
	};
	
	
	PConvex2D.prototype.calculateWorldNormals = function( R ){
	    var normals = this.normals, worldNormals = this.worldNormals,
		normal, worldNormal, x, y, i, il;
	    
	    for( i = normals.length; i--; ){
		normal = normals[i];
		worldNormal = worldNormals[i];
		x = normal.x; y = normal.y;
		
		worldNormal.x = x * R[0] + y * R[2];
		worldNormal.y = x * R[1] + y * R[3];
	    }
	};
	
        
        return PConvex2D;
    }
);