/**
 * @author: Duy Thanh DAO
 * @email: success.ddt@gmail.com
 */
angular.module('virtoshopApp.controllers', [])

// Home controller
.controller('HomeCtrl', function ($scope, Product, $ionicNavBarDelegate) {
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
    // list categories
    Product.all({}, function (data) {
        $scope.entries = data.listEntries;
    },
    function (error) { console.log(error); });
})

// Category controller
.controller('CategoryCtrl', function ($scope, $stateParams, Product, virtoshopApp_apiConfig) {
    console.log('CategoryCtrl:' + $stateParams.name);
    $scope.name = $stateParams.name;
    Product.listitemssearch({
        catalog: virtoshopApp_apiConfig.catalogId,
        // category: $stateParams.id,
        category: 'e8be68a46e084ebfaa3d596a95b6077c',
        respGroup: 'withProducts'
    }, function (data) {
        $scope.entries = data.listEntries;
    },
    function (error) { console.log(error); });
})

// Product detail controller
.controller('DetailCtrl', function ($scope, Product) {
    $scope.product = Product.get(1);

    // generate array from number
    $scope.range = function (n) {
        return new Array(n);
    };
})

// Cart controller
.controller('CartCtrl', function ($scope) { })

// Checkout Controller, process checkout steps here
.controller('CheckoutCtrl', function ($scope) {
})

.controller('CheckoutPaymentCtrl', function ($scope, $ionicHistory) {
    // hide back button in next view
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
})

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', function ($scope, $ionicHistory) {
    // hide back button in next view
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
});
