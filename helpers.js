const mapToPercentages = zip => {
  const totalPopulation = zip[0];
  const totalHouseholds = zip.slice(3).reduce((acc, x) => acc + x);

  const genderDist = zip
    .slice(1, 3)
    .map(x => (totalPopulation ? (x * 100) / totalPopulation : 0));
  const wealthDist = zip
    .slice(3)
    .map(x => (totalHouseholds ? (x * 100) / totalHouseholds : 0));

  return { genderDist, wealthDist };
};

const scoreZip = (target, current, weights) => {
  let score = 100;

  target.genderDist.forEach((percentage, i) => {
    let ratio =
      Math.min(percentage, current.genderDist[i]) /
      Math.max(percentage, current.genderDist[i]);

    score -= (1 - ratio) * weights.genderDist;
  });

  target.wealthDist.forEach((percentage, i) => {
    let ratio =
      Math.min(percentage, current.wealthDist[i]) /
      Math.max(percentage, current.wealthDist[i]);

    score -= (1 - ratio) * weights.wealthDist;
  });

  const populationRatio =
    Math.min(target.data[0], current.data[0]) /
    Math.max(target.data[0], current.data[0]);

  score -= (1 - populationRatio) * weights.population;

  return score;
};

module.exports = { mapToPercentages, scoreZip };
