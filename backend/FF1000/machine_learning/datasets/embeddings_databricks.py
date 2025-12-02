import pandas as pd
from pyspark.sql.session import SparkSession


EMBEDDINGS_SQL = """
SELECT DISTINCT
  e.item_id,
  s.seriesMainTitle AS title,
  e.embedding
FROM
  {item_embeddings} e
INNER JOIN
  {s2s_content_entities} s
  ON e.item_id = s.unpackedValue.series.id.id
INNER JOIN
  {series_offering_dim} off
ON
  s.unpackedValue.series.id.id = off.series_id
  AND SIZE(ARRAY_INTERSECT(off.country_codes, ARRAY('US'))) > 0
WHERE
  date = (SELECT MAX(date) FROM bolt_recs_prod.gold.item_embeddings)
  AND n_dimensions = 1536
"""


class EmbeddingsDataLoader:
    def __init__(
        self,
        env: str = "prod",
        spark_session: SparkSession = None,
        item_embeddings: str = "bolt_recs_prod.gold.item_embeddings",
        s2s_content_entities: str = "bolt_cep_prod.gold.s2s_content_entities",
        series_offering_dim: str = "bolt_dai_ckg_prod.gold.series_offering_dim",
    ):
        if not spark_session:
            spark_session = SparkSession.builder.appName(
                "embeddings"
            ).getOrCreate()

        self._env = env
        self._spark_session = spark_session
        self._table_names = {
            "item_embeddings": item_embeddings,
            "s2s_content_entities": s2s_content_entities,
            "series_offering_dim": series_offering_dim,
        }

    def load(self) -> pd.DataFrame:
        query = EMBEDDINGS_SQL.format(**self._table_names)
        return self._spark_session.sql(query).toPandas()
