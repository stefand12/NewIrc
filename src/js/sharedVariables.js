angular.module("NewIrc").service('sharedVariables', function ($q) {

	var self = this, 
		defer = $q.defer();

	/* */
	this.user = '';

	this.observeUser = function () {
		return defer.promise;
	};

	this.setUser = function (user) {
		console.log("Sv setting user " + user);
		self.user = user;
		defer.notify(self);
		
	};

	this.getUser = function () {
		return this.user;
	};

	/* */
	this.observeRoom = function () {
		return defer.promise;
	};
	
	this.room = "";	

	this.setRoom = function (room) {
		self.room = room;
		defer.notify(self);
	};

	this.getRoom = function () {
		return this.room;
	};

	/* */
	this.observeTmpArray = function () {
		return defer.promise;
	};

	this.tmpArray = [];

	this.setArray = function (objects) {
		self.tmpArray.push(objects);
		defer.notify(self);
	};

	this.getArray = function () {
		return this.tmpArray;
	};
})