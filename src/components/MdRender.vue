<template>
  <el-row>
    <el-col class="hidden-sm-and-down" :md="2" :lg="2" :xl="2" v-show="!showTitle">
      <el-affix :offset="0">
        <div class="sidebar-nav" style="width: 40%; text-align: center;">
          <el-icon :size=" 25" @click="changeTitle">
            <Expand />
          </el-icon>
        </div>
      </el-affix>
    </el-col>
    <el-col class="hidden-sm-and-down" :md="8" :lg="6" :xl="6" v-show="showTitle">
      <el-scrollbar class="sidebar">
        <el-affix :offset="0">
          <div class="sidebar-nav">
            <el-icon :size=" 25" @click="changeTitle">
              <Fold />
            </el-icon>
            <el-icon :size=" 25" @click="this.showTree = !this.showTree">
              <Orange />
            </el-icon>
            <el-icon :size=" 25" @click="drawer = true">
              <Notebook />
            </el-icon>
          </div>
        </el-affix>
        <el-tree v-show="showTree" :highlight-current="true" :data="titleTrees" :props="defaultProps" @node-click="handleNodeClick" />
        <ul v-show="!showTree">
          <li v-for="item in titles" :key="item.id" :class="`toc-nav-${item.level}`" @click="handleNodeClick({id:item.idText})">{{ item.text }}</li>
        </ul>
      </el-scrollbar>
    </el-col>
    <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
      <div class="gird-content" v-highlight v-html="markdownContent">
      </div>
    </el-col>
    <el-drawer v-model="drawer" :with-header="false">
      <ul>
        <li v-for="item in files" :key="item.id" @click="loadMarkdownFile(item.path)">{{ item.name }}</li>
      </ul>
    </el-drawer>
  </el-row>
</template>

<script>
import { marked } from 'marked'
import { files } from '/public/config.js'
export default {
  components: {},
  data() {
    return {
      files: files,
      markdownContent: '',
      titles: [],
      titleTrees: [],
      defaultProps: { children: 'children', label: 'label' },
      showTitle: true,
      showTree: false,
      drawer: false
    }
  },
  mounted() {
    this.loadMarkdownFile('md/JVM.md')
    this.initRenderMD()
  },
  methods: {
    async loadMarkdownFile(mdName) {
      try {
        this.titles = []
        this.titleTrees = []
        const response = await fetch(mdName)
        const markdownText = await response.text()
        this.markdownContent = marked(markdownText)
        this.parseTitle()
      } catch (error) {
        console.error('Failed to load the Markdown file:', error)
      }
    },
    initRenderMD() {
      let render = new marked.Renderer()
      let h = 0
      render.heading = function (text, level) {
        h++
        return `<h${level} id="toc-nav-${h}">${text}</h${level}>\n`
      }
      marked.setOptions({
        renderer: render
      })
    },
    handleNodeClick(data) {
      // window.location.hash = `#${data.id}`
      const el = document.getElementById(data.id)
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    },
    /** 解析标题 */
    parseTitle() {
      let arr = this.markdownContent.split('\n')
      let titles = []
      let hArr = ['h1', 'h2', 'h3', 'h4']
      let id = 1
      arr.forEach((o) => {
        hArr.forEach((h) => {
          // 根据标题id已经标签来过滤
          if (o.indexOf(h) !== -1 && o.indexOf('toc-nav-') !== -1) {
            let start = o.indexOf('>') + 1
            let end = o.lastIndexOf('<')
            let text = o.substring(start, end)
            start = o.indexOf('"') + 1
            end = o.lastIndexOf('"')
            let idText = o.substring(start, end)
            let obj = { id: id++, idText: idText, level: h, text: text }
            titles.push(obj)
          }
        })
      })
      this.titles = titles
      this.parseTree()
    },
    /** 解析目录树 */
    parseTree() {
      let titles = this.titles
      let i = 1
      let parent = null
      while (i < titles.length) {
        let root = this.getTreeNode(titles[i - 1])
        this.titleTrees.push(root)
        parent = root
        while (i < titles.length) {
          let cur = this.getTreeNode(titles[i++])
          if (cur.level <= root.level) {
            break
          }
          if (parent.level > root.level && parent.level < cur.level) {
            parent.children.push(cur)
          } else {
            root.children.push(cur)
            parent = cur
          }
        }
      }
    },
    getTreeNode(title) {
      return {
        label: title.text,
        id: title.idText,
        level: title.level,
        children: []
      }
    },
    changeTitle() {
      this.showTitle = !this.showTitle
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  z-index: var(--sidebar-z-index);
  overflow: hidden;
  width: 20%;
  transition: background-color var(--el-transition-duration-fast), opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.sidebar-nav {
  background-color: #fff;
  box-shadow: var(--el-box-shadow);
  border-radius: 4px;
}

.sidebar-nav .el-icon {
  padding: 5px 10px 5px 5px;
  cursor: pointer;
  color: #606266;
}

.sidebar-nav .el-icon:hover {
  color: #409eff;
}

.gird-content {
  padding: 0 30px 10px 0px;
  transition-property: all;
  transition-duration: 0.8s;
}
ul {
  padding-left: 10px;
  background: var(--el-fill-color-blank);
  color: #606266;
  font-size: 14px;
  margin-top: 0;
}
ul li {
  list-style-type: none;
  background: var(--el-fill-color-blank);
  color: var(--el-tree-text-color);
  font-size: var(--el-font-size-base);
  padding: 10px;
  cursor: pointer;
}
ul li:hover {
  background-color: var(--el-color-primary-light-9);
}
.toc-nav-h2 {
  padding-left: 12px;
}
.toc-nav-h3 {
  padding-left: 24px;
}
.toc-nav-h4 {
  padding-left: 36px;
}
</style>