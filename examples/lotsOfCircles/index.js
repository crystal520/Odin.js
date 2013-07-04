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
	    
	    scene = new Scene2D;
	    camera = new Camera2D({
		position: new Vec2( 0, 4 ),
		zoom: 3
	    });
	    
	    ground = new GameObject2D({
		position: new Vec2( 0, 0 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 8, 0.5 )
		    })
		]
	    });
	    
	    wallLeft = new GameObject2D({
		position: new Vec2( -8, 8 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.5, 8 )
		    })
		]
	    });
	    
	    wallRight = new GameObject2D({
		position: new Vec2( 8, 8 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.5, 8 )
		    })
		]
	    });
	    
	    spinner = new GameObject2D({
		position: new Vec2( 0, 4 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 1, 2 ),
			type: RigidBody2D.KINEMATIC
		    })
		]
	    });
	    spinner.on("update", function(){
		this.rotate( Math.PI*0.5*Time.delta );
	    });
	    
	    ceiling = new GameObject2D({
		position: new Vec2( 0, -1 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 4, 0.5 ),
			type: RigidBody2D.KINEMATIC
		    })
		]
	    });
	    ceiling.on("update", function(){
		
		if( Input.key("up") ){
		    this.position.y += 0.1;
		}
		if( Input.key("down") ){
		    this.position.y -= 0.1;
		}
		if( Input.key("right") ){
		    this.position.x += 0.1;
		}
		if( Input.key("left") ){
		    this.position.x -= 0.1;
		}
		
		if( Input.key("a") ){
		    this.rotation += 0.05;
		}
		if( Input.key("d") ){
		    this.rotation -= 0.05;
		}
	    });
	    
	    scene.add( ground, wallLeft, wallRight, ceiling );
	    
	    
	    for( var i = 256; i--; ){
		var r = Mathf.randFloat( 0.1, 0.5 );
		
		if( Math.random() < 0.5 ){
		    scene.add(
			new GameObject2D({
			    position: new Vec2( Mathf.randFloat( -3, 3 ), Mathf.randFloat( 3, 16 ) ),
			    components: [
				new RigidBody2D({
				    mass: 1,
				    radius: r
				})
			    ]
			})
		    );
		}
		else{
		    scene.add(
			new GameObject2D({
			    position: new Vec2( Mathf.randFloat( -3, 3 ), Mathf.randFloat( 3, 16 ) ),
			    components: [
				new RigidBody2D({
				    mass: 1,
				    extents: new Vec2( r, r )
				})
			    ]
			})
		    );
		}
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