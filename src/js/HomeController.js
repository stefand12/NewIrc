/*jslint browser:true */
/* HomeController */
/*
	HomeController er stærsti controllerinn í 
	NewIrc og sér um að halda utan um notandann
	og hvað er að gerast þegar þú ert loggaður inn
	hann sér um að taka á móti skilaboðum og höndla 
	alert og messages frá server.
	hann tekur inn socket, sharedVariables og privateMessage 
	services til að tala við aðra controllera.
*/
angular.module("NewIrc").controller("HomeController", [
	'$scope',
	'$location',
	'$rootScope',
	'$routeParams',
	'socket',
	'sharedVariables',
	'privateMessage',	      
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables, privateMessage) {
		$scope.privateMessages = [];
		$scope.alerts = [];
		$scope.newMessage = false;
		$scope.currentUser = sharedVariables.getUser();
		$scope.currentRoom = sharedVariables.getRoom();
		$scope.message = "Hello from home: " + $scope.currentUser;

		/*
			function sem hlustar eftir privatemessages 
			og setur þau í privatemessage array í controllernum
		*/
		socket.on('recv_privatemsg', function (userName, message) {
			var privateMsg = {
				from: userName,
				msg: message
			};
			$scope.privateMessages.push(privateMsg);
			$scope.newMessage = true;
		});

		/*
			function sem hlustar eftir server messages og greinir þau
			byrtir síðan viðeigandi warning eftir því sem er að gerast	
		*/
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
		});

		/*
			svipað og servermessage nema bara fyrir banned boð
		*/
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

		/*
			svipað og servermessage nema bara fyrir unbanned boð
		*/
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

		/*
			svipað og servermessage nema bara fyrir opped boð
		*/
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

		/*
			svipað og servermessage nema bara fyrir deopped boð
		*/
		socket.on('deopped', function (roomName, user, byUser) {
			var alert = {
				type: "alert alert-warning",
				msg: ""
			};
			if(user === $scope.currentUser) {
				alert.msg = "You've been deopped in " + roomName + " by " + byUser;
				$scope.alerts.push(alert);
			} else if($scope.currentRoom === roomName) {
				alert.msg = user + " has been deopped in " + roomName + " by " + byUser;
				$scope.alerts.push(alert);
			}
		});


		/*
			svipað og servermessage nema bara fyrir kicked boð
		*/
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

		/*
			notar sharedVariables observe user function, sem sér um að vakta 
			breytingar á sharedVariables.user, sem er notað til að vita hver er 
			notandinn hverju sinni og uppfæra.
		*/
		sharedVariables.observeUser().then(null, null, function (user) {
	    	$scope.currentUser = sharedVariables.getUser();
	    	$scope.message = $scope.currentUser;
		});

		/*
			uppfærir hvaða herbergi er current room hverju sinni
		*/
		sharedVariables.observeRoom().then(null, null, function (room) {
			$scope.currentRoom = sharedVariables.getRoom();
		});

		/*
			logoff function
			0 styllir það sem þarf að 0 stylla.
		*/
		$scope.logoff = function () {
			console.log($routeParams.user + " disconnected");
			$scope.privateMessages = [];
			$scope.alerts = [];
			socket.emit('disc', $routeParams.user);
			sharedVariables.setUser('');
			sharedVariables.setRoom('');
			$location.path('/login/');
		};

		/*
			home
		*/
		$scope.home = function () {
			$location.path('/rooms/' + $routeParams.user);
		};

		/*
			Function sem svarar private messages, 
			notar privateMessage service
		*/
		$scope.reply = function (user) {
			privateMessage.send(user, socket);
		};

		/*
			about
		*/
		$scope.about = function () {
			$location.path('/about/' + $routeParams.user);
		};

		/*
			function til að hreinsa alert
		*/
		$scope.closeAlert = function(index) {
	    	$scope.alerts.remove(index);
	  	};

	  	/*
			function sem hreyfist ef notandi fær private
			message.
		*/
	  	$scope.toggler = function () {
			$scope.newMessage = false;
		};
	}
]);
