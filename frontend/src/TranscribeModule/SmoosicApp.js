// src/components/SmoosicComponent.js
import React from 'react';
import _ from 'lodash';
import AudioPlayer from '../components/AudioPlayer';
import withRouter from '../components/withRouter';
import ModalForm from '../components/ModalForm';
import html2canvas from 'html2canvas';
import axios from 'axios';

class SmoosicComponent extends React.Component {
  constructor(props) {
    super(props);
    this.smoosicElem = React.createRef(); // Create a ref for the Smoosic element
    this.state = {
      xmlString: '', // State to hold the XML string
      audioFile: '',
      showModal: false, // State to control the visibility of the modal
      title: '', // To store the entered title
      author: '', // To store the entered author
      categoriesOptions: ['Jazz', 'Classical', 'Rock', 'Pop', 'Electronic'], // Predefined categories
      selectedCategories: [], // To store selected categories
    };
    this.globSmo = null;
    this.globSmoApp = null;
    this.unbound = false;
    this.default = null;
  }

  componentDidMount() {
    // Default config, using the remote URL if no score is passed
    let config = {
      smoPath: "../../public/smoosic/release",
      mode: "application",
      uiDomContainer: "smoo",
      scoreDomContainer: "smo-scroll-region",
      leftControls: "controls-left",
      topControls: "controls-top",
      initialScore: 'https://aarondavidnewman.github.io/Smoosic/release/library/Beethoven_AnDieFerneGeliebte.xml', // Default remote score
    };

    // Access the passed 'score' and 'audioFile' from the router props
    const score = this.props.router?.location?.state?.score;
    const audioFile = this.props.router?.location?.state?.audioFile;

    if (score) {
      let xmlString;

      if (typeof score === 'string') {
        // If score is a string, it may already be valid XML content
        xmlString = score;
      } else if (score instanceof Document || score instanceof Node) {
        // If score is an XML Document or Node, serialize it
        const xmlSerializer = new XMLSerializer();
        xmlString = xmlSerializer.serializeToString(score);
      } else {
        console.error('Invalid score type:', typeof score);
        return; // Early exit if invalid score type
      }

      // Update the config to use the passed score instead of the default remote score
      config.initialScore = xmlString;

      // Set the XML string in the state for debugging
      this.setState({ xmlString }, () => {
        this.initSmoosic(this.smoosicElem.current, config);
      });
    } else {
      // Initialize Smoosic with the default config if no score is provided
      this.initSmoosic(this.smoosicElem.current, config);
    }

    // Set the audio file if provided
    if (audioFile) {
      this.setState({ audioFile });
    }
  }

  async initSmoosic(element, config) {
    if (window.Smo) {
      this.globSmo = window.Smo;

      // Create the UI DOM structure
      this.globSmo.SuiDom.createUiDom(element);

      try {
        // Use async/await to wait for Smoosic configuration to complete
        this.globSmoApp = await this.globSmo.SuiApplication.configure(config);

        // After initialization, you can safely use SmoScore or other Smoosic-related instances
        console.log('Smoosic initialized:', this.globSmoApp.instance.eventSource);
        console.log('Score', this.globSmoApp.score.serialize());
      } catch (error) {
        console.error('Error during Smoosic initialization:', error);
      }
    } else {
      console.error('Smo object is not available.');
    }
  }

  bindEvents = () => {
    return;
  };
  
  // Unbind keyboard events when modal opens
  unbindKeyboardForModal = (dialog) => {
    if (this.unbound) {
      console.log('Received duplicate bind event');
      return;
    }
  
    this.unbound = true;
    console.log("before unbind ", this.globSmoApp.instance.eventSource.keydownHandlers)
    console.log('Unbinding keydown handler[0]:', this.globSmoApp.instance.eventSource.keydownHandlers[0]);
    this.default = this.globSmoApp.instance.eventSource.keydownHandlers[0].sink;
  
    // Unbind the keydown handler
    this.globSmoApp.instance.eventSource.unbindKeydownHandler(this.globSmoApp.instance.eventSource.keydownHandlers[0]);
  
    console.log('Handlers after unbinding:', this.globSmoApp.instance.eventSource.keydownHandlers);
  
    // Rebind events when the modal closes (when closeModalPromise is resolved)
    dialog.closeModalPromise.then(() => {
      this.unbound = false;  // Reset the flag so that future modal opens can unbind again
      console.log('Modal closed, rebinding keyboard handlers');
      this.bindEvents();  // Rebind events after modal closes
    });
  };
  
  // Handle modal close without submission
  handleModalClose = () => {
    this.setState({ showModal: false });
    this.unbound = false;
    console.log(this.globSmoApp.instance.eventSource.keydownHandlers);
    // this.globSmoApp.instance.eventSource.keydownHandlers = [];
    // console.log("bind", this.globSmoApp.instance.eventSource.bindKeydownHandler(this, 'evKey'));
    this.globSmoApp.instance.eventSource.keydownHandlers[0] = this.globSmoApp.instance.eventSource.bindKeydownHandler(this.default, 'evKey');
    console.log("after rebind", this.globSmoApp.instance.eventSource.keydownHandlers);
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
        this.bindEvents();  // Rebind keyboard events after modal closes
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
    if (this.globSmoApp) {
      const serializedScore = this.globSmoApp.score.serialize();
      
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
      html2canvas(this.smoosicElem.current).then((canvas) => {
        const imageCapture = canvas.toDataURL('image/png');
        this.setState({ imageCapture });
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, author, selectedCategories, serializedScore, audioFile, imageCapture } = this.state;
  
    // Create a FormData object to send files
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('categories', JSON.stringify(selectedCategories));
    formData.append('score_data', JSON.stringify(serializedScore));
    formData.append('is_published', false);
  
    // Append the audio file and image capture (blob)
    formData.append('audio_file', audioFile);
    formData.append('image_file', imageCapture);
  
    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    try {
      // POST request to save data
      const response = await axios.post('http://localhost:8000/save/save-transcription/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add CSRF token if necessary
          // 'X-CSRFToken': csrfToken, // Uncomment and set csrfToken if CSRF protection is enabled
        },
      });
  
      if (response.status === 200) {
        console.log('Data saved successfully:', response.data);
        this.toggleModal();  // Close the modal after successful save
      } else {
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  render() {
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
          }}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={this.handleFileChange}
            style={{ marginRight: '20px' }}
          />

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

                <button
                  style={{
                    width: '100px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                  }}
                >
                  Publish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ModalForm Component */}
        <ModalForm
          showModal={showModal}
          title={title}
          author={author}
          categoriesOptions={categoriesOptions}
          selectedCategories={selectedCategories}
          onClose={this.handleModalClose}
          onSubmit={this.handleSubmit}
          onInputChange={this.handleInputChange}
          onCategoriesChange={this.handleCategoriesChange}
        />
      </div>
    );
  }
}

// Wrap the class with withRouter to get access to the router props
export default withRouter(SmoosicComponent);
