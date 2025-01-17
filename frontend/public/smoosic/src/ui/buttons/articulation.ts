import { SuiButton, SuiButtonParams } from './button';
import { SmoArticulation, SmoOrnament } from '../../smo/data/noteModifiers';
declare var $: any;


export class ArticulationButtons extends SuiButton {
  static get articulationIdMap(): Record<string, string> {
    return {
      accentButton: SmoArticulation.articulations.accent,
      tenutoButton: SmoArticulation.articulations.tenuto,
      staccatoButton: SmoArticulation.articulations.staccato,
      marcatoButton: SmoArticulation.articulations.marcato,
      pizzicatoButton: SmoArticulation.articulations.pizzicato,
      fermataButton: SmoArticulation.articulations.fermata,
      mordentButton: SmoOrnament.ornaments.mordent,
      mordentInvertedButton: SmoOrnament.ornaments.mordentInverted,
      trillButton: SmoOrnament.ornaments.trill,
      breathButton: 'breath',
      caesuraButton: 'caesura',
      pedalOpenButton: 'pedalOpen',
      pedalClosedButton: 'pedalClosed',
      scoopButton: SmoOrnament.ornaments.scoop,
      dropButton: SmoOrnament.ornaments.fall_short,
      dropLongButton: SmoOrnament.ornaments.dropLong,
      doitButton: SmoOrnament.ornaments.doit,
      doitLongButton: SmoOrnament.ornaments.doitLong,
      flipButton: SmoOrnament.ornaments.flip,
      smearButton: SmoOrnament.ornaments.smear
    };
  }
  static get constructors(): Record<string, string> {
    return {
      accentButton: 'SmoArticulation',
      tenutoButton: 'SmoArticulation',
      staccatoButton: 'SmoArticulation',
      marcatoButton: 'SmoArticulation',
      pizzicatoButton: 'SmoArticulation',
      fermataButton: 'SmoArticulation',
      mordentButton: 'SmoOrnament',
      mordentInvertedButton: 'SmoOrnament',
      trillButton: 'SmoOrnament',
      breathButton: 'SmoOrnament',
      pedalOpenButton: 'SmoOrnament',
      pedalClosedButton: 'SmoOrnament',
      caesuraButton: 'SmoOrnament',
      scoopButton: 'SmoOrnament',
      dropButton: 'SmoOrnament',
      dropLongButton: 'SmoOrnament',
      doitButton: 'SmoOrnament',
      doitLongButton: 'SmoOrnament',
      flipButton: 'SmoOrnament',
      smearButton: 'SmoOrnament',
    };
  }
  articulation: string;
  ctor: string;
  showState: boolean = false;
  constructor(parameters: SuiButtonParams) {
    super(parameters);
    this.articulation = ArticulationButtons.articulationIdMap[this.buttonData.id];
    this.ctor = ArticulationButtons.constructors[this.buttonData.id];
  }
  _toggleArticulation() {
    this.showState = !this.showState;
    this.view.toggleArticulation(this.articulation, this.ctor);
  }
  bind() {
    this.eventSource.domClick(this.buttonElement, this, '_toggleArticulation', null);
  }
}
