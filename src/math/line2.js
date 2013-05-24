if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/vec2"
    ],
    function( Vec2 ){
        "use strict";
        
	var sqrt = Math.sqrt,
	    vEquals = Vec2.equals;
	
        
        function Line2( start, end ){
            
            this.start = start instanceof Vec2 ? start : new Vec2;
            this.end = end instanceof Vec2 ? end : new Vec2;
	}
        
        
        Line2.prototype.clone = function(){
            
            return new Line2(
		this.start.clone(),
		this.end.clone()
	    );
	};
        
        
        Line2.prototype.copy = function( other ){
	    
            this.start.copy( other.start );
            this.end.copy( other.end );
            
            return this;
	};
        
        
        Line2.prototype.ldotv = function( l, v ){
	    var start = l.start, end = l.end,
		x = end.x - start.x,
		y = end.y - start.y;
	    
	    return x * v.x + y * v.y;
	};
        
        
        Line2.prototype.dotv = function( v ){
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
        
        
        Line2.prototype.toString = function(){
            var start = this.start, end = this.end;
	    
            return "Line2( start: "+ start.x +", "+ start.y +", end: "+ end.x +", "+ end.y +" )";
	};
        
        
        Line2.prototype.equals = function( other ){
            
            return !(
                !vEquals( this.start, other.start ) ||
                !vEquals( this.end, other.end )
            );
	};
        
        
        Line2.equals = function( a, b ){
            
            return !(
                !vEquals( a.start, b.start ) ||
                !vEquals( a.end, b.end )
            );
	};
        
        return Line2;
    }
);