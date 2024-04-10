	var app = angular.module('myApplication', []);
	app.controller('Controller', function($scope) {
		//Initializing the models;
		$scope.pageObject = {
			footer_table_headers : ["Template Info:", "Connections:", "Tools Used:"],				
			template_info : ["Author: Dragos Vacariu", "Design: 2017"],
			tools_used : ["HTML4", "HTML5", "CSS3", "CSS"],
			connections_list : ["tutorialpoint.com"],
			footer_copyright : "Dragos Vacariu © 2024",
			footer_paragraph : "Portofolio",
			page_title : "Portofolio",
			page_navigation : [
				{name: "Home", value : "./index.html"},
				{name: "Catalogue", value : "./catalogue.html"},
				{name: "Contact", value : "./contact.html"},
			],
			page_navigation_dropdown : [
				{name: "Java Apps", value : "./java_apps.html"},
			],
		}

	});