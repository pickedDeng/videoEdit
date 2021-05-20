import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


import("./assets/iconfont/iconfont.css")

// VueDraggableResizable
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable)

// 播放器 
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
Vue.use(VueVideoPlayer)

// 键盘事件VueHotkey
import VueHotkey from 'v-hotkey'
Vue.use(VueHotkey)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
