import { NS } from '@ns';
import { getRootServers } from 'utils.js';
export async function main(ns: NS) {
  var servers = getRootServers(ns);
  for (var server in servers) {
    if (servers[server] !== 'home') {
      ns.killall(servers[server]);
    }
  }
}
