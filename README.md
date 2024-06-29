此插件用于在rollup构建结束后，输出文件前，增加或删除文件

## 使用方式

下载：

`npm install rollup-plugin-file-tailor -D`

使用：

```ts
import Plugin from 'rollup-plugin-file-tailor';

Plugin({
  addFiles,
  deleteFiles,
  exact,
});
```

## 新增文件 addFiles

数组或单个对象，单个对象结构和[this-emitfile的参数](https://cn.rollupjs.org/plugin-development/#this-emitfile)一致。

## 删除文件 deleteFiles

### 1. 数组

内容可以是

1. 文件绝对路径
2. 匹配文件路径的正则
3. 匹配文件路径的glob字符串

**以output.dir为根路径**

### 2. 函数

也可以是一个函数，接收 bundle 的路径，返回布尔值，返回 true 的文件会被删除。

## extra

`deleteFiles` 会匹配每一个bundle，如果你的 `deleteFiles` 内包含的是文件绝对路径，可以设置 `extra` 为 true，这样当你设置的路径的文件都被删除后，就不会继续匹配了。
