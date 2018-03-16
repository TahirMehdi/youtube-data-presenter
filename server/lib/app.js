const express = require("express"),
  bodyParser = require("body-parser"),
  pgp = require("pg-promise");

const postgresInitOptions = {
  connect: client => {
    const cp = client.connectionParameters;
    console.log("Connected to database", cp.database);
  },
  disconnect: client => {
    const cp = client.connectionParameters;
    console.log("Disconnecting from database", cp.database);
  },
  error: err => {
    console.error("Database error", err);
  }
};

const postgresConnectionOptions = {
  host: "localhost",
  port: 5432,
  database: "admin",
  user: 'postgres',
  password: '1'
};

const db = pgp(postgresInitOptions)(postgresConnectionOptions);
const app = express();
const jsonParser = bodyParser.json();

app.get("/api/hello/world", (req, res) => {
  res
    .json({
      hello: "world"
    })
    .status(200);
});

app.post("/api/json_parsing_test", jsonParser, (req, res) => {
  const keys = Object.keys(req.body);
  res.status(200).send("Got object with keys: " + keys);
});

app.get("/api/postgres_connection_test", (req, res) => {
  db
    .one("SELECT $1::text as message", ["Just checking if we can connect to the database!"])
    .then(result => res.status(200).send(result))
    .catch(error => res.status(500).send(error.message));
});

app.get("/api/search/influencer/:id/:column/:count", function (req, res) {
    const {id, column, count}= req.params;
    const id_mod = id.replace(/ /g, '%');

    /**
     * Tried different ways to implement tag search, for example, the following way:
     * create function commuted_regexp_match(text,text) returns bool as
        'select $2 ILIKE $1;'
        language sql;

        create operator ### (
        procedure=commuted_regexp_match(text,text),
        leftarg=text, rightarg=text
        );
     *  it can be used like: WHERE '${id}' ### ANY (tags)) is used instead of WHERE '${id}' = ANY (tags))
     * But this method made request to take a long time, so i ended up with current version
     * */
    db
        .query(`
          SELECT
            ch.*,
            yv.id            AS video_id,
            yv.title         AS video_title,
            yv.description   AS video_description,
            yv.view_count    AS video_view_count,
            yv.comment_count AS video_comment_count,
            yv.like_count    AS video_like_count,
            yv.dislike_count AS video_dislike_count,
            yv.duration      AS video_duration,
            yv.tags          AS video_tags,
            yv.published     AS video_published
          FROM
            (SELECT id
             FROM youtube_channel_example
             WHERE name ILIKE '%${id_mod}%'
             UNION
             SELECT channel_id AS id
             FROM youtube_video_example
             WHERE '${id}' = ANY (tags)
                    OR title ILIKE '%${id_mod}%')
              AS un
            JOIN youtube_channel_example AS ch
              ON ch.id = un.id
            LEFT JOIN
            (SELECT
               channel_id,
               MAX(id) AS video_id
             FROM youtube_video_example
             GROUP BY channel_id
            ) AS vo
              ON ch.id = vo.channel_id
            INNER JOIN youtube_video_example AS yv
              ON vo.video_id = yv.id
            ORDER BY ch.${column} DESC
          LIMIT ${count}
  `)
        .then(result => res.status(200).send(console.warn(result)||result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/search/influencer/top/:column/:count", function (req, res) {
  const {column, count} = req.params;
    db
        .query(`
          SELECT
            ch.*,
            yv.id            AS video_id,
            yv.title         AS video_title,
            yv.description   AS video_description,
            yv.view_count    AS video_view_count,
            yv.comment_count AS video_comment_count,
            yv.like_count    AS video_like_count,
            yv.dislike_count AS video_dislike_count,
            yv.duration      AS video_duration,
            yv.tags          AS video_tags,
            yv.published     AS video_published
          FROM youtube_channel_example AS ch
            LEFT JOIN
            (SELECT
               channel_id,
               MAX(id) AS video_id
             FROM youtube_video_example
             GROUP BY channel_id
            ) AS vo
              ON ch.id = vo.channel_id
            INNER JOIN youtube_video_example AS yv
              ON vo.video_id = yv.id
          ORDER BY ch.${column} DESC
          LIMIT ${count}
      `)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/add/influencer/:collection/:influencer", function (req, res) {
   const {collection, influencer} = req.params;
    db.one(`
        INSERT INTO influencer_collection_example (collection_id, influencer_id)
        VALUES (${collection}, '${influencer}')
        RETURNING influencer_id
      `)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/remove/influencer/:collection/:influencer", function (req, res) {
    const {collection, influencer} = req.params;
    db.result(`
        DELETE FROM influencer_collection_example
        WHERE collection_id = '${collection}' AND influencer_id = '${influencer}' 
    `)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/get/influencer/:collection", function (req, res) {
    const {collection} = req.params;
    db.query(`
          SELECT
            ch.*,
            yv.id            AS video_id,
            yv.title         AS video_title,
            yv.description   AS video_description,
            yv.view_count    AS video_view_count,
            yv.comment_count AS video_comment_count,
            yv.like_count    AS video_like_count,
            yv.dislike_count AS video_dislike_count,
            yv.duration      AS video_duration,
            yv.tags          AS video_tags,
            yv.published     AS video_published
          FROM youtube_channel_example AS ch
            RIGHT JOIN
              (SELECT influencer_id as id FROM influencer_collection_example 
                WHERE collection_id = '${collection}') as collection
              ON ch.id = collection.id
            LEFT JOIN
            (SELECT
               channel_id,
               MAX(id) AS video_id
             FROM youtube_video_example
             GROUP BY channel_id
            ) AS vo
              ON ch.id = vo.channel_id
            INNER JOIN youtube_video_example AS yv
              ON vo.video_id = yv.id
          ORDER BY ch.subscriber_count DESC
    `)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/add/collection/:id/:name", function (req, res) {
    const {id, name} = req.params;
    db.one(`INSERT INTO collection_example (id, name) VALUES (${id}, '${name}') RETURNING id`)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/remove/collection/:id", function (req, res) {
    const {id} = req.params;
    db.result(`
        DELETE FROM collection_example
        WHERE id = '${id}' 
    `)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/get/collection/:id", function (req, res) {
    const {id} = req.params;
    db.query(` SELECT * FROM collection_example WHERE id = '${id}'`)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.get("/api/get/collections", function (req, res) {
    db.query(` SELECT * FROM collection_example`)
        .then(result => res.status(200).send(result))
        .catch(error => res.status(500).send(error.message));
});

app.use((req, res) => {
  res.sendStatus(404);
});

const server = app.listen(3001, () => {
  console.log("API server listening on port: " + server.address().port);
});


