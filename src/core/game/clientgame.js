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
	    
	    this.io = io.connect("http://"+ this.host );
	}
        
	Class.extend( ClientGame, Game );
	
	
	return ClientGame;
    }
);