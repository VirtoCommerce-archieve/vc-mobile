/**
 * @author: Duy Thanh DAO
 * @email: success.ddt@gmail.com
 */
angular.module('starter.controllers', [])

// Home controller
.controller('HomeCtrl', function($scope, Product, $ionicNavBarDelegate) {
  // slider images
  $scope.slides = [
    {
      url: 'img/slide_1.jpg'
    },
    {
      url: 'img/slide_2.jpg'
    },
    {
      url: 'img/slide_3.jpg'
    }
  ]
  // list products
  $scope.products = Product.all();
})

// Category controller
.controller('CategoryCtrl', function($scope, Product) {
  $scope.products = Product.all();
})

// Product detail controller
.controller('DetailCtrl', function($scope, Product) {
  $scope.product = Product.get(1);

  // generate array from number
  $scope.range = function(n) {
    return new Array(n);
  };
})

// Cart controller
.controller('CartCtrl', function($scope) {})

// Checkout Controller, process checkout steps here
.controller('CheckoutCtrl', function($scope) {})

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', function($scope, $ionicHistory) {
    // hide back butotn in next view
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
});
