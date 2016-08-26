/**
 * Created by Liu on 2016/8/19.
 */

(function (window, undefined) {

    function It(selector) {
        return new It.fn.init(selector);
    }

    It.fn = It.prototype = {
        constructor: It,
        length: 0,
        type: 'It',
        init: function (selector) {
            if (!selector) {
                return this;
            }
            if (typeof selector == 'string') {
                if (selector.charAt(0) == '<' && selector.charAt(selector.length - 1) && selector.length >= 3) {
                    [].push.apply(this, It.parseHtml(selector));
                    return this;
                } else {
                    [].push.apply(this, It.Select(selector));
                    return this;
                }
            }
            if (typeof selector == 'function') {
                var oldFn = window.onload;
                if( typeof oldFn == 'function' ){
                    window.onload = function(){
                        oldFn();
                        selector();
                    }
                }else{
                    window.onload = selector;
                }
            }
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this;
            }
            if (selector.type == 'It') {
                [].push.apply(this, selector);
                return this;
            }
            // 如果上述条件都不是 那么默认认为他是数组
            if (selector.length >= 0) {
                [].push.apply(this, selector);
            } else {
                this[0] = selector;
                this.length = 1;
            }
            return this;
        },
        toArray: function () {
            return [].slice.apply(this, 0);
        },
        get: function (index) {
            if (index === undefined) {
                return this.toArray();
            } else {
                if (index >= 0) {
                    return this[index];
                } else {
                    return this[this.length + index];
                }
            }
        },
        eq: function (index) {
            return It(this.get(index));
        },
        first: function () {
            return this.eq(1);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (callback) {
            It.each(this, callback);
            return this;
        },
        map: function (callback) {
            It.map(this, callback);
            return this;
        },
        appendTo: function (selector) {
            var iObj = this.constructor(selector);
            var newObj = this.constructor();
            var arr = [],
                temp;
            for (var i = 0; i < iObj.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    temp = i === iObj.length - 1 ? this[j] : this[j].cloneNode(true);
                    arr.push(temp);
                    this.constructor.append( iObj[i], temp );
                }
            }
            [].push.apply(newObj, arr);

            newObj.prev = this;

            return newObj;

        },
        append: function (selector) {
            this.constructor(selector).appendTo(this);
            return this;
        },
        prependTo: function (selector) {
            var iObj = this.constructor(selector);
            var newObj = this.constructor();
            var arr = [],
                temp;
            for (var i = 0; i < iObj.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    temp = i === iObj.length - 1 ? this[j] : this[j].cloneNode(true);
                    arr.push(temp);
                    this.constructor.prepend( temp, iObj[i] );
                }
            }
            [].push.apply(newObj, arr);

            newObj.prev = this;

            return newObj;
        },
        prepend: function (selector) {
            this.constructor( selector ).prepend( this );
            return this;
        },
        end: function () {
            return this.prev || prev;
        }


    }

    It.fn.init.prototype = It.fn;

    // 混入方法
    It.extend = It.fn.extend = function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
        return this;
    }


    // 静态方法
    It.extend({
        each: function (array, callback) {
            var res;
            if (array.length >= 0) {
                for (var i = 0; i < array.length; i++) {
                    res = callback.apply(array[i], [i, array[i]]);
                    if (res === false) {
                        break;
                    }
                }
            } else {
                for (var key in array) {
                    res = callback.apply(array[key], [key, array[key]]);
                    if (res === false) {
                        break
                    }
                }
            }
            return array;
        },
        map: function (array, callback) {
            var arr = [],
                res;
            if (array.length >= 0) {
                for (var i = 0; i < array.length; i++) {
                    res = callback(array[i], i);
                    if (res != undefined) {
                        arr.push(res)
                    }
                }
            } else {
                for (var key in array) {
                    res = callback(array[key], key);
                    if (res != undefined) {
                        arr.push(res);
                    }
                }
            }
            return arr;
        },
        append : function( parent, element ){
            parent.appendChild( element );
        },
        prepend : function( parent, element ){
            parent.insertBefore( element, parent.firstChild );
        },
        next : function( elem ){
            var node = elem;
            while( node = node.nextSibling ){
                if( node.nodeType == 1 ){
                    return node;
                }
            }
        },
        nextAll : function () {
            var node = elem;
            var arr = [];
            while ( node = node.nextSibling ) {
                if ( node.nodeType == 1 ) {
                    arr.push( node );
                }
            }
            return arr;
        }
    });


    // 实例成员
    It.fn.extend({
        on: function (type, callback) {
            return this.each(function () {
                this.addEventListener(type, callback);
            })
        },
        off: function (type, callback) {
            return this.each(function () {
                this.removeEventListener(type, callback);
            })
        },
        next : function(){
            var newObj = this.constructor();
            var arr = I.map( this, function( v ,i){
                return It.next( v );
            } );
            [].push.apply( newObj, arr );
            newObj.prev = this;
            return newObj;
        },
        nextAll : function(){
            var newObj = this.constructor();
            var arr = this.map(function ( v, i ) {
                return Itcast.nextAll( v );
            });
            arr = [].concat.apply([], arr);
            [].push.apply( newObj, arr );
            newObj.prev = this;
            return newObj;
        },
        //css : function( name, value ){
        //    if( typeof name === 'string' && value === undefined ){
        //        this.each(function( i, v ){
        //            this.style[ name ] = value;
        //        });
        //    }else{
        //        if( typeof name === 'string' && typeof value === 'string'){
        //            return this.get( 0).style[ name ] ||
        //                window.getComputedStyle( this.get( 0 ), name ) ||
        //                this.get( 0 ).currentStyle( name );
        //        }else if( typeof name == 'object' && value === undefined){
        //            for (var key in name) {
        //                this.each(function( i, v ){
        //                    this.style[ key ] = name[key];
        //                });
        //            }
        //        }
        //    }
        //},
        //attr : function( name, value ){
        //    if( typeof name === 'string' && typeof value === 'string' ){
        //        this.each(function(){
        //            this.setAttribute( name, value );
        //        });
        //    }else if( typeof name === 'object' && value === undefined){
        //        this.each(function(){
        //            for( var key in name ){
        //                this.setAttribute( key, name[key] );
        //            }
        //        })
        //    }else if( typeof name === 'string' && value === undefined ){
        //        return this.get(0).getAttribute( name );
        //    }
        //    return this;
        //},
        //removeAttr : function( name ){
        //    if( typeof name === 'string' ){
        //        this.each(function () {
        //            this.removeAttribute( name );
        //        })
        //    }
        //    return this;
        //},
        //prop : function( name, bool ){
        //    if( typeof name === 'string' && typeof bool === 'boolean'){
        //        this.each(function(){
        //            this[name] = bool ;
        //        })
        //    }else if ( typeof name === 'string' && bool === undefined){
        //        return this.get[0][name];
        //    }else if ( typeof name === 'string' && typeof bool === 'function'){
        //        this.each(function(){
        //            this[name] = bool.call( this, this, i )
        //        })
        //    }
        //    return this;
        //}
        //

    });


    // 样式操作
    It.extend({
        getStyle : function( dom, name ){
            if( dom.currentStyle ){
                return dom.currentStyle[ name ];
            } else if( window.getComputedStyle ) {
                // 返回的是一个对象
                return window.getComputedStyle( dom )[ name ];
            }

        }
    });

    It.fn.extend({
        css : function( name ,value ){
            if( typeof name === 'string' && typeof value === 'string'){
                this.each(function () {
                    this.style[name] = value;
                });
            }else if( typeof name === 'string' && value === undefined){
                return this.constructor.getStyle( this[0], name )  ;
            }else if( typeof name === 'object' && value === undefined){
                for (var key in name) {
                    this.each(function () {
                        this.style[key] = name[key];
                    })
                }
            }
            return this;
        },

    });



    // 类名操作
    It.fn.extend({
        addClass : function( name ){
            this.each(function(){
                var value = this.className;
                var arr = value.replace( /\s+/g , ' ').split( ' ' );
                if( !value ){
                    this.className = name;
                }else if( arr.indexOf( name ) == -1 ){
                    this.className += ' ' + name;
                }
                return this;
            })
        },
        removeClass : function( name ){
            this.each(function () {
                var value = this.className;
                var arr = value.replace( /\s+/g , ' ').split(' ');
                var temp;
                while( (temp = arr.indexOf( name )) != -1 ){
                    arr.splice( temp , 1 );
                }
                this.className = arr.join(' ');
            })
        },
        hasClass : function( name ){
            var res = this.map(function ( v ,i ) {
                var val = v.replace( /\s+/g , ' ').split(' ');
                if( val.indexOf( name ) != -1 ){
                    return true;
                }
            });
            return res.length > 0;
        },
        toggleClass : function( name ){
            var that = this;
            this.each(function () {
                if( that.constructor(this).hasClass( name ) ){
                    that.constructor(this).removeClass( name );
                }else{
                    that.constructor(this).addClass( name );
                }
            });
        }
    });





    // 属性操作
    It.fn.extend({

        attr : function( name , value ){
            if( typeof name === 'string' && value === undefined){
                return this.get(0).getAttribute( name );
            }else if( typeof name === 'string' && value === 'string'){
                this.each(function () {
                    this.setAttribute( name, value );
                });
            }else if( typeof name === 'object' && value === undefined){
                for (var key in name) {
                    this.each(function () {
                        this.setAttribute( key , name[key]);
                    });
                }
            }
            return this;
        },
        removeAttr : function( name ){
            if( typeof name === 'string'){
                this.each(function () {
                    this.removeAttribute( name );
                });
            }
            return this;
        },
        val : function( name ){
            if( typeof name === 'string'){
                this.each(function () {
                    this[value] = name;
                });
            }else if( name === undefined ){
                return this.get(0)[value];
            }
            return this;
        },
        html : function( html ){
            if( typeof html === 'string' ){
                this.each(function () {
                    this.innerHTML = html;
                });
            }else if( typeof html === undefined){
                return this.get(0).innerHTML;
            }
            return this;
        },
        text : function( text ){
            if( typeof text === 'string'){
                this.each(function () {
                    this[innerText] = text;
                });
            }else if( text === undefined ){
                return this[0].innerText;
            }
            return this;
        },
        prop : function( name , value ){
            if( typeof name === 'string' && value === undefined){
                return this.get(0)[name];
            }else if( typeof name === 'string' && typeof value === 'boolean'){
                this.each(function () {
                    this[name] = value;
                });
            }else if( typeof name === 'object' && value === undefined ){
                for (var key in name) {
                    this.each(function () {
                        this[ key ] = name[key];

                    });
                }
            }else if( typeof name === 'string' && typeof value === 'function'){
                this.each(function( i, v ){
                    this[ name ] = value.call( this, this, i );
                });
            }
            return this;
        }

    });




    // 选择器模块
    var Select =
        (function () {

            var support = {},
                push = [].push,
                rnative = /\[native code\]/;

            support.qsa = rnative.test(document.querySelectorAll);

            // 继承的是 docuement 上面的 class 方法
            support.getClassName1 = rnative.test(document.getElementsByClassName);

            // 继承的是 node 上面的 class 方法
            var div = document.createElement('div');
            support.getClassName2 = rnative.test(div.getElementsByTagName);

            support.indexOf = rnative.test(Array.prototype.indexOf);

            support.trim = rnative.test(String.prototype.trim);

            // apply 兼容性处理
            try {
                push.apply([], document.getElementsByTagName('*'));
            } catch (e) {
                push = {
                    apply: function (a, b) {
                        for (var i = 0; i < b.length; i++) {
                            a[a.length++] = b[i];
                        }
                    },
                    call: function (a) {
                        var args = [];
                        for (var i = 1; i < arguments.length; i++) {
                            args.push(arguments[i]);
                        }
                        this.apply(a, args);
                    }
                }
            }

            function indexOf(array, search, startIndex) {
                startIndex = startIndex || 0;
                if (support.indexOf) {
                    return array.indexOf(search, startIndex);
                } else {
                    for (var i = startIndex; i < array.length; i++) {
                        if (search == array[i]) {
                            return i;
                        }
                    }
                    return -1;
                }
            }

            function trim(string) {
                if (support.trim) {
                    return string.trim();
                } else {
                    return string.replace(/^\s+|\s+$/, '');
                }
            }

            function unique(array) {
                var newArr = [];
                for (var i = 0; i < array.length; i++) {
                    if (indexOf(newArr, array[i]) == -1) {
                        newArr.push(array[i]);
                    }
                }
                return newArr;
            }

            // 基本选择器
            function basicSelector(selector, node, results) {
                node = node || document;
                results = results || [];
                var first = selector.charAt(0);
                // 选择器没有空格, 就是基本选择器
                if (!(/\s+/g).test(selector)) {
                    if (selector == '*') {
                        return getTag(selector, node, results);
                    } else if (first == '#') {
                        return getId(selector.slice(1), node, results);
                    } else if (first == '.') {
                        return getClass(selector.slice(1), node, results);
                    } else {
                        return getTag(selector, node, results);
                    }
                } else {
                    // 后代选择器
                    if (/^[\w\d\.\-_#]+(\s+[\w\d\.\-_#]+)+$/.test(selector)) {
                        push.apply(results, getChildren(selector, node));
                        return results;
                    } else {
                        throw new Error('无法实现该功能');
                    }
                    // 更多功能...
                }
            }

            // 四个基本选择器
            function getTag(tagName, node, results) {
                node = node || document;
                result = results || [];
                push.apply(results, node.getElementsByTagName(tagName));
                return results;
            }

            function getClass(className, node, results) {
                node = node || document;
                results = results || [];
                push.apply(results, getByClass(className, node, results));
                return results;
            }

            function getId(IdName, node, results) {
                node = node || document;
                results = results || [];
                var dom = node.getElementById(IdName);
                if (dom) {
                    push.apply(results, [dom]);
                    return results;
                }

            }

            // getClassName 的兼容性处理
            function getByClass(className, node) {
                node = node || document;
                if (node == document && support.getClassName1 || node.nodeType == 1 && support.getClassName2) {
                    return node.getElementsByClassName(className);
                } else {
                    var lists = node.getElementsByTagName('*');
                    var arr = [];
                    var temp;
                    for (var i = 0; i < lists.length; i++) {
                        temp = lists[i].getAttribute('class');
                        if (indexOf(temp, className) != -1) {
                            arr.push(lists[i]);
                        }
                    }
                    return arr;
                }
            }

            // 后代选择器
            function getChildren(selector, node) {
                node = node || document;
                var lists = selector.replace(/\s+/g, ' ').split(' ');
                var res1;
                var res2 = [node];
                for (var i = 0; i < lists.length; i++) {
                    res1 = res2;
                    res2 = [];
                    for (var j = 0; j < res1.length; j++) {
                        basicSelector(lists[i], res1[j], res2);
                    }
                }
                return res2;

            }

            // 并集选择器
            function getBoth(selector, node, results) {
                node = node || document;
                results = results || [];
                var lists = selector.split(',');
                for (var i = 0, len = lists.length; i < len; i++) {
                    basicSelector(trim(lists[i]), node, results);
                }
                return unique(results);
            }


            // 核心模块
            function Select(selector, node, results) {
                node = node || document;
                results = results || [];
                if (support.qsa) {
                    push.apply(results, node.querySelectorAll(selector));
                    return unique(results);
                } else {
                    return getBoth(selector, node, results);
                }
            }

            return Select;

        })();

    It.Select = Select;

    // dom 模块
    var parseHtml =
        (function () {
            var node = document.createElement('div');
            return function (str) {
                node.innerHTML = str;
                var arr = [];
                [].push.apply(arr, node.childNodes);
                return arr;
            }
        })();

    It.parseHtml = parseHtml;


    // 事件
    (function(){
        It.each(["onabort", "onblur", "oncancel", "oncanplay",
                "oncanplaythrough", "onchange", "onclick", "onclose",
                "oncontextmenu", "oncuechange", "ondblclick", "ondrag",
                "ondragend", "ondragenter", "ondragleave", "ondragover",
                "ondragstart", "ondrop", "ondurationchange", "onemptied",
                "onended", "onerror", "onfocus", "oninput", "oninvalid",
                "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata",
                "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter",
                "onmouseleave", "onmousemove", "onmouseout", "onmouseover",
                "onmouseup", "onmousewheel", "onpause", "onplay", "onplaying",
                "onprogress", "onratechange", "onreset", "onresize", "onscroll",
                "onseeked", "onseeking", "onselect", "onshow", "onstalled",
                "onsubmit", "onsuspend", "ontimeupdate", "ontoggle",
                "onvolumechange", "onwaiting", "onbeforecopy", "onbeforecut",
                "onbeforepaste", "oncopy", "oncut", "onpaste", "onsearch", "onselectstart",
                "onwheel", "onwebkitfullscreenchange", "onwebkitfullscreenerror"],
            function(i , v){
                var event = v.slice(2);
                It.fn[event] = function( callback ){
                    return this.on( event, callback );
                }
            });
    })();




    window.It = window.I = It;

})(window);
