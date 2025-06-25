# tabbar 说明

## v3.3.0 版
最近接了个需求，正好需要实现 `带缓存的自定义tabbar`，我发现现在的tababrList里面的配置未必跟UI框架匹配，而且现在跟原生tabbar的配置耦合在一起，所以我觉得不是最优解。
最终思索了2个晚上，觉得精简成下面的才是最合理的：
- `无 tabbar` 和 `完全原生 tabbar` 统一还是在 `pages.config.ts` 里面配置。（`无 tabbar` 直接删除tabbar配置即可）
- `无缓存自定义 tabbar`， 经过问卷调查和合理性推断，应该是个伪需求，没人会搞多个tabbar又不用它的缓存功能，所有这个去掉了。（如果需要开启，只需要在配置完 `带缓存自定义 tabbar` 之后，把 `pages.config.ts` `tabbar` 相关的配置都去掉，然后在 `fg-tabbar.vue` 里面把 `switchTabbar` 改为 `navigateTo` 即可）
- `带缓存自定义 tabbar`则可以配置在 `tabbarList.ts`，可以根据您选择的 UI库，配置不同的东西。（每个UI库还是不一样的）

最终精简下来其实就只有2种：`原生tabbar` 和 `自定义 tabbar`。


## v3.0.0 版 （过期了）
2025-06-21 周日 by 菲鸽

`tabbar` 分为 `4 种` 情况：

- 0 `完全原生 tabbar`，使用 `switchTab` 切换 tabbar，`tabbar` 页面有缓存。
  - 优势：原生自带的 tabbar，最先渲染，有缓存。
  - 劣势：只能使用 2 组图片来切换选中和非选中状态，修改颜色只能重新换图片（或者用 iconfont）。
- 1 `带缓存自定义 tabbar`，使用 `switchTab` 切换 tabbar，`tabbar` 页面有缓存。使用了第三方 UI 库的 `tabbar` 组件，并隐藏了原生 `tabbar` 的显示。
  - 优势：可以随意配置自己想要的 `svg icon`，切换字体颜色方便。有缓存。可以实现各种花里胡哨的动效等。
  - 劣势：首次点击 tababr 会闪烁。
- 2 `无缓存自定义 tabbar`，使用 `navigateTo` 切换 `tabbar`，`tabbar` 页面无缓存。使用了第三方 UI 库的 `tabbar` 组件。
  - 优势：可以随意配置自己想要的 svg icon，切换字体颜色方便。可以实现各种花里胡哨的动效等。
  - 劣势：首次点击 `tababr` 会闪烁，无缓存。
- 3 `无 tabbar`，只有一个页面入口，底部无 `tabbar` 显示；常用语临时活动页。

> 注意：花里胡哨的效果需要自己实现，本模版不提供。
