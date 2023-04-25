# Facial Recognition Login PoC

This is another implementation of legendary [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) to create a "FaceID-like" facial recoginition and login system.

**What it roughly does is:**

- It allows you to sign up with your face and a PII of your choice (your name&surname).
- Client-side application (React.js) posts your image to the backend APIs (runs express.js) which then extracts your facial embeddings and records them into the database as a float32 array.

**When you try to login;** 
- You scan your face and post your image.
- Backend APIs process your image, extract your facial embeddings and match them with other records in the database by using "Euclidean Distance". This is done by excellent [pgvector](https://github.com/pgvector/pgvector) plug-in for PostgreSQL.
- If a match below 0.5 is found, it'll return you your PII.

## Running

### Setting up the DB

You'll need a PostgreSQL DB with [pgvector](https://github.com/pgvector/pgvector) installed, I used the [bit.io](http://bit.io/) and enabled the extension by `CREATE EXTENSION vector;`  command. Then create a table with three columns:

- id (int)
- biometrics (JSON)
- name_surname (text)

(Sorry for not providing any migrations, perhaps in the future)

### Installation
Make sure you create the `.env` files under both apps per `env.sample.txt` files provided.
Run `yarn install` under `apps/web` to install the dependencies.

### Running Locally

A `docker-compose.yml` is provided. You can up the containers as simply as by giving the following command in the root directory:
```
docker-compose up -d
```
To review the logs, use the following command:
```
docker-compose logs --follow
```

### Running for Development

Although [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) is an excellent project, it's pretty old and up-to-date versions of Node.js doesn't run it properly, so I containerized it with Docker to overcome the dependency issues. 

So I suggest you run the server with Docker all times by issuing the following command:
```
docker-compose start api 
```
If you haven't created the containers earlier, then you can simply issue `docker-compose create` it'll create the containers for you.

To make code changes on the backend APIs, you either need to:
- Rebuild&restart the containers on each change by giving `docker-compose build api` and `docker-compose restart api` respectively.
- Or alter the `docker-compose.yml` to mount the `src` folder instead of copying it upon build.

Once the server is up&running, you can start the development server for the client-side project by giving the following command:
```
turbo start
```
(I used [Turbo Repo](https://turbo.build/repo) to manage the mono-repo setup)

Once the React development server is up, you can make code changes on the client-side code.

### Releasing

Run `yarn release` to release a new version, works best if you use conventional commits.

## Frequently Asked Questions

**Why does it run so slow?**
It's because there is a version problem and the application cannot load the TFJS bindings for Node.js