/*jslint browser:true */
angular.module("NewIrc").controller("HomeController", 
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables, privateMessage) {

	$scope.privateMessages = [];
	
	$scope.alerts = [];


  	$scope.closeAlert = function(index) {
  		console.log($scope.alerts);
    	$scope.alerts.remove(index);
    	console.log($scope.alerts);
  	};


	$scope.newMessage = false;
	$scope.currentUser = sharedVariables.getUser();
	$scope.currentRoom = sharedVariables.getRoom();
	$scope.message = "Hello from home: " + $scope.currentUser;

	socket.on('recv_privatemsg', function (userName, message) {
		var privateMsg = {
			from: userName,
			msg: message
		};
		$scope.privateMessages.push(privateMsg);
		$scope.newMessage = true;
	});

	$scope.toggler = function () {
		$scope.newMessage = false;
	};

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

	socket.on('banned',function (roomName, user, byUser) {
		var alert = {
			type: "alert alert-danger",
			msg: ""
		};
		if(user === $scope.currentUser) {
			alert.msg = "You've been banned from " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
			if(roomName === $scope.currentRoom) {
				$scope.currentRoom ="";
				$location.path('/rooms/' + $scope.currentUser);
			}
		} else if($scope.currentRoom === roomName) {
			alert.msg = user + " has been banned from " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		}
	});

	socket.on('unbanned', function (roomName, user, byUser) {
		var alert = {
			type: "alert alert-success",
			msg: ""
		};
		if(user === $scope.currentUser) {
			alert.msg = "You've been unbanned from " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		} else if($scope.currentRoom === roomName) {
			alert.msg = user + " has been unbanned from " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		}
	});

	socket.on('opped', function (roomName, user, byUser) {
		var alert = {
			type: "alert alert-success",
			msg: ""
		};
		if(user === $scope.currentUser) {
			alert.msg = "You've been opped in " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		} else if($scope.currentRoom === roomName) {
			alert.msg = user + " has been opped in " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		}
	});

	socket.on('deopped', function (roomName, user, byUser) {
		var alert = {
			type: "alert alert-warning",
			msg: ""
		};
		if(user === $scope.currentUser) {
			alert.msg = "You've been deopped in " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
			if(roomName === $scope.currentRoom) {
				$scope.currentRoom ="";
				$location.path('/rooms/' + $scope.currentUser);
			}
		} else if($scope.currentRoom === roomName) {
			alert.msg = user + " has been deopped in " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		}
	});

	socket.on('kicked', function (roomName, user, byUser) {
		var alert = {
			type: "alert alert-danger",
			msg: ""
		};
		if(user === $scope.currentUser) {
			alert.msg = "You've been kicked from " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
			if(roomName === $scope.currentRoom) {
				$scope.currentRoom ="";
				$location.path('/rooms/' + $scope.currentUser);
			}
		} else if($scope.currentRoom === roomName) {
			alert.msg = user + " has been kicked from " + roomName + " by " + byUser;
			$scope.alerts.push(alert);
		}
	});

	sharedVariables.observeUser().then(null, null, function (user) {
    	$scope.currentUser = sharedVariables.getUser();
    	$scope.message = $scope.currentUser;
	});

	sharedVariables.observeRoom().then(null, null, function (room) {
		console.log("scope.currentRoom = " + room);
		$scope.currentRoom = sharedVariables.getRoom();
	});

	$scope.logoff = function () {
		console.log($routeParams.user + " disconnected");
		$scope.privateMessages = [];
		$scope.alerts = [];
		socket.emit('disc', $routeParams.user);
		sharedVariables.setUser('');
		$location.path('/login/');
	};

	$scope.home = function () {
		$location.path('/rooms/' + $routeParams.user);
	};

	$scope.reply = function (user) {
		privateMessage.send(user, socket);
	};

	$scope.about = function () {
		$location.path('/about/' + $routeParams.user);
	};
});