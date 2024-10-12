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
run_sudo_command 'cd frontend && npm ci && npm run build'
run_sudo_command_background 'cd frontend && npm run preview' 'npm run preview'
run_sudo_command_background 'cd backend && python print.py' 'python print.py'