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
	    
	    this.constraints = [];
	    
	    this.iterations = 10;
	    this.tolerance = 1e-6;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function(){
	    var lambdas = [], invCs = [], Bs = [];
	    
	    return function( world, dt ){
		var iterations = this.iterations,
		
		    tolerance = this.tolerance,
		    toleranceSq = tolerance * tolerance,
		    
		    constraints = this.constraints,
		    constraintsLen = constraints.length,
		    
		    bodies = world.bodies,
		    bodiesLen = bodies.length,
		    
		    B, invC, GWlambda, deltalambda, deltalambdaTotal, lambda,
		    
		    body, velocity, vlambda, c, i, iter;
		    
		if( constraintsLen ){
		    
		    for( i = bodiesLen; i--; ){
			body = bodies[i];
			vlambda = body.vlambda;
			
			vlambda.x = 0;
			vlambda.y = 0;
			
			if( body.wlambda !== undefined ) body.wlambda = 0;
		    }
		    
		    
		    for( i = constraintsLen; i--; ){
			c = constraints[i];
			
			c.calculateConstants( dt );
			
			lambdas[i] = 0;
			Bs[i] = c.calculateB( dt );
			invCs[i] = 1 / c.calculateC();
		    }
		    
		    
		    for( iter = 0; iter < iterations; iter++ ){
			
			deltalambdaTotal = 0;
			
			for( i = constraintsLen; i--; ){
			    c = constraints[i];
			    
			    B = Bs[i];
			    invC = invCs[i];
			    lambda = lambdas[i];
			    GWlambda = c.calculateGWlambda();
			    deltalambda = invC * ( B - GWlambda - c.eps * lambda );
			    
			    if( lambda + deltalambda < c.minForce ){
				deltalambda = c.minForce - lambda;
			    }
			    else if( lambda + deltalambda > c.maxForce ){
				deltalambda = c.maxForce - lambda;
			    }
			    
			    lambdas[i] += deltalambda;
			    deltalambdaTotal += abs( deltalambda );
			    
			    c.addToWlambda( deltalambda );
			}
			
			if( deltalambdaTotal * deltalambdaTotal < toleranceSq ) break;
		    }
		    
		    
		    for( i = bodiesLen; i--; ){
			body = bodies[i];
			velocity = body.velocity;
			vlambda = body.vlambda;
			
			velocity.x += vlambda.x;
			velocity.y += vlambda.y;
			
			if( body.wlambda !== undefined ) body.angularVelocity += body.wlambda;
		    }
		}
		
		return iter;
	    };
	}();
	
	
	PSolver2D.prototype.add = function( constraint ){
	    
	    this.constraints.push( constraint );
	};
	
	
	PSolver2D.prototype.remove = function( constraint ){
	    var constraints = this.constraints,
		idx = constraints.indexOf( constraint );
	    
	    if( idx !== -1 ){
		constraints.splice( idx, constraint );
	    }
	};
	
	
	PSolver2D.prototype.clear = function(){
	    
	    this.constraints.length = 0;
	};
	
        
        return PSolver2D;
    }
);