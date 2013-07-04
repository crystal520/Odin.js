if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/input/key"
    ],
    function( Class, Time, Key ){
	"use strict";
	
        
        function Keyboard(){
            
            Class.call( this );
            
            this.keys = {};
            
            for( var key in keyNames ){
                
                this.keys[ key ] = new Key( key, keyNames[ key ] );
            }
        };
        
	Class.extend( Keyboard, Class );
        
        
        Keyboard.prototype.handleEvents = function( e ){
            e.preventDefault();
            
            switch( e.type ){
                case "keydown":
                    this.handle_keydown( e );
                    break;
                case "keyup":
                    this.handle_keyup( e );
                    break;
            }
        };
        
        
        Keyboard.prototype.handle_keydown = function( e ){
            var keys = this.keys, key, name;
            
	    for( name in keys ){
		key = keys[ name ];
                
		if( key.keyCode === e.keyCode ){
		    
		    key.down = true;
                    
                    if( key._first ){
			key.downTime = Time.time;
                        key._downFrame = Time.frame;
                        key._first = false;
                    }
                    
                    this.trigger("keydown", key );
		}
	    }
        };
        
        
        Keyboard.prototype.handle_keyup = function( e ){
            var keys = this.keys, key, name;
            
	    for( name in keys ){
		key = keys[ name ];
		
		if( key.keyCode === e.keyCode ){
		    
		    key.down = false;
                    
                    if( !key._first ){
			key.endTime = Time.time;
                        key._upFrame = Time.frame;
                        key._first = true;
                    }
                    
                    this.trigger("keyup", key );
		}
	    }
        };
	
	
	Keyboard.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.keys = this.keys;
	    
	    return json;
	};
        
        
        var keyNames = {
            win_key_ff_linux: 0,
            mac_enter: 3,
            backspace: 8,
            tab: 9,
            num_center: 12,
            enter: 13,
            shift: 16,
            ctrl: 17,
            alt: 18,
            pause: 19,
            caps_lock: 20,
            esc: 27,
            space: 32,
            page_up: 33,
            page_down: 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            print_screen: 44,
            insert: 45,
            delete: 46,
            zero: 48,
            one: 49,
            two: 50,
            three: 51,
            four: 52,
            five: 53,
            six: 54,
            seven: 55,
            eight: 56,
            nine: 57,
            ff_semicolon: 59,
            ff_equals: 61,
            question_mark: 63, 
            a: 65,
            b: 66,
            c: 67,
            d: 68,
            e: 69,
            f: 70,
            g: 71,
            h: 72,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            m: 77,
            n: 78,
            o: 79,
            p: 80,
            q: 81,
            r: 82,
            s: 83,
            t: 84,
            u: 85,
            v: 86,
            w: 87,
            x: 88,
            y: 89,
            z: 90,
            meta: 91,
            win_key_right: 92,
            context_menu: 93,
            num_zero: 96,
            num_one: 97,
            num_two: 98,
            num_three: 99,
            num_four: 100,
            num_five: 101,
            num_six: 102,
            num_seven: 103,
            num_eight: 104,
            num_nine: 105,
            num_mult: 106,
            num_plus: 107,
            num_minus: 109,
            num_period: 110,
            num_division: 111,
            f1: 112,
            f2: 113,
            f3: 114,
            f4: 115,
            f5: 116,
            f6: 117,
            f7: 118,
            f8: 119,
            f9: 120,
            f10: 121,
            f11: 122,
            f12: 123,
            numlock: 144,
            scroll_lock: 145,
            first_media_key: 166,
            last_media_key: 183,
            semicolon: 186,            
            dash: 189,                 
            equals: 187,               
            comma: 188,                
            period: 190,               
            slash: 191,                
            apostrophe: 192,           
            tilde: 192,                
            single_quote: 222,         
            open_square_bracket: 219,  
            backslash: 220,            
            close_square_bracket: 221, 
            win_key: 224,
            mac_ff_meta: 224,
            win_ime: 229,
            phantom: 255
        };
        
        
        return new Keyboard;
    }
);