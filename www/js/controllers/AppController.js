/**
 * Main app Controller
 */
starter
.controller(
				'AppCtrl',
				function($scope, $state, $ionicPopup, $ionicHistory,
						$ionicModal, $ionicLoading, $cordovaCalendar, $timeout,
						$localStorage, $ionicSideMenuDelegate,$cordovaBadge, appService) {

					

					
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
					 * Open new App page
					 */
					$scope.goAppCreate = function() {
						$ionicHistory.clearHistory();
						$ionicHistory.nextViewOptions({
							disableBack : true,
							disableAnimate : true,
							historyRoot : false
						})
						$ionicHistory.clearCache();
						$ionicHistory.clearHistory();
						console.log("Goto app create");
						$state.go("app.appcreate");
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
					 * Liste les patients existant pour le cabinet
					 * enregistré
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
								
								if (window.cordova) {
									cordova.plugins.notification.badge.registerPermission(function (granted) {
										 $cordovaBadge.set(Math.floor(Math.random() * 100)).then(function() {
											    console.log("Badge OK !");
										  });
									});
								}
								
							
								
								
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

					$scope.checkCabinetExists = function() {
						appService
								.listCabinets()
								.then(
										function(response) {
											var cabinets = response.data.cabinets;
											console.log(
													"Cabinet retrieved :",
													cabinets);
											if (cabinets.length == 0) {
												$scope.createNewCabinet();
											} else {
												appService
														.storeCabinet(cabinets[Object
																.keys(cabinets)[0]]);
											}
										},
										function(error) {
											console.log("Cabinets error :",
													error);
										})
					}

					/**
					 * Create a new app (space)
					 */
					$scope.createNewCabinet = function() {
						$scope.goAppCreate();
					}

					$scope.getCurrentCabinet = function() {
						return appService.getCabinet();
					}

				})