import './App.css';
import ParticlesBg from 'particles-bg';
import { Component } from 'react';
import FaceRecognition from './components/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Rank from './components/Rank';
import Register from './components/Register';
import SignIn from './components/SignIn';

const setUpClarifai = (imageUrl) => {
  const PAT = '02aeb3daadd3488bbd41ef2f0a3af7a2';
  const USER_ID = 'pr0methe4n_gutz';
  const APP_ID = 'faceTestApp';
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: "signIn",
      isSignedIn: false
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
    this.setState({ box })
  }
  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({ isSignedIn: true })
      this.setState({ route })
    } else {
      this.setState({ isSignedIn: false })
      this.setState({ route })
    }

  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }
  onSubmit = () => {
    this.setState({ imageURL: this.state.input })

    fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, setUpClarifai(this.state.input))
      .then(response => response.json())
      .then(response => {
        this.displayFaceBox(this.claculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App" >
        <ParticlesBg color="#ffffff" type="cobweb" bg={true} className="particles" />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === "home"
          ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit} />
            <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
          </div>
          : (this.state.route === "signIn"
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />)
        }
      </div>
    );
  }
}

export default App;
