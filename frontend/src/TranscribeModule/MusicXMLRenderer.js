import React, { Component, useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

const MusicXMLRenderer = ({ musicxml }) => {
  const osmdContainer = useRef(null);
  const osmd = useRef(null);

  useEffect(() => {
    if (osmdContainer.current && musicxml) {
      setupOsmd();
    }
  }, [musicxml]);

  const setupOsmd = () => {
    const options = {
      autoResize: true, // Adjust based on your requirement
      drawTitle: true, // Adjust based on your requirement
    };
    osmd.current = new OSMD(osmdContainer.current, options);
    osmd.current.load(musicxml).then(() => osmd.current.render());
  };

  return <div ref={osmdContainer} />;
};

export default MusicXMLRenderer;
