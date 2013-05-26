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
	    sqrt = Math.sqrt,
	    vdot = Vec2.vdot,
	    vcross = Vec2.vcross;
	
	
	function PConvex2D( vertices ){
	    
	    PShape2D.call( this );
	    
	    this.type = PShape2D.CONVEX;
	    
	    this.vertices = vertices || [
		new Vec2( 0, 0.5 ),
		new Vec2( -0.5, -0.5 ),
		new Vec2( 0.5, -0.5 )
	    ];
	    this.worldVertices = [];
	    
	    this.normals = [];
	    this.worldNormals = [];
	    
	    this.worldVerticesNeedsUpdate = true;
	    this.worldNormalsNeedsUpdate = true;
	    
	    this.calculateNormals();
	    this.calculateBoundingRadius();
	}
	
	Class.extend( PConvex2D, PShape2D );
	
	
	PConvex2D.prototype.calculateNormals = function(){
	    var vertices = this.vertices,
		normals = this.normals,
		i, il, normal, v1, v2;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		normal = normals[i];
		
		if( !normal ){
		    normals[i] = normal = new Vec2;
		}
		
		normal.vsub( v2, v1 ).normR();
	    }
	    
	    return this;
	};
	
	
	PConvex2D.prototype.calculateAABB = function(){
	    
	    this.aabb.setFromPoints( this.vertices );
	    this.aabbNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PConvex2D.prototype.calculateWorldAABB = function(){
	    var v = new Vec2;
	    
	    return function( position, rotation, aabb ){
		var vertices = this.vertices,
		    min = aabb.min, max = aabb.max,
		    minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity,
		    i, il;
		    
		for( i = 0, il = vertices.length; i < il; i++ ){
		    v.copy( vertices[i] );
		    v.rotate( rotation );
		    v.add( position );
		    
		    minx = v.x < minx ? v.x : minx;
		    miny = v.y < miny ? v.y : miny;
		    
		    maxx = v.x > maxx ? v.x : maxx;
		    maxy = v.y > maxy ? v.y : maxy;
		}
		
		min.x = minx;
		min.y = miny;
		max.x = maxx;
		max.y = maxy;
		
		return aabb;
	    };
	}();
	
	
	PConvex2D.prototype.calculateBoundingRadius = function(){
	    var vertices = this.vertices,
		radiusSq = vertices[0].lenSq(), lenSq, i, il;
		
	    for( i = 1, il = vertices.length; i < il; i++ ){
		lenSq = vertices[i].lenSq();
		
		if( lenSq > radiusSq ){
		    radiusSq = lenSq;
		}
	    }
	    
	    this.boundingRadius = sqrt( radiusSq );
	    this.boundingRadiusNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PConvex2D.prototype.calculateInertia = function(){
	    var s = 1 / 6;
	    
	    return function( mass ){
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
		
		return ( mass * s ) * ( d / n );
	    };
	}();
	
	
	PConvex2D.prototype.calculateWorldVertices = function( position, rotation ){
	    var vertices = this.vertices,
		worldVertices = this.worldVertices,
		worldVertex, i, il;
	    
	    for( i = 0, il = vertices.length; i < il; i++ ){
		worldVertex = worldVertices[i];
		
		if( !worldVertex ){
		    worldVertices[i] = worldVertex = new Vec2;
		}
		
		worldVertex.copy( vertices[i] );
		worldVertex.rotate( rotation );
		worldVertex.add( position );
	    }
	    
	    this.worldVerticesNeedsUpdate = false;
	};
	
	
	PConvex2D.prototype.calculateWorldNormals = function( rotation ){
	    var normals = this.normals,
		worldNormals = this.worldNormals,
		worldNormal, i, il;
	    
	    for( i = 0, il = normals.length; i < il; i++ ){
		worldNormal = worldNormals[i];
		
		if( !worldNormal ){
		    worldNormals[i] = worldNormal = new Vec2;
		}
		
		worldNormal.copy( normals[i] );
		worldNormal.rotate( rotation );
	    }
	    
	    this.worldNormalsNeedsUpdate = false;
	};
	
	
	return PConvex2D;
    }
);