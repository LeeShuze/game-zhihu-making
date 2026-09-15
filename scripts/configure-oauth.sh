#!/bin/sh
# Run on the deployment server. Never print or store the key in shell history.
set -eu
umask 077
config_dir="${HOME}/.config/team3-game"
config_file="${config_dir}/oauth.env"
mkdir -p "$config_dir"
if [ -e "$config_file" ]; then
  echo "配置已存在，未覆盖：$config_file"
  exit 1
fi
printf '请输入知乎 App Key（输入不会显示）：' > /dev/tty
saved_tty=$(stty -g < /dev/tty)
trap 'stty "$saved_tty" < /dev/tty' EXIT HUP INT TERM
stty -echo < /dev/tty
IFS= read -r oauth_key < /dev/tty
stty "$saved_tty" < /dev/tty
printf '\n' > /dev/tty
case "$oauth_key" in ''|*[!a-zA-Z0-9_-]*) echo '密钥格式不符合预期，未保存'; exit 1;; esac
{
  printf '%s\n' 'APP_ORIGIN=https://team3.ooyyee.top' 'ZHIHU_OAUTH_APP_ID=757' 'ZHIHU_OAUTH_REDIRECT_URI=https://team3.ooyyee.top/'
  printf 'ZHIHU_OAUTH_APP_KEY=%s\n' "$oauth_key"
} > "$config_file"
unset oauth_key
echo "已保存受限配置文件：$config_file"
