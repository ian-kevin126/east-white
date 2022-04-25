const plugins = require("./plugins");

// 导航配置
const home_nav = require("./menuConfig/navs/home_nav");
const front_end_nav = require("./menuConfig/navs/front_end_nav");
const back_end_nav = require("./menuConfig/navs/back_end_nav");
const library_nav = require("./menuConfig/navs/library_nav");
const data_algo_nav = require("./menuConfig/navs/data_algo_nav");
const build_nav = require("./menuConfig/navs/build_nav");
const app_nav = require("./menuConfig/navs/app_nav");
const architect_nav = require("./menuConfig/navs/architect_nav");
const life_nav = require("./menuConfig/navs/life_nav");

// 侧边栏配置
const js_advanced_collection = require("./menuConfig/sidebars/js");
const go_basics_collection = require("./menuConfig/sidebars/go/basics");
const data_collection = require("./menuConfig/sidebars/algo/data/data");
const html_basics_collection = require("./menuConfig/sidebars/html/basics");
const css_basics_collection = require("./menuConfig/sidebars/css/basics");
const react_basics_collection = require("./menuConfig/sidebars/react/basics");
const vue_basics_collection = require("./menuConfig/sidebars/vue/basics");
// Node
const node_basics_collection = require("./menuConfig/sidebars/node/basics");
// webpack
const webpack_collection = require("./menuConfig/sidebars/build/webpack");
// ES6
const es6_collection = require("./menuConfig/sidebars/es6");
// TS
const ts_collection = require("./menuConfig/sidebars/ts");
// 移动端
const flutter_basics_collection = require("./menuConfig/sidebars/flutter/basics");
const rn_basics_collection = require("./menuConfig/sidebars/rn/basics");
const micro_app_basics_collection = require("./menuConfig/sidebars/micro_app/basics");
const h5_basics_collection = require("./menuConfig/sidebars/h5/basics");
// 架构师
const architect_fe_collection = require("./menuConfig/sidebars/architect/fe");
const architect_server_collection = require("./menuConfig/sidebars/architect/server");
// 生活相关
const life_handwriting_collection = require("./menuConfig/sidebars/life/handwriting");
const life_photos_collection = require("./menuConfig/sidebars/life/photos");
const life_movies_collection = require("./menuConfig/sidebars/life/movies");

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
      architect_nav,
      life_nav,
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
      "/rn/basics/": rn_basics_collection,
      "/micro_app/basics/": micro_app_basics_collection,
      "/h5/basics/": h5_basics_collection,
      // about go
      "/go/basics/": go_basics_collection,
      // about node
      "/node/basics/": node_basics_collection,
      // about build
      "/build/webpack/": webpack_collection,
      // about algorithms
      "/data_algo/data/": data_collection,
      // 架构师
      "/architect/fe/": architect_fe_collection,
      "/architect/server/": architect_server_collection,
      // 生活
      "/life/handwriting/": life_handwriting_collection,
      "/life/photos/": life_photos_collection,
      "/life/movies/": life_movies_collection,
    },
  },
  plugins: [...plugins],
};
