<template>
  <n-space vertical>
    <n-space>
      <n-button type="info" @click="to({name: 'blog-add'})">新增</n-button>
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
</template>

<script setup>
import {NButton, NDataTable, NSpace, NPagination, useMessage, NInput, NSwitch} from 'naive-ui'
import {to} from '@/utils/routerUtils'
import {h, onMounted, reactive, ref} from "vue";
import request from "@/utils/request";
import {GetBlogByPageURL, RemoveBlogByIdURL, UpdateBlogURL} from "@/utils/Constant";


const data = reactive([])
const type = reactive([])
const keyword = ref('')
const columns = [
  {
    title: '#',
    key: 'key'
  },
  {
    title: '标题',
    key: 'title',
  },
  {
    title: '分类',
    key: 'type',
    render(row) {
      return type.find(item => item.id === row.typeId).name;
    }
  },
  {
    title: '是否显示',
    key: 'isShow',
    render(row) {
      return h(NSwitch, {
        value: row.isShow,
        onUpdateValue: (value) => {
          row.isShow = value
          update(row)
        }
      });
    }
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
                    to({name: 'blog-edit', params: {id: row.id}})
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
  request.post(GetBlogByPageURL, {
    pageSize: pagination.pageSize,
    pageNum: pagination.page,
    keyword: keyword.value
  }).then(res => {
    if (res.code === 0) {
      data.length = 0
      type.length = 0

      if (res.data.blogTypes && res.data.blogTypes.length > 0) {
        type.push(...res.data.blogTypes)
      }
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

function deleteById(id) {
  request.get(RemoveBlogByIdURL + id).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
      init()
    } else {
      message.error(res.msg)
    }
  })
}

function rowKey(row) {
  return row.id
}

function update(data) {
  request.post(UpdateBlogURL, data).then(res => {
    if (res.code === 0) {
      message.success('操作成功')
    } else {
      message.error(res.msg)
    }
  })
}

onMounted(() => {
  init()
})

</script>

<style scoped>
</style>