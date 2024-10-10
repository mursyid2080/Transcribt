import React from 'react';
import AudioPlayer from '../components/AudioPlayer';
import {useLocation} from 'react-router-dom';

export default class SmoosicComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: null, // State to store the selected audio file
    };
    this.smoosicElem = React.createRef();
  }

  componentDidMount() {
    const location = useLocation();
    const { config } = {
      smoPath: "../../public/smoosic/release",
      mode: "application",
      uiDomContainer: "smoo",
      scoreDomContainer: "smo-scroll-region",
      leftControls: "controls-left",
      topControls: "controls-top",
      remoteScore: location.state.score,
    };
    const elem = this.smoosicElem.current;

    // Initialize the Smoosic instance
    this.initSmoosic(elem, config);
  }

  componentDidUpdate(prevProps) {
    const { config } = this.props;
    if (config !== prevProps.config) {
      this.updateSmoosic(config);
    }
  }

  componentWillUnmount() {
    this.cleanupSmoosic();
  }

  initSmoosic(element, config) {
    if (window.Smo) {
      window.Smo.SuiDom.createUiDom(element);
      window.Smo.SuiApplication.configure(config);
      this.smoosicInstance = window.Smo.SuiApplication;
    } else {
      console.error('Smo is not defined');
    }
  }

  updateSmoosic(config) {
    if (this.smoosicInstance) {
      this.smoosicInstance.configure(config);
    }
  }

  cleanupSmoosic() {
    if (this.smoosicInstance && typeof this.smoosicInstance.cleanup === 'function') {
      this.smoosicInstance.cleanup();
    }
  }

  // Handler for file selection
  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a URL for the file
      this.setState({ audioFile: fileURL }); // Set audio file in state
    }
  };

  render() {
    const { audioFile } = this.state;

    return (
      <div>
      {/* Smoosic container */}
      <div className="smoosic-container" ref={this.smoosicElem} ></div>

      {/* Audio file upload input and player, now moved below the Smoosic container */}
      <div className="audio-player-section" style={{ marginTop: '20px', textAlign: 'center' }}>
        <input
          type="file"
          accept="audio/*"
          onChange={this.handleFileChange}
          style={{ marginBottom: '20px' }}
        />

        {/* Render the audio player when an audio file is selected */}
        {audioFile && <AudioPlayer audioFile={audioFile} />}
      </div>
    </div>
    );
  }
}
