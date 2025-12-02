import numpy as np

from sklearn.pipeline import Pipeline

from machine_learning.datasets.embeddings_csv import EmbeddingsDataLoader
from machine_learning.models.rfy import BayesianRecommender
from machine_learning.models.similarity import SimilarityRecommender
from machine_learning.transformers.inverter import Inverter
from machine_learning.transformers.item_encoder import ItemIdOneHotEncoder
from machine_learning.transformers.scores_to_dict import ScoresToDict


catalog = EmbeddingsDataLoader().load()
embeddings = np.array(catalog.embedding.tolist())
posters = catalog.poster if 'poster' in catalog.columns else None
premiere_years = catalog.premiere_year if 'premiere_year' in catalog.columns else None

recommended_for_you = Pipeline([
    ('encoder', ItemIdOneHotEncoder(catalog.item_id)),
    ('ranker', BayesianRecommender(embeddings)),
    ('scores_to_dict', ScoresToDict(catalog.item_id, catalog.title, posters, premiere_years)),
]).fit([])

not_for_me = Pipeline([
    ('encoder', ItemIdOneHotEncoder(catalog.item_id)),
    ('inverter', Inverter()),
    ('ranker', BayesianRecommender(embeddings)),
    ('scores_to_dict', ScoresToDict(catalog.item_id, catalog.title, posters, premiere_years)),
]).fit([])

similarity = Pipeline([
    ('encoder', ItemIdOneHotEncoder(catalog.item_id)),
    ('ranker', SimilarityRecommender(embeddings)),
    ('scores_to_dict', ScoresToDict(catalog.item_id, catalog.title, posters, premiere_years)),
]).fit([])
