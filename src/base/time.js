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
	
	Time.prototype.update = function(){
	    var frames = 0, time = 0, last = 0, delta = 0, ms = 0, msLast = 0;
	    
	    return function(){
		this.time = time = this.now();
		
		delta = ( time - last ) * this.scale;
		this.delta = delta < 0.001 ? 0.001 : delta > 0.05 ? 0.05 : delta;
		
		last = time;
		
		frames++;
		ms = time * 1000;
		
		if( msLast + 1000 < ms ){
		    this.fps = ( frames * 1000 ) / ( ms - msLast );
		    msLast = ms;
		    frames = 0;
		}
	    };
	}();
	
	
	Time.prototype.now = function(){
	    var startTime = Date.now(),
		w = window || {},
		performance = w.performance || function(){
		    this.now = function(){
			return Date.now() - startTime;
		    }
		};
	    
	    return function(){
		
		return performance.now() * 0.001;
	    }
	}();
	
	
	return new Time;
    }
);