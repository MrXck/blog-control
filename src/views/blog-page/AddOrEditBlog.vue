<template>
  <n-space vertical>
      <n-input placeholder="请输入标题" v-model:value="note.title" />
    <div class="editor" v-if="!isLoading">
      <Editor :locale="zhHans" :upload-images="handleUploadFile" :value="note.content" :plugins="plugins" @change="handleChange"/>
    </div>
    <n-button @click="save">提交</n-button>
  </n-space>

</template>

<script setup>
import {NSpace, NInput, NButton, useMessage} from 'naive-ui'
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {AddBlogURL, GetBlogByIdURL, UpdateBlogURL} from "@/utils/Constant";
import request from "@/utils/request";
import {Editor} from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import gemoji from '@bytemd/plugin-gemoji'
import highlight from '@bytemd/plugin-highlight'
import frontmatter from '@bytemd/plugin-frontmatter'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import breaks from '@bytemd/plugin-breaks'
import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/tokyo-night-dark.min.css'

const plugins = [
  gfm(),
  gemoji(),
  highlight(),
  frontmatter(),
  mediumZoom(),
  breaks(),
]

const route = useRoute();
const message = useMessage();
let editor = null
const type = ref('add')
const isLoading = ref(true)
const note = ref({
  id: '',
  title: '',
  content: '',
  typeId: 0,
  image: '',
})


function save() {
  if (type.value === 'add') {
    request.post(AddBlogURL, note.value).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
      } else {
        message.error(res.msg)
      }
    })
  } else {
    request.post(UpdateBlogURL, note.value).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
      } else {
        message.error(res.msg)
      }
    })
  }

}

function handleUploadFile(e) {

}

function handleChange(val) {
  note.value.content = val
}

onMounted(() => {
  if (route.params.id !== null && route.params.id !== undefined) {
    type.value = 'edit'
    note.value.id = route.params.id
    request.get(GetBlogByIdURL + route.params.id).then(res => {
      if (res.code === 0) {
        note.value = res.data.blog
      } else {
        message.error(res.msg)
      }
      isLoading.value = false
    })
  } else {
    isLoading.value = false
  }
})

</script>

<style scoped>
.editor {
  height: 700px;
}

:deep(.bytemd) {
  height: 700px;
}
</style>