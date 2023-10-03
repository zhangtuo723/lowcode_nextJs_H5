import React from "react"
// 远程组件库通过rollup打包后的一个组件 的 js代码
const button = `'use strict'
var React = require('react')
function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {default: e}
}
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React)
var Button = function (_ref) {
  var children = _ref.children
  return /*#__PURE__*/ React__default['default'].createElement(
    'button',
    {
      style: {
        color: 'blue',
      },
    },
    children
  )
}

module.exports = Button
`

const packages: any = {
  react: React,
}

const getParsedModule = (code: any) => {
  let module = {
    exports: {},
  }
  const require = (name: any) => {
    return packages[name]
  }
  // 封包
  Function('require, module', code)(require, module)
  return module
}


const getComponent = async (name: string) => {

  // 根据name发请求获取组件打包后的代码 ，Promise模拟异步请求
  const text = await Promise.resolve(button)
  // 得到text是一个组件的js代码，我们需要吧代码执行下，然后把得到 module.exports，这就是一个React FC  
  const module = getParsedModule(text)
  // 这个函数返回，需要有default属性 value为远程组件对象
  return { default: module.exports }

}

export default getComponent