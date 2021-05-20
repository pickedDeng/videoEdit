## 前言
没啥要说的,使用vue重新改写了视频云剪辑，云拆条。时间精力有限，闲下来的时候会持续更新。虽然在原先1.0的基础上有很多的用户咨询该实现方法。但是本次我还是不准备建立群聊（怕被催更），写这个纯属兴趣没有任何利益可言。如有有帮助到你，右上角 **点个 star** 足以；原1.0版已复制到根目录video-edit-v1.0;缓慢更新中...
## v1.5界面截图(演示地址：http://docs.fst1994.com/v1.5/html)
![](https://www.showdoc.com.cn/server/api/attachment/visitfile/sign/b040bebc6070a7c0ac6cca91176876f4)

## v1.0 界面截图（演示地址：http://docs.fst1994.com/wm/demo/index.html）

![](https://www.showdoc.com.cn/server/api/attachment/visitfile/sign/d271acdcb626114509a38612671127b6)

## 作者微信
![](https://www.showdoc.com.cn/server/api/attachment/visitfile/sign/ae61ed9939fdc26aad8f98ba142d7c8f)

## 安装
```
npm install
```

## 运行

```
npm run serve
```


## 功能清单


### v1.0 
+ 视频分段剪辑，打入打出点；

+ canvas刻度尺 调整不同时间刻度,并适配剪辑的短视频宽度

+ 支持对每段剪辑视频的编辑，拖拽，改变宽度以及左侧距离

+ 双击刻度尺调整当前时间位置

+ 支持对某一段视频进行删除修改标题

+ 支持对拆条视频左右微调

+ 反选当前剪切的视频片段

+ 自动拆分视频，平均拆分视频

+ 支持视频 上一帧，下一帧

+ 内置部分快捷供快捷使用 具体参照例子

### v1.5 
+ 支持多轨道（视频轨道、音频轨道、字幕轨道、图片轨道）
+ 支持多类型拖拽形成轨道
+ 支持轨道拖拽、移动、改变大小
+ 支持改变轨道刻度基准
+ 支持改变轨道自适应现轨道长度

### v2.0（计划更新）
+ 可视化预览
+ bug优化
+ 字幕生成、预览
+ 图片生成、预览





