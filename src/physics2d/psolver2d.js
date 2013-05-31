if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2"
    ],
    function( Class, Mathf, Vec2 ){
        "use strict";
	
	var clamp = Mathf.clamp;
	
        
	function PSolver2D(){
	    
	    Class.call( this );
	    
	    this.constraints = [];
	    
	    this.iterations = 25;
	    this.tolerance = 1e-6;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function(){
	    var lambdas = [], invCs = [], Bs = [];
	    
	    return function( world, h ){
		var iterations = this.iterations,
		
		    tolerance = this.tolerance,
		    toleranceSq = tolerance * tolerance,
		    
		    constraints = this.constraints,
		    constraintsLen = constraints.length,
		    
		    bodies = world.bodies,
		    bodiesLen = bodies.length,
		    
		    B, invC, deltaLambda, deltaLambdaTotal, relativeLambda, lambda,
		    
		    body, force, c, i, iter;
		    
		if( constraintsLen ){
		    
		    for( i = 0; i < bodiesLen; i++ ){
			body = bodies[i];
			
			body.vlambda.x = 0;
			body.vlambda.y = 0;
			
			if( body.wlambda !== undefined ) body.wlambda = 0;
		    }
		    
		    
		    for( i = 0; i < constraintsLen; i++ ){
			c = constraints[i];
			
			c.updateSpook( h );
			
			lambdas[i] = 0
			Bs[i] = c.calculateB( h );
			invCs[i] = 1 / c.calculateC();
		    }
		    
		    
		    for( iter = 0; iter < iterations; iter++ ){
			
			deltaLambdaTotal = 0;
			
			for( i = 0; i < constraintsLen; i++ ){
			    c = constraints[i];
			    
			    B = Bs[i];
			    invC = invCs[i];
			    lambda = lambdas[i];
			    relativeLambda = c.calculateRelativeLambda();
			    
			    deltaLambda = invC * ( B - relativeLambda - c.eps * lambda );
			    
			    deltaLambdaTotal += deltaLambda;
			    
			    deltaLambda = clamp( deltaLambda, c.min, c.max );
			    c.addToLambda( deltaLambda );
			    lambda[i] += deltaLambda;
			}
			
			if( deltaLambdaTotal * deltaLambdaTotal < toleranceSq ) break;
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