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
  var target = server.hostname;
  var weakenScript = '/BatchScripts/weaken.js';
  let weakenThreads = Math.ceil(
    (ns.getServerSecurityLevel(target) - minSecurity) / ns.weakenAnalyze(1, 2)
  );

  await serveThreads(ns, weakenScript, weakenThreads, target);
  var weakenWaitTime = ns.formulas.hacking.weakenTime(server, player) + 500;
  ns.printf('Waiting %d for weaken to complete', weakenWaitTime);
  await ns.sleep(weakenWaitTime);
}

async function handleGrow(
  ns: NS,
  server: Server,
  player: Player,
  maxMoney: number
) {
  var target = server.hostname;
  var growScript = '/BatchScripts/grow.js';
  var increaseNeeded = maxMoney / ns.getServerMoneyAvailable(target);
  let growThreads = Math.ceil(ns.growthAnalyze(target, increaseNeeded));
  await serveThreads(ns, growScript, growThreads, target);
  var growWaitTime = ns.formulas.hacking.growTime(server, player) + 500;
  ns.printf('Waiting %d for grow to complete', growWaitTime);
  await ns.sleep(growWaitTime);
}

async function handleHack(ns: NS, server: Server, player: Player) {
  // calculate number of threads to hack 20% of server money
  var target = server.hostname;
  var hackScript = '/BatchScripts/hack.js';
  let hackThreads = Math.floor(
    0.5 / ns.formulas.hacking.hackPercent(server, player)
  );

  await serveThreads(ns, hackScript, hackThreads, server.hostname);
  var hackWaitTime = ns.formulas.hacking.hackTime(server, player) + 500;
  ns.printf('Waiting %d for hack to complete', hackWaitTime);
  await ns.sleep(hackWaitTime);
}

async function serveThreads(
  ns: NS,
  script: string,
  requiredThreads: number,
  target: string
) {
  var remainingThreads = requiredThreads;
  var rootedServers = getRootServers(ns);
  ns.printf(
    'Attempting to serve %d threads of %s',
    requiredThreads,
    script,
    remainingThreads
  );
  while (remainingThreads > 0) {
    for (var server in rootedServers) {
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
  if (servable > 0 && getRootServers(ns).includes(server)) {
    ns.exec(script, server, servable, target, 0);
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
