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
		zoom: 2
	    });
	    
	    for( var i = 0; i < 100; i++ ){
		scene.add(
		    new GameObject2D({
			position: new Vec2( Mathf.randFloat( -1, 1 ), Mathf.randFloat( -5, 10 ) ),
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
				shape: RigidBody.CIRCLE,
				linearDamping: new Vec2( 0, 0 ),
				mass: Math.random(),
				radius: 0.5
			    })
			]
		    })
		);
	    }
	    
	    ground = new GameObject2D({
		position: new Vec2( 0, -1029 ),
		components: [
		    new RigidBody({
			shape: RigidBody.CIRCLE,
			mass: 0,
			radius: 1024
		    })
		]
	    });
	    
	    scene.add( ground );
	    
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