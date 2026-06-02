#!/usr/bin/env bash
# ============================================================================
# survey_nfhistory.sh — read-only inventory of the cleanroom server.
#
# Purpose
#   Capture a one-shot snapshot of how `nfhistory` is configured: certificates
#   and their expiry, nginx config, systemd units, tmux sessions, cron jobs,
#   log rotation, disk usage, package versions, Python virtualenv contents,
#   database sizes, file-tree layout, the lot. The output is intended to be
#   pasted into the project documentation so a future maintainer doesn't have
#   to rediscover it from scratch.
#
# Safety
#   Every command in this script is read-only: ls, cat, ss, systemctl status,
#   openssl x509 -enddate, du, find, ps, sqlite3 .schema, psql \dt, etc.
#   The script never modifies a file, never runs sudo, never installs anything,
#   never restarts a service, and never prints values of secrets — only the
#   NAMES of env vars in .env, and only the names/fingerprints of SSH keys.
#
#   Read the script before running it if you want to verify.
#
# Usage (on nfhistory, as the phelan user)
#   bash survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
#
#   Some sections show fuller information when run as root (process names in
#   `ss -tlnp`, full iptables, etc.). If you trust the script and want the
#   richer output, re-run with:
#       sudo bash survey_nfhistory.sh | tee /tmp/nfhistory_survey_root_$(date +%F).txt
#
#   Either way, send the resulting text file back. It contains no secrets.
# ============================================================================

set +e   # don't abort on the first error; many tools are optional
umask 077

section() { printf '\n\n===== %s =====\n' "$1"; }
sub()     { printf '\n----- %s -----\n' "$1"; }
note()    { printf '  (note) %s\n' "$1"; }

# Discover the Flask app install root. On nfhistory, the install lives at
# /home/phelan/server/UNanofabTools (confirmed by tmux cwd in the 2026-06-01
# phelan-side snapshot). HSCDownloader.py lives inside the same install
# directory.
INSTALL_ROOT=""
for cand in ~/server/UNanofabTools /opt/UNanofabTools /srv/UNanofabTools; do
  if [ -d "$cand" ]; then
    INSTALL_ROOT="$cand"
    break
  fi
done
HSC_ROOT="$INSTALL_ROOT"      # HSCDownloader.py lives next to run.py in the same install

section "META"
date -u  ; echo "(UTC)"
date     ; echo "(local)"
echo "hostname:      $(hostname 2>/dev/null)"
echo "hostname -f:   $(hostname -f 2>/dev/null)"
echo "running as:    $(whoami)  (uid $(id -u))"
echo "script source: $0"

section "OS / KERNEL"
uname -a
sub "/etc/os-release"
cat /etc/os-release 2>/dev/null
sub "uptime + load"
uptime
sub "timezone"
timedatectl 2>/dev/null || cat /etc/timezone 2>/dev/null
sub "last 5 reboots"
last reboot 2>/dev/null | head -5

section "HARDWARE / RESOURCES"
sub "CPU"
lscpu 2>/dev/null | grep -E '^(Model name|Architecture|CPU\(s\)|Thread\(s\)|Core\(s\))'
sub "Memory"
free -h
sub "Disk (mounted, real filesystems)"
df -hT -x tmpfs -x devtmpfs -x squashfs 2>/dev/null
sub "Mounts (filtered)"
mount | grep -vE '(tmpfs|cgroup|proc|sysfs|devpts|debugfs|tracefs|securityfs|pstore|bpf|fusectl|configfs|mqueue|hugetlbfs|autofs|binfmt|nsfs|ramfs)'

section "NETWORK"
sub "Interfaces"
ip -br addr 2>/dev/null || ifconfig 2>/dev/null
sub "Default route"
ip route 2>/dev/null | head -10 || route -n 2>/dev/null | head -10
sub "DNS"
cat /etc/resolv.conf 2>/dev/null
sub "Listening TCP ports (IPv4)"
ss -tln 2>/dev/null || netstat -tln 2>/dev/null
sub "Listening with process names (fuller info if run as root)"
ss -tlnp 2>/dev/null
sub "/etc/hosts (cleanroom-relevant lines only)"
grep -E '(nfhistory|nanofab|155\.98)' /etc/hosts 2>/dev/null

section "FIREWALL"
sub "ufw"
if command -v ufw >/dev/null; then ufw status verbose 2>/dev/null; else echo "ufw not installed"; fi
sub "firewalld"
if command -v firewall-cmd >/dev/null; then firewall-cmd --list-all 2>/dev/null; else echo "firewalld not installed"; fi
sub "iptables filter (head)"
iptables -L -n -v 2>&1 | head -60
sub "nftables (head)"
command -v nft >/dev/null && nft list ruleset 2>&1 | head -60

section "SSH SERVER"
sub "openssh version"
ssh -V 2>&1
sub "/etc/ssh/sshd_config — auth-relevant lines"
grep -Ei '^[^#].*(PermitRoot|PasswordAuth|PubkeyAuth|ChallengeResp|UsePAM|AuthorizedKeys|PermitEmpty|AllowUsers|DenyUsers|ClientAlive|MaxAuth|MaxSession|Port|ListenAddress|Protocol)' /etc/ssh/sshd_config 2>/dev/null
sub "effective sshd config (sshd -T head; needs root for full)"
sshd -T 2>/dev/null | head -50

section "USERS"
sub "interactive accounts (uid >= 1000, shell set)"
getent passwd | awk -F: '$7 ~ /(bash|zsh|sh|fish)$/ && $3>=1000 {printf "  %-12s uid=%-5s home=%-25s shell=%s\n", $1, $3, $6, $7}'
sub "recent logins (last 20)"
last -n 20 2>/dev/null

section "SSH KEYS UNDER \$(whoami)'s HOME"
echo "  Listing of ~/.ssh/ (mode bits matter; should be 700/600):"
ls -la ~/.ssh/ 2>/dev/null
sub "fingerprints in authorized_keys (NO key bodies printed)"
if [ -f ~/.ssh/authorized_keys ]; then
  ssh-keygen -lf ~/.ssh/authorized_keys 2>/dev/null
  echo "  key count: $(grep -cE '^(ssh-|ecdsa-|sk-)' ~/.ssh/authorized_keys)"
  echo "  comments only (everything after the key body):"
  awk '{for(i=3;i<=NF;i++) printf "    %s", $i; print ""}' ~/.ssh/authorized_keys 2>/dev/null
fi

section "TLS / CERTIFICATES"
sub "search filesystem for cert files (typical locations)"
CERT_SEARCH_ROOTS=(/etc/nginx /etc/letsencrypt /etc/ssl /etc/pki ~/certs /root/certs)
[ -n "$INSTALL_ROOT" ] && CERT_SEARCH_ROOTS+=("$INSTALL_ROOT")
CERT_PATHS=$(find "${CERT_SEARCH_ROOTS[@]}" \
   -maxdepth 6 -type f \( -name '*.crt' -o -name '*.pem' -o -name '*.cer' \) 2>/dev/null \
   | grep -viE '(/key|fullchain.key|privkey)' )
echo "$CERT_PATHS" | head -40
sub "Expiry / subject / issuer for every cert found"
echo "$CERT_PATHS" | while IFS= read -r f; do
  [ -z "$f" ] && continue
  end=$(openssl x509 -in "$f" -noout -enddate 2>/dev/null | sed 's/notAfter=//')
  if [ -n "$end" ]; then
    sub_=$(openssl x509 -in "$f" -noout -subject 2>/dev/null | sed 's/subject= *//')
    iss=$(openssl x509 -in "$f" -noout -issuer  2>/dev/null | sed 's/issuer= *//')
    # days until expiry
    end_epoch=$(date -d "$end" +%s 2>/dev/null)
    now_epoch=$(date +%s)
    if [ -n "$end_epoch" ]; then
      days=$(( (end_epoch - now_epoch) / 86400 ))
    else
      days="?"
    fi
    printf '  %s\n    end:    %s   (%s days)\n    subj:   %s\n    issuer: %s\n' "$f" "$end" "$days" "$sub_" "$iss"
  fi
done
sub "Certificate currently served on :443 (live)"
echo | timeout 5 openssl s_client -connect localhost:443 -servername "$(hostname -f 2>/dev/null)" 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null
sub "Let's Encrypt structure (if present)"
[ -d /etc/letsencrypt ] && find /etc/letsencrypt -maxdepth 3 \( -type d -o -name '*.conf' \) 2>/dev/null
sub "certbot timers / renewal cron"
systemctl list-timers --no-pager 2>/dev/null | grep -i cert
grep -RE '(certbot|letsencrypt|acme)' /etc/cron.* /etc/systemd 2>/dev/null | head -20

section "NGINX"
sub "version + compile-time modules"
nginx -V 2>&1 | head -3
sub "service status"
systemctl status nginx --no-pager 2>&1 | head -20
sub "sites-enabled"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null
ls -la /etc/nginx/conf.d/      2>/dev/null
sub "FULL effective nginx config (nginx -T)"
nginx -T 2>&1
sub "recent error log tail (50 lines)"
tail -50 /var/log/nginx/error.log 2>/dev/null
sub "recent access log size"
ls -la /var/log/nginx/*.log* 2>/dev/null | head -20

section "SYSTEMD"
sub "running services"
systemctl list-units --type=service --state=running --no-pager 2>&1 | head -60
sub "all enabled timers"
systemctl list-timers --no-pager 2>&1 | head -30
sub "failed units (should be empty)"
systemctl --failed --no-pager 2>&1
sub "cleanroom-related units (if any)"
systemctl list-unit-files --no-pager 2>&1 | grep -iE '(flask|nanofab|nfhistory|chem|hsc|downloader|gunicorn)'

section "TMUX STATE"
sub "tmux sessions (as $(whoami))"
tmux ls 2>&1
sub "Processes inside each session"
tmux ls 2>/dev/null | awk -F: '{print $1}' | while read s; do
  echo "  --- session: $s ---"
  tmux list-panes -t "$s" -F '    pid=#{pane_pid} cmd=#{pane_current_command} cwd=#{pane_current_path}' 2>/dev/null
done
sub "Python/gunicorn processes owned by $(whoami)"
ps -u "$(whoami)" -o pid,etime,rss,command 2>/dev/null | grep -E '(python|gunicorn|flask|HSC|run\.py)' | grep -v grep

section "CRON"
sub "user crontab ($(whoami))"
crontab -l 2>/dev/null || echo "  no user crontab"
sub "/etc/cron.d"
ls -la /etc/cron.d/ 2>/dev/null
for f in /etc/cron.d/*; do
  [ -f "$f" ] && echo "--- $f ---" && cat "$f"
done
sub "/etc/cron.{hourly,daily,weekly,monthly}"
for d in hourly daily weekly monthly; do
  echo "  --- $d ---"; ls /etc/cron.$d/ 2>/dev/null
done

section "LOG ROTATION"
sub "/etc/logrotate.d/"
ls /etc/logrotate.d/ 2>/dev/null
for f in /etc/logrotate.d/*; do
  [ -f "$f" ] && echo "--- $f ---" && head -25 "$f"
done
sub "logrotate global config"
head -50 /etc/logrotate.conf 2>/dev/null
sub "rsyslog drop-ins"
ls /etc/rsyslog.d/ 2>/dev/null

section "PYTHON ENVIRONMENTS"
sub "system pythons"
for p in python3 python3.10 python3.11 python3.12 python3.13 python3.14; do
  v=$(command -v $p) && echo "  $p -> $v -> $($p --version 2>&1)"
done
echo "  Discovered INSTALL_ROOT: ${INSTALL_ROOT:-<not found>}"
sub "UNanofabTools venv"
if [ -n "$INSTALL_ROOT" ]; then
  for cand in "$INSTALL_ROOT/venv" "$INSTALL_ROOT/.venv"; do
    [ -d "$cand" ] || continue
    echo "  venv at: $cand"
    "$cand/bin/python" --version 2>&1 | sed 's/^/    /'
    echo "    pip freeze:"
    "$cand/bin/pip" freeze 2>/dev/null | sed 's/^/      /'
  done
fi
sub "UNanofabTools requirements.txt"
[ -n "$INSTALL_ROOT" ] && [ -f "$INSTALL_ROOT/requirements.txt" ] && cat "$INSTALL_ROOT/requirements.txt"
sub "HSCDownloader venv (lives in the same install root)"
echo "  (HSCDownloader.py is co-located in the Flask install — see venv above)"

section "FLASK APP — FILE TREE"
sub "Top of UNanofabTools install ($INSTALL_ROOT)"
[ -n "$INSTALL_ROOT" ] && ls -la "$INSTALL_ROOT" 2>/dev/null
sub "instance/ (SQLite DBs + size + mtime)"
[ -n "$INSTALL_ROOT" ] && ls -la "$INSTALL_ROOT/instance" 2>/dev/null
sub ".env keys present (NAMES only — no values)"
if [ -n "$INSTALL_ROOT" ] && [ -f "$INSTALL_ROOT/.env" ]; then
  grep -oE '^[A-Z_][A-Z0-9_]*=' "$INSTALL_ROOT/.env" | sed 's/=$//' | sort -u | sed 's/^/  /'
else
  echo "  no .env at $INSTALL_ROOT/.env (or INSTALL_ROOT not found)"
fi
sub "Recently-touched app log files (mtime < 24h)"
[ -n "$INSTALL_ROOT" ] && find "$INSTALL_ROOT" -maxdepth 3 -name '*.log' -mmin -1440 2>/dev/null

section "SQLITE DATABASES"
for db in "$INSTALL_ROOT"/instance/*.db; do
  [ -f "$db" ] || continue
  echo
  echo "--- $db ---"
  ls -la "$db"
  if command -v sqlite3 >/dev/null; then
    echo "  tables: $(sqlite3 "$db" '.tables' 2>/dev/null)"
    echo "  row counts:"
    for t in $(sqlite3 "$db" '.tables' 2>/dev/null | tr -s ' ' '\n' | grep -v '^$'); do
      n=$(sqlite3 "$db" "SELECT COUNT(*) FROM \"$t\";" 2>/dev/null)
      printf '    %-30s %s\n' "$t" "$n"
    done
    echo "  schema (head 40):"
    sqlite3 "$db" '.schema' 2>/dev/null | head -40 | sed 's/^/    /'
  fi
done

section "POSTGRESQL (chem inventory)"
sub "psql client"
command -v psql >/dev/null && psql --version || echo "  psql not installed locally"
sub "chem connection details from .env (host/db/user/port ONLY — password redacted)"
if [ -n "$INSTALL_ROOT" ] && [ -f "$INSTALL_ROOT/.env" ]; then
  grep -E '^(CHEM_PGHOST|CHEM_PGPORT|CHEM_POSTGRES_DB|CHEM_POSTGRES_USER|PGHOST|PGPORT|POSTGRES_DB|POSTGRES_USER)=' \
    "$INSTALL_ROOT/.env" | sed 's/^/  /'
fi
sub "Live chem DB inventory (only attempted if env is set + psql exists)"
if [ -n "$INSTALL_ROOT" ] && [ -f "$INSTALL_ROOT/.env" ] && command -v psql >/dev/null; then
  H=$(grep -E '^CHEM_PGHOST='        "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)
  P=$(grep -E '^CHEM_PGPORT='        "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)
  D=$(grep -E '^CHEM_POSTGRES_DB='   "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)
  U=$(grep -E '^CHEM_POSTGRES_USER=' "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)
  W=$(grep -E '^CHEM_POSTGRES_PASSWORD=' "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)
  H=${H:-$(grep -E '^PGHOST='        "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)}
  P=${P:-$(grep -E '^PGPORT='        "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)}
  D=${D:-$(grep -E '^POSTGRES_DB='   "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)}
  U=${U:-$(grep -E '^POSTGRES_USER=' "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)}
  W=${W:-$(grep -E '^POSTGRES_PASSWORD=' "$INSTALL_ROOT/.env" | tail -1 | cut -d= -f2-)}
  P=${P:-5432}
  if [ -n "$H" ] && [ -n "$D" ] && [ -n "$U" ]; then
    echo "  Connecting: psql -h $H -p $P -U $U -d $D  (password redacted)"
    PGPASSWORD="$W" psql -h "$H" -p "$P" -U "$U" -d "$D" -At -c "SELECT version();" 2>&1 | sed 's/^/    /'
    echo "  tables (\\dt):"
    PGPASSWORD="$W" psql -h "$H" -p "$P" -U "$U" -d "$D" -c '\dt' 2>&1 | sed 's/^/    /'
    echo "  database size:"
    PGPASSWORD="$W" psql -h "$H" -p "$P" -U "$U" -d "$D" -At -c "SELECT pg_size_pretty(pg_database_size('$D'));" 2>&1 | sed 's/^/    /'
    echo "  row counts (top 30 tables):"
    PGPASSWORD="$W" psql -h "$H" -p "$P" -U "$U" -d "$D" -c "SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 30;" 2>&1 | sed 's/^/    /'
    unset W
  else
    echo "  chem connection variables missing — skipping live check"
  fi
fi

section "DATA TREES — SIZES AND FRESHNESS"
sub "LogData/"
if [ -n "$INSTALL_ROOT" ]; then
  for p in "$INSTALL_ROOT/LogData"; do
    [ -d "$p" ] || continue
    echo "  $p"
    du -sh "$p"   2>/dev/null
    du -sh "$p"/* 2>/dev/null | head -20
    echo "  newest 5 files:"
    find "$p" -type f -printf '    %T+ %p\n' 2>/dev/null | sort -r | head -5
  done
fi
sub "HSCDATA/"
if [ -n "$INSTALL_ROOT" ]; then
  for p in "$INSTALL_ROOT/HSCDATA"; do
    [ -d "$p" ] || continue
    echo "  $p"
    du -sh "$p" 2>/dev/null
    ls "$p" 2>/dev/null | head -10
    echo "  newest 5:"
    find "$p" -type f -printf '    %T+ %p\n' 2>/dev/null | sort -r | head -5
  done
fi
sub "uploads/"
if [ -n "$INSTALL_ROOT" ]; then
  for p in "$INSTALL_ROOT/uploads"; do
    [ -d "$p" ] || continue
    echo "  $p"
    du -sh "$p" 2>/dev/null
    echo "  newest 5:"
    find "$p" -type f -printf '    %T+ %p\n' 2>/dev/null | sort -r | head -5
  done
fi

section "INSTALLED PACKAGES (key ones)"
sub "Debian/Ubuntu (dpkg)"
command -v dpkg >/dev/null && dpkg -l 2>/dev/null | grep -E '^ii\s+(nginx|postgresql|sqlite|python3|certbot|tmux|ufw|rsyslog|cron|logrotate|openssh|fail2ban)' | awk '{printf "  %-30s %s\n", $2, $3}'
sub "RHEL/CentOS (rpm)"
command -v rpm >/dev/null && rpm -qa 2>/dev/null | grep -iE '^(nginx|postgres|sqlite|python3|certbot|tmux|openssh|fail2ban)' | sort | sed 's/^/  /'

section "PATCHING / UNATTENDED UPGRADES"
sub "unattended-upgrades config"
cat /etc/apt/apt.conf.d/20auto-upgrades 2>/dev/null
sub "50unattended-upgrades (head)"
head -40 /etc/apt/apt.conf.d/50unattended-upgrades 2>/dev/null
sub "apt upgradable packages (head)"
command -v apt >/dev/null && apt list --upgradable 2>/dev/null | head -20
sub "needrestart (if installed)"
command -v needrestart >/dev/null && needrestart -b 2>&1 | head -20

section "BACKUPS"
sub "search for backup tooling"
for tool in borg restic duplicity rsnapshot bacula amanda rdiff-backup; do
  command -v $tool >/dev/null && echo "  $tool present at $(command -v $tool)"
done
sub "backup-flavored scripts in /etc and /usr/local"
find /etc /usr/local -maxdepth 4 -name '*backup*' 2>/dev/null | head -10
sub "user crontab backup lines"
crontab -l 2>/dev/null | grep -iE 'rsync|backup|borg|restic'
sub "/var/backups (sample)"
ls /var/backups 2>/dev/null | head -10

section "MAIL / OUTBOUND NOTIFICATIONS"
for m in sendmail msmtp postfix exim ssmtp; do
  command -v $m >/dev/null && echo "  $m present at $(command -v $m)"
done
systemctl is-active postfix 2>/dev/null
systemctl is-active exim4   2>/dev/null

section "DONE"
date
echo "Survey complete."
echo "Output is intended to be shared with the docs team; no secret values were printed."
