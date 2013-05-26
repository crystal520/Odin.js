if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
        
	function Time(){
	    
	    this.sinceStart = 0;
	    
	    this.time = 0;
	    
	    this.fps = 60;
	    
	    this.delta = 1/60;
	    
	    this.scale = 1;
	}
	
	var last = 0;
	
	Time.prototype.start = function(){
	    var frames = 0, time = 0, ms = 0, msLast = 0;
	    
	    return function(){
		
		this.time = time = this.now();
		this.delta = ( time - last ) * this.scale;
		
		frames++;
		ms = time * 1000;
		
		if( msLast + 1000 < ms ){
		    this.fps = ( frames * 1000 ) / ( ms - msLast );
		    msLast = ms;
		    frames = 0;
		}
	    };
	}();
	
	
	Time.prototype.end = function(){
	    
	    last = this.time;
	};
	
	
	Time.prototype.now = function(){
	    var now, startTime = Date.now(),
		performance = performance || {};
		
	    now = performance.now = function(){
		return (
		    performance.now ||
		    performance.mozNow ||
		    performance.msNow ||
		    performance.oNow ||
		    performance.webkitNow ||
		    function(){
			return Date.now() - startTime; 
		    }
		);
	    }();
	    
	    return function(){
		
		return now() * 0.001;
	    }
	}();
	
	
	return new Time;
    }
);