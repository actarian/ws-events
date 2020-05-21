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

      node.classList.remove('hidden');
    } // onView() { const context = getContext(this); }
    // onChanges() {}
    // onDestroy() {}
    ;

    return AppComponent;
  }(rxcomp.Component);
  AppComponent.meta = {
    selector: '[app-component]'
  };

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

    _proto.updateFilterStates = function updateFilterStates(filters, items) {
      var _this3 = this;

      Object.keys(filters).forEach(function (x) {
        var filter = filters[x];

        var filteredItems = _this3.filterItems(items, filter);

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

          option.count = count;
          option.disabled = count === 0;
        });
      });
    };

    return FilterService;
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

  var STATIC = window.location.port === '40333' || window.location.host === 'actarian.github.io';
  var DEVELOPMENT = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(window.location.host.split(':')[0]) !== -1;

  var HttpService = /*#__PURE__*/function () {
    function HttpService() {}

    HttpService.http$ = function http$(method, url, data, format) {
      var _this = this;

      if (format === void 0) {
        format = 'json';
      }

      var methods = ['POST', 'PUT', 'PATCH'];
      var response_ = null;
      return rxjs.from(fetch(this.getUrl(url, format), {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
      }).then(function (response) {
        response_ = response; // console.log(response);

        if (response.ok) {
          return response[format]();
        } else {
          return response.json().then(function (json) {
            return Promise.reject(json);
          });
        }
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

    HttpService.getUrl = function getUrl(url, format) {
      if (format === void 0) {
        format = 'json';
      }

      // console.log(url);
      return STATIC && format === 'json' && url.indexOf('/') === 0 ? "." + url + ".json" : url;
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
        var diff = this.startDate - now;
        var hoursDiff = Math.floor(diff / 1000 / 60 / 60);
        return !this.info.started && this.startDate > now && hoursDiff >= 24;
      }
    }, {
      key: "past",
      get: function get() {
        return this.info.ended;
      }
    }]);

    function Event(data) {
      if (data) {
        Object.assign(this, data);

        if (this.creationDate) {
          this.creationDate = new Date(this.creationDate);
        }

        if (this.startDate) {
          this.startDate = new Date(this.startDate);
        }

        if (this.endDate) {
          this.endDate = new Date(this.endDate);
        }
      }
    }

    return Event;
  }();

  var EventService = /*#__PURE__*/function () {
    function EventService() {}

    EventService.detail$ = function detail$(eventId) {
      return HttpService.get$("/api/event/" + eventId + "/detail").pipe(operators.map(function (x) {
        return EventService.fake(new Event(x));
      }) // map(x => new Event(x))
      );
    };

    EventService.top$ = function top$() {
      return HttpService.get$("/api/event/evidence").pipe(operators.map(function (items) {
        return items.map(function (x) {
          return EventService.fake(new Event(x));
        });
      }) // map(items => items.map(x => new Event(x)))
      );
    };

    EventService.upcoming$ = function upcoming$() {
      return HttpService.get$("/api/event/upcoming").pipe( // map(items => items.map(x => EventService.fake(new Event(x))))
      operators.map(function (items) {
        return items.map(function (x) {
          return new Event(x);
        });
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

    EventService.mapEvents = function mapEvents(events) {
      var _this = this;

      return events ? events.map(function (x) {
        return _this.fake(new Event(x));
      }) : [];
    };

    EventService.fake = function fake(item) {
      // console.log('EventService.fake', item);
      var now = new Date();
      var index = item.id % 1000;
      item.url = item.url + "?eventId=" + item.id;
      item.channel.url = item.channel.url + "?channelId=" + item.channel.id;
      item.info.subscribers = 50 + Math.floor(Math.random() * 200);
      item.info.likes = 50 + Math.floor(Math.random() * 200);

      switch (index) {
        case 1:
          item.startDate = new Date(new Date().setMinutes(now.getMinutes() - 10));
          item.endDate = null;
          item.info.started = true;
          item.info.ended = false;
          break;

        case 2:
          item.startDate = new Date(new Date().setHours(now.getHours() + 2));
          item.endDate = null;
          item.info.started = false;
          item.info.ended = false;
          break;

        case 3:
          item.startDate = new Date(new Date().setHours(now.getHours() - 7));
          item.endDate = new Date(new Date().setHours(now.getHours() - 6));
          item.info.started = true;
          item.info.ended = true;
          break;

        case 4:
          item.startDate = new Date(new Date().setDate(now.getDate() + 7));
          item.endDate = null;
          item.info.started = false;
          item.info.ended = false;
          break;

        case 5:
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

      return item;
    };

    return EventService;
  }();

  var Channel = function Channel(data) {
    if (data) {
      Object.assign(this, data);
      this.events = EventService.mapEvents(this.events);
    }
  };

  var ChannelService = /*#__PURE__*/function () {
    function ChannelService() {}

    ChannelService.channels$ = function channels$() {
      return HttpService.get$("/api/channel/channels").pipe(operators.map(function (items) {
        return items.map(function (x) {
          return ChannelService.fake(new Channel(x));
        });
      }) // map(items => items.map(x => new Channel(x)))
      );
    };

    ChannelService.detail$ = function detail$(channelId) {
      return HttpService.get$("/api/channel/" + channelId + "/detail").pipe(operators.map(function (x) {
        return ChannelService.fake(new Channel(x));
      }) // map(x => new Channel(x))
      );
    };

    ChannelService.listing$ = function listing$(channelId) {
      // return HttpService.get$(`/api/channel/${channelId}/listing`);
      return ChannelService.fakeListing(channelId).pipe(operators.tap(function (items) {// console.log(JSON.stringify(items));
      }));
    };

    ChannelService.top$ = function top$() {
      return HttpService.get$("/api/channel/evidence").pipe(operators.map(function (items) {
        return items.map(function (x) {
          return ChannelService.fake(new Channel(x));
        });
      }) // map(items => items.map(x => new Channel(x)))
      );
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

    ChannelService.fake = function fake(item) {
      // console.log('ChannelService.fake', item);
      item.url = item.url + "?channelId=" + item.id;
      item.info.subscribers = 1500 + Math.floor(Math.random() * 200);
      item.info.likes = 500 + Math.floor(Math.random() * 200);
      return item;
    };

    ChannelService.fakeListing = function fakeListing(channelId) {
      return HttpService.get$("/api/channel/" + channelId + "/detail").pipe(operators.map(function (x) {
        var channel_ = ChannelService.fake(new Channel(x));
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
          url: '/ws-events/event.html',
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
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L'];
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
            item.channel = Object.assign({}, x);
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
              item = EventService.fake(new Event(item));
              break;
          }

          return item;
        });
      }) // map(x => new Channel(x))
      );
    };

    ChannelService.fakeListing_ = function fakeListing_(channelId) {
      return HttpService.get$("/api/channel/" + channelId + "/detail").pipe(operators.map(function (x) {
        var channel_ = ChannelService.fake(new Channel(x));
        var event_ = {
          id: 1000,
          type: 'event',
          name: 'Evento XYZ',
          title: 'Evento XYZ',
          abstract: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget dolor tincidunt, lobortis dolor eget, condimentum libero.</p>',
          picture: {
            src: 'https://source.unsplash.com/random/',
            width: 700,
            height: 700
          },
          url: '/ws-events/event.html',
          creationDate: '2020-05-20T08:11:17.827Z',
          startDate: '2020-05-20T08:11:17.827Z',
          info: {
            started: false,
            ended: false,
            subscribers: 100,
            subscribed: false,
            likes: 100,
            liked: false
          },
          channel: channel_
        };
        return new Array(250).fill(true).map(function (x, i) {
          var item = Object.assign({}, event_);
          item.id = (channelId - 100) * 1000 + 1 + i;
          item.picture = Object.assign({}, event_.picture);
          item.picture.width = 700;
          item.picture.height = [700, 900, 1100][i % 3];
          item.info = Object.assign({}, event_.info);
          item.channel = Object.assign({}, x);
          return EventService.fake(new Event(item));
        });
      }) // map(x => new Channel(x))
      );
    };

    return ChannelService;
  }();

  var ChannelPageComponent = /*#__PURE__*/function (_PageComponent) {
    _inheritsLoose(ChannelPageComponent, _PageComponent);

    function ChannelPageComponent() {
      return _PageComponent.apply(this, arguments) || this;
    }

    var _proto = ChannelPageComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.channels = this.channel = this.listing = null;
      this.grid = {
        mode: 1,
        width: 350,
        gutter: 2
      };
      this.filteredItems = [];
      var filters = {
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
      var filterService = this.filterService = new FilterService(filters, {}, function (key, filter) {
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
      this.load$().pipe(operators.first()).subscribe(function (data) {
        _this.channels = data[0];
        _this.channel = data[1];
        _this.listing = data[2];

        _this.startFilter(_this.listing);

        _this.pushChanges();
      });
    };

    _proto.load$ = function load$() {
      var channelId = LocationService.get('channelId');
      return rxjs.combineLatest(ChannelService.channels$(), ChannelService.detail$(channelId), ChannelService.listing$(channelId));
    };

    _proto.startFilter = function startFilter(items) {
      var _this2 = this;

      this.filterService.items$(items).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (filteredItems) {
        _this2.filteredItems = [];

        _this2.pushChanges();

        setTimeout(function () {
          _this2.filteredItems = filteredItems;

          _this2.pushChanges();
        }, 1);
        console.log('ChannelPageComponent.filteredItems', filteredItems.length);
      });
    };

    _proto.toggleGrid = function toggleGrid() {
      this.grid.width = this.grid.width === 350 ? 700 : 350;
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

  var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/;
  var NUMBER_STRING = /^-?\d+$/;
  var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
  var ALL_COLONS = /:/g;
  var ZERO_CHAR = '0'; // dateFilter.$inject = ['$locale'];
  var DATETIME_FORMATS_IT_IT = {
    "AMPMS": ["AM", "PM"],
    "DAY": ["domenica", "luned\xEC", "marted\xEC", "mercoled\xEC", "gioved\xEC", "venerd\xEC", "sabato"],
    "MONTH": ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    "SHORTDAY": ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
    "SHORTMONTH": ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
    "fullDate": "EEEE d MMMM y",
    "longDate": "dd MMMM y",
    "medium": "dd/MMM/y HH:mm:ss",
    "mediumDate": "dd/MMM/y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  };

  var DatePipe = /*#__PURE__*/function (_Pipe) {
    _inheritsLoose(DatePipe, _Pipe);

    function DatePipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    DatePipe.isNumber = function isNumber(value) {
      return typeof value === 'number' && isFinite(value);
    };

    DatePipe.padNumber = function padNumber(num, digits, trim, negWrap) {
      var neg = '';

      if (num < 0 || negWrap && num <= 0) {
        if (negWrap) {
          num = -num + 1;
        } else {
          num = -num;
          neg = '-';
        }
      }

      num = '' + num;

      while (num.length < digits) {
        num = ZERO_CHAR + num;
      }

      if (trim) {
        num = num.substr(num.length - digits);
      }

      return neg + num;
    };

    DatePipe.dateGetter = function dateGetter(name, size, offset, trim, negWrap) {
      offset = offset || 0;
      return function (date) {
        var value = date['get' + name]();

        if (offset > 0 || value > -offset) {
          value += offset;
        }

        if (value === 0 && offset === -12) value = 12;
        return DatePipe.padNumber(value, size, trim, negWrap);
      };
    };

    DatePipe.dateStrGetter = function dateStrGetter(name, shortForm, standAlone) {
      return function (date, formats) {
        var value = date['get' + name]();
        var propPrefix = (standAlone ? 'STANDALONE' : '') + (shortForm ? 'SHORT' : '');
        var get = (propPrefix + name).toUpperCase();
        return formats[get][value];
      };
    };

    DatePipe.timeZoneGetter = function timeZoneGetter(date, formats, offset) {
      var zone = -1 * offset;
      var paddedZone = zone >= 0 ? '+' : '';
      paddedZone += DatePipe.padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + DatePipe.padNumber(Math.abs(zone % 60), 2);
      return paddedZone;
    };

    DatePipe.getFirstThursdayOfYear = function getFirstThursdayOfYear(year) {
      // 0 = index of January
      var dayOfWeekOnFirst = new Date(year, 0, 1).getDay(); // 4 = index of Thursday (+1 to account for 1st = 5)
      // 11 = index of *next* Thursday (+1 account for 1st = 12)

      return new Date(year, 0, (dayOfWeekOnFirst <= 4 ? 5 : 12) - dayOfWeekOnFirst);
    };

    DatePipe.getThursdayThisWeek = function getThursdayThisWeek(datetime) {
      return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay())); // 4 = index of Thursday
    };

    DatePipe.weekGetter = function weekGetter(size) {
      return function (date) {
        var firstThurs = DatePipe.getFirstThursdayOfYear(date.getFullYear()),
            thisThurs = DatePipe.getThursdayThisWeek(date);
        var diff = +thisThurs - +firstThurs,
            result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

        return padNumber(result, size);
      };
    };

    DatePipe.ampmGetter = function ampmGetter(date, formats) {
      return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    };

    DatePipe.eraGetter = function eraGetter(date, formats) {
      return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
    };

    DatePipe.longEraGetter = function longEraGetter(date, formats) {
      return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
    };

    DatePipe.jsonStringToDate = function jsonStringToDate(string) {
      var match;

      if (match = string.match(R_ISO8601_STR)) {
        var tzHour = 0;
        var tzMin = 0;

        if (match[9]) {
          tzHour = parseInt(match[9] + match[10]);
          tzMin = parseInt(match[9] + match[11]);
        }

        var date = new Date(0);
        var dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
        var timeSetter = match[8] ? date.setUTCHours : date.setHours;
        dateSetter.call(date, parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        var h = parseInt(match[4] || 0) - tzHour;
        var m = parseInt(match[5] || 0) - tzMin;
        var s = parseInt(match[6] || 0);
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
      }

      return string;
    };

    DatePipe.timezoneToOffset = function timezoneToOffset(timezone, fallback) {
      // Support: IE 9-11 only, Edge 13-15+
      // IE/Edge do not "understand" colon (`:`) in timezone
      timezone = timezone.replace(ALL_COLONS, '');
      var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
      return Number.isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
    };

    DatePipe.addDateMinutes = function addDateMinutes(date, minutes) {
      date = new Date(date.getTime());
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    };

    DatePipe.convertTimezoneToLocal = function convertTimezoneToLocal(date, timezone, reverse) {
      reverse = reverse ? -1 : 1;
      var dateTimezoneOffset = date.getTimezoneOffset();
      var timezoneOffset = DatePipe.timezoneToOffset(timezone, dateTimezoneOffset);
      return DatePipe.addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
    };

    DatePipe.transform_ = function transform_(value, locale, options) {
      if (locale === void 0) {
        locale = 'it-IT-u-ca-gregory';
      }

      if (options === void 0) {
        options = {
          dateStyle: 'short',
          timeStyle: 'short'
        };
      }

      var localeDateString = new Date(value).toLocaleDateString(locale, options);
      return localeDateString;
    };

    DatePipe.transform = function transform(date, format, timezone) {
      var text = '',
          match;
      var parts = [];
      format = format || 'mediumDate';
      format = DatePipe.DATETIME_FORMATS[format] || format;

      if (typeof date === 'string') {
        date = NUMBER_STRING.test(date) ? parseInt(date) : DatePipe.jsonStringToDate(date);
      }

      if (DatePipe.isNumber(date)) {
        date = new Date(date);
      }

      if (!(date instanceof Date) || !isFinite(date.getTime())) {
        return date;
      }

      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);

        if (match) {
          // parts = concat(parts, match, 1);
          parts = parts.concat(match.slice(1));
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }

      var dateTimezoneOffset = date.getTimezoneOffset();

      if (timezone) {
        dateTimezoneOffset = DatePipe.timezoneToOffset(timezone, dateTimezoneOffset);
        date = DatePipe.convertTimezoneToLocal(date, timezone, true);
      }

      parts.forEach(function (value) {
        var formatter = DatePipe.DATE_FORMATS[value];
        text += formatter ? formatter(date, DatePipe.DATETIME_FORMATS, dateTimezoneOffset) : value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
      });
      return text;
    };

    return DatePipe;
  }(rxcomp.Pipe);
  DatePipe.DATE_FORMATS = {
    yyyy: DatePipe.dateGetter('FullYear', 4, 0, false, true),
    yy: DatePipe.dateGetter('FullYear', 2, 0, true, true),
    y: DatePipe.dateGetter('FullYear', 1, 0, false, true),
    MMMM: DatePipe.dateStrGetter('Month'),
    MMM: DatePipe.dateStrGetter('Month', true),
    MM: DatePipe.dateGetter('Month', 2, 1),
    M: DatePipe.dateGetter('Month', 1, 1),
    LLLL: DatePipe.dateStrGetter('Month', false, true),
    dd: DatePipe.dateGetter('Date', 2),
    d: DatePipe.dateGetter('Date', 1),
    HH: DatePipe.dateGetter('Hours', 2),
    H: DatePipe.dateGetter('Hours', 1),
    hh: DatePipe.dateGetter('Hours', 2, -12),
    h: DatePipe.dateGetter('Hours', 1, -12),
    mm: DatePipe.dateGetter('Minutes', 2),
    m: DatePipe.dateGetter('Minutes', 1),
    ss: DatePipe.dateGetter('Seconds', 2),
    s: DatePipe.dateGetter('Seconds', 1),
    // while ISO 8601 requires fractions to be prefixed with `.` or `,`
    // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
    sss: DatePipe.dateGetter('Milliseconds', 3),
    EEEE: DatePipe.dateStrGetter('Day'),
    EEE: DatePipe.dateStrGetter('Day', true),
    a: DatePipe.ampmGetter,
    Z: DatePipe.timeZoneGetter,
    ww: DatePipe.weekGetter(2),
    w: DatePipe.weekGetter(1),
    G: DatePipe.eraGetter,
    GG: DatePipe.eraGetter,
    GGG: DatePipe.eraGetter,
    GGGG: DatePipe.longEraGetter
  };
  DatePipe.DATETIME_FORMATS = DATETIME_FORMATS_IT_IT;
  DatePipe.meta = {
    name: 'date'
  };
  /**
     *   Formats `date` to a string based on the requested `format`.
     *
     *   `format` string can be composed of the following elements:
     *
     *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     *   * `'MMMM'`: Month in year (January-December)
     *   * `'MMM'`: Month in year (Jan-Dec)
     *   * `'MM'`: Month in year, padded (01-12)
     *   * `'M'`: Month in year (1-12)
     *   * `'LLLL'`: Stand-alone month in year (January-December)
     *   * `'dd'`: Day in month, padded (01-31)
     *   * `'d'`: Day in month (1-31)
     *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
     *   * `'EEE'`: Day in Week, (Sun-Sat)
     *   * `'HH'`: Hour in day, padded (00-23)
     *   * `'H'`: Hour in day (0-23)
     *   * `'hh'`: Hour in AM/PM, padded (01-12)
     *   * `'h'`: Hour in AM/PM, (1-12)
     *   * `'mm'`: Minute in hour, padded (00-59)
     *   * `'m'`: Minute in hour (0-59)
     *   * `'ss'`: Second in minute, padded (00-59)
     *   * `'s'`: Second in minute (0-59)
     *   * `'sss'`: Millisecond in second, padded (000-999)
     *   * `'a'`: AM/PM marker
     *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     *   * `'ww'`: Week of year, padded (00-53). Week 01 is the week with the first Thursday of the year
     *   * `'w'`: Week of year (0-53). Week 1 is the week with the first Thursday of the year
     *   * `'G'`, `'GG'`, `'GGG'`: The abbreviated form of the era string (e.g. 'AD')
     *   * `'GGGG'`: The long form of the era string (e.g. 'Anno Domini')
     *
     *   `format` string can also be one of the following predefined
     *   {@link guide/i18n localizable formats}:
     *
     *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
     *     (e.g. Sep 3, 2010 12:05:08 PM)
     *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 PM)
     *   * `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` for en_US  locale
     *     (e.g. Friday, September 3, 2010)
     *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
     *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
     *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
     *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 PM)
     *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 PM)
     *
     *   `format` string can contain literal values. These need to be escaped by surrounding with single quotes (e.g.
     *   `"h 'in the morning'"`). In order to output a single quote, escape it - i.e., two single quotes in a sequence
     *   (e.g. `"h 'o''clock'"`).
     *
     *   Any other characters in the `format` string will be output as-is.
     *
     * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
     *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its
     *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
     *    specified in the string input, the time is considered to be in the local timezone.
     * @param {string=} format Formatting rules (see Description). If not specified,
     *    `mediumDate` is used.
     * @param {string=} timezone Timezone to be used for formatting. It understands UTC/GMT and the
     *    continental US time zone abbreviations, but for general use, use a time zone offset, for
     *    example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
     *    If not specified, the timezone of the browser will be used.
     * @returns {string} Formatted string or the input if input is not recognized as date/millis.
     *
     * @example
  	 <example name="filter-date">
  	   <file name="index.html">
  		 <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
  			 <span>{{1288323623006 | date:'medium'}}</span><br>
  		 <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
  			<span>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span><br>
  		 <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
  			<span>{{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}</span><br>
  		 <span ng-non-bindable>{{1288323623006 | date:"MM/dd/yyyy 'at' h:mma"}}</span>:
  			<span>{{'1288323623006' | date:"MM/dd/yyyy 'at' h:mma"}}</span><br>
  	   </file>
  	   <file name="protractor.js" type="protractor">
  		 it('should format date', function() {
  		   expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
  			  toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
  		   expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
  			  toMatch(/2010-10-2\d \d{2}:\d{2}:\d{2} (-|\+)?\d{4}/);
  		   expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
  			  toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
  		   expect(element(by.binding("'1288323623006' | date:\"MM/dd/yyyy 'at' h:mma\"")).getText()).
  			  toMatch(/10\/2\d\/2010 at \d{1,2}:\d{2}(AM|PM)/);
  		 });
  	   </file>
  	 </example>
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
      if (item.live) {
        return EventDateMode.Live;
      } else if (item.incoming) {
        return EventDateMode.Countdown;
      }

      var hoursDiff = EventDateComponent.hoursDiff(item.startDate);

      if (item.past && hoursDiff < 24) {
        return EventDateMode.WatchRelative;
      } else if (hoursDiff < 24 * 3) {
        return EventDateMode.Relative;
      } else {
        return EventDateMode.Date;
      }
    };

    var _proto = EventDateComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.mode = EventDateComponent.getMode(this.eventDate);
      /*
      if (this.mode === EventDateMode.Countdown || this.mode === EventDateMode.WatchRelative) {
      	this.countdown = '';
      	this.live$ = new Subject();
      	this.change$().pipe(
      		takeUntil(this.unsubscribe$)
      	).subscribe(() => {
      		if (this.mode === EventDateMode.Countdown || this.mode === EventDateMode.WatchRelative) {
      			this.pushChanges();
      		}
      	});
      }
      */

      this.countdown = '';
      this.live$ = new rxjs.Subject();
      this.change$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {
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

      return rxjs.interval(1000).pipe(operators.takeUntil(this.live$), operators.tap(function () {
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

    return EventDateComponent;
  }(rxcomp.Component);
  EventDateComponent.meta = {
    selector: '[eventDate]',
    inputs: ['eventDate']
  };

  var EventComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(EventComponent, _Component);

    function EventComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = EventComponent.prototype;

    _proto.toggleSubscribe = function toggleSubscribe() {
      var _this = this;

      var flag = this.event.info.subscribed;
      EventService[flag ? 'unsubscribe$' : 'subscribe$'](this.event.id).pipe(operators.first()).subscribe(function () {
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
      EventService[flag ? 'unlike$' : 'like$'](this.event.id).pipe(operators.first()).subscribe(function () {
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

    return EventComponent;
  }(rxcomp.Component);
  EventComponent.meta = {
    selector: '[event]',
    inputs: ['event']
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

  var PATH = STATIC ? './' : '/Client/docs/';
  var UID = 0;

  var ImageService = /*#__PURE__*/function () {
    function ImageService() {}

    ImageService.worker = function worker() {
      if (!this.worker_) {
        this.worker_ = new Worker(PATH + "js/workers/image.service.worker.js");
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
        }), // tap(entry => console.log('IntersectionService.intersection$', entry)),
        operators.filter(function (entry) {
          return entry !== undefined && entry.isIntersecting;
        }), // entry.intersectionRatio > 0
        operators.first(), operators.finalize(function () {
          return observer.unobserve(node);
        }));
      } else {
        return rxjs.of({
          target: node
        });
      }
      /*
      function observer() {
      	if ('IntersectionObserver' in window) {
      		return new IntersectionObserver(entries => {
      			entries.forEach(function(entry) {
      				if (entry.isIntersecting) {
      					entry.target.classList.add('appear');
      				}
      			})
      		});
      	} else {
      		return { observe: function(node) { node.classList.add('appear')}, unobserve: function() {} };
      	}
      }
      observer.observe(node);
      observer.unobserve(node);
      */

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

      return IntersectionService.intersection$(node).pipe(operators.first(), operators.switchMap(function () {
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

  var UserService = /*#__PURE__*/function () {
    function UserService() {}

    UserService.setUser = function setUser(user) {
      this.user$.next(user);
    };

    UserService.me$ = function me$() {
      var _this = this;

      return HttpService.get$('/api/users/me').pipe(operators.map(function (user) {
        return _this.mapStatic__(user, 'me');
      }), operators.switchMap(function (user) {
        _this.setUser(user);

        return _this.user$;
      }));
    };

    UserService.register$ = function register$(payload) {
      var _this2 = this;

      return HttpService.post$('/api/users/register', payload).pipe(operators.map(function (user) {
        return _this2.mapStatic__(user, 'register');
      }));
    };

    UserService.update = function update(payload) {
      var _this3 = this;

      return HttpService.post$('/api/users/updateprofile', payload).pipe(operators.map(function (user) {
        return _this3.mapStatic__(user, 'register');
      }));
    };

    UserService.login$ = function login$(payload) {
      var _this4 = this;

      return HttpService.post$('/api/users/login', payload).pipe(operators.map(function (user) {
        return _this4.mapStatic__(user, 'login');
      }));
    };

    UserService.logout$ = function logout$() {
      var _this5 = this;

      return HttpService.post$('/api/users/logout').pipe(operators.map(function (user) {
        return _this5.mapStatic__(user, 'logout');
      }));
    };

    UserService.retrieve$ = function retrieve$(payload) {
      var _this6 = this;

      return HttpService.post$('/api/users/retrievepassword', payload).pipe(operators.map(function (user) {
        return _this6.mapStatic__(user, 'retrieve');
      }));
    };

    UserService.mapStatic__ = function mapStatic__(user, action) {
      if (action === void 0) {
        action = 'me';
      }

      if (!STATIC) {
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

    return UserService;
  }();
  UserService.user$ = new rxjs.BehaviorSubject(null);

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

      HttpService.get$(this.href, undefined, 'blob').pipe(operators.first()).subscribe(function (blob) {
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
        slidesPerView: 2,
        spaceBetween: 25,
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
        slidesPerView: 3,
        spaceBetween: 0,
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

      var items = module.resolve(this.virtualFunction, changes, this) || [];
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

      return rxjs.fromEvent(window, 'resize').pipe(operators.debounceTime(500), operators.startWith(null), operators.tap(function () {
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
    declarations: [ChannelComponent, ChannelPageComponent, DatePipe, DropdownDirective, DropdownItemDirective, ErrorsComponent, EventComponent, EventDateComponent, HtmlPipe, IndexPageComponent, LazyDirective, ModalComponent, ModalOutletComponent, RegisterOrLoginComponent, RelativeDatePipe, ScrollToDirective, SecureDirective, SwiperDirective, SwiperEventsDirective, SwiperSlidesDirective, SwiperTopEventsDirective, VirtualStructure, VideoComponent, YoutubeComponent],
    bootstrap: AppComponent
  };

  rxcomp.Browser.bootstrap(AppModule);

})));
