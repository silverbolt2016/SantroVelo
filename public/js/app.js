var santroVeloApp = angular.module('santroVelo', []);

var basePath = 'https://santro-velo.herokuapp.com';

santroVeloApp.controller('MainController', function ($scope, $http) {
  $scope.members = [];

  $scope.getPhoneString = getPhoneString;
  $scope.getValidString = getValidString;
  $scope.getDateString = getDateString;
  $scope.addMember = addMember;
  $scope.addMemberDetails = {};

  getMembers();

  function getMembers() {
    $http.get(basePath + '/users').
      success(function(data, status, headers, config) {
        
        data.message.forEach(function(elem, index) {
          elem.datejoinedString = getDateString(elem.datejoined);
          elem.validString = getValidString(elem.valid);
          elem.phoneString = getPhoneString(elem.phone);
        });

        $scope.members = data.message;
      }).
      error(function(data, status, headers, config) {

      });
  }

  function getPhoneString(phoneNumber) {
    var phoneString = '';

    phoneString += '(' + phoneNumber.substring(0, 3) + ')';
    phoneString += ' ' + phoneNumber.substring(3, 6);
    phoneString += '-' + phoneNumber.substring(6, 10);
    return phoneString;
  }

  function getValidString(validBoolean) {
    if (validBoolean == true) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  function getDateString(dateObject) {
    var date = new Date(dateObject);
    return date.toLocaleDateString();
  }

  function addMember(isValid) {
    if (isValid) {
      alert('vaild');
    }
    console.log($scope.addMemberDetails)
  }
});