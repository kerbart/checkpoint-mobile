var starter = angular
		.module('starter.controllers', [ 'ngCordova', 'ngStorage' ])

		.controller(
				'AppCtrl',
				function($scope, $state, $ionicPopup, $ionicHistory,
						$ionicModal, $ionicLoading, $cordovaCalendar, $timeout,
						$localStorage, $ionicSideMenuDelegate, appService) {

					/*
					 * Definition de tous les tools utilisés par le reste des
					 * controllers
					 */
					$scope.popup = function(title, text) {
						$ionicPopup.show({
							template : "<b>" + text + "</b>",
							title : title,
							subTitle : '',
							scope : $scope,
							buttons : [ {
								text : '<b>Annuler</b>',
								type : 'button-assertive'
							} ]
						})

					}

					/**
					 * Open home screen
					 */
					$scope.goHome = function() {
						$ionicHistory.nextViewOptions({
							disableBack : true
						});
						$state.go("app.home");
					}

					/**
					 * Open login page
					 */
					$scope.goLogin = function() {
						$ionicHistory.clearHistory();
						$ionicHistory.nextViewOptions({
							disableBack : true,
							disableAnimate : true,
							historyRoot : false
						})
						$ionicHistory.clearCache();
						$ionicHistory.clearHistory();
						$state.go("app.login");
					}

					/**
					 * Open login page with creation
					 */
					$scope.goLoginCreate = function() {
						$ionicHistory.clearHistory();
						$ionicHistory.nextViewOptions({
							disableBack : true,
							disableAnimate : false,
							historyRoot : false
						})
						$state.go("app.logincreate");
					}

					/**
					 * Liste les patients existant pour l'application
					 * enregistrée
					 */
					$scope.patients = {};
					$scope.listPatients = function() {
						appService.listPatients().then(function(response) {
							$localStorage.patients = response.data.patients;
							$scope.patients = $localStorage.patients;
							$scope.$broadcast('scroll.refreshComplete');
						}, function(error) {
							alert("erreur pour charger les patients");
							$scope.$broadcast('scroll.refreshComplete');
						});
					}
					
					
					/**
					 * On app opening
					 */
					ionic.Platform
							.ready(function() {
								if (!appService.isUserConnected()) {
									$scope.goLogin();
									console.log("Go login....");
								} else {
									appService
											.checkUserToken()
											.then(
													function(response) {
														if (response.data.error) {
															appService.logout();
														}
													},
													function(error) {
														alert("Erreur lors de la vérification du token de sécurité");
													});
								}
							});

					/**
					 * Utilisé pour l'affichage du menu
					 */
					$scope.userIsConnected = function() {
						return appService.isUserConnected();
					}

					/**
					 * Efface toutes les données utilisateur
					 */
					$scope.logout = function() {
						appService.logout();
						$ionicSideMenuDelegate.toggleLeft();
					}

					/**
					 * Check if user is connected. Redirect to app login if not
					 */
					$scope.checkUserIsConnected = function() {
						if (!appService.isUserConnected()) {
							$scope.goLogin();
						}
					}

					/**
					 * Surveille la déconnexion utilisateur
					 */
					$scope.$watch(function() {
						return $localStorage.user;
					}, function(newValue, oldValue) {
						console.log("$scope.connectedUser changed !",
								$localStorage.user);
						if (!$localStorage.user) {
							console.log("user is undefined ! go login");
							$scope.goLogin();
						}
					});

					$scope.checkApplicationExists = function() {
						appService
								.listApplication()
								.then(
										function(response) {
											var applications = response.data;
											console.log(
													"Applications retrieved :",
													applications);
											if (applications.length == 0) {
												$scope.createNewApplication();
											} else {
												appService
														.storeApplication(applications[Object
																.keys(applications)[0]]);
											}
										},
										function(error) {
											console.log("Applications error :",
													error);
										})
					}

					$scope.createNewApplication = function() {
						$ionicModal.fromTemplateUrl(
								'templates/newapplication.html', {
									scope : $scope,
									animation : 'slide-in-up'
								}).then(function(modal) {
							$scope.appModal = modal;
							$scope.appModal.show();
						});
					}

					$scope.getCurrentApplication = function() {
						return appService.getApplication();
					}

				})

		.controller(
				'ApplicationCtrl',
				function($scope, $ionicLoading, appService) {
					$scope.application = {};
					$scope.createApplication = function() {
						if (!$scope.application.name) {
							$scope.popup("Champ manquant !",
									"Le nom de votre cabinet est obligatoire");
							return;
						}
						appService
								.createApplication($scope.application.name)
								.then(
										function(response) {
											console
													.log(
															"Response application créée",
															response.data);
											appService
													.storeApplication(response.data);
											$scope.appModal.hide();
											// $scope.goHome();
										},
										function(error) {
											console
													.log(
															"Response application créée ERROR",
															error);
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
