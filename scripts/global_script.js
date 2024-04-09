	var app = angular.module('myApplication', []);
	app.controller('Controller', function($scope) {
		//Initializing the models;
		$scope.template_info = ["Author: Dragos Vacariu", "Design: 2017"]
		$scope.tools_used = ["HTML4", "HTML5", "CSS3", "CSS"]
		$scope.connections_list = ["tutorialpoint.com"]
	});