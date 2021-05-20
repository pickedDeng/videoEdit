<template>
  <div class="top_operate_area">
    <!-- 头部占位区域 -->
    <div class="top_head"></div>

    <!-- 文件区+预览区 容器 -->
    <div class="top_container">
      <!-- 素材区 -->
      <div class="top_container_source">
        <!-- 素材切换 -->
        <el-tabs
          :tab-position="'left'"
          class="sidebar_left"
          type="border-card"
          v-model="sideBarActiveName"
        >
          <el-tab-pane>
            <span slot="label"><i class="iconfont icon-shipin"></i> 视频</span>
            <div class="list_container">
              <div
                class="list_item"
                @mousedown="listClick(item, '0')"
                v-for="item in videoListData"
                :key="item.id"
              >
                <img class="list_pic" src="../assets/demo.png" alt="" />
                <span>{{ item.time }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="iconfont icon-music"></i> 音乐</span>
            <div class="list_container">
              <div
                class="list_item"
                v-for="item in audioListData"
                :key="item.id"
                @mousedown="listClick(item, '1')"
              >
                <img
                  class="list_pic audio_pic"
                  src="../assets/audio-bg.png"
                  alt=""
                />
                <span>{{ item.time }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="iconfont icon-wenben"></i> 字幕</span>
            字幕
          </el-tab-pane>

          <el-tab-pane>
            <span slot="label"><i class="iconfont icon-tupian"></i> 图片</span>
            图片
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 预览区 -->
      <div class="top_container_preview">
        <video
          :src="videoOption.src"
          ref="videoPlayer"
          id="preVideo"
          @canplay="videoCanPlay"
          @error="videoError"
          @pause="videoPause"
          @play="videoPlay"
          @playing="videoPlaying"
          @waiting="videoWaiting"
        ></video>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="small_operate_area">
      <div class="operate_btn_left"></div>

      <div class="operate_btn_right">
        <div
          class="iconfont icon-icon_play playbtn"
          v-if="videlPlagFlag"
          @click="play"
        ></div>
        <div class="iconfont icon-zanting1 playbtn" v-else @click="pause"></div>
        <span>调整刻度</span>
        <div class="block">
          <el-slider
            v-model="currentChooseStep"
            :step="25"
            show-stops
            :show-tooltip="false"
          >
          </el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 播放器
      videlPlagFlag: true,
      videoOption: {
        duration: null,
        src: require("../assets/demo.mp4"),
      },

      currentChooseStep: 75, //当前选中刻度标准 分为
      sideBarActiveName: "0", //当前侧边栏name
      videoListData: [
        {
          id: 1,
          time: "04:53",
          timeDuration: 293,
          url: "../assets/demo.png",
        },
        {
          id: 2,
          time: "04:00",
          timeDuration: 240,
          url: "../assets/demo.png",
        },
      ],
      audioListData: [
        {
          id: 3,
          time: "02:53",
          timeDuration: 173,
          url: "../assets/audio-bg.png",
        },
        {
          id: 4,
          time: "02:00",
          timeDuration: 120,
          url: "../assets/audio-bg.png",
        },
      ],
    };
  },
  mounted() {
    console.log(this.DOMplay.duration);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer;
    },
    DOMplay() {
      return document.getElementById("preVideo");
    },
  },
  methods: {
    listClick(item, type) {
      // console.log(item);
      const currentSelectObj = {
        type,
        timeDuration: item,
      };
      this.$store.commit("updateSelectMedia", currentSelectObj);
    },
    // 播放
    play() {
      this.videlPlagFlag = !this.videlPlagFlag;
      this.DOMplay.play()
    },

    // 暂停
    pause() {
      this.videlPlagFlag = !this.videlPlagFlag;
      this.DOMplay.pause()
    },
    // 播放器事件

    // 播放器准备就绪 可播放
    videoCanPlay() {
      console.log("OK");
      console.log(this.DOMplay.duration);
    },

    // 当在音频/视频加载期间发生错误时
    videoError() {},

    // 当音频/视频已暂停时
    videoPause() {},

    // 当音频/视频已开始或不再暂停时
    videoPlay() {},

    // 当音频/视频在已因缓冲而暂停或停止后已就绪时
    videoPlaying() {},

    // 当视频由于需要缓冲下一帧而停止
    videoWaiting() {},
  },
  watch: {
    // 改变刻度
    currentChooseStep(val, old) {
      let currentItemTimezoneValue = null;
      switch (val) {
        case 100:
          currentItemTimezoneValue = 600;
          break;
        case 75:
          currentItemTimezoneValue = 300;
          break;
        case 50:
          currentItemTimezoneValue = 60;
          break;
        case 25:
          currentItemTimezoneValue = 10;
          break;
        case 0:
          currentItemTimezoneValue = 1;
          break;
        default:
          break;
      }
      if (!currentItemTimezoneValue) {
        this.$message(`没有匹配到该步长--${val}`);
      }
      // 更新单个时间段长
      this.$store.commit(
        "updateCurrentItemTimezoneValue",
        currentItemTimezoneValue
      );
    },
    // 监听当前侧边栏，判断高亮区域
    sideBarActiveName(val, old) {
      this.$store.commit("updateSideBarSign", val);
    },
  },
};
</script>

<style lang="less">
.top_operate_area {
  height: 500px;

  .top_head {
    background: #33353a;
    text-align: left;
    padding-left: 50px;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    color: #999;
    text-decoration: underline;
  }
  .top_container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    height: calc(100% - 80px);
    .top_container_source {
      background: #252628;
      flex: 1;
      .list_container {
        display: flex;
        flex-wrap: wrap;
        .list_item {
          position: relative;
          cursor: move;
          margin-right: 20px;
          span {
            position: absolute;
            padding: 0 5px;
            left: 10px;
            bottom: 10px;
            font-size: 12px;
            color: #fff;
            background: rgba(0, 0, 0, 0.5);
          }
          .list_pic {
            width: 160px;
            height: 90px;
            border-radius: 5px;
          }
        }
      }

      .sidebar_left {
        .el-tabs__header {
          width: 200px;
          text-align: center;
          .el-tabs__item {
            text-align: center;
          }
        }
      }
      .iconfont {
        font-size: 20px;
      }
      .el-tabs__item {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
      }
      .el-tabs--border-card > .el-tabs__header {
        background: none;
        border: none;
      }
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        visibility: hidden;
      }
      .el-tabs--border-card {
        background: none;
        border: none;
        box-shadow: none;
      }
    }
    .top_container_preview {
      background: #1e1e1e;
      position: relative;
      flex: 1;
      #preVideo {
        width: 100%;
        height: 100%;
      }
    }
  }
  .small_operate_area {
    height: 40px;
    background: #34363b;
    border-bottom: 1px solid #1e1e1e;
    box-sizing: border-box;
    padding: 0 30px;
    color: #fff;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 0 30px;
    align-items: center;
    .operate_btn_right {
      display: flex;
      align-items: center;
      height: 100%;
      .block {
        width: 200px;
        padding-left: 20px;
      }
    }
    .playbtn {
      color: #fff;
      font-size: 30px;
      margin-right: 150px;
    }
  }
}
</style>