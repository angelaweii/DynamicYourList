import numpy as np
from sklearn.base import BaseEstimator


class BayesianRecommender(BaseEstimator):
    def __init__(self,
                 item_embeddings: np.ndarray,
                 lambda_reg: float = 1.0,
                 sigma2: float = 1.0,
                 z: float = -1.1645,  # -1.645=<10% LCB
                 mask_value: float = -np.inf):

        self.item_embeddings = np.asarray(item_embeddings, dtype=np.float64)
        self.N_, self.d_ = self.item_embeddings.shape

        self.lambda_reg = float(lambda_reg)
        self.sigma2 = float(sigma2)
        self.z = float(z)
        self.mask_value = mask_value

        self.X_items = self.item_embeddings
        self.XT_items = self.item_embeddings.T

    def fit(self, X=None, y=None):
        return self

    def _user_posterior_and_scores(self, y_vec: np.ndarray):
        seen_mask = y_vec != 0
        X_obs = self.X_items[seen_mask]
        y_obs = y_vec[seen_mask].astype(np.float64)
        A = self.lambda_reg * np.eye(self.d_, dtype=np.float64) + (X_obs.T @ X_obs) / self.sigma2
        invA = np.linalg.inv(A)
        mu = invA @ (X_obs.T @ y_obs) / self.sigma2

        m = self.X_items @ mu
        XinvA = self.X_items @ invA
        s2 = np.einsum('ij,ij->i', XinvA, self.X_items)
        s = np.sqrt(np.clip(s2, 0.0, None))

        scores = m + self.z * s
        scores[seen_mask] = self.mask_value

        return scores

    def transform(self, X):
        X = np.asarray(X, dtype=np.float64)
        if X.ndim == 1:
            X = X[None, :]

        B, N = X.shape
        if N != self.N_:
            raise ValueError(f"Input width {N} != number of items {self.N_}.")

        out = np.empty((B, N), dtype=np.float64)
        for b in range(B):
            out[b] = self._user_posterior_and_scores(X[b])
        return out
