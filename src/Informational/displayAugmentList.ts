import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  // will need to wait for singularity whatever that is
  var player = ns.getPlayer();
  var factions = player.factions;
  for (var faction of factions) {
    var augments = ns.singularity.getAugmentationsFromFaction(faction);
    ns.tprint(faction, augments);
  }
}
