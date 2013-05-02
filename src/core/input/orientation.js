if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
        
        
        function Orientation( max ){
            
            Class.call( this );
            
            this.alpha = 0;
	    this.beta = 0;
	    this.gamma = 0;
	    
	    this.mode = "portrait_up";
        };
        
        Orientation.prototype = Object.create( Class.prototype );
	Orientation.prototype.constructor = Orientation;
        
        
        Orientation.prototype.handleEvents = function( e ){
	    
            switch( e.type ){
                case "deviceorientation":
                    this.handle_deviceorientation( e );
                    break;
		
                case "orientationchange":
                    this.handle_orientationchange( e );
                    break;
            }
        };
        
        
        Orientation.prototype.handle_deviceorientation = function( e ){
            
            if( e.alpha !== undefined && e.beta !== undefined && e.gamma !== undefined ){
		
		this.alpha = e.alpha;
		this.beta = e.beta;
		this.gamma = e.gamma;
		
		this.trigger("orientation", this );
	    }
        };
        
        
        Orientation.prototype.handle_orientationchange = function( e ){
	    orientation = window.orientation;
	    
	    switch( orientation ){
		case 0:
		    this.mode = "portrait_up";
		    break;
		    
		case 90:
		    this.mode = "landscape_left";
		    break;
		    
		case -90:
		    this.mode = "landscape_right";
		    break;
		    
		case 180:
		case -180:
		    this.mode = "portrait_down";
		    break;
	    }
	    
	    this.trigger( "orientationChange", this.mode, orientation );
        };
        
        
        return new Orientation;
    }
);