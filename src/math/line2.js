if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec2"
    ],
    function( Mathf, Vec2 ){
        "use strict";
        
	var sqrt = Math.sqrt,
	    clamp01 = Mathf.clamp01,
	    equals = Mathf.equals;
	
        
        function Line2( start, end ){
            this.start = start instanceof Vec2 ? start : new Vec2;
            this.end = end instanceof Vec2 ? end : new Vec2;
	}
        
        
        Line2.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Line2.prototype.clone = function(){
            
            return new Line2(
		this.start.clone(),
		this.end.clone()
	    );
	};
        
        
        Line2.prototype.copy = function( other ){
	    var ts = this.start, te = this.end,
		os = other.start, os = other.end;
	    
            ts.x = os.x;
            ts.y = os.y;
	    
            te.x = oe.x;
            te.y = oe.y;
            
            return this;
	};
        
        
        Line2.prototype.set = function( start, end ){
	    var ts = this.start, te = this.end;
	    
            ts.x = start.x;
            ts.y = start.y;
	    
            te.x = end.x;
            te.y = end.y;
            
            return this;
	};
        
        
        Line2.prototype.add = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x, y = other.y;
	    
            ts.x += x;
            ts.y += y;
	    
            te.x += x;
            te.y += y;
            
            return this;
	};
        
        
        Line2.prototype.sadd = function( s ){
	    var ts = this.start, te = this.end;
	    
            ts.x += s;
            ts.y += s;
	    
            te.x += s;
            te.y += s;
            
            return this;
	};
        
        
        Line2.prototype.sub = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x, y = other.y;
	    
            ts.x -= x;
            ts.y -= y;
	    
            te.x -= x;
            te.y -= y;
            
            return this;
	};
        
        
        Line2.prototype.ssub = function( s ){
	    var ts = this.start, te = this.end;
	    
            ts.x -= s;
            ts.y -= s;
	    
            te.x -= s;
            te.y -= s;
            
            return this;
	};
        
        
        Line2.prototype.mul = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x, y = other.y;
	    
            ts.x *= x;
            ts.y *= y;
	    
            te.x *= x;
            te.y *= y;
            
            return this;
	};
        
        
        Line2.prototype.smul = function( s ){
	    var ts = this.start, te = this.end;
	    
            ts.x *= s;
            ts.y *= s;
	    
            te.x *= s;
            te.y *= s;
            
            return this;
	};
        
        
        Line2.prototype.div = function( other ){
	    var ts = this.start, te = this.end,
		x = other.x !== 0 ? 1 / other.x : 0,
		y = other.y !== 0 ? 1 / other.y : 0;
	    
            ts.x *= x;
            ts.y *= y;
	    
            te.x *= x;
            te.y *= y;
            
            return this;
	};
        
        
        Line2.prototype.sdiv = function( s ){
	    var ts = this.start, te = this.end;
	    
	    s = s !== 0 ? 1 / s : 0;
	    
            ts.x *= s;
            ts.y *= s;
	    
            te.x *= s;
            te.y *= s;
            
            return this;
	};
        
        
        Line2.prototype.ldotv = function( l, v ){
	    var start = l.start, end = l.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * v.x + y * v.y;
	};
        
        
        Line2.prototype.dot = function( v ){
	    var start = this.start, end = this.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * v.x + y * v.y;
	};
        
        
        Line2.prototype.lenSq = function(){
	    var start = this.start, end = this.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * x + y * y;
	};
        
        
        Line2.prototype.len = function(){
	    var start = this.start, end = this.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return sqrt( x * x + y * y );
	};
        
        
        Line2.prototype.center = function( target ){
	    target = target || new Vec2;
	    
	    var start = this.start, end = this.end;
	    
	    target.x = ( start.x + end.x ) * 0.5;
	    target.y = ( start.y + end.y ) * 0.5;
	    
	    return target;
	};
        
        
        Line2.prototype.delta = function( target ){
	    target = target || new Vec2;
	    
	    var start = this.start, end = this.end;
	    
	    target.x = end.x - start.x;
	    target.y = end.y - start.y;
	    
	    return target;
	};
        
        
        Line2.prototype.norm = function(){
	    var start = this.start, end = this.end,
		sx = start.x, sy = start.y,
		sl = sx * sx + sy * sy,
		
		ex = end.x, ey = end.y,
		el = ex * ex + ey * ey;
	    
	    sl = sl !== 0 ? 1 / sqrt( sl ) : 0;
	    start.x *= sl;
	    start.y *= sl;
	    
	    el = el !== 0 ? 1 / sqrt( el ) : 0;
	    end.x *= el;
	    end.y *= el;
	    
	    return this;
	};
        
        
        Line2.prototype.closestPoint = function( point, target ){
	    target = target || new Vec2;
	    
	    var a = this.start, b = this.end,
		ax = a.x, ay = a.y,
		bx = b.x, by = b.y,
		
		ex = bx - ax,
		ey = by - ay,
		
		dx = point.x - ax,
		dy = point.y - ay,
		
		t = clamp01( ( ex * dx + ey * dy ) / ( ex * ex + ey * ey ) );
	    
	    target.x = ex * t + ax;
	    target.y = ey * t + ay;
	    
	    return target;
	};
        
        
        Line2.prototype.intersect = function( other, target ){
	    target = target || new Vec2;
	    
	    var as = this.start, ae = this.end,
		asx = as.x, asy = as.y, aex = ae.x, aey = ae.y,
		
		bs = other.start, be = other.end,
		bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y,
		
		d = ( asx - aex ) * ( bsy - bey ) - ( asy - aey ) * ( bsx - bex ),
		pre, post;
	    
	    if( d === 0 ) return target;
	    
	    pre = ( asx * aey - asy * aex );
	    post = ( bsx * bey - bsy * bex );
	    
	    target.x = ( pre * ( bsx - bey ) - ( asx - aex ) * post ) / d;
	    target.y = ( pre * ( bsy - bey ) - ( asy - aey ) * post ) / d;
	    
	    return target;
	};
        
        
        Line2.prototype.toString = function(){
            var start = this.start, end = this.end;
	    
            return "Line2( start: "+ start.x +", "+ start.y +", end: "+ end.x +", "+ end.y +" )";
	};
        
        
        Line2.prototype.equals = function( other ){
            var astart = this.start, aend = this.end,
		bstart = other.start, bend = other.end;
	    
            return !(
                !equals( astart.x, bstart.x ) ||
                !equals( astart.y, bstart.y ) ||
                !equals( aend.x, bend.x ) ||
                !equals( aend.y, bend.y )
            );
	};
        
        
        Line2.equals = function( a, b ){
            var astart = a.start, aend = a.end,
		bstart = b.start, bend = b.end;
	    
            return !(
                !equals( astart.x, bstart.x ) ||
                !equals( astart.y, bstart.y ) ||
                !equals( aend.x, bend.x ) ||
                !equals( aend.y, bend.y )
            );
	};
        
        
        Line2.intersect = function( a, b, target ){
	    target = target || new Vec2;
	    
	    var as = a.start, ae = a.end,
		asx = as.x, asy = as.y, aex = ae.x, aey = ae.y,
		
		bs = b.start, be = b.end,
		bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y,
		
		d = ( asx - aex ) * ( bsy - bey ) - ( asy - aey ) * ( bsx - bex ),
		pre, post;
	    
	    if( d === 0 ) return target;
	    
	    pre = ( asx * aey - asy * aex );
	    post = ( bsx * bey - bsy * bex );
	    
	    target.x = ( pre * ( bsx - bey ) - ( asx - aex ) * post ) / d;
	    target.y = ( pre * ( bsy - bey ) - ( asy - aey ) * post ) / d;
	    
	    return target;
	};
        
        return Line2;
    }
);