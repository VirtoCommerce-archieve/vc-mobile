angular.module('virtoshopApp')
.factory('searchAPI', ['$resource', 'virtoshopApp.apiConfig', function ($resource, apiConfig) {
    return $resource(null, { id: '@id' }, {
        getCategories: { url: apiConfig.baseUrl + 'search/categories' },
        getCategoryProducts: { url: apiConfig.baseUrl + 'search/products' },
        getProduct: { url: apiConfig.baseUrl + 'search/products/:id' }
    });
}])

.factory('cartAPI', ['$resource', 'virtoshopApp.apiConfig', function ($resource, apiConfig) {
    return $resource(apiConfig.baseUrl + 'cart', { id: '@id' }, {
        getCart: {},
        addLineItem: { url: apiConfig.baseUrl + 'cart/additem', method: 'POST' },
        changeLineItem: { url: apiConfig.baseUrl + 'cart/changeitem', method: 'POST' },
        removeLineItem: { url: apiConfig.baseUrl + 'cart/removeitem', method: 'POST' },
        // query: { isArray: true },
        // update: { method: 'PUT' },
        getCountries: { url: apiConfig.baseUrl + 'search/common/getcountries', isArray: true },
        addAddress: { url: apiConfig.baseUrl + 'cart/addaddress', method: 'POST' },
        getAvailableShippingMethods: { url: apiConfig.baseUrl + 'cart/shippingmethods', isArray: true },
        //getAvailableShippingMethods: function () {
        //    return $http.get('cart/shippingmethods/json?t=' + new Date().getTime());
        //},
        setShippingMethod: { url: apiConfig.baseUrl + 'cart/shippingmethod', method: 'POST' },
        
    });
}])

.factory('aProduct', function () {
    // Might use a resource here that returns a JSON array

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
        all: function () {
            return products;
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
});
