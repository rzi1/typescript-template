import { NS } from '@ns';

export function getTargets(ns: NS): string[] {
  ns.disableLog('ALL');
  var servers = getRemoteServers(ns);
  var player = ns.getPlayer();
  return servers.filter(
    server =>
      ns.hasRootAccess(server) &&
      ns.getServerMaxMoney(server) > 0 &&
      player.skills.hacking > ns.getServerRequiredHackingLevel(server) * 2
  );
}

export function getRemoteServers(ns: NS): string[] {
  ns.disableLog('ALL');
  var allServerList = getAllServers(ns);
  var ownedServers = ns.getPurchasedServers();
  ownedServers.push('home');
  return allServerList.filter(server => !ownedServers.includes(server));
}

export function getRootServers(ns: NS): string[] {
  ns.disableLog('ALL');
  var allServerList = getAllServers(ns);
  return allServerList.filter(server => ns.hasRootAccess(server));
}

export function getTimeString(): string {
  var now = new Date();
  return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}

export function getAllServers(
  ns: NS,
  root: string = 'home',
  serverList: string[] = []
) {
  ns.disableLog('ALL');
  if (!serverList.includes(root)) {
    serverList.push(root);
    for (var server of ns.scan(root)) {
      if (!serverList.includes(server)) {
        getAllServers(ns, server, serverList);
      }
    }
  }
  return serverList;
}
