# Medio-Node.js中间渲染层框架
---

## 目录结构
- `app`：webapp目录；
- `bin`：工具目录；
- `components`：公共资源；
  - `static`：公共第三方静态资源；
  - `styles`：公共SCSS资源；
  - `templates`：公共pug模板资源；
  - `vue`：公共vue组件资源；
- `config`：配置文件；
  - `build`：构建配置；
  - `env`：环境配置；
  - `respones`：响应配置；
  - `common`：其他；
- `libs`：框架功能源码目录；
  - `build`：构建；
  - `constatns`：常量；
  - `generator`：脚手架；
  - `serve`：服务器；
  - `utils`：工具；
- `public`：构建静态资源输出目录；
- `dist`：构建最终输出目录，包括服务器资源和静态资源；

## 开发
### 脚手架
```bash
npm run generate <appname>
```

其中`appname`为webapp名称，大小写不限。运行成功后在`app`目录下创建`appname`且首字母大写的webapp源码。

### 本地开发
```bash
npm run dev
```

默认端口为3000，可以修改`config/env/development.js`修改端口。

## 构建
```bash
# 构建静态资源
npm run build-static
# 构建所有资源
npm run build-service
```

注意，如果静态资源有改动，则执行`npm run build-service`之前必须先执行`npm run build-static`。
