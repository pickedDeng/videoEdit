import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentItemTimezone: 300,//   1,10,60,300,600单位 s    对照调整刻度尺的数值 0-25-50-75-100
    currentSidebarSign: '0',//0 视频  1字幕  2 音乐  3图片
    currentSelectMedia: {
      type: "0",//0 视频  1字幕  2 音乐  3图片
      timeDuartion: 0, //总时长
    },
    isSetTrack: false,
    activedSelect: null,//轨道当前选中对象
    maxX:0,// 时间线最大滚动距离
  },
  mutations: {
    // 更新当前单个栅格内 秒数区间段
    updateCurrentItemTimezoneValue(state, value) {
      state.currentItemTimezone = value;
    },
    // 更新当前侧边栏标识
    updateSideBarSign(state, value) {
      state.currentSidebarSign = value;
    },
    // 更新拖拽选中对象
    updateSelectMedia(state, value) {
      // value.timeDuartion = value.timeDuartion | 3; //图片字幕等没有传入时长则默认3秒
      state.currentSelectMedia = value;
    },
    updateActivatedSelect(state, value) {
      // 更新轨道当前选中对象
      state.activedSelect = value;
    },
    // 生成轨道标识
    updateSetTrack(state, value) {
      state.isSetTrack = value;
    },

    // 更新播放线可移动最大位置
    updateMaxX(state,value){
      state.maxX = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
