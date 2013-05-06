require(
    {
	baseUrl: __dirname +"../../src/"
    },
    [
	"odin",
	"core/game/clientgame",
    ],
    function( Odin, ClientGame ){
	
	Odin.globalize();
	
	game = new ClientGame({
	    debug: true
	});
	
	game.onMessage("connect", function( data ){
	    console.log( data );
	});
    }
);