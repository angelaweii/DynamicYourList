@echo off
REM Dynamic My List - Start Script (Windows)
REM Starts both frontend and backend servers

echo 🚀 Starting Dynamic My List...
echo.

REM Check if we're in the correct directory
if not exist "frontend" (
    echo ❌ Error: Please run this script from the DynamicMyList root directory
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: Please run this script from the DynamicMyList root directory
    exit /b 1
)

REM Start backend
echo 📦 Starting backend server...
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
start /b python main.py
cd ..

REM Wait for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend
echo ⚛️  Starting frontend server...
cd frontend
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)
start /b npm run dev
cd ..

echo.
echo ✅ Servers started successfully!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔌 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop both servers
echo.

pause

