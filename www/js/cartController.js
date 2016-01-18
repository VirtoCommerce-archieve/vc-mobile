angular.module('virtoshopApp')
// cart detail Controller
.controller('cartController', ['$scope', '$timeout', 'workContext', 'cartAPI', function ($scope, $timeout, workContext, cartAPI) {
    var timer;
    $scope.cart = workContext.current.cart;

    $scope.changeLineItem = function (lineItem, origQty) {
        $timeout.cancel(timer);
        timer = $timeout(function () {
            $scope.isUpdating = true;
            cartAPI.changeLineItem({ lineItemId: lineItem.id, quantity: lineItem.quantity }, null, function () {
                refreshCart();
            },
            function (response) {
                lineItem.quantity = origQty;
                showErrorMessage(2000);
            });
        }, 200);
    }

    $scope.generateQuantitiesRange = function (seedQuantity) {
        var retval = [];
        var start = Math.max(seedQuantity - 2, 1);
        for (var index = 0; index < 5; index++) {
            retval.push(start + index);
        }
        return retval;
    };

    $scope.removeLineItem = function (lineItemId) {
        var lineItem = _.findWhere($scope.cart.items, { id: lineItemId });
        if (lineItem) {
            var initialItems = angular.copy($scope.cart.items);
            $scope.cart.items = _.without($scope.cart.items, lineItem);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                $scope.isUpdating = true;
                cartAPI.removeLineItem({ lineItemId: lineItemId }, null, function (result) {
                    workContext.current.cart.itemsCount = result.itemsCount;
                    refreshCart();
                },
                function (response) {
                    $scope.cart.items = initialItems;
                    showErrorMessage(2000);
                });
            }, 200);
        }
    };


    function initialize() {
        $scope.isUpdating = false;
        $scope.errorOccured = false;
        refreshCart();
    }

    function refreshCart() {
        cartAPI.getCart(function (result) {
            angular.copy(result, workContext.current.cart);
            $scope.cart = workContext.current.cart;

            //$scope.isUpdating = false;
            //$scope.errorOccured = false;
        });
    }

    initialize();
}])
;