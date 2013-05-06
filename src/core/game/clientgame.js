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
	    
	    this.io = io.connect( __host +":"+ __port );
	}
        
	Class.extend( ClientGame, Game );
	
	
	ClientGame.prototype.sendMessage = function( name, data ){
	    
	    this.io.emit( name, data );
	};
	
	
	ClientGame.prototype.onMessage = function( name, fn ){
	    
	    this.io.on( name, fn );
	};
	
	
	return ClientGame;
    }
);