/*jslint browser:true */

/* Chat room controller */

angular.module("NewIrc").controller("RoomController", [
	'$scope',
	 '$location',
	  '$rootScope',
	   '$routeParams',
	    'socket',
	     'sharedVariables',
	      'privateMessage', 
	      'passPrompt',
	function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables, privateMessage, passPrompt) {
	$scope.currentUser = $routeParams.user;
	$scope.currentRoom = $routeParams.room;
	sharedVariables.setRoom($routeParams.room);
	$scope.pass = $routeParams.pass;
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.channelTopic = '';
	$scope.bubbar = [];
	$scope.messages = []; 
	$scope.glued = true;
	$scope.banned = [];
	/*
	* .nick
	* .timestamp
	* .message
	*/

	var test = {
		room:$routeParams.room,
		pass:$routeParams.pass /*mögulega skoða einhvert annað form*/
	};
	
	socket.emit('joinroom', test, function (success, reason) {
		if (!success) {
			if(reason === "wrong password") {
				passPrompt.password_prompt("Please enter your password:", "Submit", function (passWrd) {
					$rootScope.$apply(function () {
						$location.path('/room/' + $scope.currentUser +'/'+ $scope.currentRoom +'/'+ passWrd);
					});
				});
			}
			$location.path('/rooms/' + $scope.currentUser);
		}
	});

	/* emitted events */
	socket.on('updateusers', function (roomName, users, ops) {
		if(roomName === $scope.currentRoom) {
			$scope.bubbar = _.toArray(ops);
			$scope.currentUsers = _.toArray(users);
			$scope.currentUsers = _.difference($scope.currentUsers, $scope.bubbar);
		}
	});

	/* listen for events */
	socket.on('updatechat', function (roomName, messageHistory) {
		if(roomName === $scope.currentRoom) {
			$scope.messages = messageHistory;
		}
	});

	socket.on('updatetopic', function (roomName, roomTopic, user) {
		console.log(roomTopic);
		if(roomName === $scope.currentRoom) {
			$scope.channelTopic = roomTopic;
			$scope.newTopic = '';
		}
	});
	
	/* höndlað í homecontroller
	socket.on('servermessage', function (tag, roomName, user) {
		if(roomName === $scope.currentRoom){

		}
		
	});
	*/
	socket.on('bannedlist', function (userName ,channel, bannedlist) {
		console.log("caught bannedlist");
		if(channel === $scope.currentRoom) {
			console.log("currentRoom");
			console.log($scope.currentUser);
			if(userName === $scope.currentUser) {
				console.log("user is op");
				$scope.banned = _.toArray(bannedlist);
				
			} else {
				console.log("user isn't op");
			}
		} else {
			console.log("not Mine");
		}
	});

	$scope.doOp = function (looser) {
		var tmpObj = {
			user: looser,
			room: $scope.currentRoom
		};
		socket.emit('op', tmpObj, function (success) {
			if(!success) {
				console.log("You're not an (/'.')/ you can't op peepz");
			}
		});		
	};

	$scope.doDeop = function (looser) {
		var tmpObj = {
			user: looser,
			room: $scope.currentRoom
		};
		socket.emit('deop', tmpObj, function (success) {
			if(!success) {
				console.log("You're not an (/'.')/ you can't deop peepz");
			}
		});
	};

	$scope.ban = function (user) {
		var tmpObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('ban', tmpObj, function (success) {
			if(!success){
				console.log("You're not an (/'.')/ you can't ban peepz");
			}
		});	
	};

	$scope.unBan = function (user) {
		console.log("unban called");
		console.log(user);
		var tmpObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('unban', tmpObj, function (success) {
			if(!success){
				console.log("You're not an (/'.')/ you can't unban peepz");
			}
		});
	};

	$scope.kick = function (user) {
		var tmpObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('kick', tmpObj, function (success) {
			if(!success){
				console.log("You're not an (/'.')/ you can't kick peepz");
			}
		});
	};

	$scope.leaveRoom = function () {
		sharedVariables.setRoom('');
		socket.emit("partroom", $scope.currentRoom);
		$location.path('/rooms/' + $scope.currentUser);
	};

	$scope.changeTopic = function () {
		var tmpObj = {
			topic: $scope.newTopic,
			room: $scope.currentRoom
		};
		socket.emit('settopic', tmpObj, function (success) {
			if(!success) {
				console.log("Really you non (/'.')/ you can't set topiczes !");
			}
		});
	};

	$scope.changePassword = function () {
		passPrompt.password_prompt("Please enter your password:", "Submit", function (newPass) {
			console.log("newPass = " + newPass);
			
			var tmpObj = {
				password: newPass,
				room: $scope.currentRoom
			};
			if (newPass === undefined || newPass === '') {
				tmpObj = {
					password: '',
					room: $scope.currentRoom
				};
				socket.emit('removepassword' , tmpObj, function (success) {
					if(!success){
						console.log("Really you non (/'.')/ you can't remove password !");
					} else { 
						$scope.pass = newPass;
						console.log("(/'.')/ you removed password !");
					}
				});
			} else {
				socket.emit('setpassword', tmpObj, function (success) {
					if(!success) {
						console.log("Really you non (/'.')/ you can't set password !");
					} else {
						$scope.pass = newPass;
						console.log("(/'.')/ you changed password !");
					}
				});
			}
		});
	};

	$scope.getBanned = function () {
		socket.emit('getBanned', $scope.currentRoom, function (success) {
			if(!success) {
				console.log("Really you non (/'.')/ you can't know who's banned !");
			} else {
				console.log("listen for bannedList");
			}
		});
	};

	$scope.sendPriv = function (user) {
		privateMessage.send(user, socket);
	};

	/*  */	
}]);



