import {expect} from 'chai';
import {AerospaceMission} from '../../../src/cards/community/AerospaceMission';
import {ColonyName} from '../../../src/colonies/ColonyName';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('AerospaceMission', function() {
  let card : AerospaceMission; let player : Player; let game : Game;

  beforeEach(function() {
    card = new AerospaceMission();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(2);

    const selectColony = game.deferredActions.next()!.execute() as SelectColony;
    game.deferredActions.shift();
    selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[0].name.toUpperCase()]);

    const selectColony2 = game.deferredActions.next()!.execute() as SelectColony;
    game.deferredActions.shift();
    selectColony2.cb((<any>ColonyName)[selectColony2.coloniesModel[0].name.toUpperCase()]);

    const openColonies = game.colonies.filter((colony) => colony.isActive);
    expect(openColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
    expect(openColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;
  });
});
