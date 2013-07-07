if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/constraints/pequation2d"
	
    ],
    function( Class, Vec2, PEquation2D ){
        "use strict";
	
	var min = Math.min;
	
        
	function PContact2D( bi, bj ){
	    
	    PEquation2D.call( this, bi, bj, 0, 1e6 );
	    
	    this.n = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    
	    this.rixn = 0;
	    this.rjxn = 0;
	    
	    this.stiffness = 1e7;
	    this.relaxation = 3;
	}
	
	Class.extend( PContact2D, PEquation2D );
	
	
	PContact2D.prototype.calculateB = function( h ){
	    var a = this.a, b = this.b,
		
		n = this.n, nx = n.x, ny = n.y,
		
		ri = this.ri, rix = ri.x, riy = ri.y,
		rj = this.rj, rjx = rj.x, rjy = rj.y,
		
		bi = this.bi,
		invMassi = bi.invMass, invInertiai = bi.invInertia,
		xi = bi.position, vi = bi.velocity, fi = bi.force,
		wi = bi.angularVelocity, ti = bi.torque,
		
		bj = this.bj,
		invMassj = bj.invMass, invInertiaj = bj.invInertia,
		xj = bj.position, vj = bj.velocity, fj = bj.force,
		wj = bj.angularVelocity, tj = bj.torque,
		
		rixn = rix * ny - riy * nx,
		rjxn = rjx * ny - rjy * nx,
		
		e = 1 + min( bi.elasticity, bj.elasticity ),
		
		Gqx = xj.x + rjx - xi.x - rix,
		Gqy = xj.y + rjy - xi.y - riy,
		Gq = Gqx * nx + Gqy * ny,
		
		GWx = vj.x + ( -wj * rjy ) - vi.x - ( -wi * riy ),
		GWy = vj.y + ( wj * rjx ) - vi.y - ( wi * rix ),
		GW = e * GWx * nx + e * GWy * ny,
		
		GiMfx = fj.x * invMassj + ( -tj * rjy * invInertiaj ) - fi.x * invMassi - ( -ti * riy * invInertiai ),
		GiMfy = fj.y * invMassj + ( tj * rjx * invInertiaj ) - fi.y * invMassi - ( ti * rix * invInertiai ),
		GiMf = GiMfx * nx + GiMfy * ny;
	    
	    this.rixn = rixn;
	    this.rjxn = rjxn;
	    
	    return -a * Gq - b * GW - h * GiMf;
	};
	
	
	PContact2D.prototype.calculateC = function(){
	    var n = this.n, nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		rixn = this.rixn,
		rjxn = this.rjxn,
		
		C = bi.invMass + bj.invMass + this.eps;
	    
	    C += bi.invInertia * rixn * rixn;
	    C += bj.invInertia * rjxn * rjxn;
	    
	    return C;
	};
	
	
	PContact2D.prototype.calculateGWlambda = function(){
	    var n = this.n, nx = n.x, ny = n.y,
		
		ri = this.ri,
		rj = this.rj,
		
		bi = this.bi,
		vlambdai = bi.vlambda,
		wlambdai = bi.wlambda,
		
		bj = this.bj,
		vlambdaj = bj.vlambda,
		wlambdaj = bj.wlambda,
		
		ulambdax = vlambdaj.x - vlambdai.x,
		ulambday = vlambdaj.y - vlambdai.y,
		
		GWlambda = ulambdax * nx + ulambday * ny;
	    
	    if( wlambdai !== undefined ){
		GWlambda -= wlambdai * this.rixn;
	    }
	    if( wlambdaj !== undefined ){
		GWlambda += wlambdaj * this.rjxn;
	    }
	    
	    return GWlambda;
	};
	
	
	PContact2D.prototype.addToWlambda = function( deltalambda ){
	    var n = this.n, nx = n.x, ny = n.y,
		
		ri = this.ri,
		rj = this.rj,
		
		rixn = this.rixn,
		rjxn = this.rjxn,
		
		bi = this.bi,
		invMassi = bi.invMass,
		vlambdai = bi.vlambda,
		
		bj = this.bj,
		invMassj = bj.invMass,
		vlambdaj = bj.vlambda,
		
		lambdax = deltalambda * nx,
		lambday = deltalambda * ny;
	    
	    vlambdai.x -= lambdax * invMassi;
	    vlambdai.y -= lambday * invMassi;
	    
	    vlambdaj.x += lambdax * invMassj;
	    vlambdaj.y += lambday * invMassj;
	    
	    if( bi.wlambda !== undefined ){
		bi.wlambda -= ( ri.x * lambday - ri.y * lambdax ) * bi.invInertia * rixn * rixn;
	    }
	    if( bj.wlambda !== undefined ){
		bj.wlambda += ( rj.x * lambday - rj.y * lambdax ) * bj.invInertia * rjxn * rjxn;
	    }
	};
	
        
        return PContact2D;
    }
);