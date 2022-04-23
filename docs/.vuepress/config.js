const home_nav = require("./menuConfig/navs/home_nav");
const front_end_nav = require("./menuConfig/navs/front_end_nav");
const go_nav = require("./menuConfig/navs/go_nav");
const library_nav = require("./menuConfig/navs/library_nav");
const data_algo_nav = require("./menuConfig/navs/data_algo_nav");
const react_nav = require("./menuConfig/navs/react_nav");
const vue_nav = require("./menuConfig/navs/vue_nav");
const node_nav = require("./menuConfig/navs/node_nav");
const build_nav = require("./menuConfig/navs/build_nav");

const js_advanced_collection = require("./menuConfig/sidebars/js/advanced");
const go_basics_collection = require("./menuConfig/sidebars/go/basics");
const data_collection = require("./menuConfig/sidebars/algo/data/data");
const html_basics_collection = require("./menuConfig/sidebars/html/basics");
const css_basics_collection = require("./menuConfig/sidebars/css/basics");
const react_basics_collection = require("./menuConfig/sidebars/react/basics");
const vue_basics_collection = require("./menuConfig/sidebars/vue/basics");
const node_basics_collection = require("./menuConfig/sidebars/node/basics");
const webpack_collection = require("./menuConfig/sidebars/build/webpack");

module.exports = {
  title: "east-white",
  description: "east-white's Blog",
  base: "/east-white/",
  theme: "reco",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  themeConfig: {
    logo: "https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/logo.png",
    subSidebar: "auto",
    lastUpdated: "上次更新",
    nav: [home_nav, front_end_nav, react_nav, vue_nav, go_nav, node_nav, build_nav, data_algo_nav, library_nav],
    sidebar: {
      "/html/basics/": html_basics_collection,
      "/css/basics/": css_basics_collection,
      "/js/advanced/": js_advanced_collection,
      "/go/basics/": go_basics_collection,
      "/data_algo/data/": data_collection,
      "/react/basics/": react_basics_collection,
      "/vue/basics/": vue_basics_collection,
      "/node/basics/": node_basics_collection,
      "/build/webpack/": webpack_collection
    },
  },
  plugins: [
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
            content: "添加East_White好友，一起探索程序世界~",
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
  ],
};