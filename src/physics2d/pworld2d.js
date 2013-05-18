if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/body/pbody2d",
	"physics2d/collision/pbroadphase2d",
	"physics2d/collision/psolver2d"
    ],
    function( Class, Vec2, PBody2D, PBroadphase2D, PSolver2D ){
	"use strict";
	
	var pow = Math.pow,
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.time = 0;
	    this.allowSleep = true;
	    
	    this.bodies = [];
	    
	    this.contacts = [];
	    
	    this._pairsA = [];
	    this._pairsB = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    opts.aabbBroadphase = true;
	    this.broadphase = new PBroadphase2D( this, opts.aabbBroadphase );
	    this.solver = new PSolver2D( this );
	    
	    this._removeList = [];
	}
	
	Class.extend( PWorld2D, Class );
	
	
	PWorld2D.prototype.add = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index === -1 ){
		body.world = this;
		bodies.push( body );
		body.trigger("add");
	    }
	};
	
	
	PWorld2D.prototype.remove = function( body ){
	    
	    this._removeList.push( body );
	};
	
	
	PWorld2D.prototype._remove = function(){
	    var bodies = this.bodies,
		removeList = this._removeList,
		body, index, i, il;
	    
	    for( i = 0, il = removeList.length; i < il; i++ ){
		body = removeList[i];
		index = bodies.indexOf( body );
		
		if( index !== -1 ){
		    bodies.splice( index, 1 );
		    body.trigger("remove");
		}
	    }
	};
	
	
	PWorld2D.prototype.step = function( dt ){
	    var bodies = this.bodies,
		body, i, il;
	    
	    if( this._removeList.length ){
		this._remove();
	    }
	    
	    this.time += dt;
	    
	    this.broadphase.collisionPairs();
	    this.solver.solve();
	    
	    for( i = 0, il = bodies.length; i < il; i++ ){
		bodies[i].update( dt );
	    }
	};
	
	
	return PWorld2D;
    }
);