#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <port_number>"
    echo "This script sends a SIGTERM signal to a process running on the specified port."
    exit 1
fi

port=$1
pid=$(lsof -ti tcp:$port)

if [ -z "$pid" ]; then
    echo "No process found running on port $port"
    exit 1
fi

echo "Sending SIGTERM to process $pid running on port $port"
kill -15 $pid

if [ $? -eq 0 ]; then
    echo "SIGTERM sent successfully"
else
    echo "Failed to send SIGTERM"
fi