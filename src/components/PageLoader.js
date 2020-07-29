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

        await this.initilize();

        const { isMetaMask, isConnected } = this.props;

        // console.log('PageLoader . componentDidMount -> isMetamask : ' + isMetaMask);
        // console.log('PageLoader . componentDidMount -> isConnected : ' + isConnected);

        this.setState({
            isMetaMask : isMetaMask,
            isConnected : isConnected
        });

        // console.log('PageLoader . componentDidMount -> this.state.isMetamask : ' + this.state.isMetaMask);
        // console.log('PageLoader . componentDidMount -> this.state.isConnected : ' + this.state.isConnected);

    }

    /**
     * Initilize component
    */

    async initilize(){

        let onboarding
        
        try {
            onboarding = new MetaMaskOnboarding({ forwarderOrigin })
        } catch (error) {
            console.error(error)
        }

        let accounts
        const onboardButton = document.getElementById('connectButton')

        const isMetaMaskConnected = () => accounts && accounts.length > 0

        const isMetaMaskInstalled = () => {
            const { ethereum } = window
            return Boolean(ethereum && ethereum.isMetaMask)
        }

        const onClickInstall = () => {
            onboardButton.innerText = 'Onboarding in progress'
            onboardButton.disabled = true
            onboarding.startOnboarding()
        }
        
        const onClickConnect = async () => {
            try {
                const newAccounts = await ethereum.request({
                method: 'eth_requestAccounts',
                })
                accounts = newAccounts
            } catch (error) {
                console.error(error)
            }
        }

        const updateButtons = () => {
        
            if (!isMetaMaskInstalled()) {
                onboardButton.innerText = 'Click here to install MetaMask!'
                onboardButton.onclick = onClickInstall
                onboardButton.disabled = false
            } else if (isMetaMaskConnected()) {
                onboardButton.innerText = 'Connected'
                onboardButton.disabled = true
                if (onboarding) {
                    onboarding.stopOnboarding()
                }
            } else {
                onboardButton.innerText = 'Connect'
                onboardButton.onclick = onClickConnect
                onboardButton.disabled = false
            }
        }

        updateButtons()

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

            location.reload();
            

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

        const { isMetaMask, isConnected } = this.props;
        // console.log('PageLoader Render : ' + isMetaMask + ' ' + isConnected);
               
        // if(!(isMetaMask && isConnected)) {
        if(!isMetaMask){
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

        return null;
        
    }
}

export default PageLoader;
