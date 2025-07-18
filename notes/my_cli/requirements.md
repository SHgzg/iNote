# 须知

## 工具
- 命令行解析核心库:    commander
- 交互式命令行界面:    inquirer
- 增强版文件系统操作:   fs-extra
- 打包与开发服务器:     rollup + express || webpack+webpack-dev-server
- 彩色日志输出:         chalk
- 加载动画：            ora
- 文件变更监听：         chokidar
- 模板下载：            download-git-repo

安装依赖
```
npm install commander inquirer fs-extra chalk ora download-git-repo rollup express --save-dev

npm install commander inquirer fs-extra chalk ora download-git-repo @webpack-cli/serve webpack webpack-dev-server --save-dev
```
打包工具还需要安装一些插件用于模块化的编译，就是ts编译，cjs和es的各种相互编译和混合使用还有其他静态资源的编译或者复制那档子事，就用rollup吧
- 模块打包核心:                    rollup
- 解析 node_modules 模块:          @rollup/plugin-node-resolve
- 转换 CommonJS 模块:              @rollup/plugin-commonjs
- 引入 json 文件:                  @rollup/plugin-json
- 编译 Typescript:                 @rollup/plugin-typescript
- 复制指定文件:                     rollup-plugin-copy
- 开发服务器:                       rollup-plugin-serve
- 热模块替换:                       rollup-plugin-hot

my-cli/  
├── bin/  
│   └── cli.js       # CLI入口  
├── lib/  
│   ├── init.js      # 初始化逻辑  
│   ├── serve.js     # 开发服务器  
│   └── build.js     # 打包逻辑  
├── templates/       # 项目模板  
│   ├── react/  
│   └── vue/  
├── rollup.dev.js  
├── rollup.prod.js  
└── package.json  

