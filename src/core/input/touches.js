if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"core/input/touch"
    ],
    function( Class, Time, Vec2, Touch ){
	"use strict";
        
        var startNeedsUpdate = true,
            moveNeedsUpdate = true,
            endNeedsUpdate = true,
            
            x, y, last = new Vec2,
            
            touches, touch, count, i, j,
            evtTouches, evtTouch;
        
        
        function Touches(){
            
            Class.call( this );
            
            this.array = [];
            
            for( var i = 0; i < 11; i++ ){
                this.array.push( new Touch );
            }
        };
        
	Class.extend( Touches, Class );
        
        
        Touches.prototype.clear = function(){
            var array =  this.array,
                i, il;
	    
           for( i = 0, il = array.length; i < il; i++ ){
                array[i].clear();
            }
        };
        
        
        Touches.prototype.getTouches = function(){
	    var defaultArray = [];
	    
	    return function( array ){
		array = array instanceof Array ? array : defaultArray;
		array.length = 0;
		
		var thisArray = this.array, touch,
		    i, il;
		
		for( i = 0, il = thisArray.length; i < il; i++ ){
		    touch = thisArray[i];
		    
		    if( touch.identifier !== -1 ){
			array.push( touch );
		    }
		}
		
		return array;
	    };
	}();
        
        
        Touches.prototype.forEach = function( callback ){
	    var thisArray = this.array, touch,
		i, il;
	    
	    for( i = 0, il = thisArray.length; i < il; i++ ){
		touch = thisArray[i];
		
		if( touch.identifier !== -1 ){
		    callback( touch );
		}
	    }
	};
        
        
        Touches.prototype.count = function(){
	    var thisArray = this.array, touch,
		i, il, count = 0;
	    
	    for( i = 0, il = thisArray.length; i < il; i++ ){
		touch = thisArray[i];
		
		if( touch.identifier !== -1 ){
		    count++;
		}
	    }
	    
	    return count;
	};
	
        
        Touches.prototype.update = function(){
            
            startNeedsUpdate = true;
            moveNeedsUpdate = true;
            endNeedsUpdate = true;
        };
        
        
        Touches.prototype.handleEvents = function( e ){
            e.preventDefault();
            
            switch( e.type ){
                case "touchstart":
                    this.handle_touchstart( e );
                    break;
                
                case "touchmove":
                    this.handle_touchmove( e );
                    break;
                
                case "touchend":
                    this.handle_touchend( e );
                    break;
                
                case "touchcancel":
                    this.handle_touchcancel( e );
                    break;
            }
        };
        
        
        Touches.prototype.handle_touchstart = function( e ){
            
            if( startNeedsUpdate ){
                
                touches = this.array;
                evtTouches = e.touches;
                count = evtTouches.length;
		
		if( count <= touches.length ){
		    for( i = 0; i < count; i++ ){
			evtTouch = evtTouches[i];
			touch = touches[i];
                        
                        touch.identifier = evtTouch.identifier;
                        
			touch.startTime = Time.time;
			
                        touch.getPosition( evtTouch );
			
			if( touch._first ){
			    touch._downFrame = Time.frame;
			    touch._first = false;
			}
                        
                        touch.start.copy( touch.position );
                        
                        this.trigger("start", touch );
                    }
                }
                else{
                    this.clear();
                }
                
                startNeedsUpdate = false;
            }
        };
        
        
        Touches.prototype.handle_touchmove = function( e ){
            
            if( moveNeedsUpdate ){
                
                touches = this.array;
                evtTouches = e.changedTouches;
                count = evtTouches.length;
		
		for( i = 0; i < count; i++ ){
		    evtTouch = evtTouches[i];
		    
		    for( j = 0; j < touches.length; j++ ){
			touch = touches[j];
                        
			if( touch.identifier === evtTouch.identifier ){
                        
                            last.copy( touch.position );
                            
                            touch.getPosition( evtTouch );
                            
                            touch.delta.vsub( touch.position, last );
                            
                            this.trigger("move", touch );
                        }
                    }
                }
                
                moveNeedsUpdate = false;
            }
        };
        
        
        Touches.prototype.handle_touchend = function( e ){
            
            if( endNeedsUpdate ){
                
                touches = this.array;
                evtTouches = e.changedTouches;
                count = evtTouches.length;
		
		for( i = 0; i < count; i++ ){
		    evtTouch = evtTouches[i];
		    
		    for( j = 0; j < touches.length; j++ ){
			touch = touches[j];
			
			if( touch.identifier === evtTouch.identifier ){ 
                            
                            last.copy( touch.position );
                            
                            touch.getPosition( evtTouch );
			    
			    if( !touch._first ){
				touch._upFrame = Time.frame;
				touch._first = true;
			    }
                            
			    touch.endTime = Time.time;
			    touch.deltaTime = touch.endTime - touch.startTime;
			    
                            touch.end.copy( touch.position );
                            
			    touch.identifier = -1;
                            
                            this.trigger("end", touch );
                        }
                    }
                }
                
                endNeedsUpdate = false;
            }
        };
        
        
        Touches.prototype.handle_touchcancel = function( e ){
            
	    this.clear();
        };
	
	
	Touches.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.array = this.array;
	    
	    return json;
	};
        
        
        return new Touches;
    }
);