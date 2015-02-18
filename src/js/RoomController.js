angular.module("NewIrc").controller("RoomController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentUser = $routeParams.user;
	$scope.currentChannel = $routeParams.room;
	$scope.message = "Hello from room";
})