/**
 * @license ws-events v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('rxcomp'), require('rxcomp-form'), require('rxjs'), require('rxjs/operators'), require('swiper')) :
  typeof define === 'function' && define.amd ? define(['rxcomp', 'rxcomp-form', 'rxjs', 'rxjs/operators', 'swiper'], factory) :
  (global = global || self, factory(global.rxcomp, global.rxcomp.form, global.rxjs, global.rxjs.operators, global.Swiper));
}(this, (function (rxcomp, rxcompForm, rxjs, operators, Swiper) { 'use strict';

  Swiper = Swiper && Object.prototype.hasOwnProperty.call(Swiper, 'default') ? Swiper['default'] : Swiper;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var AppComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(AppComponent, _Component);

    function AppComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = AppComponent.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.remove('wse__hidden');
      this.asideActive = false;
    } // onView() { const context = getContext(this); }
    // onChanges() {}
    // onDestroy() {}
    ;

    _proto.onAsideToggle = function onAsideToggle($event) {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      if ($event) {
        node.classList.add('wse__aside--active');
        node.classList.remove('wse__notification--active');
      } else {
        node.classList.remove('wse__aside--active');
      }
      /*
      this.asideActive = $event;
      this.pushChanges();
      */

    };

    _proto.onNotificationToggle = function onNotificationToggle($event) {
      var _getContext3 = rxcomp.getContext(this),
          node = _getContext3.node;

      if ($event) {
        node.classList.add('wse__notification--active');
        node.classList.remove('wse__aside--active');
      } else {
        node.classList.remove('wse__notification--active');
      }
    };

    return AppComponent;
  }(rxcomp.Component);
  AppComponent.meta = {
    selector: '[app-component]'
  };

  var STATIC = window.location.port === '40333' || window.location.host === 'actarian.github.io';
  var DEVELOPMENT = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;
  var PRODUCTION = !DEVELOPMENT;
  var ENV = {
    NAME: 'ws-events',
    STATIC: STATIC,
    DEVELOPMENT: DEVELOPMENT,
    PRODUCTION: PRODUCTION,
    RESOURCE: '/Modules/Events/Client/docs/',
    STATIC_RESOURCE: './',
    API: '/api',
    STATIC_API: DEVELOPMENT && !STATIC ? '/Modules/Events/Client/docs/api' : './api'
  };
  function getApiUrl(url, useStatic) {
    var base = useStatic || STATIC ? ENV.STATIC_API : ENV.API;
    var json = useStatic || STATIC ? '.json' : '';
    return "" + base + url + json;
  }
  function getResourceRoot() {
    return STATIC ? ENV.STATIC_RESOURCE : ENV.RESOURCE;
  }
  function getSlug(url) {
    if (!url) {
      return url;
    }

    if (url.indexOf("/" + ENV.NAME) !== 0) {
      return url;
    }

    if (STATIC) {
      console.log(url);
      return url;
    }

    url = url.replace("/" + ENV.NAME, '');
    url = url.replace('.html', '');
    return "/it/it" + url;
  }

  var HttpResponse = /*#__PURE__*/function () {
    _createClass(HttpResponse, [{
      key: "static",
      get: function get() {
        return this.url.indexOf('.json') === this.url.length - 5;
      }
    }]);

    function HttpResponse(response) {
      this.data = null;

      if (response) {
        this.url = response.url;
        this.status = response.status;
        this.statusText = response.statusText;
        this.ok = response.ok;
        this.redirected = response.redirected;
      }
    }

    return HttpResponse;
  }();

  var HttpService = /*#__PURE__*/function () {
    function HttpService() {}

    HttpService.http$ = function http$(method, url, data, format) {
      var _this = this;

      if (format === void 0) {
        format = 'json';
      }

      method = url.indexOf('.json') ? 'GET' : method;
      var methods = ['POST', 'PUT', 'PATCH'];
      var response_ = null;
      return rxjs.from(fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
      }).then(function (response) {
        response_ = new HttpResponse(response);
        return response[format]().then(function (json) {
          response_.data = json;

          if (response.ok) {
            return Promise.resolve(response_);
          } else {
            return Promise.reject(response_);
          }
        });
        /*
        if (response.ok) {
        	return response[format]();
        } else {
        	return response.json().then(json => {
        		return Promise.reject(json);
        	});
        }
        */
      })).pipe(operators.catchError(function (error) {
        return rxjs.throwError(_this.getError(error, response_));
      }));
    };

    HttpService.get$ = function get$(url, data, format) {
      var query = this.query(data);
      return this.http$('GET', "" + url + query, undefined, format);
    };

    HttpService.delete$ = function delete$(url) {
      return this.http$('DELETE', url);
    };

    HttpService.post$ = function post$(url, data) {
      return this.http$('POST', url, data);
    };

    HttpService.put$ = function put$(url, data) {
      return this.http$('PUT', url, data);
    };

    HttpService.patch$ = function patch$(url, data) {
      return this.http$('PATCH', url, data);
    };

    HttpService.query = function query(data) {
      return ''; // todo
    };

    HttpService.getError = function getError(object, response) {
      var error = typeof object === 'object' ? object : {};

      if (!error.statusCode) {
        error.statusCode = response ? response.status : 0;
      }

      if (!error.statusMessage) {
        error.statusMessage = response ? response.statusText : object;
      }

      console.log('HttpService.getError', error, object);
      return error;
    };

    return HttpService;
  }();

  var ApiService = /*#__PURE__*/function (_HttpService) {
    _inheritsLoose(ApiService, _HttpService);

    function ApiService() {
      return _HttpService.apply(this, arguments) || this;
    }

    ApiService.get$ = function get$(url, data, format) {
      return _HttpService.get$.call(this, getApiUrl(url), data, format);
    };

    ApiService.delete$ = function delete$(url) {
      return _HttpService.delete$.call(this, getApiUrl(url));
    };

    ApiService.post$ = function post$(url, data) {
      return _HttpService.post$.call(this, getApiUrl(url), data);
    };

    ApiService.put$ = function put$(url, data) {
      return _HttpService.put$.call(this, getApiUrl(url), data);
    };

    ApiService.patch$ = function patch$(url, data) {
      return _HttpService.patch$.call(this, getApiUrl(url), data);
    };

    ApiService.staticGet$ = function staticGet$(url, data, format) {
      return _HttpService.get$.call(this, getApiUrl(url, true), data, format);
    };

    ApiService.staticDelete$ = function staticDelete$(url) {
      return _HttpService.delete$.call(this, getApiUrl(url, true));
    };

    ApiService.staticPost$ = function staticPost$(url, data) {
      return _HttpService.post$.call(this, getApiUrl(url, true), data);
    };

    ApiService.staticPut$ = function staticPut$(url, data) {
      return _HttpService.put$.call(this, getApiUrl(url, true), data);
    };

    ApiService.staticPatch$ = function staticPatch$(url, data) {
      return _HttpService.patch$.call(this, getApiUrl(url, true), data);
    };

    return ApiService;
  }(HttpService);

  var LocalStorageService = /*#__PURE__*/function () {
    function LocalStorageService() {}

    LocalStorageService.delete = function _delete(name) {
      if (this.isLocalStorageSupported()) {
        window.localStorage.removeItem(name);
      }
    };

    LocalStorageService.exist = function exist(name) {
      if (this.isLocalStorageSupported()) {
        return window.localStorage[name] !== undefined;
      }
    };

    LocalStorageService.get = function get(name) {
      var value = null;

      if (this.isLocalStorageSupported() && window.localStorage[name] !== undefined) {
        try {
          value = JSON.parse(window.localStorage[name]);
        } catch (e) {
          console.log('LocalStorageService.get.error parsing', name, e);
        }
      }

      return value;
    };

    LocalStorageService.set = function set(name, value) {
      if (this.isLocalStorageSupported()) {
        try {
          var cache = [];
          var json = JSON.stringify(value, function (key, value) {
            if (typeof value === 'object' && value !== null) {
              if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
              }

              cache.push(value);
            }

            return value;
          });
          window.localStorage.setItem(name, json);
        } catch (e) {
          console.log('LocalStorageService.set.error serializing', name, value, e);
        }
      }
    };

    LocalStorageService.isLocalStorageSupported = function isLocalStorageSupported() {
      if (this.supported) {
        return true;
      }

      var supported = false;

      try {
        supported = 'localStorage' in window && window.localStorage !== null;

        if (supported) {
          window.localStorage.setItem('test', '1');
          window.localStorage.removeItem('test');
        } else {
          supported = false;
        }
      } catch (e) {
        supported = false;
      }

      this.supported = supported;
      return supported;
    };

    return LocalStorageService;
  }();

  var subscriptions$_ = new rxjs.BehaviorSubject([]);
  var likes$_ = new rxjs.BehaviorSubject([]);
  var favourites$_ = new rxjs.BehaviorSubject([]);

  var FavouriteService = /*#__PURE__*/function () {
    function FavouriteService() {}

    FavouriteService.getCurrentSubscriptions = function getCurrentSubscriptions() {
      return subscriptions$_.getValue();
    };

    FavouriteService.getCurrentLikes = function getCurrentLikes() {
      return likes$_.getValue();
    };

    FavouriteService.getCurrentFavourites = function getCurrentFavourites() {
      return favourites$_.getValue();
    };

    FavouriteService.subscriptions$ = function subscriptions$() {
      return ApiService.staticGet$("/user/subscription").pipe(operators.map(function (response) {
        if (response.static) {
          var subscriptions = LocalStorageService.get('subscriptions') || [];
          return EventService.fakeSaved(subscriptions);
        } else {
          return response.data;
        }
      }), operators.switchMap(function (subscriptions) {
        subscriptions$_.next(subscriptions);
        return subscriptions$_;
      }));
    };

    FavouriteService.likes$ = function likes$() {
      return ApiService.staticGet$("/user/like").pipe(operators.map(function (response) {
        if (response.static) {
          var likes = LocalStorageService.get('likes') || [];
          return EventService.fakeSaved(likes);
        } else {
          return response.data;
        }
      }), operators.switchMap(function (likes) {
        likes$_.next(likes);
        return likes$_;
      }));
    };

    FavouriteService.favourites$ = function favourites$() {
      return ApiService.staticGet$("/user/favourite").pipe(operators.map(function (response) {
        if (response.static) {
          var favourites = LocalStorageService.get('favourites') || [];
          return EventService.fakeSaved(favourites);
        } else {
          return response.data;
        }
      }), operators.switchMap(function (favourites) {
        favourites$_.next(favourites);
        return favourites$_;
      }));
    };

    FavouriteService.subscriptionAdd$ = function subscriptionAdd$(id) {
      return ApiService.staticPost$("/user/subscription/add", {
        id: id
      }).pipe(operators.map(function (response) {
        if (response.static) {
          var subscriptions = LocalStorageService.get('subscriptions') || [];
          var item = subscriptions.find(function (x) {
            return x.id === id;
          });

          if (!item) {
            subscriptions.unshift({
              id: id
            });
          }

          subscriptions$_.next(subscriptions);
          LocalStorageService.set('subscriptions', subscriptions);
        }

        return response.data;
      }));
    };

    FavouriteService.subscriptionRemove$ = function subscriptionRemove$(id) {
      return ApiService.staticPost$("/user/subscription/remove", {
        id: id
      }).pipe(operators.map(function (response) {
        if (response.static) {
          var subscriptions = LocalStorageService.get('subscriptions') || [];
          var item = subscriptions.find(function (x) {
            return x.id === id;
          });
          var index = item ? subscriptions.indexOf(item) : -1;

          if (index !== -1) {
            subscriptions.splice(index, 1);
          }

          subscriptions$_.next(subscriptions);
          LocalStorageService.set('subscriptions', subscriptions);
        }

        return response.data;
      }));
    };

    FavouriteService.likeAdd$ = function likeAdd$(id) {
      return ApiService.staticPost$("/user/like/add", {
        id: id
      }).pipe(operators.map(function (response) {
        if (response.static) {
          var likes = LocalStorageService.get('likes') || [];
          var item = likes.find(function (x) {
            return x.id === id;
          });

          if (!item) {
            likes.unshift({
              id: id
            });
          }

          likes$_.next(likes);
          LocalStorageService.set('likes', likes);
        }

        return response.data;
      }));
    };

    FavouriteService.likeRemove$ = function likeRemove$(id) {
      return ApiService.staticPost$("/user/like/remove", {
        id: id
      }).pipe(operators.map(function (response) {
        if (response.static) {
          var likes = LocalStorageService.get('likes') || [];
          var item = likes.find(function (x) {
            return x.id === id;
          });
          var index = item ? likes.indexOf(item) : -1;

          if (index !== -1) {
            likes.splice(index, 1);
          }

          likes$_.next(likes);
          LocalStorageService.set('likes', likes);
        }

        return response.data;
      }));
    };

    FavouriteService.favouriteAdd$ = function favouriteAdd$(id) {
      return ApiService.staticPost$("/user/favourite/add", {
        id: id
      }).pipe(operators.map(function (response) {
        if (response.static) {
          var favourites = LocalStorageService.get('favourites') || [];
          var item = favourites.find(function (x) {
            return x.id === id;
          });

          if (!item) {
            favourites.unshift({
              id: id
            });
          }

          favourites$_.next(favourites);
          LocalStorageService.set('favourites', favourites);
        }

        return response.data;
      }));
    };

    FavouriteService.favouriteRemove$ = function favouriteRemove$(id) {
      return ApiService.staticPost$("/user/favourite/remove", {
        id: id
      }).pipe(operators.map(function (response) {
        if (response.static) {
          var favourites = LocalStorageService.get('favourites') || [];
          var item = favourites.find(function (x) {
            return x.id === id;
          });
          var index = item ? favourites.indexOf(item) : -1;

          if (index !== -1) {
            favourites.splice(index, 1);
          }

          favourites$_.next(favourites);
          LocalStorageService.set('favourites', favourites);
        }

        return response.data;
      }));
    };

    return FavouriteService;
  }();
  FavouriteService.subscriptions$ = FavouriteService.subscriptions$().pipe(operators.shareReplay(1));
  FavouriteService.likes$ = FavouriteService.likes$().pipe(operators.shareReplay(1));
  FavouriteService.favourites$ = FavouriteService.favourites$().pipe(operators.shareReplay(1));

  var User = /*#__PURE__*/function () {
    _createClass(User, [{
      key: "avatar",
      get: function get() {
        return (this.firstName || '?').substr(0, 1).toUpperCase() + (this.lastName || '?').substr(0, 1).toUpperCase();
      }
    }, {
      key: "fullName",
      get: function get() {
        return this.firstName + ' ' + this.lastName;
      }
    }]);

    function User(data) {
      if (data) {
        Object.assign(this, data);
      }
    }

    return User;
  }();

  var UserService = /*#__PURE__*/function () {
    function UserService() {}

    UserService.getCurrentUser = function getCurrentUser() {
      return this.user$_.getValue();
    };

    UserService.setUser = function setUser(user) {
      this.user$_.next(user);
    };

    UserService.me$ = function me$() {
      var _this = this;

      return ApiService.staticGet$("/user/me").pipe( // map((user) => this.mapStatic__(user, 'me')),
      operators.map(function (response) {
        return _this.mapUser(response.data, response.static);
      }), operators.catchError(function (error) {
        return rxjs.of(null);
      }), operators.switchMap(function (user) {
        _this.setUser(user);

        return _this.user$_;
      }));
    };

    UserService.register$ = function register$(payload) {
      var _this2 = this;

      return ApiService.staticPost$("/user/register", payload).pipe(operators.map(function (response) {
        return _this2.mapStatic__(response.data, response.static, 'register');
      }));
    };

    UserService.login$ = function login$(payload) {
      var _this3 = this;

      return ApiService.staticPost$("/user/login", payload).pipe(operators.map(function (response) {
        return _this3.mapStatic__(response.data, response.static, 'login');
      }));
    };

    UserService.logout$ = function logout$() {
      var _this4 = this;

      return ApiService.staticPost$("/user/logout").pipe(operators.map(function (response) {
        return _this4.mapStatic__(response.data, response.static, 'logout');
      }));
    };

    UserService.retrieve$ = function retrieve$(payload) {
      var _this5 = this;

      return ApiService.staticPost$("/user/retrievepassword", payload).pipe(operators.map(function (response) {
        return _this5.mapStatic__(response.data, response.static, 'retrieve');
      }));
    };

    UserService.update$ = function update$(payload) {
      var _this6 = this;

      return ApiService.staticPost$("/user/updateprofile", payload).pipe(operators.map(function (response) {
        return _this6.mapStatic__(response.data, response.static, 'register');
      }));
    };

    UserService.mapStatic__ = function mapStatic__(user, isStatic, action) {
      if (action === void 0) {
        action = 'me';
      }

      if (!isStatic) {
        return user;
      }

      switch (action) {
        case 'me':
          if (!LocalStorageService.exist('user')) {
            user = null;
          }
          break;

        case 'register':
          LocalStorageService.set('user', user);
          break;

        case 'login':
          LocalStorageService.set('user', user);
          break;

        case 'logout':
          LocalStorageService.delete('user');
          break;
      }

      return user;
    };

    UserService.fake = function fake(user) {
      user.firstName = user.firstName || 'Jhon';
      user.lastName = user.lastName || 'Appleseed';
      return user;
    };

    UserService.mapUser = function mapUser(user, isStatic) {
      return isStatic ? UserService.fake(new User(user)) : new User(user);
    };

    UserService.mapUsers = function mapUsers(users, isStatic) {
      return users ? users.map(function (x) {
        return UserService.mapUser(x, isStatic);
      }) : [];
    };

    return UserService;
  }();
  UserService.user$_ = new rxjs.BehaviorSubject(null);

  var Question = function Question(data) {
    if (data) {
      Object.assign(this, data);

      if (this.creationDate) {
        this.creationDate = new Date(this.creationDate);
      }

      if (this.user) {
        this.user = UserService.mapUser(this.user);
      }
    }
  };

  var QuestionService = /*#__PURE__*/function () {
    function QuestionService() {}

    QuestionService.mapQuestion = function mapQuestion(question, isStatic) {
      return isStatic ? QuestionService.fake(new Question(question)) : new Question(question);
    };

    QuestionService.mapQuestions = function mapQuestions(questions, isStatic) {
      return questions ? questions.map(function (x) {
        return QuestionService.mapQuestion(x, isStatic);
      }) : [];
    };

    QuestionService.fake = function fake(item) {
      var now = new Date();
      var index = item.id % 1000000;

      switch (index) {
        case 4:
          item.creationDate = new Date(new Date().setSeconds(now.getSeconds() - 30));
          break;

        case 3:
          item.creationDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
          break;

        case 2:
          item.creationDate = new Date(new Date().setMinutes(now.getMinutes() - 45));
          break;

        case 1:
          item.creationDate = new Date(new Date().setHours(now.getHours() - 1));
          break;

        default:
          item.creationDate = new Date(new Date().setDate(now.getDate() - 1 - Math.floor(Math.random() * 20)));
      }

      return item;
    };

    return QuestionService;
  }();

  var FAKE_FILTERS = [{
    "key": "collection",
    "label": "Collection",
    "options": [{
      "value": 10000001,
      "label": "Lims"
    }, {
      "value": 10000002,
      "label": "Boost Pro"
    }, {
      "value": 10000003,
      "label": "Canone Inverso"
    }, {
      "value": 10000004,
      "label": "3D wall design"
    }, {
      "value": 10000005,
      "label": "Brick Atelier"
    }, {
      "value": 10000006,
      "label": "Blaze"
    }, {
      "value": 10000007,
      "label": "Echo"
    }, {
      "value": 10000008,
      "label": "GreenColors"
    }, {
      "value": 10000009,
      "label": "Granigliati"
    }, {
      "value": 10000010,
      "label": "Ground Track"
    }, {
      "value": 10000011,
      "label": "Boost"
    }, {
      "value": 10000012,
      "label": "Raw"
    }, {
      "value": 10000013,
      "label": "Dolmen Pro"
    }, {
      "value": 10000014,
      "label": "Dwell"
    }, {
      "value": 10000015,
      "label": "Kone"
    }, {
      "value": 10000016,
      "label": "Arkshade"
    }, {
      "value": 10000017,
      "label": "Mek"
    }, {
      "value": 10000018,
      "label": "Mark"
    }, {
      "value": 10000019,
      "label": "Evolve"
    }, {
      "value": 10000020,
      "label": "EWall"
    }, {
      "value": 10000021,
      "label": "Arty"
    }, {
      "value": 10000022,
      "label": "Aix"
    }, {
      "value": 10000023,
      "label": "Brave"
    }, {
      "value": 10000024,
      "label": "Exence"
    }, {
      "value": 10000025,
      "label": "Heartwood"
    }, {
      "value": 10000026,
      "label": "Nid"
    }, {
      "value": 10000027,
      "label": "Arbor"
    }, {
      "value": 10000028,
      "label": "Klif"
    }, {
      "value": 10000029,
      "label": "Axi"
    }, {
      "value": 10000030,
      "label": "Nash"
    }, {
      "value": 10000031,
      "label": "Etic"
    }, {
      "value": 10000032,
      "label": "Etic Pro"
    }, {
      "value": 10000033,
      "label": "Trust"
    }, {
      "value": 10000034,
      "label": "Marvel"
    }, {
      "value": 10000035,
      "label": "Marvel Pro"
    }, {
      "value": 10000036,
      "label": "Marvel Stone"
    }, {
      "value": 10000037,
      "label": "Marvel Dream"
    }, {
      "value": 10000038,
      "label": "Marvel Edge"
    }, {
      "value": 10000039,
      "label": "Marvel Gems"
    }, {
      "value": 10000040,
      "label": "Room"
    }, {
      "value": 10000041,
      "label": "Seastone"
    }, {
      "value": 10000042,
      "label": "Sunrock"
    }]
  }, {
    "key": "placement",
    "label": "Placement",
    "options": [{
      "value": 10000043,
      "label": "Indoor"
    }, {
      "value": 10000044,
      "label": "Outdoor"
    }]
  }, {
    "key": "material",
    "label": "Material",
    "options": [{
      "value": 10000045,
      "label": "Marble"
    }, {
      "value": 10000046,
      "label": "Stone"
    }, {
      "value": 10000047,
      "label": "Cement"
    }, {
      "value": 10000048,
      "label": "Wood"
    }, {
      "value": 10000049,
      "label": "Metal"
    }, {
      "value": 10000050,
      "label": "Fabric"
    }]
  }, {
    "key": "finish",
    "label": "Finish",
    "options": [{
      "value": 10000051,
      "label": "Lucid"
    }, {
      "value": 10000052,
      "label": "Matt"
    }]
  }, {
    "key": "color",
    "label": "Color",
    "options": [{
      "value": 10000053,
      "label": "White"
    }, {
      "value": 10000054,
      "label": "Black"
    }, {
      "value": 10000055,
      "label": "Gray"
    }, {
      "value": 10000056,
      "label": "Ivory"
    }, {
      "value": 10000057,
      "label": "Cream"
    }, {
      "value": 10000058,
      "label": "Beige"
    }, {
      "value": 10000059,
      "label": "Brown"
    }, {
      "value": 10000060,
      "label": "Gold"
    }, {
      "value": 10000061,
      "label": "Cream"
    }, {
      "value": 10000062,
      "label": "Yellow"
    }, {
      "value": 10000063,
      "label": "Pink"
    }, {
      "value": 10000064,
      "label": "Orange"
    }, {
      "value": 10000065,
      "label": "Red"
    }, {
      "value": 10000066,
      "label": "Blue"
    }, {
      "value": 10000067,
      "label": "Green"
    }, {
      "value": 10000068,
      "label": "Purple"
    }]
  }, {
    "key": "size",
    "label": "Size",
    "options": [{
      "value": 10000069,
      "label": "Small"
    }, {
      "value": 10000070,
      "label": "Medium"
    }, {
      "value": 10000071,
      "label": "Large"
    }, {
      "value": 10000072,
      "label": "Extra Large"
    }]
  }, {
    "key": "class",
    "label": "Class",
    "options": [{
      "value": 10000073,
      "label": "Class A"
    }, {
      "value": 10000074,
      "label": "Class B"
    }, {
      "value": 10000075,
      "label": "Class C"
    }, {
      "value": 10000076,
      "label": "Class D"
    }]
  }, {
    "key": "category",
    "label": "Category",
    "options": [{
      "value": 10000077,
      "label": "Professional"
    }, {
      "value": 10000078,
      "label": "Heritage"
    }, {
      "value": 10000079,
      "label": "Premium"
    }]
  }];

  var Event = /*#__PURE__*/function () {
    _createClass(Event, [{
      key: "live",
      get: function get() {
        return this.info.started && !this.info.ended;
      }
    }, {
      key: "incoming",
      get: function get() {
        var now = new Date();
        var diff = this.startDate - now;
        var hoursDiff = Math.floor(diff / 1000 / 60 / 60);
        return !this.info.started && this.startDate > now && hoursDiff < 24;
      }
    }, {
      key: "future",
      get: function get() {
        var now = new Date();
        return !this.info.started && this.startDate > now;
      }
    }, {
      key: "past",
      get: function get() {
        return this.info.ended;
      }
    }, {
      key: "hasRelated",
      get: function get() {
        return this.related && this.related.length;
      }
    }]);

    function Event(data, isStatic) {
      if (data) {
        Object.assign(this, data);
        this.info = this.info || {};

        if (this.creationDate) {
          this.creationDate = new Date(this.creationDate);
        }

        if (this.startDate) {
          this.startDate = new Date(this.startDate);
          this.info.started = this.startDate < Date.now();
        }

        if (this.endDate) {
          this.endDate = new Date(this.endDate);
          this.info.ended = this.endDate < Date.now();
        }

        if (this.related) {
          this.related = EventService.mapEvents(this.related, isStatic);
        }

        if (this.questions) {
          this.questions = QuestionService.mapQuestions(this.questions, isStatic);
        }
      }
    }

    return Event;
  }();

  var EventService = /*#__PURE__*/function () {
    function EventService() {}

    EventService.detail$ = function detail$(eventId) {
      // return ApiService.get$(`/event/${eventId}/detail`)
      return ApiService.staticGet$("/event/" + 1001 + "/detail").pipe(operators.tap(function (response) {
        return response.data.id = parseInt(eventId);
      }), // !!!
      operators.map(function (response) {
        return EventService.mapEvent(response.data, response.static);
      }));
    };

    EventService.listing$ = function listing$(eventId) {
      // return ApiService.get$(`/event/${eventId}/listing`)
      return ApiService.staticGet$("/event/" + 1001 + "/listing").pipe(operators.switchMap(function (response) {
        return EventService.mapListing(response.data, response.static, eventId);
      }));
    };

    EventService.filter$ = function filter$(eventId) {
      // return ApiService.get$(`/event/${eventId}/filter`)
      return ApiService.staticGet$("/event/" + 1001 + "/filter").pipe(operators.map(function (response) {
        return response.data;
      }));
    };

    EventService.top$ = function top$() {
      return ApiService.staticGet$("/event/evidence").pipe(operators.map(function (response) {
        return EventService.mapEvents(response.data, response.static);
      }));
    };

    EventService.upcoming$ = function upcoming$() {
      return ApiService.staticGet$("/event/upcoming").pipe(operators.map(function (response) {
        return EventService.mapEvents(response.data, response.static);
      }));
    };

    EventService.subscribe$ = function subscribe$(eventId) {
      return rxjs.of(null);
    };

    EventService.unsubscribe$ = function unsubscribe$(eventId) {
      return rxjs.of(null);
    };

    EventService.like$ = function like$(eventId) {
      return rxjs.of(null);
    };

    EventService.unlike$ = function unlike$(eventId) {
      return rxjs.of(null);
    };

    EventService.postQuestion$ = function postQuestion$(event, body) {
      var eventId = 1001; // event.id !!!

      return ApiService.staticPost$("/event/" + eventId + "/question", body).pipe(operators.map(function (response) {
        var question = QuestionService.mapQuestion(response.data, response.static);

        if (response.static) {
          question.id = event.questions[0].id + 1;
          question.creationDate = new Date();
          question.user = UserService.getCurrentUser();
          question.body = body;
        }

        return question;
      }));
    };

    EventService.mapEvent = function mapEvent(event, isStatic) {
      return isStatic ? EventService.fake(new Event(event, true)) : new Event(event);
    };

    EventService.mapEvents = function mapEvents(events, isStatic) {
      return events ? events.map(function (x) {
        return EventService.mapEvent(x, isStatic);
      }) : [];
    };

    EventService.mapListing = function mapListing(items, isStatic, eventId) {
      return isStatic ? EventService.fakeListing(eventId) : rxjs.of(items);
    };

    EventService.fake = function fake(item) {
      // !!! todo, wrap static api response { static: true, data: ... }
      // console.log('EventService.fake', item);
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
      var index = item.id % 1000;
      var channelId = 100 + (item.id - index) / 1000;
      item.url = item.url + "?eventId=" + item.id;

      if (item.channel) {
        item.channel.id = channelId;
        item.channel.url = item.channel.url + "?channelId=" + item.channel.id;
        var channelIndex = item.channel.id % 100;
        item.channel.name = "Channel " + letters[channelIndex - 1];
        item.name = "Event " + letters[channelIndex - 1] + index;
      }

      if (item.info) {
        item.info.subscribers = 50 + Math.floor(Math.random() * 200);
        item.info.likes = 50 + Math.floor(Math.random() * 200);
        item.thron = {
          src: 'https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=gruppoconcorde&xcontentId=16ef3c0a-ba0c-4e3a-a10a-32bc7f9a4297&pkey=yz1hpd'
        };
        var now = new Date();

        switch (index) {
          case 1:
            item.startDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
            item.endDate = null;
            item.info.started = true;
            item.info.ended = false;
            break;

          case 2:
            item.startDate = new Date(new Date().setMinutes(now.getMinutes() + 2));
            item.endDate = null;
            item.info.started = false;
            item.info.ended = false;
            break;

          case 3:
            item.startDate = new Date(new Date().setHours(now.getHours() + 2));
            item.endDate = null;
            item.info.started = false;
            item.info.ended = false;
            break;

          case 4:
            item.startDate = new Date(new Date().setHours(now.getHours() - 7));
            item.endDate = new Date(new Date().setHours(now.getHours() - 6));
            item.info.started = true;
            item.info.ended = true;
            break;

          case 5:
            item.startDate = new Date(new Date().setDate(now.getDate() + 7));
            item.endDate = null;
            item.info.started = false;
            item.info.ended = false;
            break;

          case 6:
            item.startDate = new Date(new Date().setDate(now.getDate() + 14));
            item.endDate = null;
            item.info.started = false;
            item.info.ended = false;
            break;

          default:
            item.startDate = new Date(new Date().setDate(now.getDate() - 14 - Math.floor(Math.random() * 150)));
            item.endDate = new Date(new Date(item.startDate.getTime()).setHours(item.startDate.getHours() + 1));
            item.info.started = true;
            item.info.ended = true;
        }

        var subscriptions = FavouriteService.getCurrentSubscriptions();
        var subscription = subscriptions.find(function (x) {
          return x.id === item.id;
        });
        item.info.subscribed = subscription !== undefined;
        var likes = FavouriteService.getCurrentLikes();
        var like = likes.find(function (x) {
          return x.id === item.id;
        });
        item.info.liked = like !== undefined;
        var favourites = FavouriteService.getCurrentFavourites();
        var favourite = favourites.find(function (x) {
          return x.id === item.id;
        });
        item.info.saved = favourite !== undefined;
      }

      item.features = [];
      var filters = FAKE_FILTERS;
      filters.forEach(function (filter) {
        var index = Math.floor(Math.random() * filter.options.length);
        item.features.push(filter.options[index].value);
      });

      if (item.related) {
        item.related = item.related.filter(function (x) {
          return x.id !== item.id && (x.live || x.incoming || x.past);
        });
      }

      return item;
    };

    EventService.fakeListing = function fakeListing(eventId) {
      var index = eventId % 1000;
      var channelId = 100 + (eventId - index) / 1000;
      eventId = 1001;
      return ApiService.staticGet$("/event/" + eventId + "/detail").pipe(operators.map(function (response) {
        var channel_ = new Event(response.data, true).channel;
        channel_.id = channelId;
        var info_ = {
          started: false,
          ended: false,
          subscribers: 100,
          subscribed: false,
          likes: 100,
          liked: false
        };
        var image_ = {
          id: 100000,
          width: 700,
          height: 700,
          src: 'https://source.unsplash.com/random/'
        };
        var category_ = {
          id: 10000,
          name: 'Category',
          url: '/ws-events/events-category.html'
        };
        var event_ = {
          id: 1000,
          type: 'event',
          name: 'Evento',
          title: 'Evento',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/events-event.html',
          creationDate: '2020-05-20T08:11:17.827Z',
          startDate: '2020-05-20T08:11:17.827Z',
          picture: image_,
          info: info_,
          channel: channel_
        };
        var picture_ = {
          id: 1000,
          type: 'picture',
          name: 'Picture',
          title: 'Picture',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/events-document.html',
          picture: image_,
          category: category_
        };
        var product_ = {
          id: 1000,
          type: 'product',
          name: 'Product',
          title: 'Product',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/events-product.html',
          picture: image_,
          category: category_
        };
        var magazine_ = {
          id: 1000,
          type: 'magazine',
          name: 'Magazine',
          title: 'Magazine',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/events-product.html',
          picture: image_,
          category: category_
        };
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
        return new Array(30).fill(true).map(function (x, i) {
          var type = 'event';

          if (i > 3) {
            if (i % 5 === 0) {
              type = 'picture';
            }

            if (i % 7 === 0) {
              type = 'product';
            }

            if (i % 11 === 0) {
              type = 'magazine';
            }
          }

          var item;

          switch (type) {
            case 'picture':
              item = Object.assign({}, picture_);
              break;

            case 'product':
              item = Object.assign({}, product_);
              break;

            case 'magazine':
              item = Object.assign({}, magazine_);
              break;

            case 'event':
              item = Object.assign({}, event_);
              break;
          }

          item.id = (channel_.id - 100) * 1000 + 1 + i;
          item.name = item.title = item.name + " " + letters[(item.id - 1) % 10];
          item.type = type;

          if (item.picture) {
            item.picture = Object.assign({}, image_, {
              id: 100001 + i,
              width: 700,
              height: [700, 900, 1100][i % 3]
            });
          }

          if (item.info) {
            item.info = Object.assign({}, info_);
          }

          if (item.channel) {
            item.channel = Object.assign({}, channel_);
          }

          if (item.category) {
            var categoryId = 10001 + i % 10;
            item.category = Object.assign({}, category_, {
              id: categoryId,
              name: 'Category ' + letters[categoryId % 10],
              url: category_.url + "?categoryId=" + categoryId
            });
          }

          switch (type) {
            case 'event':
              item = EventService.fake(new Event(item, true));
              break;

            default:
              item.features = [];
              var filters = FAKE_FILTERS;
              filters.forEach(function (filter) {
                var index = Math.floor(Math.random() * filter.options.length);
                item.features.push(filter.options[index].value);
              });
          }

          return item;
        });
      }));
    };

    EventService.fakeSaved = function fakeSaved(items) {
      var info_ = {
        started: false,
        ended: false,
        subscribers: 100,
        subscribed: false,
        likes: 100,
        liked: false
      };
      var image_ = {
        id: 100000,
        width: 700,
        height: 700,
        src: 'https://source.unsplash.com/random/'
      };
      var event_ = {
        id: 1000,
        type: 'event',
        name: 'Evento',
        title: 'Evento',
        abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
        url: '/ws-events/events-event.html',
        creationDate: '2020-05-20T08:11:17.827Z',
        startDate: '2020-05-20T08:11:17.827Z',
        picture: image_,
        info: info_
      };
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
      return items.map(function (x, i) {
        var type = 'event';
        var item = Object.assign({}, event_);
        item.id = x.id;
        item.name = item.title = item.name + " " + letters[(item.id - 1) % 10];
        var index = x.id % 1000;
        item.channel = {
          id: (x.id - index) / 1000 + 1000
        };
        item.type = type;
        item.picture = Object.assign({}, image_, {
          id: 100001 + i,
          width: 700,
          height: [700, 900, 1100][i % 3]
        });
        item.info = Object.assign({}, info_);
        item = EventService.fake(new Event(item, true));
        return item;
      });
    };

    return EventService;
  }();

  var Channel = function Channel(data, isStatic) {
    if (data) {
      Object.assign(this, data);
      this.events = EventService.mapEvents(this.events, isStatic);
    }
  };

  var ChannelService = /*#__PURE__*/function () {
    function ChannelService() {}

    ChannelService.channels$ = function channels$() {
      return ApiService.staticGet$("/channel/channels").pipe(operators.map(function (response) {
        return ChannelService.mapChannels(response.data, response.static);
      }));
    };

    ChannelService.detail$ = function detail$(channelId) {
      return ApiService.staticGet$("/channel/" + channelId + "/detail").pipe(operators.map(function (response) {
        return ChannelService.mapChannel(response.data, response.static);
      }));
    };

    ChannelService.listing$ = function listing$(channelId) {
      return ApiService.staticGet$("/channel/" + channelId + "/listing").pipe(operators.switchMap(function (response) {
        return ChannelService.mapListing(response.data, response.static, channelId);
      }));
    };

    ChannelService.filter$ = function filter$(channelId) {
      return ApiService.staticGet$("/channel/" + channelId + "/filter").pipe(operators.map(function (response) {
        return response.data;
      }));
    };

    ChannelService.top$ = function top$() {
      return ApiService.staticGet$("/channel/evidence").pipe(operators.map(function (response) {
        return ChannelService.mapChannels(response.data, response.static);
      }));
    };

    ChannelService.subscribe$ = function subscribe$(channelId) {
      return rxjs.of(null);
    };

    ChannelService.unsubscribe$ = function unsubscribe$(channelId) {
      return rxjs.of(null);
    };

    ChannelService.like$ = function like$(channelId) {
      return rxjs.of(null);
    };

    ChannelService.unlike$ = function unlike$(channelId) {
      return rxjs.of(null);
    };

    ChannelService.mapChannel = function mapChannel(channel, isStatic) {
      return isStatic ? ChannelService.fake(new Channel(channel, true)) : new Channel(channel);
    };

    ChannelService.mapChannels = function mapChannels(channels, isStatic) {
      return channels ? channels.map(function (x) {
        return ChannelService.mapChannel(x, isStatic);
      }) : [];
    };

    ChannelService.mapListing = function mapListing(items, isStatic, channelId) {
      return isStatic ? ChannelService.fakeListing(channelId) : rxjs.of(items);
    };

    ChannelService.fake = function fake(item) {
      // console.log('ChannelService.fake', item);
      item.url = item.url + "?channelId=" + item.id;
      item.info.subscribers = 1500 + Math.floor(Math.random() * 200);
      item.info.likes = 500 + Math.floor(Math.random() * 200);
      return item;
    };

    ChannelService.fakeListing = function fakeListing(channelId) {
      return ApiService.staticGet$("/channel/" + channelId + "/detail").pipe(operators.map(function (response) {
        var channel_ = ChannelService.fake(new Channel(response.data, true));
        var info_ = {
          started: false,
          ended: false,
          subscribers: 100,
          subscribed: false,
          likes: 100,
          liked: false
        };
        var image_ = {
          id: 100000,
          width: 700,
          height: 700,
          src: 'https://source.unsplash.com/random/'
        };
        var category_ = {
          id: 10000,
          name: 'Category',
          url: '/ws-events/category.html'
        };
        var event_ = {
          id: 1000,
          type: 'event',
          name: 'Evento',
          title: 'Evento',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/event',
          creationDate: '2020-05-20T08:11:17.827Z',
          startDate: '2020-05-20T08:11:17.827Z',
          picture: image_,
          info: info_,
          channel: channel_
        };
        var picture_ = {
          id: 1000,
          type: 'picture',
          name: 'Picture',
          title: 'Picture',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/document.html',
          picture: image_,
          category: category_
        };
        var product_ = {
          id: 1000,
          type: 'product',
          name: 'Product',
          title: 'Product',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/product.html',
          picture: image_,
          category: category_
        };
        var magazine_ = {
          id: 1000,
          type: 'magazine',
          name: 'Magazine',
          title: 'Magazine',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          url: '/ws-events/product.html',
          picture: image_,
          category: category_
        };
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M'];
        return new Array(250).fill(true).map(function (x, i) {
          var type = 'event';

          if (i > 3) {
            if (i % 5 === 0) {
              type = 'picture';
            }

            if (i % 7 === 0) {
              type = 'product';
            }

            if (i % 11 === 0) {
              type = 'magazine';
            }
          }

          var item;

          switch (type) {
            case 'picture':
              item = Object.assign({}, picture_);
              break;

            case 'product':
              item = Object.assign({}, product_);
              break;

            case 'magazine':
              item = Object.assign({}, magazine_);
              break;

            case 'event':
              item = Object.assign({}, event_);
              break;
          }

          item.id = (channelId - 100) * 1000 + 1 + i;
          item.name = item.title = item.name + " " + letters[(item.id - 1) % 10];
          item.type = type;

          if (item.picture) {
            item.picture = Object.assign({}, image_, {
              id: 100001 + i,
              width: 700,
              height: [700, 900, 1100][i % 3]
            });
          }

          if (item.info) {
            item.info = Object.assign({}, info_);
          }

          if (item.channel) {
            item.channel = Object.assign({}, channel_);
          }

          if (item.category) {
            var categoryId = 10001 + i % 10;
            item.category = Object.assign({}, category_, {
              id: categoryId,
              name: 'Category ' + letters[categoryId % 10],
              url: category_.url + "?categoryId=" + categoryId
            });
          }

          switch (type) {
            case 'event':
              item = EventService.fake(new Event(item, true));
              break;

            default:
              item.features = [];
              var filters = FAKE_FILTERS;
              filters.forEach(function (filter) {
                var index = Math.floor(Math.random() * filter.options.length);
                item.features.push(filter.options[index].value);
              });
          }

          return item;
        });
      }) // map(x => new Channel(x))
      );
    };

    return ChannelService;
  }();
  ChannelService.channels$ = ChannelService.channels$().pipe(operators.shareReplay(1));

  var LocationService = /*#__PURE__*/function () {
    function LocationService() {}

    LocationService.get = function get(key) {
      var params = new URLSearchParams(window.location.search); // console.log('LocationService.get', params);

      return params.get(key);
    };

    LocationService.set = function set(keyOrValue, value) {
      var params = new URLSearchParams(window.location.search);

      if (typeof keyOrValue === 'string') {
        params.set(keyOrValue, value);
      } else {
        params.set(keyOrValue, '');
      }

      this.replace(params); // console.log('LocationService.set', params, keyOrValue, value);
    };

    LocationService.replace = function replace(params) {
      if (window.history && window.history.pushState) {
        var title = document.title;
        var url = window.location.href.split('?')[0] + "?" + params.toString();
        window.history.pushState(params.toString(), title, url);
      }
    };

    LocationService.deserialize = function deserialize(key) {
      var encoded = this.get('params');
      return this.decode(key, encoded);
    };

    LocationService.serialize = function serialize(keyOrValue, value) {
      var params = this.deserialize();
      var encoded = this.encode(keyOrValue, value, params);
      this.set('params', encoded);
    };

    LocationService.decode = function decode(key, encoded) {
      var decoded = null;

      if (encoded) {
        var json = window.atob(encoded);
        decoded = JSON.parse(json);
      }

      if (key && decoded) {
        decoded = decoded[key];
      }

      return decoded || null;
    };

    LocationService.encode = function encode(keyOrValue, value, params) {
      params = params || {};
      var encoded = null;

      if (typeof keyOrValue === 'string') {
        params[keyOrValue] = value;
      } else {
        params = keyOrValue;
      }

      var json = JSON.stringify(params);
      encoded = window.btoa(json);
      return encoded;
    };

    return LocationService;
  }();

  var PageComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(PageComponent, _Component);

    function PageComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = PageComponent.prototype;

    _proto.onInit = function onInit() {};

    return PageComponent;
  }(rxcomp.Component);
  PageComponent.meta = {
    selector: '[page]'
  };

  var AsideComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(AsideComponent, _PageComponent);

    function AsideComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = AsideComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var channelId = LocationService.get('channelId');
      channelId = channelId ? parseInt(channelId) : null;
      this.channelId = channelId;
      this.channels = [];
      this.load$().pipe(operators.first()).subscribe(function (data) {
        _this.channels = data[0];

        _this.pushChanges();
      });
    };

    _proto.load$ = function load$() {
      return rxjs.combineLatest(ChannelService.channels$);
    };

    return AsideComponent;
  }(PageComponent);
  AsideComponent.meta = {
    selector: '[aside]'
  };

  var FilterMode = {
    SELECT: 'select',
    AND: 'and',
    OR: 'or'
  };

  var FilterItem = /*#__PURE__*/function () {
    function FilterItem(filter) {
      this.change$ = new rxjs.BehaviorSubject();
      this.mode = FilterMode.SELECT;
      this.placeholder = 'Select';
      this.values = [];
      this.options = [];

      if (filter) {
        if (filter.mode === FilterMode.SELECT) {
          filter.options.unshift({
            label: filter.placeholder,
            values: []
          });
        }

        Object.assign(this, filter);
      }
    }

    var _proto = FilterItem.prototype;

    _proto.filter = function filter(item, value) {
      return true; // item.options.indexOf(value) !== -1;
    };

    _proto.match = function match(item) {
      var _this = this;

      var match;

      if (this.mode === FilterMode.OR) {
        match = this.values.length ? false : true;
        this.values.forEach(function (value) {
          match = match || _this.filter(item, value);
        });
      } else {
        match = true;
        this.values.forEach(function (value) {
          match = match && _this.filter(item, value);
        });
      }

      return match;
    };

    _proto.getSelectedOption = function getSelectedOption() {
      var _this2 = this;

      return this.options.find(function (x) {
        return _this2.has(x);
      });
    };

    _proto.getLabel = function getLabel() {
      if (this.mode === FilterMode.SELECT) {
        var selectedOption = this.getSelectedOption();
        return selectedOption ? selectedOption.label : this.placeholder;
      } else {
        return this.label;
      }
    };

    _proto.has = function has(item) {
      return this.values.indexOf(item.value) !== -1;
    };

    _proto.set = function set(item) {
      if (this.mode === FilterMode.SELECT) {
        this.values = [];
      }

      var index = this.values.indexOf(item.value);

      if (index === -1) {
        if (item.value !== undefined) {
          this.values.push(item.value);
        }
      }

      if (this.mode === FilterMode.SELECT) {
        this.placeholder = item.label;
      } // console.log('FilterItem.set', item);


      this.change$.next();
    };

    _proto.remove = function remove(item) {
      var index = this.values.indexOf(item.value);

      if (index !== -1) {
        this.values.splice(index, 1);
      }

      if (this.mode === FilterMode.SELECT) {
        var first = this.options[0];
        this.placeholder = first.label;
      } // console.log('FilterItem.remove', item);


      this.change$.next();
    };

    _proto.toggle = function toggle(item) {
      if (this.has(item)) {
        this.remove(item);
      } else {
        this.set(item);
      }
    };

    _proto.toggleActive = function toggleActive() {
      this.active = !this.active;
    };

    return FilterItem;
  }();

  var FilterService = /*#__PURE__*/function () {
    function FilterService(options, initialParams, callback) {
      var filters = {};
      this.filters = filters;

      if (options) {
        Object.keys(options).forEach(function (key) {
          var filter = new FilterItem(options[key]);

          if (typeof callback === 'function') {
            callback(key, filter);
          }

          filters[key] = filter;
        });
        this.deserialize(this.filters, initialParams);
      }
    }

    var _proto = FilterService.prototype;

    _proto.getParamsCount = function getParamsCount(params) {
      if (params) {
        var paramsCount = Object.keys(params).reduce(function (p, c, i) {
          var values = params[c];
          return p + (values ? values.length : 0);
        }, 0);
        return paramsCount;
      } else {
        return 0;
      }
    };

    _proto.deserialize = function deserialize(filters, initialParams) {
      var params;

      if (initialParams && this.getParamsCount(initialParams)) {
        params = initialParams;
      }

      var locationParams = LocationService.deserialize('filters');

      if (locationParams && this.getParamsCount(locationParams)) {
        params = locationParams;
      }

      if (params) {
        Object.keys(filters).forEach(function (key) {
          filters[key].values = params[key] || [];
        });
      }

      return filters;
    };

    _proto.serialize = function serialize(filters) {
      var params = {};
      var any = false;
      Object.keys(filters).forEach(function (x) {
        var filter = filters[x];

        if (filter.values && filter.values.length > 0) {
          params[x] = filter.values;
          any = true;
        }
      });

      if (!any) {
        params = null;
      } // console.log('FilterService.serialize', params);


      LocationService.serialize('filters', params);
      return params;
    };

    _proto.items$ = function items$(items) {
      var _this = this;

      var filters = this.filters;
      var changes = Object.keys(filters).map(function (key) {
        return filters[key].change$;
      });
      this.updateFilterStates(filters, items, true);
      return rxjs.merge.apply(void 0, changes).pipe(operators.auditTime(1), // tap(() => console.log(filters)),
      operators.tap(function () {
        return _this.serialize(filters);
      }), operators.map(function () {
        return _this.filterItems(items);
      }), operators.tap(function () {
        return _this.updateFilterStates(filters, items);
      }));
    };

    _proto.filterItems = function filterItems(items, skipFilter) {
      var _this2 = this;

      var filters = Object.keys(this.filters).map(function (x) {
        return _this2.filters[x];
      }).filter(function (x) {
        return x.values && x.values.length > 0;
      });
      items = items.filter(function (item) {
        var has = true;
        filters.forEach(function (filter) {
          if (filter !== skipFilter) {
            has = has && filter.match(item);
          }
        });
        return has;
      });
      return items;
    };

    _proto.updateFilterStates = function updateFilterStates(filters, items, initialCount) {
      var _this3 = this;

      Object.keys(filters).forEach(function (x) {
        var filter = filters[x];
        var filteredItems = initialCount ? items : _this3.filterItems(items, filter);
        filter.options.forEach(function (option) {
          var count = 0;

          if (option.value) {
            var i = 0;

            while (i < filteredItems.length) {
              var item = filteredItems[i];

              if (filter.filter(item, option.value)) {
                count++;
              }

              i++;
            }
          } else {
            count = filteredItems.length;
          }

          initialCount ? option.initialCount = count : option.count = count;
          option.disabled = count === 0;
        });

        if (initialCount) {
          filter.options.sort(function (a, b) {
            return b.initialCount - a.initialCount;
          });
        }
      });
    };

    return FilterService;
  }();

  var ChannelPageComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(ChannelPageComponent, _PageComponent);

    function ChannelPageComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = ChannelPageComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.grid = {
        mode: 1,
        width: 350,
        gutter: 2
      };
      this.channels = null;
      this.channel = null;
      this.listing = null;
      this.filters = null;
      this.secondaryFiltersVisible = false;
      this.secondaryFilters = null;
      this.activeFilters = null;
      this.filteredItems = [];
      this.load$().pipe(operators.first()).subscribe(function (data) {
        _this.channels = data[0];
        _this.channel = data[1];
        _this.listing = data[2];

        _this.setFilters(data[3]);

        _this.startFilter(_this.listing);

        _this.pushChanges();
      });
    };

    _proto.load$ = function load$() {
      var channelId = LocationService.get('channelId');
      return rxjs.combineLatest(ChannelService.channels$, ChannelService.detail$(channelId), ChannelService.listing$(channelId), ChannelService.filter$(channelId));
    };

    _proto.setFilters = function setFilters(filters) {
      var _this2 = this;

      var filterObject = {
        type: {
          label: 'Type',
          mode: 'select',
          options: [{
            value: 'event',
            label: 'Event'
          }, {
            value: 'picture',
            label: 'Picture'
          }, {
            value: 'product',
            label: 'Product'
          }, {
            value: 'magazine',
            label: 'Magazine'
          }]
        }
      };
      filters.forEach(function (filter) {
        filter.mode = 'or';
        filterObject[filter.key] = filter;
      });
      var filterService = this.filterService = new FilterService(filterObject, {}, function (key, filter) {
        switch (key) {
          case 'type':
            filter.filter = function (item, value) {
              return item.type === value;
            };

            break;

          case 'tag':
            filter.filter = function (item, value) {
              return item.tags.indexOf(value) !== -1;
            };

            break;

          default:
            filter.filter = function (item, value) {
              return item.features.indexOf(value) !== -1;
            };

        }
      });
      this.filters = filterService.filters;
      this.secondaryFilters = Object.keys(this.filters).filter(function (key) {
        return key !== 'type';
      }).map(function (key) {
        return _this2.filters[key];
      });
    };

    _proto.startFilter = function startFilter(items) {
      var _this3 = this;

      this.filterService.items$(items).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (filteredItems) {
        _this3.filteredItems = [];
        _this3.activeFilters = [];

        _this3.pushChanges();

        setTimeout(function () {
          _this3.filteredItems = filteredItems;
          _this3.activeFilters = _this3.secondaryFilters.map(function (f) {
            f = new FilterItem(f);
            f.options = f.options.filter(function (o) {
              return f.has(o);
            });
            return f;
          }).filter(function (f) {
            return f.options.length;
          });

          _this3.pushChanges();
        }, 1); // console.log('ChannelPageComponent.filteredItems', filteredItems.length);
      });
    };

    _proto.toggleGrid = function toggleGrid() {
      this.grid.width = this.grid.width === 350 ? 525 : 350;
      this.pushChanges();
    };

    _proto.toggleFilters = function toggleFilters() {
      this.secondaryFiltersVisible = !this.secondaryFiltersVisible;
      this.pushChanges();
    };

    return ChannelPageComponent;
  }(PageComponent);
  ChannelPageComponent.meta = {
    selector: '[channel-page]'
  };

  var ChannelComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(ChannelComponent, _Component);

    function ChannelComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ChannelComponent.prototype;

    _proto.toggleSubscribe = function toggleSubscribe() {
      var _this = this;

      var flag = this.channel.info.subscribed;
      ChannelService[flag ? 'unsubscribe$' : 'subscribe$'](this.channel.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this.channel.info.subscribed = flag;

        if (flag) {
          _this.channel.info.subscribers++;
        } else {
          _this.channel.info.subscribers--;
        }

        _this.pushChanges();
      });
    };

    _proto.toggleLike = function toggleLike() {
      var _this2 = this;

      var flag = this.channel.info.liked;
      ChannelService[flag ? 'unlike$' : 'like$'](this.channel.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this2.channel.info.liked = flag;

        if (flag) {
          _this2.channel.info.likes++;
        } else {
          _this2.channel.info.likes--;
        }

        _this2.pushChanges();
      });
    };

    return ChannelComponent;
  }(rxcomp.Component);
  ChannelComponent.meta = {
    selector: '[channel]',
    inputs: ['channel']
  };

  var ClickOutsideDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(ClickOutsideDirective, _Directive);

    function ClickOutsideDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = ClickOutsideDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.initialFocus = false;

      var _getContext = rxcomp.getContext(this),
          module = _getContext.module,
          node = _getContext.node,
          parentInstance = _getContext.parentInstance,
          selector = _getContext.selector;

      var event$ = this.event$ = rxjs.fromEvent(document, 'click').pipe(operators.filter(function (event) {
        var target = event.target; // console.log('ClickOutsideDirective.onClick', this.element.nativeElement, target, this.element.nativeElement.contains(target));
        // const documentContained: boolean = Boolean(document.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        // console.log(target, documentContained);

        var clickedInside = node.contains(target) || !document.contains(target);

        if (!clickedInside) {
          if (_this.initialFocus) {
            _this.initialFocus = false;
            return true;
          }
        } else {
          _this.initialFocus = true;
        }
      }), operators.shareReplay(1));
      var expression = node.getAttribute("(clickOutside)");

      if (expression) {
        var outputFunction = module.makeFunction(expression, ['$event']);
        event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          module.resolve(outputFunction, parentInstance, event);
        });
      } else {
        parentInstance.clickOutside$ = event$;
      }
    };

    return ClickOutsideDirective;
  }(rxcomp.Directive);
  ClickOutsideDirective.meta = {
    selector: "[(clickOutside)]"
  };

  var CountPipe = /*#__PURE__*/function (_Pipe) {
    _inheritsLoose(CountPipe, _Pipe);

    function CountPipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    CountPipe.isNumber = function isNumber(value) {
      return typeof value === 'number' && isFinite(value);
    };

    CountPipe.transform = function transform(value) {
      if (!CountPipe.isNumber(value)) {
        return value;
      }

      value = parseInt(value);
      var count = '';

      if (value > 1000000) {
        value = Math.floor(value / 100000) / 10;
        count = value + 'M';
      } else if (value > 1000) {
        value = Math.floor(value / 100) / 10;
        count = value + 'k';
      } else {
        return value;
      }

      return count;
    };

    return CountPipe;
  }(rxcomp.Pipe);
  CountPipe.meta = {
    name: 'count'
  };

  var LocaleType = {
    DateFormats: 'dateFormats',
    TimeFormats: 'timeFormats',
    DayPeriods: 'dayPeriods',
    Days: 'days',
    Months: 'months',
    Eras: 'eras',
    NumberSymbols: 'numberSymbols'
  };
  var LocaleStyle = {
    // For `en-US`, 'M/d/yy, h:mm a'` (Example: `6/15/15, 9:03 AM`)
    Short: 'short',
    // For `en-US`, `'MMM d, y, h:mm:ss a'` (Example: `Jun 15, 2015, 9:03:01 AM`)
    Medium: 'medium',
    // For `en-US`, `'MMMM d, y, h:mm:ss a z'` (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
    Long: 'long',
    // For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'` (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
    Full: 'full'
  };
  var LocaleLength = {
    // 1 character for `en-US`. For example: 'S'
    Narrow: 'narrow',
    // 2 characters for `en-US`, For example: 'Su'
    Short: 'short',
    // 3 characters for `en-US`. For example: 'Sun'
    Abbreviated: 'abbreviated',
    // Full length for `en-US`. For example: 'Sunday'
    Wide: 'wide'
  };
  var LocaleDay = {
    Sunday: 'sunday',
    Monday: 'monday',
    Tuesday: 'tuesday',
    Wednesday: 'wednesday',
    Thursday: 'thursday',
    Friday: 'friday',
    Saturday: 'saturday'
  };
  var LocaleMonth = {
    January: 'january',
    February: 'february',
    March: 'march',
    April: 'april',
    May: 'may',
    June: 'june',
    July: 'july',
    August: 'august',
    September: 'september',
    October: 'october',
    November: 'november',
    December: 'december'
  };
  var LocaleDayPeriod = {
    AM: 'am',
    PM: 'pm'
  };
  var LocaleEra = {
    BC: 'bc',
    AD: 'ad'
  };
  var LocaleNumberSymbol = {
    // Decimal separator. For `en-US`, the dot character. Example : 2,345`.`67
    Decimal: 'decimal',
    // Grouping separator, typically for thousands. For `en-US`, the comma character. Example: 2`,`345.67
    Group: 'group',
    // List-item separator. Example: 'one, two, and three'
    List: 'list',
    // Sign for percentage (out of 100). Example: 23.4%
    PercentSign: 'percentSign',
    // Sign for positive numbers. Example: +23
    PlusSign: 'plusSign',
    // Sign for negative numbers. Example: -23
    MinusSign: 'minusSign',
    // Computer notation for exponential value (n times a power of 10). Example: 1.2E3
    Exponential: 'exponential',
    // Human-readable format of exponential. Example: 1.2x103
    SuperscriptingExponent: 'superscriptingExponent',
    // Sign for permille (out of 1000). Example: 23.4‰
    PerMille: 'perMille',
    // Infinity, can be used with plus and minus. Example: ∞, +∞, -∞
    Infinity: 'infinity',
    // Not a number. Example: NaN
    NaN: 'nan',
    // Symbol used between time units. Example: 10:52
    TimeSeparator: 'timeSeparator',
    // Decimal separator for currency values (fallback to `Decimal`). Example: $2,345.67
    CurrencyDecimal: 'currencyDecimal',
    // Group separator for currency values (fallback to `Group`). Example: $2,345.67
    CurrencyGroup: 'currencyGroup'
  };
  var locale_it = {
    id: 'it',
    dateFormats: {
      short: 'dd/MM/yy',
      medium: 'd MMM y',
      long: 'd MMMM y',
      full: 'EEEE d MMMM y'
    },
    timeFormats: {
      short: 'HH:mm',
      medium: 'HH:mm:ss',
      long: 'HH:mm:ss z',
      full: 'HH:mm:ss zzzz'
    },
    dayPeriods: {
      narrow: {
        am: 'm',
        pm: 'p'
      },
      abbreviated: {
        am: 'AM',
        pm: 'PM'
      },
      wide: {
        am: 'AM',
        pm: 'PM'
      }
    },
    days: {
      narrow: {
        sunday: 'D',
        monday: 'L',
        tuesday: 'M',
        wednesday: 'M',
        thursday: 'G',
        friday: 'V',
        saturday: 'S'
      },
      short: {
        sunday: 'Do',
        monday: 'Lu',
        tuesday: 'Ma',
        wednesday: 'Me',
        thursday: 'Gi',
        friday: 'Ve',
        saturday: 'Sa'
      },
      abbreviated: {
        sunday: 'Dom',
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Gio',
        friday: 'Ven',
        saturday: 'Sab'
      },
      wide: {
        sunday: 'Domenica',
        monday: 'Lunedì',
        tuesday: 'Martedì',
        wednesday: 'Mercoledì',
        thursday: 'Giovedì',
        friday: 'Venerdì',
        saturday: 'Sabato'
      }
    },
    months: {
      narrow: {
        january: 'G',
        february: 'F',
        march: 'M',
        april: 'A',
        may: 'M',
        june: 'G',
        july: 'L',
        august: 'A',
        september: 'S',
        october: 'O',
        november: 'N',
        december: 'D'
      },
      abbreviated: {
        january: 'Gen',
        february: 'Feb',
        march: 'Mar',
        april: 'Apr',
        may: 'Mag',
        june: 'Giu',
        july: 'Lug',
        august: 'Ago',
        september: 'Set',
        october: 'Ott',
        november: 'Nov',
        december: 'Dic'
      },
      wide: {
        january: 'Gennaio',
        february: 'Febbraio',
        march: 'Marzo',
        april: 'Aprile',
        may: 'Maggio',
        june: 'Giugno',
        july: 'Luglio',
        august: 'Agosto',
        september: 'Settembre',
        october: 'Ottobre',
        november: 'Novembre',
        december: 'Dicembre'
      }
    },
    eras: {
      narrow: {
        bc: 'aC',
        ad: 'dC'
      },
      abbreviated: {
        bc: 'a.C.',
        ad: 'd.C.'
      },
      wide: {
        bc: 'avanti Cristo',
        ad: 'dopo Cristo'
      }
    },
    numberSymbols: {
      decimal: ',',
      group: '.',
      list: ';',
      percentSign: '%',
      plusSign: '+',
      minusSign: '-',
      exponential: 'E',
      superscriptingExponent: '×',
      perMille: '‰',
      infinite: '∞',
      nan: 'NaN',
      timeSeparator: ':' // currencyDecimal: undefined, // fallback to decimal
      // currencyGroup: undefined, // fallback to group

    }
  };

  var LocaleService = /*#__PURE__*/function () {
    function LocaleService() {}

    LocaleService.getLocale = function getLocale() {
      var locale = window.locale || LocaleService.defaultLocale;
      var key = Array.prototype.slice.call(arguments).join('.'); // console.log(key, locale[key]);

      return locale[key] || "{" + key + "}";
    };

    LocaleService.getObjectLocale = function getObjectLocale() {
      // console.log([...arguments].join(','));
      var value;

      for (var i = 0; i < arguments.length; i++) {
        var key = arguments[i];
        value = value ? value[key] : locale[key];
      }

      return value;
    };

    LocaleService.toLocaleString = function toLocaleString(locale, out) {
      var _this = this;

      if (out === void 0) {
        out = {};
      }

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (typeof locale === 'string') {
        out[args.join('.')] = locale;
      } else {
        Object.keys(locale).forEach(function (key) {
          var keys = args.slice();
          keys.push(key);
          out = _this.toLocaleString.apply(_this, [locale[key], out].concat(keys));
        });
      }

      return out;
    };

    LocaleService.toLocaleObject = function toLocaleObject(locale, key, out) {
      var _this2 = this;

      if (out === void 0) {
        out = {};
      }

      if (typeof locale === 'string') {
        out[key] = locale;
      } else {
        if (key) {
          out = out[key] = {};
        }

        Object.keys(locale).forEach(function (key) {
          out = _this2.toLocaleObject(locale[key], key, out);
        });
      }

      return out;
    };

    return LocaleService;
  }();
  LocaleService.defaultLocale = LocaleService.toLocaleString(locale_it);

  var TimezoneLength = {
    Short: 'short',
    ShortGMT: 'shortGmt',
    Long: 'long',
    Extended: 'extended'
  };
  var DatePart = {
    FullYear: 'fullYear',
    Month: 'month',
    Date: 'date',
    Hours: 'hours',
    Minutes: 'minutes',
    Seconds: 'seconds',
    Milliseconds: 'milliseconds',
    Day: 'day'
  };
  /*
  // Converts a value to date. Throws if unable to convert to a date.
  export const ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
  export function parseDate(value) {
  	if (isDate(value)) {
  		return value;
  	}
  	if (typeof value === 'number' && !isNaN(value)) {
  		return new Date(value);
  	}
  	if (typeof value === 'string') {
  		value = value.trim();
  		const parsedNb = parseFloat(value);
  		// any string that only contains numbers, like '1234' but not like '1234hello'
  		if (!isNaN(value - parsedNb)) {
  			return new Date(parsedNb);
  		}
  		if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
  			// For ISO Strings without time the day, month and year must be extracted from the ISO String
        // before Date creation to avoid time offset and errors in the new Date.
        // If we only replace '-' with ',' in the ISO String ('2015,01,01'), and try to create a new
        // date, some browsers (e.g. IE 9) will throw an invalid Date error.
        // If we leave the '-' ('2015-01-01') and try to create a new Date('2015-01-01') the timeoffset
        // is applied.
        // Note: ISO months are 0 for January, 1 for February, ...
  			const [y, m, d] = value.split('-').map(val => +val);
  			return new Date(y, m - 1, d);
  		}
  		const match = value.match(ISO8601_DATE_REGEX);
  		if (match) {
  			return isoStringToDate(match);
  		}
  	}
  	const date = new Date(value);
  	if (!isDate(date)) {
  		throw new Error(`Unable to convert "${value}" into a date`);
  	}
  	return date;
  }

  // Converts a date in ISO8601 to a Date. Used instead of `Date.parse` because of browser discrepancies.
  export function isoStringToDate(match) {
  	const date = new Date(0);
  	let tzHour = 0;
  	let tzMin = 0;
  	// match[8] means that the string contains 'Z' (UTC) or a timezone like '+01:00' or '+0100'
  	const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
  	const timeSetter = match[8] ? date.setUTCHours : date.setHours;
  	// if there is a timezone defined like '+01:00' or '+0100'
  	if (match[9]) {
  		tzHour = Number(match[9] + match[10]);
  		tzMin = Number(match[9] + match[11]);
  	}
  	dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  	const h = Number(match[4] || 0) - tzHour;
  	const m = Number(match[5] || 0) - tzMin;
  	const s = Number(match[6] || 0);
  	const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
  	timeSetter.call(date, h, m, s, ms);
  	return date;
  }

  export function isDate(value) {
  	return value instanceof Date && !isNaN(value.valueOf());
  }
  */

  function padNumber(num, digits, minusSign, trim, negWrap) {
    if (minusSign === void 0) {
      minusSign = '-';
    }

    var neg = '';

    if (negWrap && num <= 0) {
      num = -num + 1;
    } else if (num < 0) {
      num = -num;
      neg = minusSign;
    }

    var strNum = String(num);

    while (strNum.length < digits) {
      strNum = '0' + strNum;
    }

    if (trim) {
      strNum = strNum.substr(strNum.length - digits);
    }

    return neg + strNum;
  }

  var FORMAT_SPLITTER_REGEX = /((?:[^GyMLwWdEabBhHmsSzZO']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
  var JANUARY = 0;
  var THURSDAY = 4;

  var DateTimeService = /*#__PURE__*/function () {
    function DateTimeService() {}

    DateTimeService.getDatePart = function getDatePart(part, date) {
      switch (part) {
        case DatePart.FullYear:
          return date.getFullYear();

        case DatePart.Month:
          return date.getMonth();

        case DatePart.Date:
          return date.getDate();

        case DatePart.Day:
          return date.getDay();

        case DatePart.Hours:
          return date.getHours();

        case DatePart.Minutes:
          return date.getMinutes();

        case DatePart.Seconds:
          return date.getSeconds();

        case DatePart.Milliseconds:
          return date.getMilliseconds();

        default:
          throw new Error("Unknown DatePart value \"" + part + "\".");
      }
    };

    DateTimeService.formatMilliseconds = function formatMilliseconds(milliseconds, digits) {
      var strMs = padNumber(milliseconds, 3);
      return strMs.substr(0, digits);
    };

    DateTimeService.getDateFormatter = function getDateFormatter(name, digits, offset, trim, negWrap) {
      if (offset === void 0) {
        offset = 0;
      }

      if (trim === void 0) {
        trim = false;
      }

      if (negWrap === void 0) {
        negWrap = false;
      }

      return function (date, locale) {
        var part = DateTimeService.getDatePart(name, date);

        if (offset > 0 || part > -offset) {
          part += offset;
        }

        if (name === DatePart.Hours) {
          if (part === 0 && offset === -12) {
            part = 12;
          }
        } else if (name === DatePart.Milliseconds) {
          return DateTimeService.formatMilliseconds(part, digits);
        }

        var localeMinus = LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign);
        return padNumber(part, digits, localeMinus, trim, negWrap);
      };
    };

    DateTimeService.getDateTranslation = function getDateTranslation(date, name, width, extended) {

      switch (name) {
        case LocaleType.Days:
          return LocaleService.getLocale(LocaleType.Days, width, Object.values(LocaleDay)[date.getDay()]);
        // return getLocaleDayNames(width)[Object.values(LocaleDay)[date.getDay()]];

        case LocaleType.Months:
          return LocaleService.getLocale(LocaleType.Months, width, Object.values(LocaleMonth)[date.getMonth()]);

        case LocaleType.DayPeriods:
          var currentHours = date.getHours();
          /*
          const currentMinutes = date.getMinutes();
          if (extended) {
          	const rules = getLocaleExtraDayPeriodRules();
          	const dayPeriods = getLocaleExtraDayPeriods(width);
          	const index = rules.findIndex(rule => {
          		if (Array.isArray(rule)) {
          			// morning, afternoon, evening, night
          			const [from, to] = rule;
          			const afterFrom = currentHours >= from.hours && currentMinutes >= from.minutes;
          			const beforeTo = currentHours < to.hours || (currentHours === to.hours && currentMinutes < to.minutes);
          			// We must account for normal rules that span a period during the day (e.g. 6am-9am)
          			// where `from` is less (earlier) than `to`. But also rules that span midnight (e.g.
          			// 10pm - 5am) where `from` is greater (later!) than `to`.
          			//
          			// In the first case the current time must be BOTH after `from` AND before `to`
          			// (e.g. 8am is after 6am AND before 10am).
          			//
          			// In the second case the current time must be EITHER after `from` OR before `to`
          			// (e.g. 4am is before 5am but not after 10pm; and 11pm is not before 5am but it is
          			// after 10pm).
          			if (from.hours < to.hours) {
          				if (afterFrom && beforeTo) {
          					return true;
          				}
          			} else if (afterFrom || beforeTo) {
          				return true;
          			}
          		} else {
          			// noon or midnight
          			if (rule.hours === currentHours && rule.minutes === currentMinutes) {
          				return true;
          			}
          		}
          		return false;
          	});
          	if (index !== -1) {
          		return dayPeriods[index];
          	}
          }
          */
          // if no rules for the day periods, we use am/pm by default

          return LocaleService.getLocale(LocaleType.DayPeriods, width, currentHours < 12 ? LocaleDayPeriod.AM : LocaleDayPeriod.PM);

        case LocaleType.Eras:
          return LocaleService.getLocale(LocaleType.Eras, width, date.getFullYear() <= 0 ? LocaleEra.BC : LocaleEra.AD);

        default:
          throw new Error("unknown translation type " + name);
      }
    };

    DateTimeService.getDateLocaleFormatter = function getDateLocaleFormatter(name, width, extended) {
      if (extended === void 0) {
        extended = false;
      }

      return function (date) {
        return DateTimeService.getDateTranslation(date, name, width, extended);
      };
    };

    DateTimeService.getWeekFirstThursdayOfYear = function getWeekFirstThursdayOfYear(year) {
      var firstDayOfYear = new Date(year, JANUARY, 1).getDay();
      return new Date(year, 0, 1 + (firstDayOfYear <= THURSDAY ? THURSDAY : THURSDAY + 7) - firstDayOfYear);
    };

    DateTimeService.getWeekThursday = function getWeekThursday(datetime) {
      return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (THURSDAY - datetime.getDay()));
    };

    DateTimeService.getWeekFormatter = function getWeekFormatter(digits, monthBased) {
      if (monthBased === void 0) {
        monthBased = false;
      }

      return function (date, locale) {
        var result;

        if (monthBased) {
          var nbDaysBefore1stDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
          var today = date.getDate();
          result = 1 + Math.floor((today + nbDaysBefore1stDayOfMonth) / 7);
        } else {
          var firstThurs = DateTimeService.getWeekFirstThursdayOfYear(date.getFullYear());
          var thisThurs = DateTimeService.getWeekThursday(date);
          var diff = thisThurs.getTime() - firstThurs.getTime();
          result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
        }

        return padNumber(result, digits, LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign));
      };
    };

    DateTimeService.getTimezoneFormatter = function getTimezoneFormatter(width) {
      return function (date, offset) {
        var zone = -1 * offset;
        var minusSign = LocaleService.getLocale(LocaleType.NumberSymbols, LocaleNumberSymbol.MinusSign);
        var hours = zone > 0 ? Math.floor(zone / 60) : Math.ceil(zone / 60);

        switch (width) {
          case TimezoneLength.Short:
            return (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + padNumber(Math.abs(zone % 60), 2, minusSign);

          case TimezoneLength.ShortGMT:
            return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 1, minusSign);

          case TimezoneLength.Long:
            return 'GMT' + (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);

          case TimezoneLength.Extended:
            if (offset === 0) {
              return 'Z';
            } else {
              return (zone >= 0 ? '+' : '') + padNumber(hours, 2, minusSign) + ':' + padNumber(Math.abs(zone % 60), 2, minusSign);
            }

          default:
            throw new Error("Unknown zone width \"" + width + "\"");
        }
      };
    } // Based on CLDR formats:
    // See complete list: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
    // See also explanations: http://cldr.unicode.org/translation/date-time
    // TODO(ocombe): support all missing cldr formats: Y, U, Q, D, F, e, c, j, J, C, A, v, V, X, x
    // const CACHED_FORMATTERS = {};
    ;

    DateTimeService.getFormatter = function getFormatter(format) {
      /*
      // cache
      if (CACHED_FORMATTERS[format]) {
      return CACHED_FORMATTERS[format];
      }
      */
      var formatter;

      switch (format) {
        // 1 digit representation of the year, e.g. (AD 1 => 1, AD 199 => 199)
        case 'y':
          formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 1, 0, false, true);
          break;
        // 2 digit representation of the year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)

        case 'yy':
          formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 2, 0, true, true);
          break;
        // 3 digit representation of the year, padded (000-999). (e.g. AD 2001 => 01, AD 2010 => 10)

        case 'yyy':
          formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 3, 0, false, true);
          break;
        // 4 digit representation of the year (e.g. AD 1 => 0001, AD 2010 => 2010)

        case 'yyyy':
          formatter = DateTimeService.getDateFormatter(DatePart.FullYear, 4, 0, false, true);
          break;
        // Month of the year (1-12), numeric

        case 'M':
        case 'L':
          formatter = DateTimeService.getDateFormatter(DatePart.Month, 1, 1);
          break;

        case 'MM':
        case 'LL':
          formatter = DateTimeService.getDateFormatter(DatePart.Month, 2, 1);
          break;
        // Day of the month (1-31)

        case 'd':
          formatter = DateTimeService.getDateFormatter(DatePart.Date, 1);
          break;

        case 'dd':
          formatter = DateTimeService.getDateFormatter(DatePart.Date, 2);
          break;
        // Hour in AM/PM, (1-12)

        case 'h':
          formatter = DateTimeService.getDateFormatter(DatePart.Hours, 1, -12);
          break;

        case 'hh':
          formatter = DateTimeService.getDateFormatter(DatePart.Hours, 2, -12);
          break;
        // Hour of the day (0-23)

        case 'H':
          formatter = DateTimeService.getDateFormatter(DatePart.Hours, 1);
          break;
        // Hour in day, padded (00-23)

        case 'HH':
          formatter = DateTimeService.getDateFormatter(DatePart.Hours, 2);
          break;
        // Minute of the hour (0-59)

        case 'm':
          formatter = DateTimeService.getDateFormatter(DatePart.Minutes, 1);
          break;

        case 'mm':
          formatter = DateTimeService.getDateFormatter(DatePart.Minutes, 2);
          break;
        // Second of the minute (0-59)

        case 's':
          formatter = DateTimeService.getDateFormatter(DatePart.Seconds, 1);
          break;

        case 'ss':
          formatter = DateTimeService.getDateFormatter(DatePart.Seconds, 2);
          break;
        // Fractional second

        case 'S':
          formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 1);
          break;

        case 'SS':
          formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 2);
          break;

        case 'SSS':
          formatter = DateTimeService.getDateFormatter(DatePart.Milliseconds, 3);
          break;
        // Month of the year (January, ...), string, format

        case 'MMM':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Abbreviated);
          break;

        case 'MMMM':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Wide);
          break;

        case 'MMMMM':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Narrow);
          break;
        // Month of the year (January, ...), string, standalone

        case 'LLL':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Abbreviated, FormStyle.Standalone);
          break;

        case 'LLLL':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Wide, FormStyle.Standalone);
          break;

        case 'LLLLL':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Months, LocaleLength.Narrow, FormStyle.Standalone);
          break;
        // Day of the Week

        case 'E':
        case 'EE':
        case 'EEE':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Abbreviated);
          break;

        case 'EEEE':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Wide);
          break;

        case 'EEEEE':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Narrow);
          break;

        case 'EEEEEE':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Days, LocaleLength.Short);
          break;
        // Generic period of the day (am-pm)

        case 'a':
        case 'aa':
        case 'aaa':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated);
          break;

        case 'aaaa':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide);
          break;

        case 'aaaaa':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow);
          break;
        // Extended period of the day (midnight, at night, ...), standalone

        case 'b':
        case 'bb':
        case 'bbb':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated, FormStyle.Standalone, true);
          break;

        case 'bbbb':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide, FormStyle.Standalone, true);
          break;

        case 'bbbbb':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow, FormStyle.Standalone, true);
          break;
        // Extended period of the day (midnight, night, ...), standalone

        case 'B':
        case 'BB':
        case 'BBB':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Abbreviated, FormStyle.Format, true);
          break;

        case 'BBBB':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Wide, FormStyle.Format, true);
          break;

        case 'BBBBB':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.DayPeriods, LocaleLength.Narrow, FormStyle.Format, true);
          break;
        // Era name (AD/BC)

        case 'GGGGG':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Narrow);
          break;

        case 'G':
        case 'GG':
        case 'GGG':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Abbreviated);
          break;

        case 'GGGG':
          formatter = DateTimeService.getDateLocaleFormatter(LocaleType.Eras, LocaleLength.Wide);
          break;
        // Week of the year (1, ... 52)

        case 'w':
          formatter = DateTimeService.getWeekFormatter(1);
          break;

        case 'ww':
          formatter = DateTimeService.getWeekFormatter(2);
          break;
        // Week of the month (1, ...)

        case 'W':
          formatter = DateTimeService.getWeekFormatter(1, true);
          break;
        // Timezone ISO8601 short format (-0430)

        case 'Z':
        case 'ZZ':
        case 'ZZZ':
          formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Short);
          break;
        // Timezone ISO8601 extended format (-04:30)

        case 'ZZZZZ':
          formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Extended);
          break;
        // Timezone GMT short format (GMT+4)

        case 'O':
        case 'OO':
        case 'OOO':
          formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.ShortGMT);
          break;
        // Should be location, but fallback to format O instead because we don't have the data yet

        case 'z':
        case 'zz':
        case 'zzz':
          formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.ShortGMT);
          break;
        // Timezone GMT long format (GMT+0430)

        case 'OOOO':
        case 'ZZZZ':
          formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Long);
          break;
        // Should be location, but fallback to format O instead because we don't have the data yet

        case 'zzzz':
          formatter = DateTimeService.getTimezoneFormatter(TimezoneLength.Long);
          break;

        default:
          return null;
      }
      /*
      // cache
      CACHED_FORMATTERS[format] = formatter;
      */


      return formatter;
    };

    DateTimeService.setTimezoneOffset = function setTimezoneOffset(timezone, fallback) {
      // Support: IE 9-11 only, Edge 13-15+
      // IE/Edge do not "understand" colon (`:`) in timezone
      timezone = timezone.replace(/:/g, '');
      var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
      return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
    };

    DateTimeService.dateTimezoneToLocal = function dateTimezoneToLocal(date, timezone, reverse) {
      var reverseValue = reverse ? -1 : 1;
      var dateTimezoneOffset = date.getTimezoneOffset();
      var timezoneOffset = DateTimeService.setTimezoneOffset(timezone, dateTimezoneOffset);
      var minutes = reverseValue * (timezoneOffset - dateTimezoneOffset);
      date = new Date(date.getTime());
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    };

    DateTimeService.parseDate = function parseDate(value) {
      if (value instanceof Date) {
        return value;
      }

      return Date.parse(value);
    } // const CACHED_FORMATS = {};
    ;

    DateTimeService.getNamedFormat = function getNamedFormat(format) {
      /*
      // cache
      const localeId = locale.id;
      CACHED_FORMATS[localeId] = CACHED_FORMATS[localeId] || {};
      if (CACHED_FORMATS[localeId][format]) {
      return CACHED_FORMATS[localeId][format];
      }
      */
      var formatValue = '';

      switch (format) {
        case 'shortDate':
          formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Short);
          break;

        case 'mediumDate':
          formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Medium);
          break;

        case 'longDate':
          formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Long);
          break;

        case 'fullDate':
          formatValue = LocaleService.getLocale(LocaleType.DateFormats, LocaleStyle.Full);
          break;

        case 'shortTime':
          formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Short);
          break;

        case 'mediumTime':
          formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Medium);
          break;

        case 'longTime':
          formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Long);
          break;

        case 'fullTime':
          formatValue = LocaleService.getLocale(LocaleType.TimeFormats, LocaleStyle.Full);
          break;

        case 'short':
          var shortTime = DateTimeService.getNamedFormat('shortTime');
          var shortDate = DateTimeService.getNamedFormat('shortDate');
          formatValue = shortTime + " " + shortDate;
          break;

        case 'medium':
          var mediumTime = DateTimeService.getNamedFormat('mediumTime');
          var mediumDate = DateTimeService.getNamedFormat('mediumDate');
          formatValue = mediumTime + " " + mediumDate;
          break;

        case 'long':
          var longTime = DateTimeService.getNamedFormat('longTime');
          var longDate = DateTimeService.getNamedFormat('longDate');
          formatValue = longTime + " " + longDate;
          break;

        case 'full':
          var fullTime = DateTimeService.getNamedFormat('fullTime');
          var fullDate = DateTimeService.getNamedFormat('fullDate');
          formatValue = fullTime + " " + fullDate;
          break;
      }
      /*
      // cache
      if (formatValue) {
      CACHED_FORMATS[localeId][format] = formatValue;
      }
      */


      return formatValue;
    };

    DateTimeService.formatDate = function formatDate(value, format, timezone) {
      var date = DateTimeService.parseDate(value); // console.log(date);
      // named formats

      var namedFormat = DateTimeService.getNamedFormat(format);
      format = namedFormat || format;
      var formats = [];
      var match;

      while (format) {
        match = FORMAT_SPLITTER_REGEX.exec(format);

        if (match) {
          formats = formats.concat(match.slice(1));
          var part = formats.pop();

          if (!part) {
            break;
          }

          format = part;
        } else {
          formats.push(format);
          break;
        }
      } // console.log(formats);


      var dateTimezoneOffset = date.getTimezoneOffset();

      if (timezone) {
        dateTimezoneOffset = DateTimeService.setTimezoneOffset(timezone, dateTimezoneOffset);
        date = DateTimeService.dateTimezoneToLocal(date, timezone, true);
      } // console.log(dateTimezoneOffset);


      var text = '';
      formats.forEach(function (format) {
        var formatter = DateTimeService.getFormatter(format);

        if (formatter) {
          text += formatter(date, dateTimezoneOffset);
        } else {
          text += format === "''" ? "'" : format.replace(/(^'|'$)/g, '').replace(/''/g, "'");
        }
      });
      return text;
    };

    return DateTimeService;
  }();

  var DatePipe = /*#__PURE__*/function (_Pipe) {
    _inheritsLoose(DatePipe, _Pipe);

    function DatePipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    DatePipe.transform = function transform(value, format) {
      if (format === void 0) {
        format = 'short';
      }

      return DateTimeService.formatDate(value, format);
    };

    return DatePipe;
  }(rxcomp.Pipe);
  DatePipe.meta = {
    name: 'date'
  };
  /**
   *
   * * The result of this pipe is not reevaluated when the input is mutated. To avoid the need to
   * reformat the date on every change-detection cycle, treat the date as an immutable object
   * and change the reference when the pipe needs to run again.
   *
   * ### Pre-defined format options
   *
   * Examples are given in `en-US` locale.
   *
   * - `'short'`: equivalent to `'M/d/yy, h:mm a'` (`6/15/15, 9:03 AM`).
   * - `'medium'`: equivalent to `'MMM d, y, h:mm:ss a'` (`Jun 15, 2015, 9:03:01 AM`).
   * - `'long'`: equivalent to `'MMMM d, y, h:mm:ss a z'` (`June 15, 2015 at 9:03:01 AM
   * GMT+1`).
   * - `'full'`: equivalent to `'EEEE, MMMM d, y, h:mm:ss a zzzz'` (`Monday, June 15, 2015 at
   * 9:03:01 AM GMT+01:00`).
   * - `'shortDate'`: equivalent to `'M/d/yy'` (`6/15/15`).
   * - `'mediumDate'`: equivalent to `'MMM d, y'` (`Jun 15, 2015`).
   * - `'longDate'`: equivalent to `'MMMM d, y'` (`June 15, 2015`).
   * - `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` (`Monday, June 15, 2015`).
   * - `'shortTime'`: equivalent to `'h:mm a'` (`9:03 AM`).
   * - `'mediumTime'`: equivalent to `'h:mm:ss a'` (`9:03:01 AM`).
   * - `'longTime'`: equivalent to `'h:mm:ss a z'` (`9:03:01 AM GMT+1`).
   * - `'fullTime'`: equivalent to `'h:mm:ss a zzzz'` (`9:03:01 AM GMT+01:00`).
   *
   * ### Custom format options
   *
   * You can construct a format string using symbols to specify the components
   * of a date-time value, as described in the following table.
   * Format details depend on the locale.
   * Fields marked with (*) are only available in the extra data set for the given locale.
   *
   *  | Field type         | Format      | Description                                                   | Example Value                                              |
   *  |--------------------|-------------|---------------------------------------------------------------|------------------------------------------------------------|
   *  | Era                | G, GG & GGG | Abbreviated                                                   | AD                                                         |
   *  |                    | GGGG        | Wide                                                          | Anno Domini                                                |
   *  |                    | GGGGG       | Narrow                                                        | A                                                          |
   *  | Year               | y           | Numeric: minimum digits                                       | 2, 20, 201, 2017, 20173                                    |
   *  |                    | yy          | Numeric: 2 digits + zero padded                               | 02, 20, 01, 17, 73                                         |
   *  |                    | yyy         | Numeric: 3 digits + zero padded                               | 002, 020, 201, 2017, 20173                                 |
   *  |                    | yyyy        | Numeric: 4 digits or more + zero padded                       | 0002, 0020, 0201, 2017, 20173                              |
   *  | Month              | M           | Numeric: 1 digit                                              | 9, 12                                                      |
   *  |                    | MM          | Numeric: 2 digits + zero padded                               | 09, 12                                                     |
   *  |                    | MMM         | Abbreviated                                                   | Sep                                                        |
   *  |                    | MMMM        | Wide                                                          | September                                                  |
   *  |                    | MMMMM       | Narrow                                                        | S                                                          |
   *  | Month standalone   | L           | Numeric: 1 digit                                              | 9, 12                                                      |
   *  |                    | LL          | Numeric: 2 digits + zero padded                               | 09, 12                                                     |
   *  |                    | LLL         | Abbreviated                                                   | Sep                                                        |
   *  |                    | LLLL        | Wide                                                          | September                                                  |
   *  |                    | LLLLL       | Narrow                                                        | S                                                          |
   *  | Week of year       | w           | Numeric: minimum digits                                       | 1... 53                                                    |
   *  |                    | ww          | Numeric: 2 digits + zero padded                               | 01... 53                                                   |
   *  | Week of month      | W           | Numeric: 1 digit                                              | 1... 5                                                     |
   *  | Day of month       | d           | Numeric: minimum digits                                       | 1                                                          |
   *  |                    | dd          | Numeric: 2 digits + zero padded                               | 01                                                          |
   *  | Week day           | E, EE & EEE | Abbreviated                                                   | Tue                                                        |
   *  |                    | EEEE        | Wide                                                          | Tuesday                                                    |
   *  |                    | EEEEE       | Narrow                                                        | T                                                          |
   *  |                    | EEEEEE      | Short                                                         | Tu                                                         |
   *  | Period             | a, aa & aaa | Abbreviated                                                   | am/pm or AM/PM                                             |
   *  |                    | aaaa        | Wide (fallback to `a` when missing)                           | ante meridiem/post meridiem                                |
   *  |                    | aaaaa       | Narrow                                                        | a/p                                                        |
   *  | Period*            | B, BB & BBB | Abbreviated                                                   | mid.                                                       |
   *  |                    | BBBB        | Wide                                                          | am, pm, midnight, noon, morning, afternoon, evening, night |
   *  |                    | BBBBB       | Narrow                                                        | md                                                         |
   *  | Period standalone* | b, bb & bbb | Abbreviated                                                   | mid.                                                       |
   *  |                    | bbbb        | Wide                                                          | am, pm, midnight, noon, morning, afternoon, evening, night |
   *  |                    | bbbbb       | Narrow                                                        | md                                                         |
   *  | Hour 1-12          | h           | Numeric: minimum digits                                       | 1, 12                                                      |
   *  |                    | hh          | Numeric: 2 digits + zero padded                               | 01, 12                                                     |
   *  | Hour 0-23          | H           | Numeric: minimum digits                                       | 0, 23                                                      |
   *  |                    | HH          | Numeric: 2 digits + zero padded                               | 00, 23                                                     |
   *  | Minute             | m           | Numeric: minimum digits                                       | 8, 59                                                      |
   *  |                    | mm          | Numeric: 2 digits + zero padded                               | 08, 59                                                     |
   *  | Second             | s           | Numeric: minimum digits                                       | 0... 59                                                    |
   *  |                    | ss          | Numeric: 2 digits + zero padded                               | 00... 59                                                   |
   *  | Fractional seconds | S           | Numeric: 1 digit                                              | 0... 9                                                     |
   *  |                    | SS          | Numeric: 2 digits + zero padded                               | 00... 99                                                   |
   *  |                    | SSS         | Numeric: 3 digits + zero padded (= milliseconds)              | 000... 999                                                 |
   *  | Zone               | z, zz & zzz | Short specific non location format (fallback to O)            | GMT-8                                                      |
   *  |                    | zzzz        | Long specific non location format (fallback to OOOO)          | GMT-08:00                                                  |
   *  |                    | Z, ZZ & ZZZ | ISO8601 basic format                                          | -0800                                                      |
   *  |                    | ZZZZ        | Long localized GMT format                                     | GMT-8:00                                                   |
   *  |                    | ZZZZZ       | ISO8601 extended format + Z indicator for offset 0 (= XXXXX)  | -08:00                                                     |
   *  |                    | O, OO & OOO | Short localized GMT format                                    | GMT-8                                                      |
   *  |                    | OOOO        | Long localized GMT format                                     | GMT-08:00                                                  |
   *
   * Note that timezone correction is not applied to an ISO string that has no time component, such as "2016-09-19"
   *
   * ### Format examples
   *
   * These examples transform a date into various formats,
   * assuming that `dateObj` is a JavaScript `Date` object for
   * year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11,
   * given in the local time for the `en-US` locale.
   *
   * ```
   * {{ dateObj | date }}               // output is 'Jun 15, 2015'
   * {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
   * {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
   * {{ dateObj | date:'mm:ss' }}       // output is '43:11'
   * ```
   *
   */

  var DROPDOWN_ID = 1000000;

  var DropdownDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(DropdownDirective, _Directive);

    function DropdownDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = DropdownDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      var trigger = node.getAttribute('dropdown-trigger');
      this.trigger = trigger ? node.querySelector(trigger) : node;
      this.opened = null;
      this.onClick = this.onClick.bind(this);
      this.onDocumentClick = this.onDocumentClick.bind(this);
      this.openDropdown = this.openDropdown.bind(this);
      this.closeDropdown = this.closeDropdown.bind(this);
      this.addListeners();
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
        // console.log('DropdownDirective', id, this['dropdown-item']);
        if (_this.id === id) {
          node.classList.add('dropped');
        } else {
          node.classList.remove('dropped');
        }
      });
    };

    _proto.onClick = function onClick(event) {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      if (this.opened === null) {
        this.openDropdown();
      } else {
        var dropdownItemNode = node.querySelector('[dropdown-item]'); // console.log('dropdownItemNode', dropdownItemNode);

        if (!dropdownItemNode) {
          // if (this.trigger !== node) {
          this.closeDropdown();
        }
      }
    };

    _proto.onDocumentClick = function onDocumentClick(event) {
      var _getContext3 = rxcomp.getContext(this),
          node = _getContext3.node;

      var clickedInside = node === event.target || node.contains(event.target);

      if (!clickedInside) {
        this.closeDropdown();
      }
    };

    _proto.openDropdown = function openDropdown() {
      if (this.opened === null) {
        this.opened = true;
        this.addDocumentListeners();
        DropdownDirective.dropdown$.next(this.id);
        this.dropped.next(this.id);
      }
    };

    _proto.closeDropdown = function closeDropdown() {
      if (this.opened !== null) {
        this.removeDocumentListeners();
        this.opened = null;

        if (DropdownDirective.dropdown$.getValue() === this.id) {
          DropdownDirective.dropdown$.next(null);
          this.dropped.next(null);
        }
      }
    };

    _proto.addListeners = function addListeners() {
      this.trigger.addEventListener('click', this.onClick);
    };

    _proto.addDocumentListeners = function addDocumentListeners() {
      document.addEventListener('click', this.onDocumentClick);
    };

    _proto.removeListeners = function removeListeners() {
      this.trigger.removeEventListener('click', this.onClick);
    };

    _proto.removeDocumentListeners = function removeDocumentListeners() {
      document.removeEventListener('click', this.onDocumentClick);
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
      this.removeDocumentListeners();
    };

    DropdownDirective.nextId = function nextId() {
      return DROPDOWN_ID++;
    };

    _createClass(DropdownDirective, [{
      key: "id",
      get: function get() {
        return this.dropdown || this.id_ || (this.id_ = DropdownDirective.nextId());
      }
    }]);

    return DropdownDirective;
  }(rxcomp.Directive);
  DropdownDirective.meta = {
    selector: '[dropdown]',
    inputs: ['dropdown', 'dropdown-trigger'],
    outputs: ['dropped']
  };
  DropdownDirective.dropdown$ = new rxjs.BehaviorSubject(null);

  var DropdownItemDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(DropdownItemDirective, _Directive);

    function DropdownItemDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = DropdownItemDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('dropdown-item');
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
        // console.log('DropdownItemDirective', id, this['dropdown-item']);
        if (_this.id === id) {
          node.classList.add('dropped');
        } else {
          node.classList.remove('dropped');
        }
      });
    };

    _createClass(DropdownItemDirective, [{
      key: "id",
      get: function get() {
        return this['dropdown-item'];
      }
    }]);

    return DropdownItemDirective;
  }(rxcomp.Directive);
  DropdownItemDirective.meta = {
    selector: '[dropdown-item], [[dropdown-item]]',
    inputs: ['dropdown-item']
  };

  var EventDateMode = {
    Live: 'live',
    Countdown: 'countdown',
    WatchRelative: 'watchRelative',
    Relative: 'relative',
    Date: 'date'
  };
  var SECOND = 1000;
  var MINUTE = SECOND * 60;
  var HOUR = MINUTE * 60;

  var to10 = function to10(value) {
    return value < 10 ? '0' + value : value;
  };

  var EventDateComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(EventDateComponent, _Component);

    function EventDateComponent() {
      return _Component.apply(this, arguments) || this;
    }

    EventDateComponent.hoursDiff = function hoursDiff(date) {
      var now = new Date();
      var diff = date - now;
      var hoursDiff = Math.abs(Math.floor(diff / 1000 / 60 / 60));
      return hoursDiff;
    };

    EventDateComponent.getMode = function getMode(item) {
      if (!item.past && !item.info.started) {
        var now = new Date();

        if (now > item.startDate) {
          item.info.started = true;
        }
      }

      if (item.live) {
        return EventDateMode.Live;
      } else if (item.incoming) {
        return EventDateMode.Countdown;
      }

      var hoursDiff = EventDateComponent.hoursDiff(item.startDate);

      if (item.past && hoursDiff < 24) {
        return EventDateMode.WatchRelative;
      } else if (hoursDiff < 24 * 14) {
        return EventDateMode.Relative;
      } else {
        return EventDateMode.Date;
      }
    };

    var _proto = EventDateComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.mode_ = EventDateComponent.getMode(this.eventDate);
      this.countdown = '';
      this.live$ = new rxjs.Subject();
      this.change$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {
        _this.mode = EventDateComponent.getMode(_this.eventDate);

        if (_this.mode === EventDateMode.Countdown || _this.mode === EventDateMode.WatchRelative) {
          _this.pushChanges();
        }
      });
    }
    /*
    onChange() {
    	this.mode = EventDateComponent.getMode(this.eventDate);
    }
    */
    ;

    _proto.change$ = function change$() {
      var _this2 = this;

      return rxjs.interval(1000).pipe(operators.takeUntil(this.live$), operators.startWith(0), operators.tap(function () {
        if (_this2.mode === EventDateMode.Countdown) {
          var diff = _this2.eventDate.startDate - new Date();
          var hh = Math.floor(diff / HOUR);
          diff -= hh * HOUR;
          var mm = Math.floor(diff / MINUTE);
          diff -= mm * MINUTE;
          var ss = Math.floor(diff / SECOND);
          diff -= ss * SECOND;
          _this2.countdown = "-" + to10(hh) + ":" + to10(mm) + ":" + to10(ss);

          if (diff < 0) {
            _this2.eventDate.info.started = true; // this.live$.next();
          }
        }
      }));
    };

    _createClass(EventDateComponent, [{
      key: "mode",
      get: function get() {
        return this.mode_;
      },
      set: function set(mode) {
        if (this.mode_ !== mode) {
          this.mode_ = mode;
          this.change.next(this.eventDate);
        }
      }
    }]);

    return EventDateComponent;
  }(rxcomp.Component);
  EventDateComponent.meta = {
    selector: '[eventDate]',
    outputs: ['change'],
    inputs: ['eventDate']
  };

  var EventPageComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(EventPageComponent, _PageComponent);

    function EventPageComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = EventPageComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.grid = {
        mode: 1,
        width: 350,
        gutter: 2
      };
      this.user = null;
      this.event = null;
      this.listing = null;
      this.filters = null;
      this.secondaryFiltersVisible = false;
      this.secondaryFilters = null;
      this.activeFilters = null;
      this.filteredItems = [];
      this.load$().pipe(operators.first()).subscribe(function (data) {
        _this.event = data[0];
        _this.listing = data[1];

        _this.setFilters(data[2]);

        _this.startFilter(_this.listing);

        _this.user = data[3];

        _this.pushChanges();
      });
      this.error = null;
      this.inputActive = false;
      var form = this.form = new rxcompForm.FormGroup({
        question: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        checkRequest: window.antiforgery,
        checkField: ''
      });
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        _this.inputActive = changes.question && changes.question.length > 0;

        _this.pushChanges();
      });
    };

    _proto.load$ = function load$() {
      var eventId = LocationService.get('eventId');
      return rxjs.combineLatest(EventService.detail$(eventId), EventService.listing$(eventId), EventService.filter$(eventId), UserService.me$());
    };

    _proto.setFilters = function setFilters(filters) {
      var _this2 = this;

      var filterObject = {
        type: {
          label: 'Type',
          mode: 'select',
          options: [{
            label: 'Event',
            value: 'event'
          }, {
            label: 'Picture',
            value: 'picture'
          }, {
            label: 'Product',
            value: 'product'
          }, {
            label: 'Magazine',
            value: 'magazine'
          }]
        }
      };
      filters.forEach(function (filter) {
        filter.mode = 'or';
        filterObject[filter.key] = filter;
      });
      var filterService = this.filterService = new FilterService(filterObject, {}, function (key, filter) {
        switch (key) {
          case 'type':
            filter.filter = function (item, value) {
              return item.type === value;
            };

            break;

          case 'tag':
            filter.filter = function (item, value) {
              return item.tags.indexOf(value) !== -1;
            };

            break;

          default:
            filter.filter = function (item, value) {
              return item.features.indexOf(value) !== -1;
            };

        }
      });
      this.filters = filterService.filters;
      this.secondaryFilters = Object.keys(this.filters).filter(function (key) {
        return key !== 'type';
      }).map(function (key) {
        return _this2.filters[key];
      });
    };

    _proto.startFilter = function startFilter(items) {
      var _this3 = this;

      this.filterService.items$(items).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (filteredItems) {
        _this3.filteredItems = [];
        _this3.activeFilters = [];

        _this3.pushChanges();

        setTimeout(function () {
          _this3.filteredItems = filteredItems;
          _this3.activeFilters = _this3.secondaryFilters.map(function (f) {
            f = new FilterItem(f);
            f.options = f.options.filter(function (o) {
              return f.has(o);
            });
            return f;
          }).filter(function (f) {
            return f.options.length;
          });

          _this3.pushChanges();
        }, 1); // console.log('EventPageComponent.filteredItems', filteredItems.length);
      });
    };

    _proto.onChange = function onChange($event) {
      this.pushChanges();
    };

    _proto.toggleGrid = function toggleGrid() {
      this.grid.width = this.grid.width === 350 ? 525 : 350;
      this.pushChanges();
    };

    _proto.toggleFilters = function toggleFilters() {
      this.secondaryFiltersVisible = !this.secondaryFiltersVisible;
      this.pushChanges();
    };

    _proto.toggleSubscribe = function toggleSubscribe() {
      var _this4 = this;

      var flag = this.event.info.subscribed;
      FavouriteService[flag ? 'subscriptionRemove$' : 'subscriptionAdd$'](this.event.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this4.event.info.subscribed = flag;

        if (flag) {
          _this4.event.info.subscribers++;
        } else {
          _this4.event.info.subscribers--;
        }

        _this4.pushChanges();
      });
    };

    _proto.toggleLike = function toggleLike() {
      var _this5 = this;

      var flag = this.event.info.liked;
      FavouriteService[flag ? 'likeRemove$' : 'likeAdd$'](this.event.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this5.event.info.liked = flag;

        if (flag) {
          _this5.event.info.likes++;
        } else {
          _this5.event.info.likes--;
        }

        _this5.pushChanges();
      });
    };

    _proto.toggleSave = function toggleSave() {
      var _this6 = this;

      var flag = this.event.info.saved;
      FavouriteService[flag ? 'favouriteRemove$' : 'favouriteAdd$'](this.event.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this6.event.info.saved = flag;

        _this6.pushChanges();
      });
    };

    _proto.onInputFocus = function onInputFocus(event) {
      this.inputFocus = true;
      this.pushChanges();
    };

    _proto.onInputBlur = function onInputBlur(event) {
      this.inputFocus = false;
      this.pushChanges();
    };

    _proto.postQuestion = function postQuestion(event) {
      var _this7 = this;

      if (this.form.valid) {
        // console.log('EventPageComponent.postQuestion.onSubmit', this.form.value);
        this.form.submitted = true;
        EventService.postQuestion$(this.event, this.form.value.question).pipe(operators.first()).subscribe(function (question) {
          _this7.event.questions.unshift(question);

          _this7.form.controls.question.value = null; // this.pushChanges();
        }, function (error) {
          console.log('EventPageComponent.postQuestion.error', error);
          _this7.error = error;

          _this7.pushChanges();
        });
      } else {
        this.form.touched = true;
      }
    };

    return EventPageComponent;
  }(PageComponent);
  EventPageComponent.meta = {
    selector: '[event-page]'
  };

  var EventComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(EventComponent, _Component);

    function EventComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = EventComponent.prototype;

    _proto.onChange = function onChange($event) {
      this.pushChanges();
    };

    _proto.toggleSubscribe = function toggleSubscribe() {
      var _this = this;

      var flag = this.event.info.subscribed;
      FavouriteService[flag ? 'subscriptionRemove$' : 'subscriptionAdd$'](this.event.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this.event.info.subscribed = flag;

        if (flag) {
          _this.event.info.subscribers++;
        } else {
          _this.event.info.subscribers--;
        }

        _this.pushChanges();
      });
    };

    _proto.toggleLike = function toggleLike() {
      var _this2 = this;

      var flag = this.event.info.liked;
      FavouriteService[flag ? 'likeRemove$' : 'likeAdd$'](this.event.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this2.event.info.liked = flag;

        if (flag) {
          _this2.event.info.likes++;
        } else {
          _this2.event.info.likes--;
        }

        _this2.pushChanges();
      });
    };

    _proto.toggleSave = function toggleSave() {
      var _this3 = this;

      var flag = this.event.info.saved;
      FavouriteService[flag ? 'favouriteRemove$' : 'favouriteAdd$'](this.event.id).pipe(operators.first()).subscribe(function () {
        flag = !flag;
        _this3.event.info.saved = flag;

        _this3.pushChanges();
      });
    };

    return EventComponent;
  }(rxcomp.Component);
  EventComponent.meta = {
    selector: '[event]',
    inputs: ['event']
  };

  var ViewModes = {
    Saved: 'saved',
    Liked: 'liked'
  };

  var FavouritePageComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(FavouritePageComponent, _PageComponent);

    function FavouritePageComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = FavouritePageComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.channels = null;
      this.savedItems = [];
      this.likedItems = [];
      this.viewMode_ = ViewModes.Saved;
      this.grid = {
        mode: 1,
        width: 350,
        gutter: 2
      };
      this.load$().pipe(operators.first()).subscribe(function (data) {
        _this.channels = data[0];
        _this.savedItems = data[1];
        _this.likedItems = data[2];

        _this.pushChanges();
      });
    };

    _proto.load$ = function load$() {
      return rxjs.combineLatest(ChannelService.channels$, FavouriteService.favourites$, FavouriteService.likes$);
    };

    _proto.toggleGrid = function toggleGrid() {
      this.grid.width = this.grid.width === 350 ? 525 : 350;
      this.pushChanges();
    };

    _createClass(FavouritePageComponent, [{
      key: "viewMode",
      get: function get() {
        return this.viewMode_;
      },
      set: function set(viewMode) {
        if (this.viewMode_ !== viewMode) {
          this.viewMode_ = viewMode;
          this.pushChanges();
        }
      }
    }]);

    return FavouritePageComponent;
  }(PageComponent);
  FavouritePageComponent.meta = {
    selector: '[favourite-page]'
  };

  var ControlComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(ControlComponent, _Component);

    function ControlComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ControlComponent.prototype;

    _proto.onChanges = function onChanges() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      var control = this.control;
      var flags = control.flags;
      Object.keys(flags).forEach(function (key) {
        flags[key] ? node.classList.add(key) : node.classList.remove(key);
      });
    };

    return ControlComponent;
  }(rxcomp.Component);
  ControlComponent.meta = {
    selector: '[control]',
    inputs: ['control']
  };

  var ErrorsComponent = /*#__PURE__*/function (_ControlComponent) {
    _inheritsLoose(ErrorsComponent, _ControlComponent);

    function ErrorsComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ErrorsComponent.prototype;

    _proto.onInit = function onInit() {
      this.labels = window.labels || {};
    };

    _proto.getLabel = function getLabel(key, value) {
      var label = this.labels["error_" + key];
      return label;
    };

    return ErrorsComponent;
  }(ControlComponent);
  ErrorsComponent.meta = {
    selector: 'errors-component',
    inputs: ['control'],
    template:
    /* html */
    "\n\t<div class=\"inner\" [style]=\"{ display: control.invalid && control.touched ? 'block' : 'none' }\">\n\t\t<div class=\"error\" *for=\"let [key, value] of control.errors\">\n\t\t\t<span [innerHTML]=\"getLabel(key, value)\"></span>\n\t\t\t<!-- <span class=\"key\" [innerHTML]=\"key\"></span> <span class=\"value\" [innerHTML]=\"value | json\"></span> -->\n\t\t</div>\n\t</div>\n\t"
  };

  var CssService = /*#__PURE__*/function () {
    function CssService() {}

    CssService.height$ = function height$() {
      var style = document.documentElement.style;
      return rxjs.fromEvent(window, 'resize').pipe(operators.map(function (event) {
        return window.innerHeight;
      }), operators.startWith(window.innerHeight), operators.tap(function (height) {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        var vh = height * 0.01; // Then we set the value in the --vh custom property to the root of the document

        style.setProperty('--vh', vh + "px");
      }));
    };

    return CssService;
  }();

  var notifications$_ = new rxjs.BehaviorSubject(null);

  var NotificationService = /*#__PURE__*/function () {
    function NotificationService() {}

    NotificationService.getCurrentNotifications = function getCurrentNotifications() {
      return notifications$_.getValue();
    };

    NotificationService.notifications$ = function notifications$() {
      return ApiService.staticGet$("/user/notification").pipe(operators.map(function (response) {
        return EventService.mapEvents(response.data, response.static);
      }), operators.switchMap(function (items) {
        notifications$_.next(items);
        return notifications$_;
      }));
    };

    return NotificationService;
  }();
  NotificationService.notifications$ = NotificationService.notifications$().pipe(operators.shareReplay(1));

  var HeaderComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(HeaderComponent, _Component);

    function HeaderComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = HeaderComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.user = null;
      this.favourites = [];
      UserService.me$().pipe(operators.catchError(function () {
        return rxjs.of(null);
      }), operators.takeUntil(this.unsubscribe$)).subscribe(function (user) {
        console.log('HeaderComponent.me$', user);
        _this.user = user;

        _this.pushChanges();
      });
      FavouriteService.subscriptions$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (subscriptions) {
        _this.subscriptions = subscriptions; // console.log('HeaderComponent.subscriptions', subscriptions);

        _this.pushChanges();
      });
      FavouriteService.likes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (likes) {
        _this.likes = likes; // console.log('HeaderComponent.likes', likes);

        _this.pushChanges();
      });
      FavouriteService.favourites$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (favourites) {
        _this.favourites = favourites; // console.log('HeaderComponent.favourites', favourites);

        _this.pushChanges();
      });
      NotificationService.notifications$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (notifications) {
        _this.notifications = notifications; // console.log('HeaderComponent.notifications', notifications);

        _this.pushChanges();
      });
      CssService.height$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (height) {// console.log('HeaderComponent.height$', height);
      }); // console.log(JSON.stringify(LocaleService.defaultLocale));
    };

    _proto.toggleAside = function toggleAside($event) {
      this.aside_ = !this.aside_;
      this.aside.next(this.aside_);
    };

    _proto.dismissAside = function dismissAside($event) {
      if (this.aside_) {
        this.aside_ = false;
        this.aside.next(this.aside_);
      }
    };

    _proto.toggleNotification = function toggleNotification($event) {
      this.notification_ = !this.notification_;
      this.notification.next(this.notification_);
    };

    _proto.dismissNotification = function dismissNotification($event) {
      if (this.notification_) {
        this.notification_ = false;
        this.notification.next(this.notification_);
      }
    };

    _proto.onDropped = function onDropped(id) {
      // console.log('HeaderComponent.onDropped', id);
      this.submenu = id;
      this.pushChanges();
    };

    return HeaderComponent;
  }(rxcomp.Component);
  HeaderComponent.meta = {
    selector: 'header',
    outputs: ['aside', 'notification']
  };

  /*
  ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
  ['"', '&', ''', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
  */

  var HtmlPipe = /*#__PURE__*/function (_Pipe) {
    _inheritsLoose(HtmlPipe, _Pipe);

    function HtmlPipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    HtmlPipe.transform = function transform(value) {
      if (value) {
        value = value.replace(/&#(\d+);/g, function (m, n) {
          return String.fromCharCode(parseInt(n));
        });
        var escapes = ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
        var unescapes = ['"', '&', '\'', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
        var rx = new RegExp("(&" + escapes.join(';)|(&') + ";)", 'g');
        value = value.replace(rx, function () {
          for (var i = 1; i < arguments.length; i++) {
            if (arguments[i]) {
              // console.log(arguments[i], unescapes[i - 1]);
              return unescapes[i - 1];
            }
          }
        }); // console.log(value);

        return value;
      }
    };

    return HtmlPipe;
  }(rxcomp.Pipe);
  HtmlPipe.meta = {
    name: 'html'
  };

  var IndexPageComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(IndexPageComponent, _PageComponent);

    function IndexPageComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = IndexPageComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.topEvents = this.topChannels = this.upcomingEvents = [];
      this.load$().pipe(operators.first()).subscribe(function (data) {
        _this.topEvents = data[0];
        _this.topChannels = data[1];
        _this.upcomingEvents = data[2];

        _this.pushChanges();
      });
    };

    _proto.load$ = function load$() {
      return rxjs.combineLatest(EventService.top$(), ChannelService.top$(), EventService.upcoming$());
    };

    return IndexPageComponent;
  }(PageComponent);
  IndexPageComponent.meta = {
    selector: '[index-page]'
  };

  var UID = 0;

  var ImageService = /*#__PURE__*/function () {
    function ImageService() {}

    ImageService.worker = function worker() {
      if (!this.worker_) {
        this.worker_ = new Worker(getResourceRoot() + "js/workers/image.service.worker.js");
      }

      return this.worker_;
    };

    ImageService.load$ = function load$(src) {
      // if (!('Worker' in window) || this.isBlob(src) || this.isCors(src)) {
      if (!('Worker' in window) || this.isBlob(src)) {
        return rxjs.of(src);
      }

      var id = ++UID;
      var worker = this.worker();
      worker.postMessage({
        src: src,
        id: id
      });
      return rxjs.fromEvent(worker, 'message').pipe(operators.filter(function (event) {
        return event.data.src === src;
      }), operators.map(function (event) {
        var url = URL.createObjectURL(event.data.blob);
        return url;
      }), operators.first(), operators.finalize(function (url) {
        worker.postMessage({
          id: id
        });

        if (url) {
          URL.revokeObjectURL(url);
        }
      }));
    };

    ImageService.isCors = function isCors(src) {
      return src.indexOf('//') !== -1 && src.indexOf(window.location.host) === -1;
    };

    ImageService.isBlob = function isBlob(src) {
      return src.indexOf('blob:') === 0;
    };

    return ImageService;
  }();

  var IntersectionService = /*#__PURE__*/function () {
    function IntersectionService() {}

    IntersectionService.observer = function observer() {
      var _this = this;

      if (!this.observer_) {
        this.readySubject_ = new rxjs.BehaviorSubject(false);
        this.observerSubject_ = new rxjs.Subject();
        this.observer_ = new IntersectionObserver(function (entries) {
          _this.observerSubject_.next(entries);
        });
      }

      return this.observer_;
    };

    IntersectionService.intersection$ = function intersection$(node) {
      if ('IntersectionObserver' in window) {
        var observer = this.observer();
        observer.observe(node);
        return this.observerSubject_.pipe( // tap(entries => console.log(entries.length)),
        operators.map(function (entries) {
          return entries.find(function (entry) {
            return entry.target === node;
          });
        }), operators.filter(function (entry) {
          return entry !== undefined;
        }), // tap(entry => console.log('IntersectionService.intersection$', entry)),
        operators.finalize(function () {
          return observer.unobserve(node);
        }));
      } else {
        return rxjs.of({
          target: node,
          isIntersecting: true
        });
      }
    };

    IntersectionService.firstIntersection$ = function firstIntersection$(node) {
      return this.intersection$(node).pipe(operators.filter(function (entry) {
        return entry.isIntersecting;
      }), // entry.intersectionRatio > 0
      operators.first());
    };

    return IntersectionService;
  }();

  var LazyCache = /*#__PURE__*/function () {
    function LazyCache() {}

    LazyCache.get = function get(src) {
      return this.cache[src];
    };

    LazyCache.set = function set(src, blob) {
      this.cache[src] = blob;
      var keys = Object.keys(this.cache);

      if (keys.length > 100) {
        this.remove(keys[0]);
      }
    };

    LazyCache.remove = function remove(src) {
      delete this.cache[src];
    };

    _createClass(LazyCache, null, [{
      key: "cache",
      get: function get() {
        if (!this.cache_) {
          this.cache_ = {};
        }

        return this.cache_;
      }
    }]);

    return LazyCache;
  }();

  var LazyDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(LazyDirective, _Directive);

    function LazyDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = LazyDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('lazy');
      this.input$ = new rxjs.Subject().pipe(operators.distinctUntilChanged(), operators.switchMap(function (input) {
        var src = LazyCache.get(input);

        if (src) {
          return rxjs.of(src);
        }

        node.classList.remove('lazyed');
        return _this.lazy$(input);
      }), operators.takeUntil(this.unsubscribe$));
      this.input$.subscribe(function (src) {
        LazyCache.set(_this.lazy, src);
        node.setAttribute('src', src);
        node.classList.add('lazyed');
      });
    };

    _proto.onChanges = function onChanges() {
      this.input$.next(this.lazy);
    };

    _proto.lazy$ = function lazy$(input) {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      return IntersectionService.firstIntersection$(node).pipe( // tap(entry => console.log(entry)),
      operators.switchMap(function () {
        return ImageService.load$(input);
      }), operators.takeUntil(this.unsubscribe$));
    };

    return LazyDirective;
  }(rxcomp.Directive);
  LazyDirective.meta = {
    selector: '[lazy],[[lazy]]',
    inputs: ['lazy']
  };

  var ModalEvent = function ModalEvent(data) {
    this.data = data;
  };
  var ModalResolveEvent = /*#__PURE__*/function (_ModalEvent) {
    _inheritsLoose(ModalResolveEvent, _ModalEvent);

    function ModalResolveEvent() {
      return _ModalEvent.apply(this, arguments) || this;
    }

    return ModalResolveEvent;
  }(ModalEvent);
  var ModalRejectEvent = /*#__PURE__*/function (_ModalEvent2) {
    _inheritsLoose(ModalRejectEvent, _ModalEvent2);

    function ModalRejectEvent() {
      return _ModalEvent2.apply(this, arguments) || this;
    }

    return ModalRejectEvent;
  }(ModalEvent);

  var ModalService = /*#__PURE__*/function () {
    function ModalService() {}

    ModalService.open$ = function open$(modal) {
      var _this = this;

      return this.getTemplate$(modal.src).pipe(operators.map(function (template) {
        return {
          node: _this.getNode(template),
          data: modal.data,
          modal: modal
        };
      }), operators.tap(function (node) {
        return _this.modal$.next(node);
      }), operators.switchMap(function (node) {
        return _this.events$;
      }));
    };

    ModalService.load$ = function load$(modal) {};

    ModalService.getTemplate$ = function getTemplate$(url) {
      return rxjs.from(fetch(url).then(function (response) {
        return response.text();
      }));
    };

    ModalService.getNode = function getNode(template) {
      var div = document.createElement("div");
      div.innerHTML = template;
      var node = div.firstElementChild;
      return node;
    };

    ModalService.reject = function reject(data) {
      this.modal$.next(null);
      this.events$.next(new ModalRejectEvent(data));
    };

    ModalService.resolve = function resolve(data) {
      this.modal$.next(null);
      this.events$.next(new ModalResolveEvent(data));
    };

    return ModalService;
  }();
  ModalService.modal$ = new rxjs.Subject();
  ModalService.events$ = new rxjs.Subject();

  var ModalOutletComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(ModalOutletComponent, _Component);

    function ModalOutletComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ModalOutletComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      this.modalNode = node.querySelector('.modal-outlet__modal');
      ModalService.modal$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (modal) {
        _this.modal = modal;
      });
    };

    _proto.onRegister = function onRegister(event) {
      // console.log('ModalComponent.onRegister');
      this.pushChanges();
    };

    _proto.onLogin = function onLogin(event) {
      // console.log('ModalComponent.onLogin');
      this.pushChanges();
    };

    _proto.reject = function reject(event) {
      ModalService.reject();
    };

    _createClass(ModalOutletComponent, [{
      key: "modal",
      get: function get() {
        return this.modal_;
      },
      set: function set(modal) {
        // console.log('ModalOutletComponent set modal', modal, this);
        var _getContext2 = rxcomp.getContext(this),
            module = _getContext2.module;

        if (this.modal_ && this.modal_.node) {
          module.remove(this.modal_.node, this);
          this.modalNode.removeChild(this.modal_.node);
        }

        if (modal && modal.node) {
          this.modal_ = modal;
          this.modalNode.appendChild(modal.node);
          var instances = module.compile(modal.node);
        }

        this.modal_ = modal;
        this.pushChanges();
      }
    }]);

    return ModalOutletComponent;
  }(rxcomp.Component);
  ModalOutletComponent.meta = {
    selector: '[modal-outlet]',
    template:
    /* html */
    "\n\t<div class=\"modal-outlet__container\" [class]=\"{ active: modal }\">\n\t\t<div class=\"modal-outlet__background\" (click)=\"reject($event)\"></div>\n\t\t<div class=\"modal-outlet__modal\"></div>\n\t</div>\n\t"
  };

  var ModalComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(ModalComponent, _Component);

    function ModalComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ModalComponent.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          parentInstance = _getContext.parentInstance;

      if (parentInstance instanceof ModalOutletComponent) {
        this.data = parentInstance.modal.data;
      }
    };

    _proto.close = function close() {
      ModalService.reject();
    };

    return ModalComponent;
  }(rxcomp.Component);
  ModalComponent.meta = {
    selector: '[modal]'
  };

  var NotificationComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(NotificationComponent, _PageComponent);

    function NotificationComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = NotificationComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.grid = {
        mode: 4,
        width: 320,
        gutter: 0
      };
      this.notifications = [];
      NotificationService.notifications$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (notifications) {
        _this.notifications = notifications;

        _this.pushChanges();
      });
    };

    return NotificationComponent;
  }(PageComponent);
  NotificationComponent.meta = {
    selector: '[notification]'
  };

  var src = STATIC ? '/tiemme-com/club-modal.html' : '/Viewdoc.cshtml?co_id=23649';

  var RegisterOrLoginComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(RegisterOrLoginComponent, _Component);

    function RegisterOrLoginComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = RegisterOrLoginComponent.prototype;

    _proto.onRegister = function onRegister(event) {
      // console.log('RegisterOrLoginComponent.onRegister');
      event.preventDefault();
      ModalService.open$({
        src: src,
        data: {
          view: 2
        }
      }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        // console.log('RegisterOrLoginComponent.onRegister', event);
        if (event instanceof ModalResolveEvent) {
          UserService.setUser(event.data);
        }
      }); // this.pushChanges();
    };

    _proto.onLogin = function onLogin(event) {
      // console.log('RegisterOrLoginComponent.onLogin');
      event.preventDefault();
      ModalService.open$({
        src: src,
        data: {
          view: 1
        }
      }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        // console.log('RegisterOrLoginComponent.onLogin', event);
        if (event instanceof ModalResolveEvent) {
          UserService.setUser(event.data);
        }
      }); // this.pushChanges();
    };

    return RegisterOrLoginComponent;
  }(rxcomp.Component);
  RegisterOrLoginComponent.meta = {
    selector: '[register-or-login]'
  };

  const calculateDelta = (now, date) => Math.round(Math.abs(now - date) / 1000);

  function relativeDateFactory (translations) {
    return function relativeDate (date, now = new Date()) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      let delta = null;

      const minute = 60;
      const hour = minute * 60;
      const day = hour * 24;
      const week = day * 7;
      const month = day * 30;
      const year = day * 365;

      delta = calculateDelta(now, date);

      if (delta > day && delta < week) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        delta = calculateDelta(now, date);
      }

      const translate = (translatePhrase, timeValue) => {
        let key;

        if (translatePhrase === 'justNow') {
          key = translatePhrase;
        } else if (now >= date) {
          key = `${translatePhrase}Ago`;
        } else {
          key = `${translatePhrase}FromNow`;
        }

        const translation = translations[key];

        if (typeof translation === 'function') {
          return translation(timeValue)
        }

        return translation.replace('{{time}}', timeValue)
      };

      switch (false) {
        case !(delta < 30):
          return translate('justNow')

        case !(delta < minute):
          return translate('seconds', delta)

        case !(delta < 2 * minute):
          return translate('aMinute')

        case !(delta < hour):
          return translate('minutes', Math.floor(delta / minute))

        case Math.floor(delta / hour) !== 1:
          return translate('anHour')

        case !(delta < day):
          return translate('hours', Math.floor(delta / hour))

        case !(delta < day * 2):
          return translate('aDay')

        case !(delta < week):
          return translate('days', Math.floor(delta / day))

        case Math.floor(delta / week) !== 1:
          return translate('aWeek')

        case !(delta < month):
          return translate('weeks', Math.floor(delta / week))

        case Math.floor(delta / month) !== 1:
          return translate('aMonth')

        case !(delta < year):
          return translate('months', Math.floor(delta / month))

        case Math.floor(delta / year) !== 1:
          return translate('aYear')

        default:
          return translate('overAYear')
      }
    }
  }

  var en = {
    justNow: "just now",
    secondsAgo: "{{time}} seconds ago",
    aMinuteAgo: "a minute ago",
    minutesAgo: "{{time}} minutes ago",
    anHourAgo: "an hour ago",
    hoursAgo: "{{time}} hours ago",
    aDayAgo: "yesterday",
    daysAgo: "{{time}} days ago",
    aWeekAgo: "a week ago",
    weeksAgo: "{{time}} weeks ago",
    aMonthAgo: "a month ago",
    monthsAgo: "{{time}} months ago",
    aYearAgo: "a year ago",
    yearsAgo: "{{time}} years ago",
    overAYearAgo: "over a year ago",
    secondsFromNow: "{{time}} seconds from now",
    aMinuteFromNow: "a minute from now",
    minutesFromNow: "{{time}} minutes from now",
    anHourFromNow: "an hour from now",
    hoursFromNow: "{{time}} hours from now",
    aDayFromNow: "tomorrow",
    daysFromNow: "{{time}} days from now",
    aWeekFromNow: "a week from now",
    weeksFromNow: "{{time}} weeks from now",
    aMonthFromNow: "a month from now",
    monthsFromNow: "{{time}} months from now",
    aYearFromNow: "a year from now",
    yearsFromNow: "{{time}} years from now",
    overAYearFromNow: "over a year from now"
  };

  var relativeDate = relativeDateFactory(en);

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var factory = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = relativeDateFactory;
  var calculateDelta = function calculateDelta(now, date) {
    return Math.round(Math.abs(now - date) / 1000);
  };

  function relativeDateFactory(translations) {
    return function relativeDate(date) {
      var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      var delta = null;

      var minute = 60;
      var hour = minute * 60;
      var day = hour * 24;
      var week = day * 7;
      var month = day * 30;
      var year = day * 365;

      delta = calculateDelta(now, date);

      if (delta > day && delta < week) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        delta = calculateDelta(now, date);
      }

      var translate = function translate(translatePhrase, timeValue) {
        var key = void 0;

        if (translatePhrase === 'justNow') {
          key = translatePhrase;
        } else if (now >= date) {
          key = translatePhrase + 'Ago';
        } else {
          key = translatePhrase + 'FromNow';
        }

        var translation = translations[key];

        if (typeof translation === 'function') {
          return translation(timeValue);
        }

        return translation.replace('{{time}}', timeValue);
      };

      switch (false) {
        case !(delta < 30):
          return translate('justNow');

        case !(delta < minute):
          return translate('seconds', delta);

        case !(delta < 2 * minute):
          return translate('aMinute');

        case !(delta < hour):
          return translate('minutes', Math.floor(delta / minute));

        case Math.floor(delta / hour) !== 1:
          return translate('anHour');

        case !(delta < day):
          return translate('hours', Math.floor(delta / hour));

        case !(delta < day * 2):
          return translate('aDay');

        case !(delta < week):
          return translate('days', Math.floor(delta / day));

        case Math.floor(delta / week) !== 1:
          return translate('aWeek');

        case !(delta < month):
          return translate('weeks', Math.floor(delta / week));

        case Math.floor(delta / month) !== 1:
          return translate('aMonth');

        case !(delta < year):
          return translate('months', Math.floor(delta / month));

        case Math.floor(delta / year) !== 1:
          return translate('aYear');

        default:
          return translate('overAYear');
      }
    };
  }
  module.exports = exports['default'];
  });

  var relativeDateFactory$1 = unwrapExports(factory);

  var RELATIVE_DATE_KEYS = ["justNow", "secondsAgo", "aMinuteAgo", "minutesAgo", "anHourAgo", "hoursAgo", "aDayAgo", "daysAgo", "aWeekAgo", "weeksAgo", "aMonthAgo", "monthsAgo", "aYearAgo", "yearsAgo", "overAYearAgo", "secondsFromNow", "aMinuteFromNow", "minutesFromNow", "anHourFromNow", "hoursFromNow", "aDayFromNow", "daysFromNow", "aWeekFromNow", "weeksFromNow", "aMonthFromNow", "monthsFromNow", "aYearFromNow", "yearsFromNow", "overAYearFromNow"];

  var RelativeDatePipe = /*#__PURE__*/function (_Pipe) {
    _inheritsLoose(RelativeDatePipe, _Pipe);

    function RelativeDatePipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    RelativeDatePipe.transform = function transform(value) {
      if (value) {
        return this.relativeDate(value);
      }
    };

    RelativeDatePipe.setLocale = function setLocale(locale) {
      if (!locale) return;
      var values = {};
      var keys = Object.keys(locale).filter(function (key) {
        return RELATIVE_DATE_KEYS.indexOf(key) !== -1;
      });

      if (keys.length) {
        keys.forEach(function (key) {
          return values[key] = locale[key];
        });
        this.relativeDate = relativeDateFactory$1(values);
      }
    };

    return RelativeDatePipe;
  }(rxcomp.Pipe);
  RelativeDatePipe.meta = {
    name: 'relativeDate'
  };
  RelativeDatePipe.relativeDate = relativeDate;

  if (window.locale) {
    RelativeDatePipe.setLocale(window.locale);
  }

  var RelativeDateDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(RelativeDateDirective, _Directive);

    function RelativeDateDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = RelativeDateDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.change$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {
        _this.text = RelativeDatePipe.transform(_this.relativeDate);
      });
    };

    _proto.change$ = function change$() {
      return rxjs.interval(1000).pipe(operators.startWith(0));
    };

    _createClass(RelativeDateDirective, [{
      key: "text",
      set: function set(text) {
        if (this.text_ !== text) {
          this.text_ = text;

          var _getContext = rxcomp.getContext(this),
              node = _getContext.node;

          node.innerText = text;
        }
      }
    }]);

    return RelativeDateDirective;
  }(rxcomp.Directive);
  RelativeDateDirective.meta = {
    selector: '[relativeDate]',
    inputs: ['relativeDate']
  };

  var ScrollToDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(ScrollToDirective, _Directive);

    function ScrollToDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = ScrollToDirective.prototype;

    _proto.onInit = function onInit() {
      this.initialFocus = false;

      var _getContext = rxcomp.getContext(this),
          module = _getContext.module,
          node = _getContext.node;

      var expression = this.expression = node.getAttribute("(scrollTo)");
      this.outputFunction = module.makeFunction(expression, ['$event']);
      this.scrollTo$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {});
    };

    _proto.scrollTo$ = function scrollTo$() {
      var _this = this;

      var _getContext2 = rxcomp.getContext(this),
          module = _getContext2.module,
          node = _getContext2.node,
          parentInstance = _getContext2.parentInstance;

      return rxjs.fromEvent(node, 'click').pipe(operators.tap(function (event) {
        var result = module.resolve(_this.outputFunction, parentInstance, event);

        if (typeof result === 'string') {
          var target = document.querySelector(result);

          if (target) {
            var from = _this.currentTop();

            var to = from + target.getBoundingClientRect().top - 50;
            var o = {
              pow: 0
            };
            var html = document.querySelector('html');
            gsap.set(html, {
              'scroll-behavior': 'auto'
            });
            gsap.to(o, Math.abs(to - from) / 2000, {
              pow: 1,
              ease: Quad.easeOut,
              overwrite: 'all',
              onUpdate: function onUpdate() {
                window.scrollTo(0, from + (to - from) * o.pow);
              },
              onComplete: function onComplete() {
                gsap.set(html, {
                  'scroll-behavior': 'smooth'
                });
              }
            });
          }
        }
      }), operators.shareReplay(1));
    };

    _proto.currentTop = function currentTop() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) return self.pageYOffset; // Internet Explorer 6 - standards mode

      if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6, 7 and 8

      if (document.body.scrollTop) return document.body.scrollTop;
      return 0;
    };

    return ScrollToDirective;
  }(rxcomp.Directive);
  ScrollToDirective.meta = {
    selector: "[(scrollTo)]"
  };

  var DownloadService = /*#__PURE__*/function () {
    function DownloadService() {}

    DownloadService.download = function download(blob, fileName) {
      if (fileName === void 0) {
        fileName = 'download.txt';
      }

      // var json = JSON.stringify(data),
      // blob = new Blob([json], {type: "octet/stream"}),
      var url = window.URL.createObjectURL(blob);
      var a = this.a;
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    _createClass(DownloadService, null, [{
      key: "a",
      get: function get() {
        var a = this.a_;

        if (!a) {
          a = document.createElement("a");
          a.style = "display: none";
          document.body.appendChild(a);
          this.a_ = a;
        }

        return a;
      }
    }]);

    return DownloadService;
  }();

  var src$1 = STATIC ? '/tiemme-com/club-modal.html' : '/Viewdoc.cshtml?co_id=23649';

  var SecureDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(SecureDirective, _Directive);

    function SecureDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = SecureDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      this.href = node.getAttribute('href');
      rxjs.fromEvent(node, 'click').pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        event.preventDefault();

        _this.tryDownloadHref();
      });
    };

    _proto.onChanges = function onChanges() {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      this.href = node.getAttribute('href');
    };

    _proto.tryDownloadHref = function tryDownloadHref() {
      var _this2 = this;

      ApiService.staticGet$(this.href, undefined, 'blob').pipe(operators.first(), operators.map(function (response) {
        return response.data;
      })).subscribe(function (blob) {
        DownloadService.download(blob, _this2.href.split('/').pop());
      }, function (error) {
        console.log(error);

        _this2.onLogin(event);
      });
    };

    _proto.onLogin = function onLogin(event) {
      var _this3 = this;

      // console.log('SecureDirective.onLogin');
      // event.preventDefault();
      ModalService.open$({
        src: src$1,
        data: {
          view: 1
        }
      }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        // console.log('SecureDirective.onLogin', event);
        if (event instanceof ModalResolveEvent) {
          UserService.setUser(event.data);

          _this3.tryDownloadHref();
        }
      }); // this.pushChanges();
    }
    /*
    onRegister(event) {
    	// console.log('SecureDirective.onRegister');
    	// event.preventDefault();
    	ModalService.open$({ src: src, data: { view: 2 } }).pipe(
    		takeUntil(this.unsubscribe$)
    	).subscribe(event => {
    		// console.log('SecureDirective.onRegister', event);
    		if (event instanceof ModalResolveEvent) {
    			UserService.setUser(event.data);
    		}
    	});
    	// this.pushChanges();
    }
    */
    ;

    return SecureDirective;
  }(rxcomp.Directive);
  SecureDirective.meta = {
    selector: '[secure]'
  };

  var SlugPipe = /*#__PURE__*/function (_Pipe) {
    _inheritsLoose(SlugPipe, _Pipe);

    function SlugPipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    SlugPipe.transform = function transform(value) {
      return getSlug(value);
    };

    return SlugPipe;
  }(rxcomp.Pipe);
  SlugPipe.meta = {
    name: 'slug'
  };

  var SwiperDirective = /*#__PURE__*/function (_Directive) {
    _inheritsLoose(SwiperDirective, _Directive);

    function SwiperDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = SwiperDirective.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('id', "swiper-" + this.rxcompId);
      this.options = {
        slidesPerView: 'auto',
        spaceBetween: 0,
        centeredSlides: true,
        speed: 600,
        autoplay: {
          delay: 5000
        },
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: "#swiper-" + this.rxcompId + " .swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: "#swiper-" + this.rxcompId + " .swiper-button-next",
          prevEl: "#swiper-" + this.rxcompId + " .swiper-button-prev"
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_();
    };

    _proto.onView = function onView() {
      var _this = this;

      setTimeout(function () {
        _this.swiperInitOrUpdate_();
      }, 1);
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners_();
      this.swiperDestroy_();
    };

    _proto.onBeforePrint = function onBeforePrint() {
      this.swiperDestroy_();
    };

    _proto.slideToIndex = function slideToIndex(index) {
      // console.log('SwiperDirective.slideToIndex', index);
      if (this.swiper) {
        this.swiper.slideTo(index);
      }
    };

    _proto.init_ = function init_() {
      this.events$ = new rxjs.Subject();

      if (this.enabled) {
        var _getContext2 = rxcomp.getContext(this),
            node = _getContext2.node;

        gsap.set(node, {
          opacity: 0
        });
        this.index = 0;
        var on = this.options.on || {};
        var self = this;

        on.slideChange = function () {
          var swiper = this;
          self.index = swiper.activeIndex;
          self.events$.next(self.index);
          self.pushChanges();
        };

        this.options.on = on;
        this.addListeners_();
      }
    };

    _proto.addListeners_ = function addListeners_() {
      this.onBeforePrint = this.onBeforePrint.bind(this);
      window.addEventListener('beforeprint', this.onBeforePrint);
      /*
      scope.$on('onResize', ($scope) => {
      	this.onResize(scope, element, attributes);
      });
      */
    };

    _proto.removeListeners_ = function removeListeners_() {
      window.removeEventListener('beforeprint', this.onBeforePrint);
    };

    _proto.swiperInitOrUpdate_ = function swiperInitOrUpdate_() {
      if (this.enabled) {
        var _getContext3 = rxcomp.getContext(this),
            node = _getContext3.node;

        if (this.swiper) {
          this.swiper.update();
        } else {
          var swiper;
          var on = this.options.on || (this.options.on = {});
          var callback = on.init;

          if (!on.init || !on.init.swiperDirectiveInit) {
            on.init = function () {
              var _this2 = this;

              gsap.to(node, 0.4, {
                opacity: 1,
                ease: Power2.easeOut
              });
              setTimeout(function () {
                if (typeof callback === 'function') {
                  callback.apply(_this2, [swiper, element, scope]);
                }
              }, 1);
            };

            on.init.swiperDirectiveInit = true;
          }

          gsap.set(node, {
            opacity: 1
          });
          swiper = new Swiper(node, this.options);
          this.swiper = swiper;
          this.swiper._opening = true;
          node.classList.add('swiper-init');
        }
      }
    };

    _proto.swiperDestroy_ = function swiperDestroy_() {
      if (this.swiper) {
        this.swiper.destroy();
      }
    };

    _proto.openMore = function openMore(event) {
      this.more.next(event);
    };

    _createClass(SwiperDirective, [{
      key: "enabled",
      get: function get() {
        return !window.matchMedia('print').matches;
      }
    }]);

    return SwiperDirective;
  }(rxcomp.Directive);
  SwiperDirective.meta = {
    selector: '[swiper]',
    inputs: ['consumer'],
    outputs: ['more']
  };

  var SwiperEventsDirective = /*#__PURE__*/function (_SwiperDirective) {
    _inheritsLoose(SwiperEventsDirective, _SwiperDirective);

    function SwiperEventsDirective() {
      return _SwiperDirective.apply(this, arguments) || this;
    }

    var _proto = SwiperEventsDirective.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('id', "swiper-" + this.rxcompId);
      this.options = {
        slidesPerView: 1,
        spaceBetween: 15,
        breakpoints: {
          1024: {
            slidesPerView: 2,
            spaceBetween: 1
          },
          1440: {
            slidesPerView: 2.5,
            spaceBetween: 1
          }
        },
        centeredSlides: false,
        // loop: true,
        loopAdditionalSlides: 100,
        speed: 600,

        /*
        autoplay: {
        	delay: 5000,
        },
        */
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: "#swiper-" + this.rxcompId + " .swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: "#swiper-" + this.rxcompId + " .swiper-button-next",
          prevEl: "#swiper-" + this.rxcompId + " .swiper-button-prev"
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_(); // console.log('SwiperEventsDirective.onInit');
    };

    return SwiperEventsDirective;
  }(SwiperDirective);
  SwiperEventsDirective.meta = {
    selector: '[swiper-events]'
  };

  var SwiperRelatedDirective = /*#__PURE__*/function (_SwiperDirective) {
    _inheritsLoose(SwiperRelatedDirective, _SwiperDirective);

    function SwiperRelatedDirective() {
      return _SwiperDirective.apply(this, arguments) || this;
    }

    var _proto = SwiperRelatedDirective.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('id', "swiper-" + this.rxcompId);
      this.options = {
        slidesPerView: 'auto',
        spaceBetween: 1,
        centeredSlides: false,
        loop: false,
        loopAdditionalSlides: 100,
        speed: 600,

        /*
        autoplay: {
        	delay: 5000,
        },
        */
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: "#swiper-" + this.rxcompId + " .swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: "#swiper-" + this.rxcompId + " .swiper-button-next",
          prevEl: "#swiper-" + this.rxcompId + " .swiper-button-prev"
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_();
    };

    return SwiperRelatedDirective;
  }(SwiperDirective);
  SwiperRelatedDirective.meta = {
    selector: '[swiper-related]'
  };

  var SwiperSlidesDirective = /*#__PURE__*/function (_SwiperDirective) {
    _inheritsLoose(SwiperSlidesDirective, _SwiperDirective);

    function SwiperSlidesDirective() {
      return _SwiperDirective.apply(this, arguments) || this;
    }

    var _proto = SwiperSlidesDirective.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('id', "swiper-" + this.rxcompId);
      this.options = {
        slidesPerView: 1,
        spaceBetween: 0,
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 0
          }
        },
        centeredSlides: true,
        loop: false,
        loopAdditionalSlides: 100,
        speed: 600,

        /*
        autoplay: {
        	delay: 5000,
        },
        */
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: "#swiper-" + this.rxcompId + " .swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: "#swiper-" + this.rxcompId + " .swiper-button-next",
          prevEl: "#swiper-" + this.rxcompId + " .swiper-button-prev"
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_();
    };

    return SwiperSlidesDirective;
  }(SwiperDirective);
  SwiperSlidesDirective.meta = {
    selector: '[swiper-slides]'
  };

  var SwiperTopEventsDirective = /*#__PURE__*/function (_SwiperDirective) {
    _inheritsLoose(SwiperTopEventsDirective, _SwiperDirective);

    function SwiperTopEventsDirective() {
      return _SwiperDirective.apply(this, arguments) || this;
    }

    var _proto = SwiperTopEventsDirective.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('id', "swiper-" + this.rxcompId);
      this.options = {
        slidesPerView: 1,
        spaceBetween: 2,
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 2
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 2
          },
          1440: {
            slidesPerView: 4,
            spaceBetween: 2
          },
          1920: {
            slidesPerView: 4,
            spaceBetween: 2
          },
          2440: {
            slidesPerView: 5,
            spaceBetween: 2
          }
        },
        centeredSlides: false,
        // loop: true,
        loopAdditionalSlides: 100,
        speed: 600,

        /*
        autoplay: {
        	delay: 5000,
        },
        */
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: "#swiper-" + this.rxcompId + " .swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: "#swiper-" + this.rxcompId + " .swiper-button-next",
          prevEl: "#swiper-" + this.rxcompId + " .swiper-button-prev"
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_(); // console.log('SwiperTopEventsDirective.onInit');
    };

    return SwiperTopEventsDirective;
  }(SwiperDirective);
  SwiperTopEventsDirective.meta = {
    selector: '[swiper-top-events]'
  };

  var ThronComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(ThronComponent, _Component);

    function ThronComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ThronComponent.prototype;

    _proto.onInit = function onInit() {
      var THRON = window.THRONContentExperience || window.THRONPlayer;

      if (!THRON) {
        return;
      }

      ThronComponent.registerSkin();

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('id', "thron-" + this.rxcompId);
      var media = this.thron;

      if (media.indexOf('pkey=') === -1) {
        var splitted = media.split('/');
        var clientId = splitted[6];
        var xcontentId = splitted[7];
        var pkey = splitted[8];
        media = "https://gruppoconcorde-view.thron.com/api/xcontents/resources/delivery/getContentDetail?clientId=" + clientId + "&xcontentId=" + xcontentId + "&pkey=" + pkey; // console.log(media);
      }

      var controls = node.hasAttribute('controls') ? true : false,
          loop = node.hasAttribute('loop') ? true : false,
          autoplay = node.hasAttribute('autoplay') ? true : false,
          live = node.hasAttribute('live') ? true : false;
      var player = this.player = THRON(node.id, {
        media: media,
        loop: loop,
        autoplay: autoplay,
        muted: !controls,
        displayLinked: 'close',
        noSkin: !controls,
        // lockBitrate: 'max',
        //loader spinner color
        preloadColor: '#446CB3',
        //Audio Wave color
        waveColor: '#ffffff',
        waveProgressColor: '#446CB3'
      });
      /*
      // Set the bottom bar of the video with share and fullscreen only. The first on the left and the second to the right.
      const params = {
      	sessId: 'asessId',
      	clientId: 'aclientId',
      	xcontentId: 'acontentId'
      };
      */

      this.onBeforeInit = this.onBeforeInit.bind(this);
      this.onReady = this.onReady.bind(this);
      this.onCanPlay = this.onCanPlay.bind(this);
      this.onPlaying = this.onPlaying.bind(this);
      this.onComplete = this.onComplete.bind(this);
      player.on('beforeInit', this.onBeforeInit);
      player.on('ready', this.onReady);
      player.on('canPlay', this.onCanPlay);
      player.on('playing', this.onPlaying);
      player.on('complete', this.onComplete);
    };

    _proto.onBeforeInit = function onBeforeInit(playerInstance) {
      // VIDEO: ['captionText', 'shareButton', 'downloadableButton', 'playButton', 'timeSeek', 'timeInfoText', 'volumeButton', 'hdButton', 'speedButton', 'fullscreenButton', 'subtitleButton'],
      var removedElements = ['captionText', 'subtitleButton', 'downloadableButton', 'speedButton'];

      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      var live = node.hasAttribute('live') ? true : false;

      if (live) {
        removedElements.push('timeSeek', 'timeInfoText');
      } // Removes playButton and hdButton from schema bar


      var schema = window.THRONSchemaHelper.getSchema();
      var elements = window.THRONSchemaHelper.removeElementsById(schema, 'VIDEO', removedElements); // A simple verify: existsElements must false

      var existsElements = window.THRONSchemaHelper.getElementsById(schema, 'VIDEO', removedElements).coordinates.length > 0;
      console.log('ThronComponent.onBeforeInit.existsElements', existsElements);
      var params = {
        bars: schema
      };
      playerInstance.params(params);
    };

    _proto.onReady = function onReady() {
      var _getContext3 = rxcomp.getContext(this),
          node = _getContext3.node;

      var controls = node.hasAttribute('controls') ? true : false;

      if (!controls) {
        var player = this.player;
        var mediaContainer = player.mediaContainer();
        var video = mediaContainer.querySelector('video');
        video.setAttribute('playsinline', 'true');
      }

      this.ready.next(this);
    };

    _proto.onCanPlay = function onCanPlay() {
      this.canPlay.next(this);
    };

    _proto.onPlaying = function onPlaying() {
      var player = this.player;
      player.off('playing', this.onPlaying);

      var _getContext4 = rxcomp.getContext(this),
          node = _getContext4.node;

      var controls = node.hasAttribute('controls') ? true : false;

      if (!controls) {
        var qualities = player.qualityLevels();

        if (qualities.length) {
          var highestQuality = qualities[qualities.length - 1].index;
          var lowestQuality = qualities[0].index;
          player.currentQuality(highestQuality);
        }
      }
    };

    _proto.onComplete = function onComplete() {
      this.complete.next(this);
    };

    _proto.onDestroy = function onDestroy() {
      var player = this.player;
      player.off('ready', this.onReady);
      player.off('canPlay', this.onCanPlay);
      player.off('playing', this.onPlaying);
      player.off('complete', this.onComplete);
    };

    _proto.play = function play() {
      var player = this.player;
      var status = player.status();

      if (status && !status.playing) {
        player.play();
      }
    };

    _proto.pause = function pause() {
      var player = this.player;
      var status = player.status();

      if (status && status.playing) {
        player.pause();
      }
    };

    ThronComponent.registerSkin = function registerSkin() {
      if (window.wseThronPlugin) {
        return;
      }

      window.wseThronPlugin = function (playerInstance, dom, otherparams, jquery) {
        this.player = playerInstance;
        this.$ = jquery;
        /*
        this.player.on('beforeInit',
        	function(playerInstance) {
        		console.log('set action before player init', playerInstance, 'otherparams', otherparams);
        		var params = {
        			volume: 0.5,
        			autoplay: false,
        			linkedContent: 'show',
        			//loader spinner color
        			preloadColor: '#f39900',
        			//Audio Wave color
        			waveColor: '#ffffff',
        			waveProgressColor: '#f39900'
        		};
        		//add params
        		playerInstance.params(params);
        	}
        );
        this.player.on('resize', function(playerInstance) {
        	console.log('resize', playerInstance);
        });
        this.player.on('ready', function(playerInstance) {
        	console.log('ready', playerInstance);
        });
        */
      };

      THRONContentExperience.plugin('wse', wseThronPlugin);
    };

    return ThronComponent;
  }(rxcomp.Component);
  ThronComponent.meta = {
    selector: '[thron]',
    outputs: ['ready', 'canPlay', 'complete'],
    inputs: ['thron']
  };

  function push_(event) {
    var dataLayer = window.dataLayer || [];
    dataLayer.push(event);
    console.log('GtmService.dataLayer', event);
  }

  var GtmService = /*#__PURE__*/function () {
    function GtmService() {}

    GtmService.push = function push(event) {
      return push_(event);
    };

    return GtmService;
  }();

  var VideoComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(VideoComponent, _Component);

    function VideoComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = VideoComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.item = {};

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node,
          parentInstance = _getContext.parentInstance;

      node.classList.add('video');
      this.video = node.querySelector('video');
      this.progress = node.querySelector('.icon--play-progress path');

      if (parentInstance instanceof SwiperDirective) {
        parentInstance.events$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          return _this.pause();
        });
      }

      this.addListeners();
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
    };

    _proto.addListeners = function addListeners() {
      var video = this.video;

      if (video) {
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        video.addEventListener('play', this.onPlay);
        video.addEventListener('pause', this.onPause);
        video.addEventListener('ended', this.onEnded);
        video.addEventListener('timeupdate', this.onTimeUpdate);
      }
    };

    _proto.removeListeners = function removeListeners() {
      var video = this.video;

      if (video) {
        video.removeEventListener('play', this.onPlay);
        video.removeEventListener('pause', this.onPause);
        video.removeEventListener('ended', this.onEnded);
        video.removeEventListener('timeupdate', this.onTimeUpdate);
      }
    };

    _proto.togglePlay = function togglePlay() {
      // console.log('VideoComponent.togglePlay')
      var video = this.video;

      if (video) {
        if (video.paused) {
          this.play();
        } else {
          this.pause();
        }
      }
    };

    _proto.play = function play() {
      var video = this.video;
      video.muted = false;
      video.play();
    };

    _proto.pause = function pause() {
      var video = this.video;
      video.muted = true;
      video.pause();
    };

    _proto.onPlay = function onPlay() {
      this.playing = true;
      GtmService.push({
        event: 'video play',
        video_name: this.video.src
      });
    };

    _proto.onPause = function onPause() {
      this.playing = false;
    };

    _proto.onEnded = function onEnded() {
      this.playing = false;
    };

    _proto.onTimeUpdate = function onTimeUpdate() {
      this.progress.style.strokeDashoffset = this.video.currentTime / this.video.duration;
    };

    _createClass(VideoComponent, [{
      key: "playing",
      get: function get() {
        return this.playing_;
      },
      set: function set(playing) {
        if (this.playing_ !== playing) {
          this.playing_ = playing;
          this.pushChanges();
        }
      }
    }]);

    return VideoComponent;
  }(rxcomp.Component);
  VideoComponent.meta = {
    selector: '[video]',
    inputs: ['item']
  };

  var VirtualItem = /*#__PURE__*/function (_Context) {
    _inheritsLoose(VirtualItem, _Context);

    function VirtualItem(key, $key, value, $value, index, count, parentInstance) {
      var _this;

      _this = _Context.call(this, parentInstance) || this;
      _this[key] = $key;
      _this[value] = $value;
      _this.index = index;
      _this.count = count;
      return _this;
    }

    _createClass(VirtualItem, [{
      key: "first",
      get: function get() {
        return this.index === 0;
      }
    }, {
      key: "last",
      get: function get() {
        return this.index === this.count - 1;
      }
    }, {
      key: "even",
      get: function get() {
        return this.index % 2 === 0;
      }
    }, {
      key: "odd",
      get: function get() {
        return !this.even;
      }
    }]);

    return VirtualItem;
  }(rxcomp.Context);

  var VirtualMode = {
    Responsive: 1,
    Grid: 2,
    Centered: 3,
    List: 4
  };

  var VirtualStructure = /*#__PURE__*/function (_Structure) {
    _inheritsLoose(VirtualStructure, _Structure);

    function VirtualStructure() {
      return _Structure.apply(this, arguments) || this;
    }

    var _proto = VirtualStructure.prototype;

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          module = _getContext.module,
          node = _getContext.node;

      var template = node.firstElementChild;
      var expression = node.getAttribute('*virtual');
      node.removeAttribute('*virtual');
      node.removeChild(template);
      var tokens = this.tokens = this.getExpressionTokens(expression);
      this.virtualFunction = module.makeFunction(tokens.iterable);
      this.container = node;
      this.template = template;
      this.mode = this.mode || 1;
      this.width = this.width || 250;
      this.gutter = this.gutter !== undefined ? this.gutter : 20;
      this.options = {
        top: 0,
        width: this.width,
        gutter: this.gutter,
        containerWidth: 0,
        containerHeight: 0,
        cols: [0],
        strategy: 1
      };
      this.cachedRects = {};
      this.cachedInstances = [];
      this.cacheNodes = [];
      this.items$ = new rxjs.BehaviorSubject([]);
      this.update$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (visibleItems) {// console.log(visibleItems.length);
      });
    };

    _proto.onChanges = function onChanges(changes) {
      var context = rxcomp.getContext(this);
      var module = context.module; // resolve

      var items = module.resolve(this.virtualFunction, context.parentInstance, this) || [];
      this.mode = this.mode || 1;
      this.width = this.width || 250;
      this.gutter = this.gutter !== undefined ? this.gutter : 20;
      this.options.width = this.width;
      this.updateView(true);
      this.items$.next(items);
    };

    _proto.update$ = function update$() {
      var _this = this;

      return rxjs.merge(this.scroll$(), this.resize$(), this.items$).pipe(operators.map(function (datas) {
        var options = _this.options;

        var items = _this.items$.getValue();

        var total = items.length;
        _this.container.position = 'relative';
        var highestHeight = 0;

        var width = _this.getWidth();

        var gutter = _this.getGutter(width);

        var visibleItems = items.filter(function (item, i) {
          var col, height, top, left, bottom;
          var rect = _this.cachedRects[i];

          if (rect) {
            col = rect.col;
            height = rect.height;
            left = rect.left; // top = rect.top;
            // bottom = rect.bottom;
          } else {
            col = _this.getCol();
            height = _this.getHeight(width, item);
          }

          top = options.cols[col];

          if (_this.intersect(top + options.top, top + height + options.top, 0, options.containerHeight)) {
            if (!rect) {
              left = _this.getLeft(col, width, gutter);
            }

            var node = _this.cachedNode(i, i, item, total);

            node.style.position = 'absolute';
            node.style.top = top + 'px';
            node.style.left = left + 'px';
            node.style.width = width + 'px';

            if (height !== node.offsetHeight) {
              height = node.offsetHeight;
            }

            bottom = top + height + options.gutter;
            highestHeight = Math.max(highestHeight, bottom);
            options.cols[col] = bottom;

            if (!rect) {
              _this.cachedRects[i] = {
                col: col,
                width: width,
                height: height,
                left: left,
                top: top,
                bottom: bottom
              };
            } else {
              rect.height = height;
              rect.bottom = bottom;
            }

            return true;
          } else {
            _this.removeNode(i);

            bottom = top + height + options.gutter;
            options.cols[col] = bottom;
            highestHeight = Math.max(highestHeight, bottom);
            return false;
          }
        });
        var removeIndex = items.length;

        while (removeIndex < _this.cacheNodes.length) {
          _this.removeNode(removeIndex);

          removeIndex++;
        }

        _this.cacheNodes.length = items.length;
        _this.container.style.height = highestHeight + "px";
        return visibleItems;
      }));
    };

    _proto.getCols = function getCols() {
      var options = this.options;
      var cols = Math.floor((options.containerWidth + options.gutter) / (options.width + options.gutter)) || 1;
      return new Array(cols).fill(0);
    };

    _proto.getCol = function getCol() {
      var options = this.options;
      var col;

      switch (this.mode) {
        case VirtualMode.Grid:
        case VirtualMode.Centered:
        case VirtualMode.Responsive:
          col = options.cols.reduce(function (p, c, i, a) {
            return c < a[p] ? i : p;
          }, 0);
          break;

        case VirtualMode.List:
        default:
          col = 0;
      }

      return col;
    };

    _proto.getWidth = function getWidth() {
      var options = this.options;
      var width;

      switch (this.mode) {
        case VirtualMode.Grid:
        case VirtualMode.Centered:
          width = options.width;
          break;

        case VirtualMode.Responsive:
          width = (options.containerWidth - (options.cols.length - 1) * options.gutter) / options.cols.length;
          break;

        case VirtualMode.List:
        default:
          width = options.containerWidth;
      }

      return width;
    };

    _proto.getHeight = function getHeight(width, item) {
      var options = this.options;
      var height;

      switch (this.mode) {
        case VirtualMode.Grid:
        case VirtualMode.Centered:
        case VirtualMode.Responsive:
          height = options.width;
          break;

        case VirtualMode.List:
        default:
          height = 80;
      }

      return height;
    };

    _proto.getGutter = function getGutter(width) {
      var options = this.options;
      var gutter;

      switch (this.mode) {
        case VirtualMode.Grid:
        case VirtualMode.Centered:
          gutter = options.gutter;
          break;

        case VirtualMode.Responsive:
          gutter = (options.containerWidth - options.cols.length * width) / (options.cols.length - 1);
          break;

        case VirtualMode.List:
        default:
          gutter = 0;
      }

      return gutter;
    };

    _proto.getLeft = function getLeft(index, width, gutter) {
      var options = this.options;
      var left;

      switch (this.mode) {
        case VirtualMode.Grid:
        case VirtualMode.Responsive:
          left = index * (width + gutter);
          break;

        case VirtualMode.Centered:
          left = (options.containerWidth - options.cols.length * (width + gutter) + gutter) / 2 + index * (width + gutter);
          break;

        case VirtualMode.List:
        default:
          left = 0;
      }

      return left;
    };

    _proto.cachedNode = function cachedNode(index, i, value, total) {
      if (this.cacheNodes[index]) {
        return this.updateNode(index, i, value);
      } else {
        return this.createNode(index, i, value, total);
      }
    };

    _proto.createNode = function createNode(index, i, value, total) {
      var clonedNode = this.template.cloneNode(true);
      delete clonedNode.rxcompId;
      this.container.appendChild(clonedNode);
      this.cacheNodes[index] = clonedNode;
      var context = rxcomp.getContext(this);
      var module = context.module;
      var tokens = this.tokens;
      var args = [tokens.key, i, tokens.value, value, i, total, context.parentInstance];
      var instance = module.makeInstance(clonedNode, VirtualItem, context.selector, context.parentInstance, args);
      var forItemContext = rxcomp.getContext(instance);
      module.compile(clonedNode, forItemContext.instance);
      this.cachedInstances[index] = instance;
      return clonedNode;
    };

    _proto.updateNode = function updateNode(index, i, value) {
      var instance = this.cachedInstances[index];
      var tokens = this.tokens;

      if (instance[tokens.key] !== i) {
        instance[tokens.key] = i;
        instance[tokens.value] = value;
        instance.pushChanges();
      } // console.log(index, i, value);


      return this.cacheNodes[index];
    };

    _proto.removeNode = function removeNode(index) {
      this.cachedInstances[index] = undefined;
      var node = this.cacheNodes[index];

      if (node) {
        var context = rxcomp.getContext(this);
        var module = context.module;
        node.parentNode.removeChild(node);
        module.remove(node);
      }

      this.cacheNodes[index] = undefined;
      return node;
    };

    _proto.intersect = function intersect(top1, bottom1, top2, bottom2) {
      return top2 < bottom1 && bottom2 > top1;
    };

    _proto.resize$ = function resize$() {
      var _this2 = this;

      return rxjs.fromEvent(window, 'resize').pipe(operators.auditTime(100), operators.startWith(null), operators.tap(function () {
        return _this2.updateView(true);
      }));
    };

    _proto.scroll$ = function scroll$(node) {
      var _this3 = this;

      return rxjs.fromEvent(window, 'scroll').pipe(operators.tap(function () {
        return _this3.updateView();
      }));
    };

    _proto.updateView = function updateView(reset) {
      var rect = this.container.getBoundingClientRect();
      var options = this.options;
      options.top = rect.top;
      options.containerWidth = rect.width;
      options.containerHeight = window.innerHeight;
      options.cols = this.getCols();

      if (reset) {
        this.cachedRects = {};
      }
    };

    _proto.getExpressionTokens = function getExpressionTokens(expression) {
      if (expression === null) {
        throw new Error('invalid virtual');
      }

      if (expression.trim().indexOf('let ') === -1 || expression.trim().indexOf(' of ') === -1) {
        throw new Error('invalid virtual');
      }

      var expressions = expression.split(';').map(function (x) {
        return x.trim();
      }).filter(function (x) {
        return x !== '';
      });
      var virtualExpressions = expressions[0].split(' of ').map(function (x) {
        return x.trim();
      });
      var value = virtualExpressions[0].replace(/\s*let\s*/, '');
      var iterable = virtualExpressions[1];
      var key = 'index';
      var keyValueMatches = value.match(/\[(.+)\s*,\s*(.+)\]/);

      if (keyValueMatches) {
        key = keyValueMatches[1];
        value = keyValueMatches[2];
      }

      if (expressions.length > 1) {
        var indexExpressions = expressions[1].split(/\s*let\s*|\s*=\s*index/).map(function (x) {
          return x.trim();
        });

        if (indexExpressions.length === 3) {
          key = indexExpressions[1];
        }
      }

      return {
        key: key,
        value: value,
        iterable: iterable
      };
    };

    return VirtualStructure;
  }(rxcomp.Structure);
  VirtualStructure.meta = {
    selector: '[*virtual]',
    inputs: ['mode', 'width', 'gutter']
  };

  var YoutubeComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(YoutubeComponent, _Component);

    function YoutubeComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = YoutubeComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.item = {};

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node,
          parentInstance = _getContext.parentInstance;

      node.classList.add('youtube');

      if (YoutubeComponent.MOBILE) {
        node.classList.add('mobile');
      }

      this.progress = node.querySelector('.icon--play-progress path');
      this.onPlayerReady = this.onPlayerReady.bind(this);
      this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
      this.onPlayerError = this.onPlayerError.bind(this);
      this.id$ = new rxjs.Subject().pipe(operators.distinctUntilChanged());

      if (parentInstance instanceof SwiperDirective) {
        parentInstance.events$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          return _this.pause();
        });
      } // this.addListeners();

    };

    _proto.onChanges = function onChanges(changes) {
      var id = this.youtubeId; // console.log('YoutubeComponent.onChanges', id);

      this.id$.next(id);
    };

    _proto.initPlayer = function initPlayer() {
      // console.log('VideoComponent.initPlayer');
      this.player$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (player) {
        console.log('YoutubeComponent.player$', player);
      });
      this.interval$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {});
      this.id$.next(this.youtubeId);
    };

    _proto.player$ = function player$() {
      var _this2 = this;

      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      var video = node.querySelector('.video');
      return this.id$.pipe(operators.switchMap(function (id) {
        // console.log('YoutubeComponent.videoId', id);
        return YoutubeComponent.once$().pipe(operators.map(function (youtube) {
          // console.log('YoutubeComponent.once$', youtube);
          _this2.destroyPlayer();

          _this2.player = new youtube.Player(video, {
            width: node.offsetWidth,
            height: node.offsetHeight,
            videoId: id,
            playerVars: {
              autoplay: 1,
              controls: 1,
              // YoutubeComponent.MOBILE ? 1 : 0,
              disablekb: 1,
              enablejsapi: 1,
              fs: 0,
              loop: 1,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              listType: 'user_uploads' // origin: 'https://log6i.csb.app/'

            },
            events: {
              onReady: _this2.onPlayerReady,
              onStateChange: _this2.onPlayerStateChange,
              onPlayerError: _this2.onPlayerError
            }
          });
          return _this2.player;
        }));
      }));
    };

    _proto.onPlayerReady = function onPlayerReady(event) {
      // console.log('YoutubeComponent.onPlayerReady', event);
      event.target.mute();
      event.target.playVideo();
    };

    _proto.onPlayerStateChange = function onPlayerStateChange(event) {
      // console.log('YoutubeComponent.onPlayerStateChange', event.data);
      if (event.data === 1) {
        this.playing = true;
      } else {
        this.playing = false;
      }
    };

    _proto.onPlayerError = function onPlayerError(event) {
      console.log('YoutubeComponent.onPlayerError', event);
    };

    _proto.destroyPlayer = function destroyPlayer() {
      if (this.player) {
        this.player.destroy();
      }
    };

    _proto.onDestroy = function onDestroy() {
      this.destroyPlayer();
    };

    _proto.interval$ = function interval$() {
      var _this3 = this;

      return rxjs.interval(500).pipe(operators.filter(function () {
        return _this3.playing && _this3.player;
      }), operators.tap(function () {
        _this3.progress.style.strokeDashoffset = _this3.player.getCurrentTime() / _this3.player.getDuration();
      }));
    };

    _proto.togglePlay = function togglePlay() {
      // console.log('VideoComponent.togglePlay');
      if (this.playing) {
        this.pause();
      } else {
        this.play();
      }
    };

    _proto.play = function play() {
      // console.log('VideoComponent.play');
      if (!this.player) {
        this.initPlayer();
      } else {
        this.player.playVideo();
      }
    };

    _proto.pause = function pause() {
      if (!this.player) {
        return;
      }

      this.player.stopVideo();
    };

    YoutubeComponent.once$ = function once$() {
      if (this.youtube$) {
        return this.youtube$;
      } else {
        this.youtube$ = new rxjs.BehaviorSubject(null).pipe(operators.filter(function (youtube) {
          return youtube !== null;
        }));
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady_.bind(this);
        var script = document.createElement('script');
        var scripts = document.querySelectorAll('script');
        var last = scripts[scripts.length - 1];
        last.parentNode.insertBefore(script, last);
        script.src = '//www.youtube.com/iframe_api';
        return this.youtube$;
      }
    };

    YoutubeComponent.onYouTubeIframeAPIReady_ = function onYouTubeIframeAPIReady_() {
      // console.log('onYouTubeIframeAPIReady');
      this.youtube$.next(window.YT);
    };

    YoutubeComponent.mobilecheck = function mobilecheck() {
      var check = false;

      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);

      return check;
    };

    YoutubeComponent.mobileAndTabletcheck = function mobileAndTabletcheck() {
      var check = false;

      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);

      return check;
    };

    _createClass(YoutubeComponent, [{
      key: "playing",
      get: function get() {
        return this.playing_;
      },
      set: function set(playing) {
        if (this.playing_ !== playing) {
          this.playing_ = playing;
          this.pushChanges();
        }
      }
    }, {
      key: "cover",
      get: function get() {
        return this.youtubeId ? "//i.ytimg.com/vi/" + this.youtubeId + "/maxresdefault.jpg" : '';
      }
    }]);

    return YoutubeComponent;
  }(rxcomp.Component);
  YoutubeComponent.MOBILE = YoutubeComponent.mobileAndTabletcheck();
  YoutubeComponent.meta = {
    selector: '[youtube]',
    inputs: ['youtubeId', 'title']
  };

  var AppModule = /*#__PURE__*/function (_Module) {
    _inheritsLoose(AppModule, _Module);

    function AppModule() {
      return _Module.apply(this, arguments) || this;
    }

    return AppModule;
  }(rxcomp.Module);
  AppModule.meta = {
    imports: [rxcomp.CoreModule, rxcompForm.FormModule],
    declarations: [AsideComponent, ChannelComponent, ChannelPageComponent, ClickOutsideDirective, CountPipe, DatePipe, DropdownDirective, DropdownItemDirective, ErrorsComponent, EventComponent, EventDateComponent, EventPageComponent, FavouritePageComponent, HeaderComponent, HtmlPipe, IndexPageComponent, LazyDirective, ModalComponent, ModalOutletComponent, NotificationComponent, RegisterOrLoginComponent, RelativeDateDirective, RelativeDatePipe, ScrollToDirective, SecureDirective, SlugPipe, SwiperDirective, SwiperEventsDirective, SwiperRelatedDirective, SwiperSlidesDirective, SwiperTopEventsDirective, ThronComponent, VirtualStructure, VideoComponent, YoutubeComponent],
    bootstrap: AppComponent
  };

  rxcomp.Browser.bootstrap(AppModule);

})));
