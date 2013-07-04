if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	function ObjectPool( constuctor ){
	    this._pool = [];
	    this.objects = [];
	    this.object = constuctor;
	}
	
	
	ObjectPool.prototype.set = function( constuctor ){
	    this.object = constuctor;
	};
	
	
	ObjectPool.prototype.create = function(){
	    var pool = this._pool,
		object = pool.length ? pool.pop() : new this.object;
	    
	    this.objects.push( object );
	    
	    return object;
	};
	
	
	ObjectPool.prototype.release = function(){
	    var objects = this.objects, object, index, i;
	    
	    for( i = arguments.length; i--; ){
		object = arguments[i];
		index = objects.indexOf( object );
		
		if( index !== -1 ){
		    this._pool.push( object );
		    objects.splice( index, 1 );
		}
	    }
	};
	
	
	ObjectPool.prototype.clear = function(){
	    var objects = this.objects, i;
	    
	    for( i = objects.length; i--; ){
		this._pool.push( objects[i] );
	    }
	    
	    objects.length = 0;
	};
	
	
	return ObjectPool;
    }
);