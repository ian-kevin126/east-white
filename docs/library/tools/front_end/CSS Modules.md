---
title: CSS Modules
author: ian_kevin
date: 2022-04-23
---

# 一、什么是CSS Modules

引用[CSS 模块主页](https://github.com/css-modules/css-modules)：

> **CSS 模块**是一个CSS 文件，默认情况下，所有类名和动画名都在本地范围内。



CSS 模块允许您在 CSS 文件中编写样式，但将它们作为 JavaScript 对象使用，以进行额外的处理和安全。CSS 模块非常流行，因为它们自动使类和动画名称唯一，因此您不必担心选择器名称冲突。



## 1、CSS Modules 示例

```css
/* src/components/container.module.css */
.container {
  margin: 3rem auto;
  max-width: 600px;
}
```

```jsx
// src/components/container.jsx
import React from "react"
import * as containerStyles from "./container.module.css"

export default function Container({ children }) {
  return (
    <section className={containerStyles.container}>{children}</section>
  )
}
```

在这个例子中，一个 CSS 模块被导入并声明为一个名为`containerStyles`. 然后，来自该对象的 CSS 类在 JSX`className`属性中被引用`containerStyles.container`，它使用动态 CSS 类名（如`container-module--container--3MbgH`）。

### 1）启用具有稳定类名的用户样式表

将持久的 CSS 添加`className`到您的 JSX 标记以及您的 CSS 模块代码可以使用户更容易利用[用户样式表](https://www.viget.com/articles/inline-styles-user-style-sheets-and-accessibility/)的可访问性。

这是一个将类名`container`与模块动态创建的类名一起添加到 DOM 的示例：

```jsx
// src/components/container.js
import React from "react"
import * as containerStyles from "./container.module.css"

export default function Container({ children }) {
  return (
    <section className={`container ${containerStyles.container}`}>
      {children}
    </section>
  )
}
```

然后，站点用户可以编写自己的 CSS 样式来匹配类名称为 的 HTML 元素`.container`，并且如果 CSS 模块名称或路径更改，它不会受到影响。





# 参考

- [深入浅出CSS Modules](https://segmentfault.com/a/1190000039846173)
