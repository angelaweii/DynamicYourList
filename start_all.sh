#!/bin/bash

# DynamicMyList - Start All Services
# This script starts all three services in the correct order

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DynamicMyList - Starting All Services${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $name to be ready...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}\n"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    echo -e "${RED}❌ $name failed to start${NC}\n"
    return 1
}

# Check if required directories exist
if [ ! -d "backend/FF1000" ]; then
    echo -e "${RED}❌ FF1000 directory not found!${NC}"
    echo -e "${YELLOW}Please clone the FF1000 repository first:${NC}"
    echo -e "  cd backend && git clone git@github.com:WarnerBrosDiscovery/FF1000.git"
    exit 1
fi

# Check ports
echo -e "${BLUE}📍 Checking ports...${NC}"
check_port 8080 || echo -e "   ${YELLOW}FF1000 service (port 8080)${NC}"
check_port 8000 || echo -e "   ${YELLOW}FastAPI backend (port 8000)${NC}"
check_port 5173 || echo -e "   ${YELLOW}Vite frontend (port 5173)${NC}"
echo ""

# Create log directory
mkdir -p logs

# 1. Start FF1000 ML Service
echo -e "${BLUE}🤖 Starting FF1000 ML Service (port 8080)...${NC}"
cd backend/FF1000
source venv/bin/activate
nohup python -c "from server.api import app; import os; os.environ['LOG_LEVEL'] = 'INFO'; app.run(host='0.0.0.0', port=8080)" > ../../logs/ff1000.log 2>&1 &
FF1000_PID=$!
deactivate
cd ../..
echo -e "${GREEN}   PID: $FF1000_PID${NC}"

# Wait for FF1000 to be ready
if ! wait_for_service "http://localhost:8080/health" "FF1000 ML Service"; then
    echo -e "${RED}Failed to start FF1000. Check logs/ff1000.log${NC}"
    exit 1
fi

# 2. Start FastAPI Backend
echo -e "${BLUE}🚀 Starting FastAPI Backend (port 8000)...${NC}"
cd backend
source venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
deactivate
cd ..
echo -e "${GREEN}   PID: $BACKEND_PID${NC}"

# Wait for backend to be ready
if ! wait_for_service "http://localhost:8000/api/ml/status" "FastAPI Backend"; then
    echo -e "${RED}Failed to start backend. Check logs/backend.log${NC}"
    kill $FF1000_PID 2>/dev/null
    exit 1
fi

# 3. Start React Frontend
echo -e "${BLUE}💻 Starting React Frontend (port 5173)...${NC}"
cd frontend
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}   PID: $FRONTEND_PID${NC}"

# Wait for frontend to be ready
if ! wait_for_service "http://localhost:5173" "React Frontend"; then
    echo -e "${RED}Failed to start frontend. Check logs/frontend.log${NC}"
    kill $FF1000_PID $BACKEND_PID 2>/dev/null
    exit 1
fi

# Save PIDs to file for easy shutdown
echo "$FF1000_PID" > .pids
echo "$BACKEND_PID" >> .pids
echo "$FRONTEND_PID" >> .pids

# Final status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ All Services Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}🌐 Service URLs:${NC}"
echo -e "   Frontend:     ${GREEN}http://localhost:5173${NC}"
echo -e "   Backend API:  ${GREEN}http://localhost:8000${NC}"
echo -e "   FF1000 ML:    ${GREEN}http://localhost:8080${NC}\n"

echo -e "${BLUE}📝 Logs:${NC}"
echo -e "   tail -f logs/frontend.log"
echo -e "   tail -f logs/backend.log"
echo -e "   tail -f logs/ff1000.log\n"

echo -e "${BLUE}🛑 To stop all services:${NC}"
echo -e "   ./stop_all.sh\n"

echo -e "${YELLOW}⚡ Opening browser in 3 seconds...${NC}"
sleep 3
open http://localhost:5173

