<template>
  <footer style="text-align: center;
">
    <img src="./assets/quick.png" alt />
    <div class="menu" style="background: #000;">
      <div class="controlMenu">
        <div @click="onControl(1)" class="iconfont icon-dadian" :title="clickmsg">
          <span>{{clickmsg}}</span>
        </div>
        <div @click="onControl(2)" class="iconfont icon-biaoji" title="标记">
          <span>标记</span>
        </div>
        <div
          @click="onControl(3)"
          class="iconfont icon-kaishijianji"
          title="快速选段"
          @keyup.83="onControl(3)"
        >
          <span>快速选段</span>
        </div>
        <div @click="onControl(4)" class="iconfont icon-zidong" title="自动选段">
          <span>自动选段</span>
        </div>
        <div class="contorlBtn">
          <el-button class="el-icon-success" size="mini" @click="serveSubmit('00')">分段提交</el-button>
          <el-button class="iconfont icon-tuisong" size="mini" @click="serveSubmit('01')">合并提交</el-button>
        </div>
      </div>
      <div class="videoContorl">
        <div class="timeLong">
          <em>总时长：</em>
          <span>{{videoLongTime}}</span>
        </div>
        <i class="iconfont icon-kuaijin-1" @click="prevPage"></i>
        <i class="iconfont icon-bofang" @click="play" v-if="bofangFlag"></i>
        <i class="icon-bofang1 iconfont" @click="stop" v-else></i>
        <i class="iconfont icon-kuaijin-" @click="nextpage"></i>
      </div>
      <div class="rule">
        <span class="iconfont icon-fanxuan" title="反选" @click="turnReserve"></span>
        <span class="iconfont icon-qingchu" title="删除所有拆条" @click="clearAllVideo"></span>
        <div class="block">
          <el-slider v-model="value2" :step="20" show-stops @change="stepChange"></el-slider>
        </div>
      </div>
    </div>
    <div class="controlLine">
      <div class="signshowImg" v-if="signFlag" :style="`left:${signLeft}`">
        <span class="signDetail icon-qingchu iconfont" @click="signDelete"></span>
        <span class="signClose icon-chuyidong iconfont" @click="signFlag = false"></span>
        <!-- <img src="../../../assets/img/pic1.jpg" alt /> -->
        <div class="icon-xiugai iconfont text" @click="changeSignText">{{signText}}</div>
      </div>
      <div class="dyc" id="pickeddeng">
        <div class="canFa">
          <canvas id="canvas" :width="canvasWidth" height="80" @mousemove="showMoveImg"></canvas>
          <div
            class="signcircle"
            v-for="(item,index) in makeSignList"
            :key="index"
            :style="`left:${item.left}`"
            @click="signClick(item,index)"
          ></div>
          <div class="blueBg" id="blueBg" ref="timeMove">
            {{timeCurrentLeft}}
            <span class="turnDowm"></span>
          </div>
        </div>
        <div
          class="imgbackground"
          id="imgbackground"
          :style="`width:${imgWidth};background:url(${mainImgUrl})`"
        >
          <div
            class="coverlist"
            v-for="(item,index) in cutCoverList"
            :key="index"
            :style="`width:${item.width};left:${item.left}`"
            @mousemove="changeCoverSize(index)"
          >
            <span
              class="dragLeft icon-zuo iconfont"
              @mousedown="dragLeft(index,$event)"
              @mousemove="dragLeftMove(index,$event)"
              @mouseup="dragLeftUp(index,$event)"
            ></span>

            <div>
              <span class="icon-bofang iconfont" @click="subSection(item)"></span>
              <span class="icon-qingchu iconfont" @click="clearCoverBox(index)"></span>
              <div>{{item.timeLong}}</div>
              <div class="icon-xiugai iconfont" @click="changeText(index)">{{item.text}}</div>
            </div>
            <span
              class="dragRight icon-you iconfont"
              @mousedown="dragRight(index,$event)"
              @mousemove="dragRightMove(index,$event)"
              @mouseup="dragRightUp(index,$event)"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="拆条设置"
      :visible.sync="dialogVisibleAuto"
      width="600"
      append-to-body
      class="autuSplice"
    >
      <el-radio-group v-model="radio">
        <el-radio :label="1">自定义拆条</el-radio>
        <el-radio :label="2">平均拆条</el-radio>
      </el-radio-group>
      <el-table :data="tableData" style="width: 100%" v-if="radio==1">
        <el-table-column type="index" label="拆条列表" width="200" align="center"></el-table-column>
        <el-table-column prop="timeLong" label="时长" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
            >移除</el-button>
            <el-button
              @click.native.prevent="addRow(scope.$index, tableData)"
              type="text"
              size="small"
            >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="round" v-else>
        <span>每段时长</span>
        <el-input-number
          v-model="autoNum"
          :min="1"
          :max="60"
          label="设置平均拆条时间"
          controls-position="right"
        ></el-input-number>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAuto = false">取 消</el-button>
        <el-button type="primary" @click="autuEnsure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="spliceMsg" :visible.sync="dialogVisible" width="600" append-to-body>
      <el-table :data="cutCoverList" style="width: 100%">
        <el-table-column label="名称" align="center" show-overflow-tooltip prop="text"></el-table-column>
        <el-table-column label="开始时间" align="center" show-overflow-tooltip prop="startTime"></el-table-column>
        <el-table-column label="结束时间" align="center" show-overflow-tooltip prop="endTime"></el-table-column>
        <el-table-column label="分段时长" align="center" show-overflow-tooltip prop="timeLong"></el-table-column>
        <el-table-column label="修改" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelt(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="entureChaitiao">确 定</el-button>
      </span>
    </el-dialog>
    <div>author:pickeddeng-qq780602604-wechat:deng9466_____THANKS</div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          timeLong: "3秒"
        },
        {
          timeLong: "4秒"
        }
      ],
      autoNum: 5,
      ctNum: 0, //剪辑的视频段落数量
      isCtData: false, //是否已剪辑了视频
      isVideoData: false, //是否已添加视频文件
      dialogVisible: false, //弹框显示隐藏

      // 自动拆条
      dialogVisibleAuto: false, //拆条flag
      radio: 1,

      videoList: null, //视频列表
      // dialogVisible: false,
      //   底部dyc
      topMoveBox: null, //移动的蓝色时间盒子
      number: 5, //刻度对应秒数
      maxTimeLong: 360000, //除以10 即为刻度尺 个 刻度
      videoLongTime: "00:00:00",
      value2: 80, //选择刻度尺刻度大小
      canvas: null,
      canvasWidth: 60000,
      cxt: null,
      clickmsg: "打入点", //打入打出
      config: {},
      timeCurrentLeft: "00:00:00:00", //当前距离左侧时间
      clickCurrentTime: null, //点击距离

      timeId: null, //计算定时器
      clickIn: null, //打入定时器
      scrollId: null, //滚动定时器
      subTimeId: null, //分段播放移动计时器

      moveLeft: -40, //移动中bgleft坐标
      cutCoverList: [], //裁剪列表
      makeSignList: [], //标记列表
      coverBoxWidth: "0px",
      clickCurrentLeft: null, //点击打入时，距离左侧位置
      videoLong: 600,
      imgWidth: "0px", //图片的宽度
      pickeddeng: null,
      bofangFlag: true, //播放flag
      signFlag: false, //标记flag
      target: 1400, //目标位置
      // 盒子拖拽部分
      downFlag: false, //按下的标志
      offsetStart: null,
      offsetEnd: null,
      currentRunMsg: "run",
      signIndex: null, //当前点击标记的index
      signLeft: "0px",
      signText: "标记1",

      // 快速选段
      quickChoseTime: 6,

      mainImgUrl: "", //底部封面图
      mainFlag: true, //是否选择了视频
      numberFlag: "00", //00 拆分  01合并
      spliceMsg: "拆分提交"
    };
  },
  created() {
    //收视频时长
    this.Event.$on("allTime", data => {
      // console.log(data);
      this.videoLongTime = this.setTime(data);
      // this.canvasWidth = parseInt(this.imgWidth);
      this.videoLong = data;
      this.maxTimeLong = Math.ceil(data) * 100;
      this.imgWidth = (this.videoLong / this.number) * 100 + "px";
    });
    document.addEventListener("keydown", this.keyboardEvent);
  },
  mounted() {
    // 获取时间

    var canvas = document.getElementById("canvas");
    this.canvas = canvas;
    var cxt = canvas.getContext("2d");
    cxt.fillStyle = "#fff";
    this.cxt = cxt;
    var config = {
      height: 200,
      width: this.canvasWidth,
      // 刻度尺相关
      start: "00:00:00",
      end: "00:20:10",
      size: 300, // 刻度尺总刻度数
      // unit:10,
      x: 20, // 刻度尺x坐标位置
      y: 70, // 刻度尺y坐标位置
      w: 10, // 刻度线的间隔
      h: 10, // 刻度线基础长度

      // 事件相关
      mousedown: false
      // start: []
    };
    this.config = config;
    // this.config.width = this.canvasWidth
    this.showCanvas();
    // console.log(this.setTime(600));
    const timeMove = document.getElementsByClassName("blueBg")[0];
    this.topMoveBox = timeMove;
    // console.log(timeMove,timeMove.style.left)
    timeMove.style.left = "-40px";

    // 设置图片盒子宽度
    this.imgWidth = (this.videoLong / this.number) * 100 + "px";
    this.pickeddeng = document.getElementById("pickeddeng");
    this.pickeddeng.addEventListener("scroll", this.handleScroll, true);

    //选择视频
    this.Event.$on("chooseVideo", value => {
      this.cutCoverList = [];
      this.topMoveBox.style.left = "-40px";
      this.mainImgUrl = this.Global.imgLink + value.filePrintscreen;
      this.mainFlag = true;
    });

    // 快速选段改变
    this.Event.$on("quickChooseTime", val => {
      this.quickChoseTime = val;
    });
  },
  methods: {
    //快捷键
    keyboardEvent() {
      // console.log(event);
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e.keyCode == 122) {
        e.preventDefault(); //阻止F11的全屏事件
      } else if (e.keyCode == 83) {
        //S键
        this.onControl(3);
      } else if (e.keyCode == 27) {
        //Esc键
        this.isfullScreen = false;
      } else if (e.keyCode == 32) {
        //space空格键
        if (this.bofangFlag) {
          this.play();
        } else {
          this.stop();
        }
      } else if (e.ctrlKey && e.keyCode == 77) {
        // console.log('ctrl+m');打标记
        this.onControl(2);
      } else if (e.keyCode == 40) {
        // 打入点打出点
        this.timeMove();
        this.clickmsg = this.clickmsg == "打入点" ? "打出点" : "打入点";
      } else if (e.keyCode == 35) {
        //end
        this.backToend();
      } else if (e.keyCode == 46) {
        //清空拆条
        this.clearAllVideo();
      } else if (e.keyCode == 37) {
        //←
        // console.log('←');
        // 上一帧
        this.prevPage();
      } else if (e.keyCode == 39) {
        //→
        // console.log('→');
        // 下一帧
        this.nextpage();
      } else if (e.ctrlKey && e.keyCode == 189) {
        //ctrl + -
        e.preventDefault(); //阻止浏览器默认行为
        // console.log('ctrl + -');
        if (this.value2 == 0) {
          this.$message.error("不能再减了~");
          return;
        }
        this.value2 -= 20;
        this.stepChange();
      } else if (e.ctrlKey && e.keyCode == 187) {
        //ctrl + +
        e.preventDefault(); //阻止浏览器默认行为
        // console.log('ctrl + +');
        if (this.value2 == 100) {
          this.$message.error("不能再加了~");
          return;
        }
        this.value2 += 20;
        this.stepChange();
      } else if (e.keyCode == 36) {
        //Home
        // console.log("Home");
        this.backTostart();
      }
    },
    //鼠标悬浮显示当前图片
    showMoveImg($event) {
      var currentTime = this.setDetailTime(
        ($event.offsetX - 20) * (this.number / 100)
      );
      this.Event.$emit("currentImg", currentTime);
      // console.log($event)
    },
    //反选
    turnReserve() {
      if (this.cutCoverList.length > 0) {
        var turnReverse = []; //反选数组列表
        for (var i = 1; i < this.cutCoverList.length; i++) {
          var prev = this.cutCoverList[i - 1];
          var current = this.cutCoverList[i];
          // if (i >= 1) {
          //   prev = this.cutCoverList[i - 1];
          // } else {
          //   prev = {
          //     left:
          //   }
          // }
          var prevRight = parseFloat(prev.left) + parseFloat(prev.width);
          var currentWidth = parseFloat(current.left) - prevRight;
          turnReverse.push({
            left: prevRight + "px",
            width: currentWidth + "px",
            clickFlag: true,
            text: "拆条" + i,
            startTime: this.getStartEndTime(prevRight),
            endTime: this.getStartEndTime(currentWidth + prevRight),
            timeLong: this.getStartEndTime(currentWidth)
          });
          console.log(turnReverse);
        }
        if (parseFloat(this.cutCoverList[0].left) >= (100 / this.number) * 3) {
          //说明从一开始就开始打点 并且大于3秒
          turnReverse.unshift({
            left: "0px",
            width: this.cutCoverList[0].left,
            startTime: "00:00:00.00",
            endTime: this.getStartEndTime(
              parseFloat(this.cutCoverList[0].left)
            ),
            timeLong: this.getStartEndTime(
              parseFloat(this.cutCoverList[0].left)
            ),
            text: "第一条"
          });
        }
        var last = this.cutCoverList[this.cutCoverList.length - 1];
        if (
          parseFloat(last.left) + parseFloat(last.width) <=
          parseFloat(this.imgWidth) - (100 / this.number) * 3
        ) {
          turnReverse.push({
            left: parseFloat(last.left) + parseFloat(last.width) + "px",
            width:
              parseFloat(this.imgWidth) -
              (parseFloat(last.left) + parseFloat(last.width)) +
              "px",
            startTime: this.getStartEndTime(
              parseFloat(last.left) + parseFloat(last.width)
            ),
            endTime: this.getStartEndTime(
              parseFloat(last.left) +
                parseFloat(last.width) +
                parseFloat(this.imgWidth) -
                (parseFloat(last.left) + parseFloat(last.width))
            ),
            timeLong: this.getStartEndTime(
              parseFloat(this.imgWidth) -
                (parseFloat(last.left) + parseFloat(last.width))
            ),
            text: "最后一条"
          });
        }
        this.cutCoverList = turnReverse;
      } else {
        this.$message("还没有进行拆条");
      }
    },
    //清除所有拆条
    clearAllVideo() {
      this.$confirm("是否删除所有拆条?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.cutCoverList = [];
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    addRow(index, rows) {
      this.$prompt("请输拆条时长（总秒数）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: "请输入数字"
      })
        .then(({ value }) => {
          rows.splice(index + 1, 0, {
            timeLong: value + "秒"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },

    signDelete() {
      this.$confirm("是否删除标记?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.makeSignList.splice(this.index, 1);
          this.signFlag = false;
          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      // this.signLeft = this.makeSignList[index-1].left
    },
    signClick(item, index) {
      console.log(item);
      this.signText = item.text;
      this.signIndex = index;
      this.signLeft = item.left;
      this.signFlag = true;
    },
    // 修改分段标题
    handleEdit(index, row) {
      this.changeText(index);
    },
    handleDelt(index, row) {
      this.cutCoverList.splice(index, 1);
    },
    // 分段播放
    subSection(value) {
      this.Event.$emit("subSectionPlay", value);
      this.topMoveBox.style.left = parseFloat(value.left) - 40 + "px";
      this.subrunning(parseFloat(value.left) + parseFloat(value.width));
    },

    // 黄色盒子宽高

    // 鼠标按下
    dragLeft(index, $event) {
      this.downFlag = true;
      this.offsetStart = $event.offsetX;
    },
    dragRight(index, $event) {
      this.downFlag = true;
      this.offsetStart = $event.offsetX;
    },

    // 鼠标移动
    dragLeftMove(index, $event) {
      if (this.downFlag) {
        this.setLeftAndStart(index, $event);
      } else {
        return;
      }
    },
    dragRightMove(index, $event) {
      if (this.downFlag) {
        this.setWidthAndEnd(index, $event);
      } else {
        return;
      }
    },
    // 鼠标抬起
    dragLeftUp(index, $event) {
      this.downFlag = false;
      this.setLeftAndStart(index, $event);
    },
    dragRightUp(index, $event) {
      this.downFlag = false;
      this.setWidthAndEnd(index, $event);
    },

    // 设置宽及左侧距离变换起始时间
    setWidthAndEnd(index, $event) {
      var currentBox = this.cutCoverList[index];
      var width = parseFloat(currentBox.width);
      var finwidth = width + ($event.offsetX - this.offsetStart);
      currentBox.width = finwidth + "px";
      currentBox.endTime = this.getStartEndTime(
        parseFloat(currentBox.left) + parseFloat(currentBox.width)
      );
      currentBox.timeLong = this.getTimeBesides(
        currentBox.startTime,
        currentBox.endTime
      );
    },
    setLeftAndStart(index, $event) {
      var currentBox = this.cutCoverList[index];
      var left = parseFloat(currentBox.left);
      var finleft = left + ($event.offsetX - this.offsetStart);
      currentBox.left = finleft + "px";
      currentBox.startTime = this.getStartEndTime(parseFloat(currentBox.left));
    },
    // 修改标记名称
    changeSignText(index) {
      this.$prompt("请输入标记标题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.makeSignList[this.signIndex].text = value;
          this.signText = value;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 修改片段名称
    changeText(index) {
      this.$prompt("请输入拆条标题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.cutCoverList[index].text = value;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 删除单个覆盖盒子
    clearCoverBox(index) {
      this.cutCoverList.splice(index, 1);
    },
    // 重新设置target
    resetTarget($event) {
      // clearInterval(this.timeId);
      // clearInterval(this.clickIn);
      // this.target += 1400;
      // var scrollpd = document.getElementById("pickeddeng");
      // this.scrollId = setInterval(() => {
      //   console.log("scroll");
      //   scrollpd.scrollLeft = parseFloat(this.moveLeft) - 1400;
      // }, 20);
      // this.clickIninterval();
    },
    // pickeddeng

    // 播放
    play() {
      if (this.currentRunMsg == "clickIn") {
        this.running();
        return;
      }
      this.currentRunMsg = "run";
      this.running();
    },
    running() {
      // clearInterval(this.clickIn);
      if (!this.mainFlag) {
        this.$message.error("您还没有选择视频~");
        return;
      }
      this.bofangFlag = false;
      this.Event.$emit("paly", true); //播放视频
      if (this.currentRunMsg == "clickIn") {
        this.clickIninterval();
        return;
      }
      const timeMove = document.getElementsByClassName("blueBg")[0];
      var target = this.target;
      timeMove.style.left = target + "px";

      this.timeId = setInterval(() => {
        console.log("running");
        this.moveLeft = window.getComputedStyle(timeMove).left;
        if (parseFloat(this.moveLeft) + 40 > parseFloat(this.imgWidth)) {
          clearInterval(this.timeId);
          timeMove.style.left = this.moveLeft;
          this.stop();
          timeMove.style.transition = "none";
        }
        if (parseInt(this.moveLeft) >= target) {
          this.scrollInterval();
        }
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );
      }, 20);
      var pxecachS = this.number / 100; // 对应的每px所需要的秒
      // console.log(parseInt(target), parseInt(this.moveLeft), pxecachS);
      var timeCount = (parseInt(target) - parseInt(this.moveLeft)) * pxecachS;
      // console.log(timeCount);
      timeMove.style.transition = `all ${timeCount}s linear`;
    },
    subrunning(target) {
      this.stop();
      this.bofangFlag = false;
      const timeMove = document.getElementsByClassName("blueBg")[0];
      timeMove.style.left = target + "px";
      this.Event.$emit("paly", true); //播放视频
      this.subTimeId = setInterval(() => {
        console.log("subrunning");
        this.moveLeft = window.getComputedStyle(timeMove).left;
        if (parseFloat(this.moveLeft) + 40 > target) {
          clearInterval(this.subTimeId);
          timeMove.style.left = this.moveLeft;
          this.stop();
          timeMove.style.transition = "none";
        }
        if (parseInt(this.moveLeft) >= target) {
          this.resetTarget();
        }
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );
      }, 20);
      var pxecachS = this.number / 100; // 对应的每px所需要的秒
      // console.log(parseInt(target), parseInt(this.moveLeft), pxecachS);
      var timeCount = (parseInt(target) - parseInt(this.moveLeft)) * pxecachS;
      // console.log(timeCount);
      timeMove.style.transition = `all ${timeCount}s linear`;
    },
    // 暂停
    stop() {
      this.Event.$emit("paly", false); //暂停视频
      this.bofangFlag = true;
      this.zanting();
      // clearInterval(this.timeId);
      // clearInterval(this.clickIn);
      clearInterval(this.scrollId);
      clearInterval(this.scrollId);
      clearInterval(this.scrollId);
    },
    // 停止动画
    zanting() {
      const timeMove = document.getElementsByClassName("blueBg")[0];
      this.moveLeft = window.getComputedStyle(timeMove).left;
      timeMove.style.left = this.moveLeft;
      timeMove.style.transition = `none`;
      clearInterval(this.scrollId);
      switch (this.currentRunMsg) {
        case "clickIn":
          clearInterval(this.clickIn);
          break;
        case "run":
          clearInterval(this.timeId);
          break;
        default:
          clearInterval(this.timeId);
          clearInterval(this.clickIn);
          break;
      }
    },
    prevPage() {
      // 上一帧
      this.stop();
      const timeMove = document.getElementById("blueBg");
      var movePX = (100 / this.number / 100) * 10;
      var currentLeft = parseFloat(window.getComputedStyle(timeMove).left);
      var fininal = currentLeft - movePX;
      timeMove.style.left = fininal + "px";
      this.timeCurrentLeft = this.getStartEndTime(fininal + 40);
      this.Event.$emit("prevNext", this.timeCurrentLeft); //触发上一帧下一帧
    },

    nextpage() {
      // 下一帧
      this.stop();
      const timeMove = document.getElementById("blueBg");
      var movePX = (100 / this.number / 100) * 10;
      var currentLeft = parseFloat(window.getComputedStyle(timeMove).left);
      var fininal = currentLeft + movePX;
      timeMove.style.left = fininal + "px";
      this.timeCurrentLeft = this.getStartEndTime(fininal + 40);
      this.Event.$emit("prevNext", this.timeCurrentLeft);
    },
    // 改变覆盖盒子大小
    changeCoverSize(index) {},
    // 打入计时器
    clickIninterval() {
      if (!this.mainFlag) {
        this.$message.error("您还没有选择视频~");
        return;
      }
      if (this.currentRunMsg == "run") {
        clearInterval(this.timeId);
      }
      this.currentRunMsg = "clickIn";
      const timeMove = document.getElementsByClassName("blueBg")[0];
      var target = this.target;
      this.clickIn = setInterval(() => {
        console.log("clickIn");
        this.moveLeft = window.getComputedStyle(timeMove).left;

        if (parseFloat(this.moveLeft) + 40 > parseFloat(this.imgWidth)) {
          clearInterval(this.clickIn);
          this.timeMove();
          this.clickmsg = "打入点";
          timeMove.style.left = this.moveLeft;
          this.stop();
          timeMove.style.transition = "none";
        }
        if (parseInt(this.moveLeft) >= this.target) {
          this.scrollInterval();
        }
        if (this.cutCoverList.length > 0) {
          var current = this.cutCoverList[this.cutCoverList.length - 1];
          var coverBoxWidth =
            parseFloat(this.moveLeft) - parseFloat(this.clickCurrentLeft + 40);

          current.width = coverBoxWidth + "px";
          current.timeLong = this.getStartEndTime(coverBoxWidth);
        }

        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );
      }, 10);
      var pxecachS = this.number / 100; // 对应的每px所需要的秒
      // console.log(parseInt(target), parseInt(this.moveLeft), pxecachS);
      var timeCount = (parseInt(target) - parseInt(this.moveLeft)) * pxecachS;
      // console.log(timeCount);
      timeMove.style.left = target + "px";
      timeMove.style.transition = `all ${timeCount}s linear`;
    },
    // 滚动计时器
    scrollInterval() {
      clearInterval(this.timeId);
      clearInterval(this.clickIn);
      this.running();
      this.target += 1400;
      var scrollpd = document.getElementById("pickeddeng");
      this.scrollId = setInterval(() => {
        console.log("scroll");
        scrollpd.scrollLeft = parseFloat(this.moveLeft) - 1400;
      }, 20);
    },

    //改变刻度
    stepChange() {
      // 鼠标松开时触发
      // console.log(this.value2);
      var number = this.number;
      switch (this.value2) {
        case 0:
          this.number = 600;
          break;
        case 20:
          this.number = 120;
          break;
        case 40:
          this.number = 30;
          break;
        case 60:
          this.number = 10;
          break;
        case 80:
          this.number = 5;
          break;
        case 100:
          this.number = 1;
          break;
        default:
          break;
      }
      // console.log(this.number);
      for (var i = 0; i < this.cutCoverList.length; i++) {
        this.cutCoverList[i].left =
          parseFloat(
            (number * parseFloat(this.cutCoverList[i].left)) / this.number
          ) + "px";
        this.cutCoverList[i].width =
          parseFloat(
            (number * parseFloat(this.cutCoverList[i].width)) / this.number
          ) + "px";
      }
      this.showCanvas();
      this.imgWidth = (this.videoLong / this.number) * 100 + "px";
    },
    // 获取总秒树
    getCountS(time) {
      var hour = time.split(":")[0];
      var min = time.split(":")[1];
      var s = time.split(".")[0].split(":")[2];
      var ms = time.split(".")[1];
      return parseFloat(
        parseInt(hour) * 3600 + parseInt(min * 60) + s + "." + ms
      );
    },
    showCanvas() {
      var that = this;

      this.drawCan(this.cxt, this.config, that.number);

      // 鼠标按下时 记录状态及位置
      this.canvas.addEventListener("dblclick", function(e) {
        var scrollpd = document.getElementById("pickeddeng");
        var scrollLeft = scrollpd.scrollLeft;

        if (e.offsetX > parseInt(scrollLeft) + 1400) {
          that.$message.error("超过最大位置，请选择左侧位置~");
          return;
        }
        that.zanting();
        that.clickCurrentTime = e.offsetX;
        var timeMove = document.getElementById("blueBg");
        timeMove.style.left = e.offsetX - 60 + "px";

        that.timeCurrentLeft = that.setDetailTime(
          parseFloat(
            Math.floor((that.number / 100) * (timeMove.offsetLeft + 40) * 100) /
              100
          ).toFixed(2)
        );

        that.config.mousedown = true;
        that.config.start = [e.offsetX, e.offsetY];
        that.bofangFlag = true;
        that.Event.$emit("currentTime", that.timeCurrentLeft);
        // console.log(e.offsetX, e.offsetY)
      });
      // 鼠标放开时 重置状态
      this.canvas.addEventListener("mouseup", function(e) {
        that.config.mousedown = false;
        that.config.x += e.offsetX - that.config.start[0];
        // console.log(that.config.x);
        if (that.config.x > 10) {
          that.config.x = 20;
          that.drawCan(that.cxt, that.config, that.number);
        }
      });
      // 鼠标划出canvas时 重置状态
      this.canvas.addEventListener("mouseout", function(e) {
        that.config.mousedown = false;
      });
      // 鼠标移动时 改变位置
      // this.canvas.addEventListener("mousemove", function(e) {
      //   // 如果鼠标左键被按下 可以拖动
      //   if (that.config.mousedown) {
      //     that.config.x += e.offsetX - that.config.start[0];
      //     console.log(e.offsetY);
      //     that.config.start = [e.offsetX, e.offsetY];
      //     that.drawCan(that.cxt, that.config, that.number);
      //   }
      // });
    },
    drawCan(cxt, config, number) {
      var size = 36000; //size/10则生成多少个刻度
      var x = config.x || 0;
      var y = config.y || 0;
      var w = config.w || 5;
      var h = config.h || 10;
      var offset = 3; // 上面数字的偏移量
      // 画之前清空画布
      cxt.clearRect(0, 0, config.width, config.height);
      // 设置画笔属性
      cxt.strokeStyle = "#fff";
      cxt.lineWidth = 1;
      cxt.font = 12;
      // console.log(size);
      for (var i = 0; i <= size; i++) {
        // 开始一条路径
        cxt.beginPath();
        // 移动到指定位置
        cxt.moveTo(x + i * w, y);
        // 满10刻度时刻度线长一些 并且在上方表明刻度
        if (i % 10 == 0 && this.number == 1) {
          // 区间为 1 s
          offset = 20;
          cxt.fillText(this.setTime(i / 10), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }

        if (i % 10 == 0 && this.number == 5) {
          // 区间为 5 s
          offset = 20;
          cxt.fillText(this.setTime(i / 2), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 10) {
          // 区间为 10 s
          offset = 20;
          // console.log(i * number, x + i * w - offset, y - h * 2.5)
          // 按照第一个参数递增
          cxt.fillText(this.setTime(i), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 30) {
          // 区间为 30 s
          offset = 20;
          cxt.fillText(this.setTime(i * 3), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 120) {
          // 区间为 120 s
          offset = 20;
          cxt.fillText(this.setTime(i * 12), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 == 0 && this.number == 600) {
          // 区间为 600 s
          offset = 20;
          cxt.fillText(this.setTime(i * 60), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        } else {
          // 满5刻度时的刻度线略长于1刻度的
          cxt.lineTo(x + i * w, y - (i % 5 === 0 ? 1.5 : 1) * h);
        }

        // 画出路径
        cxt.stroke();
      }
      // var myj=0
      // for(var i=0;i<this.maxTimeLong;i+=this.number){
      //   myj++;
      //   cxt.fillText(i, x + i * w - offset,45);
      //   console.log(i, x + i * w - offset,45)
      // }

      // if (i % 10 == 0) {
      //   // 计算偏移量
      //   offset = 20;
      //   // console.log(i/10)
      //   // offset = (String(i / 10).length * 6) / 2;
      //   // console.log(cxt.fillText(i / 10, x + i * w - offset, y - h * 2.5))
      //   // cxt.fillText(i / 10, x + i * w - offset, y - h * 2.5);
      //   // cxt.fillText("00:00:23", x + i * w - offset, y - h * 2.5)
      //   cxt.lineTo(x + i * w, y - h * 2);
      // } else {
      //   // 满5刻度时的刻度线略长于1刻度的
      //   cxt.lineTo(x + i * w, y - (i % 5 === 0 ? 1.5 : 1) * h);
      // }
    },
    setTime(time) {
      var secondTime = parseInt(time); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? String("0" + hourTime) : hourTime;
      minuteTime = minuteTime < 10 ? String("0" + minuteTime) : minuteTime;
      secondTime = secondTime < 10 ? String("0" + secondTime) : secondTime;
      return hourTime + ":" + minuteTime + ":" + secondTime;
    },
    setDetailTime(time) {
      var detail = null;
      if (time % 1 == 0) {
        detail = "00";
      } else {
        detail = String(parseFloat(parseInt(time * 100) / 100)).split(".")[1]; // 秒
      }
      if (String(detail).length == 1) {
        detail = String(detail + "0");
      }
      var secondTime = parseInt(time); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime >= 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime >= 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? String("0" + hourTime) : hourTime;
      minuteTime = minuteTime < 10 ? String("0" + minuteTime) : minuteTime;
      secondTime = secondTime < 10 ? String("0" + secondTime) : secondTime;
      return hourTime + ":" + minuteTime + ":" + secondTime + "." + detail;
    },
    timeMove() {
      const timeMove = document.getElementsByClassName("blueBg")[0];

      if (this.clickmsg == "打出点") {
        // 添加结束时间
        var currentBox = this.cutCoverList[this.cutCoverList.length - 1];
        var start = this.getCountS(currentBox.startTime);
        var end = this.getCountS(
          this.getStartEndTime(
            parseFloat(currentBox.left) + parseFloat(currentBox.width)
          )
        );
        if (end - start < 3) {
          this.$message.error("最短剪辑3秒");
          this.clickmsg = "打入点";
          return;
        }
        currentBox.endTime = this.getStartEndTime(
          parseFloat(currentBox.left) + parseFloat(currentBox.width)
        );

        clearInterval(this.clickIn);
        this.currentRunMsg = "run";
        this.running();
        // this.timeId = setInterval(() => {
        //   this.moveLeft = window.getComputedStyle(timeMove).left;
        //   this.timeCurrentLeft = this.setDetailTime(
        //     parseFloat(
        //       Math.floor(
        //         (this.number / 100) * (timeMove.offsetLeft + 40) * 100
        //       ) / 100
        //     ).toFixed(2)
        //   );
        //   this.coverBoxWidth =parseFloat(this.moveLeft) - parseFloat(this.clickCurrentLeft);
        // }, 10);
      } else if (this.clickmsg == "打入点") {
        // this.bofangFlag = false;
        clearInterval(this.timeId);
        this.currentRunMsg = "clickIn";
        this.running();
        // return;
        var target = this.target;
        this.clickCurrentLeft = window.getComputedStyle(timeMove).left;
        // console.log(this.clickCurrentLeft)
        // 添加覆盖盒子
        this.$set(this.cutCoverList, this.cutCoverList.length, {
          clickFlag: true,
          text: "拆条" + parseInt(parseInt(this.cutCoverList.length) + 1),
          left: parseFloat(this.clickCurrentLeft) + 40 + "px",
          width: "0px",
          startTime: this.getStartEndTime(
            parseFloat(this.clickCurrentLeft) + 40
          )
        });
        // clearInterval(this.timeId);
        // this.clickIninterval();
      }
    },
    // 点击控制线控件
    onControl(index) {
      switch (index) {
        case 1: //打入点
          this.timeMove();
          this.clickmsg = this.clickmsg == "打入点" ? "打出点" : "打入点";
          break;
        case 2: //标记
          // this.makeSignLis
          // const timeMove
          this.$set(this.makeSignList, this.makeSignList.length, {
            time: this.timeCurrentLeft,
            text: "标记" + this.makeSignList.length + 1,
            left: String(parseFloat(this.moveLeft) + 58) + "px"
          });
          break;
        case 3: //快速选段
          const moveLeft = document.getElementById("blueBg");
          this.moveLeft = window.getComputedStyle(moveLeft).left;
          console.log(this.moveLeft);
          var width = (this.quickChoseTime / this.number) * 100 + "px";
          this.$set(this.cutCoverList, this.cutCoverList.length, {
            clickFlag: true,
            text: "片段" + parseInt(parseInt(this.cutCoverList.length) + 1),
            left: parseFloat(this.moveLeft) + 40 + "px",
            width: width,
            startTime: this.getStartEndTime(parseFloat(this.moveLeft) + 40),
            endTime: this.getStartEndTime(
              parseFloat(this.moveLeft) + 40 + parseFloat(width)
            ),
            timeLong: this.getStartEndTime(parseFloat(width))
          });
          moveLeft.style.left =
            parseFloat(this.moveLeft) + parseFloat(width) + "px";
          // 设置当前时间
          this.timeCurrentLeft = this.setDetailTime(
            parseFloat(
              Math.floor(
                (this.number / 100) * (moveLeft.offsetLeft + 40) * 100
              ) / 100
            ).toFixed(2)
          );
          break;
        case 4: //自动选段
          this.dialogVisibleAuto = true;
          break;
      }
    },
    getStartEndTime(leftPX) {
      return this.setDetailTime(
        parseFloat(
          Math.floor((this.number / 100) * leftPX * 100) / 100
        ).toFixed(2)
      );
    },
    // 自动拆条的确认
    autuEnsure() {
      var timeMove = document.getElementById("blueBg");
      var left = parseFloat(window.getComputedStyle(timeMove).left) + 40;
      if (this.radio == 1) {
        //自定义拆条
        var timeLong = [];
        for (var i = 0; i < this.tableData.length; i++) {
          timeLong.push(parseInt(this.tableData[i].timeLong));
        }
        var setAutoList = [];
        for (var i = 0; i < timeLong.length; i++) {
          var prev = null;
          if (i - 1 >= 0) {
            prev = setAutoList[i - 1];
          } else {
            prev = {
              left: left + "px",
              width: "0",
              clickFlag: true,
              text: "片段" + (i + 1),
              startTime: "00:00:00.00",
              endTime: "00:00:00.00",
              timeLong: "00:00:00.00"
            };
          }

          var width = (timeLong[i] / this.number) * 100 + "px";
          var left = parseFloat(prev.left) + parseFloat(prev.width) + "px";
          setAutoList.push({
            left,
            width,
            clickFlag: true,
            text:
              "片段" +
              parseInt(
                parseInt(this.cutCoverList.length) + setAutoList.length + 1
              ),
            startTime: this.getStartEndTime(parseFloat(left)),
            endTime: this.getStartEndTime(parseFloat(left)) + parseFloat(width),
            timeLong: this.getStartEndTime(parseFloat(width))
          });
        }
        console.log(setAutoList);
        for (var i = 0; i < setAutoList.length; i++) {
          this.$set(
            this.cutCoverList,
            this.cutCoverList.length,
            setAutoList[i]
          );
        }
        this.dialogVisibleAuto = false;
      } else {
        // 平均拆条
        // this.imgWidth //下面图片宽度
        var autoWidth = (this.autoNum / this.number) * 100;
        var maxNumber = Math.floor(parseFloat(this.imgWidth) / autoWidth);
        var setAutoList = [];
        for (var i = 0; i < maxNumber; i++) {
          var prev = null;
          if (i - 1 >= 0) {
            prev = setAutoList[i - 1];
          } else {
            console.log(left);
            prev = {
              left: left + "px",
              width: "0px",
              clickFlag: true,
              text: "拆条1",
              startTime: this.getStartEndTime(left),
              endTime: this.getStartEndTime(autoWidth),
              timeLong: this.getStartEndTime(autoWidth)
            };
          }

          var left = parseFloat(prev.left) + parseFloat(prev.width) + "px";
          setAutoList.push({
            left: parseFloat(prev.left) + parseFloat(prev.width) + "px",
            width: autoWidth + "px",
            clickFlag: true,
            text: "拆条" + (this.cutCoverList.length + i + 1),
            startTime: this.getStartEndTime(
              parseFloat(prev.left) + parseFloat(prev.width)
            ),
            endTime: this.getStartEndTime(
              parseFloat(prev.left) + parseFloat(prev.width) * 2
            ),
            timeLong: this.getStartEndTime(autoWidth)
          });
        }
        for (var i = 0; i < setAutoList.length; i++) {
          this.$set(
            this.cutCoverList,
            this.cutCoverList.length,
            setAutoList[i]
          );
        }
        this.dialogVisibleAuto = false;
      }
    },

    entureChaitiao() {
      // console.log(this.$store.state.curVideo);
      var optionTimes = [];

      for (var i = 0; i < this.cutCoverList.length; i++) {
        var Lstart = this.cutCoverList[i].startTime.split(".")[0];
        var Lend = this.cutCoverList[i].endTime.split(".")[0];
        var Rstart = String(
          (parseInt(this.cutCoverList[i].startTime.split(".")[1]) / 100) * 1000
        );
        var Rend = String(
          (parseInt(this.cutCoverList[i].endTime.split(".")[1]) / 100) * 1000
        );
        optionTimes.push({
          fileName: this.cutCoverList[i].text,
          startTime: Lstart + "." + Rstart,
          endTime: Lend + "." + Rend
        });
      }
      var curVideo = this.$store.state.curVideo;
      var data = {
        id: curVideo.id,
        fileMD5: curVideo.fileId,
        optionTimes: optionTimes, //起止时间
        optionType: this.numberFlag, //00拆分  01合并,
        fileFirstDir: 335,
        fileFL: curVideo.fileFL,
        parentId: curVideo.parentId,
        isSrcVideo: false,
        fileName: "拆条1"
      };
      console.log(data);
      this.$http
        .post(this.Global.link + "media/videocut/voideCutOrMerge", data, {
          headers: { Authorization: localStorage.token }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 10000) {
            this.Event.$emit("refreshCt");
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.dialogVisible = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    serveSubmit(number) {
      if (this.cutCoverList.length == 0) {
        this.$message.error("还没有进行拆条");
        return;
      }
      // for (var i = 0; i < this.cutCoverList.length; i++) {
      //   var startArr = this.cutCoverList[i].startTime.split(":");
      //   var endArr = this.cutCoverList[i].endTime.split(":");

      //   var Ssecond = startArr[2].split(".")[0];
      //   var Sms = startArr[2].split(".")[1];

      //   var Esecond = endArr[2].split(".")[0];
      //   var Ems = endArr[2].split(".")[1];
      //   var lessSe = Esecond - Ssecond;
      //   if (lessSe < 10) {
      //     lessSe = "0" + lessSe;
      //   }
      //   // var lessMs = ((parseInt(Ems) - parseInt(Sms)) / 100).toFixed(3) * 1000;
      //   var lessMs = ((parseInt(Ems) - parseInt(Sms)) / 100).toFixed(3) * 1000;
      //   var timeLong =
      //     endArr[0] -
      //     startArr[0] +
      //     ":" +
      //     (endArr[1] - startArr[1]) +
      //     ":" +
      //     lessSe +
      //     "." +
      //     lessMs;
      //   this.cutCoverList[i].timeLong = timeLong;
      // }
      if (number == "00") {
        this.spliceMsg = "分段提交";
      } else {
        this.spliceMsg = "合并提交";
      }
      this.numberFlag = number;
      this.dialogVisible = true;
      return;
    },
    submitOne() {
      if (this.cutCoverList.length == 0) {
        this.$message.error("还没有进行拆条");
        return;
      }
      this.$confirm("是否合并提交视频?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.entureChaitiao("01");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getTimeBesides(str1, str2) {
      var time1 = str1.split(".")[0].split(":");
      var time2 = str2.split(".")[0].split(":");
      var hour1 = parseInt(time1[0]) * 3600;
      var min1 = parseInt(time1[1]) * 60;
      var second1 = parseInt(time1[2]);

      var hour2 = parseInt(time2[0]) * 3600;
      var min2 = parseInt(time2[1]) * 60;
      var second2 = parseInt(time2[2]);

      var timeall1 = hour1 + min1 + second1;
      var timeall2 = hour2 + min2 + second2;

      var between = timeall2 - timeall1;
      var lessHour =
        parseInt(between / 3600) > 10
          ? parseInt(between / 3600)
          : "0" + parseInt(between / 3600);
      var lessMin =
        parseInt((between % 3600) / 60) > 10
          ? parseInt((between % 3600) / 60)
          : "0" + parseInt((between % 3600) / 60);
      var lessSecond =
        parseInt(between % 60) > 10
          ? parseInt(between % 60)
          : "0" + parseInt(between % 60);
      console.log(between);
      console.log(lessHour);
      console.log(lessMin);
      console.log(lessSecond);
      return `${lessHour}:${lessMin}:${lessSecond}`;
    },
    backTostart() {
      this.stop();
      const timeMove = document.getElementById("blueBg");
      const scrollpd = document.getElementById("pickeddeng");
      scrollpd.scrollLeft = 0;
      timeMove.style.left = "-40px";
      timeMove.style.transition = "none";
      this.timeCurrentLeft = this.setDetailTime(
        parseFloat(
          Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
            100
        ).toFixed(2)
      );
    },
    backToend() {
      this.stop();
      const timeMove = document.getElementById("blueBg");
      const scrollpd = document.getElementById("pickeddeng");
      if (parseInt(this.imgWidth) > 1400) {
        scrollpd.scrollLeft = parseInt(this.imgWidth) - 1400;
      } else {
        scrollpd.scrollLeft = 0;
      }
      timeMove.style.left = parseFloat(this.imgWidth) - 40 + "px";
      timeMove.style.transition = "none";
      this.timeCurrentLeft = this.setDetailTime(
        parseFloat(
          Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
            100
        ).toFixed(2)
      );
    }
  },
  beforeDestroy() {
    this.pickeddeng.removeEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyboardEvent);
  },
  watch: {
    videoLong(val, old) {
      this.maxTimeLong = (Math.floor(val / this.number) + 1) * 10;
    },
    maxTimeLong(val, old) {
      this.showCanvas();
    }
  }
};
</script>
<style lang="less">
.autuSplice {
  .el-dialog {
    > div:nth-of-type(2) {
      text-align: center;
    }
    .el-radio-group {
      margin: 20px 0;
    }
  }
  .round {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: left;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    line-height: 40px;
    width: 300px;
    margin: 30px auto;
  }
}
footer {
  width: 100%;
  height: 250px;
  border-top: 2px solid #1d1e22;

  .menu {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    .controlMenu {
      width: 670px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      > div {
        height: 30px;
        margin-right: 20px;
        position: relative;
        font-size: 30px;
        color: #707070;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
        &::after {
          content: "";
          display: block;
          width: 1px;
          height: 20px;
          position: absolute;
          top: 5px;
          right: -10px;
          background-color: #ccc;
        }
        &:hover {
          color: #fff;
        }
        span {
          font-size: 14px;
        }
      }
      .contorlBtn {
        margin: 0 0 0 20px;
        display: flex;
        &::after {
          width: 0;
        }
        button {
          color: #fff;
          border: 0;
        }
        button:nth-child(1) {
          background: -webkit-linear-gradient(
            #8164d0,
            #3d67cd
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            #8164d0,
            #3d67cd
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            #8164d0,
            #3d67cd
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(#8164d0, #3d67cd); /* 标准的语法 */
          &:hover {
            background: -webkit-linear-gradient(
              #967fd7,
              #6282d5
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #967fd7,
              #6282d5
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #967fd7,
              #6282d5
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#967fd7, #6282d5); /* 标准的语法 */
          }
        }
        button:nth-child(2) {
          background: -webkit-linear-gradient(
            #fa9710,
            #ff5f1e
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            #fa9710,
            #ff5f1e
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            #fa9710,
            #ff5f1e
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(#fa9710, #ff5f1e); /* 标准的语法 */
          &:hover {
            background: -webkit-linear-gradient(
              #fba83a,
              #ff7d45
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #fba83a,
              #ff7d45
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #fba83a,
              #ff7d45
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#fba83a, #ff7d45); /* 标准的语法 */
          }
        }
      }
    }
    .videoContorl {
      display: flex;
      color: #8c97b1;
      align-items: center;
      .timeLong {
        display: flex;
        justify-content: space-between;
        height: 30px;
        margin-right: 20px;
        em {
          font-style: normal;
          font-size: 16px;
          line-height: 30px;
          white-space: nowrap;
        }
        span {
          width: 100px;
          font-size: 18px;
          line-height: 30px;
          border: 1px solid #515257;
          border-radius: 10px;
          text-align: center;
        }
      }
      i {
        font-size: 25px;
        cursor: pointer;
        margin: 0 15px;
        &:hover {
          color: #f25915;
        }
      }
    }
    .rule {
      width: 390px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      .el-slider {
        width: 150px;
      }
      > span {
        height: 30px;
        margin-right: 20px;
        position: relative;
        font-size: 22px;
        color: #707070;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
        &:hover {
          color: #fff;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .controlLine {
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
    background: #1d1e22;
    .signshowImg {
      width: 150px;
      height: 100px;
      background: #fff;
      position: absolute;
      top: -121px;
      z-index: 30;
      text-align: center;
      padding: 10px;
      transform: translateX(-50%);
      .text {
        font-size: 13px;
        color: #666;
      }
      > img {
        height: 80px;
        width: 100%;
      }
      .signDetail {
        width: 15px;
        height: 15px;
        color: #fff;
        background-color: #e92322;
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 13px;
        text-align: center;
        line-height: 15px;
        cursor: pointer;
      }
      .signClose {
        width: 15px;
        height: 15px;
        color: #fff;
        background-color: #e92322;
        position: absolute;
        right: 10px;
        top: 26px;
        font-size: 13px;
        text-align: center;
        line-height: 15px;
        cursor: pointer;
      }
    }
    .dyc {
      position: relative;
      overflow: auto;
      &::-webkit-scrollbar {
        height: 10px;
      }
      /*滚动条滑块*/
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
        width: 30px;
      }
      /*滚动条轨道*/
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        border-radius: 10px;
        background: #ccc;
      }
      .canFa {
        position: relative;
        .signcircle {
          width: 8px;
          height: 8px;
          background: orange;
          border-radius: 50%;
          position: absolute;
          top: 60px;
          cursor: pointer;
        }
        // overflow: hidden;
      }
      .imgbackground {
        left: 20px;
        height: 100px;
        background-repeat: repeat !important;
        background-size: contain !important;
        position: relative;
        .coverlistActive {
          // border-left: 3px solid #
        }
        .coverlist {
          background: rgba(23, 149, 255, 0.3);
          position: absolute;
          top: 0;
          height: 100px;
          display: flex;
          flex-wrap: nowrap;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid;
          &:hover {
            border: 1px solid #ccc;
          }
          .dragLeft {
            width: 50px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            font-size: 14px;
            position: relative;
            left: 0px;
            cursor: all-scroll;
            text-align: center;
          }
          .dragRight {
            text-align: center;
            width: 50px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            font-size: 14px;
            position: relative;
            right: 0px;
            cursor: w-resize;
          }

          > div {
            > div {
              font-size: 13px;
              color: #fff;
              cursor: pointer;
              width: 60px;
              margin: auto;
            }
            width: 100%;
            height: 50px;
            margin: 25px auto 0;
            text-align: center;
            // line-height: 50px;
            // display: flex;
            // flex-wrap: nowrap;
            // justify-content: center;
            overflow: hidden;
            span {
              color: #fff;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .blueBg {
      position: absolute;
      // height: 40px;
      box-sizing: content-box;
      text-align: center;
      line-height: 30px;
      width: 104.53px;
      padding: 0px 10px;
      border-radius: 5px;
      top: 0;
      left: -32px;
      background: rgba(23, 149, 255);
      color: #fff;
    }
    .turnDowm {
      position: absolute;
      width: 0;
      height: 0;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-style: solid;
      border-width: 10px 5px 0 5px;
      border-color: #007bff transparent transparent transparent;
    }
    .block {
      width: 150px;
      margin: auto;
    }
  }
}
</style>

