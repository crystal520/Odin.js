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
	    scene = new Scene;
	    camera = new Camera;
	    
	    sprite = new GameObject({
		components: [
		    new Sprite
		]
	    });
	    
	    scene.add( camera, sprite );
	    
	    this.addScene( scene );
	});
	
	game.init();
    }
);