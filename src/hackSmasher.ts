import { NS, Server } from '@ns';
import { getRootServers, getTimeString } from 'utils.js';
export async function main(ns: NS) {
  //   ns.disableLog('ALL');
  var server: Server = ns.getServer(ns.args[0].toString());
  var target: string = server.hostname;
  while (true) {
    ns.tprintf('%s --- Hacking %s', getTimeString(), target);
    await hack(ns, server);
  }
}

async function hack(ns: NS, server: Server) {
  var target = server.hostname;
  var hackScript = '/BatchScripts/hack.js';
  let hackThreads = 100;
  var pids = await serveThreads(ns, hackScript, hackThreads, target);
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
        break;
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
