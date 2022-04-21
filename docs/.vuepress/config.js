const front_end_nav = require("./menuConfig/navs/front_end")
const go_nav = require("./menuConfig/navs/go")
const home_nav = require("./menuConfig/navs/home")
const data_algo = require("./menuConfig/navs/data_algo")

const js_advanced_collection = require("./menuConfig/sidebars/js/js_advanced")
const go_basics_collection = require("./menuConfig/sidebars/go/go_basics")

const data_collection = require("./menuConfig/sidebars/algo/data/data")

module.exports = {
  title: "east-white",
  description: "east-white's Blog",
  base: '/east-white/',
  theme: 'reco',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    logo: 'https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/logo.png',
    subSidebar: 'auto',
    lastUpdated: '上次更新',
    nav: [
      home_nav,
      front_end_nav,
      go_nav,
      data_algo
    ],
    sidebar: {
      '/js/js-advanced/': js_advanced_collection,
      '/go/go-basics/': go_basics_collection,
      '/data_algo/data/': data_collection
    }
  }
}