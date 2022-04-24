const plugins = require("./plugins");

const home_nav = require("./menuConfig/navs/home_nav");
const front_end_nav = require("./menuConfig/navs/front_end_nav");
const back_end_nav = require("./menuConfig/navs/back_end_nav");
const library_nav = require("./menuConfig/navs/library_nav");
const data_algo_nav = require("./menuConfig/navs/data_algo_nav");
const build_nav = require("./menuConfig/navs/build_nav");
const app_nav = require("./menuConfig/navs/app_nav");

const js_advanced_collection = require("./menuConfig/sidebars/js");
const go_basics_collection = require("./menuConfig/sidebars/go/basics");
const data_collection = require("./menuConfig/sidebars/algo/data/data");
const html_basics_collection = require("./menuConfig/sidebars/html/basics");
const css_basics_collection = require("./menuConfig/sidebars/css/basics");
const react_basics_collection = require("./menuConfig/sidebars/react/basics");
const vue_basics_collection = require("./menuConfig/sidebars/vue/basics");
const node_basics_collection = require("./menuConfig/sidebars/node/basics");
const webpack_collection = require("./menuConfig/sidebars/build/webpack");
const es6_collection = require("./menuConfig/sidebars/es6");
const ts_collection = require("./menuConfig/sidebars/ts");
const flutter_basics_collection = require("./menuConfig/sidebars/flutter/basics");

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
    nav: [
      home_nav,
      front_end_nav,
      app_nav,
      back_end_nav,
      build_nav,
      data_algo_nav,
      library_nav,
    ],
    sidebar: {
      // about front_end
      "/html/basics/": html_basics_collection,
      "/css/basics/": css_basics_collection,
      "/javascript/advanced/": js_advanced_collection,
      "/javascript/es6/": es6_collection,
      "/javascript/ts/": ts_collection,
      // about react
      "/react/basics/": react_basics_collection,
      // about vue
      "/vue/basics/": vue_basics_collection,
      // about app
      "/flutter/basics/": flutter_basics_collection,
      // about go
      "/go/basics/": go_basics_collection,
      // about node
      "/node/basics/": node_basics_collection,
      // about build
      "/build/webpack/": webpack_collection,
      // about algorithms
      "/data_algo/data/": data_collection,
    },
  },
  plugins: [...plugins],
};
