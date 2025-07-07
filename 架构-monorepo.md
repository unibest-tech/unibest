# monorepo 架构

## 项目背景
我现在有create-unibest 和 unibest 2个项目，unibest 目前有好几个分支: base

base-eslint、base-sard-ui、base-uv-ui、base-uview-plus,分别是不同个UI库组成的基础模板。目前的写法是在  create-unibest 中根据选择的模板，直接拉取对应的unibest项目的分支来生成项目，我现在希望多增加几个维度的选择，如 prompt.md 1-84 。请帮我设计一下，是否需要合并成一个仓库，如何实现多步骤的询问。

根据 <mcfile name="prompt.md" path="/Users/burtlai/unibest-projects/unibest/prompt.md"></mcfile> 的功能需求，建议将 `packages/` 目录设计为以下4个子包结构：

### 1. **packages/cli**（对外发布包）
- **功能**：命令行入口与用户交互
- **核心文件**：
  - `src/index.ts`：命令解析与执行入口
  - `src/prompts.ts`：交互式询问逻辑（原generator/prompts.ts）
- **依赖**：`@unibest/generator`, `prompts`, `commander`
- **包名**：`create-unibest`（保持与原独立仓库一致，所以不用 @unibest/cli）

### 2. **packages/generator**（内部核心包）
- **功能**：项目生成引擎与模板渲染
- **核心文件**：
  - `src/index.ts`：生成流程控制器
  - `src/template.ts`：EJS模板渲染逻辑
  - `src/install.ts`：依赖自动安装逻辑
- **依赖**：`@unibest/shared`, `@unibest/templates`, `ejs`, `execa`
- **包名**：`@unibest/generator`

### 3. **packages/shared**（内部共享包）
- **功能**：跨包工具函数与类型定义
- **核心文件**：
  - `src/file.ts`：文件操作工具（原utils/file.ts）
  - `src/validate.ts`：参数验证工具（原utils/validate.ts）
  - `src/types/index.ts`：全局类型定义（原types/index.ts）
- **依赖**：`fs-extra`, `picocolors`, `zod`
- **包名**：`@unibest/shared`

### 4. **packages/templates**（内部资源包）
- **功能**：项目模板文件存储
- **目录结构**：
  ```
  templates/
  ├── base/            # 基础框架模板
  ├── platforms/       # 各端平台配置模板
  ├── ui/              # UI库适配模板
  └── features/        # 功能模块模板（i18n/token等）
  ```
- **包名**：`@unibest/templates`

### 依赖关系图
```
cli → generator → shared + templates
```

### 设计优势
1. **关注点分离**：命令交互、生成逻辑、工具函数、模板资源完全解耦
2. **可测试性**：各模块可独立单元测试（如generator可脱离CLI单独调用）
3. **版本协同**：通过pnpm workspace统一管理版本依赖
4. **未来扩展**：可新增 `plugins/` 子包支持插件系统，或 `presets/` 支持预设配置

## 额外的细心
1） 平台platforms 不需要显式出现，因为它只能决定可以选择的UI库（UI库根据平台动态调整），如选择H5，只能选择A、B、C，选择小程序可以选择B，C，D。
2） 不同的UI库的代码稍有不同，我准备在不同的子包中维护，如 sard-ui 包、wot-ui 包、uv-ui 包、uview-plus 包。（帮我评价是否合理，因为主要就是layouts 一个文件，里面用的ui 组件音UI库不同而代码不同，其他逻辑都一样）
3）多语言也是单独的代码，可以放在一个子包里面。

我打算在生产的时候，根据用户所选的功能，动态生成到项目里面。
