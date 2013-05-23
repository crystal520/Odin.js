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
	    
	    this.equations = [];
	    
	    this.iterations = 10;
	    this.tolerance = 0.00001;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function(){
	    var lambdas = [],
		invCs = [],
		Bs = [];
	    
	    return function( dt, world ){
		var toleranceSq = this.tolerance * this.tolerance,
		    maxIters = this.iterations,
		    eqs = this.equations,
		    bodies = world.bodies,
		    body, vlambda, wlambda,
		    vel, aVel,
		    neqs = eqs.length,
		    nbodies = bodies.length,
		    deltalambda, deltalambdaTot,
		    GWlambda, eq, lambda, invC, B,
		    i, j;
		
		if( neqs ){
		    
		    for( i = 0; i < neqs; i++ ){
			eq = eqs[i];
			
			if( eq.spookParamsNeedsUpdate ){
			    eq.updateSpookParams( dt );
			}
			lambdas[i] = 0;
			Bs[i] = eq.computeB( dt );
			invCs[i] = 1 / eq.computeC();
		    }
		    
		    for( i = 0; i < nbodies; i++ ){
			body = bodies[i];
			vlambda = body.vlambda;
			wlambda = body.wlambda;
			
			vlambda.set( 0, 0 );
			
			if( wlambda ){
			    body.wlambda = 0;
			}
		    }
		    
		    for( i = 0; i < maxIters; i++ ){
			
			deltalambdaTot = 0;
			
			for( j = 0; j < neqs; j++ ){
			    eq = eqs[j];
			    
			    B = Bs[j];
			    invC = invCs[j];
			    lambda = lambdas[j];
			    GWlambda = eq.computeGWlambda();
			    deltalambda = invC * ( B - GWlambda - eq.eps * lambda );
			    
			    if( lambda + deltalambda < eq.minForce ){
				deltalambda = eq.minForce - lambda;
			    }
			    else if( lambda + deltalambda > eq.maxForce ){
				deltalambda = eq.maxForce - lambda;
			    }
			    lambda[j] += deltalambda;
			    
			    deltalambdaTot += abs( deltalambda );
			    
			    eq.addToWlambda( deltalambda );
			}
			
			if( deltalambdaTot * deltalambdaTot < toleranceSq ){
			    break;
			}
		    }
		    
		    for( i = 0; i < nbodies; i++ ){
			body = bodies[i];
			vel = body.velocity;
			aVel = body.angularVelocity;
			
			vel.add( body.vlambda );
			
			if( aVel ){
			    body.angularVelocity += body.wlambda;
			}
		    }
		}
		
		return i;
	    };
	}();
	
	
	PSolver2D.prototype.add = function( eq ){
	    
	    this.equations.push( eq );
	};
	
	
	PSolver2D.prototype.remove = function( eq ){
	    var eqs = this.equations,
		index = eqs.indexOf( eq );
	    
	    if( index !== -1 ){
		eqs.splice( index, 1 );
	    }
	};
	
	
	PSolver2D.prototype.clear = function(){
	    
	    this.equations.length = 0;
	};
	
	
	return PSolver2D;
    }
);