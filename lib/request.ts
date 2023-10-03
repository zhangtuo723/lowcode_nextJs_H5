export function getSchema(id:string){

    // 拿到这个id去发请求

    return Promise.resolve(JSON.stringify({
        pageid:1,
        edit:'章三',
        version:'v1',
        // 页面中从上到下的所有组件
        components:[
            {
                componetName:'myImage',
                props:{
                    url:'http://43.140.197.245:7890/uploads/16c4643655fb9a5f584472c20c98776e'
                }
            },
            {
                componetName:'myText',
                props:{
                    content:'我是章三'
                }
            },
            {
                componetName:'myText',
                props:{
                    content:'我是lis'
                }
            },
            {
                componetName:'myText',
                props:{
                    content:'我是wangwu'
                }
            }
        ]
    }))

}