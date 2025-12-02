import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin


class ScoresToDict(BaseEstimator, TransformerMixin):
    def __init__(self, item_ids, titles, posters=None, premiere_years=None):
        self.item_ids = list(item_ids)
        self.titles = list(titles)
        self.posters = list(posters) if posters is not None else [None] * len(item_ids)
        self.premiere_years = list(premiere_years) if premiere_years is not None else [None] * len(item_ids)

    def fit(self, X, y=None):
        return self

    def transform(self, scores_matrix):
        scores_matrix = np.asarray(scores_matrix, dtype=np.float64)
        B, N = scores_matrix.shape
        out = []
        for b in range(B):
            out.append({
                "item_ids": self.item_ids,
                "scores": scores_matrix[b].tolist(),
            })
        return out

    def predict(self, scores_matrix, limit=10):
        scores_matrix = np.asarray(scores_matrix, dtype=np.float64)
        B, N = scores_matrix.shape
        out = []
        for b in range(B):
            scores = scores_matrix[b]
            idx = np.argsort(-scores)[:limit]   # descending top-k
            out.append({
                "item_ids": [self.item_ids[i] for i in idx],
                "titles": [self.titles[i] for i in idx],
                "posters": [self.posters[i] for i in idx],
                "premiere_years": [self.premiere_years[i] for i in idx],
                "scores": scores[idx].tolist(),
            })
        return out
