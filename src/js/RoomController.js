/*jslint browser:true */

/* Chat room controller */

/*
	Þessi controler sér um að stjórna messt allri virkni
	þegar komið er inn á rásir til að spjalla.
	hann tekur inn socket, sharedVariables, privateMessage og
	passPrompt service til að kalla í auka function og tala 
	við aðra controlera.
*/
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
			object til að senda rás áfram á chatserver
			password er ekki hashað eða neitt fancy 
		*/
		var test = {
			room:$routeParams.room,
			pass:$routeParams.pass
		};


		/* emitted events */

		/*
			Sendir join request og kallar í passPrompt service
			rangt password er notað
		*/
		socket.emit('joinroom', test, function (success, reason) {
			if (!success) {
				if(reason === "wrong password") {
					passPrompt.password_prompt("Please enter the channels password to join (leave empty to cancel)", "Submit", 200, 200, function (passWrd) {
						if(passWrd !== undefined && passWrd !== '') {
							$rootScope.$apply(function () {
								$location.path('/room/' + $scope.currentUser +'/'+ $scope.currentRoom +'/'+ passWrd);
							});
						}
					});
				}
				$location.path('/rooms/' + $scope.currentUser);
			}
		});


		/* listen for events */

		/*
			hlustar eftir 'updateusers' signal á frá servernum
			og uppfærir notenda listann eftir þvi	
		*/
		socket.on('updateusers', function (roomName, users, ops) {
			if(roomName === $scope.currentRoom) {
				$scope.bubbar = _.toArray(ops);
				$scope.currentUsers = _.toArray(users);
				$scope.currentUsers = _.difference($scope.currentUsers, $scope.bubbar);
			}
		});

		/*
			hlustar eftir 'updatechat' signal á frá servernum
			og uppfærir chattið eftir þvi	
		*/
		socket.on('updatechat', function (roomName, messageHistory) {
			if(roomName === $scope.currentRoom) {
				$scope.messages = messageHistory;
			}
		});

		/*
			hlustar eftir 'updatetopic' signal á frá servernum
			og uppfærir topic	
		*/
		socket.on('updatetopic', function (roomName, roomTopic, user) {
			if(roomName === $scope.currentRoom) {
				$scope.channelTopic = roomTopic;
				$scope.newTopic = '';
			}
		});

		/*
			hlustar eftir 'bannedlist' signal á frá servernum
			og uppfærir banned list ef notandi er op
			þetta er viðbætt function á serverin svo við gætum
			á auðveldan máta unbannað users	
		*/
		socket.on('bannedlist', function (userName ,channel, bannedlist) {
			if(channel === $scope.currentRoom) {
				if(userName === $scope.currentUser) {
					$scope.banned = _.toArray(bannedlist);				
				}
			} 
		});

		/*
			function til að oppa notendur	
		*/
		$scope.doOp = function (user) {
			var tmpObj = {
				user: user,
				room: $scope.currentRoom
			};
			socket.emit('op', tmpObj, function (success) {
				if(!success) {
					console.log("You're not an (/'.')/ you can't op peepz");
				}
			});		
		};

		/*
			function til að de oppa notendur	
		*/
		$scope.doDeop = function (user) {
			var tmpObj = {
				user: user,
				room: $scope.currentRoom
			};
			socket.emit('deop', tmpObj, function (success) {
				if(!success) {
					console.log("You're not an (/'.')/ you can't deop peepz");
				}
			});
		};

		/*
			function til að banna notendur	
		*/
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

		/*
			function til að un banna notendur	
		*/
		$scope.unBan = function (user) {
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

		/*
			function til að kicka notendum	
		*/
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

		/*
			function til að fara af rás,
			sendir partroom og redirectar í roomlist	
		*/
		$scope.leaveRoom = function () {
			sharedVariables.setRoom('');
			socket.emit("partroom", $scope.currentRoom);
			$location.path('/rooms/' + $scope.currentUser);
		};

		/*
			function til að breyta topic	
		*/
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

		
		/*
			function til að breyta password
			kallar í passPrompt service til slá inn nýtt pass.	
		*/
		$scope.changePassword = function () {
			passPrompt.password_prompt("Please enter your password:", "Submit", function (newPass) {
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

		/*
			function til að kalla eftir lista af 
			bönnuðum notendum á rásinni frá server.	
		*/
		$scope.getBanned = function () {
			socket.emit('getBanned', $scope.currentRoom, function (success) {
				if(!success) {
					console.log("Really you non (/'.')/ you can't know who's banned !");
				} 
			});
		};

		/*
			function til að senda private message,
			notar private Message service til að senda message	
		*/
		$scope.sendPriv = function (user) {
			privateMessage.send(user, socket);
		};
}]);



