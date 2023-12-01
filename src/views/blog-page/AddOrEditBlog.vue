<template>
  <n-space vertical>
    <n-input placeholder="请输入标题" v-model:value="note.title"/>
    <div class="editor" v-if="!isLoading">
      <Editor :locale="zhHans" :upload-images="handleUploadFile" :value="note.content" :plugins="plugins"
              @change="handleChange"/>
    </div>
    <n-space vertical>
      <n-select v-model:value="note.typeId" :options="options"/>
      <n-upload
          list-type="image-card"
          :max="1"
          :headers="{
            'authorization': token
          }"
          :default-file-list="fileList"
          @finish="uploadFinish"
          :action="BASEURL + uploadURL"
          @remove="change"
      >
        上传文件
      </n-upload>
      <n-space>
        <n-switch v-model:value="note.isShow" @update:value="changeValue" /> 是否显示
      </n-space>
    </n-space>
    <n-button @click="save">提交</n-button>
  </n-space>

</template>

<script setup>
import {NSpace, NInput, NButton, useMessage, NSelect, NUpload, NSwitch} from 'naive-ui'
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {AddBlogURL, GetAllBlogTypeURL, GetBlogByIdURL, UpdateBlogURL, uploadURL, BASEURL} from "@/utils/Constant";
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

const options = reactive([])
const fileList = ref([{
  id: "c",
  status: "finished",
  url: ""
}])
const route = useRoute();
const message = useMessage();
let token = localStorage.getItem('token')
const type = ref('add')
const isLoading = ref(true)
const note = ref({
  id: '',
  title: '',
  content: '',
  typeId: 1,
  image: '',
  isShow: true,
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

function change() {
  note.value.image = ''
}

function uploadFinish(data) {
  const resp = JSON.parse(data.event.srcElement.response)
  if (resp.code === 0) {
    note.value.image = BASEURL + resp.data
  } else {
    message.error(resp.msg)
  }
}

async function handleUploadFile(files) {
  const formData = new FormData();
  formData.append('file', files[0])
  const res = await request.post(uploadURL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  if (res.code === 0) {
    const split = res.data.split('/')
    return [
      {
        title: split[split.length - 1],
        url: res.data,
      },
    ]
  } else {
    return []
  }

}

function getType() {
  request.get(GetAllBlogTypeURL).then(res => {
    if (res.code === 0) {
      const data = res.data.blogTypes
      // if (data.length > 0) {
        note.value.typeId = data[data.length - 1]?.id
      // }
      for (let i = 0; i < data.length; i++) {
        options.push({
          label: data[i].name,
          value: data[i].id
        })
      }
    } else {
      message.error(res.msg)
    }
  })
}

function handleChange(val) {
  note.value.content = val
}

function changeValue(value) {
  note.value.isShow = value
}

onMounted(() => {
  if (route.params.id !== null && route.params.id !== undefined) {
    type.value = 'edit'
    note.value.id = route.params.id
    request.get(GetBlogByIdURL + route.params.id).then(res => {
      if (res.code === 0) {
        note.value = res.data.blog
        fileList.value[0].url = res.data.blog.image
      } else {
        message.error(res.msg)
      }
      isLoading.value = false
    })
  } else {
    isLoading.value = false
  }
  getType()
})

</script>

<style scoped>
:deep(.bytemd) {
  height: 700px;
}
</style>