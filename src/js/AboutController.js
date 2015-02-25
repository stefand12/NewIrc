/* AboutController */
/*
	controller sem er að mestu ónotaður í annað en að 
	injecta ng-view, hugsunin var
	að hafa controller ef við myndum vilja gera eitthvað 
	meira við viewið
*/
angular.module("NewIrc").controller("AboutController", [
	'$scope',
	 function ($scope) {
		$scope.message = "About NewIrc";
	}
]);

