if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/time",
	"core/input/mouse",
	"core/input/touches",
	"core/input/keyboard",
	"core/input/accelerometer",
	"core/input/orientation",
    ],
    function( Class, Dom, Time, Mouse, Touches, Keyboard, Accelerometer, Orientation ){
	"use strict";
	
	var addEvent = Dom.addEvent,
	    removeEvent = Dom.removeEvent;
	
	
	function Input(){
	    
	    Class.call( this );
            
            this.element = undefined;
	}
        
	Class.extend( Input, Class );
        
        
        Input.prototype.init = function( element ){
            
            this.element = element;
	    
            addEvent( element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel touchstart touchmove touchend touchcancel", this.handleEvents, this );
            
            addEvent( element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel", Mouse.handleEvents, Mouse );
            addEvent( element, "touchstart touchmove touchend touchcancel", Touches.handleEvents, Touches );
            addEvent( top, "keydown keyup", Keyboard.handleEvents, Keyboard );
            addEvent( window, "devicemotion", Accelerometer.handle_devicemotion, Accelerometer );
            addEvent( window, "deviceorientation orientationchange", Orientation.handleEvents, Orientation );
        }
        
        
        Input.prototype.clear = function(){
	    var element = this.element;
	    
	    if( element ){
		removeEvent( element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel touchstart touchmove touchend touchcancel", this.handleEvents, this );
		
		removeEvent( element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel", Mouse.handleEvents, Mouse );
		removeEvent( element, "touchstart touchmove touchend touchcancel", Touches.handleEvents, Touches );
		removeEvent( top, "keydown keyup", Keyboard.handleEvents, Keyboard );
		removeEvent( window, "devicemotion", Accelerometer.handle_devicemotion, Accelerometer );
		removeEvent( window, "deviceorientation orientationchange", Orientation.handleEvents, Orientation );
	    }
	    
            this.element = undefined;
        }
        
        
        Input.prototype.update = function(){
            Mouse.update();
            Touches.update();
        };
        
        
        Input.prototype.key = function(){
            var keys = Keyboard.keys,
                key, i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                key = keys[ arguments[i] ];
                
                if( key && key.down ){
                    return true;
                }
            }
            
            return false;
        };
        
        
        Input.prototype.keyDown = function(){
            var keys = Keyboard.keys,
                key, i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                key = keys[ arguments[i] ];
                
                if( key && key.down && key._downFrame === ( Time.frame - 1 ) ){
                    return true;
                }
            }
            
            return false;
        };
        
        
        Input.prototype.keyUp = function(){
            var keys = Keyboard.keys,
                key, i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                key = keys[ arguments[i] ];
                
                if( key && !key.down && key._upFrame === ( Time.frame - 1 ) ){
                    return true;
                }
            }
            
            return false;
        };
        
        
        Input.prototype.mouseButton = function( index ){
            
            if( Mouse.left && index == 0 ){
                return true;
            }
            else if( Mouse.middle && index == 1 ){
                return true;
            }
            else if( Mouse.right && index == 2 ){
                return true;
            }
            
            return false;
        };
        
        
        Input.prototype.mouseButtonDown = function( index ){
            
            return this.mouseButton( index ) && Mouse._downFrame === ( Time.frame - 1 );
        };
        
        
        Input.prototype.mouseButtonUp = function( index ){
            
            return !this.mouseButton( index ) && Mouse._upFrame === ( Time.frame - 1 );
        };
        
        
        Input.prototype.getTouch = function( index ){
            var touch = Touches.array[ index ];
            
            return touch && touch.identifier !== -1 ? touch : undefined;
        };
        
        
        var gesture = "", lastGesture = "", lastGestureTime = 0;
        
        Input.prototype.handleEvents = function( e ){
            e.preventDefault();
            var timeStamp = ( e.timeStamp - Time.startTime ) / 1000,
                type = e.type;
            
            this._hold( type );
            this._tap( type, timeStamp );
            this._swipe( type );
            this._drag( type );
        };
        
        
        var holdTimer, holdTimeout = 500, holdThreshold = 1;
        
        Input.prototype._hold = function( type ){
	    var scope = this;
	    
	    if( type === "touchstart" || type === "mousedown" ){
		var event = Touches.array[0].identifier !== -1 ? Touches.array[0] : Mouse;
		
		gesture = "hold";
		
		holdTimer = setTimeout(function(){
		    if( gesture === "hold"){
			lastGesture = "hold";
			lastGestureTime = Time.time;
			scope.trigger("hold", event );
		    }
		}, holdTimeout );
	    }
	    
	    if( type === "touchmove" || type === "mousemove" ){
		var delta = Touches.array[0].identifier !== -1 ? Touches.array[0].delta : Mouse.delta;
		
		if( delta.lenSq() > holdThreshold ){
		    clearTimeout( holdTimer );
		}
	    }
	    
	    if( type === "touchend" || type === "mouseup" ){
		
		clearTimeout( holdTimer );
	    }
	};
        
        
        var tapMaxTime = 0.25, tapMaxDist = 100,
            doubleTapDistance = 400, doubleTapInterval = 0.3;
        
        Input.prototype._tap = function( type, timeStamp ){
            
            if( type === "touchend" || type === "mouseup" ){
                var event = Touches.array[0].identifier !== -1 ? Touches.array[0] : Mouse;
                
                if( event.deltaTime > tapMaxTime ||
                    event.delta.lenSq() > tapMaxDist
                ){
                    return;
                }
                
                if( lastGesture === "tap" &&
                    ( timeStamp - lastGestureTime ) < doubleTapInterval &&
                    event.delta.lenSq() < doubleTapDistance
                ){
                    gesture = "doubletap";
                    lastGesture = "doubletap";
                    lastGestureTime = Time.time;
                    this.trigger("doubletap", event );
                }
                else{
                    gesture = "tap";
                    lastGesture = "tap";
                    lastGestureTime = Time.time;
                    this.trigger("tap", event );
                }
            }
        };
        
        
        var swipeVelocity = 0.25;
        
        Input.prototype._swipe = function( type ){
            
            if( type === "touchend" || type === "mouseup" ){
                var event = Touches.array[0].identifier !== -1 ? Touches.array[0] : Mouse,
                    delta = event.delta;
                
                if( Math.abs( delta.x * Time.delta ) > swipeVelocity ||
                    Math.abs( delta.y * Time.delta ) > swipeVelocity
                ){
                    gesture = "swipe";
                    lastGesture = "swipe";
                    lastGestureTime = Time.time;
                    this.trigger("swipe", event, Mathf.direction( delta.x, delta.y ) );
                }
            }
        };
        
        
        var dragMinDistance = 10, dragTriggered = false;
        
        Input.prototype._drag = function( type ){
            var event = Touches.array[0].identifier !== -1 ? Touches.array[0] : Mouse;
            
            if( gesture !== "drag" && dragTriggered ){
                this.trigger("dragend", event );
                dragTriggered = false;
                return;
            }
            
            if( type === "touchstart" || type === "mousedown" ){
                
                dragTriggered = false;
            }
            
            if( type === "touchmove" || ( type === "mousemove" && ( Mouse.left || Mouse.middle || Mouse.right ) ) ){
                
                if( event.delta.lenSq() < dragMinDistance &&
                    gesture !== "drag"
                ){
                    return;
                }
                
                gesture = "drag";
                
                if( !dragTriggered ){
                    
                    this.trigger("dragstart", event );
                    dragTriggered = true;
                }
                
                this.trigger("drag", event );
            }
            
            if( type === "touchend" || type === "mouseup" ){
                
                if( dragTriggered ){
                    
                    this.trigger("dragend", event );
                    dragTriggered = false;
                }
            }
        };
        
        
        var transformMinScale = 10, transformMinRotation = 1,
            transformTriggered = false;
        
        Input.prototype._transformStart = function(){
            var touches = Touches.getTouches(),
                touch1 = touches[0],
                touch2 = touches[1],
                
                scale, rotation, scaleThreshold, rotationThreshold;
            
            if( gesture !== "transform" && transformTriggered ){
                this.trigger("transformend" );
                transformTriggered = false;
                return;
            }
            
            if( touches.length < 2 ){
                return;
            }
            
            if( type === "touchstart" || type === "mousedown" ){
                transformTriggered = false;
            }
            
            if( type === "touchmove" || ( type === "mousemove" && ( Mouse.left || Mouse.middle || Mouse.right ) ) ){
                scale = Vec2.dist( touch1.position, touch2.position ) / Vec2.dist( touch1.start, touch2.start );
                rotation = ( Math.atan2( touch2.position.y - touch1.position.y, touch2.position.x - touch1.position.x ) ) -
                    ( Math.atan2( touch2.start.y - touch1.start.y, touch2.start.x - touch1.start.x ) );
                    
                scaleThreshold = Math.abs( 1 - scale );
                rotationThreshold = Math.abs( rotation );
                
                if( scaleThreshold < transformMinScale &&
                    rotationThreshold < transformMinRotation
                ){
                    return;
                }
                
                gesture = "transform";
                
                if( !transformTriggered ){
                    this.trigger("transformstart", scale, rotation );
                    transformTriggered = true;
                }
                
                this.trigger("transform", scale, rotation );
            }
            
            if( type === "touchend" || type === "mouseup" ){
                
                if( transformTriggered ){
                    inst.trigger( "onTransformend", scale, rotation );
                }
                
                transformTriggered = false;
            }
        };
	
	
	return new Input;
    }
);