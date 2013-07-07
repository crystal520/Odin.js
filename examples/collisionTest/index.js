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
	    debug: true
	});
	
	game.on("init", function(){
	    var ball;
	    vec2_1 = new Vec2;
	    
	    scene = new Scene2D;
	    camera = new Camera2D({
		zoom: 4
	    });
	    
	    for( var i = 128; i--; ){
		var r = Mathf.randFloat( 0.25, 0.5 );
		if( Math.random() < 0.5 ){
		    scene.add(
			new GameObject2D({
			    position: new Vec2( Mathf.randFloat( -8, 8 ), Mathf.randFloat( 0, 16 ) ),
			    components: [
				new Sprite2D({
				    image: "../content/images/player.png",
				    x: 0,
				    y: 0,
				    w: 64,
				    h: 64,
				    width: r+r,
				    height: r+r
				}),
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
			position: new Vec2( Mathf.randFloat( -8, 8 ), Mathf.randFloat( 0, 16 ) ),
			components: [
			    new Sprite2D({
				image: "../content/images/player.png",
				x: 0,
				y: 0,
				w: 64,
				h: 64,
				width: r+r,
				height: r+r
			    }),
			    new RigidBody2D({
				mass: 1,
				extents: new Vec2( r, r )
			    })
			]
		    })
		);
		}
	    }
	    
	    for( var i = 256; i--; ){
		scene.add(
		    new GameObject2D({
			position: new Vec2( Mathf.randFloat( -8, 8 ), -i*0.25 ),
			components: [
			    new RigidBody2D({
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