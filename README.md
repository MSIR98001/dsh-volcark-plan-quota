# dsh-volcark-plan-quota

在 DeepSeek Harness Web GUI 侧边栏底部显示火山方舟 **Agent Plan / Coding Plan 套餐额度**。

- 使用火山引擎官方 `@volcengine/ark-cli`
- 使用官方火山 SSO 登录，不需要把长效 AK/SK 写进插件配置
- 每 60 秒刷新
- Agent Plan 展示 5 小时、本周、本月周期的已用百分比与额度
- 进度条只在轨道内部着色：绿色 `<50%`、黄色 `50–69%`、橙色 `70–89%`、红色 `>=90%`
- 支持亮色和暗色模式

## 安全说明

发布包**不包含**任何账号 ID、API Key、AK/SK、SSO Token 或本机登录数据。每位使用者必须使用自己的火山账号完成 SSO 登录。

## 系统要求

- Linux 或 macOS
- Node.js 18+
- DeepSeek Harness Web profile
- 可访问火山引擎登录与 Ark OpenAPI

`@volcengine/ark-cli` 会作为 npm 依赖随插件安装。

## 安装

将 `dsh-volcark-plan-quota-1.0.0.tgz` 放到目标机器，然后安装到 DSH profile 的共享模块目录：

```bash
DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
npm install --prefix "$DSH_HOME/profiles" ./dsh-volcark-plan-quota-1.0.0.tgz
```

> 请使用运行 `dsh web` 时的实际 `DSH_HOME`；安装命令与 Web 服务必须指向同一个 Harness home。

启用插件：

```bash
DSH_HOME="${DSH_HOME:-$HOME/.dsh}" \
  node "$DSH_HOME/profiles/node_modules/dsh-volcark-plan-quota/scripts/enable.mjs"
```

或者手动在 `$DSH_HOME/profiles/web/cordis.patch.yml` 的顶层 YAML 数组中添加：

```yaml
- insert:
    - id: volcark-plan-quota
      name: 'dsh-volcark-plan-quota'
      config: {}
```

## 官方 SSO 登录

插件安装后，使用其依赖的官方 ark-cli 登录：

```bash
ARKCLI="$DSH_HOME/profiles/node_modules/.bin/arkcli"
"$ARKCLI" auth login --no-browser
```

无浏览器/服务器环境下会输出一个官方火山登录 URL。用任意浏览器打开并完成授权，把页面给出的 base64 授权码带回服务器：

```bash
"$ARKCLI" auth login --no-browser --code '<授权码>'
```

检查登录状态：

```bash
"$ARKCLI" auth status
```

验证套餐数据：

```bash
"$ARKCLI" usage balance --type plan --format json
```

## 重启与验证

重启运行中的 DeepSeek Harness Web 服务，然后刷新原有 GUI 页面；不要另外启动一个替代服务器。

常见 systemd 安装：

```bash
sudo systemctl restart deepseek-harness.service
```

验证服务端数据：

```bash
curl http://127.0.0.1:3080/api/volcark/balance
```

正常时应看到：

```json
{
  "configured": true,
  "source": "arkcli",
  "plan": {
    "items": [
      { "product": "agent-plan", "periods": [] }
    ]
  }
}
```

## 升级

```bash
npm install --prefix "$DSH_HOME/profiles" ./dsh-volcark-plan-quota-新版本.tgz
sudo systemctl restart deepseek-harness.service
```

## 禁用与卸载

```bash
DSH_HOME="${DSH_HOME:-$HOME/.dsh}" \
  node "$DSH_HOME/profiles/node_modules/dsh-volcark-plan-quota/scripts/disable.mjs"

npm uninstall --prefix "$DSH_HOME/profiles" dsh-volcark-plan-quota
sudo systemctl restart deepseek-harness.service
```

禁用/卸载插件不会删除 `~/.arkcli` 的 SSO 登录状态。若使用者明确希望退出火山账号，请另行执行：

```bash
"$ARKCLI" auth logout
```

## 可选环境变量

- `DSH_HOME`：DeepSeek Harness home
- `DSH_WEB_PATCH`：覆盖启用脚本写入的 `cordis.patch.yml` 路径
- `ARKCLI_BIN`：覆盖 ark-cli 可执行文件路径

## 工作原理

服务端插件注册 `/api/volcark/balance`，调用：

```bash
arkcli usage balance --type plan --format json
```

客户端插件注册到 `sidebar.footer.action`，在侧边栏底部渲染 Agent/Coding Plan 套餐周期与内部颜色填充进度条。
