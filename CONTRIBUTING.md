# 贡献指南

感谢您有兴趣为 Hermes AI Orchestrator 做出贡献！

## 代码规范

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

```
<type>(<scope>): <subject>

<description>

<footer>
```

类型包括:
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具链相关

示例:

```
feat(workflow): add support for conditional nodes

- Add condition evaluator
- Add test cases
- Update documentation
```

### 代码风格

- 使用 Prettier 格式化代码
- 使用 ESLint 检查代码质量
- 函数和类应该有 JSDoc 注释

## 开发流程

### 1. Fork 项目

在 GitHub 上 Fork 仓库。

### 2. 创建分支

```bash
git checkout -b feature/amazing-feature
```

### 3. 安装依赖

```bash
npm install
```

### 4. 编写代码

确保:
- 所有测试通过
- 新功能有测试覆盖
- 代码符合 lint 规则
- 更新相关文档

### 5. 运行测试

```bash
npm test
npm run lint
```

### 6. 提交更改

```bash
git add .
git commit -m "feat: add amazing feature"
```

### 7. 推送分支

```bash
git push origin feature/amazing-feature
```

### 8. 创建 Pull Request

在 GitHub 上创建 PR。

## 发布流程

维护者使用以下流程发布:

1. 更新 `package.json` 版本号
2. 更新 CHANGELOG.md
3. 创建 tag: `git tag -a v1.0.0 -m "v1.0.0"`
4. 推送: `git push --follow-tags`

## 行为准则

我们遵循 Contributor Covenant。

## 联系方式

有问题请通过以下方式联系:
- GitHub Issues
- Discord: https://discord.gg/yourserver
- Email: contact@example.com
