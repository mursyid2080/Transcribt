import React, { Component } from 'react';
import withRouter from '../components/withRouter';
import axios from 'axios';
import './TranscriptionPage.css'; // Import your CSS
import { OpenSheetMusicDisplay as OSMD, BackendType, TransposeCalculator } from 'opensheetmusicdisplay';
import * as jsPDF from 'jspdf';
import {svg2pdf} from 'svg2pdf.js';
import FavoriteButton from './FavoriteButton';
import AudioPlayer from './AudioPlayer';
import Scrollbars from 'react-custom-scrollbars';
import { FaFileExport } from 'react-icons/fa'; // Import icons
import html2canvas from "html2canvas";
import Zoomable from './Zoomable';

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
            this.initializeOSMD(response.data.score_data);
            this.setState({ isDomReady: true });
            console.log(response.data);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching transcription:', error);
      });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // Remove resize event listener
    window.removeEventListener('resize', this.handleResize);
  }

  

  initializeOSMD = async (scoreData) => {
    const options = {
      drawTitle: true,
      backend: "svg",
      pageFormat: "A4", // Set the page format to A4
      autoResize: true, // Enable auto resize
      spacingBetweenStaves: 10, // Adjust spacing between staves
      spacingBetweenSystems: 20, // Adjust spacing between systems
      newSystemFromXML: false, // Disable automatic page breaks
      newPageFromXML: false, // Disable automatic page breaks
      spacingFactorSoftmax: 1.5, // Adjust the spacing factor
    };
    this.osmd = new OSMD(this.osmdContainer.current, options);
     // Set the zoom level to 75%
    // this.osmd.Zoom = 0.2; // Set the zoom level to 75%
    
    await this.osmd.load(scoreData);
    this.osmd.zoom = 0.75;

    // Ensure the container has a valid width before rendering
    if (this.osmdContainer.current.clientWidth > 0) {
      this.osmd.render();
      console.log("Rendering completed");
    } else {
      console.error("Container width is 0, cannot render OSMD");
    }
  };

  handleResize = () => {
    
    if (this.osmd) {
      this.osmd.render();
    }
  };

 

  createPdf = async (pdfName) =>{
    if (this.osmd.backendType !== BackendType.SVG) {
        console.log("[OSMD] createPdf(): Warning: createPDF is only supported for SVG background for now, not for Canvas." +
            " Please use osmd.setOptions({backendType: SVG}).");
        return;
    }

    
    pdfName = this.state.transcription.title + ".pdf";
    

    const backends = this.osmd.drawer.Backends;
    let svgElement = backends[0].getSvgElement();

    let pageWidth = 210;
    let pageHeight = 297;
    const engravingRulesPageFormat = this.osmd.rules.PageFormat;
    if (engravingRulesPageFormat && !engravingRulesPageFormat.IsUndefined) {
        pageWidth = engravingRulesPageFormat.width;
        pageHeight = engravingRulesPageFormat.height;
    } else {
        pageHeight = pageWidth * svgElement.clientHeight / svgElement.clientWidth;
    }

    const orientation = pageHeight > pageWidth ? "p" : "l";
    // create a new jsPDF instance
    const pdf = new jsPDF.jsPDF({
        orientation: orientation,
        unit: "mm",
        format: [pageWidth, pageHeight]
    });
    //const scale = pageWidth / svgElement.clientWidth;
    for (let idx = 0, len = backends.length; idx < len; ++idx) {
      console.log("Creating page " + idx);
      console.log("length: " + len);
      if (idx > 0) {
          pdf.addPage();
      }
      svgElement = backends[idx].getSvgElement();
      
      if (!pdf.svg && !svg2pdf) { // this line also serves to make the svg2pdf not unused, though it's still necessary
          // we need svg2pdf to have pdf.svg defined
          console.log("svg2pdf missing, necessary for jspdf.svg().");
          return;
      }
      await pdf.svg(svgElement, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
      })
    }

    pdf.save(pdfName); // save/download the created pdf
    //pdf.output("pdfobjectnewwindow", {filename: "osmd_createPDF.pdf"}); // open PDF in new tab/window

    // note that using jspdf with svg2pdf creates unnecessary console warnings "AcroForm-Classes are not populated into global-namespace..."
    // this will hopefully be fixed with a new jspdf release, see https://github.com/yWorks/jsPDF/pull/32
  };

  render() {
    const { transcription } = this.state;

    const renderThumb = ({ style, ...props }) => {
      const thumbStyle = {
        backgroundColor: "rgba(88, 88, 88, 0.42)", // Semi-transparent white
        borderRadius: "6px", // Rounded corners
        width: "8px", // Thin scrollbar
      };
      return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    if (!transcription) {
      return <div>Loading...</div>;
    }

    return (
      <div className="music-page-container">
        <div className="music-page-header-section">
          <div className="music-page-header-section-left">
            <img
              src={transcription.profile_picture}
              alt="Profile"
              className="music-profile-picture"
            />
            <div className="profile-info">
              <h1 className="transcription-title">{transcription.title}</h1>
              <p className="transcription-author">by {transcription.author}</p>
            </div>
          </div>
          <div className='music-page-header-buttons'>
            <div className='favorite-button-container'>
              <FavoriteButton
                transcriptionId={transcription.id}
                isFavoritedInitially={transcription.is_favorited} // This comes from the backend
              />
            </div>
            <button onClick={this.createPdf} className='export-button-container'>
              <span>Export  </span>
              <div style={{ marginLeft: '10px' }}>
                <FaFileExport />
              </div>
            </button>
          </div>
        </div>

        
        <div className="transcription-content">
          {/* Sheet Music */}
          

          <Scrollbars
            autoHide // Automatically hides scrollbar when inactive
            autoHideTimeout={1000} // Hides after 1 second of inactivity
            autoHideDuration={300} // Smooth hide duration
            renderThumbVertical={renderThumb} // Custom thumb style
            universal={true} // Ensures consistent behavior across devices
            style={{ maxWidth: '35%' }}
          >
            {/* <Zoomable osmd={this.osmd} scoreData={transcription.score_data}>
              */}

              <div className="transcription-scrollable" ref={this.osmdContainer}></div>
              
            {/* </Zoomable> */}
          </Scrollbars>
          

          {/* Lyrics */}
          <Scrollbars
            autoHide // Automatically hides scrollbar when inactive
            autoHideTimeout={1000} // Hides after 1 second of inactivity
            autoHideDuration={300} // Smooth hide duration
            renderThumbVertical={renderThumb} // Custom thumb style
            universal={true} // Ensures consistent behavior across devices
            style={{ maxWidth: '35%' }}
          >
            <div className="transcription-lyrics" style={{textAlign: "center"}}>
              <p>{transcription.lyrics}</p>
            </div>
          </Scrollbars>
        </div>

        <div className="audio-section">
          <AudioPlayer audioFile={transcription.audio_file} />
        </div>
      </div>
    );
  }
}

export default withRouter(TranscriptionPage);