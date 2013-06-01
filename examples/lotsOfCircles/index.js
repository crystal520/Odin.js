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
		position: new Vec2( 0, 8 ),
		zoom: 4
	    });
	    
	    ground = new GameObject2D({
		position: new Vec2( 0, -1 ),
		components: [
		    new RigidBody({
			mass: 0,
			extents: new Vec2( 16, 1 )
		    })
		]
	    });
	    
	    wallLeft = new GameObject2D({
		position: new Vec2( -17, 14 ),
		components: [
		    new RigidBody({
			mass: 0,
			extents: new Vec2( 1, 16 )
		    })
		]
	    });
	    
	    wallRight = new GameObject2D({
		position: new Vec2( 17, 14 ),
		components: [
		    new RigidBody({
			mass: 0,
			extents: new Vec2( 1, 16 )
		    })
		]
	    });
	    
	    spinner = new GameObject2D({
		position: new Vec2( 0, 4 ),
		components: [
		    new RigidBody({
			mass: 0,
			type: RigidBody.KINEMATIC,
			extents: new Vec2( 4, 0.25 )
		    })
		]
	    });
	    spinner.on("update", function(){
		this.rotate( Math.PI*0.5*Time.delta );
	    });
	    
	    scene.add( ground, wallLeft, wallRight );
	    
	    for( var i = 0; i < 256; i++ ){
		r = Mathf.randFloat( 0.5, 1 );
		scene.add(
		    new GameObject2D({
			position: new Vec2( Mathf.randFloat( -2, 2 ), Mathf.randFloat( 0, 64 ) ),
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