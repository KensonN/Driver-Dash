import React from 'react';
import firebase from './firebase.js'
import './App.css';

// HERE IS THE WEBSITE IM USING FOR THE GRAPH EXAMPLES SUPER HELPFUL
// https://github.com/jerairrest/react-chartjs-2/blob/master/example/src/components/line.js
// http://jerairrest.github.io/react-chartjs-2/

import Speed from './components/speed';
import Lap from './components/lap'
import Speedometer from './components/speedometer'

function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

// Launch fullscreen for browsers that support it!
launchFullScreen(document.documentElement); // the whole page

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      all: {},
      // latestTime: '',
      // latestTrial: '',
      latestData: {},
      lap: {},
      speed: {},
      speedometer: {},
    };
  }

  componentDidMount() {
    let database = firebase.database();
    database.ref().on('value', (snapshot) => {
      let all = snapshot.val();
      this.setState({
        all: all
      })
    });
    database.ref("Latest Time").on('value', (snapshot) => {
      //console.log("Run");
      let latestTime1 = snapshot.val();
      database.ref("Latest Trial").on('value', (snapshot) => {
        let latestTrial1 = snapshot.val();
        database.ref(latestTrial1).child(latestTime1).on('value', (snapshot) => {
          //console.log(latestTrial1 + " " + latestTime1)
          let latestData1 = {};
          let exists = snapshot.exists();
          let speed;
          if (exists === true) {
            console.log("if")
            latestData1 = snapshot.val();
            speed = latestData1["hall-effect"];
          }
          else {
            console.log("else")
            speed = 0;
          }
          this.setState({
            latestData: latestData1,
            speed: speed,
            speedometer: speed,
          })
        });
        
        // this.setState({
        //   latestTrial: latestTrial1
        // })
      });

      // this.setState({
      //   latestTime: latestTime1
      // })
    });
  }
  
  render() {
    return (
      <div className="canvas color-dark" style={{paddingTop: '45px'}}>
        <div className="columns is-vcentered">
          <div className="column is-one-third">   
            <Speed speed={this.state.speed} />
          </div>
          <div className="column ">
            <Speedometer speedometer={this.state.speed}/>
            <Lap lap={this.state.all} />  
          </div>
        </div>
      </div>
    );
  }
}

export default App;
