/**
 * Created by Liu on 2016/8/19.
 */

(function (window, undefined) {

    function It(selector){
        return new It.fn.init(selector);
    }
    It.fn = It.prototype = {
        constructor : It,
        length : 0,
        type : 'It',
        init : function(selector){
            if( !selector ){
                return this;
            }
            if( typeof selector == 'string' ){
                if( selector.charAt(0) == '<' && selector.charAt(selector.length - 1) && selector.length >= 3 ){
                    [].push.apply( this, It.parseHtml( selector ) );
                }else{
                    [].push.apply( this, It.Select( selector ) );
                }
            }
            if( typeof selector == 'function' ){

            }
            if( selector.nodeType ){

            }
            if( selector.type == 'It' ){

            }
        }

    }

    It.fn.init.prototype = It.fn;

    // 混入方法
    It.extend = It.fn.extend = function(obj){
        for (var key in obj) {
            this[key] = obj[key];
        }
        return this;
    }


    // 选择器模块
    var Select =
        (function(){

            var support = {},
                push = [].push,
                rnative = /\[native code\]/;

            support.qsa = rnative.test( document.querySelectorAll );

            // 继承的是 docuement 上面的 class 方法
            support.getClassName1 = rnative.test( document.getElementsByClassName );

            // 继承的是 node 上面的 class 方法
            var div = document.createElement( 'div' );
            support.getClassName2 = rnative.test( div.getElementsByTagName );

            support.indexOf = rnative.test( Array.prototype.indexOf );

            support.trim = rnative.test( String.prototype.trim );

            // apply 兼容性处理
            try{
                push.apply( [], document.getElementsByTagName( '*' ) );
            } catch(e) {
                push = {
                    apply : function (a, b) {
                        for(var i = 0;i<b.length;i++){
                            a[a.length++] = b[i];
                        }
                    },
                    call : function (a) {
                        var args = [];
                        for(var i =1;i<arguments.length;i++){
                            args.push( arguments[i] );
                        }
                        this.apply( a, args );
                    }
                }
            }

            function indexOf( array, search, startIndex ){
                startIndex = startIndex || 0;
                if( support.indexOf ){
                    return array.indexOf( search, startIndex );
                }else{
                    for(var i = startIndex;i < array.length;i++){
                        if( search == array[i] ){
                            return i;
                        }
                    }
                    return -1;
                }
            }

            function trim( string ){
                if( support.trim ){
                    return string.trim();
                }else{
                    return string.replace( /^\s+|\s+$/ , '' );
                }
            }

            function unique(array){
                var newArr = [];
                for(var i = 0;i<array.length;i++){
                    if( indexOf( newArr, array[i] ) == -1){
                        newArr.push( array[i] );
                    }
                }
                return newArr;
            }

            // 基本选择器
            function basicSelector( selector, node, results){
                node = node || document;
                results = results || [];
                var first = selector.charAt(0);
                // 选择器没有空格, 就是基本选择器
                if( !(/\s+/g).test( selector ) ){
                    if( selector == '*' ){
                        return getTag( selector, node, results );
                    }else if( first == '#'){
                        return getId( selector.slice(1), node, results );
                    }else if( first == '.' ){
                        return getClass( selector.slice(1), node, results );
                    }else{
                        return getTag( selector, node, results );
                    }
                }else{
                    // 后代选择器
                    if( /^[\w\d\.\-_#]+(\s+[\w\d\.\-_#]+)+$/.test(selector)){
                        push.apply( results, getChildren( selector, node ) );
                        return results;
                    }else{
                        throw new Error( '无法实现该功能' );
                    }
                    // 更多功能...
                }
            }

            // 四个基本选择器
            function getTag( tagName, node, results ){
                node = node || document;
                result = results || [];
                push.apply( results, node.getElementsByTagName( tagName ) );
                return results;
            }
            function getClass( className, node, results ){
                node = node || document;
                results = results || [];
                push.apply( results, getByClass( className, node, results ) );
                return results;
            }
            function getId( IdName, node, results ){
                node = node || document;
                results = results || [];
                var dom = node.getElementById( IdName );
                if( dom ){
                    push.apply( results, [dom] );
                    return results;
                }

            }

            // getClassName 的兼容性处理
            function getByClass( className, node ){
                node = node || document;
                if( node == document && support.getClassName1 || node.nodeType == 1 && support.getClassName2 ){
                    return node.getElementsByClassName( className );
                }else{
                    var lists = node.getElementsByTagName( '*' );
                    var arr = [];
                    var temp;
                    for(var i =0;i < lists.length;i++){
                        temp = lists[i].getAttribute( 'class' );
                        if( indexOf( temp, className ) != -1){
                            arr.push( lists[i] );
                        }
                    }
                    return arr;
                }
            }

            // 后代选择器
            function getChildren(selector, node){
                node = node || document;
                var lists = selector.replace( /\s+/g, ' ' ).split( ' ' );
                var res1;
                var res2 = [ node ];
                for(var i = 0; i< lists.length;i++){
                    res1 = res2;
                    res2 = [];
                    for(var j = 0;j<res1.length;j++){
                        basicSelector( lists[i], res1[j] , res2 );
                    }
                }
                return res2;

            }

            // 并集选择器
            function getBoth( selector, node, results ){
                node = node || document;
                results = results || [];
                var lists = selector.split( ',' );
                for(var i=0,len=lists.length; i<len; i++){
                    basicSelector( trim( lists[i] ), node, results );
                }
                return unique(results);
            }


            // 核心模块
            function Select( selector, node, results ){
                node = node || document;
                results = results || [];
                if( support.qsa ){
                    push.apply( results, node.querySelectorAll( selector ) );
                    return unique( results );
                }else{
                    return getBoth( selector, node, results );
                }
            }
            return Select;

        })();

    It.Select = Select;

    // dom 模块
    var parseHtml =
        (function () {
            var node = document.createElement( 'div' );
            return function ( str ) {
                node.innerText = str;
                var arr = [];
                push.apply( arr , node.childNodes);
            }
        })();

    It.parseHtml = parseHtml;


    // 实例成员
    It.fn.extend({
        appendTo : function ( dom ) {
            for(var i = 0;i < this.length;i++){
                dom.appendChild( this[i] );
            }
            return this;
        }
    });



    window.It = window.I = It;

})(window);

















































































