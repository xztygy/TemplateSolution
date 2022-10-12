
/// <summary>
/// JQUERY-享元模式之共享DOM元素-插件
/// 用法: $("#demo").flyWeight(options);
/// 6458450@qq.com 邓西 版权所有 
/// </summary>

/// <reference path="jquery-1.7.1.min.js" />
/// <reference path="knockout-2.3.0.js" />

/// <param name="options" type="Object">
/// 配置参数
/// <para>        ulBindScript   - ko.js data-bind 语句,写法参见默认值</para>
/// <para>        liBindScript   - ko.js data-bind 语句,写法参见默认值</para>
/// <para>        items          - 要显示的数据JSON数据列表</para>
/// <para>        viewModel      - ko.js ViewModel对像,必须有items及setCurrentItems实现</para>
/// <para>        itemHeight     - 每一项的高度,调整后需要调整对应的CSS以匹配显示效果</para>
/// <para>        itemShowCount  - 列表区域中要显示的个数,调整后需要调整对应的CSS以匹配显示效果</para>
/// </param>

(function ($) {
    $.fn.extend({
        flyWeight: function (options) {
            if (!options) var options = {};
            if (options.ko == undefined) options.ko = null;
            if (options.ulBindScript == undefined) options.ulBindScript = "foreach: items";
            if (options.liBindScript == undefined) options.liBindScript = "text: name, attr: { _id: id, _name: name }, click: $root.select";
            if (options.items == undefined) options.items = [{ "id": 1, "name": "test" }];
            if (options.viewModel == undefined) options.viewModel = function () {
                var self = this;
                self.items = options.ko.observableArray([]);
                self.setCurrentItems = function (currentItems) {
                    self.items(currentItems);
                };
                self.select = function (item) {
                    console.log(item.id);
                    return false;
                }
            };
            if (options.itemHeight == undefined) options.itemHeight = 30;
            if (options.itemShowCount == undefined) options.itemShowCount = 10;


            function StringBuilder() {
                this._stringArray = new Array();
            }
            StringBuilder.prototype.append = function (str) {
                this._stringArray.push(str);
            }
            StringBuilder.prototype.toString = function (joinGap) {
                return this._stringArray.join(joinGap);
            }

            var FlyWeight = function (input, options) {
                CreateDom(input);

                var _vm = new options.viewModel();
                options.ko.applyBindings(_vm, document.getElementById("demo-list"));

                AutoSize();

                //滚动事件
                $("#scrollbar").scroll(function () {
                    setTimeout(function () {
                        ScrollEvent(_vm);
                    }, 50);
                });
                //第一次初始化加载数据
                $("#scrollbar").scroll();

                addEvent('mousewheel', onMouseWheel);
                addEvent('DOMMouseScroll', onMouseWheel);
            };

            return this.each(function () {
                new FlyWeight(this, options);
            });

            //创建相应DOM元素
            function CreateDom(input) {
                var sb = new StringBuilder();

                sb.append("<div id=\"scrollbar\" class=\"scrollbar-panel\">");
                sb.append("     <div class=\"real-panel\"></div>");
                sb.append("</div>");
                sb.append("<div id=\"demo-list\" class=\"list-panel\">");
                sb.append("     <ul data-bind=\"" + options.ulBindScript + "\">");
                sb.append("     <li><a href=\"javascript:void(0);\" data-bind=\"" + options.liBindScript + "\"></a></li>");
                sb.append("     </ul>");
                sb.append("</div>");

                $(input).append(sb.toString(""));
            }

            //根据浏览器的滚动条宽度自动计算实际的列表区域宽度
            function AutoSize() {
                $(".real-panel").height(options.items.length * options.itemHeight);
                $("#demo-list").width($(".real-panel").width());
            }

            //滚动事件
            function ScrollEvent(vm) {
                //获取滚动条距顶部的位置
                var start = getScrollTop();
                //根据top计算应该要显示的区域最大值,需要检查实际个数是否大于默认个数
                var end = 0;
                if (options.items.length > options.itemShowCount) {
                    end = start + options.itemShowCount * options.itemHeight;
                }
                else {
                    end = start + options.items.length * options.itemHeight;
                }

                //根据位置计算应该显示数组中起始下标及结束下标
                var startPos = parseInt(start / options.itemHeight);
                var endPos = parseInt(end / options.itemHeight);

                //取出对应的数据并传递给ko被监视的数组
                var currentData = [];
                for (var i = startPos; i < endPos; i++) {
                    currentData.push(options.items[i]);
                }
                vm.setCurrentItems(currentData);
            }

            //列表区域的滚轮事件绑定
            function onMouseWheel(ev) {
                var ev = ev || window.event;
                var down = true;
                down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
                var top = getScrollTop();
                //滚动时对滚动条距顶的数量进行加一项高度或减一项高度达到控制滚动条的目的
                if (down) {
                    $("#scrollbar").scrollTop(top + options.itemHeight);
                } else {
                    $("#scrollbar").scrollTop(top - options.itemHeight);
                }
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                return false;
            }

            function addEvent(xEvent, fn) {
                var obj = document.getElementById('demo-list');
                if (obj.attachEvent) {
                    obj.attachEvent('on' + xEvent, fn);
                } else {
                    obj.addEventListener(xEvent, fn, false);
                }
            }

            //获取滚动条距顶部的数值 
            function getScrollTop() {
                var scrollTop = $("#scrollbar").prop('scrollTop');
                return scrollTop;
            }
        }
    });
})(jQuery);