"""
FF1000 Recommendation Service - Hugging Face Spaces Entry Point
"""
import os
import sys
import logging

# Set up logging
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    stream=sys.stdout,
)
log = logging.getLogger("ff1000-hf")

# Import the Flask app from server.api
from server.api import app

# Hugging Face Spaces expects the app to be available as 'app'
# The app will be run by the Spaces infrastructure

if __name__ == "__main__":
    # For local testing
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port, debug=False)

