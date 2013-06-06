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
		zoom: 1
	    });
	    camera.on("update", function(){
		this.follow( ball, 16 );
	    });
	    
	    ball = new GameObject2D({
		position: new Vec2( 0.5, 2 ),
		components: [
		    new Sprite({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1
		    }),
		    new RigidBody({
			mass: 1,
			linearDamping: new Vec2( 0.5, 0.5 ),
			radius: 0.5
		    })
		]
	    });
	    scene.add( ball );
	    
	    for( var i = 1024; i--; ){
		scene.add(
		    new GameObject2D({
			position: new Vec2( Mathf.randFloat( -8, 8 ), -i*0.25 ),
			components: [
			    new RigidBody({
				mass: 0,
				radius: 0.5
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