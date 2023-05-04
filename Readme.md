# Soccer Data Collector

A free, easy-to-use soccer data collector built with Nodejs-express.

## Data Collector API

### Languages and Frameworks

1. TypeScript
2. Cheerio
3. Express

### Description

This project is a Node.js application built in TypeScript. It is designed to collect sports data for other uses. The server only accepts requests on the root route (`/`) and returns the current data or an error.

The data is scraped from various sources on the web.

### Scraping the Data

The HTML is fetched using `axios`, a non-blocking approach. Then, `cheerio` is used to load the response into HTML. The HTML is parsed to extract the required data before saving the result to a MongoDB Atlas database.

### Who is this for

Anyone looking to collect live sports data can clone and use this repository.

### Usage

Before deploying to production, make sure to install all dependencies and add the required variables to your environment:

1. `SOCCER_DATA_URL="https://www.espn.com/soccer/scoreboard"`
2. `MONGO_URI=YOUR_MONGO_URI_GOES_HERE`
3. `NODE_ENV="development"` (for development)
4. `PORT=3001`
