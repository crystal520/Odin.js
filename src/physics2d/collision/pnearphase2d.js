if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/collision/pcollision2d",
	"physics2d/collision/pmanifold2d",
	"physics2d/constraints/pcontact2d",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Vec2, PCollision2D, PManifold2D, PContact2D, PShape2D ){
        "use strict";
	
	var sqrt = Math.sqrt,
	    
	    BOX = PShape2D.BOX,
	    CIRCLE = PShape2D.CIRCLE,
	    CONVEX = PShape2D.CONVEX,
	    
	    collideCircleConvex = PCollision2D.collideCircleConvex,
	    collideConvexConvex = PCollision2D.collideConvexConvex,
	    
	    contactPool = [];
	
	
	function createContact( bi, bj ){
	    
	    if( contactPool.length ){
		var c = contactPool.pop();
		c.bi = bi;
		c.bj = bj;
		return c;
	    }
	    
	    return new PContact2D( bi, bj );
	};
	
        
	function PNearphase2D(){
	    
	    Class.call( this );
	}
	
	Class.extend( PNearphase2D, Class );
	
	
	PNearphase2D.prototype.collisions = function( world, pairsi, pairsj, contacts ){
	    var bi, bj, i, il;
	    
	    for( i = 0, il = contacts.length; i < il; i++ ){
		contactPool.push( contacts[i] );
	    }
	    contacts.length = 0;
	    
	    for( i = 0, il = pairsi.length; i < il; i++ ){
		bi = pairsi[i];
		bj = pairsj[i];
		
		this.nearphase( contacts, bi, bj, bi.shape, bj.shape, bi.position, bj.position, bi.rotation, bj.rotation );
	    }
	};
	
	
	PNearphase2D.prototype.circleCircle = function( contacts, bi, bj, si, sj, xi, xj, wi, wj ){
	    var dx = xj.x - xi.x,
		dy = xj.y - xi.y,
		d = dx * dx + dy * dy,
		r = si.radius + sj.radius,
		c, n;
	    
	    if( d < r * r ){
		c = createContact( bi, bj );
		n = c.n;
		
		d = d !== 0 ? 1 / sqrt( d ) : 0;
		
		n.x = dx * d;
		n.y = dy * d;
		
		c.ri.copy( n ).smul( si.radius );
		c.rj.copy( n ).smul( -sj.radius );
		
		contacts.push( c );
		
		bi.trigger("collide", bj );
		bj.trigger("collide", bi );
		bi.wake();
		bj.wake();
	    }
	};
	
	
	PNearphase2D.prototype.circleConvex = function(){
	    var normal = new Vec2, point = new Vec2, vec = new Vec2;
	    
	    return function( contacts, bi, bj, si, sj, xi, xj, wi, wj ){
		var depth = collideCircleConvex( si, sj, xi, xj, wi, wj, normal, point );
		
		if( depth ){
		    var c = createContact( bi, bj );
		    
		    c.n.copy( normal );
		    
		    vec.copy( normal ).smul( si.radius + depth );
		    
		    c.ri.copy( normal ).smul( si.radius );
		    c.rj.vadd( point, vec ).sub( xj );
		    
		    contacts.push( c );
		    
		    bi.trigger("collide", bj );
		    bj.trigger("collide", bi );
		    bi.wake();
		    bj.wake();
		}
	    };
	}();
	
	
	PNearphase2D.prototype.convexConvex = function(){
	    var manifold = new PManifold2D,
		vec = new Vec2;
	    
	    return function( contacts, bi, bj, si, sj, xi, xj, wi, wj ){
		var m, c, i, il;
		
		if( collideConvexConvex( si, sj, xi, xj, wi, wj, manifold ) ){
		    
		    for( i = 0, il = manifold.length; i < il; i++ ){
			m = manifold[i];
			c = createContact( bi, bj );
			
			c.n.copy( m.normal );
			
			vec.copy( m.normal ).smul( m.depth );
			
			c.ri.vadd( m.point, vec ).sub( xi );
			c.rj.copy( m.point ).sub( xj );
			
			contacts.push( c );
			
			bi.trigger("collide", bj );
			bj.trigger("collide", bi );
			bi.wake();
			bj.wake();
		    }
		}
	    };
	}();
	
	
	PNearphase2D.prototype.nearphase = function( contacts, bi, bj, si, sj, xi, xj, wi, wj ){
	    
	    if( si && sj ){
		
		if( si.type === CIRCLE ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.circleCircle( contacts, bi, bj, si, sj, xi, xj, wi, wj );
			    break;
			
			case BOX:
			case CONVEX:
			    
			    this.circleConvex( contacts, bi, bj, si, sj, xi, xj, wi, wj );
			    break;
		    }
		}
		else if( si.type === BOX || si.type === CONVEX ){
		    
		    switch( sj.type ){
			
			case CIRCLE:
			    this.circleConvex( contacts, bj, bi, sj, si, xj, xi, wj, wi );
			    break;
			
			case BOX:
			case CONVEX:
			    
			    this.convexConvex( contacts, bi, bj, si, sj, xi, xj, wi, wj );
			    break;
		    }
		}
	    }
	};
	
        
        return PNearphase2D;
    }
);