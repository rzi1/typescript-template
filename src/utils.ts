import { NS } from '@ns';

export function getTargets(ns: NS): string[] {
  ns.disableLog('ALL');
  var servers = getRemoteServers(ns);
  var viableTargets = servers.filter(server => ns.hasRootAccess(server));
  var player = ns.getPlayer();
  var targetsList: string[] = [];
  for (var target of viableTargets) {
    var { hostname, moneyMax, requiredHackingSkill } = ns.getServer(target);
    if (player.skills.hacking > requiredHackingSkill * 2 && moneyMax > 0) {
      targetsList.push(hostname);
    }
  }
  return targetsList;
}

export function getRemoteServers(ns: NS): string[] {
  ns.disableLog('ALL');
  var checked: string[] = [];
  var ownedServers = ns.getPurchasedServers();
  var toCheck = [];
  var serverList = [];
  var serversDepth0 = ns.scan('home');
  for (var server in serversDepth0) {
    var newServer = serversDepth0[server];
    if (!checked.includes(newServer) && !ownedServers.includes(newServer)) {
      toCheck.push(newServer);
      serverList.push(newServer);
    }
  }
  checked.push('home');
  while (toCheck.length > checked.length) {
    for (var server in toCheck) {
      var toCheckServer = toCheck[server];
      if (!checked.includes(toCheckServer)) {
        checked.push(toCheckServer);
        var newServers = ns.scan(toCheckServer);
        for (var server in newServers) {
          var newServer = newServers[server];
          if (!checked.includes(newServer)) {
            toCheck.push(newServer);
            serverList.push(newServer);
          }
        }
      }
    }
  }
  return serverList;
}

export function getRootServers(ns: NS): string[] {
  ns.disableLog('ALL');
  var checked: string[] = [];
  var rootServerList: string[] = ns.getPurchasedServers();
  var toCheck = [];
  var allServerList = [];
  var serversDepth0 = ns.scan('home');
  for (var server in serversDepth0) {
    var newServer = serversDepth0[server];
    if (!checked.includes(newServer) && !rootServerList.includes(newServer)) {
      toCheck.push(newServer);
      allServerList.push(newServer);
      if (ns.hasRootAccess(newServer) && ns.getServerMaxRam(newServer) > 0) {
        rootServerList.push(newServer);
      }
    }
  }
  checked.push('home');
  while (toCheck.length > checked.length) {
    for (var server in toCheck) {
      var toCheckServer = toCheck[server];
      if (!checked.includes(toCheckServer)) {
        checked.push(toCheckServer);
        var newServers = ns.scan(toCheckServer);
        for (var server in newServers) {
          var newServer = newServers[server];
          if (!checked.includes(newServer)) {
            toCheck.push(newServer);
            allServerList.push(newServer);
            if (
              ns.hasRootAccess(newServer) &&
              ns.getServerMaxRam(newServer) > 0
            ) {
              rootServerList.push(newServer);
            }
          }
        }
      }
    }
  }
  rootServerList.push('home');
  return rootServerList;
}

export function getTimeString(): string {
  var now = new Date();
  return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}
