// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false;

//引入定义的全局变量
import gloable from './store/gloable'
//存入全局备用
Vue.prototype.domain = gloable;

//引入axios
import axios from 'axios'

Vue.prototype.$axios = axios;
// 允许携带cookie
axios.defaults.withCredentials = true;

//引入cookie插件
import Cookies from 'js-cookie'

Vue.prototype.Cookies = Cookies;

//引入VUEX
import store from './store/store'

//路由拦截
router.beforeEach((to, from, next) => {

  if (to.meta.require) {

    let token = store.state.token;

    if (token !== "") {
      next();
    } else {
      next({path: "/"});
    }
    } else {
      next();
    }

});


//请求拦截器
axios.interceptors.request.use((config) => {
  if (config.url.includes("getCode")) {//如果是获取验证码的路径
    //没有Cookie的话添加Cookie
    let aucokie = Cookies.get("authcode");
    if (aucokie == null) {
      Cookies.set("authcode", "", {path: "/", domain: "localhost", age: -1})
    }
  } else {
    config.headers.token = store.state.token;
  }
  return config;
});

//自己导入的小图片
import './assets/font/iconfont.css'
import './assets/xiaotubiao/iconfont.css'


//vue的样式配置start
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
//vue的样式配置end

//引入音频文件 start
import yinpin from '../static/tishiyin/tishiyin.mp3'
import aiya from '../static/tishiyin/aiya.mp3'
import en from '../static/tishiyin/en.mp3'
import qingsong from '../static/tishiyin/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id, yinyue) => {
  let buttonAudio = document.getElementById(id);
  if (yinyue == "yinpin") {
    buttonAudio.setAttribute('src', yinpin)
  }
  if (yinyue == "en") {
    buttonAudio.setAttribute('src', en)
  }
  if (yinyue == "aiya") {
    buttonAudio.setAttribute('src', aiya)
  }
  if (yinyue == "qingsong") {
    buttonAudio.setAttribute('src', qingsong)
  }
  buttonAudio.play()
};
//引入音频文件 end


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
