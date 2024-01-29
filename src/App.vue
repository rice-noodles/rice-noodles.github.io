<template>
  <MdRender />
</template>

<script>
import MdRender from './components/MdRender.vue'

export default {
  name: 'App',
  components: {
    MdRender
  }
}
</script>

<style>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.is-horizontal {
  display: none;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-tree-node {
  padding: 5px;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #0003;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
}
</style>
