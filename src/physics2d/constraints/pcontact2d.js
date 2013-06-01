if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/constraints/pconstraint2d",
    ],
    function( Class, Vec2, PConstraint2D ){
        "use strict";
	
	var sqrt = Math.sqrt,
	    min = Math.min;
	
        
	function PContact2D( bi, bj ){
	    
	    PConstraint2D.call( this, bi, bj, 0, 1e6 );
	    
	    this.n = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	}
	
	Class.extend( PContact2D, PConstraint2D );
	
	
	PContact2D.prototype.calculateB = function( h ){
	    var a = this.a, b = this.b, eps = this.eps,
		
		n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		ri = this.ri,
		rix = ri.x, riy = ri.y,
		invMassi = bi.invMass,
		invInertiai = bi.invInertia,
		xi = bi.position, vi = bi.velocity, fi = bi.force,
		wi = bi.angularVelocity, ti = bi.torque,
		
		bj = this.bj,
		rj = this.rj,
		rjx = rj.x, rjy = rj.y,
		invMassj = bj.invMass,
		invInertiaj = bj.invInertia,
		xj = bj.position, vj = bj.velocity, fj = bj.force,
		wj = bj.angularVelocity, tj = bj.torque,
		
		e = 1 + min( bi.elasticity, bj.elasticity ),
		
		px = ( xj.x + rjx ) - ( xi.x + rix ),
		py = ( xj.y + rjy ) - ( xi.y + riy ),
		
		dvx = e * vj.x + ( -wj * rjy ) - e * vi.x - ( -wi * riy ),
		dvy = e * vj.y + ( wj * rjx ) - e * vi.y - ( wi * rix ),
		
		dfx = fj.x * invMassj + ( -tj * rjy * invInertiaj ) - fi.x * invMassi - ( -ti * riy * invInertiai ),
		dfy = fj.y * invMassj + ( tj * rjx * invInertiaj ) - fi.y * invMassi - ( ti * rix * invInertiai ),
		
		Gq = px * nx + py * ny,
		GW = dvx * nx + dvy * ny,
		GiMf = dfx * nx + dfy * ny,
		
		B = -a * Gq - b * GW - h * GiMf;
	    
	    return B;
	};
	
	
	PContact2D.prototype.calculateC = function(){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		wi = bi.angularVelocity,
		wj = bj.angularVelocity,
		
		C = bi.invMass + bj.invMass + this.eps;
		
	    C += bi.invInertia * ( ri.x * ny - ri.y * nx );
	    C += bj.invInertia * ( rj.x * ny - rj.y * nx );
	    
	    return C;
	};
	
	
	PContact2D.prototype.calculateRelativeLambda = function(){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		
		lambdax = vlambdaj.x - vlambdai.x,
		lambday = vlambdaj.y - vlambdai.y,
		
		relativeLambda = lambdax * nx + lambday * ny;
	    
	    if( bi.wlambda !== undefined ){
		relativeLambda -= bi.wlambda * ( ri.x * ny - ri.y * nx );
	    }
	    if( bj.wlambda !== undefined ){
		relativeLambda += bj.wlambda * ( rj.x * ny - rj.y * nx );
	    }
	    
	    return relativeLambda;
	};
	
	
	PContact2D.prototype.addToLambda = function( deltaLambda ){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		invMassi = bi.invMass,
		invMassj = bj.invMass;
		
	    vlambdai.x -= deltaLambda * invMassi * nx;
	    vlambdai.y -= deltaLambda * invMassi * ny;
	    
	    vlambdaj.x += deltaLambda * invMassj * nx;
	    vlambdaj.y += deltaLambda * invMassj * ny;
	    
	    if( bi.wlambda !== undefined ){
		bi.wlambda -= deltaLambda * bi.invInertia * ( ri.x * ny - ri.y * nx );
	    }
	    if( bj.wlambda !== undefined ){
		bj.wlambda += deltaLambda * bj.invInertia * ( rj.x * ny - rj.y * nx );
	    }
	};
	
        
        return PContact2D;
    }
);