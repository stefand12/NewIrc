angular.module("NewIrc").controller("RoomListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	//TODO GET ROOM LIST
	//
		$scope.currentUser = $routeParams.user;
		console.log("choo");
		socket.emit('rooms');
		socket.on('roomlist', function (data) {
			var test = [];
			for(var x in data){console.log(x); test.push(x);}; 
			$scope.rooms = test;
		});

		$scope.roomName = '';
		$scope.errorMessage = '';















		$scope.createRoom = function() {
			var newRoom = {
				room: $scope.roomName,
				pass: undefined
			};

			if($scope.roomName === '') {
				console.log("rassgataPíka");
				$scope.errorMessage = "Choose a name for your channel";
			}
			else {
				console.log("píka");
				socket.emit('joinroom', newRoom, function (succsess, reason) {
					if(!succsess){
						$scope.errorMessage = reason;
					}
					else
						{console.log("mamma");}
				});
			}
		};
		/*socket.on('joinroom', function(a,true){
			console.log("creating new room");
		})*/
	//$scope.rooms = ['Room 1','Room 2','Room 3','Room 4','Room 5'];



	
})