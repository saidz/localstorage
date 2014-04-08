/**
 * 加上对ie6、7userData的封装，支持全系浏览器
 */

// 支持ie下得遍历，key可以考虑单独存一个文件
(function($) {
    function getIndex(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }
    if (!$.localStorage && /MSIE/.test(navigator.userAgent)) {
        var LocalStorage = function(fileName) {
            this.prefix = window.location.hostname || 'localstorage';
            // 本地存储文件名
            if (!fileName) {
                fileName = '__amap_' + this.prefix;
            }
            var box = document.body || document.getElementsByTagName('head')[0] || document.documenElement,
                dom = document.createElement('input');
            dom.type = 'hidden';
            dom.addBehavior('#default#userData');
            box.appendChild(dom);

            dom.save(fileName);
            //初始化对象属性
            this.fileName = fileName;
            this.dom = dom;
            // key存储文件
            this.keyFile = '__amap_' + this.prefix + 'cachkeys';
            this.keySplit = ',';
        };

        LocalStorage.prototype = {
            constructor: LocalStorage,
            setItem: function(key, value) {
                this.item(key, value);
                this.length = this.cacheKey(0, 4);
            },
            getItem: function(key) {
                return this.item(key);
            },
            removeItem: function(key) {
                this.item(key, null);
                this.length = this.cacheKey(0, 4);
            },

            clear: function() {
                var list = this.cacheKey(0, 3),
                    n = list.length,
                    i = 0;
                for (; i < n; i++) {
                    this.item(list[i], null);
                }
                this.length = 0;
            },
            item: function(key, value) {
                var dom = this.dom;
                // 写和删key
                if (value !== undefined) {
                    //保存key以便遍历和清除
                    this.cacheKey(key, value === null ? 2 : 1);
                    dom.load(this.fileName);
                    value === null ? dom.removeAttribute(key) : dom.setAttribute(key, value + '');
                    //存储
                    dom.save(this.fileName);
                } else {
                    //读属性
                    dom.load(this.fileName);
                    return dom.getAttribute(key) || null;
                }
            },
            /**
             * 管理key,key单独保存在一个文件中，用逗号分割
             * @param  {String} key    关键值
             * @param  {Number} action 行为：1，保存；2，删除; 3, 取key数组；4，取key数组长度
             */
            cacheKey: function(key, action) {
                var dom = this.dom;
                // 加载key文件
                dom.load(this.keyFile);
                var str = dom.getAttribute('keys') || '',
                    list = str ? str.split(this.keySplit) : [],
                    n = list.length,
                    i = 0,
                    isExist = false,
                    index = getIndex(list, key);
                if (index >= 0) {
                    isExist = true;
                }
                switch (action) {
                    case 1: //保存key
                        if (!isExist) {
                            list.push(key);
                        }
                        break;
                    case 2: // 删除key
                        list.splice(index, 1);
                        break;
                    case 3:
                        //返回数组
                        return list;
                    case 4:
                        // 返回长度
                        return length;
                    default:
                        break;
                }
                dom.setAttribute("keys", list.join(this.keySplit));
                dom.save(this.keyFile);
            },
            key: function(i) {
                return this.cacheKey(0, 3)[i];
            }
        };
        $.localStorage = new LocalStorage();
    }
})(window);

// 再次封装支持json解析

(function($) {
    S = {};
    var $ = S.localStorage = {};
    $.get = function(name) {
        var value = window.localStorage.getItem(name);
        return JSON.parse(value);
    };
    $.set = function(name, value) {
        value = JSON.stringify(value);
        if (window.localStorage.getItem(name)) {
            window.localStorage.removeItem(name);
        }
        window.localStorage.setItem(name, value);
    };
    $.remove = function(name) {
        window.localStorage.removeItem(name);
    };
    /**
     * 遍历localStorage的每个选项
     * @param  {Function} fn 过滤器,第一个参数是name,第二个参数是值
     */
    $.each = function(fn, context) {
        var name;
        fn = fn || function() {};
        context = context || this;
        for (var i = 0; i < localStorage.length; i++) {
            name = window.localStorage.key(i);
            value = window.localStorage.getItem(name);
            fn.call(context, name, value);
        }
    };
    $.clear = function() {
        window.localStorage.clear();
    };
})();