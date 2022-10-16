import { NS } from '@ns';
var baseName = 'purchased-';
export async function main(ns: NS) {
  ns.disableLog('ALL');
  var maxServers = ns.getPurchasedServerLimit();
  const minRam = 8;
  let curRam: number = minRam;
  const maxRam = 65536; /// 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536
  var buying = true;
  while (buying) {
    var servers = ns.getPurchasedServers();
    if (servers.length < maxServers) {
      initialPurchase(ns, curRam, servers.length, maxServers);
    } else {
      curRam = getRam(ns, servers, curRam, maxRam);
      attemptUpgrades(ns, servers, curRam);
    }
    if (curRam > maxRam) {
      buying = false;
      ns.tprint('Completed buying and upgrading all servers');
    }
    await ns.sleep(20000);
  }
}

function initialPurchase(
  ns: NS,
  ram: number,
  servers: number,
  maxServers: number
) {
  for (var i = servers; i < maxServers; i++) {
    if (canPurchase(ns, ram)) {
      ns.purchaseServer(formatName(ram, i), ram);
    }
  }
}

function getRam(
  ns: NS,
  servers: string[],
  curRam: number,
  maxRam: number
): number {
  for (var i = 0; i < servers.length; i++) {
    var serverRam = ns.getServerMaxRam(servers[i]);
    if (serverRam < curRam) {
      return curRam;
    }
  }
  ns.printf('Completed purchasing servers with %d RAM upgrading now', curRam);
  return curRam * 2;
}

function attemptUpgrades(ns: NS, servers: string[], curRam: number) {
  for (var i = 0; i < servers.length; i++) {
    var hostname = servers[i];
    var serverRam = ns.getServerMaxRam(servers[i]);
    if (serverRam < curRam) {
      handleUpgrade(ns, curRam, hostname, i);
    }
  }
}

function handleUpgrade(ns: NS, ram: number, hostname: string, index: number) {
  if (canPurchase(ns, ram)) {
    ns.printf('Purchasing Server with %d RAM', ram);
    ns.killall(hostname);
    ns.deleteServer(hostname);
    ns.purchaseServer(hostname, ram);
  }
}

function canPurchase(ns: NS, ram: number): boolean {
  return ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram);
}

function formatName(ram: number, index: number): string {
  return baseName + index;
}
