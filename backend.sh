run_sudo_command() {
    local command=$1
    echo "Running command: $command"
    sudo sh -c "$command"
}

run_sudo_command 'cd backend && bash print.sh' 