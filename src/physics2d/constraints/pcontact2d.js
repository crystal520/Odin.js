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
	
	
	PConstraint2D.prototype.calculateB = function( h ){
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
		
		risq = rix * rix + riy * riy,
		rni = rix * nx + riy * ny,
		
		rjsq = rjx * rjx + rjy * rjy,
		rnj = rjx * nx + rjy * ny,
		
		Gq = px * nx + py * ny,
		GW = e * vj.dot( n ) - e * vi.dot( n ) + wj * rnj - wi * rni,
		GiMf = fj.dot( n ) * invMassj - fi.dot( n ) * invMassi + ( tj * invInertiaj * ( rjsq - rnj * rnj ) ) - ( ti * invInertiai * ( risq - rni * rni ) ),
		
		B = -a * Gq - b * GW - h * GiMf;
	    
	    return B;
	};
	
	
	PConstraint2D.prototype.calculateC = function(){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		ri = this.ri,
		rix = ri.x, riy = ri.y,
		
		bj = this.bj,
		rj = this.rj,
		rjx = rj.x, rjy = rj.y,
		
		risq = rix * rix + riy * riy,
		rni = rix * nx + riy * ny,
		
		rjsq = rjx * rjx + rjy * rjy,
		rnj = rjx * nx + rjy * ny,
		
		C = bi.invMass + bj.invMass + this.eps;
		
	    C += bi.invInertia * ( risq - rni * rni );
	    C += bj.invInertia * ( rjsq - rnj * rnj );
	    
	    return C;
	};
	
	
	PConstraint2D.prototype.calculateRelativeLambda = function(){
	    var n = this.n,
		nx = n.x, ny = n.y,
		ri = this.ri,
		rj = this.rj,
		
		bi = this.bi,
		bj = this.bj,
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		
		lambdax = vlambdaj.x - vlambdai.x,
		lambday = vlambdaj.y - vlambdai.y,
		
		relativeLambda = lambdax * nx + lambday * ny;
	    
	    if( bi.wlambda !== undefined ){
		relativeLambda -= bi.wlambda * ( ri.x * nx + ri.y * ny );
	    }
	    if( bj.wlambda !== undefined ){
		relativeLambda += bj.wlambda * ( rj.x * nx + rj.y * ny );
	    }
	    
	    return relativeLambda;
	};
	
	
	PConstraint2D.prototype.addToLambda = function( delta ){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		ri = this.ri,
		rix = ri.x, riy = ri.y,
		
		rj = this.rj,
		rjx = rj.x, rjy = rj.y,
		
		bi = this.bi,
		bj = this.bj,
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		invMassi = bi.invMass,
		invMassj = bj.invMass,
		
		risq = rix * rix + riy * riy,
		rni = rix * nx + riy * ny,
		
		rjsq = rjx * rjx + rjy * rjy,
		rnj = rjx * nx + rjy * ny;
		
	    vlambdai.x -= delta * invMassi * nx;
	    vlambdai.y -= delta * invMassi * ny;
	    
	    vlambdaj.x += delta * invMassj * nx;
	    vlambdaj.y += delta * invMassj * ny;
	    
	    if( bi.wlambda !== undefined ){
		bi.wlambda -= delta * bi.invInertia * ( risq - rni * rni );
	    }
	    if( bj.wlambda !== undefined ){
		bj.wlambda += delta * bj.invInertia * ( rjsq - rnj * rnj );
	    }
	};
	
        
        return PContact2D;
    }
);