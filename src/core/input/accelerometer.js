if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
        
        var abs = Math.abs,
	    sqrt = Math.sqrt,
	    accelerationIncludingGravity;
	
        
        function Accelerometer( max ){
            
            Class.call( this );
            
	    this.x = 0;
	    this.y = 0;
	    this.z = 0;
        };
        
        Accelerometer.prototype = Object.create( Class.prototype );
	Accelerometer.prototype.constructor = Accelerometer;
	
        
        Accelerometer.prototype.handle_devicemotion = function( e ){
	    var x, y, z, len;
	    
            aig = e.accelerationIncludingGravity;
            
            if( aig ){
                x = aig.x,
                y = aig.y,
                z = aig.z
                
		len = x * x + y * y + z * z;
		
		if( len > 0 ){
		    len = 1 / sqrt( len );
		    
		    this.x = x * len;
		    this.y = y * len;
		    this.z = z * len;
		}
		else{
		    this.x = 0;
		    this.y = 0;
		    this.z = 0;
		}
		
                this.trigger("change");
            }
        };
        
        
        return new Accelerometer;
    }
);