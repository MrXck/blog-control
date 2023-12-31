import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import {loadingBar, notification} from "@/main";

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/blog-control',
    meta: {
      title: '首页'
    },
    component: () => import('../views/Index'),
    children: [
      {
        path: 'updateUser',
        name: 'updateUser',
        component: () => import('../views/updateUser-page/Account'),
        meta: {
          title: '信息修改'
        }
      },
      {
        path: 'blog-control',
        name: 'blog-control',
        redirect: '/blog-control/blog',
        meta: {
          title: '博客相关'
        },
        children: [
          {
            path: 'blog',
            name: 'blog',
            component: () => import('@/views/blog-page/BlogControl.vue'),
            meta: {
              title: '博客管理'
            }
          },
          {
            path: 'blog-edit',
            name: 'blog-add',
            component: () => import('@/views/blog-page/AddOrEditBlog.vue'),
            meta: {
              title: '博客新增'
            },
          },
          {
            path: ':id',
            name: 'blog-edit',
            component: () => import('@/views/blog-page/AddOrEditBlog.vue'),
            meta: {
              title: '博客编辑'
            }
          },
        ]
      },
      {
        path: 'blogType-control',
        name: 'blogType-control',
        redirect: '/blogType-control/blogType',
        meta: {
          title: '分类相关'
        },
        children: [
          {
            path: 'blogType',
            name: 'blogType',
            component: () => import('@/views/type-page/TypeControl.vue'),
            meta: {
              title: '分类管理'
            }
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('../views/result-page/404'),
    meta: {
      title: '404 Not Found'
    }
  },
  {
    path: '/:path',
    redirect: '/404'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  loadingBar.start()
  if (to.path !== '/login' && to.path !== '/register') {
    let token = localStorage.getItem('token')
    if (token !== null && token !== undefined && token !== '') {
    } else {
      notification.error({title: '通知', content: '请登录', duration: 5000})
      router.push('/login?to=' + to.path)
    }
  }
  next()
})

router.afterEach((to, from) => {
  // 后置守卫一般用来 优化用户的体验 例如切换路由时更改页面的title
  document.querySelector('title').innerText = to.meta.title + ' - 博客后台'
  loadingBar.finish()
})

export default router
