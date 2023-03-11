import React from 'react';
import Graphin, { Behaviors } from '@antv/graphin';
import './App.css';
import Select from "react-dropdown-select";
//import { Row, Col, Card } from 'antd';
const { ZoomCanvas, FitView } = Behaviors;

const selectModeOptions = [
  { 
    value: 0,
    label: "Company structure"
  },
  {
    value:  1,
    label: "Company personnel with events as connections"
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphMode: 'graphin-force',
      companiesOptions: [],
      company: null,
      mode: null,
      showGraph: false,
      data: {'edges': [], 'nodes': []}
    };
  }
  // https://data-scripts-ednprdella-uc.a.run.app
  componentDidMount() {
    fetch("https://data-scripts-ednprdella-uc.a.run.app/data/companies")
      .then(res => res.json())
      .then(
        (result) => {
          const xxx = Object.keys(result).map(function(key, value) {
            return {
              'value': key,
              'label': key
            }
          })
          this.setState({
            companiesOptions: xxx
            });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
        }
      )
  }


  chooseCompany = (value) => {
    this.setState({company: value},
      this.updateGraph.bind(this, this.state.mode)
      )

  }

  updateGraph = (mode) => {
    this.setState({mode: mode})
    console.log("Mode:", mode, "Company:", this.state.company, "Mode in modes:", selectModeOptions.map(x => x['value']).includes(mode), "Company is null:", this.state.company === null)
    if (selectModeOptions.map(x => x['value']).includes(mode) === false || this.state.company === null) {
      return false
    }
    console.log("Updating graph")
    this.setState({
      graphMode: mode === 1 ? 'concentric' : 'graphin-force',
      showGraph: false
    })

    var request_url = mode === 0 ? "https://data-scripts-ednprdella-uc.a.run.app/data/company/structure/"+this.state.company : "https://data-scripts-ednprdella-uc.a.run.app/data/personnel/with_events/"+this.state.company
    fetch(request_url)
      .then(res => res.json())
      .then(
        (result) => {

          this.setState({
            showGraph: true,
            data: result
          });
          console.log(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
        }
      )

  }  

  render() {
    return (
      <div className='viewport'>
        {this.state.showGraph ? (
          <Graphin data={this.state.data} layout={{ type: this.state.graphMode, preventOverlap: true, nodeSpacing: 10}}>
              <ZoomCanvas enabled fixSelectedItems={{fixAll: true}} />
              <FitView />
          </Graphin>
        ) : (
          <></>
        )
        }
        <div className="selections">
          {this.state.companiesOptions.length > 0 ? (
            <Select options={this.state.companiesOptions} onChange={(value) => this.chooseCompany(value[0].value)} placeholder="Select company id"/>
          ) : (<></>)}
          {this.state.company ? (
          <Select options={selectModeOptions} onChange={(value) => this.updateGraph(value[0].value)} placeholder="Select mode"/>
          ) : (<></>)}
        </div>
      </div>
  )};
};

export default App