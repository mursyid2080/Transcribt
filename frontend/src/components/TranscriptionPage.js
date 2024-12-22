import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import axios from 'axios';
import './TranscriptionPage.css'; // Import your CSS
import OpenSheetMusicDisplay from '../lib/OpenSheetMusicDisplay';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FavoriteButton from './FavoriteButton';
import AudioPlayer from './AudioPlayer';

class TranscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.osmdContainer = React.createRef(); // Ref for OSMD container
    this.osmd = null; // OSMD instance
    this.state = {
      transcription: null,
      isDomReady: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.router.params;

    if (!id) {
      console.error('ID is undefined, routing might be misconfigured.');
      return;
    }

    axios
      .get(`http://localhost:8000/transcription/api/transcriptions/${id}/`)
      .then((response) => {
        this.setState({ transcription: response.data }, () => {
          if (response.data.score_data) {
            this.setState({ isDomReady: true });
            console.log(response.data);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching transcription:', error);
      });
  }

  exportToPdf = async () => {
    if (!this.state.isDomReady) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const container = this.osmdContainer.current;

    if (container) {
      const elements = Array.from(container.querySelectorAll('svg'));
      for (let i = 0; i < elements.length; i++) {
        const canvas = await html2canvas(elements[i]);
        const imgData = canvas.toDataURL('image/png');

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
    }

    pdf.save('music_sheet.pdf');
  };

  render() {
    const { transcription } = this.state;

    if (!transcription) {
      return <div>Loading...</div>;
    }

    return (
      <div className="music-page-container">
        <div className="music-page-header-section">
          <img
            src={transcription.profile_picture}
            alt="Profile"
            className="profile-picture"
          />
          <div>
            <h1 className="transcription-title">{transcription.title}</h1>
            <p className="transcription-author">by {transcription.author}</p>
          </div>
          <FavoriteButton
                transcriptionId={transcription.id}
                isFavoritedInitially={transcription.is_favorited} // This comes from the backend
            />
          <button onClick={this.exportToPdf} disabled={!this.state.isDomReady}>
            Export to PDF
          </button>
        </div>

        <div className="transcription-content">
          {/* Sheet Music */}
          <div className="transcription-scrollable">
            <OpenSheetMusicDisplay file={transcription.score_data} />
          </div>

          {/* Lyrics */}
          <div className="transcription-lyrics">
            <p>{transcription.lyrics}</p>
          </div>
        </div>

        <div className="audio-section">
          {/* <audio controls>
            <source src={transcription.audio_file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio> */}
          <AudioPlayer audioFile={transcription.audio_file} />
        </div>

        
      </div>
    );
  }
}

export default withRouter(TranscriptionPage);
