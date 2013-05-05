if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
        
	function Time(){
	    
	    this.sinceStart = 0;
	    
	    this.time = 0;
	    
	    this.ms = 1/60;
	    this.delta = 1/60;
	    
	    this.scale = 1;
	}
	
	var last = 0;
	
	
	Time.prototype.start = function(){
	    this.time = this.now();
	    
	    this.ms = 1000 * ( this.time - last );
	    this.delta = ( this.time - last ) * this.scale;
	};
	
	
	Time.prototype.end = function(){
	    last = this.time;
	};
	
	
	Time.prototype.now = function(){
	    var startTime = Date.now(),
		performance = performance || {};
		
	    performance.now = function(){
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
		
		return performance.now() * 0.001;
	    }
	}();
	
	
	return new Time;
    }
);