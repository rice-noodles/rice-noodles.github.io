# rice-noodles.github.io

+ 通过markedjs将markdown文本解析成HTML文本。
+ 项目打包后可以借助GitHub Pages挂载，用作个人笔记整理或者个人博客搭建。
+ 具体可以参考本项目的pages分支。[rice-noodles.github.io](https://rice-noodles.github.io)

### 配置说明

+ 通过config.js配置需要解析的markdown文档的路径与展示在页面上的名称。

+ 可参考以下配置：

  ~~~js
  export const files = [
    { id: 1, name: 'JVM', path: 'md/JVM.md' },
    { id: 2, name: 'MySQL', path: 'md/MySQL.md' },
    { id: 3, name: 'Netty', path: 'md/Netty.md' }
  ]
  ~~~

  

