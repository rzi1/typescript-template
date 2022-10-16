import { NS } from '@ns';
export async function main(ns: NS) {
  ns.disableLog('ALL');
  while (true) {
    let nodes = getNodes(ns);
    await buyNodes(ns, nodes);
    await checkBuy(ns, nodes);
    await ns.sleep(20000);
  }
}

async function checkBuy(ns: NS, nodes: number) {
  for (var i = 0; i < nodes; i++) {
    var { cores, level, ram } = ns.hacknet.getNodeStats(i);
    await buyLevels(ns, i, level);
    await buyRam(ns, i, ram);
    await buyCores(ns, i, cores);
  }
}

async function buyNodes(ns: NS, nodes: number) {
  var maxNodesToPurchase = 20;
  var buyFlag = maxNodesToPurchase > getNodes(ns);
  while (buyFlag) {
    if (canBuy(ns, ns.hacknet.getPurchaseNodeCost())) {
      ns.hacknet.purchaseNode();
      buyFlag = maxNodesToPurchase > getNodes(ns);
    } else {
      buyFlag = false;
    }
    await ns.sleep(100);
  }
}

async function buyLevels(ns: NS, node: number, level: number) {
  let maxLevel = 200;
  var buyFlag = level < maxLevel;
  while (buyFlag) {
    if ((canBuy(ns, ns.hacknet.getLevelUpgradeCost(node, 1)), 3)) {
      ns.hacknet.upgradeLevel(node, 1);
      var { level } = ns.hacknet.getNodeStats(node);
      buyFlag = level < maxLevel;
    } else {
      buyFlag = false;
    }
    await ns.sleep(100);
  }
}

async function buyRam(ns: NS, node: number, ram: number) {
  let maxRam = 64;
  var buyFlag = ram < maxRam;
  while (buyFlag) {
    if ((canBuy(ns, ns.hacknet.getRamUpgradeCost(node, 1)), 3)) {
      ns.hacknet.upgradeRam(node, 1);
      var { ram } = ns.hacknet.getNodeStats(node);
      buyFlag = ram < maxRam;
    } else {
      buyFlag = false;
    }
    await ns.sleep(100);
  }
}

async function buyCores(ns: NS, node: number, cores: number) {
  let maxCores = 16;
  var buyFlag = cores < maxCores;
  while (buyFlag) {
    if ((canBuy(ns, ns.hacknet.getCoreUpgradeCost(node, 1)), 3)) {
      ns.hacknet.upgradeCore(node, 1);
      var { cores } = ns.hacknet.getNodeStats(node);
      buyFlag = cores < maxCores;
    } else {
      buyFlag = false;
    }
    await ns.sleep(100);
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
