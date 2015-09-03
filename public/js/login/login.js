'use strict';

ngAthen.factory('Login', ['$resource', function ($resource) {
    console.log("in Login factory");
    console.log($resource('/login'));
    return $resource('/login');
}]);

ngAthen.controller('LoginController', ['$scope', '$state', '$window', 'User', 'Login', function($scope, $state, $window, User, Login){
   // alert("I'm in");
    console.log('Some kind of loginderful');
    $scope.error = false;
    $scope.login = function() {
        //alert("Press");
        var formData = {};
        //@TODO Need to do basic form validation
        formData.username = $scope.username;
        formData.password = $scope.password;

        console.log(formData.username);
        console.log(formData.password);

        Login.save(formData, function(data){
            console.log('DEBUG', data);
            $window.sessionStorage.token = data.token;
            $scope.updateUser(data.user);
            $scope.error = false;
            console.log("GO to Action");
            $state.go('action');
        }, function(err){
            console.log('ERROR:', err);
            $scope.error = true;
            delete $window.sessionStorage.token;
        });
    }
}]);

ngAthen.controller('LogoutController', ['$scope', '$state', function($scope, $state){
    $scope.logout();
    //$state.go('anon');
}]);

ngAthen.directive('login', function(){
    return {
        restrict: 'E',
        templateUrl: 'js/login/login.html',
        controller: 'LoginController'
    };
});