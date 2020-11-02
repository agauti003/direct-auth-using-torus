import React, { Component } from 'react';
import TorusService from './TorusService/TorusService';
import VerifierMaps from '../src/TorusService/VerifierMaps';

const GOOGLE = "google";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVerifier: GOOGLE,
      torusdirectsdk: null,
      loginHint: "",
      network: 'testnet',
      consoleText: ""
    };
    this.torusService = new TorusService();
    this.verifierMaps = new VerifierMaps();
    this.login = this.login.bind(this);
  }
  async componentDidMount() {
    try {
      const NETWORK = this.state.network;
      const torusdirectsdk = await this.torusService.initTorus(NETWORK);
      this.setState({ torusdirectsdk });
    } catch (error) {
      console.error(error, "mounted caught");
    }
  }
  async login(e) {
    try {
      e.preventDefault();
      const { selectedVerifier } = this.state;
      const loginDetails = await this.torusService.loginTorus(selectedVerifier);
      debugger;
      this.setState({
        consoleText: typeof loginDetails === "object" ?
          JSON.stringify(loginDetails) : loginDetails
      });
    } catch (error) {
      console.error(error, "login caught");
    }
  }

  render() {
    const { selectedVerifier, consoleText, network } = this.state;
    const verifierMaps = this.verifierMaps[network]();

    return (
      <div className="App">
        <form onSubmit={this.login}>
          <div>
            <span style={{ marginRight: "10px" }}>Verifier:</span>
            <select
              value={selectedVerifier}
              onChange={(e) => this.setState({ selectedVerifier: e.target.value })}>
              {Object.keys(verifierMaps).map((login) => (
                <option value={login} key={login.toString()}>
                  {verifierMaps[login].name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: "20px" }}>
            <button>Login with Torus</button>
          </div>
        </form>
        <div className="console">
          <p>{consoleText}</p>
        </div>
      </div>
    );
  }
}

