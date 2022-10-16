import { NS } from '@ns';

export async function main(ns: NS) {
  var infiltrationLocations = ns.infiltration.getPossibleLocations();
  var targets = [];
  for (var location of infiltrationLocations) {
    var infiltration = ns.infiltration.getInfiltration(location.name);
    var difficulty = infiltration.difficulty;
    if (difficulty < 4) {
      targets.push(infiltration);
    }
  }
  targets = targets.sort(function (a, b) {
    return a.reward.tradeRep - b.reward.tradeRep;
  });
  for (var target of targets) {
    ns.tprintf(
      'name: %s city: %s difficulty: %d rep: %d',
      target.location.name,
      target.location.city,
      target.difficulty,
      target.reward.tradeRep
    );
  }
}
