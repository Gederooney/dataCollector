A free easy to use soccer data collector made with puppeteer

> ### Data Collector Api
>
> - Languages and frameworks
>	1. Typescript
>	2. Cheerio
>	3. Express
>
> - Description
>
> This project is a **node js** project build in **typeScript**.
> I built it to only collect sport data for another usage. Therefore, the server will not accept request
> on other routes than **"/"** and will return the current data if so or an error.
> They data are scraped from several sources on the web.

> - Scrapping the data
>
> I first of all fetch the html using node axios a non-blocking way, then use cheerio to load the response to html.
> I then parse the html to extract the needed data before saving the result into my mongo atlas db

> - Who is this for
>
> Anyone looking to collect live sport data can clone and use this repo.

> - Usage

> Before pushing to production, make sure you install all the dependances and add the needed variables to your process
> environment.
> - 
>	1. SOCCER_DATA_URL="https://www.espn.com/soccer/scoreboard".
> 	2. MONGO_URI= YOUR_MONGO_URI_GOES_HERE
>	3. NODE_ENV="development" ==> for dev
> 	4. PORT=3001
