angular.module('virtoshopApp')

// Home controller
.controller('HomeCtrl', ['$scope', 'searchAPI', 'cartAPI', 'workContext', '$ionicNavBarDelegate', function ($scope, searchAPI, cartAPI, workContext, $ionicNavBarDelegate) {
    // slider images
    $scope.slides = [
      { url: 'img/slide_1.jpg' },
      { url: 'img/slide_2.jpg' },
      { url: 'img/slide_3.jpg' }
    ];

    cartAPI.getCart(function (result) {
        $scope.cart = workContext.current.cart = result;
    });

    // list categories
    searchAPI.getCategories({}, function (data) {
        $scope.entries = data.categories;
        // workContext.update(data);
    },
        function (error) { console.log(error); });
    
    $scope.search = { keyword: undefined };
    $scope.searchByKeyword = function () {
        searchAPI.searchProducts({ q: $scope.search.keyword }, function (data) {
            // $scope.entries = data.products;
        },
            function (error) { console.log(error); });
    };
}])

// Category controller
.controller('categoryController', ['$scope', '$stateParams', 'searchAPI', function ($scope, $stateParams, searchAPI) {
    //console.log('CategoryCtrl:' + $stateParams.name);
    $scope.name = $stateParams.name;
    searchAPI.getCategoryProducts({
        categoryId: $stateParams.id,
        skip: 0,
        take: 20
    }, function (productsResult) {
        $scope.entries = productsResult.products;
    },
    function (error) { console.log(error); });
}])

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {
    // hide back button in next view
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
}]);
