/**
 * Visualisation d'une fiche patient
 */
starter
	.controller(
		'PatientCtrl',
		function($scope, $state, $stateParams, $ionicLoading,
			$ionicActionSheet, $ionicHistory, $ionicModal,
			$ionicPopup, $cordovaCamera, $cordovaFileTransfer,
			appService) {
		    // permet de stocker la fiche patient pour l'affichage ou
		    // l'edition
		    $scope.patient = {};
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

		    $scope.loadPatient = function(token) {
			appService
				.loadPatient(token)
				.then(
					function(response) {
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

					}, function(error) {
					    alert("error load patient");
					});
		    }
		    $scope.loadPatient($stateParams.token);

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
				return true;
			    }
			});
		    }

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

		    $scope.getOrdonnancePicture = function(fileToken) {
			return appService.getOrdonnancePictureURL(fileToken);
		    }

		    $scope.saveOrdonnance = function() {
			if (!$scope.ordonnance.dateDebut) {
			    $ionicPopup
				    .alert({
					title : "Champ manquant",
					template : "La date de début d'ordonnance doit être renseignée"
				    });
			    return;
			}

			if (!$scope.ordonnance.dateFin) {
			    $ionicPopup
				    .alert({
					title : "Champ manquant",
					template : "La date de fin d'ordonnance ou le nombre de jours doivent être renseignés"
				    });
			    return;
			}
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

									$scope.ordonnanceModal
										.hide();

								    },
								    function(
									    error) {
									console
										.log("Received defered error from ordonnance service");

									$scope.ordonnanceModal
										.hide();

								    });
						} else {
						    $ionicLoading.hide();
						    $scope.ordonnanceModal
							    .hide();
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

		    $scope.takePic = function() {
			var options = {
			    quality : 50,
			    destinationType : Camera.DestinationType.FILE_URI,
			    sourceType : 1, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
			    encodingType : 0
			// 0=JPG 1=PNG
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
