if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/line2"
    ],
    function( Class, Vec2, Line2 ){
        "use strict";
	
	var abs = Math.abs,
	    manifoldPool = [];
	
	
	function Manifold(){
	    this.point = new Vec2;
	    this.normal = undefined;
	    this.depth = 0;
	}
	
	
	function PManifold2D(){
	    
	    Array.call( this );
	    
	    this.normal = new Vec2;
	}
	
	Class.extend( PManifold2D, Array );
	
	
	PManifold2D.prototype.add = function( point ){
	    var manifold = manifoldPool.length ? manifoldPool.pop() : new Manifold,
		mpoint = manifold.point;
	    
	    manifold.normal = this.normal;
	    mpoint.x = point.x;
	    mpoint.y = point.y;
	    
	    this.push( manifold );
	};
	
	
	PManifold2D.prototype.remove = function( manifold ){
	    var idx = this.indexOf( manifold );
	    
	    if( idx !== -1 ){
		manifoldPool.push( manifold );
		this.splice( idx, 1 );
	    }
	};
	
	
	PManifold2D.prototype.clear = function(){
	    var i, il;
	    
	    for( i = 0, il = this.length; i < il; i++ ){
		manifoldPool.push( this[i] );
	    }
	    
	    this.length = 0;
	};
	
	
	PManifold2D.prototype.filter = function( normal, offset ){
	    var manifold, i;
	    
	    for( i = this.length; i--; ){
		manifold = this[i];
		manifold.depth = normal.dot( manifold.point ) - offset;
		
		if( manifold.depth < 0 ){
		    this.remove( manifold );
		}
	    }
	};
	
        
        return PManifold2D;
    }
);