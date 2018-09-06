export default {
    install: function (Vue, option) {
        var cache = {}
        
        /**
         * 缓存数据，供全局使用，只传key，返回缓存值， 传key， value 缓存值，并返回
         * @param {String} key 
         * @param {Mixed} value 
         */
        Vue.prototype.$cache = function (key, value) {
            return arguments.length > 1 ? (cache[key] = value) : cache[key];
        }
    }
}