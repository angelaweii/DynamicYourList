import os
import sys
import logging

from typing import Dict, Any
from flask import Flask, request, jsonify
from werkzeug.exceptions import HTTPException
from machine_learning.load_models import (
    not_for_me,
    recommended_for_you,
    similarity,
)


logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    stream=sys.stdout,
)
log = logging.getLogger("ff1000-api")


MODELS: Dict[str, Any] = {
    "nfm": not_for_me,
    "rfy": recommended_for_you,
    "similarity": similarity,
}


def create_app() -> Flask:
    app = Flask(__name__)

    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            return jsonify(error=e.name, message=e.description), e.code
        log.exception("Unhandled exception")
        return jsonify(error="InternalServerError", message=str(e)), 500

    @app.get("/health")
    def healthz():
        return jsonify(status="ok")

    @app.post("/predict/<model_name>")
    def predict(model_name: str):
        if model_name not in MODELS:
            return jsonify(error="UnknownModel", message=f"valid models: {list(MODELS.keys())}"), 400

        try:
            payload = request.get_json(force=True, silent=False)
        except Exception:
            return jsonify(error="InvalidJSON", message="body must be valid JSON"), 400

        if not isinstance(payload, dict) or "items" not in payload:
            return jsonify(error="BadRequest", message="json must have key 'items'"), 400

        inputs = payload["items"]
        if not isinstance(inputs, list):
            return jsonify(error="BadRequest", message="'items' must be a list"), 400

        model = MODELS[model_name]
        try:
            preds = model.predict([inputs])
        except Exception as e:
            log.exception("Prediction failed")
            return jsonify(error="PredictionError", message=str(e)), 500

        return jsonify(model=model_name, predictions=preds)

    return app


app = create_app()
