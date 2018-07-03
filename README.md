Given a zip code, this script calculates the ten most similar zip codes by population, gender distribution, and wealth distribution.

**IMPORTANT**: Configure `data/api.config.js` to export the API key.

Run the script with `node similar_zip.js <zip code>`.

Optionally, run the script with `[--population <weight>] [--wealthDist <weight>] [--genderDist <weight>]` to set weight for population, wealth distibution, and gender distribution conditions manually.
