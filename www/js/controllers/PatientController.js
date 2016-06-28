/**
 * Visualisation d'une fiche patient
 */
starter
		.controller(
				'PatientCtrl',
				function($scope, $state, $stateParams, $ionicLoading,
						$ionicActionSheet, $ionicHistory, $ionicModal,
						$ionicPopup, $cordovaCamera, $cordovaFileTransfer,$ionicPopover,
						appService) {
					// permet de stocker la fiche patient pour l'affichage ou
					// l'edition
					$scope.patient = {};
					$scope.patient.actif = true;

					// permet de stocker l'ordonnance avant la sauvegarde
					$scope.ordonnance = {};
					// premet de récupérer les ordonnances
					$scope.ordonnances = {};

					// si le nombre de jours (dans l'ordonnance
					$scope.$watch('ordonnance.nombreJours', function(newValue,
							oldValue) {
						var dateDebut = new Date($scope.ordonnance.dateDebut);
						var dateFin = new Date();
						console.log("Found date", dateDebut);
						dateFin.setDate(dateDebut.getDate()
								+ $scope.ordonnance.nombreJours);
						console.log(dateFin);
						$scope.ordonnance.dateFin = dateFin;
					});

					/**
					 * Ounvre une fiche patient
					 */
					$scope.openPatientUpdate = function() {
						console.log("Token for patient = "
								+ $scope.patient.token
								+ "go to patient open udpate");
						$state.go('app.patientupdate', {
							token : $scope.patient.token
						});
					}
					/**
					 * Ajoute un nouveau patient
					 */
					$scope.updatePatient = function() {
						appService
								.updatePatient($scope.patient)
								.then(
										function(response) {
											$ionicLoading
													.show({
														template : 'Fiche patient mise à jour !<br /><span class="ion-ios-checkmark-outline larger"></span>'
													});
											window.setTimeout(function() {
												$ionicLoading.hide();
												$scope.patient = {};
												$ionicHistory.goBack();
											}, 1000)
										}, function(error) {
											alert("error" + error);
										});
					}

					/**
					 * Charge un patient
					 */
					$scope.loadPatient = function(token) {
						appService
								.loadPatient(token)
								.then(
										function(response) {
											$scope.$broadcast('scroll.refreshComplete');
											$scope.patient = response.data.patient;
											console.log(
													"Le patient a ete chargé avec le token "
															+ token,
													$scope.patient);
											appService
													.listOrdonnances(token)
													.then(
															function(response) {
																$scope.ordonnances = response.data.ordonnances;
																console
																		.log(
																				"ordonnances trouvées ",
																				$scope.ordonnances);
															},
															function(error) {
																alert("impossible de récupérer les ordonnances");
															});

											appService.listCommentaires(token).then(
													function(response) {
														$scope.commentaires = response.data.commentaires;
														console
																.log(
																		"Commentaires trouvées ",
																		$scope.commentaires);
													},
													function(error) {
														alert("impossible de récupérer les commentaires");
													});
											
											
										}, function(error) {
											$scope.$broadcast('scroll.refreshComplete');
											alert("error load patient");
										});
					}
					$scope.loadPatient($stateParams.token);

					/**
					 * Modifie un patient
					 */
					$scope.modifyPatient = function() {
						// Show the action sheet
						var hideSheet = $ionicActionSheet.show({
							buttons : [ {
								text : 'Modifier'
							}, {
								text : 'Ajouter un commentaire'
							}, {
								text : 'Ajouter une ordonnance'
							}, ],
							destructiveText : 'Supprimer',
							titleText : 'Fiche patient',
							cancelText : 'Annuler',
							cancel : function() {
								// add cancel code..
							},
							buttonClicked : function(index) {
								if (index == 0) {
									$scope.openPatientUpdate();
								} else if (index == 1) {
									$scope.addCommentaire ();
								} else if (index == 2) {
									$scope.openNewOrdonnance();
								}
								
								return true;
							}
						});
					}

					/**
					 * Ouvre la modale pour la création d'ordonnance
					 */
					$scope.openNewOrdonnance = function() {
						$ionicModal.fromTemplateUrl(
								'templates/ordonnance.html', {
									scope : $scope,
									animation : 'slide-in-up'
								}).then(function(modal) {
							$scope.ordonnanceModal = modal;
							$scope.ordonnanceModal.show();
						});
					}

					
					/**
					 * Ouvre la modale pour la création d'ordonnance
					 */
					$scope.openVisuOrdonnance = function(ordonnance) {
						$scope.ordonnance = ordonnance;
						$ionicModal.fromTemplateUrl(
								'templates/ordonnance_visu.html', {
									scope : $scope,
									animation : 'slide-in-up'
								}).then(function(modal) {
							$scope.ordonnanceVisuModal = modal;
							$scope.ordonnanceVisuModal.show();
						});
					}

					$scope.closeVisuOrdonnance = function() {
						$scope.ordonnanceVisuModal.hide();
					}
					
					$scope.removeOrdonnance = function() {
						$scope.popup("Confirmez", "Voulez vous vraiment supprimer cette ordonnance ?");
					}
					
					$scope.getOrdonnancePicture = function(fileToken) {
						return appService.getOrdonnancePictureURL(fileToken);
					}

					
					
					
					$scope.saveOrdonnance = function() {
						console.log(">>>>> saving ordonnance......");
						console.log("$scope.ordonnance.dateFin ",
								$scope.ordonnance.dateFin);
						console.log("$scope.ordonnance.dateDebut ",
								$scope.ordonnance.dateDebut);
						
						if (!$scope.ordonnance.dateDebut || !isFinite($scope.ordonnance.dateDebut)) {
							$ionicPopup
									.alert({
										title : "Champ manquant",
										template : "La date de début d'ordonnance doit être renseignée"
									});
							return;
						}

						if (!$scope.ordonnance.dateFin || !isFinite($scope.ordonnance.dateFin)) {
							$ionicPopup
									.alert({
										title : "Champ manquant",
										template : "La date de fin d'ordonnance ou le nombre de jours doivent être renseignés"
									});
							return;
						}
						
						
						if (!$scope.picData) {
							$ionicPopup.confirm({
							     title: 'Attention',
							     template: 'Etes vous sûr de ne pas associer de photo à cette ordonnance ?'
							   }).then(function(res) {
							     if(res) {
							    	 $scope.saveOrdonnanceServer();
							     } else {
							      return ;
							     }
							});
						} else {
							$scope.saveOrdonnanceServer();
						}
						
					}
					
					
					$scope.addCommentaire = function() {
						// An elaborate, custom popup
						$scope.commentaire = {};
						
						$ionicModal.fromTemplateUrl(
								'templates/commentaire.html', {
									scope : $scope,
									animation : 'slide-in-up'
								}).then(function(modal) {
							$scope.commentaireModal = modal;
							$scope.commentaireModal.show();
						});
						
					
						  
					}
					
				$scope.saveCommentaire = function() {
					appService.saveCommenaitre($scope.commentaire.texte, $scope.patient.token).then(
							function(response) {
								if (response.data.error) {
									$scope.popup("Erreur", "Impossible de sauvegarder le commentaire suite à une erreur serveur : " + response.data.error);
								} else {
									$ionicLoading
									.show({
										template : 'Commenaitre ajouté !<br /><span class="ion-ios-checkmark-outline larger"></span>'
									});
									$scope.loadPatient($scope.patient.token);
									window.setTimeout(
											function() {
												$ionicLoading.hide();
												$scope.exitCommentaire();
											},
											1000
									);
								}
							},
							function(error) {
								$scope.popup("Erreur", "Impossible de sauvegarder le commentaire suite à une erreur serveur.");
							}
					);
				}
					
					
					
					$scope.saveOrdonnanceServer = function() {
						appService
						.saveOrdonnance($scope.ordonnance,
								$scope.patient.token)
						.then(
								// success
								function(response) {
									console.log("Saving ordonnance...");
									if (!response.data.error) {
										$scope.ordonnance.token = response.data.ordonnance.token;
										console
												.log("Save success with token "
														+ response.data.ordonnance.token);
										console
												.log("Uploading file...");

										if ($scope.picData) {
											appService
													.saveOrdonnancePicture(
															$scope.ordonnance.token,
															$scope.picData)
													.then(
															function(
																	success) {
																console
																		.log("Received defered succes from ordonnance service");

																$scope.ordonnanceModal.hide();
																$scope.loadPatient($scope.patient.token);
															},
															function(
																	error) {
																console
																		.log("Received defered error from ordonnance service");
																$scope.ordonnanceModal.hide();
																$scope.loadPatient($scope.patient.token);
															});
										} else {
											$ionicLoading.hide();
											$scope.ordonnanceModal.hide();
											$scope.loadPatient($scope.patient.token);
										}
									} else {
										alert("erreur:  "
												+ response.data.error);
									}
								},
								// error
								function(error) {
									alert("erreur:  " + error);
								});
					}
					

					$scope.exitOrdonnance = function() {
						$scope.ordonnanceModal.hide();
					}
					
					$scope.exitCommentaire = function() {
						$scope.commentaireModal.hide();
					}

					$scope.takePic = function() {
						var options = {
							quality : 80,
							destinationType : Camera.DestinationType.FILE_URI,
							sourceType : 1, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
							encodingType : 0, // 0=JPG 1=PNG,
							targetWidth : 1000
						}
						navigator.camera.getPicture(onSuccess, onFail, options);
					}
					var onSuccess = function(FILE_URI) {
						console.log(FILE_URI);
						$scope.picData = FILE_URI;
						$scope.$apply();
					};
					var onFail = function(e) {
						console.log("On fail " + e);
					};

				})
