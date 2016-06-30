var starter = angular
		.module('starter.controllers', [ 'ngCordova', 'ngStorage' ])

		

		.controller(
				'ApplicationCtrl',
				function($scope, $ionicLoading, appService) {
					$scope.cabinet = {};
					
					/**
					 * Créer un nouvel espace
					 */
					$scope.createCabinet = function() {
						if (!$scope.cabinet.name) {
							$scope.popup("Champ manquant !",
									"Le nom de votre cabinet est obligatoire");
							return;
						}
						appService
								.createCabinet($scope.cabinet.name)
								.then(
										function(response) {
											console
													.log(
															"Création du cabinet (réponse) :", 
															response.data);
											appService
													.storeCabinet(response.data);
											$scope.goHome();
										},
										function(error) {
											console
													.log(
															"Erreur lors de la création du cabinet (réponse) :",
															error);
										});
					}
					
					/**
					 * Rejoindre un cabinet existant
					 */
					$scope.joinCabinet = function() {
						if (!$scope.cabinet.shortCode) {
							$scope.popup("Champ manquant !",
									"Rentre le code que vous avez reçu par email");
							return;
						}
						appService
								.joinCabinet($scope.cabinet.shortCode)
								.then(
										function(response) {
											if (response.data.error) {
												alert(response.data.error);
												return ;
											} else {
												appService.storeCabinet(response.data.cabinet);
												$scope.goHome();
											}
											
										},
										function(error) {
											alert("Error", error);
										});
					}
					
					
					
					
				})

		.controller('HomeCtrl', function($scope, $ionicLoading,$localStorage, appService) {

			ionic.Platform.ready(function() {
				if (appService.isUserConnected()) {
					$scope.listPatients();
				}
			});
			
		
		})

		.controller(
				'PatientsCtrl',
				function($scope, $state, $ionicLoading, $ionicHistory, $localStorage,
						appService) {

					$scope.patient = {};
					$scope.patient.actif = true;

					$scope.addNewPatient = function() {
						console.log("Add new Patient");
						
						$state.go("app.patientnew");
					}

					/**
					 * Ajoute un nouveau patient
					 */
					$scope.registerNewPatient = function() {
						appService
								.createPatient($scope.patient)
								.then(
										function(response) {
											$ionicLoading
													.show({
														template : 'Fiche patient créée !<br /><span class="ion-ios-checkmark-outline larger"></span>'
													});
											window.setTimeout(function() {
												$scope.listPatients();
												$ionicHistory.goBack();
												$ionicLoading.hide();
												$scope.patient = {};
											}, 1000)
										}, function(error) {
											alert("error" + error);
										});
					}

					

					/**
					 * Ounvre une fiche patient
					 */
					$scope.openPatient = function(token) {
						$state.go('app.patient', {
							token : token
						});
					}
					$scope.listPatients();

				})
