// src/components/SmoosicComponent.js
import React from 'react';
import _ from 'lodash';
import AudioPlayer from '../components/AudioPlayer';
import withRouter from '../components/withRouter';
import ModalForm from '../components/ModalForm';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Scrollbars from 'react-custom-scrollbars'; 
import './SmoosicApp.css'
import PublishButton from '../components/PublishButton';
import parseMidi from '../midi-parser.js';
import API_BASE_URL from '../config.js';


class SmoosicComponent extends React.Component {
  constructor(props) {
    super(props);
    this.smoosicElem = React.createRef(); // Create a ref for the Smoosic element
    this.state = {
      modalAvail : false,
      transcription: null,
      xmlString: '', // State to hold the XML string
      audioFile: '',
      showModal: false, // State to control the visibility of the modal
      title: '', // To store the entered title
      author: '', // To store the entered author
      categoriesOptions: [
        "Nasihat dan Pengajaran",       // Advice and moral lessons
        "Cinta dan Kasih Sayang",       // Love and affection
        "Keindahan Alam",               // Nature and the environment
        "Kehidupan Seharian",           // Daily life and routines
        "Permainan dan Hiburan",        // Games and entertainment
        "Cerita dan Legenda",           // Stories and legends
        "Keagamaan dan Ketuhanan",      // Religious and spiritual themes
        "Pekerjaan dan Tradisi",        // Occupations and traditional work
        "Perpaduan dan Kemasyarakatan", // Unity and community
        "Kebudayaan dan Adat",          // Culture and customs
        "Kanak-kanak",    // Children's songs and lullabies
        // "Kritikan Sosial",              // Social critique and satire
        "Upacara dan Ritual",           // Ceremonial and ritualistic
        "Kegembiraan dan Perayaan"      // Joy and celebrations
      ], // Predefined categories
      selectedCategories: [], // To store selected categories
    };
    this.globSmo = null;
    this.globSmoApp = null;
    this.unbound = false;
    this.default = null;
    
  }

  async componentDidMount() {
    // Default config, using the remote URL if no score is passed
    let config = {
      smoPath: "../../public/smoosic/release",
      mode: "application",
      uiDomContainer: "smoo",
      scoreDomContainer: "smo-scroll-region",
      leftControls: "controls-left",
      topControls: "controls-top",
      initialScore: '', // Default remote score
      disableSplash: true,
    };
  
    // Access the passed 'score' and 'audioFile' from the router props
    const score = this.props.router?.location?.state?.score;
    const audioFile = this.props.router?.location?.state?.audioFile;
    const id = this.props.router?.location?.state?.id;
  
    // use initial
    if (score) {
      const midi = score;
      console.log('Midi:', midi);

      const midiUrl = `${API_BASE_URL}/media/${score}.mid`;


      fetch(midiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          // if (!contentType || !contentType.includes('audio/midi')) {
          //   throw new Error('Invalid MIDI file.');
          // }
          return response.arrayBuffer(); // Get the binary data of the MIDI file
        })
        .then(arrayBuffer => {
          // Convert the ArrayBuffer to Uint8Array
          const midiFileBuffer = new Uint8Array(arrayBuffer);

          // Parse the MIDI file using parseMidi
          const midiJson = parseMidi(midiFileBuffer); 

          // Quantization value for the conversion
          const quantizeDuration = 1024;

          // Create an instance of MidiToSmo and convert
          const midiToSmo = new window.Smo.MidiToSmo(midiJson, quantizeDuration);
          // const smoScore = midiToSmo.convert();

          console.log(midiToSmo); // Process or display the SmoScore as needed

          console.log('Score', midiToSmo.convert());
          config.initialScore = midiToSmo.convert();
          this.initSmoosic(this.smoosicElem.current, config);
          
        })
        .catch(error => {
          console.error('Error fetching or processing the MIDI file:', error);
        });
  
      // Set the XML string in the state for debugging
      
      

      // Set the audio file if provided
      if (audioFile) {
        this.setState({ audioFile });
      }
    } 
    // use remote
    else if (id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/transcription/api/transcriptions/${id}/`);
        this.setState({ transcription: response.data }, () => {
          if (response.data.score_data) {
            console.log(response.data);
            config.remoteScore = response.data.score_data;
            delete config.initialScore; // Remove the initial score if a remote score is provided
          }
          this.initSmoosic(this.smoosicElem.current, config);
          const audioFile = this.state.transcription.audio_file;
          this.setState({ audioFile });
        });
      } catch (error) {
        console.error('Error fetching transcription:', error);
        // Initialize Smoosic with the default config if there's an error
        this.initSmoosic(this.smoosicElem.current, config);
      }

    } else {
      // Initialize Smoosic with the default config if no score is provided
      this.initSmoosic(this.smoosicElem.current, config);
    }
    this.modalAvail = true;
  
    
  }

  async initSmoosic(element, config) {
    if (window.Smo) {
      this.globSmo = window.Smo;

      // Create the UI DOM structure
      window.Smo.SuiDom.createUiDom(element);

      try {
        // Use async/await to wait for Smoosic configuration to complete
        await window.Smo.SuiApplication.configure(config);

        // After initialization, you can safely use SmoScore or other Smoosic-related instances
        console.log('Smoosic initialized:', window.Smo.SuiApplication.instance.eventSource);
        // window.Smo.SuiApplication.instance.view.preferences.showPiano = false;
        
        // window.Smo.SuiApplication.instance.view.updateScorePreferences(window.Smo.SuiApplication.instance.view.score.preferences);
        // console.log('Score', this.globSmoApp.score.serialize());
      } catch (error) {
        console.error('Error during Smoosic initialization:', error);
      }
    } else {
      console.error('Smo object is not available.');
    }
  }


  // Unbind keyboard events when modal opens
  unbindKeyboardForModal = (dialog) => {
    if (this.unbound) {
      console.log('Received duplicate bind event');
      return;
    }
  
    this.unbound = true;
    console.log("before unbind ", window.Smo.SuiApplication.instance.eventSource.keydownHandlers)
    console.log('Unbinding keydown handler[0]:', window.Smo.SuiApplication.instance.eventSource.keydownHandlers[0]);
    this.default = window.Smo.SuiApplication.instance.eventSource.keydownHandlers[0].sink;
  
    // Unbind the keydown handler
    window.Smo.SuiApplication.instance.eventSource.unbindKeydownHandler(window.Smo.SuiApplication.instance.eventSource.keydownHandlers[0]);
  
    console.log('Handlers after unbinding:', window.Smo.SuiApplication.instance.eventSource.keydownHandlers);
  
    // // Rebind events when the modal closes (when closeModalPromise is resolved)
    // dialog.closeModalPromise.then(() => {
    //   this.unbound = false;  // Reset the flag so that future modal opens can unbind again
    //   console.log('Modal closed, rebinding keyboard handlers');
    //   // this.bindEvents();  // Rebind events after modal closes
    // });
  };
  
  // Handle modal close without submission
  handleModalClose = () => {
    this.setState({ showModal: false });
    this.unbound = false;
    console.log(window.Smo.SuiApplication.instance.eventSource.keydownHandlers);
    // this.globSmoApp.instance.eventSource.keydownHandlers = [];
    // console.log("bind", this.globSmoApp.instance.eventSource.bindKeydownHandler(this, 'evKey'));
    window.Smo.SuiApplication.instance.eventSource.keydownHandlers[0] = window.Smo.SuiApplication.instance.eventSource.bindKeydownHandler(this.default, 'evKey');
    console.log("after rebind", window.Smo.SuiApplication.instance.eventSource.keydownHandlers);
  };

  toggleModal = () => {
    let resolvePromise;  // Declare a variable to store the resolve function
  
    // Create a promise that resolves when the modal closes
    const closeModalPromise = new Promise((resolve) => {
      resolvePromise = resolve;  // Store the resolve function
    });
  
    // Create the dialog object that includes the closeModalPromise
    const dialog = {
      closeModalPromise,
    };
    
    this.setState((prevState) => {
      const isModalOpening = !prevState.showModal;
      
      // If the modal is opening, pass the dialog to unbindKeyboardForModal
      if (isModalOpening) {
        this.unbindKeyboardForModal(dialog);
      }
      
      // Return the updated modal state
      return { showModal: isModalOpening };
    }, () => {
      // This callback ensures that the state change is completed
      if (!this.state.showModal) {
        // If the modal is closing, resolve the promise and rebind keyboard events
        resolvePromise();  // Resolve the promise when the modal is closing
        // this.bindEvents();  // Rebind keyboard events after modal closes
      }
    });
    
    // Return the dialog object with the closeModalPromise
    return dialog;
  };

  componentDidUpdate(prevProps) {
    const { config } = this.props;
    if (!_.isEqual(config, prevProps.config)) {
      this.updateSmoosic(config);
    }
  }

  componentWillUnmount() {
    this.setState({ audioFile: '' });
  }

  handleSave = () => {
    if (window.Smo) {
      console.log(window.Smo.SuiApplication.instance);
      // const serializedScore = this.globSmoApp.score.serialize();

      const serializedScore = window.Smo.SmoToXml.convert(window.Smo.SuiApplication.instance.view.score);

      // const serializedScore = this.globSmoApp.score;
      
      this.setState({ serializedScore }, () => {
        this.captureImage(); // Capture the image when saving
        this.toggleModal(); // Open modal after saving the score
        console.log("Serialized Score:", serializedScore);
      });
    } else {
      console.error('Unable to serialize score: Smoosic instance or score is not defined.');
      alert('Score is not initialized yet, please try again.');
    }
  };
  
  // Handler for file selection
  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a URL for the file
      this.setState({ audioFile: fileURL }); // Set audio file in state
    }
  };

  // Handle input change in the modal form (Title and Author)
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Handle categories change from the ModalForm
  handleCategoriesChange = (selectedCategories) => {
    this.setState({ selectedCategories });
  };

  // Capture notation as image
  captureImage = () => {
    if (this.smoosicElem.current) {
      // Find the child element with id 'boo' inside the smoosic-container
      const booElement = this.smoosicElem.current.querySelector('#boo');
  
      if (booElement) {
        // Get the original width of the 'boo' element
        const originalWidth = booElement.offsetWidth;
        const originalHeight = booElement.offsetHeight;
  
        // Capture the 'boo' element as a square image
        html2canvas(booElement, {
          width: originalWidth,
          height: originalHeight,
          windowWidth: originalWidth,  // Force the width of the viewport
          windowHeight: originalHeight // Force the height of the viewport
        }).then((canvas) => {
          // Resize the canvas to a square if needed
          const imageCapture = canvas.toDataURL('image/png');
          this.setState({ imageCapture });
        });
      } else {
        console.error("Element with id 'boo' not found");
      }
    }
  };

  handleSubmit = async (modalFormData) => {
    this.setState({
      title: modalFormData.title,
      author: modalFormData.author,
      selectedCategories: modalFormData.selectedCategories,
      lyrics: modalFormData.lyrics,
    }, async () => {
      // This callback ensures that the state change is completed
    const { title, author, selectedCategories, serializedScore, audioFile, imageCapture, lyrics, transcription } = this.state;
    
    console.log('Form data received:', modalFormData);

    
    // Create a FormData object to send files
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('lyrics', lyrics);
    formData.append('categories', JSON.stringify(selectedCategories));
    formData.append('is_published', false);
    formData.append('saves', 0);
  
    // Handle the audio file (Blob URL)
    if (audioFile) {
      const audioBlob = await fetch(audioFile).then(response => response.blob());
      const audioFileName = `audio_${uuidv4()}.mp3`; // Generate a unique name for the audio file using UUID
      const audioFileObject = new File([audioBlob], audioFileName, { type: audioBlob.type });
      formData.append('audio_file', audioFileObject);
    }
  
    // Handle the image capture (Base64 string)
    if (imageCapture) {
      const imageData = imageCapture.split(',')[1]; // Strip out the data URI prefix
      const imageBlob = new Blob([new Uint8Array(atob(imageData).split("").map(c => c.charCodeAt(0)))], { type: 'image/png' });
      const imageFileName = `image_${uuidv4()}.png`; // Generate a unique name for the image file using UUID
      const imageFileObject = new File([imageBlob], imageFileName, { type: imageBlob.type });
      formData.append('image_file', imageFileObject);
    }
  
    // Handle the serializedScore (XML file)
    if (serializedScore) {
      // Convert the serializedScore object (e.g., XMLDocument) to a string
      const serializer = new XMLSerializer();
      const serializedScoreString = serializer.serializeToString(serializedScore);
  
      // Create a Blob from the serialized XML string
      const xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializedScoreString;
      const scoreBlob = new Blob([xmlData], { type: 'text/xml;charset=utf-8' });
  
      // Generate a unique file name for the XML file
      const scoreFileName = `score_${uuidv4()}.xml`;
  
      // Create a File object from the Blob
      const scoreFileObject = new File([scoreBlob], scoreFileName, { type: scoreBlob.type });
  
      // Append the File object to the FormData
      formData.append('score_data', scoreFileObject);
    }
  
    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    const token = localStorage.getItem("access_token");
    console.log(token);
  
    const getCSRFToken = () => {
      console.log(document.cookie);
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});
  
      return cookies.csrftoken || null;
    };
  
    try {
      const csrfToken = getCSRFToken();
      console.log('csrf', csrfToken);
  
      const url = this.state.transcription && this.state.transcription.id
        ? `${API_BASE_URL}/transcription/api/transcription/update/${transcription.id}/`
        : `${API_BASE_URL}/transcription/save-transcription/`;
  
      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            // 'Authorization': token,
            'X-CSRFToken': csrfToken, // Include CSRF token
          },
          withCredentials: true, // Ensure session cookies are sent
        }
      );
  
      console.log('Headers:', axios.defaults.headers);
      console.log('Cookies:', document.cookie);
  
      if (response.status === 200) {
        console.log('Data saved successfully:', response.data);
        this.toggleModal(); // Close the modal after successful save
      } else {
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  });
};

  render() {
    console.log(this.state.transcription);
    const {
      audioFile,
      showModal,
      title,
      author,
      categoriesOptions,
      selectedCategories,
    } = this.state;

    return (
      <div>
        
        {/* Smoosic container */}
        <div className="smoosic-container" ref={this.smoosicElem}></div>
      

        {/* Audio file upload input and player */}
        <div
          className="audio-player-section"
          style={{
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10px',
            height: '190px',
          }}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={this.handleFileChange}
            id="audio-upload"
            style={{ marginRight: '20px', display: 'none' }}
          />
          <label htmlFor="audio-upload" className="custom-file-upload">
            Choose File
          </label>

          {/* Render the audio player and buttons when an audio file is selected */}
          {audioFile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
              }}
            >
              {/* Audio player */}
              <AudioPlayer audioFile={audioFile} />

              {/* Buttons container */}
              <div
                className="controls"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center', // Centers content vertically
                  alignItems: 'center', // Centers content horizontally
                  marginLeft: '10px',
                }}
              >
                <button
                  onClick={this.handleSave}
                  style={{
                    width: '100px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    marginBottom: '10px',
                  }}
                >
                  Save
                </button>

                
                {this.state.transcription ?
                (<PublishButton style={{
                    width: '100px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                  }}
                  transcriptionId={this.state.transcription.id}
                  initialIsPublished={this.state.transcription.is_published}
                />) : (
                  <div></div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ModalForm Component */}
        {/* <ModalForm
          showModal={showModal}
          title={this.state.transcription?.title || title}
          author={author}
          categoriesOptions={categoriesOptions}
          selectedCategories={selectedCategories}
          onClose={this.handleModalClose}
          onSubmit={this.handleSubmit}
          onInputChange={this.handleInputChange}
          onCategoriesChange={this.handleCategoriesChange}
        /> */}
        {this.modalAvail && showModal ? (
          <ModalForm
            showModal={showModal}
            title={this.state.transcription?.title || title}
            author={this.state.transcription?.author || author}
            categoriesOptions={categoriesOptions}
            selectedCategories={this.state.transcription?.categories || selectedCategories}
            lyrics={this.state.transcription?.lyrics || ''}
            onClose={this.handleModalClose}
            onSubmit={this.handleSubmit}
            onInputChange={this.handleInputChange}
            onCategoriesChange={this.handleCategoriesChange}
          />
        ) : (
          <div>Loading...</div> // Show a loading indicator if transcription is not available
        )}
      </div>
    );
  }
}

// Wrap the class with withRouter to get access to the router props
export default withRouter(SmoosicComponent);
