angular.module("NewIrc").controller("RoomController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentUser = $routeParams.user;
	$scope.currentRoom = $routeParams.room;
	//$scope.pass = $routeParams.pass;
	$scope.currentUsers = [];
	$scope.errorMessage = ''
	$scope.channelTopic = ''
	$scope.ops = [];
	$scope.messages = []; 
	/*
	* .nick
	* .timestamp
	* .message
	*/

	var test = {
		room:$routeParams.room,
		pass:''//$routeParams.pass /*mögulega skoða einhvert annað form*/
	};
	if(test){console.log("room "+ test);}
		socket.emit('joinroom', test, function (success, reason) {
			console.log("emit called with room name: " + $routeParams.room);
		if (!success) {
				$scope.errorMessage = reason;
			}
		});

	/* emitted events */
	socket.on('updateusers', function (roomName, users, ops) {
		console.log(roomName);
		console.log(users);
		for(x in users) {
			console.log(x);
		}
		console.log(ops);
		for(y in ops){
			console.log(y);
		}
		$scope.currentUsers = users;
	});

	/* listen for events */
	socket.on('updatechat', function (roomName, messageHistory) {
		if(messageHistory !== undefined) {
			for(mH in messageHistory){
				console.log(messageHistory[mH].message);
			};
			$scope.messages = messageHistory
		}
	});

	socket.on('updatetopic', function (roomName, roomTopic, user) {
			console.log(roomTopic);
			$scope.channelTopic = roomTopic;
	});

	socket.on('servermessage', function (tag, roomName, user) {
		console.log(user + " " + tag + "ed " + roomName);
		/* skoða hvað við viljum gera við þetta message */
	});
	
	/*  */	
})