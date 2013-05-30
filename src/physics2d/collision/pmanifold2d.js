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
	    var manifold;
	    
	    if( manifoldPool.length ){
		manifold = manifoldPool.pop();
	    }
	    else{
		manifold = new Manifold;
	    }
	    
	    manifold.normal = this.normal;
	    manifold.point.copy( point );
	    
	    this.push( manifold );
	};
	
	
	PManifold2D.prototype.remove = function( manifold ){
	    var idx = this.indexOf( manifold );
	    
	    if( idx !== -1 ){
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
	    var manifold, i = this.length;
	    
	    while( i-- ){
		manifold = this[i];
		manifold.depth = normal.dot( manifold.point ) - offset;
		
		if( manifold.depth < 0 ) this.remove( manifold );
	    }
	};
	
        
        return PManifold2D;
    }
);