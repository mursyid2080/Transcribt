import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import axios from 'axios';
import './TranscriptionPage.css'; // Import your CSS if needed

class TranscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.smoosicElem = React.createRef(); // Ref for the Smoosic container
    this.smo = null;
    this.smoApp = null;
    this.state = {
      transcription: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.router.params;
  
    if (!id) {
      console.error('ID is undefined, routing might be misconfigured.');
      return;
    }
  
    axios.get(`http://localhost:8000/transcription/api/transcriptions/${id}/`)
      .then((response) => {
        this.setState({ transcription: response.data });
  
        if (response.data.score_data) {
          const scoreData = response.data.score_data;
          const deserializedData = window.Smo.XmlToSmo.convert(scoreData);
          console.log('score: ', scoreData);
          const path = `${process.env.PUBLIC_URL}/../../smoosic/release`;
  
          // Ensure the DOM is ready
          setTimeout(() => {
            if (this.smoosicElem.current && this.smoosicElem.current.id) {
              const containerId = this.smoosicElem.current.id;
              let config = {
                mode: "library",
                scoreDomContainer: containerId,
                remoteScore: null,
                initialScore: deserializedData,
                smoPath: path
              };
  
              try {
                this.initializeSmoosic(config);
              } catch (error) {
                console.error('Error during Smoosic initialization:', error);
              }
            } else {
              console.error('Smoosic container not found.');
            }
          }, 1000); // Adjust the timeout as needed
        }
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error);
      });
  }
  
  async initializeSmoosic(config) {
    if (window.Smo) {
      this.smo = window.Smo;
      try {
        this.smoApp = await this.smo.SuiApplication.configure(config);
        console.log('Smoosic initialized:', this.smoApp.instance.eventSource);
      } catch (error) {
        console.error('Error during Smoosic initialization:', error);
      }
    } else {
      console.error('Smo object is not available.');
    }
  }
  

  render() {
    const { transcription } = this.state;

    if (!transcription) {
      return <div>Loading...</div>;
    }

    return (
      <div className="transcription-container">
        <div className="header-section">
          <h1 className="transcription-title">{transcription.title}</h1>
          <p className="transcription-author">by {transcription.author}</p>
        </div>

        {/* Use the React ref to pass the DOM element to Smoosic */}
        <div id="outer-container" ref={this.smoosicElem}></div>

        <div className="audio-section">
          <audio controls>
            <source src={transcription.audio_file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    );
  }
}

export default withRouter(TranscriptionPage);
