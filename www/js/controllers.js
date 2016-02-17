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
    $scope.name = $stateParams.name;

    //pagination settings
    var pageSettings = $scope.pageSettings = {};
    pageSettings.totalItems = 0;
    pageSettings.currentPage = 1;
    pageSettings.itemsPerPageCount = 20;

    $scope.loadNextPage = function () {
        pageSettings.currentPage++;
        loadDataPage();
    };

    function loadDataPage() {
        searchAPI.getCategoryProducts({
            categoryId: $stateParams.id,
            page: pageSettings.currentPage
            //skip: (pageSettings.currentPage - 1) * pageSettings.itemsPerPageCount,
            //take: pageSettings.itemsPerPageCount
        }, function (productsResult) {
            pageSettings.totalItems = productsResult.totalItemCount;
            if (pageSettings.currentPage === 1) {
                $scope.entries = productsResult.products;
            } else {
                $scope.entries = $scope.entries.concat(productsResult.products);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }, function (error) { console.log(error); });
    }

    loadDataPage();
}])

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', ['$scope', '$ionicHistory', 'authAPI', '$http', function ($scope, $ionicHistory, authAPI,$http) {
    // hide back button in next view
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    

    $scope.login = function () {
        $scope.loginProgress = true;
        $http.post('http://localhost:8100/storefront/Electronics/account/login/', { login: { Email: $scope.user.email, Password: $scope.user.password, rememberMe: true } }).then(
			function (results) {
			    $state.go('home');
			});

        //authAPI.login({ login: { Email: $scope.user.email, Password: $scope.user.password, rememberMe: true } }, function (results) {
        //    // changeAuth(results.data);
        //    $state.go('home');
        //}, function (error) {
        //    // bladeNavigationService.setError('Error ' + error.status, blade);
        //    $scope.loginProgress = false;
        //});
    };

    $scope.user = {};
}]);
