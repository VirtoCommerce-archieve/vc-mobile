angular.module('virtoshopApp')
// Product detail controller
.controller('productController', ['$scope', '$stateParams', 'workContext', 'searchAPI', 'cartAPI', '$ionicSlideBoxDelegate',
    function ($scope, $stateParams, workContext, searchAPI, cartAPI, $ionicSlideBoxDelegate) {
        var allVariations = [];
        $scope.selectedVariation = { name: $stateParams.name };
        $scope.allVariationPropsMap = {};

        function initialize() {
            searchAPI.getProduct({ id: $stateParams.id }, function (result) {
                //Current product is also a variation (titular)
                allVariations = [result].concat(result.variations);
                $scope.allVariationPropsMap = getFlatternDistinctPropertiesMap(allVariations);

                //Auto select initial product as default variation  (its possible because all our products is variations)
                var propertyMap = getVariationPropertyMap(result);
                _.each(_.keys(propertyMap), function (x) {
                    $scope.checkProperty(propertyMap[x][0])
                });
                $scope.selectedVariation = result;
                $ionicSlideBoxDelegate.update();
            },
              function (error) { console.log(error); });
        }

        //Method called from View when users click one property value
        $scope.checkProperty = function (property) {
            //Select appropriate property and unselect previous selection
            _.each($scope.allVariationPropsMap[property.displayName], function (x) {
                x.selected = x === property;
            });

            //try to find best variation match for selected properties
            $scope.selectedVariation = findVariationBySelectedProps(allVariations, getSelectedPropsMap($scope.allVariationPropsMap));
            $ionicSlideBoxDelegate.update();
        };

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

        function getFlatternDistinctPropertiesMap(variations) {
            var retVal = {};
            _.each(variations, function (variation) {
                var propertyMap = getVariationPropertyMap(variation);
                //merge
                _.each(_.keys(propertyMap), function (x) {
                    retVal[x] = _.uniq(_.union(retVal[x], propertyMap[x]), "value");
                });
            });
            return retVal;
        }

        function findVariationBySelectedProps(variations, selectedPropMap) {
            return _.find(variations, function (x) {
                return comparePropertyMaps(getVariationPropertyMap(x), selectedPropMap);
            });
        }

        function comparePropertyMaps(propMap1, propMap2) {
            return _.every(_.keys(propMap1), function (x) {
                var retVal = propMap2.hasOwnProperty(x);
                if (retVal) {
                    retVal = propMap1[x][0].value == propMap2[x][0].value;
                }
                return retVal;
            });
        };

        function getVariationPropertyMap(variation) {
            return _.groupBy(variation.variationProperties, function (x) { return x.displayName });
        }

        function getSelectedPropsMap(variationPropsMap) {
            var retVal = {};
            _.each(_.keys(variationPropsMap), function (x) {
                var property = _.find(variationPropsMap[x], function (y) {
                    return y.selected;
                });
                if (property) {
                    retVal[x] = [property];
                }
            });
            return retVal;
        }

        initialize();
    }]);