var myApp = angular.module("app", []); 
myApp.controller("Controller", myFunc)

function myApplication ($scope, $location) 
{ 
	$scope.url = ''; 
	$scope.getUrl = function () { 
		$scope.url = $location.absUrl(); 
		$scope.msg = $scope.url.split("#/")[1];
	};

}

alert($scope.msg)