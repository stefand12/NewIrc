angular.module("NewIrc").controller("ChatController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.message = "Hello from chat";
	$scope.messageText = "";
	$scope.currentUser = $routeParams.users;
	$scope.currentRoom = $routeParams.room;

	$scope.login = function() {
		var messageObj = {
				roomName : $scope.currentRoom,
				msg : $scope.messageText
			};
			socket.emit("sendmsg", messageObj);
			$scope.message = "";
	};
})