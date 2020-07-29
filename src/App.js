import React, { Component } from "react";
import detectEthereumProvider from '@metamask/detect-provider';

import PageLoader from "./components/PageLoader";
import VotingPage from "./components/VotingPage";


export class App extends Component {
    /**
     * Component 
    */
    constructor(props) {
        super(props);

        this.state = {
            isMetamask : undefined,
            isConnected : undefined
        }
    }
    
    /**
     * Aquest component només es carrega un única vegada just despres d'inicialitzar la pàgina
    */
    async componentDidMount(){

        /**
         * Provider
        */
        const provider = await detectEthereumProvider();

        if (provider) {

            if(ethereum.isMetaMask){
                // console.log('Metamaks installed!');

                this.setState({
                    isMetamask : true
                });

                if( ethereum.isConnected() ){
                    this.setState({
                        isConnected : true
                    })

                }

            }

        } else {
            console.log('Please install MetaMask!');
            this.setState({
                isMetamask : false,
                isConnected : false
            });
        }

    }

    render() {
        // debugger;

        // console.log('Render App : ' + this.state.isMetamask + ' ' + this.state.isConnected );

        return ( 
            <React.Fragment>
            
                <PageLoader 
                    isMetaMask={this.state.isMetamask} 
                    isConnected={this.state.isConnected}>
                </PageLoader>

                <VotingPage 
                    isMetaMask={this.state.isMetamask} 
                    isConnected={this.state.isConnected}>
                </VotingPage>

            </React.Fragment>
        );
    }
}
