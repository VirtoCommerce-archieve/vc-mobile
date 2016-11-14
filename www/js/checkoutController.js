angular.module('virtoshopApp')
// Checkout address step
.controller('checkoutAddressController', ['$scope', '$state', 'filterFilter', 'cartAPI', 'workContext', function ($scope, $state, filterFilter, cartAPI, workContext) {
    $scope.checkout = workContext.current.checkout = { countries: [], countryRegions: [], selectedRegions: [] };

    $scope.searchCountries = function (query, isInitializing) {
        return filterFilter($scope.checkout.countries, query);
    };

    $scope.selectCountry = function (callback) {
        $scope.checkout.shipment.deliveryAddress.countryName = callback.item.name;
        $scope.checkout.shipment.deliveryAddress.countryCode = callback.item.code3;
        $scope.checkout.shipment.deliveryAddress.regionName = null;
        $scope.checkout.shipment.deliveryAddress.regionId = null;
        $scope.checkout.selectedRegions = [];
        getCountryRegions(callback.item.code3);
    };

    $scope.setCountry = function (address) {
        var country = _.findWhere($scope.checkout.countries, { name: address.countryName });
        if (country) {
            address.countryCode = country.code3;
            address.regionName = null;
            address.regionId = null;

            getCountryRegions(country.code3);
        }
    };

    $scope.searchRegions = function (query, isInitializing) {
        if (isInitializing) {
            return []
        } else {
            return filterFilter($scope.checkout.countryRegions, query);
        }
    };

    $scope.selectRegion = function (callback) {
        $scope.checkout.shipment.deliveryAddress.regionName = callback.item.name;
        $scope.checkout.shipment.deliveryAddress.regionId = callback.item.code;
    };

    $scope.setCountryRegion = function (address) {
        var countryRegion = _.findWhere($scope.checkout.countryRegions, { name: address.regionName });
        if (countryRegion) {
            address.regionId = countryRegion.code;
        }
    };

    $scope.selectAddress = function (addressType) {
    }

    $scope.submitStep = function () {
        $scope.checkout.shippingAddressProcessing = true;
        $scope.checkout.shipment.validationErrors = undefined;
        cartAPI.addOrUpdateShipment($scope.checkout.shipment, function () {
            $scope.checkout.shippingAddressProcessing = false;
            $scope.checkout.shippingMethodProcessing = false;
            $state.go('checkout_shipping');
        }, function (error) { $scope.checkout.shippingAddressProcessing = false; });
    }

    function initialize() {
        // getCurrentCustomer();
        getCountries();
        getCart();
    }

    function getCart() {
        $scope.checkout.shippingAddressProcessing = false;
        cartAPI.getCart(function (cart) {
            var shipment = $scope.checkout.shipment = _.last(cart.shipments) || {};
            shipment.deliveryAddress = shipment.deliveryAddress || { type: 'Shipping' };

            $scope.checkout.id = cart.id;
            $scope.checkout.lineItems = cart.items;
            $scope.checkout.coupon = cart.coupon;
            if (cart.hasPhysicalProducts) {
                setShippingAddress(cart);
            } else {
                $state.go('checkout_payment');
            }
        });
    }

    function getCountries() {
        cartAPI.getCountries(function (results) {
            // only valid countries
            $scope.checkout.countries = _.filter(results, function (x) { return x.code3; });
        });
    }

    function getCountryRegions(countryCode) {
        $scope.checkout.countryRegions = countryCode ? cartAPI.getCountryRegions({ countryCode: countryCode }) : [];
    }

    function setShippingAddress(cart) {
        if (!$scope.checkout.shipment.deliveryAddress) {
            var addresses = _.union(cart.addresses, cart.customer.addresses);
            var found = _.find(addresses, function (x) { return x.type.toLowerCase() === 'shipping' });
            if (!found) {
                found = _.find(addresses, function (x) { return x.type.toLowerCase().indexOf('shipping') !== -1 });
            }
            if (!found) {
                found = _.first(addresses);
            }

            if (found) {
                $scope.checkout.shipment.deliveryAddress = angular.copy(found);

                if ($scope.checkout.shipment.deliveryAddress.countryCode) {
                    getCountryRegions($scope.checkout.shipment.deliveryAddress.countryCode);
                }
            }
        }
    }

    initialize();
}])

    // Checkout shippingMethod step
.controller('checkoutShippingController', ['$scope', '$state', 'cartAPI', 'workContext', function ($scope, $state, cartAPI, workContext) {
    $scope.checkout = workContext.current.checkout;

    $scope.submitStep = function () {
        $scope.checkout.shippingMethodProcessing = true;
        $scope.checkout.shipment.shipmentMethodCode = $scope.checkout.selectedShippingMethod.shipmentMethodCode;
        $scope.checkout.shipment.shipmentMethodOption = $scope.checkout.selectedShippingMethod.optionName;
        $scope.checkout.shipment.validationErrors = undefined;
        cartAPI.addOrUpdateShipment($scope.checkout.shipment, function () {
            $state.go('checkout_payment');
        }, function () { $scope.checkout.shippingMethodProcessing = false; });
    };

    function initialize() {
        $scope.checkout.shippingMethodProcessing = false;
        cartAPI.getCart(function (cart) {
            $scope.checkout.shipment = _.last(cart.shipments);

            cartAPI.getAvailableShippingMethods({ shipmentId: $scope.checkout.shipment.id }, function (availableShippingMethods) {
                $scope.checkout.availableShippingMethods = availableShippingMethods;
                if (availableShippingMethods.length == 1) {
                    $scope.checkout.selectedShippingMethod = availableShippingMethods[0];
                } else if ($scope.checkout.shipment.shipmentMethodCode) {
                    $scope.checkout.selectedShippingMethod = _.findWhere(availableShippingMethods, { shipmentMethodCode: $scope.checkout.shipment.shipmentMethodCode, optionName: $scope.checkout.shipment.shipmentMethodOption });
                }
            });
        });
    }

    initialize();
}])

    // Checkout Payment step
.controller('checkoutPaymentController', ['$scope', '$state', 'cartAPI', 'workContext', '$ionicHistory', function ($scope, $state, cartAPI, workContext, $ionicHistory) {
    $scope.checkout = workContext.current.checkout;

    $scope.createOrder = function () {
        $scope.checkout.loading = true;
        var payment = {
            paymentGatewayCode: $scope.checkout.paymentMethodCode,
            amount: $scope.checkout.cart.total
        };
        cartAPI.addOrUpdatePayment(payment).$promise
            .then(function () {
                return cartAPI.createOrder($scope.checkout.bankCardInfo).$promise;
            })
            .then(function (data) {
                handlePostPaymentResult(data.orderProcessingResult, data.order.number);
            })
            //.catch(function (error) {
            //    console.log("An error occurred: " + error);
            //})
            .finally(function () {
                $scope.checkout.loading = false;
            });
    }

    function initialize() {
        $scope.checkout.bankCardInfo = {};
        //getCurrentCustomer();
        //getCountries();
        getAvailablePaymentMethods();
        getCart();
    }

    function getAvailablePaymentMethods() {
        cartAPI.getAvailablePaymentMethods(function (availablePaymentMethods) {
            $scope.checkout.availablePaymentMethods = availablePaymentMethods;
            if (availablePaymentMethods.length === 1) {
                $scope.checkout.paymentMethodCode = availablePaymentMethods[0].code;
            }
        });
    }

    function getCart() {
        cartAPI.getCart(function (cart) {
            $scope.checkout.cart = cart;
        });
    }

    function handlePostPaymentResult(paymentProcessingResult, orderNumber) {
        if (!paymentProcessingResult.isSuccess) {
            return;
        }

        // hide back button in next view
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        workContext.current.cart.items = [];
        workContext.current.cart.itemsCount = 0;
        workContext.current.checkout.orderNumber = orderNumber;
        $state.go('checkout_thanks');

    }

    initialize();
}])

.controller('checkoutThanksController', ['$scope', 'workContext', '$ionicHistory', function ($scope, workContext, $ionicHistory) {
    $scope.checkout = workContext.current.checkout;

    $ionicHistory.nextViewOptions({
        disableBack: true
    });
}]);