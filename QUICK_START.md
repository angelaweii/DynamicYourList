# 🚀 Quick Start - FF1000 ML Integration

## Prerequisites Checklist

- [x] FF1000 repository cloned to `backend/FF1000` ✅
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] pip/pip3 available
- [ ] npm available

## Step-by-Step Setup

### 1️⃣ Install Python Dependencies

```bash
# Install backend dependencies
cd backend
pip3 install -r requirements.txt

# Install FF1000 dependencies
cd FF1000
pip3 install -r requirements.txt
cd ../..
```

Expected packages:
- Backend: `fastapi`, `uvicorn`, `pydantic`, `requests`
- FF1000: `joblib`, `numpy`, `pandas`, `scikit-learn`, `Flask`

### 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3️⃣ Start All Services

```bash
./start_all.sh
```

This will:
- ✅ Check ports 8080, 8000, 5173
- ✅ Start FF1000 ML Service
- ✅ Start FastAPI Backend  
- ✅ Start React Frontend
- ✅ Open browser automatically

### 4️⃣ Test the Integration

1. Browser should open to http://localhost:5173
2. You should see your rails with tiles
3. Click **"More Like This"** on any tile
4. Should see 2 new tiles appear with real ML recommendations!
5. Click **"Something Else"** on any tile
6. Should see tile replaced with teal-green gradient

### 5️⃣ Stop All Services

```bash
./stop_all.sh
```

## 🔍 Verification

### Check if ML service is working:
```bash
curl http://localhost:8000/api/ml/status
```

Expected response:
```json
{
  "is_available": true,
  "base_url": "http://localhost:8080",
  "cached_items": 0
}
```

If `is_available: false`, the system will use fallback recommendations (still works!).

## 🐛 Troubleshooting

### Issue: Port already in use
```bash
# Find and kill process on port
lsof -ti:8080 | xargs kill
lsof -ti:8000 | xargs kill
lsof -ti:5173 | xargs kill
```

### Issue: FF1000 won't start
```bash
# Check logs
tail -f logs/ff1000.log

# Try manual start
cd backend/FF1000
python3 -c "from server.api import app; app.run(host='0.0.0.0', port=8080)"
```

### Issue: "Module not found" errors
```bash
# Reinstall dependencies
cd backend
pip3 install -r requirements.txt --force-reinstall

cd FF1000
pip3 install -r requirements.txt --force-reinstall
```

### Issue: Frontend can't reach backend
```bash
# Verify backend is running
curl http://localhost:8000/api/health

# Check browser console for CORS errors
# Ensure frontend is on http://localhost:5173 (not 127.0.0.1)
```

## 📚 Documentation

- **`ML_INTEGRATION_GUIDE.md`** - Complete technical documentation
- **`INTEGRATION_SUMMARY.md`** - High-level overview and what was done
- **`README.md`** - Original project documentation

## 🎯 What to Test

### ✅ Core ML Features:
- [ ] "More Like This" returns relevant titles
- [ ] "Something Else" returns different titles
- [ ] Replaced tiles have teal-green gradient
- [ ] New tiles appear with elastic reveal animation

### ✅ Existing Features (Still Work):
- [ ] Drag and drop to reorder tiles
- [ ] Remove tile shows banner with undo
- [ ] Replace tile shows banner with undo
- [ ] Independent rails (actions don't affect other rail)
- [ ] All design system styling intact

### ✅ Fallback Mode:
1. Stop FF1000 service: `lsof -ti:8080 | xargs kill`
2. Restart backend: It will detect FF1000 is down
3. Try "More Like This" - should still work with mock data
4. Check status: `curl http://localhost:8000/api/ml/status` (should show `is_available: false`)

## 🎉 Success!

If you can:
1. ✅ Start all services with `./start_all.sh`
2. ✅ See the frontend load
3. ✅ Click "More Like This" and see ML recommendations
4. ✅ Click "Something Else" and see different recommendations
5. ✅ All animations and UI features work

**You're done! The ML integration is working perfectly! 🚀**

## 📞 Need Help?

Check the logs:
```bash
tail -f logs/ff1000.log      # ML service logs
tail -f logs/backend.log     # FastAPI logs
tail -f logs/frontend.log    # React logs
```

Or review the detailed documentation:
- `ML_INTEGRATION_GUIDE.md` for architecture and API docs
- `INTEGRATION_SUMMARY.md` for what was changed

---

**Ready to go? Run: `./start_all.sh`** 🚀

