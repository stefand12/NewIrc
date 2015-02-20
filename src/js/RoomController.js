angular.module("NewIrc").controller("RoomController", function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables) {
	$scope.currentUser = $routeParams.user;
	$scope.currentRoom = $routeParams.room;
	console.log("booboo "+ $routeParams.user);
	sharedVariables.setUser($routeParams.user);
	sharedVariables.setRoom($routeParams.room);
	//$scope.pass = $routeParams.pass;
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.channelTopic = '';
	$scope.ops = [];
	$scope.messages = []; 
	$scope.glued = true;
	/*
	* .nick
	* .timestamp
	* .message
	*/

	var test = {
		room:$routeParams.room,
		pass:''//$routeParams.pass /*mögulega skoða einhvert annað form*/
	};
	socket.emit('joinroom', test, function (success, reason) {
		console.log("joinroom emitted with room name: " + $routeParams.room);
	if (!success) {
			$scope.errorMessage = reason;
		}
	});

	/* emitted events */
	socket.on('updateusers', function (roomName, users, ops) {
		if(roomName === $scope.currentRoom) {
			$scope.ops = _.toArray(ops);
			console.log($scope.ops);
			$scope.currentUsers = _.toArray(users);
			console.log($scope.currentUsers);
			$scope.currentUsers = _.difference($scope.currentUsers, $scope.ops);
			console.log($scope.currentUsers); 
		}
	});

	/* listen for events */
	socket.on('updatechat', function (roomName, messageHistory) {
		if(roomName === $scope.currentRoom) {
			for(var mH in messageHistory) {
				console.log(messageHistory[mH].message);
			}
			$scope.messages = messageHistory;
		}
	});

	socket.on('updatetopic', function (roomName, roomTopic, user) {
		console.log(roomTopic);
		if(roomName === $scope.currentRoom){
			$scope.channelTopic = roomTopic;
		}
	});

	socket.on('servermessage', function (tag, roomName, user) {
		if(roomName === $scope.currentRoom){
			console.log(user + " " + tag + "ed " + roomName);
		}
		/* skoða hvað við viljum gera við þetta message */
	});

	$scope.leaveRoom = function() {
		socket.emit("partroom", $scope.currentRoom);
		$location.path('/rooms/' + $scope.currentUser);
	};
	
	/*  */	
});


