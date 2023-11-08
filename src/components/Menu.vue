<template>
  <n-layout>
    <n-layout-header class="header">
      <div class="title" @click="to('/')">
        待办事项
      </div>
      <div class="bread">
        <n-breadcrumb>
          <n-breadcrumb-item v-for="item in route.matched.filter((item) => item.meta?.title)"
                             @click="to(item.path)">
            {{ item.meta.title }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
      <div class="user">
        <n-dropdown
            trigger="hover"
            :options="options"
        >
          <div style="display: flex;justify-content: center;align-items: center;cursor:pointer;">
            <n-avatar round size="small">{{ user.username[0] }}</n-avatar>
            <span class="username">{{ user.username }}</span>
          </div>
        </n-dropdown>
      </div>
    </n-layout-header>
    <n-layout has-sider content-style="height: calc(100vh - 64px)">
      <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
      >
        <n-scrollbar>
          <n-menu
              v-model:value="activeKey"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
          />
        </n-scrollbar>
      </n-layout-sider>
      <n-layout>
        <n-scrollbar>
          <div style="padding: 10px">
            <router-view/>
          </div>
        </n-scrollbar>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script setup>
import {
  NLayout,
  NBreadcrumb,
  NBreadcrumbItem,
  NLayoutContent,
  NLayoutHeader,
  NLayoutFooter,
  NLayoutSider,
  NMenu,
  NScrollbar,
  NIcon,
  NAvatar,
  NDropdown,
  useMessage,
} from 'naive-ui'
import {h, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {RouterLink, useRoute} from "vue-router";
import {to} from '@/utils/routerUtils'
import {
  Home,
  DesktopOutline,
  List,
  SettingsOutline,
  AppsSharp,
  CalendarOutline,
} from "@vicons/ionicons5";


const route = useRoute()
const activeKey = ref(route.path)
let collapsed = ref(false)
const menuOptions = [
  {
    label: '博客相关',
    key: '/blog-control',
    icon: renderIcon(List),
    children: [
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: 'blog-control'
              }
            },
            {default: () => "博客管理"}
        ),
        key: '/blog-control/blog',
        icon: renderIcon(AppsSharp)
      },
    ]
  },
]
const message = useMessage()
const user = ref({
  username: '',
  avatar: ''
})

const options = [
  {
    label: '首页',
    key: 'home',
    props: {
      onClick: () => {
        to('/')
      }
    }
  },
  {
    label: '个人中心',
    key: 'updateUser',
    props: {
      onClick: () => {
        to('/updateUser')
      }
    }
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '登出',
    key: 'logout',
    props: {
      onClick: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        to('/login')
      }
    }
  },
]

watch(() => route.path, (newVal) => {
  activeKey.value = newVal
})

onMounted(() => {
  if (document.documentElement.clientWidth < 1000) {
    collapsed.value = true
  }
  user.value = JSON.parse(localStorage.getItem('user'))
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})


function resize(e) {
  if (document.documentElement.clientWidth < 768) {
    collapsed.value = true
  } else if (document.documentElement.clientWidth > 1000) {
    collapsed.value = false
  }
}

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}
</script>

<style scoped>
.header {
  height: 64px;
  display: flex;
  padding: 0 32px;
  align-items: center;
  border-bottom: 1px solid #efefef;
  justify-content: space-around;
}

.title {
  width: 210px;
  cursor: pointer;
}

.bread {
  margin: 0 20px;
  flex: 3;
}

.user {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.username {
  margin-left: 4px;
}
</style>