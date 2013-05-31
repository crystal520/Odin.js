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
	    var i, il, v1, v2, worldVertices, worldNormals, verts, normal, normals;
	    
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
		
		worldVertices[i] = v1.clone();
		
		normals[i] = normal = new Vec2().vsub( v2, v1 ).perpR();
		
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
		v, x, y, i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
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
		    x, y, i, il;
		
		for( i = 0, il = vertices.length; i < il; i++ ){
		    v.copy( vertices[i] );
		    v.rotate( rotation );
		    v.add( position );
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
	}();
	
	
	PConvex2D.prototype.calculateInertia = function( mass ){
	    var vertices = this.vertices,
		v1, v2, a, b,
		d = 0, n = 0,
		i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		a = abs( v1.cross( v2 ) );
		b = v2.dot( v2 ) + v2.dot( v1 ) + v1.dot( v1 );
		
		d += a * b;
		n += a;
	    }
	    
	    return ( mass / 6 ) * ( d / n );
	};
	
	
	PConvex2D.prototype.calculateBoundingRadius = function(){
	    var vertices = this.vertices,
		radiusSq = vertices[0].lenSq(), lenSq, i, il;
		
	    for( i = 1, il = vertices.length; i < il; i++ ){
		lenSq = vertices[i].lenSq();
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


	PConvex2D.prototype.calculateWorldVertices = function( position, rotation ){
	    var vertices = this.vertices,
		worldVertices = this.worldVertices,
		worldVertex, i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		worldVertex = worldVertices[i];
		
		worldVertex.copy( vertices[i] );
		worldVertex.rotate( rotation );
		worldVertex.add( position );
	    }
	};


	PConvex2D.prototype.calculateWorldNormals = function( rotation ){
	    var normals = this.normals,
		worldNormals = this.worldNormals,
		worldNormal, i, il;
	    
	    for( i = 0, il = normals.length; i < il; i++ ){
		worldNormal = worldNormals[i];
		
		worldNormal.copy( normals[i] );
		worldNormal.rotate( rotation );
	    }
	};
	
        
        return PConvex2D;
    }
);