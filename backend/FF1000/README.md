# FF1000

TODO

## How to start the server

```
docker build -t recs-pretrained . && docker run --rm recs-pretrained
```

## How it works

We load the embeddings - with those we enable three pieces of personality:
 - Recommended for you (with variance explained by embeddings)
 - Not for me (with the variance explained also by embeddings)
 - Similarity (based entirely on the cosine distance between embeddings)

# Pretrained Recommender Service - API Usage Guide

This service exposes three recommendation models:

- `nfm`
- `rfy`
- `similarity`

Each model is accessible through a simple JSON-based HTTP API.
The server listens on **port 8080** by default.

---

# 🔮 Predict Endpoint Usage

This section describes how to call the `POST /predict/<model_name>` endpoint to
obtain predictions from the pretrained models.

---

## Endpoint

```
POST /predict/<model_name>
Content-Type: application/json
```

**Path parameter:**
- `<model_name>` - one of:
  - `nfm`
  - `rfy`
  - `similarity`

**Request body format:**

```json
{
  "items": [
    "item_id_1",
    "item_id_2"
  ]
}
```

**Response body format:**

```json
{
  "model": "rfy",
  "predictions": [...]
}
```

**Example request (not for me):**

```bash
curl -s -X POST http://localhost:8080/predict/nfm \
  -H "Content-Type: application/json" \
  -d '{
        "items": [
          "ab553cdc-e15d-4597-b65f-bec9201fd2dd"
        ]
      }'
```

**Example request (recommended for me):**

```bash
curl -s -X POST http://localhost:8080/predict/rfy \
  -H "Content-Type: application/json" \
  -d '{
        "items": [
          "ab553cdc-e15d-4597-b65f-bec9201fd2dd"
        ]
      }'
```

**Example request (similar):**

This does take a list of items but the expected calling pattern typically is to
just pass 1.

```bash
curl -s -X POST http://localhost:8080/predict/similarity \
  -H "Content-Type: application/json" \
  -d '{
        "items": [
          "ab553cdc-e15d-4597-b65f-bec9201fd2dd"
        ]
      }'
```
