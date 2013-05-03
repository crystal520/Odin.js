if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
        
        
        function Component(){
            
            Class.call( this );
            
            this.gameObject = undefined;
        }
        
        Component.prototype = Object.create( Class.prototype );
        Component.prototype.constructor = Component;
        
        
        Component.prototype.init = function(){};
        Component.prototype.update = function(){};
        
        
        return Component;
    }
);