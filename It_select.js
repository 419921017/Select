/**
 * Created by Liu on 2016/8/17.
 */

// 选择器引擎
var Select =
    (function () {

        var support = {},
            push = [].push,
            rnative = /\[native code\]/;


        support.qsa = rnative.test(document.querySelectorAll);

        support.getClassName1 = rnative.test(document.getElementsByClassName);

        var div = document.createElement('div');
        support.getClassName2 = rnative.test(div.getElementsByClassName);


        support.indexOf = rnative.test(Array.prototype.indexOf);

        support.trim = rnative.test(String.prototype.trim);


        // push

        try {
            push.apply([], document.getElementsByTagName('*'));
        } catch (e) {
            push = {
                apply: function (a, b) {
                    for (var i = 0; i < b.length; i++) {
                        a[a.length++] = b[i];
                    }
                    return a;
                }
            }
        }


        // indexOf
        function indexOf(arr, search, startIndex) {
            startIndex = startIndex || 0;
            if (support.indexOf) {
                return arr.indexOf(search, startIndex);
            }
            for (var i = 0; startIndex < arr.length; i++) {
                if (search == arr[i]) {
                    return i;
                }
            }
            return -1;
        }

        // trim
        function trim(str) {
            if (support.trim) {
                return str.trim();
            }
            return str.replace(/^\s+|\s+$/, '');
        }

        // unique
        function unique(arr) {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (indexOf(newArr, arr[i]) == -1) {
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        }

        // 获得 class 属性的元素
        function getByClass(className, node) {
            node = node || document;
            if (node == document && support.getClassName1 || node.nodeType == 1 && support.getClassName2) {
                return node.getElementsByClassName(className)
            } else {
                var lists = node.getElementsByTagName('*');
                var tempList,
                    arr = [];
                for (var i = 0; i < lists.length; i++) {
                    tempList = lists[i].getAttribute('class');
                    if (indexOf(tempList, className) != -1) {
                        arr.push(lists[i]);
                    }
                }
                return arr;
            }
        }

        // 基本选择器

        function getTag(tagName, node, results) {
            node = node || document;
            results = results || [];
            push.apply(results, node.getElementsByTagName(tagName));
            return results;
        }

        function getClass(className, node, results) {
            node = node || document;
            results = results || [];
            push.apply(results, getByClass(className, node));
            return results;
        }

        function getId(idName, node, results) {
            node = node || document;
            results = results || [];
            var dom = node.getElementById(idName);
            if (dom) {
                push.apply(results, [node.getElementById(idName)]);
            }
            return results;
        }


        // 后代选择器
        function getChildren(selector, node) {
            node = node || document;
            var lists = selector.replace(/\s+/g, ' ').split(' ');
            var res1,
                res2 = [node];
            for (var i = 0; i < lists.length; i++) {
                res1 = res2;
                res2 = [];
                for (var j = 0; j < res1.length; j++) {
                    basicSelect(lists[i], res1[j], res2);
                }
            }
            return res2;
        }

        // 并集选择器
        function getMore(selector, node, results) {
            node = node || document;
            results = results || [];
            var lists = selector.split(',');
            for (var i = 0; i < lists.length; i++) {
                basicSelect( trim( lists[i] ), node, results );
            }
            return unique(results);
        }


        // 基础选择器
        function basicSelect(selector, node, results) {
            node = node || document;
            results = results || [];
            var first = selector.charAt(0);
            if (selector.indexOf(' ') == -1) {
                if (selector == '*') {
                    return getTag(selector, node, results);
                } else if (first == '.') {
                    return getClass(selector.slice(1), node, results);

                } else if (first == '#') {
                    return getId(selector.slice(1), node, results);
                } else {
                    return getTag(selector, node, results);
                }

            } else {

                if (/^[#\._\-\w\d]+(\s+[#\._\-\w\d]+)+$/.test(selector)) {
                    var tempList = getChildren(selector, node);
                    push.apply(results, tempList);
                    return results;

                } else {
                    throw new Error('无法实现该功能');
                }
            }
        }


        // 核心引擎
        function Select(selector, node, results) {
            node = node || document;
            results = results || [];
            if (support.qsa) {
                push.apply(results, node.querySelectorAll(selector));
                return results;
            } else {
                return getMore(selector, node, results);
            }
        }


        return Select;


    })();