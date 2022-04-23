module.exports = [
  [
    "@vuepress-reco/vuepress-plugin-bgm-player",
    {
      audios: [{
        name: "River flows in you",
        artist: "Yiruma",
        url: "https://www.ytmp3.cn/down/51750.mp3",
        cover: "https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/east_white.jpeg?param=200y200",
      }, ],
      // 是否默认缩小
      autoShrink: true,
      // 缩小时缩为哪种模式
      shrinkMode: "float",
      // 悬浮窗样式
      floatStyle: {
        bottom: "10px",
        "z-index": "999999"
      },
    },
  ],
  [
    "copyright",
    {
      authorName: "East_White", // 选中的文字将无法被复制
      minLength: 30, // 如果长度超过  30 个字符
      noCopy: true,
      noSelect: true,
    },
  ],
  [
    "vuepress-plugin-nuggets-style-copy",
    {
      copyText: "复制代码",
      tip: {
        content: "复制成功",
      },
    },
  ],
  [
    "@vuepress-reco/vuepress-plugin-bulletin-popover",
    {
      width: "300px", // 默认 260px
      title: "消息提示",
      body: [{
          type: "title",
          content: "一起探索新世界~",
          style: "text-align: center; height: 30px; line-height: 30px;",
        },
        {
          type: "image",
          src: "https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/IMG_1881.JPG",
        },
      ],
      footer: [{
        type: "button",
        text: "打赏",
        link: "/east-white/",
      }, ],
    },
  ],
]