from sklearn.base import BaseEstimator, TransformerMixin


class Inverter(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, scores_matrix):
        return -scores_matrix
