import { NS, Server } from '@ns';
import { getRootServers, getTimeString } from 'utils.js';
export async function main(ns: NS) {
  // use earlier to
  // ns.disableLog('ALL');
  while (true) {
    var server: Server = ns.getServer(ns.args[0].toString());
    var target: string = server.hostname;
    var minSecurity = ns.getServerMinSecurityLevel(target);
    var maxMoney: number = ns.getServerMaxMoney(target);
    var currentMoney: number = ns.getServerMoneyAvailable(target);
    var currentSec: number = ns.getServerSecurityLevel(target);
    ns.tprintf(
      'Current Security: %s -- Min Security: %s',
      currentSec,
      minSecurity
    );
    ns.tprintf('Max Money: %s -- Current Money: %s', maxMoney, currentMoney);
    if (ns.getServerSecurityLevel(target) > minSecurity) {
      ns.tprintf('%s --- Weakening --- XP Smasher', getTimeString());
      await handleWeaken(ns, server, minSecurity);
    } else if (currentMoney < maxMoney) {
      ns.tprintf('%s --- Growing --- XP Smasher', getTimeString());
      await handleGrow(ns, server, maxMoney);
    } else {
      ns.tprintf(
        '%s --- Max Growth/Min Sec --- XP Smasher --- %s',
        getTimeString(),
        target
      );
    }
  }
}

async function handleWeaken(ns: NS, server: Server, minSecurity: number) {
  var target = server.hostname;
  var weakenScript = '/BatchScripts/weaken.js';
  let weakenThreads = Math.ceil(
    (ns.getServerSecurityLevel(target) - minSecurity) / ns.weakenAnalyze(1, 2)
  );
  var pids = await serveThreads(ns, weakenScript, weakenThreads, target);
  await waitPids(ns, pids);
}

async function handleGrow(ns: NS, server: Server, maxMoney: number) {
  var target = server.hostname;
  var growScript = '/BatchScripts/grow.js';
  var increaseNeeded = maxMoney / (ns.getServerMoneyAvailable(target) + 1);
  let growThreads = Math.ceil(ns.growthAnalyze(target, increaseNeeded));
  var pids = await serveThreads(ns, growScript, growThreads, target);
  await waitPids(ns, pids);
}

async function serveThreads(
  ns: NS,
  script: string,
  requiredThreads: number,
  target: string
): Promise<number[]> {
  var remainingThreads = requiredThreads;
  var rootedServers = getRootServers(ns);
  var pids: number[] = [];
  ns.printf(
    '%s - Attempting to serve %d threads of %s',
    getTimeString(),
    requiredThreads,
    script
  );
  while (remainingThreads > 0) {
    for (var server in rootedServers) {
      ns.scp(script, rootedServers[server]);

      var [servedThreads, pid] = attemptExec(
        ns,
        rootedServers[server],
        script,
        remainingThreads,
        target
      );
      if (pid == 0) {
        continue;
      } else {
        pids.push(pid);
        remainingThreads -= servedThreads;
      }

      if (remainingThreads <= 0) {
        ns.printf(
          '%s - Succeeded serving %d threads of %s',
          getTimeString(),
          requiredThreads,
          script
        );
        break;
      } else {
        ns.printf(
          '%s - %d %s threads served \n %d remaining',
          getTimeString(),
          servedThreads,
          script,
          remainingThreads
        );
      }
    }

    await ns.sleep(50);
  }
  return pids;
}

function attemptExec(
  ns: NS,
  server: string,
  script: string,
  threads: number,
  target: string
): number[] {
  // refactor to send pid back so we can use at start of the augment
  var servable = checkThreads(ns, threads, script, server);
  if (servable > 0 && getRootServers(ns).includes(server)) {
    var pid = ns.exec(script, server, servable, target, 0);
    return [servable, pid];
  } else {
    return [0, 0];
  }
}
function checkThreads(
  ns: NS,
  threads: number,
  script: string,
  server: string
): number {
  var serverFreeRam = getFreeRam(ns, server);
  var scriptRam = ns.getScriptRam(script, server);
  if (server == 'home') {
    serverFreeRam -= 128;
    if (serverFreeRam < 0) {
      return 0;
    }
  }
  var servable = Math.floor(serverFreeRam / scriptRam);
  if (servable <= 0) {
    return 0;
  }
  if (servable > threads) {
    return threads;
  }
  return servable;
}

function getFreeRam(ns: NS, server: string) {
  return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
}

async function waitPids(ns: NS, pids: number[]) {
  var running = true;
  while (running) {
    running = false;
    for (const pid of pids) {
      const process = ns.getRunningScript(pid);
      if (process != undefined) {
        running = true;
        break;
      }
      await ns.sleep(20);
    }
    await ns.sleep(50);
  }
}
