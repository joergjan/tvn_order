#!/bin/bash

run_sudo_command() {
    local command=$1
    echo "Running command: $command"
    sudo sh -c "$command"
}

run_sudo_command 'bash backend.sh & bash frontend.sh'