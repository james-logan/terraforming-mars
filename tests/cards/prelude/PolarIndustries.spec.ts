import {expect} from 'chai';
import {PolarIndustries} from '../../../src/cards/prelude/PolarIndustries';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';


describe('PolarIndustries', function() {
  it('Should play', function() {
    const card = new PolarIndustries();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
