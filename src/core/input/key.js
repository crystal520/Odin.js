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
        
	Class.extend( Key, Class );
	
	
	Key.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.name = this.name;
	    json.keyCode = this.keyCode;
	    json.down = this.down;
	    
	    json.downTime = this.downTime;
	    json.endTime = this.endTime;
	    
	    return json;
	};
	
        
        return Key;
    }
);