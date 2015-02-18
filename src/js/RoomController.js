angular.module("NewIrc").controller("RoomController", function ($scope) {
	$scope.currentUser = $routeParams.user;
	$scope.currentChannel = $routeParams.room;
	$scope.message = "Hello from room";
})