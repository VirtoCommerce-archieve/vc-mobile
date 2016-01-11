angular.module('virtoshopApp')
// Product detail controller
.controller('productController', ['$scope', '$stateParams', 'workContext', 'searchAPI', 'cartAPI', '$ionicSlideBoxDelegate',
    function ($scope, $stateParams, workContext, searchAPI, cartAPI, $ionicSlideBoxDelegate) {
        $scope.selectedVariation = { name: $stateParams.name };


        searchAPI.getProduct({ id: $stateParams.id }, function (result) {
            $scope.selectedVariation = result;
            $ionicSlideBoxDelegate.update();
        },
          function (error) { console.log(error); });

        $scope.addToCart = function (productId, quantity) {
            var cart = workContext.current.cart;
            //var initialItems = angular.copy(cart.items);
            //$scope.isCartModalVisible = true;
            //$scope.isUpdating = true;
            cartAPI.addLineItem({ id: productId, quantity: quantity }, null, function (result) {
                workContext.current.cart.itemsCount = result.itemsCount;
                // console.log("addLineItem:" + response);
                // refreshCart();
            },
                function (error) {
                    //$scope.cart.items = initialItems;
                    showErrorMessage(2000);
                });
        };


        // generate array from number
        $scope.range = function (n) {
            return new Array(n);
        };
    }])
;