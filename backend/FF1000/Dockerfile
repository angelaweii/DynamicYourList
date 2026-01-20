FROM python:3.11-slim

# Set environment variables
ENV PYTHONPATH="/app"
ENV PYTHONUNBUFFERED=1

# Create non-root user for Hugging Face Spaces
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR /app

# Copy requirements first for better caching
COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy application code
COPY --chown=user:user . .

# Expose port (7860 for HF Spaces, can be overridden)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:7860/health || exit 1

# Start the server
# Use single worker to minimize memory usage
CMD ["python", "-m", "gunicorn", "-b", "0.0.0.0:7860", "--workers", "1", "--threads", "2", "--timeout", "120", "server.api:app"]
