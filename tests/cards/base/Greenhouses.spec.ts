import {expect} from 'chai';
import {Greenhouses} from '../../../src/cards/base/Greenhouses';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('Greenhouses', function() {
  it('Should play', function() {
    const card = new Greenhouses();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.plants).to.eq(0);
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    card.play(player, game);
    expect(player.plants).to.eq(1);
  });
});
