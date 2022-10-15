import { getRootServers } from 'utils.js';
import { NS, Player, Server } from '@ns';
export async function main(ns: NS) {
  // Requires target to be prepped before running
  var host: Server = ns.getServer('home');
  var target: Server = ns.getServer('silver-helix');
  var player: Player = ns.getPlayer();
  var hackScript = '/BatchScripts/hack.js';
  var growScript = '/BatchScripts/grow.js';
  var weakenScript = '/BatchScripts/weaken.js';
  var hackRam = ns.getScriptRam(hackScript, target.hostname);
  var growRam = ns.getScriptRam(growScript, target.hostname);
  var weakenRam = ns.getScriptRam(weakenScript, target.hostname);
  let hackAmount = 0.2;
  ns.tprint(target);
  // 50ms Hack 50ms -> Weaken 50ms-> Grow 50ms-> Weaken
  // Determin hack threads to get 40% of server funds
  var hackThreads = Math.floor(
    hackAmount / ns.formulas.hacking.hackPercent(target, player)
  );

  //how much security will increase from hack
  var hackSecurityIncrease = ns.hackAnalyzeSecurity(
    hackThreads,
    target.hostname
  );
  // How much to weaken after hack
  let hackWeakenThreads = Math.ceil(
    (target.minDifficulty * (1 + hackSecurityIncrease)) / ns.weakenAnalyze(1)
  );
  //grow to counter hack
  var stolenMoney = target.moneyMax * hackAmount;
  var increaseNeeded = target.moneyMax / (target.moneyMax - stolenMoney);
  let growThreads = ns.growthAnalyze(target.hostname, increaseNeeded);
  // How much to weaken after grow
  var growSecurityIncrease = ns.growthAnalyzeSecurity(
    growThreads,
    target.hostname,
    1
  );
  //weaken to counter grow
  let growWeakenThreads = Math.ceil(
    (target.minDifficulty * (1 + growSecurityIncrease)) / ns.weakenAnalyze(1)
  );
  var totalRequiredRam =
    hackThreads * hackRam +
    (hackWeakenThreads + growWeakenThreads) * weakenRam +
    growRam * growThreads;
  ns.tprintf(
    'Hack Threads: %d || Hack Weaken Threads:  %d || Grow Threads: %d || Grow Weaken Threads: %d || Total RAM Required: %d GB',
    hackThreads,
    hackWeakenThreads,
    growThreads,
    growWeakenThreads,
    totalRequiredRam
  );
}

function getFreeRam(ns: NS, server: string) {
  return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
}
