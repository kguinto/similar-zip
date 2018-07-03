const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const { API_KEY } = require('./api.config');

const writeBetterFile = () => {
  if (fs.existsSync('./data/data.js')) return;

  const data = require('./original-data');

  readline.clearLine(process.stdout);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write('Writing data.js...');

  fs.writeFileSync('data/data.js', `module.exports = { `);

  data.forEach((zip, i) => {
    if (i >= 1)
      fs.appendFileSync(
        'data/data.js',
        `${zip[zip.length - 1]}: ${JSON.stringify(
          zip.slice(0, zip.length - 1).map(x => +x)
        )}, `
      );
  });

  fs.appendFileSync('data/data.js', ` }`);

  readline.clearLine(process.stdout);
  readline.cursorTo(process.stdout, 0);
};

if (!fs.existsSync('./data/original-data.js')) {
  process.stdout.write('Fetching API data...');
  axios
    .get(
      `https://api.census.gov/data/2015/acs5?get=B01003_001E,B01001_002E,B01001_026E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E&for=zip+code+tabulation+area:*&key=${API_KEY}`
    )
    .then(res => {
      readline.clearLine(process.stdout);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('Writing original-data.js...');

      fs.writeFileSync('./data/original-data.js', `module.exports = [`);

      res.data.forEach((array, i) => {
        if (i >= 1)
          fs.appendFileSync(
            './data/original-data.js',
            JSON.stringify(array) + ','
          );
      });

      fs.appendFileSync('./data/original-data.js', `]`);

      writeBetterFile();
    })
    .catch(e => console.log(e));
} else {
  writeBetterFile();
}
