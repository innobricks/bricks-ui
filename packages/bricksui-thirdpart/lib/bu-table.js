/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**

 ####基本用法
 ```handlebars
 * hasFooter table是否需要页脚 ,true  false
 * `columns`  table中所显示的列的数组
 * `content` table中的内容
 {{bu-table  hasFooter=false  columnsBinding="columns"  contentBinding="content"}}
 ```

 对应控制器
 ```javascript
 App.ApplicationController = Ember.Controller.extend({
        numRows: 100,
        columns: Ember.computed(function() {
            var closeColumn, dateColumn, highColumn, lowColumn, openColumn;
            dateColumn = Ember.Table.ColumnDefinition.create({
                columnWidth: 150,
                textAlign: 'text-align-left',
                headerCellName: 'Date',
                getCellContent: function(row) {
                    return row.get('date').toDateString();
                }
            });
            ...
            return [dateColumn, ...];
        }),
        content: Ember.computed(function() {
            var _i, _ref, _results;
            return (function() {
                _results = [];
                for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
                return _results;
            }).apply(this).map(function(index) {
                    var date;
                    date = new Date();
                    date.setDate(date.getDate() + index);
                    return {
                        date: date,
                        ...
                    };
                });
        }).property('numRows')
    });

 ```
 #### 更多可选配置
 ```
 * hasHeader  table的是否需要表头,true  false
 * numFixedColumns  table左边固定的列 number
 * numFooterRow  table页脚的行数  number
 * rowHeight  行高  number
 * numRows  table的行数  number
 * footerHeight   table页脚的高度 number
 * minHeaderHeight   最小表头高度 number
 * enableColumnReorder   配置列是否可以重排列，true false
 * enableContentSelection   配置内容是否可选，true false
 * selection   配置选择的对象
 * tableRowViewClass   配置table中用于渲染行的视图类
 * bodyContent    配置table body中的内容
 * footerContent   配置table页脚的内容
 * fixedColumns   配置table固定的列数
 ```

 ####ColumnDefinition

 ```javascript
 * columnWidth 列的宽度,number
 * textAlign  列中内容的对齐方式，text-align-(left | center | right)
 * headerCellName 该列的表头显示信息
 * getCellContent  获取该列单元格中的内容

  dateColumn = Ember.Table.ColumnDefinition.create({
    columnWidth: 150,
    textAlign: 'text-align-left',
    headerCellName: 'Date',
    getCellContent: function(row) {
        return row.get('date').toDateString();
    }
});
 ```
 #### ColumnDefinition中更多可选配置
 ```
 * minWidth  最小列宽
 * maxWidth  最大列宽
 * defaultColumnWidth  默认设为150
 * contentPath   单元格中内容的连接路径
 * headerCellViewClass   表头视图类
 * tableCellViewClass   单元格视图类
 * isResizable  配置该列是否可调整大小，true false
 * isSortable   配置该列是否可排序，true false
 * canAutoResize   配置该列是否可以自动的调整大小，true false
 * resize   调整列宽
 * setCellContent  设置该列单元格的内容
 ```
 #### Ember.Table.Row的配置

 ```javascript
 * content 配置行的内容
 * isHovered  配置该行是否处于活跃状态
 * isShowing 配置是否显示该行
 * isSelected  配置该行是否被选中
 App.FinancialTableTreeTableRow = Ember.Table.Row.extend({
    content: null,
    isHovered: true,
    isShowing: true,
    isSelected:true
    ...
    }）
 ```

 #####tree类型的table的配置
 ```handlebars
 application.hbs:
 {{table-component  hasHeader=true  hasFooter=false  numFixedColumns=0  rowHeight=35  columnsBinding="columns"  contentBinding="content"}}
 financial_table_cell.hbs:
     <div class="ember-table-cell-container">
     <span class="ember-table-content">
     {{view.cellContent}}
     </span>
     </div>
 financial_table_tree_cell.hbs:
     <div class="ember-table-cell-container" {{bind-attr style="view.paddingStyle"}}>
     <span {{bind-attr class=":ember-table-toggle-span view.row.isLeaf::ember-table-toggle
        view.row.isCollapsed:ember-table-expand:ember-table-collapse"}}
     {{action toggleCollapse view.row}}>
     <i class="icon-caret-down ember-table-toggle-icon"></i>
     </span>
     <span class="ember-table-content">
     {{view.cellContent}}
     </span>
     </div>
 financial_table_header_cell.hbs：
     <div class="ember-table-cell-container">
     <div class="ember-table-header-content-container">
     <span class="ember-table-content">
     {{view.content.headerCellName}}
     </span>
     </div>
     </div>
 financial_table_header_tree_cell.hbs：
     <div class="ember-table-cell-container">
     <span {{bind-attr class=":ember-table-toggle-span :ember-table-toggle
          isCollapsed:ember-table-expand:ember-table-collapse"}}
     {{action toggleTableCollapse}}>
     <i class="icon-caret-down ember-table-toggle-icon"></i>
     </span>
     <div class="ember-table-header-content-container">
     <span class="ember-table-content">
     {{view.column.headerCellName}}
     </span>
     </div>
     </div>
 ```
 #####对应view
 ```javascript
 App.FinancialTableCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/financial_table/financial_table_cell'
  });

 App.FinancialTableHeaderCell = Ember.Table.HeaderCell.extend({
    templateName: 'ember_table/financial_table/financial_table_header_cell'
  });

 App.FinancialTableTreeCell = Ember.Table.TableCell.extend({
    templateName: 'ember_table/financial_table/financial_table_tree_cell',
    classNames: 'ember-table-table-tree-cell',
    paddingStyle: Ember.computed(function() {
      return "padding-left:" + (this.get('row.indentation')) + "px;";
    }).property('row.indentation')
  });

 App.FinancialTableHeaderTreeCell = Ember.Table.HeaderCell.extend({
    templateName: 'ember_table/financial_table/financial_table_header_tree_cell',
    classNames: 'ember-table-table-header-tree-cell'
  });
 ```
 #####对应控制代码
 ```javascript
 * children 配置子节点
 * parent   配置父节点
 * isRoot   配置是否是根节点
 * isLeaf   配置是否是叶子节点
 * isCollapsed   配置该行是否处于收缩状态
 * indentationSpacing   配置该行缩进的空格数
 * computeStyles    计算整体的样式
 * computeRowStyle    计算每一行的样式
 * recursiveCollapse  递归每行的缩进
 * getFormattingLevel   格式化层级
 App.FinancialTableTreeTableRow = Ember.Table.Row.extend({
    content:  null,
    isShowing: true,
    children: null,
    parent: null,
    isRoot: false,
    isLeaf: false,
    isCollapsed: false,
    indentationSpacing: 20,
    groupName: null,
    computeStyles: function(parent) {
      var groupingLevel, indentType, indentation, isShowing, pGroupingLevel, spacing;
      groupingLevel = 0;
      indentation = 0;
      isShowing = true;
      if (parent) {
        isShowing = parent.get('isShowing') && !parent.get('isCollapsed');
        pGroupingLevel = parent.get('groupingLevel');
        groupingLevel = pGroupingLevel;
        if (parent.get('groupName') !== this.get('groupName')) {
          groupingLevel += 1;
        }
        indentType = groupingLevel === pGroupingLevel ? 'half' : 'full';
        spacing = this.get('indentationSpacing');
        if (!parent.get('isRoot')) {
          indentation = parent.get('indentation');
          indentation += (indentType === 'half' ? spacing / 2 : spacing);
        }
      }
      this.set('groupingLevel', groupingLevel);
      this.set('indentation', indentation);
      return this.set('isShowing', isShowing);
    },
    computeRowStyle: function(maxLevels) {
      var level;
      level = this.getFormattingLevel(this.get('groupingLevel'), maxLevels);
      return this.set('rowStyle', "ember-table-row-style-" + level);
    },
    recursiveCollapse: function(isCollapsed) {
      this.set('isCollapsed', isCollapsed);
      return this.get('children').forEach(function(child) {
        return child.recursiveCollapse(isCollapsed);
      });
    }，
    getFormattingLevel:function(level, maxLevels) {
    switch (maxLevels)
        case 1:{
            return 5;
        }
        case 2:{
            if(level == 1){
                return 2;
            }else {
                return 5;
            }
        }
      ...

    }
  });
 ```
 #####tree类型的table定义组件时的更多配置
 ```javascript
 * isCollapsed 配置是否缩进
 * isHeaderHeightResizable  表头的高度是否可以重新调整
 * sortAscending 配置table的内容是否升序排列
 * groupingColumn 列的分组
 * orderBy 排序
 * createTree  创建树
 * flattenTree  配置树的展开
 App.FinancialTableComponent = Ember.Table.EmberTableComponent.extend({
    numFixedColumns: 1,
    rowHeight: 30,
    hasHeader: true,
    hasFooter: true,
    headerHeight: 70,
    sortColumn: null
    selection: null
    isCollapsed: false,
    isHeaderHeightResizable: true,
    sortAscending: false,
    actions: {
      toggleTableCollapse: function(event) {
        var children, isCollapsed;
        this.toggleProperty('isCollapsed');
        isCollapsed = this.get('isCollapsed');
        children = this.get('root.children');
        if (!(children && children.get('length') > 0)) {
          return;
        }
        children.forEach(function(child) {
          return child.recursiveCollapse(isCollapsed);
        });
        return this.notifyPropertyChange('rows');
      },
      toggleCollapse: function(row) {
        row.toggleProperty('isCollapsed');
        return Ember.run.next(this, function() {
          return this.notifyPropertyChange('rows');
        });
      }
    },
    data: null,
    columns: Ember.computed(function() {
      var columns, data, names;
      data = this.get('data');
      if (!data) {
        return;
      }
      names = this.get('data.value_factors').getEach('display_name');
      columns = names.map(function(name, index) {
        return Ember.Table.ColumnDefinition.create({
          index: index,
          headerCellName: name,
          headerCellViewClass: 'App.FinancialTableHeaderCell',
          tableCellViewClass: 'App.FinancialTableCell',
          getCellContent: function(row) {
           ...
          }
        });
      });
      columns.unshiftObject(this.get('groupingColumn'));
      return columns;
    }).property('data.valueFactors.@each', 'groupingColumn'),
 groupingColumn: Ember.computed(function() {
      var groupingFactors, name;
      groupingFactors = this.get('data.grouping_factors');
      name = groupingFactors.getEach('display_name').join(' ▸ ');
      return Ember.Table.ColumnDefinition.create({
        headerCellName: name,
        columnWidth: 400,
        isTreeColumn: true,
        isSortable: false,
        textAlign: 'text-align-left',
        headerCellViewClass: 'App.FinancialTableHeaderTreeCell',
        tableCellViewClass: 'App.FinancialTableTreeCell',
        contentPath: 'group_value'
      });
    }).property('data.grouping_factors.@each'),
 root: Ember.computed(function() {
      var data;
      data = this.get('data');
      if (!data) {
        return;
      }
      return this.createTree(null, data.root);
    }).property('data', 'sortAscending', 'sortColumn'),
 rows: Ember.computed(function() {
      var maxGroupingLevel, root, rows;
      root = this.get('root');
      if (!root) {
        return Ember.A();
      }
      rows = this.flattenTree(null, root, Ember.A());
      this.computeStyles(null, root);
      maxGroupingLevel = Math.max.apply(rows.getEach('groupingLevel'));
      rows.forEach(function(row) {
        return row.computeRowStyle(maxGroupingLevel);
      });
      return rows;
    }).property('root'),
 bodyContent: Ember.computed(function() {
      var rows;
      rows = this.get('rows');
      if (!rows) {
        return Ember.A();
      }
      rows = rows.slice(1, rows.get('length'));
      return rows.filterProperty('isShowing');
    }).property('rows'),
 footerContent: Ember.computed(function() {
      var rows;
      rows = this.get('rows');
      if (!rows) {
        return Ember.A();
      }
      return rows.slice(0, 1);
    }).property('rows'),
 orderBy: function(item1, item2) {
      var result, sortAscending, sortColumn, value1, value2;
      sortColumn = this.get('sortColumn');
      sortAscending = this.get('sortAscending');
      if (!sortColumn) {
        return 1;
      }
      value1 = sortColumn.getCellContent(item1.get('content'));
      value2 = sortColumn.getCellContent(item2.get('content'));
      result = Ember.compare(value1, value2);
      if (sortAscending) {
        return result;
      } else {
        return -result;
      }
    },
 createTree: function(parent, node) {
      var children, row,
        _this = this;
      row = App.FinancialTableTreeTableRow.create();
      children = (node.children || []).map(function(child) {
        return _this.createTree(row, child);
      });
      row.setProperties({
        isRoot: !parent,
        isLeaf: Ember.isEmpty(children),
        content: node,
        parent: parent,
        children: children,
        groupName: node.group_name,
        isCollapsed: false
      });
      return row;
    },
 flattenTree: function(parent, node, rows) {
      var _this = this;
      rows.pushObject(node);
      (node.children || []).forEach(function(child) {
        return _this.flattenTree(node, child, rows);
      });
      return rows;
    },
 computeStyles: function(parent, node) {
      var _this = this;
      node.computeStyles(parent);
      return node.get('children').forEach(function(child) {
        return _this.computeStyles(node, child);
      });
    }
 });

 ```


 @namespace BricksUI
 @class BuTable
 @extends Ember.Component
 */