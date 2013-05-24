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
	    this.tolerance = 0.000001;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function(){
	    var Bs = [], lambdas = [], invCs = [];
	    
	    return function( dt, world ){
		var maxIters = this.iterations,
		    tolerance = this.tolerance,
		    toleranceSq = tolerance * tolerance,
		    eqs = this.equations,
		    eqsLen = eqs.length,
		    bodies = world.bodies,
		    bodiesLen = bodies.length,
		    body, vlambda,
		    eq, B, invC, lambda, GWlambda,
		    deltalambda, deltalambdaTotal,
		    i, iter;
		    
		if( eqsLen ){
		    
		    for( i = 0; i < eqsLen; i++ ){
			eq = eqs[i];
			eq.updateConstants( dt );
			
			lambdas[i] = 0;
			Bs[i] = eq.calculateB( dt );
			invCs[i] = 1 / eq.calculateC();
		    }
		    
		    for( i = 0; i < bodiesLen; i++ ){
			body = bodies[i];
			vlambda = body.vlambda;
			
			vlambda.x = 0;
			vlambda.y = 0;
			
			if( body.wlambda !== undefined ) body.wlambda = 0;
		    }
		    
		    for( iter = 0; iter < maxIters; iter++ ){
			
			deltalambdaTotal = 0;
			
			for( i = 0; i < eqsLen; i++ ){
			    eq = eqs[i];
			    
			    B = Bs[i];
			    invC = invCs[i];
			    lambda = lambdas[i];
			    GWlambda = eq.calculateGWlambda();
			    deltalambda = invC * ( B - GWlambda - eq.eps * lambda );
			    
			    lambda[i] += deltalambda;
			    
			    deltalambdaTotal += abs( deltalambda );
			    
			    eq.addWlambda( deltalambda );
			}
			
			if( deltalambdaTotal * deltalambdaTotal < toleranceSq ) break;
		    }
		    
		    for( i = 0; i < bodiesLen; i++ ){
			body = bodies[i];
			body.velocity.add( body.vlambda );
			
			if( body.wlambda !== undefined ) body.angularVelocity += body.wlambda;
		    }
		}
		
		return iter;
	    };
	}();
	
	
	PSolver2D.prototype.add = function( eq ){
	    
	    this.equations.push( eq );
	};
	
	
	PSolver2D.prototype.remove = function( eq ){
	    var eqs = this.equations,
		idx = eqs.indexOf( eq );
	    
	    if( idx !== -1 ){
		eqs.splice( idx, 1 );
	    }
	};
	
	
	PSolver2D.prototype.clear = function(){
	    
	    this.equations.length = 0;
	};
	
	
	return PSolver2D;
    }
);