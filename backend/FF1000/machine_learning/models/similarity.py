import numpy as np
from sklearn.base import BaseEstimator


class SimilarityRecommender(BaseEstimator):
    def __init__(self,
                 item_embeddings: np.ndarray,
                 mask_value: float = -np.inf):

        E = np.asarray(item_embeddings, dtype=np.float64)
        self.item_embeddings = E / np.linalg.norm(E, axis=1, keepdims=True)
        self.N_, self.d_ = self.item_embeddings.shape
        self.mask_value = mask_value

    def fit(self, X=None, y=None):
        return self

    def transform(self, X):
        X = np.asarray(X, dtype=np.float64)
        U = X @ self.item_embeddings
        U /= np.linalg.norm(U, axis=1, keepdims=True)
        scores = U @ self.item_embeddings.T
        scores[X != 0] = self.mask_value
        return scores
