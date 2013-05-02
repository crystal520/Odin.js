if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
        
        
        function Key( name, keyCode ){
            
	    Class.call( this );
	    
            this.name = name;
            this.keyCode = keyCode;
            this.down = false;
            
            this._first = true;
	    
            this._downFrame = -1;
            this._upFrame = -1;
	    
            this.downTime = -1;
            this.endTime = -1;
        };
        
        Key.prototype = Object.create( Class.prototype );
	Key.prototype.constructor = Key;
	
        
        return Key;
    }
);