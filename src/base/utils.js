if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	var objProto = Object.prototype,
	    toString = objProto.toString,
	    defineProperty = Object.defineProperty,
	    hasOwnProperty = objProto.hasOwnProperty;
	
	
	function Utils(){}
	
	
	Utils.prototype.defineProps = function( obj, props ){
	    var key;
	    
	    for( key in props ){
		defineProperty( obj, key, props[ key ] );
	    }
	};
	
	
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
	
	
	Utils.prototype.isArrayLike = function( obj ){
	    
	    return typeof obj === "object" && typeof obj.length === "number";
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
	
	
	Utils.prototype.isFloat32Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Float32Array]";
	};
	
	
	Utils.prototype.isFloat64Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Float64Array]";
	};
	
	
	Utils.prototype.isInt32Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Int32Array]";
	};
	
	
	Utils.prototype.isInt16Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Int16Array]";
	};
	
	
	Utils.prototype.isInt8Array = function( obj ){
	    
	    return toString.call( obj ) === "[object Int8Array]";
	};
	
	
	return new Utils;
    }
);