'use strict'
// 远程组件通过打包后，得到的js
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
