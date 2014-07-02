/*globals jQuery:true;Ember:true */
/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 分页组件
 分页组件负责视图的呈现,按钮的点击全部委托给`pagerController`,所以必须给分页组件
 配置`pagerController`这个属性
 ####用法
 * `numberOfPages`  显示的页码个数
 * `pagerController` 当前分页组件的控制器,必须配置,并且该控制器必须集成`BricksUI.DynamicPageable`
 ```html
 {{bu-pagination numberOfPages=5 pagerControllerBinding="controller"}}
 ```

 @type {Ember.Component}
 @namespace BricksUI
 @class BuPagination
 @extends Ember.Component
 */
var BuPagination = Ember.Component.extend({
    init: function () {
        var pagerController = this.get("pagerController");
        Ember.assert("pagerController must be provided", pagerController);
        if (!pagerController.get('store')) {
            pagerController.set('store', this.get('store'));
        }
        this._super.apply(this, arguments);
    },
    /**
     * 默认的模板
     * @property layoutName
     * @type {[type]}
     * @default bu-pagination
     */
    layoutName: "bu-pagination",

    /**
     * 分页组件可显示的页码个数
     * @property numberOfPages
     * @type {Number}
     * @default 10
     */
    numberOfPages: 10,

    /**
     * 计算属性-->'`pagerController.totalPages` `agerController.currentPage`
     * 用于生成页码
     * ```html
     *  First Prev 8 9 10 11 12 |13| 14 15 16 17 Next Last
     *  First Prev 80 81 82 83 84 85 86 |87| 88 89 90 91 92 93 94 Next Last
     * ```
     * @property pages
     * @return {Array}
     */
    pages: function () {
        var result = [],
            totalPages = this.get('pagerController.totalPages'),
            currentPage = this.get('pagerController.currentPage'),
            length = (totalPages >= this.get('numberOfPages')) ? this.get('numberOfPages') : totalPages,
            startPos;

        // If only one page, don't show pagination
        if (totalPages === 1)
            return;

        /*
         * Figure out the starting point.
         *
         * If current page is <= 6, then start from 1, else FFIO
         */
        if (currentPage <= Math.floor(this.get('numberOfPages') / 2) + 1 || totalPages <= this.get('numberOfPages')) {
            startPos = 1;
        } else {
            // Check to see if in the last section of pages
            if (currentPage >= totalPages - (Math.ceil(this.get('numberOfPages') / 2) - 1)) {
                // Start pages so that the total number of pages is shown and the last page number is the last page
                startPos = totalPages - ((this.get('numberOfPages') - 1));
            } else {
                // Start pages so that current page is in the center
                startPos = currentPage - (Math.ceil(this.get('numberOfPages') / 2) - 1);
            }
        }

        // Go through all of the pages and make an entry into the array
        for (var i = 0; i < length; i++)
            result.push(i + startPos);

        return result;
    }.property('pagerController.totalPages', 'pagerController.currentPage'),

    /**
     * 计算属性,首页按钮是否不可用
     * @property disableFirst
     * @type {Boolean}
     */
    disableFirst: Ember.computed.alias("disablePrev"),
    /**
     * 计算属性,前一页按钮是否不可用
     * @property disablePrev
     * @return {Boolean}
     */
    disablePrev: function () {
        return this.get('pagerController.currentPage') === 1;
    }.property('pagerController.currentPage'),

    /**
     * 计算属性,后一页按钮是否不可用
     * @property disableNext
     * @return {Boolean}
     */
    disableNext: function () {
        return this.get('pagerController.currentPage') === this.get('pagerController.totalPages');
    }.property('pagerController.currentPage', 'pagerController.totalPages'),
    /**
     * 计算属性,尾页按钮是否不可用
     * @property disableLast
     * @return {Boolean}
     */
    disableLast: Ember.computed.alias("disableNext"),
    actions: {
        /**
         * 第一页
         * @method firstPage
         */
        firstPage: function () {
            if (!this.get('disableFirst')) {
                this.get('pagerController').send('firstPage');
            }
        },
        /**
         * 前一页
         * @method prevPage
         */
        prevPage: function () {
            if (!this.get('disablePrev')) {
                this.get('pagerController').send('prevPage');
            }
        },

        /**
         * 后一页
         * @method nextPage
         */
        nextPage: function () {
            if (!this.get('disableLast')) {
                this.get('pagerController').send('nextPage');
            }
        },
        /**
         * 尾页
         * @method lastPage
         */
        lastPage: function () {
            if (!this.get('disableLast')) {
                this.get('pagerController').send('lastPage');
            }
        }
    },

    /**
     * 按钮视图
     * @property PageButton
     * @type {Ember.View}
     */
    PageButton: Ember.View.extend({
        // Bootstrap page buttons are li elements
        tagName: 'li',

        // Bind to is current to show the button as active
        classNameBindings: ['isCurrent'],

        actions: {
            /**
             * @private
             */
            goToPage: function () {
                // Change the page
                this.set('parentView.pagerController.currentPage', this.get('content'));
                var pagerController = this.get('parentView.pagerController');
                constrain(pagerController.doLoad(((this.get('content') - 1) * pagerController.get('perPage')), 0, pagerController.get('totalCount')));
            }
        },

        /**
         * Computed property to see if the button is active
         * @return {Boolean}
         */
        isCurrent: function () {
            return this.get('content') === this.get('parentView.pagerController.currentPage') ? 'active' : '';
        }.property('parentView.pagerController.currentPage')
    })
});
var constrain = function (self, min, max) {
    Math.min(Math.max(self, min), max);
};
/**
 表格行头
 @type {Ember.View}
 @namespace BricksUI
 @class TableHeader
 @extends Ember.View
 */
var TableHeader = Ember.View.extend({
    /**
     * @private
     */
    defaultTemplate: Ember.Handlebars.compile('{{view.text}}'),

    /**
     * It's a header, so render it as a th
     * @type {String}
     */
    tagName: 'th',

    /**
     * Mark the view as clickable
     * @type {Array}
     */
    classNames: ['clickable'],

    /**
     * Define the bound classes.  Used to say if the header is the active sort
     * and what direction the sort is.
     * @type {Array}
     */
    classNameBindings: ['isCurrent:active', 'isAscending:ascending', 'isDescending:descending'],

    /**
     * 该行头所代表的属性名称
     * @property propertyName
     */
    propertyName: '',

    /**
     * Text to be rendered to the view
     * @type {String}
     */
    text: '',

    /**
     * 点击事件,用于调用controller进行排序
     * @method click
     */
    click: function (event) {
        this.get('controller').sortByProperty(this.get('propertyName'));
    },

    /**
     * Computed property for checking to see if the header is the current sort
     * or not.
     *
     * @return {Boolean}
     */
    isCurrent: function () {
        return this.get('controller.sortBy') === this.get('propertyName');
    }.property('controller.sortBy'),

    /**
     * 升序
     * @property isAscending
     */
    isAscending: function () {
        return this.get('isCurrent') && this.get('controller.sortDirection') === 'ascending';
    }.property('controller.sortDirection', 'isCurrent'),

    /**
     * 降序
     * @property isAscending
     */
    isDescending: function () {
        return this.get('isCurrent') && this.get('controller.sortDirection') === 'descending';
    }.property('controller.sortDirection', 'isCurrent')
});

export {
    BuPagination,
    TableHeader
    };
