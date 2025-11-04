Commit规范
为了帮助你所在的团队建立清晰、可维护的 Git 提交历史，我为你总结并优化了一套 Commit 规范。这套规范融合了通用实践和实用性建议，旨在提升代码的可读性和协作效率。

以下是优化后的提交类型、标准格式和最佳实践。

### ✨ 优化后的提交类型

下表整理了最常见且实用的提交类型，建议团队优先采用。

| 提交类型 | 使用场景说明 | 示例 |
| :--- | :--- | :--- |
| **`feat`** | 新增**功能**或特性。 | `feat(user): add password reset feature` |
| **`fix`** | 修复代码中的 **bug**。 | `fix(auth): correct token expiration check` |
| **`docs`** | 仅针对**文档**的更改。 | `docs(api): update endpoint documentation` |
| **`style`** | 更改代码**格式/样式**（空格、分号等），不改变逻辑。 | `style: apply prettier code formatting` |
| **`refactor`** | **代码重构**，既非修 bug 也非加新功能。 | `refactor(utils): simplify data validation logic` |
| **`perf`** | 旨在**提升性能**的代码更改。 | `perf(render): optimize image loading strategy` |
| **`test`** | 增加或修改**测试用例**。 | `test(model): add unit tests for user model` |
| **`build`** | 影响**构建系统**或外部依赖（如 Webpack, npm）。 | `build(deps): upgrade webpack to v5` |
| **`ci`** | 对持续集成/部署**配置**的更改（如 GitHub Actions）。 | `ci: add automated deployment to staging` |
| **`chore`** | 其他**杂项**更改（不涉及源码或测试的日常事务）。 | `chore: update issue template` |
| **`revert`** | **撤销**之前的某次提交。 | `revert: fix: incorrect API response handling` |

**优化说明**：
*   **精简与统一**：移除了 `opt`（其含义可由 `perf` 或 `refactor` 覆盖）和 `ref`（建议统一使用更标准的 `refactor`），以避免重复和混淆。
*   **明确优先级**：以上列出的类型是核心集合，足以覆盖绝大多数开发场景，便于团队记忆和使用。

### 📝 提交信息的标准格式

一个清晰的结构有助于快速理解提交内容。推荐格式如下：

```
<type>[optional scope]: <subject>
// 空一行
[optional body]
// 空一行
[optional footer]
```

#### 1. 标题行（必需）
这是提交信息最核心的部分。
*   **格式**：`<type>[optional scope]: <subject>`
*   **类型 (type)**：从上表中选择。
*   **范围 (scope)**：**可选**，用于说明此次更改影响的具体模块或组件，如 `(user-auth)`, `(dashboard)`。如果影响多个模块，可用 `*` 代替。
*   **主题 (subject)**：对本次更改的简短描述，**不超过50个字符**。
    *   使用动词开头，采用**现在时态**（例如："add", "fix", "update"）。
    *   首字母**小写**。
    *   **结尾不要加句号**。

#### 2. 正文（可选）
在主题后空一行，可以撰写更详细的描述。
*   **内容**：解释**为什么**要进行此次更改（而不仅仅是改了什麼），包括修改的动机、与之前行为的对比等。
*   **长度**：每行建议控制在72个字符以内。

#### 3. 脚注（可选）
在正文后空一行，用于记录一些元数据。
*   **不兼容的变更 (BREAKING CHANGE)**：如果本次提交包含了与旧版本不兼容的变更，必须在此处说明，以 `BREAKING CHANGE:` 开头。
*   **关联议题**：关闭特定的 Issue 或任务，例如：`Closes #123`。

### 💡 最佳实践与示例

1.  **每个提交保持原子性**：一次提交只做一件事（例如，只实现一个新功能或只修复一个bug），这使回滚和代码审查更容易。
2.  **使用工具辅助**：可以配置如 **Commitizen** 或 VS Code 的 **git-commit-plugin** 等工具，通过交互式问答自动生成符合规范的提交信息，降低手动输入的错误。
3.  **英文？**：如使用英文撰写提交信息

#### 完整示例
```
feat(payment): integrate new Stripe API

- Add new service class for handling Stripe payment intents
- Update checkout controller to use the new service
- Add environment variables for Stripe keys

Closes #JIRA-45
```

```
fix(ui): resolve header layout overflow on mobile

The main navigation header was collapsing on screens smaller than 768px wide. This fix applies a flexbox layout to ensure items wrap correctly.

Reviewed-by: Jane Doe
```
