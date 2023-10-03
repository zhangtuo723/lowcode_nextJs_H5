
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

