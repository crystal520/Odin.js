if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/shape/pshape2d",
	"physics2d/body/pbody2d",
	"physics2d/collision/pcontact2d"
    ],
    function( Class, Mathf, Vec2, PShape2D, PBody2D, PContact2D ){
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
	
	
	function PContactGenerator2D( world ){
	    
	    Class.call( this );
	    
	    this.world = world;
	    
	    this.contacts = [];
	}
	
	Class.extend( PContactGenerator2D, Class );
	
	
	var contactPool = [];
	
	PContactGenerator2D.prototype.getContacts = function(){
	    var world = this.world,
		pairsA = world.pairsA, pairsB = world.pairsB,
		contacts = this.contacts,
		a, b, i, il;
	    
	    for( i = 0, il = contacts.length; i < il; i++ ){
		contactPool.push( contacts[i] );
	    }
	    
	    contacts.length = 0;
	    
	    for( i = 0, il = pairsA.length; i < il; i++ ){
		a = pairsA[i];
		b = pairsB[i];
		
		nearPhase( contacts, a, b, a.shape, b.shape );
	    }
	};
	
	
	function makeContact( a, b ){
	    if( contactPool.length ){
		var contact = contactPool.pop();
		contact.a = a;
		contact.b = b;
		return contact;
	    }
	    else{
		return new PContact2D( a, b );
	    }
	}
	
	
	var dist = new Vec2,
	    r, rsq;
	
	function circleCircle( contacts, a, b, sa, sb ){
	    dist.vsub( b.position, a.position );
	    r = sa.radius + sb.radius;
	    rsq = r * r;
	    
	    if( dist.lenSq() < rsq ){
		var c = makeContact( a, b );
		
		c.na.copy( dist ).norm();
		
		c.ca.copy( c.na ).smul( sa.radius );
		c.cb.copy( c.na ).smul( -sb.radius );
		
		contacts.push( c );
	    }
	}
	
	
	function circleCONVEX( contacts, a, b, sa, sb ){
	    var c = makeContact( a, b );
	    
	    contacts.push( c );
	}
	
	
	var sepAxis = new Vec2,
	    manifolds = [];
	
	function CONVEXCONVEX( contacts, a, b, sa, sb ){
	    var c, i, il;
	    
	    if( sa.findSeparatingAxis( sb, a.position, b.position, sepAxis ) ){
		manifolds.length = 0;
		sa.clipAgainstConvex( sepAxis, sb, manifolds );
		
		for( i = 0, il = manifolds.length; i < il; i++ ){
		    c = makeContact( a, b );
		    
		    c.na.copy( sepAxis ).negate();
		    
		    c.ca.copy( manifolds[i] ).negate();
		    c.cb.copy( manifolds[i] );
		    
		    contacts.push( c );
		}
	    }
	}
	
	
	function nearPhase( contacts, a, b, sa, sb ){
	    
	    if( sa && sb ){
		
		if( sa.type === CIRCLE ){
		    
		    switch( sb.type ){
			
			case CIRCLE:
			    circleCircle( contacts, a, b, sa, sb );
			    break;
			
			case RECT:
			case CONVEX:
			    circleCONVEX( contacts, a, b, sa, sb );
			    break;
		    }
		}
		else if( sa.type === RECT || a.type === CONVEX ){
		    
		    switch( sb.type ){
			
			case CIRCLE:
			    circleCONVEX( contacts, b, a, sa, sb );
			    break;
			
			case RECT:
			case CONVEX:
			    CONVEXCONVEX( contacts, a, b, sa, sb );
			    break;
		    }
		}
	    }
	}
	
	
	return PContactGenerator2D;
    }
);