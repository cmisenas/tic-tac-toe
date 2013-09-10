;(function(){
	var http = require('http'),
			fs = require('fs'),
			io = require('socket.io'),
			url = require('url'),
      socket,
      PORT = 80;

	var gamePage = fs.readFileSync(__dirname + '/index.html'),
      gameJs = fs.readFileSync(__dirname + '/game.js');

	var server = http.createServer(function(req, res){
		var pathname = url.parse(req.url).pathname;
		if(pathname == '/'){
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end(gamePage);
		}else if(pathname == '/game.js'){
			res.writeHead(200, {'Content-type': 'text/javascript'});
			res.end(gameJs);
		}else{
			res.writeHead(400);
			res.end('404 Not Found');
		}
	});

	var app = server.listen(PORT),
      players;

	function init(){
		players = [];
		socket = io.listen(app);
		socket.configure(function(){
			socket.set('transports', ['xhr-polling']);
      socket.set('polling duration', 10);
		});

		setEventHandlers();
	}

	function setEventHandlers(){
		socket.sockets.on('connection', socketConnected);	
	}

	function socketConnected(client){
		client.on('disconnect', clientDisconnected);
		client.on('new player', newPlayer);
		client.on('player moved', playerMoved);
	}

	function clientDisconnected(data){
		console.log(data);
	}

	function newPlayer(data){
		console.log(data);
	}

	function playerMoved(data){
		console.log(data);
	}

	init();

}());
