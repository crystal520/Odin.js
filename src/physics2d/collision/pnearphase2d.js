if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/shape/pshape2d",
	"physics2d/collision/pcollision2d",
	"physics2d/constraints/pcontact2d"
	
    ],
    function( Class, Mathf, Vec2, PShape2D, PCollision2D, PContact2D ){
	"use strict";
	
	var CIRCLE = PShape2D.CIRCLE,
	    RECT = PShape2D.RECT,
	    CONVEX = PShape2D.CONVEX;
	
	
	function PNearphase2D(){
	    
	    Class.call( this );
	    
	    this.contactPool = [];
	}
	
	Class.extend( PNearphase2D, Class );
	
	
	PNearphase2D.prototype.collisions = function( world, pairsi, pairsj, contacts ){
	    var bi, bj, i, il;
	    
	    this.clearContacts( contacts );
	    
	    for( i = 0, il = pairsi.length; i < il; i++ ){
		bi = pairsi[i];
		bj = pairsj[i];
		
		this.doNearPhase( contacts, bi, bj, bi.shape, bj.shape, bi.position, bj.position, bi.rotation, bj.rotation );
	    }
	};
	
	
	PNearphase2D.prototype.createContact = function( bi, bj ){
	    var contactPool = this.contactPool, c;
	    
	    if( contactPool.length ){
		c = contactPool.pop();
		c.bi = bi;
		c.bj = bj;
		return c;
	    }
	    
	    return new PContact2D( bi, bj );
	};
	
	
	PNearphase2D.prototype.clearContacts = function( contacts ){
	    var contactPool = this.contactPool, i, il;
	    
	    for( i = 0, il = contacts.length; i < il; i++ ){
		contactPool.push( contacts[i] );
	    }
	    
	    contacts.length = 0;
	};
	
	
	PNearphase2D.prototype.circleCircle = function(){
	    var dist = new Vec2;
	    
	    return function( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
		dist.vsub( pj, pi );
		
		var r = sj.radius + si.radius,
		    rsq = r * r,
		    dsq = dist.lenSq(),
		    c;
		
		if( dsq < rsq ){
		    c = this.createContact( bi, bj );
		    
		    c.ni.copy( dist ).norm();
		    
		    c.ri.copy( c.ni ).smul( si.radius );
		    c.rj.copy( c.ni ).smul( -sj.radius );
		    
		    contacts.push( c );
		}
	    };
	}();
	
	
	PNearphase2D.prototype.circleConvex = function( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
	    if( sj.worldVerticesNeedsUpdate ) sj.calculateWorldVertices( pj, rj );
	    if( sj.worldNormalsNeedsUpdate ) sj.calculateWorldNormals( rj );
	    
	    var c = this.createContact( bi, bj );
	    
	    contacts.push( c );
	};
	
	
	PNearphase2D.prototype.convexConvex = function(){
	    var axis = new Vec2,
		vec = new Vec2,
		manifolds = [];
	    
	    return function( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
		if( si.worldVerticesNeedsUpdate ) si.calculateWorldVertices( pi, ri );
		if( si.worldNormalsNeedsUpdate ) si.calculateWorldNormals( ri );
		
		if( sj.worldVerticesNeedsUpdate ) sj.calculateWorldVertices( pj, rj );
		if( sj.worldNormalsNeedsUpdate ) sj.calculateWorldNormals( rj );
		
		var depth = PCollision2D.findMSA( si, sj, pi, pj, axis ),
		    c, m, i, il;
		
		if( depth ){
		    PCollision2D.findManifolds( si, sj, axis, depth, manifolds );
		    
		    for( i = 0, il = manifolds.length; i < il; i++ ){
			c = this.createContact( bi, bj );
			m = manifolds[i];
			
			c.ni.copy( axis ).negate();
			
			vec.copy( m.normal ).negate().smul( m.depth );
			
			c.ri.vsub( m.point, vec ).sub( pi );
			c.rj.copy( m.point ).sub( pj );
			
			contacts.push( c );
		    }
		}
	    };
	}();
	
	
	PNearphase2D.prototype.doNearPhase = function( contacts, bi, bj, si, sj, pi, pj, ri, rj ){
	    
	    if( si && sj ){
		
		if( si.type === CIRCLE ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.circleCircle( contacts, bi, bj, si, sj, pi, pj, ri, rj );
			    break;
			
			case RECT:
			case CONVEX:
			    this.circleConvex( contacts, bi, bj, si, sj, pi, pj, ri, rj );
			    break;
		    }
		}
		else if( si.type === RECT || si.type === CONVEX ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.circleConvex( contacts, bj, bi, sj, si, pj, pi, rj, ri );
			    break;
			
			case RECT:
			case CONVEX:
			    this.convexConvex( contacts, bi, bj, si, sj, pi, pj, ri, rj );
			    break;
		    }
		}
	    }
	};
	
	
	return PNearphase2D;
    }
);