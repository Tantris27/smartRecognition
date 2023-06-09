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

const url = "https://face-recognitionbe.onrender.com"

// const setUpClarifai = (imageUrl) => {
//
//   const USER_ID = 'pr0methe4n_gutz';
//   const APP_ID = 'faceTestApp';
//   const IMAGE_URL = imageUrl;
//   const raw = JSON.stringify({
//     "user_app_id": {
//       "user_id": USER_ID,
//       "app_id": APP_ID
//     },
//     "inputs": [
//       {
//         "data": {
//           "image": {
//             "url": IMAGE_URL
//           }
//         }
//       }
//     ]
//   });

// const requestOptions = {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Authorization': 'Key ' + PAT
//   },
//   body: raw
// };
// return requestOptions
// }
const initialState = {
  input: "",
  imageURL: "",
  box: {},
  route: "signIn",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    joined: "",
    entries: 0
  }
}
class App extends Component {

  constructor() {
    super();
    this.state = initialState
  }
  loadUser = (userData) => {
    this.setState({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        joined: userData.joined,
        entries: userData.entries
      }
    })
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
    if (route === "signOut") {
      this.setState(initialState)
    } else if (route === "home") {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route })
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }
  onSubmit = () => {
    this.setState({ imageURL: this.state.input })
    console.log(this.state.input)
    fetch(`${url}/imageurl`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          fetch(`${url}/image`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
            .then(resp => resp.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {
                entries: count
              }))
            })
            .catch(err => console.log(err))
        }
        this.displayFaceBox(this.claculateFaceLocation(data))
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
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit} />
            <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
          </div>
          : (this.state.route === "signIn"
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />)
        }
      </div>
    );
  }
}

export default App;
