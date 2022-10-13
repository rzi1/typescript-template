import { NS } from '@ns';
export async function main(ns: NS) {
  while (true) {
    ns.print(getRootServers(ns));
    await ns.sleep(1000);
  }
}
export function getRootServers(ns: NS): string[] {
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
