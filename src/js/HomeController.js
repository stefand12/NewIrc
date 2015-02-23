/*jslint browser:true */
angular.module("NewIrc").controller("HomeController", 
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables) {

	$scope.privateMessages = [];
	
	$scope.alerts = [];


  	$scope.closeAlert = function(index) {
    	$scope.alerts.splice(index, 1);
  	};


	$scope.newMessage = false;
	$scope.currentUser = sharedVariables.getUser();
	$scope.currentRoom = sharedVariables.getRoom();
	$scope.message = "Hello from home: " + $scope.currentUser;

	socket.on('recv_privatemsg', function (userName, message) {
		var privateMsg = {
			//from: userName,
			msg: message
		};
		$scope.alerts.push(privateMsg);
		$scope.privateMessages.push(privateMsg);
		$scope.newMessage = true;
	});

	socket.on('servermessage', function (tag, roomName, user) {
		var alert = {
			type: '',
			msg: ''
		};
		if(tag === 'quit') {
			var msg = "";
			for(var x in roomName) {
				msg = msg + " " + roomName[x];
			}
			alert.type = 'alert alert-warning';
			if(user === $scope.currentUser) {
				alert.msg =  "You've quit" + msg;
			} else {
				alert.msg = user + " has quit" + msg;
			}
			$scope.alerts.push(alert);
		} else if(roomName === $scope.currentRoom) {
			console.log("alert check s.c " + $scope.currentUser);
			console.log("alert check u " + user);
			if(user === $scope.currentUser) {
				alert.type = 'alert alert-warning';
				if(tag === 'part') {
					alert.msg = "You've left " + roomName;
				} else {
					alert.type = 'alert alert-success';
					alert.msg = "You've joined " + roomName;
				}
			} else {
				if(tag === 'part') {
					alert.type = 'alert alert-warning';
					alert.msg = user + " has left " + roomName;
				} else {
					alert.type = 'alert alert-success';
					alert.msg = user + " has joined " + roomName; 
				}
			}
			$scope.alerts.push(alert);
		}
		/* skoða hvað við viljum gera við þetta message */
	});

	socket.on('',function (){

	});

	socket.on('', function (){

	});

	sharedVariables.observeUser().then(null, null, function (user) {
		console.log("scope.currentUser = " + user);
    	$scope.currentUser = sharedVariables.getUser();
    	$scope.message = $scope.currentUser;
	});

	sharedVariables.observeRoom().then(null, null, function (room) {
		console.log("scope.currentRoom = " + room);
		$scope.currentRoom = sharedVariables.getRoom();
	});

	$scope.logoff = function () {
		console.log($routeParams.user + " disconnected");
		socket.emit('disc', $routeParams.user);
		sharedVariables.setUser('');
		$location.path('/login/');
	};

	$scope.home = function () {
		console.location("home pushed");
		$location.path('/rooms/' + $routeParams.user);
	};
});