if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	var slice = Array.prototype.slice;
	
	
	function Client( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.id = opts.id !== undefined ? opts.id : "";
	    this.socket = opts.socket !== undefined ? opts.socket : undefined;
	    
	    this.connectTime = opts.connectTime !== undefined ? opts.connectTime : 0;
	    this.offset = 0;
	    
	    this.scene = opts.scene !== undefined ? opts.scene : undefined;
	    this.camera = opts.camera !== undefined ? opts.camera : undefined;
	    
	    this.userData = opts.userData !== undefined ? opts.userData : {};
	    
	    this.device = undefined;
	    this.input = undefined;
	}
        
	Class.extend( Client, Class );
	
	
	Client.prototype.log = function(){
	    if( !this.socket ) return;
	    
	    var args = Array.apply( null, arguments );
	    args.unshift("log");
	    
	    this.socket.emit.apply( this.socket, args );
	};
    
	
	return Client;
    }
);