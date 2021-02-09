# 环境安装
写类库或者工具，打包工具我们选择rollup

npm install typescript rollup @rollup/plugin-node-resolve rollup-plugin-typescript2 -D

npm install ts-node -g    ts node index.tsx 运行  , 当然npm install -g typescript   tsc index.tsx =》 index.js 运行也可以

vscode插件： code runner

npx tsc --init   生成ts配置文件

node中我们使用 commonJs规范(主要在node中使用)


# 测试
npm install -g promises-aplus-tests
切换到 /dist
promises-aplus-tests bundle.js