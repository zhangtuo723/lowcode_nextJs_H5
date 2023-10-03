# 搭建一个简易版本的lowcode

整个项目分为三个板块：前端展示页面、后台配置页面、组件库



# 前端展示页

使用nextjs进行渲染，ssr有利于这个seo，具体流程是根据url里面的id，next去发请求获得页面schema，然后根据这个schema去渲染页面，schema大体结构如下：

```
{
        pageid:'',
        edit:'',
        version:'v1',
        // 页面中从上到下的所有组件
        components:[
            {
                componetName:'',
                props:{}
              }  ]  
} 
```

目前页面的结构是一个从上倒下的瀑布流，没有跨层级。components是一个组件数组，里面里面记录这个页面中的全部组件信息（组件名，和props）。至于怎么获取这些组件并且渲染呢？

1.     通过去加载一个组件库，从这个组件库里面获取这个组件。

2.    通过react.lazy去加载一个远程组件（.js文件） 

方案1，加载一个npm安装的组件库，这样会导致一种情况：每次有组件升级如果想要使用新的组件，展示页面需要重新升级这个组件库重新打包。

所以选用方案二，优点就是通过方案二引入组件的方法，是引入远程的组件，之后只需要维护这个组件库即可，整个前端展示页可以适应不同版本组件。

所以现在的问题是怎么讲.js文件渲染为一个组件。一个React FC组件经过打包后会得到一个js文件例如一个button组件：

```javascript
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
```

我们要做的事通过React.lazy(()=>import('xxx')) 这个方法将远程组件导进来，React.lazy的参数事import函数，或者是一个返回值是{default:组件fc} 的异步函数。然后配合Suspense渲染这个组件。

home/[id].js

```javascript

import styles from '@/styles/page.module.scss'
import { getSchema } from '../../lib/request'
import getComponent from '../../lib/getComponent'
import React, { Suspense } from 'react'
import { useMemo } from 'react'
export default function Page({ components }) {
    const pageComponent = components.map((item, index) => {
        return {
            // useMemo 缓存一下
            C: useMemo(
                () => React.lazy(() => getComponent(item.componentName)),
                [item.componentName]
            ),
            P: item.props
        }
    })

    return (
        <div className={styles.root}>
            <Suspense fallback={<>122</>}>
                {
                    pageComponent.map((item, index) => {
                        const { C, P } = item
                        return <C key={index} {...P}></C>
                    })
                }
            </Suspense>
        </div>
    )
}

export async function getServerSideProps(contex) {
    const id = contex.params
    // 使用这个 id 去发请求获取页面schema
    const schema = await getSchema(id)
    const pageSchema = JSON.parse(schema)



    return {
        props: {
            components: pageSchema.components
        }
    }
}


```

getComponent 是一个获取远程组件的方法，获取到的一个js文件然后执行一下想办法从里面拿到module.exports的东西。通过new Function里面传入一个module对象来获取。

```javascript
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
```

至此，可以实现lowcode的展示页面