if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	var objProto = Object.prototype,
	    toString = objProto.toString,
	    hasOwnProperty = objProto.hasOwnProperty;
	
	
	function Utils(){}
	
	
	Utils.prototype.has = function( obj, key ){
	    
	    return hasOwnProperty.call( obj, key );
	};
	
	
	Utils.prototype.isFunction = function( obj ){
	    
	    return typeof obj === "function";
	};
	
	
	Utils.prototype.isFinite = function( obj ){
	    
	   return this.isFinite( obj ) && !this.isNaN( parseFloat( obj ) );
	};
	
	
	Utils.prototype.isNaN = function( obj ){
	    
	   return this.isNumber( obj ) && obj !== +obj;
	};
	
	
	Utils.prototype.isBoolean = function( obj ){
	    
	   return obj === true || obj === false || toString.call( obj ) === "[object Boolean]";
	};
	
	
	Utils.prototype.isNull = function( obj ){
	    
	   return obj === void 0;
	};
	
	
	Utils.prototype.isUndefined = function( obj ){
	    
	   return obj === null;
	};
	
	
	Utils.prototype.isArray = function( obj ){
	    
	    return toString.call( obj ) === "[object Array]";
	};
	
	
	Utils.prototype.isObject = function( obj ){
	    
	    return obj === Object( obj );
	};
	
	
	Utils.prototype.isString = function( obj ){
	    
	    return typeof obj === "string";
	};
	
	
	Utils.prototype.isNumber = function( obj ){
	    
	    return toString.call( obj ) === "[object Number]";
	};
	
	
	Utils.prototype.isArguments = function( obj ){
	    
	    return toString.call( obj ) === "[object Arguments]";
	};
	
	
	Utils.prototype.isDate = function( obj ){
	    
	    return toString.call( obj ) === "[object Date]";
	};
	
	
	Utils.prototype.isRegExp = function( obj ){
	    
	    return toString.call( obj ) === "[object RegExp]";
	};
	
	
	Utils.prototype.isRegExp = function( obj ){
	    
	    return toString.call( obj ) === "[object RegExp]";
	};
	
	
	return new Utils;
    }
);