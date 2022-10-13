import { NS, Player, Server } from '@ns';
var target = 'phantasy';
var host = 'home';
export async function main(ns: NS) {
  var maxMoney = ns.getServerMaxMoney(target);
  var minSecurity = ns.getServerMinSecurityLevel(target);
  while (true) {
    var player = ns.getPlayer();
    var server = ns.getServer(target);
    if (ns.getServerSecurityLevel(target) > minSecurity) {
      await handleWeaken(ns, server, player, minSecurity);
    } else if (ns.getServerMoneyAvailable(target) < maxMoney) {
      await handleGrow(ns, server, player, maxMoney);
    } else {
      await handleHack(ns, server, player);
    }
  }
}

async function handleWeaken(
  ns: NS,
  server: Server,
  player: Player,
  minSecurity: number
) {
  var weakenScript = '/BatchScripts/weaken.js';
  // Weaken is a 1:1 per thread, Add 1 to ensure we fully knock out the security to minimum
  let weakenThreads = Math.floor(
    (ns.getServerSecurityLevel(target) - minSecurity) / ns.weakenAnalyze(1, 2) +
      1
  );
  ns.exec(
    weakenScript,
    host,
    await checkThreads(ns, weakenThreads, weakenScript),
    target
  );
  await ns.sleep(ns.formulas.hacking.weakenTime(server, player) + 500);
}

async function handleGrow(
  ns: NS,
  server: Server,
  player: Player,
  maxMoney: number
) {
  var growScript = '/BatchScripts/grow.js';
  var increaseNeeded =
    maxMoney / (ns.getServerMoneyAvailable(target) / maxMoney);
  let growThreads = ns.growthAnalyze(target, increaseNeeded, 2);
  ns.exec(
    growScript,
    host,
    await checkThreads(ns, growThreads, growScript),
    target
  );
  await ns.sleep(ns.formulas.hacking.growTime(server, player) + 500);
}

async function handleHack(ns: NS, server: Server, player: Player) {
  // calculate number of threads to hack 20% of server money
  var hackScript = '/BatchScripts/hack.js';
  let hackThreads = Math.floor(
    0.2 / ns.formulas.hacking.hackPercent(server, player)
  );

  ns.exec(
    hackScript,
    host,
    await checkThreads(ns, hackThreads, hackScript),
    target
  );
  await ns.sleep(ns.formulas.hacking.hackTime(server, player) + 500);
}

async function checkThreads(
  ns: NS,
  threads: number,
  script: string
): Promise<number> {
  var serverFreeRam = getFreeRam(ns, host);
  var scriptRam = ns.getScriptRam(script, host);
  var neededRam = scriptRam * threads;
  while (serverFreeRam < scriptRam) {
    await ns.sleep(1000);
    serverFreeRam = getFreeRam(ns, host);
  }
  if (neededRam > serverFreeRam) {
    return Math.floor(serverFreeRam / scriptRam);
  } else {
    return threads;
  }
}

function getFreeRam(ns: NS, server: String) {
  return ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
}
