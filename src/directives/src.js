import EventProxy from "../lib/EventProxy/EventProxy";

var eventProxy = new EventProxy()


/**
 *  有关optiion的介绍
 *  option = {
 *    errorImgUrl: {String}, // 加载资源错误时，回调的图片链接
 *    lazy: {Boolean} false // 是否开启懒加载模式
 *    defultImgUrl: {String} // 懒加载时的默认图片链接
 *    preloadTime: {Number} // 预加载完成后等待几毫秒加载真实图片Url      
 *  }
 */

var factory = function (option, Vue) {
    var img404Url = option && option.errorImgUrl || "https://images.uiiiuiii.com/wp-content/uploads/2017/10/i-ui171004-1-2.jpg"

    var onError = function () {
        set(this, img404Url)
    }

    var onLoad = function () {
        setStyle(this, {
            opacity: 1,
            transition: 'all .35s linear'
        })
        eventProxy.emit('loaded', this.src)
    }

    var isImgTag = function (v) {
        return v && v.tagName.toLowerCase() === 'img'
    }

    function set(el, v) {
        setStyle(el, {
            opacity: .5
        })

        el.setAttribute('src', v)
        el.setAttribute('data-src', v)
    }

    function setStyle(el, obj) {
        for(var key in obj) {
            el.style[key] = obj[key]
        }
    }

    var setAdaptedUrl = function (el, ch, durl, url) {
        var elTop = el.getBoundingClientRect().top
        var res = elTop - ch

        res >= 0 ? set(el, durl) : set(el, url) 
    }

    function lazyLoad(el, url) {
        if (!url) { return set(el, '') }

        var defultImgUrl = option && option.defultImgUrl || 'https://www.iqiyipic.com/common/fix/site-v4/qy-mod-img_425_311.png'
        var preloadTime = option && option.preloadTime || 10

        var macroTask = function () {
            var html = document.documentElement
            var body = document.body
            var clientHeight = Math.min(html.clientHeight, body.clientHeight)

            window.addEventListener('resize', function () {
                clientHeight = Math.min(html.clientHeight, body.clientHeight)
            })

            set(el, defultImgUrl)

            eventProxy.once('loaded', function (imgUrl) {
                if (imgUrl !== defultImgUrl) return;
                setTimeout(function() {
                    setAdaptedUrl(el, clientHeight, imgUrl, url)
                }, preloadTime)
            })

            var handleImgLazyLoad = function () {
                if (el.getAttribute('src') === url) {
                    window.removeEventListener('scorll', handleImgLazyLoad)
                    return;
                }
                setAdaptedUrl(el, clientHeight, defultImgUrl, url)
            }

            el.getAttribute('src') !== url && window.addEventListener('scroll', handleImgLazyLoad)
        }

        Vue.nextTick(macroTask)
    }

    var adapter = option && option.lazy ?  lazyLoad : set

    return {
        bind: function (el, binding, vnode) {
            if (!isImgTag(el)) return;
            adapter(el, binding.value)
            el.addEventListener('load', onLoad.bind(el))
            el.addEventListener('error', onError.bind(el))
        },
        update: function (el, binding) {
            adapter(el, binding.value)
        },
        unbind: function (el) {
            el.removeEventListener('error', onError)
            el.removeEventListener('load', onLoad)
        }
    }
}

export default {
    install: function (Vue, option) {
        Vue.directive('src', factory(option, Vue))
    }
}