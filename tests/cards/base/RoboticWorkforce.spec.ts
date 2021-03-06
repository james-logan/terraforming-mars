import {expect} from 'chai';
import {CapitalAres} from '../../../src/cards/ares/CapitalAres';
import {SolarFarm} from '../../../src/cards/ares/SolarFarm';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {Capital} from '../../../src/cards/base/Capital';
import {FoodFactory} from '../../../src/cards/base/FoodFactory';
import {NoctisFarming} from '../../../src/cards/base/NoctisFarming';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('RoboticWorkforce', function() {
  let card : RoboticWorkforce; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RoboticWorkforce();
    player = TestPlayers.BLUE.newPlayer();
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play if no building cards to copy', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should throw', function() {
    player.playedCards.push(new FoodFactory(), new BiomassCombustors(), card);
    expect(card.canPlay(player, game)).is.not.true;
    const action = card.play(player, game);
    expect(action).is.undefined;
  });

  it('Should play', function() {
    const noctisFarming = new NoctisFarming();
    player.playedCards.push(noctisFarming);

    const action = card.play(player, game);
    expect(action).is.not.undefined;
    action!.cb([noctisFarming]);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Should work with capital', function() {
    const capital = new Capital();
    player.playedCards.push(capital);

    const action = card.play(player, game);
    expect(action).is.undefined; // Not enough energy production

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player, game);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([capital]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with Capital (Ares expansion)', function() {
    game = new Game('foobar', [player, player], player, ARES_OPTIONS_NO_HAZARDS);
    const capitalAres = new CapitalAres();
    player.playedCards.push(capitalAres);

    const action = card.play(player, game);
    expect(action).is.undefined; // Not enough energy production

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player, game);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([capitalAres]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with Solar Farm (Ares expansion)', function() {
    game = new Game('foobar', [player, player], player, ARES_OPTIONS_NO_HAZARDS);
    const solarFarm = new SolarFarm();

    // This space should have 2 plants bonus on default map
    const solarFarmSpace = game.board.getAvailableSpacesOnLand(player)[18];
    expect(solarFarmSpace.bonus).has.lengthOf(2);
    expect(solarFarmSpace.bonus.every((b) => b === SpaceBonus.PLANT)).is.true;

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    const action = solarFarm.play(player, game);
    expect(action).is.not.undefined;
    action!.cb(solarFarmSpace);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);

    player.playedCards.push(solarFarm);

    const selectCard = card.play(player, game);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([solarFarm]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(4);
  });

  it('Should play with corporation cards', function() {
    const corporationCard = new UtopiaInvest();
    player.corporationCard = corporationCard;

    const action = card.play(player, game);
    expect(action).is.not.undefined;

    expect(player.getProduction(Resources.STEEL)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
    action!.cb([corporationCard as any]);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
