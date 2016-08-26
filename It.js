// 封装一个select

var select = (function () {

    var support = {};
    var rnative = /\[native code\]/;

    support.qsa = rnative.test(document.querySelectorAll + '');

    // document.getElementsByclassName
    support.documentGetClassName = rnative.test(document.getElementsByClassName + '');

    // node.getElementsByclassName
    var div = document.createElement('div');
    support.nodeGetClassName = rnative.test(div.getElementsByClass + '');

    function getByClassName (className , node){
        if( node == document &&  support.documentGetClassName || node.type == 1 && support.nodeGetClassName){
            return node.getElementsByClassName(className);
        } else {
            var arr = [];
            var list = document.getElementsByTagName('*');
            for(var i=0,len=list.length; i<len; i++){
                if(list[i].getAttribute('className' === className)){
                    arr.push(list[i]);
                }
            }
            return arr;
        }
    }



    var Select = function (selector, results) {
        results = results || [];
        if(support.qsa){
            Array.prototype.push(results, selector);
            return results;
        }
        return getQuerySelect(selector, results);
    }

    var getQuerySelect = function (selector , results) {

    }

    return Select;

})();