// [Smoosic](https://github.com/AaronDavidNewman/Smoosic)
// Copyright (c) Aaron David Newman 2021.
import { SmoMusic } from '../data/music';
import { SmoNote } from '../data/note';
import { SmoAttrs, getId } from '../data/common';
import { SmoMeasure, ISmoBeamGroup } from '../data/measure';
import { TickMap } from './tickMap';
import { smoSerialize } from '../../common/serializationHelpers';

export interface SmoBeamGroupParams {
  notes: SmoNote[],
  voice: number
}

/**
 * Contain a group of {@link SmoNote} used for beaming.
 * @internal
 */
export class SmoBeamGroup implements ISmoBeamGroup {
  notes: SmoNote[];
  attrs: SmoAttrs;
  voice: number = 0;
  constructor(params: SmoBeamGroupParams) {
    let i = 0;
    this.voice = params.voice;
    this.notes = params.notes;
    smoSerialize.vexMerge(this, params);

    this.attrs = {
      id: getId().toString(),
      type: 'SmoBeamGroup'
    };
    for (i = 0; i < this.notes.length; ++i) {
      const note = this.notes[i];
      if (note.tickCount < 4096) {
        note.beam_group = this.attrs;
      }
    }
  }
}

/**
 * Apply the beam policy set up in node and measure to group the notes into beam groups
 * @category SmoTransform
 */
export class SmoBeamer {
  static applyBeams(measure: SmoMeasure) {
    let i = 0;
    let j = 0;
    for (i = 0; i < measure.voices.length; ++i) {
      const beamer = new SmoBeamer(measure, i);
      const tickmap = measure.tickmapForVoice(i);
      for (j = 0; j < tickmap.durationMap.length; ++j) {
        beamer.beamNote(tickmap, j, measure.voices[i].notes[j]);
      }
    }
  }
  measure: SmoMeasure;
  duration: number;
  meterNumbers: number[];
  beamBeats: number;
  skipNext: number;
  currentGroup: SmoNote[];
  constructor(measure: SmoMeasure, voice: number) {
    this.measure = measure;
    this._removeVoiceBeam(measure, voice);
    this.duration = 0;
    this.meterNumbers = [measure.timeSignature.actualBeats, measure.timeSignature.beatDuration];
    // beam on 1/4 notes in most meter, triple time dotted quarter
    this.beamBeats = 2 * 2048;
    if (this.meterNumbers[0] % 3 === 0) {
      this.beamBeats = 3 * 2048;
    }
    this.skipNext = 0;
    this.currentGroup = [];
  }

  get beamGroups() {
    return this.measure.beamGroups;
  }
  _removeVoiceBeam(measure: SmoMeasure, voice: number) {
    const beamGroups: ISmoBeamGroup[] = [];
    measure.beamGroups.forEach((gr: ISmoBeamGroup) => {
      if (gr.voice !== voice) {
        beamGroups.push(gr);
      }
    });
    measure.beamGroups = beamGroups;
  }

  _completeGroup(voice: number) {
    const nrCount: SmoNote[] = this.currentGroup.filter((nn: SmoNote) =>
      nn.isRest() === false
    );
    // don't beam groups of 1
    if (nrCount.length > 1) {
      this.measure.beamGroups.push(new SmoBeamGroup({
        notes: this.currentGroup,
        voice
      }));
    }
  }

  _advanceGroup() {
    this.currentGroup = [];
    this.duration = 0;
  }

  // ### _isRemainingTicksBeamable
  // look ahead, and see if we need to beam the tuplet now or if we
  // can combine current beam with future notes.
  _isRemainingTicksBeamable(tickmap: TickMap, index: number) {
    let acc = 0;
    let i = 0;
    if (this.duration >= this.beamBeats) {
      return false;
    }
    acc = this.duration;
    for (i = index + 1; i < tickmap.deltaMap.length; ++i) {
      acc += tickmap.deltaMap[i];
      if (acc === this.beamBeats) {
        return true;
      }
      if (acc > this.beamBeats) {
        return false;
      }
    }
    return false;
  }
  beamNote(tickmap: TickMap, index: number, note: SmoNote) {
    this.beamBeats = note.beamBeats;
    this.duration += tickmap.deltaMap[index];
    if (note.noteType === '/') {
      this._completeGroup(tickmap.voice);
      this._advanceGroup();
      return;
    }

    // beam tuplets
    if (note.isTuplet) {
      const tuplet = this.measure.getTupletForNote(note);
      // The underlying notes must have been deleted.
      if (!tuplet) {
        return;
      }
      const tupletIndex = tuplet.getIndexOfNote(note);
      const ult = tuplet.notes[tuplet.notes.length - 1];
      const first = tuplet.notes[0];

      if (first.endBeam) {
        this._advanceGroup();
        return;
      }

      // is this beamable length-wise
      const stemTicks = SmoMusic.closestDurationTickLtEq(note.tickCount) * tuplet.durationMap[tupletIndex];
      if (note.noteType === 'n' && stemTicks < 4096) {
        this.currentGroup.push(note);
      }
      // Ultimate note in tuplet
      if (ult.attrs.id === note.attrs.id && !this._isRemainingTicksBeamable(tickmap, index)) {
        this._completeGroup(tickmap.voice);
        this._advanceGroup();
      }
      return;
    }

    // don't beam > 1/4 note in 4/4 time.  Don't beam rests.
    if (tickmap.deltaMap[index] >= 4096 || (note.isRest() && this.currentGroup.length === 0)) {
      this._completeGroup(tickmap.voice);
      this._advanceGroup();
      return;
    }

    this.currentGroup.push(note);
    if (note.endBeam) {
      this._completeGroup(tickmap.voice);
      this._advanceGroup();
    }

    if (this.duration === this.beamBeats) {
      this._completeGroup(tickmap.voice);
      this._advanceGroup();
      return;
    }

    // If this does not align on a beat, don't beam it
    if (this.duration > this.beamBeats) {
      this._advanceGroup();
    }
  }
}
