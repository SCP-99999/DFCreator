![投票结果](vote.png)

> **📊 根据 206 位同好的投票结果，67% 的参与者支持本工具开源。**
> *(投票数据截图于 Bilibili 动态，时间戳：2026-08-03)*

# DF Creator

基于 Vue3 的纯前端应用，数据持久化存储于浏览器 IndexedDB。

此工具仅供制作《浮世幻梦》（DF）系列同人作品使用，与官方原著无直接关联。无任何政治意图，请勿过度解读！

---

### 🚀 安装与使用

1. 克隆本仓库：
   `git clone [仓库地址]`

2. 安装包管理器（如 `bun`, `npm`）及 `vite`。

3. 安装项目依赖：
   `npm install`

4. 编译打包项目：
   `npm run build`

5. **【可选】** 下载 TNO / 素材数据库（由于项目默认包含的图包较小，如需使用完整预设素材，请下载下方数据包）：
   👉 [下载由 HittyGubby 大佬提供的 TNO 数据库 (解压后约 735.5MB)](http://997779.best/share/TNOdata.zip)
   
   *注：原作者写错安装方式了！正确的数据包安装方式为：在npm run build前在public文件夹中新建data文件夹，随后将数据包解压进去，再进行编译！*

6. 配置静态服务器（如 Apache httpd 或 Nginx），将 `dist` 目录作为网站根目录运行即可。

---

### ⚠️ 注意事项

- 本项目的文本输入框**支持直接输入 HTML 格式代码**（例如 `<span style="color:red">文字</span>`），可实现富文本效果。
- 由于采用纯前端、无服务端架构，目前**不支持用户系统、账号管理以及多设备云同步**。

---

### Installation (English)

0. Clone this repository.
1. Install a package manager (e.g., `bun`, `npm`) and `vite`.
2. Install dependencies: `npm install`.
3. Build the project: `npm run build`.
4. **【Optional】** Download the asset [Database](http://997779.best/share/TNOdata.zip) **(~735.5MB after extraction)**.
5. After downloading, please create a 'data' folder under the 'public' directory, and then unzip the data package into it (the original author wrote it wrong!!!)
6. Configure your static server (Apache httpd or Nginx) and serve the `dist` directory.

### Important Notes
- Input fields support raw HTML formatting.
- User account management and cloud sync are **not supported** due to the serverless nature of the project.

---

### 🙏 致谢
- 本项目 UI 框架引擎源自 [HittyGubby/TNOCreator](https://github.com/HittyGubby/TNOCreator)，在此致敬原作者的开源精神。
-感谢[hoil-eu-tfs-tno](https://space.bilibili.com/1332747906)提供的DF模板
本人代码写的依托，还是借助Deepseek的力量搞出来的，能用就行， 请 见 谅 😅
