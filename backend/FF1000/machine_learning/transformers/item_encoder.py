import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import MultiLabelBinarizer


class ItemIdOneHotEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, all_item_ids):
        self.all_item_ids = list(all_item_ids)
        self._mlb = MultiLabelBinarizer(classes=self.all_item_ids)

    def fit(self, X, y=None):
        self._mlb.fit([[]])
        return self

    def transform(self, X):
        M = self._mlb.transform(X).astype(np.float64)
        return M

    @property
    def vocab_(self):
        return self.all_item_ids
