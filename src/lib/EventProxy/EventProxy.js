(function (root, factory) {
    if (typeof module !== "undefined") {
        module.exports = factory(root);
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.EventProxy = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {
    "use strict";

    // limit type
    var limitType = function (type) {
        if (type == 'default') throw new Error('The 1st argument must be a string except \"default\"')
    }

    var isFunction = function (v) {
        return typeof v === 'function';
    }

    var __slice = Array.prototype.slice

    // clone deep
    var deepClone = function (src) {
        var temp = {}
        for (var key in src) {
            temp[key] = src[key]
        }
        return JSON.parse(JSON.stringify(temp))
    }
    
    // to flatten for nested array , for example：[[100, [102, 103]], 400, [500, 600]] -> [100, 102, 103, 400, 500, 600]
    var flattening = function (arr) {
        var newArr = []
        var len = arr.length
        var hasArray = false
        for (var i = 0; i < len; i++) {
            var item = arr[i]
            if (Array.isArray(item)) {
                newArr = newArr.concat(item)
                hasArray = true
            } else {
                newArr.push(item)
            }
        }
        if (!hasArray) return newArr
        return flattening(newArr)
    }

    var findIndex = function (arr, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == key) return i
        }
        return false
    }


    var defaultEventModel = {
        'default': {
            type: 'default',
            queue: []
        }
    }


    // constructor
    var EventProxy = function () {}


    // event libary
    EventProxy.prototype.$eventLibary = defaultEventModel


    // subscription event
    EventProxy.prototype.on = function (type, handler) {
        limitType(type)

        if (!isFunction(handler)) {
            throw new Error('The handler of the event of ' + type + ' is not a function')
        }

        var $eventLibary = this.$eventLibary
        var currEventModel = $eventLibary[type]

        if (currEventModel) {
            return currEventModel.queue.push(handler)
        }

        $eventLibary[type] = deepClone($eventLibary['default'])
        $eventLibary[type].type = type
        $eventLibary[type].queue.push(handler)
    }


    // only once subscription event
    EventProxy.prototype.once = function (type, handler) {
        var that = this

        function on() {
            that.off(type, on)
            handler.apply(null, arguments)
        }

        this.on(type, on)
    }


    // remove event
    EventProxy.prototype.off = function (type, handler) {
        // all 
        if (!type) {
            this.$eventLibary = defaultEventModel
            return;
        }

        var eventModel = this.$eventLibary[type]

        // without event model
        if (!eventModel) return;

        // specity event
        if (!handler) {
            eventModel.queue = []
            return;
        }

        // specity handler
        var cbs = eventModel.queue
        var loop = cbs.length
        var cb

        while (loop--) {
            cb = cbs[loop]
            if (cb === handler) {
                cbs.splice(loop, 1)
                break;
            }
        }
    }

    // global flag, to mark down current event type when event emit
    var eventType

    // emit event
    EventProxy.prototype.emit = function () {
        var type = eventType = arguments[0]

        limitType(type)

        var args = __slice.call(arguments, 1)
        var eventModel = this.$eventLibary[type]
        var queue = eventModel.queue

        if (eventModel && Array.isArray(queue)) {
            var loop = 0,
                item;
            while (item = queue[loop++]) {
                try {
                    item.apply(null, args)
                } catch (error) {
                    console.warn(
                        'This \"' +
                        eventModel.type +
                        '\" event handler goes wrong, occured in :\n\n' +
                        item.toString() +
                        '\n\nThe error info as follow: \n' +
                        error.stack
                    )
                }
            }
        } else {
            throw new Error('The event of ' + type + ' is not exist')
        }
    }

    // event queue listen
    EventProxy.prototype.all = function (eventQueue, success) {
        if (!Array.isArray(eventQueue) || !isFunction(success)) return
        var len = eventQueue.length
        var argsCollection = []
       
        var consume = function () {
            // use the global eventType to match type 
            // and return index from eventQueue
            var index = findIndex(eventQueue, eventType)
            
            if (index !== false) {
                var ArgsArray = __slice.call(arguments)
                // base on corresponding index from eventQueue,
                // mapping the collection of callback arguments
                argsCollection[index] = ArgsArray
            }

            // when len is zero mean that 
            // the queue of all event executed completely
            --len || success.call(null, flattening(argsCollection))
        }

        if (len) {
            var i = 0
            var key
            while (key = eventQueue[i++]) {
                this.once(key, consume)
            }
        }
    }

    return EventProxy
})