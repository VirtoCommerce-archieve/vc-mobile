// Ionic Starter App 'virtoshopApp'.

// 'virtoshopApp.controllers' is found in controllers.js
angular.module('virtoshopApp', ['ionic', 'ngResource', 'virtoshopApp.controllers'])
.run(function ($ionicPlatform, $http, virtoshopApp_apiConfig) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    // authenticate the app to api
    $http.post(virtoshopApp_apiConfig.baseUrl + 'platform/security/login/', { userName: virtoshopApp_apiConfig.username, password: virtoshopApp_apiConfig.password }).then(function (results) { });
})

.constant('virtoshopApp_apiConfig', {
    username: 'admin',
    password: 'store',
    catalogId: '25f5ea1b52e54ec1aa903d44cc889324',
    baseUrl: 'http://localhost:8100/api/'
    // baseUrl: 'http://demo.virtocommerce.com/admin/api/'
})

.config(function ($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // Home screen
    .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    })

    // View category
    .state('category', {
        url: "/categories/:id/:name",
        templateUrl: 'templates/category.html',
        controller: 'CategoryCtrl'
    })

    // Product detail
    .state('detail', {
        url: '/detail',
        templateUrl: 'templates/detail.html',
        controller: 'DetailCtrl'
    })

    // Cart detail
    .state('cart', {
        url: '/cart',
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl'
    })

    // Checkout steps
    // Address
    .state('checkout_address', {
        url: '/checkout/address',
        templateUrl: 'templates/checkout-address.html',
        controller: 'CheckoutCtrl'
    })

    // Shipping
    .state('checkout_shipping', {
        url: '/checkout/shipping',
        templateUrl: 'templates/checkout-shipping.html',
        controller: 'CheckoutCtrl'
    })

    // Payment
    .state('checkout_payment', {
        url: '/checkout/payment',
        templateUrl: 'templates/checkout-payment.html',
        controller: 'CheckoutPaymentCtrl'
    })

    // login screen
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
    })

    // register screen
    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'AuthCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

});
