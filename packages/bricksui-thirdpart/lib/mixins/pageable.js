/*globals jQuery:true;Ember:true */
/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 * Normalizes values to be used in a sort for natural sort
 * @private
 * @param  {Mixed} a
 * @param  {Mixed} b
 * @return {Array}
 */
var normalizeSortValues = function (a, b) {
    // Set unsupported types.  May need to be made into a whitelist instead
    var failTypes = ['function', 'object', 'array', 'date', 'regexp'];

    // Check if `b` can be normalized
    if (jQuery.inArray(jQuery.type(a), failTypes) !== -1) {
        throw new Error('Cannot normalize input `a`! ' + jQuery.type(a) + ' was passed!');
    }

    // Check if `b` can be normalized
    if (jQuery.inArray(jQuery.type(b), failTypes) !== -1) {
        throw new Error('Cannot normalize input `b`! ' + jQuery.type(b) + ' was passed!');
    }

    // Function that does the normalizing
    var norm = function (input) {
        // Some setup
        var ret,
            tests = {
                // Regex to detect if is number
                number: /^([0-9]+?)$/
            };

        // Figure out what the value is return the normalized version
        switch (jQuery.type(input)) {
            case 'string':
                if (tests.number.test(jQuery.trim(input))) {
                    return parseInt(input, 10);
                }
                return jQuery.trim(input).toLowerCase();
            case 'null':
                return '';
            case 'boolean':
                return input ? '0' : '1';
            default:
                return input;
        }
    };

    // Normalize variables
    a = norm(a);
    b = norm(b);

    // If types differ, set them both to strings
    if ((typeof a === 'string' && typeof b === 'number') || (typeof b === 'string' && typeof a === 'number')) {
        a = String(a);
        b = String(b);
    }

    // Return normalized values
    return [a, b];
};


/**
 静态数据处理扩展,用于分页处理
 @type {Ember.Mixin}
 @namespace BricksUI
 @class StaticPageable
 */
var StaticPageable = Ember.Mixin.create({
    /**
     * 当前页码
     * @property currentPage
     * @type {Number}
     */
    currentPage: 1,

    /**
     * 每页显示条数
     * @property perPage
     * @type {Number}
     */
    perPage: 100,

    /**
     * 排序字段
     * @property sortBy
     * @type {String}
     */
    sortBy: null,

    /**
     * 排序方向
     * @property sortDirection
     * @type {String}
     */
    sortDirection: 'ascending',


    /**
     * 静态数据本地数据存放的集合
     * @property data
     * @type {Array}
     */
    data: [],

    /**
     * Used for the collection view for which items to show
     *
     * @return {Array}
     */
    content: function () {
        // Get the starting and ending point of the array to slice
        var start = (this.get('currentPage') - 1) * this.get('perPage'),
            end = start + this.get('perPage');

        return this.get('data').slice(start, end);
    }.property('currentPage', 'perPage', 'data.@each'),

    /**
     * 总页数
     * @property totalPages
     * @return int Total Number of Pages
     */
    totalPages: function () {
        return Math.ceil(this.get('data.length') / this.get('perPage'));
    }.property('data.@each', 'perPage'),

    actions: {
        /**
         * 后一页
         * @method nextPage
         */
        nextPage: function () {
            // Make sure you can go forward first
            if (this.get('currentPage') === this.get('totalPages'))
                return null; // NOOP

            // Set the current page to the next page
            this.set('currentPage', this.get('currentPage') + 1);
        },

        /**
         * 前一页
         * @method prevPage
         */
        prevPage: function () {
            // Make sure you can go backwards first
            if (this.get('currentPage') === 1)
                return null; // NOOP

            // Set the current page to the previous page
            this.set('currentPage', this.get('currentPage') - 1);
        },
        /**
         * 第一页
         * @method firstPage
         */
        firstPage: function () {
            this.set('currentPage', 1);
        },
        /**
         * 尾页
         * @method lastPage
         */
        lastPage: function () {
            this.set('currentPage', this.get('totalPages'));
        }
    },

    /**
     * Sorts the data by a property
     * @param  {String} property
     * @param  {String} direction
     * @return {Void}
     */
    sortByProperty: function (property, direction) {
        var data = this.get('data').slice();

        // Set up sort direction
        if (direction === undefined) {
            if (this.get('sortBy') === property && this.get('sortDirection') === 'ascending')
                direction = 'descending';
            else
                direction = 'ascending';
        }

        // Custom sort to sort alphanumerically
        data.sort(function (a, b) {
            // Normalize values to make sort natural
            var normalizedValues = normalizeSortValues(a.get(property), b.get(property)),
                va = normalizedValues[0],
                vb = normalizedValues[1];

            // Do the sorting
            if (va === vb)
                return 0;
            else {
                // Reverse if necessary
                if (direction === 'ascending')
                    return va > vb ? 1 : -1;
                else
                    return va < vb ? 1 : -1;
            }
        });

        // Now that sort is complete, set the controller
        this.set('sortBy', property);

        // Assign sort direction
        this.set('sortDirection', direction);

        // Assign the data
        this.set('data', data);

        // Reset the current page to 1
        this.set('currentPage', 1);
    }
});
/**
 基于Ember-Data的数据处理扩展,用于分页处理
 分页扩展,用于增强控制器的功能,使控制器具备分页管理功能
 * `modelName`  必须配置,当前分页组件所要请求的模型名称
 * `query` 要传入到后台的查询参数,是一个计算属性,需要返回`Object`
 返回的数据必须要有`total`属性
 ```javascript
 {
     "meta":{
         "total":100
     }
 }
 ```
 ```javascript
 App.ApplicationController = Ember.ArrayController.extend(BricksUI.DynamicPageable,{
    perPage: 5,
    modelName:"user",
    firstName:"xx",
    selectedPageSize:5,
    pageSizes: [
       5,10,15,20
    ],
    query:function(){
        return {
            firstName:this.get('firstName'),
            limit:this.get('selectedPageSize')
        }
    }.property("firstName","city").volatile()
});
 ```
 `BricksUI.DynamicPageable` 用于扩展控制器的分页功能
 `BricksUI.BuPagination` 用于分页组件视图的呈现,并且将`action`委托给控制器

 @namespace BricksUI
 @type {Ember.Mixin}
 @class DynamicPageable
 */
var DynamicPageable = Ember.Mixin.create({
    /**
     * 当前页码
     * @property currentPage
     * @type {Number}
     */
    currentPage: 1,

    /**
     * 每页显示多少条
     * @property perPage
     * @type {Number}
     */
    perPage: 10,

    /**
     * 排序字段
     * @property sortBy
     * @type {String}
     */
    sortBy: null,

    /**
     * 排序方向,升序或者降序
     * @property sortDirection
     * @type {String}
     * @default ascending
     */
    sortDirection: 'ascending',

    init: function () {
        Ember.assert("the modelName must provided !", this.get('modelName'));
        this.paramNames = Ember.$.extend(this.paramNames || {}, this.defaultParamNames);
        this._super.apply(this, arguments);
        this.send("firstPage");
    },
    /**
     * @private
     * @returns {null}
     */
    getParams: function () {
        return this.paramNames;
    },
    /**
     *  查询参数,可覆盖`defaultParamNames`
     *  @property paramNames
     *  @type {Object}
     *  @default null
     */
    paramNames: null,

    /**
     *  默认的查询参数
     *  @property defaultParamNames
     *  @type {Object}
     *  @default {
     *      start: 'start',
     *      limit: 'limit',
     *      sort: 'sort',
     *      dir: 'dir'
     *  }
     */
    defaultParamNames: {
        start: 'start',
        limit: 'limit',
        sort: 'sort',
        dir: 'dir'
    },
    /**
     * 数据加载中
     * @property loading
     * @type {Boolean}
     * @default false
     */
    loading: false,
    /**
     * 用户的自定以查询参数
     * @property query
     * @type {Object}
     * @default null
     */
    query: null,
    /**
     * @private
     */
    cursor: 0,
    /**
     * @private
     */
    doLoad: function (start) {
        if (!this.get('store')) {
            return [];
        }
        var o = {}, pn = this.getParams(), that = this;
        o[pn.start] = start;
        o[pn.limit] = this.get('perPage');
        o[pn.sort] = this.get("sortBy");
        o[pn.dir] = this.get("sortDirection");

        Ember.$.extend(o, this.get('query'));

        if (this.get('loading')) {
            return false;
        }

        var loadingPromise = this.store.find(this.get('modelName'), o).then(function (models) {
            var perPage = o.limit,
                len = models.get('length');

            Ember.assert("server return models length is " + models.get('length') + " but the config perPage is " + perPage, len === perPage);
            Ember.assert("the response data has no meta with the total property ", that.store.metadataFor(that.get('modelName')).total);

            that.beginPropertyChanges();
            that.set("content", models);
            that.set("cursor", start);
            that.set("loading", false);
            that.endPropertyChanges();
            that.notifyPropertyChange("totalCount");
        });
        this.set("loading", true);
        return loadingPromise;
    },


    /**
     * 总页数
     * @property totalPages
     */
    totalPages: function () {
        return Math.ceil(this.get('totalCount') / this.get('perPage'));
    }.property('perPage', 'totalCount'),

    actions: {
        /**
         * 下一页
         * @method nextPage
         */
        nextPage: function () {
            // Make sure you can go forward first
            if (this.get('currentPage') === this.get('totalPages'))
                return null; // NOOP

            // Set the current page to the next page
            var promise = this.doLoad(this.cursor + this.get('perPage'));
            if (promise.then) {
                var that = this;
                promise.then(function () {
                    that.set('currentPage', that.get('currentPage') + 1);
                });
            }
        },

        /**
         * 上一页
         * @method prevPage
         */
        prevPage: function () {
            // Make sure you can go backwards first
            if (this.get('currentPage') === 1)
                return null; // NOOP

            // Set the current page to the previous page

            var promise = this.doLoad(Math.max(0, this.cursor - this.get('perPage')));
            if (promise.then) {
                var that = this;
                promise.then(function () {
                    that.set('currentPage', that.get('currentPage') - 1);
                });
            }
        },
        /**
         * 首页
         * @method firstPage
         */
        firstPage: function () {
            this.set("currentPage", 1);
            this.doLoad(0);
        },
        /**
         * 尾页
         * @method lastPage
         */
        lastPage: function () {
            var total = this.get('totalCount'),
                extra = total % this.get('perPage');

            this.set("currentPage", this.get('totalPages'));
            this.doLoad(extra ? (total - extra) : total - this.get('perPage'));
        }
    },
    /**
     * 总条数
     * @property totalCount
     * @returns {*|number}
     */
    totalCount: function () {
        var meta = this.store.metadataFor(this.get('modelName'));
        return meta.total || 0;
    }.property().volatile(),
    /**
     * 根据属性名称排序
     * @method sortByProperty
     */
    sortByProperty: function (property, direction) {
        var data = this.get('content').slice();

        // Set up sort direction
        if (direction === undefined) {
            if (this.get('sortBy') === property && this.get('sortDirection') === 'ascending')
                direction = 'descending';
            else
                direction = 'ascending';
        }

        // Custom sort to sort alphanumerically
        data.sort(function (a, b) {
            // Normalize values to make sort natural
            var normalizedValues = normalizeSortValues(a.get(property), b.get(property)),
                va = normalizedValues[0],
                vb = normalizedValues[1];

            // Do the sorting
            if (va === vb)
                return 0;
            else {
                // Reverse if necessary
                if (direction === 'ascending')
                    return va > vb ? 1 : -1;
                else
                    return va < vb ? 1 : -1;
            }
        });

        // Now that sort is complete, set the controller
        this.set('sortBy', property);

        // Assign sort direction
        this.set('sortDirection', direction);

        // Assign the data
        this.set('content', data);

        // Reset the current page to 1
        //this.set('currentPage', 1);
        this.send("firstPage");
    }
});

export {
    StaticPageable,
    DynamicPageable
    };