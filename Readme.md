> # Data Collector Api
>
> -## Description
>
> This project is a **node js** project build in **typeScript**.
> I built it to only collect sport data for another usage. Therefore, the server will not accept request
> on other routes than **"/"** and will return the current data if so or an error.
> They data are scraped from several sources on the web.

> -## Scrapping the data
>
> I first of all fectch the html using node fectch a non-blocking way then use cheerio to load the response to html.
> I then parse the html to extract the needed data before saving the result into my mongo atlas db

> -## Who is this for
>
> Anyone looking to collect live sport data can clone and use this repo.

> -## Usage

> Before pushing to production, make sure you install all the dependances and add the needed variables to your process
> environment. 
	
