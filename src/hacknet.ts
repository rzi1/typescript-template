import { NS } from '@ns';
export async function main(ns: NS) {
  ns.disableLog('ALL');
  while (true) {
    let nodes = getNodes(ns);
    buyNodes(ns, nodes);
    checkBuy(ns, nodes);
    await ns.sleep(20000);
  }
}

function checkBuy(ns: NS, nodes: number) {
  for (var i = 0; i < nodes; i++) {
    var { cores, level, ram } = ns.hacknet.getNodeStats(i);
    buyLevels(ns, i, level);
    buyRam(ns, i, ram);
    buyCores(ns, i, cores);
  }
}

function buyNodes(ns: NS, nodes: number) {
  var maxNodesToPurchase = 20;
  while (maxNodesToPurchase > nodes) {
    if (canBuy(ns, ns.hacknet.getPurchaseNodeCost())) {
      ns.hacknet.purchaseNode();
    }
    nodes = getNodes(ns);
  }
}

function buyLevels(ns: NS, node: number, level: number) {
  let maxLevel = 80;
  while (level < maxLevel) {
    if ((canBuy(ns, ns.hacknet.getLevelUpgradeCost(node, 1)), 3)) {
      ns.hacknet.upgradeLevel(node, 1);
      var { level } = ns.hacknet.getNodeStats(node);
    }
  }
}

function buyRam(ns: NS, node: number, ram: number) {
  let maxRam = 16;
  while (ram < maxRam) {
    if ((canBuy(ns, ns.hacknet.getRamUpgradeCost(node, 1)), 3)) {
      ns.hacknet.upgradeRam(node, 1);
      var { ram } = ns.hacknet.getNodeStats(node);
    }
  }
}

function buyCores(ns: NS, node: number, cores: number) {
  let maxCores = 8;
  while (cores < maxCores) {
    if ((canBuy(ns, ns.hacknet.getCoreUpgradeCost(node, 1)), 3)) {
      ns.hacknet.upgradeCore(node, 1);
      var { cores } = ns.hacknet.getNodeStats(node);
    }
  }
}

function getNodes(ns: NS): number {
  return ns.hacknet.numNodes();
}

function canBuy(ns: NS, cost: number, multiplier?: number): boolean {
  if (multiplier) {
    return ns.getServerMoneyAvailable('home') > cost * multiplier;
  }
  return ns.getServerMoneyAvailable('home') > cost;
}
