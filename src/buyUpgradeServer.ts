import { NS } from '@ns';
export async function main(ns: NS) {
  var servers = ns.getPurchasedServers();
  var ram = 1024;
  for (var server in servers) {
    var server = servers[server];
    if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
      ns.deleteServer(server);
      ns.purchaseServer(server + '-' + ram + 'RAM', ram);
    }
  }
}
