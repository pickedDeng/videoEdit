<template>
  <div id="#app">
    <!-- 视频显示 -->
    <videoView></videoView>

    <!-- 控制 -->
    <videoControl></videoControl>
  </div>
</template>
<script>
import videoView from "./components/VideoView";
import videoControl from "./components/VideoControl";
export default {
  components:{
    videoView,
    videoControl
  }
}
</script>
<style lang="less">
    *{
      margin: 0;
      padding: 0;
    }
</style>