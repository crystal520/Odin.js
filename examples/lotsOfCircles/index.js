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
	    camera = new Camera2D({
		zoom: 3
	    });
	    
	    ground = new GameObject2D({
		position: new Vec2( 0, -2 ),
		components: [
		    new RigidBody({
			shape: RigidBody.BOX,
			mass: 0,
			extents: new Vec2( 16, 1 )
		    })
		]
	    });
	    
	    scene.add( ground );
	    
	    for( var i = 0; i < 100; i++ ){
		r = Mathf.randFloat( 0.5, 1 );
		scene.add(
		    new GameObject2D({
			position: new Vec2( Mathf.randFloat( -4, 4 ), Mathf.randFloat( 0, 32 ) ),
			components: [
			    new Sprite({
				image: player,
				x: 0,
				y: 0,
				w: 64,
				h: 64,
				width: r+r,
				height: r+r
			    }),
			    new RigidBody({
				shape: RigidBody.CIRCLE,
				linearDamping: new Vec2( 0, 0 ),
				mass: 1,
				radius: r
			    })
			]
		    })
		);
	    }
	    
	    Mouse.on("wheel", function(){
		camera.zoomBy( -this.wheel*Time.delta*4 );
	    });
	    Mouse.on("move", function(){
		
		if( this.left ){
		    camera.translate( vec2_1.set( this.delta.x, this.delta.y ).smul( -0.05 ) );
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