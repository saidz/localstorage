// TODO:加上对ie6、7userData的封装，支持全系浏览器
var Saidz = {};
var ls = Saidz.localStorage = {};

ls.isSupport = function() {
    return Object.prototype.toString.call(localStorage) === '[object Storage]';
};
ls.isString = function(str) {
    return (typeof str === 'string');
};

ls.get = function(name) {
    if (this.isSupport() && localStorage[name]) {
        return JSON.parse(localStorage[name]);
    }
};
ls.set = function(name, value) {
    value = JSON.stringify(value);
    if (this.isSupport() && this.isString(name) && this.isString(value)) {
        localStorage[name] = value;
    }
};
ls.remove = function(name) {
    if (this.isSupport)
        delete localStorage[name];
};
/**
 * 遍历localStorage的每个选项
 * @param  {Function} fn 过滤器,第一个参数是name,第二个参数是值
 */
ls.each = function(fn) {
    if (this.isSupport) {
        var name;
        for (var i = 0; i < localStorage.length; i++) {
            name = localStorage.key(i);
            value = localStorage.getItem(name);
            fn(name, value);
        }
    }
};
ls.clear = function() {
    if (this.isSupport()) {
        localStorage.clear();
    }
};