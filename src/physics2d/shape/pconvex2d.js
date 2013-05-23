if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/affine",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Mathf, Vec2, Affine, PShape2D ){
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
	
	
	PConvex2D.prototype.calculateInertia = function( mass ){
	    var vertices = this.vertices,
		v1, v2, a, b,
		d = 0, n = 0,
		i, il;
		
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		a = abs( vcross( v1, v2 ) );
		b = vdot( v2, v2 ) + vdot( v2, v1 ) + vdot( v1, v1 );
		
		d += a * b;
		n += a;
	    }
	    
	    return ( mass / 6 ) * ( d / n );
	};
	
	
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