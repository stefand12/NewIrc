angular.module("NewIrc").controller("UserListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	
	$scope.allusers = $routeParams.users;
		console.log("tippauser");
		socket.emit('users');
		socket.on('userlist', function (data) {
			var listtest = [];


			//console.log(Object.keys(data));
			for(var x in data){

			//console.log(Object.keys(x));
			listtest.push(data[x]);
			//console.log(data[x]);
		}; 
			$scope.users = listtest;


		});
	$scope.message = "Hello from userlist";
})