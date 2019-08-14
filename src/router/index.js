import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import login  from '@/view/login/login'
import index from '@/view/shouye/index'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
import userManage from '@/view/manage/userManage'
import roleManage from '@/view/manage/menuManage'
import menuManage from '@/view/manage/roleManage'

Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [

    // //vue欢迎页面
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },

    //登录页面
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require:false
      }
    },
    {
      path: '/view/shouye/index',
      name: 'index',
      component: index,
      meta:{
        require:true//该路径的访问需要登录
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}},
            {path:'/user/manage',component:userManage,meta:{require:true}},
            {path:'/menu/manage',component:roleManage,meta:{require:true}},
            {path:'/role/manage',component:menuManage,meta:{require:true}},
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    }

  ]
})
