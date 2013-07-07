if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
        "use strict";
	
        
	function PBody2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this, opts );
	    
	    this.filterGroup = opts.filterGroup !== undefined ? opts.filterGroup : 0;
	    
	    this.world = undefined;
	    
	    this.userData = undefined;
	}
	
	Class.extend( PBody2D, Class );
	
	
	PBody2D.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.type = "PBody2D";
	    json._SERVER_ID = this._id;
	    json.filterGroup = this.filterGroup;
	    
	    return json;
	};
	
	
	PBody2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    this.filterGroup = json.filterGroup;
	    
	    return this;
	};
	
	
	PBody2D.DYNAMIC = 1;
	PBody2D.STATIC = 2;
	PBody2D.KINEMATIC = 3;
	
        
        return PBody2D;
    }
);