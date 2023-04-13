require('@tensorflow/tfjs')

const express = require('express')
const { Pool } = require('pg')
const faceapi = require('face-api.js')
const app = express()
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.PGSSL
})
const multer  = require('multer')
const upload = multer({storage: multer.memoryStorage()})
const canvas = require('canvas')

// Setup logging
const loggerOptions = {
  level: process.env.LOGLEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
};
const pinoHttp = require('pino-http')(loggerOptions)
const logger = require('pino')(loggerOptions)
app.use(pinoHttp)

//Set up canvas anda face-api
const { Canvas, Image, ImageData, loadImage } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

async function loadUserPhoto(userPhoto) {
  try {
    const img = await loadImage(userPhoto);
    return img;
  } catch (e) {
    throw Error('Error loading image');
  }
}

async function detectFace(img) {
  const detections = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  const descriptors = detections
    ? Object.values(detections.descriptor)
    : [];
  return descriptors;
}

app.post('/register', upload.single('user_photo'), async function (req, res, next) {
  const descriptors = await detectFace(await loadUserPhoto(req.file.buffer));
  if(descriptors.length) {
    const result = await pool
      .query(
        'INSERT INTO "users" ("name_surname", "biometrics") VALUES ($1, $2) RETURNING *',
        [req.body.name_surname, JSON.stringify(descriptors)]
      )
      .then((res) => res.rows[0].name_surname)
      .catch((e) => req.log.error(e));
    res.json({nameSurname: result});
  }
  else {
    res.log.info('No vectors found in the image for user: ' + req.body.name_surname);
    res.status(403).send({error: 'No vectors found in the image.'})
  }
})

app.post('/signin', upload.single('user_photo'), async function (req, res, next) {
  const descriptors = await detectFace(await loadUserPhoto(req.file.buffer));
  if(descriptors.length) {
    const result = await pool
      .query(
        'SELECT * FROM (SELECT name_surname, l2_distance(biometrics::text::vector, $1) as distance FROM users) AS distances WHERE distance <= $2 ORDER BY distance ASC LIMIT 1',
        [JSON.stringify(descriptors), process.env.RECOGNITION_TRESHOLD]
      )
      .then((res) => res.rows[0])
      .catch((e) => req.log.error(e));
    if(result) {
      res.log.debug(result);
      res.json(result);  
    }
    else {
      res.status(403).send({error: 'No matches found in the database.'});
    }
  }
  else {
    res.log.info('No vectors found in the image for user: ' + req.body.name_surname);
    res.status(403).send({error: 'No vectors found in the image.'})
  }
})

;(async () => { // for ; at the beginning see: https://github.com/expressjs/express/issues/3515#issuecomment-353738007
  const initModels = async () => {
    try {
      const ssdMobilenetv1Method = faceapi.nets.ssdMobilenetv1.loadFromDisk(`./weights`)
      const faceLandmark68NetMethod = faceapi.nets.faceLandmark68Net.loadFromDisk(`./weights`)
      const faceRecognitionNetMethod = faceapi.nets.faceRecognitionNet.loadFromDisk(`./weights`)
      await ssdMobilenetv1Method
      await faceLandmark68NetMethod
      await faceRecognitionNetMethod
      return true;
    }
    catch (error) {
      logger.error('Models failed to load: ' + error)
      return false
    }
  }
  if (await initModels()) {
    app.listen(4000);
    logger.info(`Running a GraphQL API server at http://localhost:4000/graphql`);
  }
})();