angular.module('virtoshopApp')

// Home controller
.controller('HomeCtrl', ['$scope', 'searchAPI', 'cartAPI', 'workContext', 'virtoshopApp.apiConfig', function ($scope, searchAPI, cartAPI, workContext, apiConfig) {
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
    searchAPI.categoriesSearch({
        sortBy: "Priority",
    }, function (data) {
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
.controller('categoryController', ['$scope', '$stateParams', 'searchAPI', 'virtoshopApp.apiConfig', function ($scope, $stateParams, searchAPI, apiConfig) {
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
        searchAPI.search({
            outline: $stateParams.id,
            page: pageSettings.currentPage
            //skip: (pageSettings.currentPage - 1) * pageSettings.itemsPerPageCount,
            //take: pageSettings.itemsPerPageCount
        }, function (productsResult) {
            pageSettings.totalItems = productsResult.metaData.totalItemCount;
            if (pageSettings.currentPage === 1) {
                $scope.entries = productsResult.products;
            } else {
                $scope.entries = $scope.entries.concat(productsResult.products);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            // request actual prices
            if (_.any(productsResult.products)) {
                var requestParams = _.map(productsResult.products, function (x) {
                    return {
                        catalogId: x.catalogId,
                        categoryId: x.categoryId,
                        id: x.id
                    };
                });

                searchAPI.getActualProductPrices(requestParams, function (prices) {
                    _.each(prices, function (x) {
                        var item = _.findWhere(productsResult.products, { id: x.productId });
                        if (item) {
                            item.price = x;
                        }
                    });
                });
            }
        }, function (error) { $scope.entries = undefined; console.log(error); });
    }

    loadDataPage();
}])

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', ['$scope', '$ionicHistory', 'authAPI', '$http', function ($scope, $ionicHistory, authAPI, $http) {
    // hide back button in next view
    $ionicHistory.nextViewOptions({
        disableBack: true
    });


    $scope.login = function () {
        $scope.loginProgress = true;
        $http.post('http://localhost:8100/storefront/Electronics/account/login/', { email: $scope.user.email, password: $scope.user.password, rememberMe: true }).then(
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
