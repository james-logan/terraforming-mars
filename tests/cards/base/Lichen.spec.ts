import {expect} from 'chai';
import {Lichen} from '../../../src/cards/base/Lichen';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Lichen', function() {
  let card : Lichen; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Lichen();
    player = TestPlayers.BLUE.newPlayer();
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -24;
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
