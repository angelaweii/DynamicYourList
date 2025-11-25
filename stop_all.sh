#!/bin/bash

# DynamicMyList - Stop All Services
# This script stops all running services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DynamicMyList - Stopping All Services${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to stop a process
stop_process() {
    local pid=$1
    local name=$2
    
    if [ -z "$pid" ]; then
        return
    fi
    
    if ps -p $pid > /dev/null 2>&1; then
        echo -e "${YELLOW}🛑 Stopping $name (PID: $pid)...${NC}"
        kill $pid 2>/dev/null
        
        # Wait for process to stop
        local count=0
        while ps -p $pid > /dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 0.5
            count=$((count + 1))
        done
        
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${RED}   Force killing...${NC}"
            kill -9 $pid 2>/dev/null
        fi
        
        echo -e "${GREEN}   ✅ Stopped${NC}"
    else
        echo -e "${YELLOW}   Process $name ($pid) not running${NC}"
    fi
}

# Read PIDs from file
if [ -f ".pids" ]; then
    PIDS=($(cat .pids))
    
    if [ ${#PIDS[@]} -ge 3 ]; then
        stop_process "${PIDS[2]}" "React Frontend"
        stop_process "${PIDS[1]}" "FastAPI Backend"
        stop_process "${PIDS[0]}" "FF1000 ML Service"
    fi
    
    rm .pids
else
    echo -e "${YELLOW}⚠️  No .pids file found${NC}"
    echo -e "${YELLOW}Attempting to find and stop processes by port...${NC}\n"
    
    # Find and kill by port
    for port in 5173 8000 8080; do
        pid=$(lsof -ti:$port)
        if [ ! -z "$pid" ]; then
            stop_process "$pid" "Service on port $port"
        fi
    done
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ All Services Stopped${NC}"
echo -e "${GREEN}========================================${NC}\n"

