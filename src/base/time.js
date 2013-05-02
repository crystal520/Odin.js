if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
        
	function Time(){
	    
	    this.sinceStart = 0;
	    
	    this.time = 0;
	    
	    this.delta = 1/60;
	    
	    this.scale = 1;
	    
	    this.frame = 0;
	}
	    
	
	Time.prototype.start = function(){
	    
	};
	
	
	Time.prototype.end = function(){
	    
	};
	
	
	Time.prototype.now = function(){
	    var startTime = Date.now(),
		performance = window.performance || {};
		
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