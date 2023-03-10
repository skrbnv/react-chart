import React from 'react';
import Graphin, { Behaviors, Utils } from '@antv/graphin';
import { Row, Col, Card } from 'antd';
import './App.css';
const { ZoomCanvas, FitView } = Behaviors;
const data2 = Utils.mock(8).tree().graphin();
console.log(data2)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: {'edges': [], 'nodes': []}
    };
  }

  componentDidMount() {
    fetch("http://0.0.0.0:5000/data/company/structure/1")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            data: result
          });
          console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return (
      <div className='viewport'>
        {this.state.isLoaded ? (
          <Graphin data={this.state.data} layout={{ type: 'graphin-force' }}>
              <ZoomCanvas enabled />
              <FitView />
          </Graphin>
        ) : (
          <p>Loading..</p>
        )
        }
      </div>
  )};
};

export default App