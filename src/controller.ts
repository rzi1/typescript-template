import { NS, Player, Server } from '@ns';
import { getRootServers } from 'getRootServers.js';
export async function main(ns: NS) {
  ns.disableLog('ALL');
  var target: any = ns.args[0];
  var maxMoney = ns.getServerMaxMoney(target);
  var minSecurity = ns.getServerMinSecurityLevel(target);
  var player = ns.getPlayer();
  var server = ns.getServer(target);
  while (true) {
    if (ns.getServerSecurityLevel(target) > minSecurity) {
      await handleWeaken(ns, server, player, minSecurity, target);
    } else if (ns.getServerMoneyAvailable(target) < maxMoney) {
      await handleGrow(ns, server, player, maxMoney, target);
    } else {
      await handleHack(ns, server, player, target);
    }
  }
}

async function handleWeaken(
  ns: NS,
  server: Server,
  player: Player,
  minSecurity: number,
  target: string
) {
  var weakenScript = '/BatchScripts/weaken.js';
  let weakenThreads = Math.floor(
    (ns.getServerSecurityLevel(target) - minSecurity) / ns.weakenAnalyze(1, 2) +
      1
  );
  await serveThreads(ns, weakenScript, weakenThreads, target);
  await ns.sleep(ns.formulas.hacking.weakenTime(server, player) + 500);
}

async function handleGrow(
  ns: NS,
  server: Server,
  player: Player,
  maxMoney: number,
  target: string
) {
  var growScript = '/BatchScripts/grow.js';
  var increaseNeeded =
    maxMoney / (ns.getServerMoneyAvailable(target) / maxMoney);
  let growThreads = ns.growthAnalyze(target, increaseNeeded, 2);
  await serveThreads(ns, growScript, growThreads, target);
  await ns.sleep(ns.formulas.hacking.growTime(server, player) + 500);
}

async function handleHack(
  ns: NS,
  server: Server,
  player: Player,
  target: string
) {
  // calculate number of threads to hack 20% of server money
  var hackScript = '/BatchScripts/hack.js';
  let hackThreads = Math.floor(
    0.2 / ns.formulas.hacking.hackPercent(server, player)
  );

  await serveThreads(ns, hackScript, hackThreads, target);
  await ns.sleep(ns.formulas.hacking.hackTime(server, player) + 500);
}

async function serveThreads(
  ns: NS,
  script: string,
  requiredThreads: number,
  target: string
) {
  var remainingThreads = requiredThreads;
  var rootedServers = getRootServers(ns);
  while (remainingThreads > 0) {
    for (var server in rootedServers) {
      ns.printf(
        'Attempting to serve %d threads of %s %d remaining',
        requiredThreads,
        script,
        remainingThreads
      );
      ns.scp(script, rootedServers[server]);
      remainingThreads -= attemptExec(
        ns,
        rootedServers[server],
        script,
        remainingThreads,
        target
      );
      if (remainingThreads <= 0) {
        ns.printf(
          'Succeeded serving %d threads of %s',
          requiredThreads,
          script,
          remainingThreads
        );
        break;
      }
    }
    await ns.sleep(50);
  }
}
function attemptExec(
  ns: NS,
  server: string,
  script: string,
  threads: number,
  target: string
): number {
  var servable = checkThreads(ns, threads, script, server);
  if (servable > 0) {
    ns.exec(script, server, servable, target);
    return servable;
  } else {
    return 0;
  }
}
function checkThreads(
  ns: NS,
  threads: number,
  script: string,
  server: string
): number {
  var serverFreeRam = getFreeRam(ns, server);
  var scriptRam = ns.getScriptRam(script, 'home');
  var requiredRam = scriptRam * threads;
  if (serverFreeRam < scriptRam) {
    return 0;
  }
  if (requiredRam > serverFreeRam) {
    return Math.floor(serverFreeRam / scriptRam);
  } else {
    return threads;
  }
}

function getFreeRam(ns: NS, server: string) {
  return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
}
