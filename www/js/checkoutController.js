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
            var shipment = $scope.checkout.shipment = _.last(cart.shipments) ? _.last(cart.shipments) : {};
            shipment.deliveryAddress = shipment.deliveryAddress || { deliveryAddress: { type: 'Shipping' } };

            $scope.checkout.id = cart.id;
            $scope.checkout.lineItems = cart.items;
            $scope.checkout.coupon = cart.coupon;
            $scope.checkout.hasPhysicalProducts = cart.hasPhysicalProducts;
            if ($scope.checkout.hasPhysicalProducts) {
                getShippingAddress(cart.defaultShippingAddress);
            }
            if (!$scope.checkout.hasPhysicalProducts) {
                $state.go('checkout_payment');
            }
            $scope.checkout.hasCustomerInformation = checkAddress(shipment.deliveryAddress, _.any($scope.checkout.countryRegions));
        });
    }

    function getCountries() {
        $scope.checkout.countries = cartAPI.getCountries();
    }

    function getCountryRegions(countryCode) {
        // $scope.checkout.selectedCountry = _.find($scope.checkout.countries, function (c) { return c.code3 == countryCode });
        cartAPI.getCountryRegions({ countryCode: countryCode }, function (results) {
            $scope.checkout.countryRegions = results || [];
        });
    }

    function getShippingAddress(cartAddress) {
        //$scope.checkout.shipment.deliveryAddress.email = $scope.checkout.shipment.deliveryAddress.email || $scope.customer.email || cartAddress.email;
        $scope.checkout.shipment.deliveryAddress.email = $scope.checkout.shipment.deliveryAddress.email || cartAddress.email;
        $scope.checkout.shipment.deliveryAddress.firstName = $scope.checkout.shipment.deliveryAddress.firstName || cartAddress.firstName;
        $scope.checkout.shipment.deliveryAddress.lastName = $scope.checkout.shipment.deliveryAddress.lastName || cartAddress.lastName;
        $scope.checkout.shipment.deliveryAddress.organization = $scope.checkout.shipment.deliveryAddress.organization || cartAddress.organization;
        $scope.checkout.shipment.deliveryAddress.line1 = $scope.checkout.shipment.deliveryAddress.line1 || cartAddress.line1;
        $scope.checkout.shipment.deliveryAddress.line2 = $scope.checkout.shipment.deliveryAddress.line2 || cartAddress.line2;
        $scope.checkout.shipment.deliveryAddress.city = $scope.checkout.shipment.deliveryAddress.city || cartAddress.city;
        $scope.checkout.shipment.deliveryAddress.countryCode = $scope.checkout.shipment.deliveryAddress.countryCode || cartAddress.countryCode;
        $scope.checkout.shipment.deliveryAddress.countryName = $scope.checkout.shipment.deliveryAddress.countryName || cartAddress.countryName;
        $scope.checkout.shipment.deliveryAddress.regionId = $scope.checkout.shipment.deliveryAddress.regionId || cartAddress.regionId;
        $scope.checkout.shipment.deliveryAddress.regionName = $scope.checkout.shipment.deliveryAddress.regionName || cartAddress.regionName;
        $scope.checkout.shipment.deliveryAddress.postalCode = $scope.checkout.shipment.deliveryAddress.postalCode || cartAddress.postalCode;
        $scope.checkout.shipment.deliveryAddress.phone = $scope.checkout.shipment.deliveryAddress.phone || cartAddress.phone;
        if ($scope.checkout.shipment.deliveryAddress.countryCode) {
            getCountryRegions($scope.checkout.shipment.deliveryAddress.countryCode);
        }
        // selectAddress('Shipping');
    }

    function checkAddress(address, provinceRequired) {
        var isValid = false;
        if (address.email && address.firstName && address.lastName && address.line1 &&
            address.city && address.countryCode && address.countryName && address.postalCode) {
            if (!provinceRequired || provinceRequired && address.regionId && address.regionName) {
                isValid = true;
            }
        }
        return isValid;
    }

    initialize();
}])

    // Checkout Shipping step
.controller('checkoutShippingController', ['$scope', '$state', 'cartAPI', 'workContext', function ($scope, $state, cartAPI, workContext) {
    $scope.checkout = workContext.current.checkout;

    $scope.submitStep = function () {
        $scope.checkout.shippingMethodProcessing = true;
        cartAPI.addOrUpdateShipment($scope.checkout.shipment, function () {
            $state.go('checkout_payment');
        });
    };

    function initialize() {
        $scope.checkout.shippingMethodProcessing = false;
        cartAPI.getCart(function (cart) {
            $scope.checkout.shipment = _.last(cart.shipments);

            getAvailableShippingMethods();
        });
    }

    function getAvailableShippingMethods() {
        cartAPI.getAvailableShippingMethods({ shipmentId: $scope.checkout.shipment.id }, function (availableShippingMethods) {
            $scope.checkout.availableShippingMethods = availableShippingMethods;
            if (availableShippingMethods.length == 1) {
                $scope.checkout.shipment.shipmentMethodCode = availableShippingMethods[0].shipmentMethodCode;
            }
        });
    }

    initialize();
}])

    // Checkout Payment step
.controller('checkoutPaymentController', ['$scope', '$state', 'cartAPI', 'workContext', '$ionicHistory', function ($scope, $state, cartAPI, workContext, $ionicHistory) {
    $scope.checkout = workContext.current.checkout;

    $scope.completeOrder = function () {
        $scope.checkout.orderProcessing = true;
        cartAPI.setPaymentMethod({ paymentGatewayCode: $scope.checkout.paymentMethodCode, billingAddress: $scope.checkout.billingAddress }).$promise
            .then(function () {
                return cartAPI.createOrder($scope.checkout.bankCardInfo).$promise;
            })
            .then(function (data) {
                handlePaymentProcessingResult(data.orderProcessingResult, data.order.number);
            })
            //.catch(function (error) {
            //    console.log("An error occurred: " + error);
            //})
            .finally(function () {
                $scope.checkout.orderProcessing = false;
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
                $scope.checkout.paymentMethodCode = availablePaymentMethods[0].gatewayCode;
            }
        });
    }

    function getCart() {
        cartAPI.getCart(function (cart) {
            $scope.checkout.subTotal = cart.subTotal;
            $scope.checkout.discountTotal = cart.discountTotal;
            $scope.checkout.shippingTotal = cart.shippingTotal;
            $scope.checkout.taxTotal = cart.taxTotal;
            $scope.checkout.total = cart.total;

            getBillingAddress(_.last(cart.shipments).deliveryAddress, cart.defaultBillingAddress);
        });
    }

    function getBillingAddress(defaultAddress, newAddress) {
        //$scope.checkout.billingAddressEqualsShipping = true;
        var copyAddress = angular.copy(defaultAddress);
        angular.extend(copyAddress, newAddress);
        $scope.checkout.billingAddress = copyAddress;
    }

    function handlePaymentProcessingResult(paymentProcessingResult, orderNumber) {
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