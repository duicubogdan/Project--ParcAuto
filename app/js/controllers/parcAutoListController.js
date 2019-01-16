/*global angular*/
var app = angular.module("parcAutoListController",["ui.router"]);

var SERVER = 'https://web-duicu-bogdan.c9users.io'

app.controller('parcAutoListController', function($scope, $http, $state){
	$scope.constructor = function(){
		$http.get(SERVER + '/parcAutoList')
			.then(function(response) {     
			    console.log(response.data)
				$scope.parcAutoList = response.data
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		  	
	}
	
	$scope.searchParcAuto = function(search){
				$http.get(SERVER + '/vehiculeList/'+search.term)
			.then(function(response) {     
			    console.log(response.data)
				$scope.vehiculList = response.data
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})
	}

	$scope.addParcAuto = function(parcAuto){
		$http.post(SERVER + '/parcAutoList',parcAuto)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}

    $scope.deleteParcAuto = function(parcAuto){
		$http.delete(SERVER + '/parcAutoList/ ' + parcAuto.id)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}
	
	$scope.selected = {}
	$scope.getTemplate = function(parcAuto) {
		if (parcAuto.id === $scope.selected.id){
			return 'edit'
		}  
		else{ 
			return 'display'
		}
	}
	
	$scope.editParcAuto = function (parcAuto) {  
	    $scope.selected = angular.copy(parcAuto)
	}
	
	 $scope.saveParcAuto = function(parcAuto){
		$http.put(SERVER + '/parcAutoList/' + parcAuto.id, parcAuto)
			.then(function(response) {     
				$state.go($state.current, {}, {reload: true})
			})
			.catch(function(response){
				console.log(response)
				$scope.status = 'error'
			})		
	}

	$scope.constructor();
});

//directiva custom:
app.directive('directivaParcAuto', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, mCtrl) {
      function validareCapacitate(value) {
        if ($.isNumeric(value)) {
          mCtrl.$setValidity('charE', true);
        } else {
          mCtrl.$setValidity('charE', false);
        }
        return value;
      }
      mCtrl.$parsers.push(validareCapacitate);
    }
  };
});