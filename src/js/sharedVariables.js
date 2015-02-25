/* sharedVariables */

/*
	sharedVariables service'ið var búið til 
	til að halda utan um hvaða notandi er online hvejru synni og til að 
	getað með skjótum hætt uppfært hvaða herbergi þú ert loggaður inn.
	upprunalega var hugsunin að nota þetta service mun meira en var 
	ekki þörf á því.
*/
angular.module("NewIrc").service('sharedVariables', [
	'$q',
	function ($q) {
		var self = this, 
			defer = $q.defer();

		/* */
		this.user = '';

		this.observeUser = function () {
			return defer.promise;
		};

		this.setUser = function (user) {
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
	}
]);