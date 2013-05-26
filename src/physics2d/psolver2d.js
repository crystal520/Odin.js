if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	var abs = Math.abs;
	
	
	function PSolver2D(){
	    
	    Class.call( this );
	    
	    this.contacts = [];
	    
	    this.iterations = 10;
	    this.tolerance = 1e-18;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function( dt, world ){
	    var maxIters = this.iterations,
		tolerance = this.tolerance,
		toleranceSq = tolerance * tolerance,
		contacts = this.contacts,
		contactsLen = contacts.length,
		bodies = world.bodies,
		bodiesLen = bodies.length,
		body, vlambda, contact, i, iter;
		
	    if( contactsLen ){
		
		for( i = 0; i < bodiesLen; i++ ){
		    body = bodies[i];
		    vlambda = body.vlambda;
		    
		    vlambda.x = 0;
		    vlambda.y = 0;
		    
		    if( body.wlambda !== undefined ) body.wlambda = 0;
		}
		
		for( iter = 0; iter < maxIters; iter++ ){
		    
		    for( i = 0; i < contactsLen; i++ ){
			contact = contacts[i];
			contact.solve( dt );
		    }
		}
		
		for( i = 0; i < bodiesLen; i++ ){
		    body = bodies[i];
		    body.velocity.add( body.vlambda );
		    
		    if( body.wlambda !== undefined ) body.angularVelocity += body.wlambda;
		}
	    }
	    
	    return iter;
	};
	
	
	PSolver2D.prototype.add = function( contact ){
	    
	    this.contacts.push( contact );
	};
	
	
	PSolver2D.prototype.remove = function( contact ){
	    var contacts = this.contacts,
		idx = contacts.indexOf( contact );
	    
	    if( idx !== -1 ){
		contacts.splice( idx, 1 );
	    }
	};
	
	
	PSolver2D.prototype.clear = function(){
	    
	    this.contacts.length = 0;
	};
	
	
	return PSolver2D;
    }
);