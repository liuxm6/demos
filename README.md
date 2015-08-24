# Demos
前台框架实例
##要运行此框架需要的环境
1 [node.js](https://nodejs.org/)
    下载安装
2 npm
    npm install npm -g
3 grunt-cli
    npm install grunt-cli -g
4 [git](http://git-scm.com/download/)
    下载安装
##开始使用
    1 git clone https://github.com/liuxm6/demos.git
    2 cd demos
      npm install
    3 grunt //生产环境目录
    4 grunt dist //编译
    5 grunt zip  //打包
##目录介绍
```
demos/
├── apps/            --生成的app
├── font/            --系统中使用的字体
├── grunt/           --grunt使用的自定义插件
├── js/              --公共js组件
├── less/            --公共css组件
├── modules/         --使用到的第三方组件
├── static/          --工程自定义脚本
├── Gruntfile.js     --grunt依赖配置文件
├── package.json     --npm依赖配置文件
└── LICENSE          --LICENSE
```