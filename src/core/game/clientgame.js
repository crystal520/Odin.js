if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"require",
	"base/class",
	"base/time",
	"core/game/game"
    ],
    function( require, Class, Time, Game ){
	"use strict";
	
	
	function ClientGame( opts ){
	    opts || ( opts = {} );
	    
	    Game.call( this, opts );
	    
	    this.host = opts.host || "127.0.0.1";
	    this.port = opts.port || 8080;
	    
	    this.io = io.connect("http://"+ this.host, { port: this.port });
	    this.io.on("connect", this.onConnect.bind( this ) );
	}
        
	Class.extend( ClientGame, Game );
	
	
	ClientGame.prototype.onConnect = function( data ){
	    this.io.emit("newClient");
	};
	
	
	return ClientGame;
    }
);