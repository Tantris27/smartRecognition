import './App.css';
import Clarifai from 'clarifai';
import ParticlesBg from 'particles-bg';
import { Component } from 'react';
import FaceRecognition from './components/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Rank from './components/Rank';

const app = new Clarifai.App({
  apiKey: '3697553e4c804fef9c6d097db06524b8'
});
class App extends Component {

  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {}
    }

  }
  claculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById("inputImage")
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) => {
    console.log(box)
    this.setState({ box })
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }
  onSubmit = () => {
    this.setState({ imageURL: this.state.input })
    app.models.predict({
      id: 'face-detection',
      name: 'face-detection',
      version: '6dc7e46bc9124c5c8824be4822abe105',
      type: 'visual-detector',
    }, this.state.input)
      .then(response => {
        this.displayFaceBox(this.claculateFaceLocation(response))
      })
      .catch(err => console.log(err))


    // const PAT = '02aeb3daadd3488bbd41ef2f0a3af7a2';
    // // Specify the correct user_id/app_id pairings
    // // Since you're making inferences outside your app's scope
    // const USER_ID = 'pr0methe4n_gutz';
    // const APP_ID = 'faceTestApp';
    // // Change these to whatever model and image URL you want to use
    // // const MODEL_ID = 'face-detection';
    // // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';
    // const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

    // const raw = JSON.stringify({
    //   "user_app_id": {
    //     "user_id": USER_ID,
    //     "app_id": APP_ID
    //   },
    //   "inputs": [
    //     {
    //       "data": {
    //         "image": {
    //           "url": IMAGE_URL
    //         }
    //       }
    //     }
    //   ]
    // });

    // const requestOptions = {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': 'Key ' + PAT
    //   },
    //   body: raw
    // };

    // // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // // this will default to the latest version_id

    // fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, requestOptions)
    //   .then(response => response.text())
    //   // .then(result => console.log(result))
    //   .catch(error => console.log('error', error));

  }

  render() {
    return (
      <div className="App" >
        <ParticlesBg color="#ffffff" type="cobweb" bg={true} className="particles" />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit} />
        <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
