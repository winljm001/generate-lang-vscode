# 使用方法

1. 安装vscode插件 `lalala-generate-lang`
2. 右键选择要生成的I18N的文件,选择多语言生成
3. 会在项目根目录生成一个 `generate-lang-config.json` 配置文件
4. 同时会在根目录excel-lang文件夹内生成excel文件，可给翻译人员翻译
5. 当有翻译好的excel文件时，即可在 `generate-lang-config.json` 中配置excel路径
6. 再次选择多语言生成，即可在lang-dist文件夹得到目标多语言


# future

[] 中文提取功能

# 发布流程

```
# 登录
vsce login winljm001

# 发布
vsce publish

```

