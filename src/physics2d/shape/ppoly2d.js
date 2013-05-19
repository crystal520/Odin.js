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
	
	
	function PPoly2D( vertices ){
	    
	    PShape2D.call( this );
	    
	    this.type = PShape2D.POLY;
	    
	    this.vertices = vertices;
	    this.worldVertices = [];
	    
	    this.normals = [];
	    this.worldNormals = [];
	    
	    this.calculateNormals();
	}
	
	Class.extend( PPoly2D, PShape2D );
	
	
	PPoly2D.prototype.findSeparatingAxis = function(){
	    var dist = new Vec2;
	    
	    return function( other, posA, posB, sepAxis ){
		var normalsA = this.normals, normalsB = other.normals,
		    axis, d, dmin = Infinity, i, il;
		    
		for( i = 0, il = normalsA.length; i < il; i++ ){
		    axis = normalsA[i];
		    
		    d = this.testSepAxis( axis, other );
		    
		    if( d === false ){
			return false;
		    }
		    
		    if( d < dmin ){
			dmin = d;
			sepAxis.copy( axis );
		    }
		}
		
		for( i = 0, il = normalsB.length; i < il; i++ ){
		    axis = normalsB[i];
		    
		    d = other.testSepAxis( axis, this );
		    
		    if( d === false ){
			return false;
		    }
		    
		    if( d < dmin ){
			dmin = d;
			sepAxis.copy( axis );
		    }
		}
		
		dist.vsub( posB, posA );
		
		if( dist.dot( sepAxis ) < 0 ){
		    sepAxis.negate();
		}
		
		return true;
	    };
	}();
	
	
	PPoly2D.prototype.testSepAxis = function(){
	    var minmaxA = [],
		minmaxB = [];
		
	    function project( axis, shape, minmax ){
		var vertices = shape.worldVertices,
		    d = vertices[0].dot( axis ),
		    tmp, min = d, max = d,
		    i, il;
		    
		for( i = 1, il = vertices.length; i < il; i++ ){
		    d = vertices[i].dot( axis );
		    
		    if( d < min ) min = d;
		    else if( d > max ) max = d;
		}
		
		if( min > max ){
		    tmp = min; min = max; max = tmp;
		}
		
		minmax[0] = min;
		minmax[1] = max;
	    };
	    
	    return function( axis, other ){
		var aMin, aMax, bMin, bMax,
		    d1, d2, depth;
		
		project( axis, this, minmaxA );
		project( axis, other, minmaxB );
		
		aMin = minmaxA[0]; aMax = minmaxA[1];
		bMin = minmaxB[0]; bMax = minmaxB[1];
		
		if( aMax < bMin || bMax < aMin ){
		    return false;
		}
		
		d1 = aMax - bMin;
		d2 = bMax - aMin;
		depth = d1 < d2 ? d1 : d2;
		
		return depth;
	    };
	}();
	
	
	PPoly2D.prototype.calculateNormals = function(){
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
	
	
	PPoly2D.prototype.calculateAABB = function(){
	    
	    this.aabb.setFromPoints( this.vertices );
	    this.aabbNeedsUpdate = false;
	    
	    return this;
	};
	
	
	PPoly2D.prototype.calculateBoundingRadius = function(){
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
	
	
	PPoly2D.prototype.calculateInertia = function( mass ){
	    var vertices = this.vertices,
		v1, v2, a, b,
		denom = 0, numer = 0,
		i, il;
		
	    for( i = 0, il = vertices.length; i < il; i++ ){
		v1 = vertices[i];
		v2 = vertices[i+1] || vertices[0];
		
		a = abs( vcross( v1, v2 ) );
		b = vdot( v2, v2 ) + vdot( v2, v1 ) + vdot( v1, v1 );
		
		denom += a * b;
		numer += a;
	    }
	    
	    return ( mass / 6 ) * ( denom / numer );
	};
	
	
	PPoly2D.prototype.calculateWorldVertices = function( position, rotation ){
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
	};
	
	
	PPoly2D.prototype.calculateWorldNormals = function( rotation ){
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
	};
	
	
	return PPoly2D;
    }
);