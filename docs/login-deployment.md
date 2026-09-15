# 知乎登录部署

## 运行条件
Node 24 或更新版本（使用内置 node:sqlite，无需另装数据库服务）。SQLite 默认保存在运行用户的 ~/.local/share/happiness-home/auth.db；生产环境通过 DATABASE_PATH 指定仓库外的持久目录。不要提交数据库、密钥或覆盖已有数据库。

本地运行 npm start。未配置 OAuth 时可以浏览书架，副本仍需登录。没有测试账号或登录绕过开关。

## 线上配置
1. 在服务器环境变量或受保护的 .env 中填写 .env.example 中的配置，App Key 不进入 Git。
2. 在赛事平台登记 https://team3.ooyyee.top/，必须与环境变量逐字符一致。
3. 使用 Node 24 启动 `node --env-file=.env scripts/serve.mjs`，并用已有进程管理器保持运行。只监听 127.0.0.1。
4. Nginx 的该站点所有请求反向代理到 Node，Docker 生产部署使用 `proxy_pass http://127.0.0.1:8000;`，设置 Host、X-Forwarded-Proto。不要用 try_files 或静态 location 直接提供 avg、duty、elevator，否则会绕过登录保护。
5. 为 OAuth 回调禁用访问日志或仅记录 $uri（不得记录带授权码的 $request/$request_uri/$args）。保持 HTTPS。
6. 使用 SQLite 在线备份 API 或停服务后的完整备份；WAL 模式运行时不要单独复制 auth.db。部署新代码保留数据目录，限制该目录为服务用户访问。

## 行为
访客可浏览书架和详情；点击确认进入副本弹登录提示。授权成功回书架，由玩家再次点击进入，避免自动播放和恢复错误。头像、昵称取自知乎 /user。数据库保存用户和本站会话（仅存会话标识的 SHA-256）；不保存 OAuth Token。会话有效期不超过 Token 返回的有效期且最多七天；退出销毁会话。首次授权 state 有效十分钟且一次性消费。

游戏存档仍是本机 localStorage，不跟账号同步。仅登录用途，登录完成后不再调用用户数据接口；本站会话不代表持续检查知乎端撤销状态。

## 验收
npm test 使用模拟知乎接口，不连接真实授权服务。上线必须由开发者本人完成一次真实知乎授权，确认头像昵称、刷新、退出、游戏路径限制及手机横竖屏。检查 Nginx 没有绕过 Node。

目前没有服务器访问权限或真实 OAuth 配置，本地测试通过不能代表线上登录已开通。


## 当前服务器：Docker 部署（推荐）
宿主机无需安装 Node；Dockerfile 使用 Node 24。现有反向代理 127.0.0.1:8000 保持不变。
以下命令在服务器上的本项目目录执行。先上传当前修改后的代码；不要使用尚未包含登录代码的旧镜像。

```sh
sh scripts/configure-oauth.sh
docker build -t team3-game:oauth-v1 .
docker volume create team3-game-auth
# 先在备用端口试运行，不停止旧网站。
docker run -d --name team3-game-oauth-check --restart=unless-stopped \
  -p 127.0.0.1:8001:8000 \
  --env-file "$HOME/.config/team3-game/oauth.env" \
  --mount source=team3-game-auth,target=/data \
  team3-game:oauth-v1
curl --fail http://127.0.0.1:8001/api/auth/me
```
应返回 enabled:true、user:null。用 docker ps 检查容器健康；如果不健康，先解决启动问题，不能切换。配置脚本只在服务器本地无回显接收密钥，文件权限受限，已有文件不覆盖。

### 检查通过后切换
确认不存在同名备份容器；有则另选备份名，勿删除旧容器。
```sh
docker stop team3-game-oauth-check
docker stop team3-game
docker rename team3-game team3-game-before-oauth
docker run -d --name team3-game --restart=always \
  -p 127.0.0.1:8000:8000 \
  --env-file "$HOME/.config/team3-game/oauth.env" \
  --mount source=team3-game-auth,target=/data \
  team3-game:oauth-v1
curl --fail http://127.0.0.1:8000/api/auth/me
```
通过公网访问 /api/auth/me，确认 enabled:true，再由本人完成真实授权。
根地址是 OAuth 回调；Nginx 根路径的访问日志不能包含查询串，需关闭或改用不含参数的日志格式；不要输出授权响应或容器完整环境变量。

### 新容器异常时回滚
```sh
docker stop team3-game
docker rename team3-game team3-game-oauth-failed
docker rename team3-game-before-oauth team3-game
docker start team3-game
```
保留数据库卷，不运行 docker volume rm 或 docker system prune --volumes。
本机未安装 Docker，以上容器构建及线上切换尚未执行。Node 自动化测试不是 Docker 构建结果。
