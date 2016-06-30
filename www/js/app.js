// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive('dontFill', function() {

  return {

    restrict: 'A',

    link: function link(scope, el, attrs) {
      // password fields need one of the same type above it (firefox)
      var type = el.attr('type') || 'text';
      // chrome tries to act smart by guessing on the name.. so replicate a shadow name
      var name = el.attr('name') || '';
      var shadowName = name + '_shadow';
      // trick the browsers to fill this innocent silhouette
      var shadowEl = angular.element('<input type="' + type + '" name="' + shadowName + '" style="display: none">');

      // insert before
      el.parent()[0].insertBefore(shadowEl[0], el[0]);
    }

  };

})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.patients', {
	cache: false,
    url: '/patients',
    views: {
      'menuContent': {
        templateUrl: 'templates/patients.html',
        controller: 'PatientsCtrl'
      }
    }
  })
  .state('app.patientnew', {
	cache: false,
    url: '/patient_new',
    views: {
      'menuContent': {
        templateUrl: 'templates/patient.new.html',
        controller: 'PatientsCtrl'
      }
    }
  })
  .state('app.patientupdate', {
	cache: false,
    url: '/patient_update/:token',
    views: {
      'menuContent': {
        templateUrl: 'templates/patient.new.html',
        controller: 'PatientCtrl'
      }
    }
  })
  .state('app.patient', {
	cache: false,
    url: '/patient/:token',
    views: {
      'menuContent': {
        templateUrl: 'templates/patient.html',
        controller: 'PatientCtrl'
      }
    }
  })
 
  .state('app.login', {
    cache: false,
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.signin.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('app.logincreate', {
    url: '/logincreate',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.create.account.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('app.appcreate', {
    url: '/appcreate',
    views: {
      'menuContent': {
        templateUrl: 'templates/newapplication.html',
        controller: 'ApplicationCtrl'
      }
    }
  })
  
    .state('app.cabinet', {
    url: '/cabinet',
    views: {
      'menuContent': {
        templateUrl: 'templates/cabinet.html',
        controller: 'CabinetCtrl'
      }
    }
  })

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
