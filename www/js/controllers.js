var starter = angular.module('starter.controllers', ['ngCordova', 'ngStorage'])

.controller('AppCtrl', function($scope,$state,appService, $ionicPopup,$ionicHistory, $ionicModal,$ionicLoading, $timeout) {
	/*
	 * Definition de tous les tools utilisés par le reste des controllers
	 */
	$scope.popup = function(title, text) {
		$ionicPopup.show({
		    template: "<b>" + text + "</b>",
		    title: title,
		    subTitle: '',
		    scope: $scope,
		    buttons: [
		      {
		        text: '<b>Annuler</b>',
		        type: 'button-assertive'
		      }
		    ]
		  })
		
	}
	
	$scope.goHome = function() {
		$ionicHistory.nextViewOptions({
		    disableBack: true
		  });
		$state.go("app.home");
	}
	
	
	$scope.checkUserIsConnected = function() {
		if (!appService.isUserConnected()) {
			$ionicModal.fromTemplateUrl('templates/login.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			  }).then(function(modal) {
			    $scope.loginModal = modal;
			    $scope.loginModal.show();
			  });
		}
	}
	$scope.checkUserIsConnected();
	
	$scope.userIsConnected = function() {
		return appService.isUserConnected();
	}
	
	$scope.logout = function() {
		 appService.removeUser();
		$scope.checkUserIsConnected ();
	}
	
	$scope.checkApplicationExists = function() {
		appService.listApplication().then(
				function(response) {
					var applications = response.data;
					console.log("Applications retrieved :", applications);
					if (applications.length == 0) {
						$scope.createNewApplication();
					} else {
						appService.storeApplication(applications[Object.keys(applications)[0]]);
					}
				},
				function(error) {
					console.log("Applications error :", error);					
				}
		)
	}
	
	$scope.createNewApplication = function() {
		$ionicModal.fromTemplateUrl('templates/newapplication.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.appModal = modal;
		    $scope.appModal.show();
		  });
	}
	
	$scope.getCurrentApplication = function() {
		return appService.getApplication();
	}
	
})

.controller('ApplicationCtrl', function($scope, $ionicLoading, appService) {
	$scope.application = {};
	$scope.createApplication = function() {
		if (!$scope.application.name) {
			$scope.popup("Champ manquant !", "Le nom de votre cabinet est obligatoire");
			return ;
		}
		appService.createApplication($scope.application.name).then(
				function(response) {
					console.log("Response application créée", response.data);
					appService.storeApplication(response.data);
					 $scope.appModal.hide();
					//$scope.goHome();
				},
				function(error) {
					console.log("Response application créée ERROR", error);					
				}
		);
	}
  
})


.controller('HomeCtrl', function($scope, $ionicLoading, appService) {
 
  
})

.controller('PatientsCtrl', function($scope, $state, $ionicLoading, $ionicHistory, appService) {
	
	$scope.newpatient = {};
	$scope.patients = {};
	
	
	$scope.addNewPatient = function() {
		console.log("Add new Patient");
		$state.go("app.patientnew");
	}
	
	/**
	 * Ajoute un nouveau patient
	 */
	$scope.registerNewPatient = function() {
		appService.createPatient($scope.newpatient).then(
				function (response) {
					$ionicLoading.show({
					      template: 'Fiche patient créée !<br /><span class="ion-ios-checkmark-outline larger"></span>'
				    });
					window.setTimeout(function() {
						$scope.listPatients();
						$ionicHistory.goBack();		
						$ionicLoading.hide();
					}, 1000)
				},
				function (error) {
					alert("error" + error);
				}
		);
	}
  
	/**
	 * Liste les patients existant pour l'application enregistrée
	 */
	$scope.listPatients = function() {
		appService.listPatients().then(
				function(response) {
					$scope.patients = response.data.patients;
					$scope.$broadcast('scroll.refreshComplete');
				},
				function(error) {
					alert("erreur pour charger les patients");
					$scope.$broadcast('scroll.refreshComplete');
				}
		);
	}
	
	/**
	 * Ounvre une fiche patient
	 */
	$scope.openPatient = function(token) {
		$state.go('app.patient',{token:token});
	}
	
	$scope.listPatients();
	
})

/**
 * Visualisation d'une fiche patient
 */
.controller('PatientCtrl', function($scope, 
										$state,
										$stateParams, 
										$ionicLoading, 
										$ionicActionSheet,
										$ionicHistory, 
										appService) {
	$scope.patient = {};

	$scope.loadPatient = function(token) {
		appService.loadPatient(token).then(
				function(response) {
					$scope.patient = response.data.patient;
					console.log("Le patient a ete chargé", $scope.patient);
					
				},
				function(error) {
					alert("error load patient");				
				}
			);
	}
	$scope.loadPatient($stateParams.token);
	
	$scope.modifyPatient = function() {
		 // Show the action sheet
		   var hideSheet = $ionicActionSheet.show({
		     buttons: [
		       { text: 'Modifier' },
		       { text: 'Ajouter un commentaire' },
		       { text: 'Ajouter une ordonnance' },
		     ],
		     destructiveText: 'Supprimer',
		     titleText: 'Fiche patient',
		     cancelText: 'Annuler',
		     cancel: function() {
		          // add cancel code..
		        },
		     buttonClicked: function(index) {
		       return true;
		     }
		   });

	}
})

/**
 * Login Controller
 */
.controller('LoginCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicModal, appService) {
  console.log("Login Controller");
  
  $scope.user = {};
  $scope.newuser = {};

  $scope.user.email = "";
  $scope.user.password = "";

  $scope.newuser.email = "";
  $scope.newuser.password = "";
  $scope.newuser.passwordAgain = "";
  
  /**
   * Ouvre la modal pour la création de compte
   */
  $scope.openCreateAccountModal = function() {
	  $scope.loginModal.hide();
	  $ionicModal.fromTemplateUrl('templates/create_account.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.loginModal = modal;
		    $scope.loginModal.show();
		  });
  }
  
  
  /**
   * Creation d'un nouveau compte
   */
  $scope.createAccount = function() {
	  $ionicLoading
		.show({
			template : "Creation de votre comtpe...<br /><ion-spinner icon='spiral' class='spinner-energized' ></ion-spinner>"
		});
	  
	  appService.signInWithEmail($scope.newuser.email, $scope.newuser.password).then(
			  function(response) {
				  $ionicLoading.hide();
				  if (response.data.error) {
					  $scope.popup("Impossible de se connecter", "Vérifiez votre email/mot de passe.");
					  
					  alert(response.data.error);
					  return ;
				  }
				  appService.storeUser(response.data.utilisateur);
				  $scope.loginModal.hide();
				  // check if new user have at least one application
				  $scope.checkApplicationExists();
			  },
			  function (error) {
				  alert(error);
				  $ionicLoading.hide();
			  }
	  );
  }
  
  $scope.login = function() {
	  $ionicLoading
		.show({
			template : "Connexion...<br /><ion-spinner icon='spiral' class='spinner-energized' ></ion-spinner>"
		});
	  
	  appService.loginWithEmail($scope.user.email, $scope.user.password).then(
			  function(response) {
				  $ionicLoading.hide();
				  if (response.data.error) {
					  $scope.popup("Impossible de se connecter", "Vérifiez votre email/mot de passe.");
					  console.log("Erreur lors du login", response.data.error);
					  return ;
				  }
				  appService.storeUser(response.data.utilisateur);
				  $scope.loginModal.hide();
				  // check if new user have at least one application
				  $scope.checkApplicationExists();
			  },
			  function (error) {
				  console.log("Erreur technique !", error);
				  $scope.popup("Impossible de se connecter", "Veuillez rééssayer dans quelques moments !");
				  $ionicLoading.hide();
			  }
	  );
  }
  
  
})

