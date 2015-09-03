'use strict';
ngAthen.factory('UserUnauth', ['$resource', 'ResourceAuthSetup', function ($resource, ResourceAuthSetup) {
    return {
        createRestrictedResource: function (token) {
            return $resource('/user/:id', null, ResourceAuthSetup(token));
        }
    }
}]);


ngAthen.controller('SignUpController', ['$scope', '$state', '$window', 'UserUnauth', function ($scope, $state, $window, UserUnauth, ProgramUnauth) {
    //@TODO Terms should really be loaded from external resource
    $scope.agreement = 'This is an offer and you cannot refuse';
    $scope.programs = [];
    var enrolled = [],
        _User = UserUnauth.createRestrictedResource($window.sessionStorage.token);

    $scope.submitForm = function (isValid) {
        // Create new user
        //compileCourses();
        if (isValid && checkPassword($scope.formData.password1, $scope.formData.password2)) {
            console.log("VALID");
            console.log('DEBUG', $scope.formData);
            console.log('FormData', $scope.formData);
            _User.save($scope.formData, function (data) {
                console.log('Saved user!', data);
                //@TODO Change state, show success screen!
                $state.go('register.success');
            }, function (err) {
                //@TODO Display user friendly error message in view
                console.log('There was an error, email and or username may already exist.', err);
            });
        } else {
            console.log('DEBUG: Invalid form data.');
        }
    };

    function checkPassword(p1, p2) {
        return p1 === p2;
    }

    function compileCourses() {
    }

}]);