const plugins = require("./plugins")

const home_nav = require("./menuConfig/navs/home_nav");
const front_end_nav = require("./menuConfig/navs/front_end_nav");
const back_end_nav = require("./menuConfig/navs/back_end_nav");
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
    nav: [home_nav, front_end_nav, back_end_nav, build_nav, data_algo_nav, library_nav],
    sidebar: {
      "/html/basics/": html_basics_collection,
      "/css/basics/": css_basics_collection,
      "/javascript/advanced/": js_advanced_collection,
      "/go/basics/": go_basics_collection,
      "/data_algo/data/": data_collection,
      "/react/basics/": react_basics_collection,
      "/vue/basics/": vue_basics_collection,
      "/node/basics/": node_basics_collection,
      "/build/webpack/": webpack_collection
    },
  },
  plugins: [...plugins],
};