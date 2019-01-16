/*global angular*/
var app = angular.module("detaliiParcAutoController",["ui.router"]);

var SERVER = 'https://web-duicu-bogdan.c9users.io'

app.controller('detaliiParcAutoController', function($scope, $http, $state,  $stateParams){
	$scope.constructor = function(){
		$http.get(SERVER + '/parcAutoList/' + $stateParams.parcAutoId)
		.then(function(response) {     
		    console.log(response.data)
			$scope.parcAuto = response.data
			return $http.get(SERVER + '/parcAutoList/' + $scope.parcAuto.id + '/vehiculeList')
		})
		.then(function(response){
			console.log(response.data)
			$scope.parcAuto.vehiculeList = response.data
		})
		.catch(function(response){
			console.log(response)
			$scope.status = 'error'
		})			  
	}
	
	$scope.addVehicul = function(vehicul){
		$http.post(SERVER + '/parcAutoList/' + $stateParams.parcAutoId + '/vehiculeList',vehicul)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}

    $scope.deleteVehicul = function(vehicul){
		$http.delete(SERVER + '/parcAutoList/' +  $stateParams.parcAutoId + '/vehiculeList/' + vehicul.id)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}
	
	$scope.selected = {}
	$scope.getTemplate = function(vehicul) {
		if (vehicul.id === $scope.selected.id){
			return 'edit'
		}  
		else{ 
			return 'display'
		}
	}
	
	$scope.editVehicul = function(vehicul) {
	    $scope.selected = angular.copy(vehicul)
	}
	
	 $scope.saveVehicul = function(vehicul){
	 	console.log('sending')
	 	console.log(vehicul)
		$http.put(SERVER + '/parcAutoList/' +  $stateParams.parcAutoId + '/vehiculeList/' + vehicul.id, vehicul)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}


	$scope.constructor();
})