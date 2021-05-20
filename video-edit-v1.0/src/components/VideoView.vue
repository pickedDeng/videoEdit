<template>
  <div class="playVideo">
    <!-- <p>{{this.$store.state.curVideo.fileUrl}}</p> -->
    <img src="../assets/quickKey.jpg" alt  class="quickey"/>
    <video src="../assets/demo.mp4" id="myVideo"></video>
  </div>
</template>

<script>
export default {
  created() {
    this.$nextTick(() => {
      var vedio = document.getElementById("myVideo");
      var that = this;
      vedio.oncanplay = function() {
        that.Event.$emit("allTime", vedio.duration);
        // console.log(vedio.duration);
      };
    });
    // 开始和暂停播放视频
    this.Event.$on("paly", data => {
      var vedio = document.getElementById("myVideo");
      if (data) {
        vedio.play(); //播放
      } else {
        vedio.pause(); //暂停
      }
    });
    //设置当前时间
    this.Event.$on("currentTime", time => {
      var x = document.getElementById("myVideo");
      x.currentTime = String(this.formData(time))
    });
    // 分段播放
    this.Event.$on("subSectionPlay", value => {
      var x = document.getElementById("myVideo");
      x.currentTime = String(this.formData(value.startTime))
    });

  },
  mounted(){
    // this.$store.dispatch('changeVideo',d);
  },
  methods: {
    formData(time){
      var h = time.split(":")[0];
      var m = time.split(":")[1];
      var s = time.split(":")[2];
      var ms = time.split(".")[1];
      return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + "." + ms;
    }
  }
};
</script>

<style lang="less">
.playVideo{
    display: flex;
    .quickey{
        width: 500px;
        height: auto;
    }
.playVedio {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.playVedio video {
  height: 100%;
  width: auto;
}
}

</style>


