<template>
  <n-space vertical>
    <n-space>
      <n-button type="info" @click="showAddModal">新增</n-button>
      <n-input placeholder="请输入标题" v-model:value="keyword" @keydown.enter="init" />
      <n-button @click="init">搜索</n-button>
    </n-space>
    <n-data-table
        :columns="columns"
        :data="data"
        :bordered="true"
        :row-key="rowKey"
    />
    <n-space justify="end" align="center">
      <div>共 {{pagination.total}} 条</div>
      <n-pagination
          v-show="pagination.totalPage >= 1"
          v-model:page="pagination.page"
          :page-count="pagination.totalPage"
          size="medium"
          show-quick-jumper
          show-size-picker
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="pagination.pageSize"
          @update:page="pagination.updatePage"
          @update:page-size="pagination.updatePageSize"
      >
      </n-pagination>
    </n-space>
  </n-space>
  <n-modal v-model:show="showModal">
    <n-card
        style="width: 600px"
        title="编辑分类"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showModal = false">
          <template #icon>
            <n-icon>
              <Close/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space vertical>
        <n-input v-model:value="type.name" placeholder="请输入分类名称"/>
      </n-space>
      <template #footer>
        <n-button @click="saveOrUpdate">保存</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import {NButton, NDataTable, NSpace, NPagination, useMessage, NInput, NModal, NCard, NIcon} from 'naive-ui'
import {h, onMounted, reactive, ref} from "vue";
import request from "@/utils/request";
import {AddBlogTypeURL, GetBlogTypeByPageURL, RemoveBlogTypeByIdURL, UpdateBlogTypeByIdURL} from "@/utils/Constant";
import {Close} from "@vicons/ionicons5";


const data = reactive([])
const keyword = ref('')
const showModal = ref(false)
const type = ref({
  name: '',
  id: ''
})
const columns = [
  {
    title: '#',
    key: 'key'
  },
  {
    title: '标题',
    key: 'name',
  },
  {
    title: '创建时间',
    render(row) {
      return row.createTime.replace('T', ' ')
    }
  },
  {
    title: '修改时间',
    render(row) {
      return row.updateTime.replace('T', ' ')
    }
  },
  {
    title: '操作',
    render(row) {
      return h('div',
          [
            h(NButton,
                {
                  size: 'small',
                  type: 'info',
                  ghost: true,
                  onClick: () => {
                    type.value.name = row.name
                    type.value.id = row.id
                    showModal.value = true
                  }
                },
                {default: () => "编辑"}),
            h(NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true,
                  style: 'margin-left: 10px',
                  onClick: () => {
                    deleteById(row.id)
                  }
                },
                {default: () => "删除"})
          ]
      )
    }
  },
]
const message = useMessage()
const pagination = reactive({
  page: 1,
  pageSize: 15,
  pageSizes: [10, 15, 20, 25, 30],
  totalPage: 0,
  total: 0,
  updatePage: (page) => {
    pagination.page = page
    init()
  },
  updatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    init()
  },
})

function init() {
  request.post(GetBlogTypeByPageURL, {
    pageSize: pagination.pageSize,
    pageNum: pagination.page,
    keyword: keyword.value
  }).then(res => {
    if (res.code === 0) {
      data.length = 0
      let page = res.data.page
      pagination.totalPage = page.pages
      pagination.total = page.total
      for (let i = 0; i < page.records.length; i++) {
        let record = page.records[i]
        record.key = i + 1
        data.push(record)
      }
    } else {
      message.error(res.msg)
    }
  })
}

function showAddModal() {
  type.value.name = ''
  type.value.id = ''
  showModal.value = true
}

function deleteById(id) {
  request.get(RemoveBlogTypeByIdURL + id).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      init()
    } else {
      message.error(res.msg)
    }
  })
}

function saveOrUpdate() {
  if (type.value.id !== '') {
    request.post(UpdateBlogTypeByIdURL, type.value).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        init()
      } else {
        message.error(res.msg)
      }
    })
  } else {
    request.post(AddBlogTypeURL, type.value).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        init()
      } else {
        message.error(res.msg)
      }
    })
  }
}

function rowKey(row) {
  return row.id
}

onMounted(() => {
  init()
})

</script>

<style scoped>
</style>