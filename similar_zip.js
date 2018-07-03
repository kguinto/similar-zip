const targetZipCode = process.argv[2];

if (!targetZipCode || !Number.isInteger(+targetZipCode)) {
  console.log(
    `usage:\tnode similar_zip.js <zip code> [--population <weight>]
    \t\t[--wealthDist <weight>] [--genderDist <weight>]`
  );
  return;
}

const data = require('./data/data.js');
const { mapToPercentages, scoreZip } = require('./helpers');

const weights = {
  population: 3.4,
  wealthDist: 1.2,
  genderDist: 1
};

// set weights using flags
if (process.argv.length > 3) {
  for (let i = 3; i < process.argv.length; i += 2) {
    if (process.argv[i + 1]) {
      if (process.argv[i] === '--population')
        weights.population = +process.argv[i + 1];
      if (process.argv[i] === '--wealthDist')
        weights.wealthDist = +process.argv[i + 1];
      if (process.argv[i] === '--genderDist')
        weights.genderDist = +process.argv[i + 1];
    }
  }
}

const targetZip = {
  zipCode: targetZipCode,
  data: data[targetZipCode],
  ...mapToPercentages(data[targetZipCode]) // genderDist, wealthDist
};

const mostSimilar = [];

for (zipCode in data) {
  let score = scoreZip(
    targetZip,
    {
      zipCode,
      data: data[zipCode],
      ...mapToPercentages(data[zipCode]) // genderDist, wealthDist
    },
    weights
  );

  if (zipCode !== targetZipCode)
    mostSimilar.push({ zipCode, data: data[zipCode], score });

  mostSimilar.sort((a, b) => b.score - a.score);

  if (mostSimilar.length > 10) mostSimilar.pop();
}

console.log(
  mostSimilar.reduce(
    (string, z, i) =>
      string + `\t${i + 1}.\t${z.zipCode}, ${z.score.toFixed(1)}\n`,
    ''
  )
);
