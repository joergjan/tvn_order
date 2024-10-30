#!/bin/bash

run_sudo_command() {
    local command=$1
    echo "Running command: $command"
    sudo sh -c "$command"
}

run_sudo_command_background() {
    local command=$1
    local process_name=$2
    local pids=$(pgrep -f "$process_name")

    if [ -n "$pids" ]; then
        echo "Killing existing process(es) for command: $command"
        sudo kill $pids
    fi

    echo "Running command in background: $command"
    nohup sudo sh -c "$command" > /dev/null 2>&1 &
}

# Example usage
run_sudo_command 'cd frontend && npm install && sleep 2'
run_sudo_command 'cd frontend && rm -rf build/*'
run_sudo_command 'cd frontend && npm run build && sleep 2'
run_sudo_command 'rm -rf app/* && cp -r frontend/build app/'
run_sudo_command 'cp frontend/package.json app/'
run_sudo_command 'cp frontend/package-lock.json app/'
run_sudo_command 'cp -r frontend/prisma app/ && sleep 2'
run_sudo_command 'cd app && npm ci --omit dev'
run_sudo_command_background 'cd backend && print.sh' "print.sh"
# run_sudo_command 'iptables -t nat -A PREROUTING -i end0 -p tcp --dport 80 -j REDIRECT --to-port 3000'
run_sudo_command 'cd app && ORIGIN=http://tvn.local PORT=80 node build' "node build"
