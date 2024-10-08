import { SuiButton, SuiButtonParams } from './button';
import { BrowserEventSource } from '../eventSource';
declare var $: any;

/**
 * These are the quick-buttons that show up on the left of the button ribbon.
 * @category SuiButton
 */
export class DisplaySettings extends SuiButton {
  constructor(parameters: SuiButtonParams) {
    super(parameters);
    if (this.buttonData.id === 'selectPart') {
      this.eventSource.bindScoreChangeHandler(this, 'handleScoreChange');
      this.enablePartSelection();
    }
  }
  enablePartSelection() {
    const partMap = this.view.getPartMap();
    const disable = partMap.keys.length < 1;
    $(this.buttonElement[0]).prop('disabled', disable);
  }
  handleScoreChange(ev: any) {
    if (this.view.isPartExposed()) {
      this.buttonData.rightText = this.view.score.staves[0].partInfo.partName;
    } else {
      this.buttonData.rightText = 'Select Part';
    }
    $(this.buttonElement[0]).find('.ribbon-button-hotkey').text(this.buttonData.rightText);
    this.enablePartSelection();
  }

  refresh() {
    this.view.refreshViewport();
  }
  zoomout() {
    const globalLayout = this.view.score.layoutManager!.getGlobalLayout();
    globalLayout.zoomScale *= 1.1;
    this.view.updateZoom(globalLayout.zoomScale);
  }
  zoomin() {
    const globalLayout = this.view.score.layoutManager!.getGlobalLayout();
    globalLayout.zoomScale = globalLayout.zoomScale / 1.1;
    this.view.updateZoom(globalLayout.zoomScale);
  }
  playButton2() {
    this.view.playFromSelection();
  }
  stopButton2() {
    this.view.stopPlayer();
  }
  async selectPart() {
    if (!this.completeNotifier) {
      return;
    }
    await this.view.renderPromise();
    this.menus.slashMenuMode(this.completeNotifier);
    this.menus.createMenu('SuiPartSelectionMenu');
  }
  bind() {
    this.eventSource.domClick(this.buttonElement, this, this.buttonData.id, null);
  }
}
