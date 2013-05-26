if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/line2",
	"physics2d/shape/pshape2d",
	"physics2d/body/pbody2d"
    ],
    function( Class, Mathf, Vec2, Line2, PShape2D, PBody2D ){
	"use strict";
	
	var abs = Math.abs;
	
	
	function PCollision2D(){}
	
	
	PCollision2D.prototype.findMSA = function(){
	    var dist = new Vec2,
		minmaxA = [], minmaxB = [];
	    
	    function project( verts, n, minmax ){
		var d = verts[0].dot(n), min = d, max = d, tmp, i, il;
		
		for( i = 1, il = verts.length; i < il; i++ ){
		    d = verts[i].dot( n );
		    
		    min = d < min ? d : min;
		    max = d > max ? d : max;
		}
		
		if( min > max ){
		    tmp = min; min = max; max = tmp;
		}
		
		minmax[0] = min;
		minmax[1] = max;
	    }
	    
	    
	    return function( si, sj, pi, pj, axis ){
		var normsi = si.worldNormals, normsj = sj.worldNormals,
		    normsNumi = normsi.length, normsNumj = normsj.length,
		    
		    aMin, aMax, bMin, bMax,
		    d, d1, d2, dmin = Infinity,
		    normal, i, il, j, jl;
		
		dist.vsub( pj, pi );
		
		for( i = 0, il = normsNumi + normsNumj; i < il; i++ ){
		    normal = normsi[i] || normsj[ i - normsNumi ];
		    
		    project( si.worldVertices, normal, minmaxA );
		    project( sj.worldVertices, normal, minmaxB );
		    
		    aMin = minmaxA[0]; aMax = minmaxA[1];
		    bMin = minmaxB[0]; bMax = minmaxB[1];
		    
		    if( aMax < bMin || bMax < aMin ) return false;
		    
		    d1 = aMax - bMin;
		    d2 = bMax - aMin;
		    d = d1 < d2 ? d1 : d2;
		    
		    if( d < dmin ){
			dmin = d;
			axis.x = normal.x;
			axis.y = normal.y;
			
			if( dist.dot( normal ) > 0 ) axis.negate();
		    }
		}
		
		return dmin;
	    };
	}();
	
	
	PCollision2D.prototype.findManifolds = function(){
	    var oldManifolds = [], manifoldsToRemove = [],
		vec = new Vec2, e = new Vec2, refNorm = new Vec2,
		left = new Vec2, right = new Vec2,
		ei = new Line2, ej = new Line2;
	    
	    
	    function createManifold( v, manifolds ){
		var m;
		
		if( oldManifolds.length ){
		    m = oldManifolds.pop();
		}
		else{
		    m = new Manifold;
		}
		
		m.point.copy( v );
		manifolds.push(m);
	    }
	    
	    
	    function getEdge( verts, n, edge ){
		var d, max = -Infinity, idx = -1, v, v1, v2,
		    i, il;
		
		for( i = 0, il = verts.length; i < il; i++ ){
		    d = verts[i].dot( n );
		    if( d > max ){
			max = d;
			idx = i;
		    }
		}
		
		v = verts[ idx ];
		v1 = verts[ idx-1 ] || verts[ il-1 ];
		v2 = verts[ idx+1 ] || verts[0];
		
		left.vsub( v, v2 );
		right.vsub( v, v1 );
		
		if( right.dot( n ) <= left.dot( n ) ){
		    edge.set( v1, v );
		}
		else{
		    edge.set( v, v2 );
		}
	    };
	    
	    
	    function clipPoints( v1, v2, n, o, manifolds ){
		var d1 = n.dot( v1 ) - o,
		    d2 = n.dot( v2 ) - o,
		    u;
		
		if( d1 >= 0 ) createManifold( v1, manifolds );
		if( d2 >= 0 ) createManifold( v2, manifolds );
		
		if( d1 * d2 < 0 ){
		    u = d1 / ( d1 - d2 );
		    e.vsub( v2, v1 );
		    e.smul( u ).add( v1 );
		    createManifold( e, manifolds );
		}
	    }
	    
	    
	    function Manifold(){
		this.point = new Vec2;
		this.normal = new Vec2;
		this.depth = 0;
	    }
	    
	    
	    return function( si, sj, axis, depth, manifolds ){
		var flip = false, ref, inc, tmp, d, idx, o1, o2, max,
		    i, il, manifold;
		
		for( i = 0, il = manifolds.length; i < il; i++ ){
		    manifold = manifolds[i];
		    manifold.normal.copy( axis );
		    manifold.depth = depth;
		    oldManifolds.push( manifolds[i] );
		}
		manifolds.length = manifoldsToRemove.length = 0;
		
		getEdge( si.worldVertices, axis, ei );
		getEdge( sj.worldVertices, vec.copy( axis ).negate(), ej );
		
		if( ei.dot( axis ) <= ej.dot( axis ) ){
		    ref = ei;
		    inc = ej;
		}
		else{
		    ref = ej;
		    inc = ei;
		    flip = true;
		}
		
		ref.norm();
		
		o1 = ref.dot( ref.start );
		clipPoints( inc.start, inc.end, ref.vec( vec ), o1, manifolds );
		
		if( manifolds.length < 2 ) return;
		
		o2 = ref.dot( ref.end );
		clipPoints( manifolds[0].point, manifolds[1].point, ref.vec( vec ).negate(), o2, manifolds );
		
		if( manifolds.length < 2 ) return;
		
		refNorm.copy( ref.vec( vec ) ).normR();
		
		if( flip ) refNorm.negate();
		
		max = refNorm.dot( ref.vec( vec ) );
		
		manifolds[0].depth = refNorm.dot( manifolds[0].point ) - max;
		manifolds[1].depth = refNorm.dot( manifolds[1].point ) - max;
		
		console.log() ;
	    };
	}();
	
	
	return new PCollision2D;
    }
);