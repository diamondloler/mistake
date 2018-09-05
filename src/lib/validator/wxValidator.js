(function (root, factory) {
  if (typeof module === "object") {
    module.exports = factory(root);
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(root);
    });
  } else {
    root.wxValidator = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {



  /**
   * constructor
   * @param {Object} src 待验证的数据对象
   * @param {Object} rules 与src键名一致的规则对象
   * @param {Object} messages 错误信息对象，命名的方式为 规则名 + '.' + 数据对象的 key
   */
  var wxValidator = function (src, rules, messages) {

    /**
     * 格式化对象，如：key值由'required|phone'变成 ['required', 'phone']
     * @param {Object} rules 
     * @returns {Object}
     */
    var str2Array = function (rules) {
      for (var key in rules) {
        rules[key] = rules[key].split('|')
      }
      return rules
    }

    /**
     * 转换成这样子
     * rules = {
     *    name: ['required'],
     *    phone: ['required', 'phone']
     * }
     */
    rules = str2Array(rules)


    //所有错误信息
    this.allErrors = {}

    //bind instance
    var that = this

    /**
     * 验证
     * @return {Boolean}
     */
    this.validate = function () {
      var globalFlag = true //整体通过验证的标志

      for (var key in src) {
        var i = 0, //用来loop
          singleRule //单个验证的rule
         

        var ruleList = rules[key]
        var value = src[key]
        var flag, fn, errorMsg

        if (typeof ruleList !== 'undefined') {
          while (singleRule = ruleList[i++]) {
            fn = this.getCheckFunc(singleRule)

            //使用者添加未注册的验证规则, 直接移除，进入下一个loop
            if (!fn) {
              ruleList.splice(i, 1)
              console.warn(
                'Rule name: \"' + 
                singleRule + 
                '\", please don\'t add the rule of unregistered for data that it be verify'
              )
              continue;
            }

            flag = fn(value)
           
            //假如有错，全局错误就是false
            if (flag === false) {
              globalFlag = false
              errorMsg = messages[singleRule + '.' + key];

              //注入错误信息
              ( this.allErrors[key] || (this.allErrors[key] = []) ).push(errorMsg || '默认错误(未添加自定义错误信息)')
            }

          }
        }
      }

      return globalFlag
    }


    /**
     * 获取单个key的错误信息
     * @param {String} key 
     * @returns {Mixed} 如存在错误，返回错误信息数组，否则返回null
     */
    this.getError = function (key) {
      return that.allErrors[key] || null
    }

  }

  //基础验证方法系列
  wxValidator.prototype.ruleMethods = {
    'required': function (val) {
      return val !== '' && true
    },
    'phone': function (val) {
      return /[0-9]{11}/.test(val)
    },
    'date': function (val) {
      return /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(val)
    },
    'email': function (val) {
      return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
    }
  }

  /**
   * 通过验证规则，获取验证方法
   * @param {String} rule 
   * @return {Function}
   */
  wxValidator.prototype.getCheckFunc = function (rule) {
    return this.ruleMethods[rule]
  }

  /**
   * 注册验证规则
   * @param {String} ruleName 规则名
   * @param {Function} handler 控制器
   */
  wxValidator.register = function (ruleName, handler) {
    if (typeof handler !== 'function') throw new Error('The handler must be a function');
    this.prototype.ruleMethods[ruleName] = handler;
  }

  /**
   * 对单一普通值快速验证
   * @param {String, Number} val 所要验证的普通值
   * @param {String} rule 验证规则
   * @param {String} message 对应的错误信息
   */
  wxValidator.singleValid = function (val, rule, message) {
    try {
      var result = this.prototype.getCheckFunc(rule)(val)
    } catch (e) {
      throw new Error('wxValidator.singleValid can not call the rule of undefined')
    }

    return {
      result: result,
      msg: (result === false && message) || '正确'
    }
  }

  return wxValidator

})