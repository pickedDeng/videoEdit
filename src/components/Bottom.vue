<template>
  <div class="bottom_operate_container" v-hotkey="keymap">
    <div
      class="bottom_operate_area"
      :style="{ width: rulerSizeNumber * 300 + 'px' }"
    >
      <!-- 刻度尺 -->
      <div
        class="operate_ruler"
        :style="{ width: rulerSizeNumber * 300 + 'px' }"
        @click="ruler_click($event)"
      >
        <div class="ruler_scale" v-for="index in rulerSizeNumber" :key="index">
          <i v-for="item in index < rulerSizeNumber ? 10 : 11" :key="item"></i>
          <span class="item_scale_time">{{
            (index - 1) | filters_ItemTimezone($store.state.currentItemTimezone)
          }}</span>
        </div>
      </div>

      <!-- 轨道区域 -->
      <div class="operate_track">
        <div
          :class="{
            operate_track_item: true,
            video_track: true,
            is_active: mouseDownFlag && $store.state.currentSidebarSign == '0',
          }"
        >
          视频轨道

          <vue-draggable-resizable
            :w="item.w"
            :h="60"
            :x="item.x"
            :min-height="60"
            @dragging="onDrag"
            @resizing="onResize"
            :handles="['ml', 'mr']"
            :parent="true"
            @activated="activatedSelect(item, index, '0')"
            class="video_track"
            v-for="(item, index) in videoTrackListData"
            :key="index"
          >
          </vue-draggable-resizable>
        </div>
        <div
          :class="{
            operate_track_item: true,
            is_active: mouseDownFlag && $store.state.currentSidebarSign == '1',
          }"
        >
          音频轨道
          <vue-draggable-resizable
            :w="item.w"
            :h="30"
            :x="item.x"
            :min-height="30"
            @dragging="onDrag"
            @resizing="onResize"
            :handles="['ml', 'mr']"
            :parent="true"
            @activated="activatedSelect(item, index, '1')"
            class="audio_track"
            v-for="(item, index) in audioTrackListData"
            :key="index"
          >
          </vue-draggable-resizable>
        </div>
        <div
          :class="{
            operate_track_item: true,
            is_active: mouseDownFlag && $store.state.currentSidebarSign == '2',
          }"
        >
          字幕轨道
        </div>
        <div
          :class="{
            operate_track_item: true,
            is_active: mouseDownFlag && $store.state.currentSidebarSign == '3',
          }"
        >
          图片轨道
        </div>
      </div>
    </div>
    <!-- 滚动的线 -->
    <vue-draggable-resizable
      :x="moveLine.x"
      :w="20"
      :h="400"
      axis="x"
      :parent="true"
      @dragging="lineOnDrag"
      :handles="[]"
      class="run_line_content"
    >
      <div class="iconfont icon-arrow-b_fill"></div>
      <div class="run_line"></div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
const { getItemTimezoneValue } = require("../tools/getItemTimezoneValue");
const {
  getCalculatorWidth,
  getPositionX,
} = require("../tools/calculatorWidth");

const { getTimeDuartion } = require("../tools/getTimeDuartion");
export default {
  data() {
    return {
      flag: false,
      rulerSizeNumber: 100,
      standard: 1, //该处为指定秒数，单位S   更改不同刻度  更换秒
      totalTimeSecond: 50,
      width: 0,
      height: 0,
      x: 15,
      y: 0,
      videoTrackListData: [],
      audioTrackListData: [],
      textTrackListData: [],
      pictureTrackListData: [],
      moveLine: {
        x: 10,
        currentTime: 0,
      },
    };
  },
  props: ["mouseDownFlag", "createTrackFlag", "positionX"],
  methods: {
    // 刻度尺点击事件
    ruler_click(e) {
      // 更新滚动线当前位置
      this.moveLine.x = e.x - 20;
    },
    // 轨道item选中触发
    activatedSelect(item, index, type) {
      item.type = type;
      item.index = index;
      this.$store.commit("updateActivatedSelect", item);
      this.flag = true;
    },
    onResize(x, y, w) {
      const activatedObj = this.$store.state.activedSelect;
      const index = activatedObj.index;
      // 更新数组中的x w值
      switch (activatedObj.type) {
        case "0":
          this.updateTrackWhenResizeFun(this.videoTrackListData, index, x, w);
          break;
        case "1":
          this.updateTrackWhenResizeFun(this.audioTrackListData, index, x, w);
          break;
        case "2":
          this.updateTrackWhenResizeFun(this.textTrackListData, index, x, w);
          break;
        case "3":
          this.updateTrackWhenResizeFun(this.pictureTrackListData, index, x, w);
          break;
        default:
          break;
      }
      this.MaxX();
    },
    // 轨道元素拖拽事件
    onDrag(x, y) {
      const activedSelect = this.$store.state.activedSelect;
      switch (activedSelect.type) {
        case "0":
          // 视频
          this.videoTrackListData[activedSelect.index].x = x;
          break;
        case "1":
          // 音频
          this.audioTrackListData[activedSelect.index].x = x;
          break;
        case "2":
          this.textTrackListData[activedSelect.index].x = x;
          // 字幕
          break;
        case "3":
          // 图片
          this.pictureTrackListData[activedSelect.index].x = x;
          break;
        default:
          break;
      }
      this.MaxX();
    },

    // 标线拖拽事件
    lineOnDrag(x) {
      if (x < 10) {
        return false;
      } else {
        this.moveLine.x = x - 10; //因为左侧会超出10px   故此处减去10 确保currentTime的值正确
      }
    },
    // 删除事件
    deleteEvent() {
      const activedSelect = this.$store.state.activedSelect;
      switch (activedSelect.type) {
        case "0":
          // 视频
          this.videoTrackListData.splice(activedSelect.index, 1);
          break;
        case "1":
          // 音频
          this.audioTrackListData.splice(activedSelect.index, 1);
          break;
        case "2":
          // 字幕
          this.textTrackListData.splice(activedSelect.index, 1);

          break;
        case "3":
          // 图片
          this.pictureTrackListData.splice(activedSelect.index, 1);
          break;
        default:
          break;
      }
    },

    // 改变轨道元素长短
    changeTrackPositionXAndWidth(newTimezoneValue, oldTimezoneVale) {
      const mediaListData = [
        this.videoTrackListData,
        this.audioTrackListData,
        this.textTrackListData,
        this.pictureTrackListData,
      ];
      mediaListData.forEach((arrItem) => {
        if (arrItem.length > 0) {
          arrItem.forEach((val) => {
            val.x = getPositionX(val.x, newTimezoneValue, oldTimezoneVale);
            val.w = getCalculatorWidth(val.timeDuartion, newTimezoneValue);
          });
        }
      });
    },

    // 拖拽时更新 数字下标的x w timeDuartion
    updateTrackWhenResizeFun(arr, index, x, w) {
      arr[index]["x"] = x;
      arr[index]["w"] = w;
      arr[index]["timeDuartion"] = getTimeDuartion(
        w,
        this.$store.state.currentItemTimezone
      );
    },

    // 更新最大x位置
    MaxX() {
      const arr = [
        this.videoTrackListData,
        this.audioTrackListData,
        this.textTrackListData,
        this.pictureTrackListData,
      ];
      let maxNumber = 0;
      arr.forEach((val) => {
        val.forEach((item) => {
          const number = item.x + item.w;
          console.log(number);
          if (number > maxNumber) {
            maxNumber = number;
          }
        });
      });
      this.$store.commit("updateMaxX", maxNumber);
      console.log(this.$store.state.maxX);
    },
  },
  watch: {
    // 刻度尺度变化改变
    "$store.state.currentItemTimezone"(val, old) {
      if (val) {
        this.changeTrackPositionXAndWidth(val, old);
      }
    },

    // 生成轨道
    createTrackFlag(val, old) {
      if (val) {
        // 生成轨道
        const currentTrackData = this.$store.state.currentSelectMedia;
        const timeStandard = this.$store.state.currentItemTimezone;
        const width = getCalculatorWidth(
          currentTrackData.timeDuration.timeDuration,
          timeStandard
        );
        const ListItem = {
          w: width,
          x: this.positionX - 20,
          timeDuartion: currentTrackData.timeDuration.timeDuration,
        };
        switch (currentTrackData.type) {
          case "0":
            // 生成视频
            this.$set(
              this.videoTrackListData,
              this.videoTrackListData.length,
              ListItem
            );
            this.$emit("changeCreateTrackFlag", false);
            break;
          case "1":
            // 生成音频
            this.$set(
              this.audioTrackListData,
              this.audioTrackListData.length,
              ListItem
            );
            this.$emit("changeCreateTrackFlag", false);
            break;
          case "2":
            // 生成字幕
            break;
          case "3":
            // 生成图片
            break;
          default:
            break;
        }

        // 更新最终位置
        const arr = [
          this.videoTrackListData,
          this.audioTrackListData,
          this.textTrackListData,
          this.pictureTrackListData,
        ];
        let maxNumber = 0;
        arr.forEach((val) => {
          val.forEach((item) => {
            const number = item.x + item.w;
            console.log(number);
            if (number > maxNumber) {
              maxNumber = number;
            }
          });
        });
        this.$store.commit("updateMaxX", maxNumber);
      }
    },
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus();
      },
    },
  },
  computed: {
    keymap() {
      return {
        // 'esc+ctrl' is OK.
        delete: this.deleteEvent,
      };
    },
    maxLeftPx() {
      const arr = [
        this.videoTrackListData,
        this.audioTrackListData,
        this.textTrackListData,
        this.pictureTrackListData,
      ];
      const everyItemarr = [];
      arr.forEach((val) => {
        val.forEach((item) => {
          everyItemarr.push();
        });
      });
    },
  },
  filters: {
    filters_ItemTimezone(val, currentItemTimezone) {
      return getItemTimezoneValue(val, currentItemTimezone);
    },
  },
};
</script>

<style lang="less">
.bottom_operate_container {
  position: relative;
  max-width: 1920px;
  overflow-y: auto;
  height: calc(100% - 500px);
  .run_line_content.vdr {
    border: none !important;
  }
  .run_line_content {
    z-index: 999;
    position: absolute;
    top: 0px;
    left: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    > div {
      width: 100%;
    }
    .icon-arrow-b_fill {
      color: #fff;
    }
    .run_line {
      width: 1px;
      background: #fff;
      height: 100%;
    }
  }
  .bottom_operate_area {
    // 刻度尺
    height: 100%;
    .operate_ruler {
      height: 50px;
      background: #34363b;
      box-sizing: border-box;
      padding: 10px 0 0 20px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: left;
      overflow: hidden;
      .ruler_scale {
        height: 40px;
        position: relative;
        width: 200px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        :nth-child(5n + 1) {
          height: 10px;
        }
        :nth-child(10n + 1) {
          height: 15px;
        }
        :nth-child(10) {
          height: 5px;
        }
        i {
          display: inline-block;
          width: 1px;
          background: #fafafa;
          height: 5px;
        }
        :first-child {
          margin-left: 0;
        }
        .item_scale_time {
          position: absolute;
          bottom: 0;
          left: 10px;
          color: #fafafa;
        }
      }
    }

    // 轨道
    .operate_track {
      overflow: hidden;
      height: calc(100% - 50px);
      background: #34363b;
      padding-left: 30px;
      .video_track {
        background: url("../assets/demo.png") repeat-x;
        background-size: 120px 60px;
      }
      .audio_track {
        background: url("../assets/audio-bg.png") repeat-x;
        background-size: 120px 60px;
      }
      .operate_track_item {
        background: #383a3f;
        height: 30px;
        margin: 30px 0;
        color: #ccc;
        display: flex;
        align-items: center;
        position: relative;
        .track_item_list {
          position: absolute;
          height: 100%;
          background: url("../assets/demo.png") repeat-x;
        }
      }
      .video_track {
        height: 60px;
      }

      .is_active {
        border: 2px solid orange;
      }
    }
  }
  .inputDel {
    border: none;
    position: fixed;
    left: 0;
    bottom: 20px;
    background: #34363b;
    &:focus {
      border: none;
      outline: none;
    }
  }
}
</style>