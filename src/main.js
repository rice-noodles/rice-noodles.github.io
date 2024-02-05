import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/*黑色主题*/
import 'highlight.js/styles/github-dark.css'
/*白色主题*/
// import 'highlight.js/styles/stackoverflow-light.css';
import hljs from 'highlight.js/lib/core'
import hljsVuePlugin from '@highlightjs/vue-plugin'
// 批量引入常用语言库
import 'highlight.js/lib/common'

const app = createApp(App)

app.directive('highlight', function (el) {
  let highlight = el.querySelectorAll('pre code')
  highlight.forEach((block) => {
    hljs.highlightElement(block)
  })
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(hljsVuePlugin)
app.mount('#app')
