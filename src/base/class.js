if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	var id = 0,
	    slice = Array.prototype.slice;
	
	
	function Class(){
	    this._id = ++id;
	    this._class = this.constructor.name;
	    this._events = {};
	    this._JSON = {};
	}
	
	
	Class.prototype.on = function( name, callback, context ){
	    var events = this._events[ name ] || ( this._events[ name ] = [] );
	    
	    events.push({
		callback: callback,
		context: context,
		ctx: context || this
	    });
	    
	    return this;
        };
	
	
	Class.prototype.off = function( name ){
	    var events = this._events[ name ], key;
	    
	    if( events ) events.length = 0;
	    
	    return this;
        };
	
	
	Class.prototype.trigger = function( name ){
	    var events = this._events[ name ];
	    if( !events || !events.length ) return this;
	    
	    var event, i, il,
		args = slice.call( arguments, 1 );
	    
	    for( i = 0, il = events.length; i < il; i++ ){
		( event = events[i] ).callback.apply( event.ctx, args );
	    }
	    
	    return this;
        };
	
	
	Class.prototype.listenTo = function( obj, name, callback, ctx ){
	    if( !obj ) return this;
	    
	    obj.on( name, callback, ctx || this );
	    
	    return this;
        };
	
	
	Class.prototype.toString = function(){
	    
	    return this._class;
        };
	
	
	Class.prototype.getId = function(){
	    
	    return this._id;
        };
	
	
	Class.prototype.toJSON = function(){
	    return this._JSON;
	};
	
	
	Class.prototype.fromJSON = function( json ){
	    return this;
	};
	
	
	Class.extend = function( child, parent ){
	    var parentProto = parent.prototype,
		childProto = child.prototype = Object.create( parentProto ),
		key;
	    
	    for( key in parentProto ){
		childProto[ key ] = parentProto[ key ];
	    }
	    
	    childProto.constructor = child;
        };
	
	
	return Class;
    }
);