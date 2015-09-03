'use strict';

ngAthen.factory('Action', ['$resource', function ($resource) {
    var map = function (token) {
        console.log('TOKEN: ', token);
        return {
        query: {method: 'GET', headers: {'Authorization': 'Bearer ' + token}, isArray: true},
            get: {method: 'GET', headers: {'Authorization': 'Bearer ' + token}, params: {item: '@item'}},
            post: {method: 'POST', headers: {'Authorization': 'Bearer ' + token}},
            edit: {method: 'PUT', headers: {'Authorization': 'Bearer ' + token}},
            remove: {method: 'DELETE', headers: {'Authorization': 'Bearer ' + token}},
            delete: {method: 'DELETE', headers: {'Authorization': 'Bearer ' + token}}
        };
    };
    console.log("in action factory");
    return {
        createRestrictedResource: function (token) {
            console.log("Inside and before the return");
            console.log("Does anyone know this token " + token);
            return $resource('/api/v1/test/:id', null, map(token));
        }
    }
}]);

ngAthen.controller('actionController', ['$scope', '$state', '$window', 'Action', function($scope, $state, $window, Action){
    console.log('I am action');
    alert('I am an action');
    $scope.error = false;
    var _food = Action.createRestrictedResource($window.sessionStorage.token);

    $scope.submit = function () {
        var formData = {};
        var newItem = new _food();
        //newItem.food
        //newItem.user


        console.log(_food);

        console.log('FormData', $scope.formData);
        _food.post($scope.formData, function(){
            //console.log('DEBUG',  );

        }, function(err){
            console.log('FAILING');
            console.log('ERROR:', err);
            $scope.error = true;
        });

        //if (isValid && checkPassword($scope.formData.password1, $scope.formData.password2)) {
        //    console.log("VALID");
        //    console.log('DEBUG', $scope.formData);
        //    console.log('FormData', $scope.formData);
        //    _User.save($scope.formData, function (data) {
        //        console.log('Saved user!', data);
        //        //@TODO Change state, show success screen!
        //        $state.go('register.success');
        //    }, function (err) {
        //        //@TODO Display user friendly error message in view
        //        console.log('There was an error, email and or username may already exist.', err);
        //    });
        //} else {
        //    console.log('DEBUG: Invalid form data.');
        //}
    };
}]);

ngAthen.directive('action', function(){
    return {
        restrict: 'E',
        templateUrl: 'js/action/action.html',
        controller: 'actionController'
    };
});