angular.module("NewIrc").controller("UserListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	
	$scope.currentUser = $routeParams.users;
		console.log("tippauser");
		socket.emit('users');
		socket.on('userlist', function (data) {
			var listtest = [];
			for(var x in data){
			listtest.push(data[x]);
			}
			$scope.users = listtest;
		});
});