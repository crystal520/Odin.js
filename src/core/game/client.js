if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	
	function Client( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.id = opts.id !== undefined ? opts.id : "";
	    this.socket = opts.socket !== undefined ? opts.socket : undefined;
	    
	    this.connectTime = opts.connectTime !== undefined ? opts.connectTime : 0;
	    this.offset = 0;
	    
	    this.scene = opts.scene !== undefined ? opts.scene : "";
	    this.camera = opts.camera !== undefined ? opts.camera : "";
	    
	    this.userData = opts.userData !== undefined ? opts.userData : {};
	    
	    this.device = undefined;
	    this.input = undefined;
	}
        
	Class.extend( Client, Class );
	
	
	return Client;
    }
);