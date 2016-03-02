angular.module('virtoshopApp')
.factory('authAPI', ['$resource', 'virtoshopApp.apiConfig', function ($resource, apiConfig) {
    return $resource(apiConfig.baseUrl + 'account/login', { id: '@id' }, {
        login: { method: 'POST' },
        logout: { url: apiConfig.baseUrl + 'logout', method: 'POST' }
    });
}])

.factory('searchAPI', ['$resource', 'virtoshopApp.apiConfig', function ($resource, apiConfig) {
    return $resource(null, { id: '@id' }, {
        search: { url: apiConfig.baseUrl + 'catalog/search', method: 'POST' },
        getActualProductPrices: { url: apiConfig.baseUrl + 'pricing/actualprices', method: 'POST', isArray: true },
        searchProducts: { url: apiConfig.baseUrl + 'search' },
        getProducts: { url: apiConfig.baseUrl + 'products', isArray: true }
    });
}])

.factory('cartAPI', ['$resource', 'virtoshopApp.apiConfig', function ($resource, apiConfig) {
    return $resource(apiConfig.baseUrl + 'cart', null, {
        getCart: {},
        addLineItem: { url: apiConfig.baseUrl + 'cart/items', method: 'POST' },
        changeLineItem: { url: apiConfig.baseUrl + 'cart/items', method: 'PUT' },
        removeLineItem: { url: apiConfig.baseUrl + 'cart/items', method: 'DELETE' },
        // query: { isArray: true },
        // update: { method: 'PUT' },
        getCountries: { url: apiConfig.baseUrl + 'countries', isArray: true },
        getCountryRegions: { url: apiConfig.baseUrl + 'countries/:countryCode/regions', isArray: true },
        getAvailableShippingMethods: { url: apiConfig.baseUrl + 'cart/shipments/:shipmentId/shippingmethods', isArray: true },
        addOrUpdateShipment: { url: apiConfig.baseUrl + 'cart/shipments', method: 'POST' },
        getAvailablePaymentMethods: { url: apiConfig.baseUrl + 'cart/paymentmethods', isArray: true },
        setPaymentMethod: { url: apiConfig.baseUrl + 'cart/payments', method: 'POST' },
        createOrder: { url: apiConfig.baseUrl + 'cart/createorder', method: 'POST' }
    });
}])

/*
.factory('aProduct', function () {
// Some fake testing data
var products = [
  {
      id: 1,
      name: "Zara shirt",
      price: 30,
      sale_price: 20,
      thumb: "img/list/p_1.jpg",
      images: [
        { url: "img/detail/d_1.jpg" },
        { url: "img/detail/d_2.jpg" },
        { url: "img/detail/d_3.jpg" }
      ],
      description: "Due to Christmas Time, the returns/exchanges period for orders placed between the 27th of November and the 17th of December will be extended until the 17th of January.",
      reviews: [
        {
            avatar: "img/avatar.jpg",
            name: "Slimer",
            content: "This product is good",
            stars: 4
        }
      ]
  },
  {
      id: 2,
      name: "Mango shirt",
      price: 30,
      sale_price: null,
      thumb: "img/list/p_2.jpg",
      images: [
        "img/detail/d_1.jpg",
        "img/detail/d_2.jpg",
        "img/detail/d_3.jpg"
      ]
  },
  {
      id: 3,
      name: "Zara shirt",
      price: 30,
      sale_price: null,
      thumb: "img/list/p_3.jpg",
      images: [
        "img/detail/d_1.jpg",
        "img/detail/d_2.jpg",
        "img/detail/d_3.jpg"
      ]
  },
  {
      id: 4,
      name: "Mango shirt",
      price: 30,
      sale_price: 20,
      thumb: "img/list/p_4.jpg",
      images: [
        "img/detail/d_1.jpg",
        "img/detail/d_2.jpg",
        "img/detail/d_3.jpg"
      ]
  },
  {
      id: 5,
      name: "Zara shirt",
      price: 30,
      sale_price: 20,
      thumb: "img/list/p_5.jpg",
      images: [
        "img/detail/d_1.jpg",
        "img/detail/d_2.jpg",
        "img/detail/d_3.jpg"
      ]
  },
  {
      id: 6,
      name: "Zara shirt",
      price: 30,
      sale_price: null,
      thumb: "img/list/p_6.jpg",
      images: [
        "img/detail/d_1.jpg",
        "img/detail/d_2.jpg",
        "img/detail/d_3.jpg"
      ]
  },
];

return {
    query: function (prm, callback) {
        callback(products);
    },
    get: function (productId) {
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === parseInt(productId)) {
                return products[i];
            }
        }
        return null;
    }
};
}) */
;
