#!/bin/bash
# Auto-restart Hugo server with Tailscale URL

export PATH=$PATH:/home/clawdbot/.local/bin
cd /home/clawdbot/.openclaw/workspace/chrisyang-io

while true; do
    echo "Starting Hugo server on Tailscale URL..."
    hugo server -D --bind 0.0.0.0 --port 1313 --disableFastRender --baseURL "http://jimmyclaw.tail23c867.ts.net:1313"
    echo "Server crashed or stopped. Restarting in 3 seconds..."
    sleep 3
done
