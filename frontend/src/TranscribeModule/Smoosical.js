import React, { Component } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';
import AudioPlayer from '../components/AudioPlayer';
import ModalForm from '../components/ModalForm';
import withRouter from '../components/withRouter';

class SmoosicComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xmlString: '',
      audioFile: '',
      showModal: false,
      title: '',
      author: '',
      categoriesOptions: [
        "Nasihat dan Pengajaran", "Cinta dan Kasih Sayang", "Keindahan Alam",
        "Kehidupan Seharian", "Permainan dan Hiburan", "Cerita dan Legenda",
        "Keagamaan dan Ketuhanan", "Pekerjaan dan Tradisi", "Perpaduan dan Kemasyarakatan",
        "Kebudayaan dan Adat", "Kanak-kanak", "Upacara dan Ritual", "Kegembiraan dan Perayaan"
      ],
      selectedCategories: []
    };
    this.smoosicElem = React.createRef(); // Ref for the Smoosic element
  }

  componentDidMount() {
    this.initializeSmoosic();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.router !== this.props.router || prevState.audioFile !== this.state.audioFile) {
    //   this.initializeSmoosic();
    // }
  }

  initializeSmoosic() {
    const isSidenavActive = this.props.router?.location?.pathname === '/active-nav';
    
    if (!isSidenavActive && window.Smo && this.smoosicElem.current) {
      const config = {
        smoPath: "../../public/smoosic/release",
        mode: "application",
        uiDomContainer: "smoo",
        scoreDomContainer: "smo-scroll-region",
        leftControls: "controls-left",
        topControls: "controls-top",
        disableSplash: true,
      };

      if (this.props.router?.location?.state?.score) {
        const score = this.props.router.location.state.score;
        let xmlString;
        if (typeof score === 'string') {
          xmlString = score;
        } else if (score instanceof Document || score instanceof Node) {
          const xmlSerializer = new XMLSerializer();
          xmlString = xmlSerializer.serializeToString(score);
        } else {
          console.error('Invalid score type:', typeof score);
          return;
        }

        config.initialScore = xmlString;
        this.setState({ xmlString });
      } else {
        this.setState({ xmlString: '' });
      }

      if (this.props.router?.location?.state?.audioFile) {
        this.setState({ audioFile: this.props.router.location.state.audioFile });
      }

      window.Smo.SuiDom.createUiDom(this.smoosicElem.current);
      window.Smo.SuiApplication.configure(config)
        .then(smoApp => {
          console.log('Smoosic initialized:', smoApp.instance.eventSource);
        })
        .catch(error => {
          console.error('Error during Smoosic initialization:', error);
        });
    }
  }

  captureImage = () => {
    if (this.smoosicElem.current && window.Smo && window.Smo.SmoToXml) {
      const booElement = this.smoosicElem.current.querySelector('#boo');
      if (booElement) {
        const originalWidth = booElement.offsetWidth;
        html2canvas(booElement, {
          width: originalWidth,
          height: originalWidth,
          windowWidth: originalWidth,
          windowHeight: originalWidth
        }).then(canvas => {
          const imageCapture = canvas.toDataURL('image/png');
          this.setState({ imageCapture });
        });
      } else {
        console.error("Element with id 'boo' not found");
      }
    }
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      this.setState({ audioFile: fileURL });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCategoriesChange = (selectedCategories) => {
    this.setState({ selectedCategories });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };

  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  handleSave = async () => {
    if (window.Smo && this.smoosicElem.current) {
      console.log(window.Smo.SuiApplication.instance.view.score);
      // const serializedScore = window.Smo.SmoToXml.convert(this.smoosicElem.current.score);
      const serializedScore = this.globSmoApp.instance.score.serialize();

      this.setState({ serializedScore }, () => {
        this.captureImage();
        this.toggleModal();
        console.log("Serialized Score:", this.serializedScore);
      });
    } else {
      console.error('Unable to serialize score: Smoosic instance or score is not defined.');
      alert('Score is not initialized yet, please try again.');
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, author, selectedCategories, serializedScore, audioFile, imageCapture } = this.state;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('categories', JSON.stringify(selectedCategories));
    formData.append('score_data', JSON.stringify(serializedScore));
    formData.append('is_published', false);
    formData.append('saves', 0);

    if (audioFile) {
      const audioBlob = await fetch(audioFile).then(response => response.blob());
      const audioFileName = `audio_${uuidv4()}.mp3`;
      const audioFileObject = new File([audioBlob], audioFileName, { type: audioBlob.type });
      formData.append('audio_file', audioFileObject);
    }

    if (imageCapture) {
      const imageData = imageCapture.split(',')[1];
      const imageBlob = new Blob([new Uint8Array(atob(imageData).split("").map(c => c.charCodeAt(0)))], { type: 'image/png' });
      const imageFileName = `image_${uuidv4()}.png`;
      const imageFileObject = new File([imageBlob], imageFileName, { type: imageBlob.type });
      formData.append('image_file', imageFileObject);
    }

    const token = localStorage.getItem("access_token");

    try {
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
      const response = await axios.post(
        'http://localhost:8000/transcription/save-transcription/',
        formData,
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('Data saved successfully:', response.data);
        this.toggleModal();
      } else {
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  render() {
    const { xmlString, audioFile, showModal, title, author, selectedCategories, categoriesOptions, imageCapture } = this.state;
    const isSidenavActive = this.props.router?.location?.pathname === '/active-nav';

    return (
      <div>
        <div className={`smoosic-container ${isSidenavActive ? 'sidenav-hidden' : ''}`} ref={this.smoosicElem}></div>

        <div className="audio-player-section" style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <input type="file" accept="audio/*" onChange={this.handleFileChange} style={{ marginRight: '20px' }} />

          {audioFile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AudioPlayer audioFile={audioFile} />

              <div className="controls" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
                <button onClick={this.handleSave} style={{ width: '100px', padding: '10px 20px', cursor: 'pointer', marginBottom: '10px' }}>Save</button>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <ModalForm
            title="Save Data"
            onClose={this.handleModalClose}
            onSubmit={this.handleSubmit}
            handleInputChange={this.handleInputChange}
            handleCategoriesChange={this.handleCategoriesChange}
            titleValue={title}
            authorValue={author}
            selectedCategories={selectedCategories}
            categoriesOptions={categoriesOptions}
          />
        )}
      </div>
    );
  }
}

export default withRouter(SmoosicComponent);
