---
title: FF1000 Recommendation Service
emoji: 🎬
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
---

# FF1000 - ML Recommendation Service

A pretrained recommendation service for content discovery, providing similarity-based and personalized recommendations.

## API Endpoints

### Health Check
```
GET /health
```
Returns `{"status": "ok"}` when the service is running.

### Predict Endpoint
```
POST /predict/<model_name>
Content-Type: application/json
```

**Available models:**
- `similarity` - Find similar content based on embeddings
- `rfy` - "Recommended for you" personalized recommendations  
- `nfm` - "Not for me" content filtering

**Request body:**
```json
{
  "items": ["item_id_1", "item_id_2"]
}
```

**Response:**
```json
{
  "model": "similarity",
  "predictions": [
    {
      "item_ids": ["..."],
      "titles": ["..."],
      "scores": [0.95, 0.87, ...],
      "posters": ["https://...", ...],
      "premiere_years": [2023, 2022, ...]
    }
  ]
}
```

## Example Usage

```bash
curl -X POST https://YOUR-SPACE.hf.space/predict/similarity \
  -H "Content-Type: application/json" \
  -d '{"items": ["ab553cdc-e15d-4597-b65f-bec9201fd2dd"]}'
```

## Architecture

The service loads pre-computed embeddings and serves three recommendation models:
- **Similarity**: Cosine distance between content embeddings
- **RFY**: Variance-explained recommendations for personalization
- **NFM**: Negative preference modeling

Built with Flask and scikit-learn.
