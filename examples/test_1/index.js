var player = new Image;
player.src = "../content/images/player.png";

require(
    {
	baseUrl: "../../src/"
    },
    [
	"odin"
    ],
    function( Odin ){
	
	Odin.globalize();
	
	game = new Game({
	    debug: true,
	    forceCanvas: true
	});
	
	game.on("init", function(){
	    vec2_1 = new Vec2;
	    
	    scene = new Scene;
	    camera = new Camera;
	    
	    sprite = new GameObject({
		position: new Vec2( 0, 2 ),
		components: [
		    new Sprite({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1,
			animations: {
			    idle: {
				frames: [
				    [ 0, 0, 64, 64 ],
				    [ 64, 0, 64, 64 ]
				],
				rate: 0.5
			    }
			}
		    }),
		    new RigidBody({
			shape: RigidBody.BOX,
			extents: new Vec2( 0.5, 0.5 )
		    })
		]
	    });
	    
	    scene.add( sprite );
	    
	    Mouse.on("wheel", function(){
		camera.zoomBy( -this.wheel*Time.delta*4 );
	    });
	    Mouse.on("move", function(){
		
		if( this.left ){
		    camera.translate( vec2_1.set( this.delta.x, this.delta.y ).smul( -Time.delta*0.5 ) );
		}
	    });
	    
	    
	    scene.add( camera );
	    
	    this.addScene( scene );
	    this.setScene( scene );
	    this.setCamera( camera );
	});
	
	game.init();
    }
);