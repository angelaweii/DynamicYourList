import json
import pandas as pd
import os


class EmbeddingsDataLoader:
    def __init__(
        self,
        filepath=None,
    ):
        if filepath is None:
            # Use relative path from this file's location
            current_dir = os.path.dirname(os.path.abspath(__file__))
            filepath = os.path.join(current_dir, '..', 'prefetched', 'embeddings.csv.gz')
        self.filepath = filepath

    def load(self) -> pd.DataFrame:
        df = pd.read_csv(self.filepath, compression='gzip')
        df.embedding = df.embedding.apply(lambda vec: [float(v) for v in json.loads(vec)])
        return df
