angular.module("NewIrc").controller("ChatController", function ($scope, $location, $rootScope, $routeParams, socket, sharedVariables) {
	$scope.message = "Hello from chat";
	$scope.msgText = '';
	$scope.currentUser = sharedVariables.getUser();
	$scope.currentRoom = sharedVariables.getRoom();
	console.log("getúser " + sharedVariables.getUser());
	console.log("getRúm " + sharedVariables.getRoom());

	$scope.sendMessage = function() {
		console.log($scope.msgText);
		console.log($scope.currentRoom);
		var messageObj = {
				roomName : $scope.currentRoom,
				msg : $scope.msgText
			};
		socket.emit("sendmsg", messageObj);
		socket.on('updatechat', function (roomName, msgHis) {
			if(roomName === $scope.currentRoom){
				$scope.msgText = "";
			}
		});
	};
})

