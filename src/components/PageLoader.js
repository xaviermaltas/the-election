import React, { Component } from "react";
import Spinner from 'react-spinner-material';
import './PageLoader.css';
import MetaMaskOnboarding from '@metamask/onboarding'

const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
  ? 'http://localhost:8080'
  : undefined


class PageLoader extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount(){

        const { isMetaMask, isConnected } = await this.props;

        // const { isMetaMask, isConnected } = await this.props;
        // console.log('PageLoader componentDidMount isMetamask : ' + isMetaMask);
        // console.log('PageLoader componentDidMount isConnected : ' + isConnected);

        let onboarding;

        try {
            onboarding = new MetaMaskOnboarding({ forwarderOrigin })
            // onboarding = new MetaMaskOnboarding();
            // console.log(onboarding);
            this.setState({
                onboarding : onboarding
            });
            
        } catch (error) {
            console.log('Onboarding error');
            console.error(error)
        }

        this.setState({
            isMetaMask : isMetaMask,
            isConnected : isConnected
        });

        console.log('PageLoader componentDidMount this.state.isMetamask : ' + this.state.isMetaMask);
        console.log('PageLoader componentDidMount this.state.isConnected : ' + this.state.isConnected);
        // console.log('pageLoader componentDidMount isMetamask : ' + isMetaMask);
        
    }

    async componentDidUpdate(prevProps, prevState){

        // if(prevState.isConnected !== this.state.isConnected){
        //     console.log('prevState.isConnected changed!');
        //     await this.updateButtons();
        // }

        // if(prevState.isMetaMask !== this.state.isConnected){
        //     await this.updateButtons();
        // }
        console.log('pageLoader . componentDidUpdate');
    }

    async updateButtons(){

        const onboardButton = document.getElementById('connectButton');
        if (!this.state.isMetaMask) {
            onboardButton.innerHTML = 'Click here to install MetaMask!'
            onboardButton.onclick = this.onClickInstall();
            onboardButton.disabled = false

        } else if (this.state.isConnected) {
            onboardButton.innerHTML = 'Connected'
            onboardButton.disabled = true
            // const onboarding = new MetaMaskOnboarding();
            if (this.state.onboarding) {
                // this.state.onboarding.stopOnboarding()
                console.log('stopOnboarding');
            }
        } else {
            onboardButton.innerHTML = 'Connect'
            onboardButton.onclick = this.onClickConnect();
            onboardButton.disabled = false
        }
    }

    /**
     * Connected Status
    */

    async onClickInstall(){
        const onboardButton = document.getElementById('connectButton');
        onboardButton.innerHTML = 'Onboarding in progress'
        onboardButton.disabled = true
        // const onboarding = new MetaMaskOnboarding();
        // this.state.onboarding.startOnboarding();
    }

    async onClickConnect() {
        try {
            const newAccounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            this.setState({
                accounts : newAccounts
            });
            // handleNewAccounts(newAccounts)
        } catch (error) {
            console.error(error)
        }
    }
    /**
     * Permissions
    */

    async requestPermissions(){

        try {
            const permissionsArray = await ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            })

            const permissionRequestAnswer = await this.getPermissionsDisplayString(permissionsArray);
            console.log('permissionRequestAnswer : ' + permissionRequestAnswer);
            permissionsResult.innerHTML = permissionRequestAnswer;

        } catch (err) {
            console.error(err)
            permissionsResult.innerHTML = `Error: ${err.message}`
        }
    }

    async getPermissionsDisplayString (permissionsArray) {
        if (permissionsArray.length === 0) {
          return 'No permissions found.'
        }
        const permissionNames = permissionsArray.map((perm) => perm.parentCapability);
        return permissionNames.reduce((acc, name) => `${acc}${name}, `, '').replace(/, $/u, '')
    }

    


    render(){
        // const { loading } = this.props;

        if(this.state.isMetaMask && this.state.isConnected) return null;
        
        else{

        
            return (

                <div className="pageloader" id="pageloader" className="container-fluid">

                    <div id="logo-container">
                        <img id="mm-logo" src="/assets/img/metamask-fox.svg" />
                    </div>

                    <div className="spinner-loading-container">
                
                        {/* <Spinner size={120} spinnerColor={"#333"} spinnerWidth={2} visible={true} /> */}
                        <Spinner size={120} visible={true} />
                        
                    </div>

                    <section>
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div className="card">

                                    <div className="card-body">
                                        <h4 className="card-title">
                                            Permissions Actions
                                        </h4>

                                        <button
                                            className="btn btn-primary btn-lg btn-block mb-3"
                                            id="connectButton"
                                            disabled
                                            >
                                            Connect
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg btn-block mb-3"
                                            id="requestPermissions"
                                            onClick={() => this.requestPermissions()}
                                            >
                                            Request Permissions
                                        </button>

                                        <p className="info-text alert alert-secondary">
                                            Permissions result: <span id="permissionsResult"></span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>


                </div>
            );
        }
        
    }
}

export default PageLoader;
