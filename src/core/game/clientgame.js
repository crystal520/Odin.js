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
	}
        
	Class.extend( ClientGame, Game );
	
	
	return ClientGame;
    }
);