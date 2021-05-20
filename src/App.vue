<template>
  <div
    id="app"
    @dragstart="dragStart($event)"
    @dragover.prevent="dragOver($event)"
    @drop="drop($event)"
  >
    <!-- 上半部分操作区 -->
    <top></top>

    <!-- 下半部分操作区 -->
    <bottom
      :mouseDownFlag="mouseDownFlag"
      :createTrackFlag="createTrackFlag"
      :positionX="positionX"
      @changeCreateTrackFlag="changeCreateTrackFlag"
      @keyup.enter="keyBoardEvent('delete')"
    ></bottom>
  </div>
</template>

<script>
import Top from "./components/Top";
import Bottom from "./components/Bottom";
export default {
  data() {
    return {
      mouseDownFlag: false, //鼠标按下
      createTrackFlag: false,
      positionX: 0,
    };
  },
  components: {
    Top,
    Bottom,
  },
  methods: {
    keyBoardEvent() {
      console.log(1);
    },
    // 拖拽开始
    dragStart(e) {
      this.mouseDownFlag = true;
      console.log(e);
    },
    //拖拽过程
    dragOver(e) {
      if (this.mouseDownFlag) {
      }
      // this.mouseDownFlag = false;
      // const sideBarSign = this.$store.state.currentSidebarSign;
    },

    // 拖拽结束
    drop(e) {
      this.mouseDownFlag = false;
      // 生成容器插入

      // 生成轨道内容 打开标识
      if (e.y > 555) {
        this.createTrackFlag = true;
        this.positionX = e.x;
        // this.$store.commit("updateSetTrack", true);
      } else {
        this.createTrackFlag = false;
        // this.$store.commit("updateSetTrack", false);
      }
      console.log(this.createTrackFlag);
    },

    changeCreateTrackFlag(flag) {
      this.createTrackFlag = flag;
    },
  },
  
};
</script>
<style lang="less">
html,
body,
#app,
ul {
  height: 100%;
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 1920px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
