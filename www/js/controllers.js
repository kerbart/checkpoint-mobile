var starter = angular.module('starter.controllers', ['ngCordova', 'ngStorage'])

.controller('AppCtrl', function($scope,$state, $ionicModal,$ionicLoading, $timeout) {

})

.controller('HomeCtrl', function($scope, $ionicLoading, appService) {
 
  
})

.controller('PatientsCtrl', function($scope, $state, $ionicLoading, appService) {
	$scope.addNewPatient = function() {
		console.log("Add new Patient");
		$state.go("app.patientnew");
	}
  
})


.controller('LoginCtrl', function($scope, $ionicLoading, appService) {
  console.log("Login Controller");
  
  $scope.user = {};
  
  $scope.createAccount = function() {
	  $ionicLoading
		.show({
			template : "Creation de votre comtpe...<br /><ion-spinner icon='spiral' class='spinner-energized' ></ion-spinner>"
		});
	  
	  appService.signInWithEmail($scope.user.email, $scope.user.password).then(
			  function(response) {
				  $ionicLoading.hide();
				  appService.storeUser(response.data.utilisateur);
			  },
			  function (error) {
				  $ionicLoading.hide();
			  }
	  );
  }
  
})

