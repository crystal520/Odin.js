if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/shape/pshape2d",
	"physics2d/body/pbody2d",
	"physics2d/collision/pcollision2d",
	"physics2d/constraints/pcontact2d"
	
    ],
    function( Class, Mathf, Vec2, PShape2D, PBody2D, PCollision2D, PContact2D ){
	"use strict";
	
	var abs = Math.abs,
	    sqrt = Math.sqrt,
	    mMin = Math.min,
	    mMax = Math.max,
	    
	    CIRCLE = PShape2D.CIRCLE,
	    RECT = PShape2D.RECT,
	    CONVEX = PShape2D.CONVEX,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PContactGenerator2D(){
	    
	    Class.call( this );
	}
	
	Class.extend( PContactGenerator2D, Class );
	
	
	var oldContacts = [];
	
	PContactGenerator2D.prototype.getContacts = function( world, pairsi, pairsj, contacts ){
	    var bi, bj, i, il;
	    
	    for( i = 0, il = contacts.length; i < il; i++ ){
		oldContacts.push( contacts[i] );
	    }
	    contacts.length = 0;
	    
	    for( i = 0, il = pairsi.length; i < il; i++ ){
		bi = pairsi[i];
		bj = pairsj[i];
		
		nearPhase( contacts, bi, bj, bi.shape, bj.shape, bi.position, bj.position, bi.rotation, bj.rotation );
	    }
	};
	
	
	function makeContact( bi, bj ){
	    
	    if( oldContacts.length ){
		var contact = oldContacts.pop();
		contact.bi = bi;
		contact.bj = bj;
		return contact;
	    }
	    
	    return new PContact2D( bi, bj );
	}
	
	
	var dist = new Vec2;
	
	function circleCircle( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
	    var r = sj.radius + si.radius,
		rsq = r * r;
	    dist.vsub( pj, pi );
	    
	    if( dist.lenSq() < rsq ){
		var c = makeContact( bi, bj );
		
		c.ni.copy( dist ).norm();
		
		c.ri.copy( c.ni ).smul( si.radius );
		c.rj.copy( c.ni ).smul( -sj.radius );
		
		contacts.push( c );
	    }
	}
	
	
	function circleConvex( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
	    if( sj.worldVerticesNeedsUpdate ) sj.calculateWorldVertices( pj, rj );
	    if( sj.worldNormalsNeedsUpdate ) sj.calculateWorldNormals( rj );
	    
	    var c = makeContact( bi, bj );
	    
	    contacts.push( c );
	}
	
	
	var axis = new Vec2,
	    vec = new Vec2,
	    manifolds = [];
	
	function convexConvex( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
	    if( si.worldVerticesNeedsUpdate ) si.calculateWorldVertices( pi, ri );
	    if( si.worldNormalsNeedsUpdate ) si.calculateWorldNormals( ri );
	    
	    if( sj.worldVerticesNeedsUpdate ) sj.calculateWorldVertices( pj, rj );
	    if( sj.worldNormalsNeedsUpdate ) sj.calculateWorldNormals( rj );
	    
	    
	    var depth = PCollision2D.findMSA( si, sj, pi, pj, axis ),
		c, m, i, il;
	    
	    if( depth ){
		PCollision2D.findManifolds( si, sj, axis, depth, manifolds );
		
		for( i = 0, il = manifolds.length; i < il; i++ ){
		    c = makeContact( bi, bj );
		    m = manifolds[i];
		    
		    c.ni.copy( axis ).negate();
		    
		    vec.copy( m.normal ).negate();
		    vec.smul( m.depth );
		    
		    c.ri.vadd( m.point, vec ).sub( pi );
		    c.rj.copy( m.point ).sub( pj );
		    
		    contacts.push( c );
		}
	    }
	}
	
	
	function nearPhase( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
	    
	    if( si && sj ){
		
		if( si.type === CIRCLE ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    circleCircle( contacts, bi, bj, si, sj, pi, pj, ri, rj );
			    break;
			
			case RECT:
			case CONVEX:
			    circleConvex( contacts, bi, bj, si, sj, pi, pj, ri, rj );
			    break;
		    }
		}
		else if( si.type === RECT || si.type === CONVEX ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    circleConvex( contacts, bj, bi, sj, si, pj, pi, rj, ri );
			    break;
			
			case RECT:
			case CONVEX:
			    convexConvex( contacts, bi, bj, si, sj, pi, pj, ri, rj );
			    break;
		    }
		}
	    }
	}
	
	
	return PContactGenerator2D;
    }
);