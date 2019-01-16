/*global angular*/
var app = angular.module('crudApp', [
	'ui.router',
	'parcAutoListController',
	'detaliiParcAutoController'
	])
 
app.config(function($stateProvider, $urlRouterProvider) {   	
	$urlRouterProvider.otherwise("/parcAutoList")
	$stateProvider
		.state('parcAutoList', {
			url: "/parcAutoList",
			templateUrl:'partials/parcAutoList.html',
			controller:'parcAutoListController'
		})
		.state('detaliiParcAuto', {
			url: "/parcAutoList/:parcAutoId",
			templateUrl:'partials/detalii_ParcAuto.html',
			controller:'detaliiParcAutoController'
		})
})
