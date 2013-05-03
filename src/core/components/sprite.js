if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"core/components/component"
    ],
    function( Component ){
        "use strict";
        
	var defaultImg = new Image;
	defaultImg.src = "data:image/jpg;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
        
        function Sprite( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.image = opts.image instanceof Image ? opts.image : defaultImg;
	    
	    this.x = opts.x || 0;
	    this.y = opts.y || 0;
	    this.w = opts.w || this.image.width;
	    this.h = opts.w || this.image.height;
        }
        
        Sprite.prototype = Object.create( Component.prototype );
        Sprite.prototype.constructor = Sprite;
        
        
        return Sprite;
    }
);