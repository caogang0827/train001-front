import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login  from '@/view/login/login'

Vue.use(Router);

export default new Router({
  routes: [

    //vue欢迎页面
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },

    //登录页面
    {
      path: '/tologin',
      name: 'login',
      component: login,
      meta:{
        require:false
      }
    },



  ]
})
