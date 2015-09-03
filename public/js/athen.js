'use strict';

var ngAthen = angular.module('ngAthen', ['ui.router', 'ngResource', 'ngMessages', 'ngLodash']);

ngAthen.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    //@TODO This needs to be completed
    $stateProvider
        .state('Volunteeer', {
            url: '/Volunteer',
            templateUrl: '../templates/volunteer.html',
            controller: 'volunteerCtrl',
            data: {authenticate: false}
        })
        .state('newToApp', {
            url: '/',
            templateUrl: '../templates/login.html',
            data: {authenticate: false}
        })
        .state('login', {
            url: '/login',
            templateUrl: '../templates/login.html',
            data: {authenticate: false}
        })
        .state('logout', {
            url: '/logout',
            controller: 'LogoutController',
            templateUrl: './templates/anon.html',
            data: {authenticate: false}
        })
        .state('register', {
            abstract: true,
            //data: {authenticate: true},
            url: '/register',
            template: '<ui-view/>',
            data: {authenticate: false}
        })
        .state('register.form', {
            url: '/form',
            templateUrl: '/templates/signup.html',
            controller: 'SignUpController'
        })
        .state('register.success', {
            url: '/success',
            templateUrl: '/templates/success.html'
        })
        .state('action', {
            url: '/action',
            templateUrl: '/templates/action.html',
            controller: 'actionController',
            data: {authenticate: true}
        });
}]);

ngAthen.run(['$rootScope', '$state', '$window', function ($rootScope, $state, $window) {
    console.log('Run block!');
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.data.authenticate && $window.sessionStorage.token == undefined) {
            console.log('Should be authenticated! Token: ', $window.sessionStorage.token !== undefined);
            $state.transitionTo('login');
            event.preventDefault();
        }
    });
}]);

ngAthen.factory('ResourceAuthSetup', [function () {
    return function (token) {
        return {
            query: {method: 'GET', headers: {'Authorization': 'Bearer ' + token}, isArray: true},
            get: {method: 'GET', headers: {'Authorization': 'Bearer ' + token}},
            save: {method: 'POST', headers: {'Authorization': 'Bearer ' + token}},
            remove: {method: 'DELETE', headers: {'Authorization': 'Bearer ' + token}},
            delete: {method: 'DELETE', headers: {'Authorization': 'Bearer ' + token}}
        }
    };
}]);

ngAthen.factory('User', ['$resource', function ($resource) {
    console.log("in User factory");
    var map = function (token) {
        return {
            query: {method: 'GET', headers: {'Authorization': 'Bearer ' + token}, isArray: true},
            get: {method: 'GET', headers: {'Authorization': 'Bearer ' + token}},
            fav: {
                method: 'PUT',
                url: '/api/v1/user/favourites/:userid/:id',
                headers: {'Authorization': 'Bearer ' + token},
                params: {id: '@id', userid: '@userid'},
                isArray: true
            },
            getFavs: {
                method: 'GET',
                url: '/api/v1/user/favourites/:userid',
                headers: {'Authorization': 'Bearer ' + token},
                params: {userid: '@userid'},
                isArray: true
            },
            subscribed: {
                method: 'GET',
                url: '/api/v1/user/:id/subscribed',
                params: {id: '@id'},
                isArray: true,
                headers: {'Authorization': 'Bearer ' + token}
            },
            save: {method: 'POST', headers: {'Authorization': 'Bearer ' + token}},
            remove: {method: 'DELETE', headers: {'Authorization': 'Bearer ' + token}},
            delete: {method: 'DELETE', headers: {'Authorization': 'Bearer ' + token}}
        };
    };

    return {
        createRestrictedResource: function (token) {
            return $resource('/api/v1/user/:id', null, map(token));
        }
    }
}]);

ngAthen.factory('Program', ['$resource', 'ResourceAuthSetup', function ($resource, ResourceAuthSetup) {
    //return $resource('/api/v1/program/:id');
    return {
        createRestrictedResource: function (token) {
            return $resource('/api/v1/program/:id', null, ResourceAuthSetup(token));
        }
    }
}]);

ngAthen.factory('Course', ['$resource', 'ResourceAuthSetup', function ($resource, ResourceAuthSetup) {
    //return $resource('/api/v1/course/:id');
    return {
        createRestrictedResource: function (token) {
            return $resource('/api/v1/course/:id', null, ResourceAuthSetup(token));
        }
    }
}]);

ngAthen.controller('firstController',['$scope', '$rootScope', '$window', 'lodash', function ($scope, $rootScope, $window, _) {
    $scope.custs=[{nm:'Dave',ct:'phe'},
        {nm:'Ken', ct:'phe'},
        {nm:'Egg', ct:'phe'},
        {nm:'Cookies', ct:'phe'},
        {nm:'1', ct:'2'},
        {nm:'Apple', ct:'iPhone'}]
}]);

ngAthen.controller('AuthorizationController', ['$scope', '$rootScope', '$window', 'lodash', function ($scope, $rootScope, $window, _) {


    //@TODO Don't add this to the scope
    //@TODO Why are we storing questions in here anyway?
    $scope._user = {};
    console.log('In Authorization Controller: Empty?', _.isEmpty($scope._user));
    //@TODO Really shouldn't be using two-way data binding as events ::(
    $scope._isLoggedIn = false;

    var checkSessionStore = function () {
        console.log('Checking session store for user....');
        if ($window.sessionStorage._user !== undefined) {
            $scope._user = JSON.parse($window.sessionStorage._user);
            $scope._isLoggedIn = true;
            console.log('Reassigned:', $scope._user)
        } else {
            console.log('DEBUG: Nothing in session store.');
        }
    };

    $scope.updateUser = function (data) {
        // Clone data to _user
        $scope._user = _.cloneDeep(data);
        console.log('updateUser', $scope._user);
        // Store in session storage
        $window.sessionStorage._user = JSON.stringify(data);
        $scope._isLoggedIn = true;
    };

    $scope.isLoggedIn = function () {
        return _.isEmpty($scope._user) != true;
    };

    $scope.logout = function () {
        console.log('Logging user \'' + $scope._user.userName + '\' out.');
        delete $window.sessionStorage.token;
        delete $window.sessionStorage._user;
        $scope._isLoggedIn = false;
    };

    $scope.getUserId = function () {
        console.log('getUserId', $scope._user);
        return $scope._user._id;
    };

    $scope.getUser = function () {
        if ($scope.isLoggedIn()) {
            return $scope._user;
        } else {
            return null;
        }
    };

    $scope.getUserHumanName = function () {
        return $scope._user.firstName + ' ' + $scope._user.lastName;
    };

    checkSessionStore();
}]);