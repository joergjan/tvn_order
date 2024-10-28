#!/bin/bash

# Find and kill all Node.js processes
echo "Terminating all Node.js tasks..."

# Get the list of Node.js process IDs
pids=$(pgrep -f "node")

if [ -n "$pids" ]; then
    # Terminate each Node.js process found
    echo "Killing Node.js processes: $pids"
    sudo kill $pids
    echo "All Node.js tasks have been terminated."
else
    echo "No Node.js tasks found."
fi
