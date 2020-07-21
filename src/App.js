import React, { Component } from "react";
import Panel from "./Panel";
import ElectionContract from "./election";
import { VotationService } from "./votationService";
import { ToastContainer } from "react-toastr";
import detectEthereumProvider from '@metamask/detect-provider';


const converter = (web3) =>{
    return(value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

function JumbotronUI(){
    return(
        <div className="jumbotron">
        <h4 className="display-4">Voting Application</h4>
        </div>
    );
}
  
function UserInformationUI({account, balance, voterStatus}) {
    return (
        <div id = "yourAccount" className = "row">
            <div className = "col-sm">
                <Panel title={"Your Account"}>
                
                <div className="userInformation row">
                    <div className="col-sm">
                    <p><strong> Address : </strong>{account} </p>
                    <p><strong> Balance : </strong> {balance} ETH</p>
                    <p><strong> Status :  </strong> {voterStatus} </p>
                    </div>
                </div>

                </Panel>
            </div>
        </div>
    );
}

function CandidatesTable({candidates}){
    return (
        
        candidates.map( (candidate,i) => {
            return <tr key = {i}>
                <td>{candidate.id}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCounter}</td>
            </tr>
        })

    );
}
  
function VotationResultsUI({candidates}){
    return(

        <div id = "votationResults" className = "row">
            <div className = "col-sm">
                <Panel title = {"Votation Results"} >
                
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Votes</th>
                        </tr>
                    </thead>
                    <tbody id="candidatesResults">
                        <CandidatesTable candidates={candidates}/>
                    </tbody>
                </table>


                </Panel>
            </div>
        </div>

    );


}

function NetworkAreaUI({network}){
    return (
      <div id = "network" className = "row">
        <div className = "col-sm">
          <Panel title={"Network"}>
            
            <div className="netInformation row">
              <div className="col-sm">
                <p><strong> Network : </strong> {network} </p>
              </div>
            </div>
  
          </Panel>
        </div>
      </div>    
    );
}


export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            balance : 0,
            account : undefined,
            candidates : [],
            hasVoted : false,
            voterStatus : '',
            network : undefined
        }
    }
    
    async componentDidMount(){
    /**
     * Aquest component només es carrega un única vegada just despres d'inicialitzar la pàgina
    */

        /**
         * Provider
        */
            const provider = await detectEthereumProvider();
            // if (typeof window.ethereum !== 'undefined') {
            if (provider) {
                // From now on, this should always be true:
                // provider === window.ethereum
                // startApp(provider); // initialize your app
                if(ethereum.isMetaMask){
                    console.log('Metamaks installed!');
                }
            } else {
                console.log('Please install MetaMask!');
            }
        
        /**
         * Contract Instance
        */
            //Here we define an Instance of our Election Smart Contract
                this.electionInstance = await ElectionContract(window.ethereum);

            //Conversion from wey to Eth
                this.toEther = converter(this.web3);

            //Creation of an instance of VotationService class
            this.votationService = new VotationService(this.electionInstance);


        /**
         * Accounts
        */
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            ethereum.on('accountsChanged', 
                async function (accounts) {
                    this.setState({
                        account : accounts[0]
                    }, async () => {
                        await this.load();
                    });

                    window.location.reload();
                }.bind(this)
            );

            this.setState({
                account : account.toLowerCase()
            },
                //Callback. Load the app while the account is setted
                async ()=>{
                    //Method for initializing our app
                    await this.load();
                }
            );
        
        /**
         * Network and Chain
        */
            const networkVersion = ethereum.networkVersion;
            const chainId = ethereum.chainId;

            console.log('Network version : ' + networkVersion);
            console.log('ChainID : ' + chainId);

            ethereum.on('networkChanged', 
                async function (networkVersion) {
                    this.setState({
                        network : networkVersion[0]
                    }, async () => {
                        await this.load();
                    });

                    window.location.reload();
                }.bind(this)
            );


        /**
         * Subscripcio a un event de votacio
        */
            let voteEmited = this.electionInstance.VoteEmited();
            // console.log(voteEmited);
            voteEmited.watch( function(error, result) {

                if(!error){
                    const{ voter, candidateId , candidateName} = result.args;
                    console.log(voter);

                    if( voter === this.state.account ){
                        this.container.success('You voted to ' + candidateName +' with ID : ' + candidateId , 'Votation');
                        console.log('The voter ' + voter + ', voted to : ' + candidateName + ' with ID : ' + candidateId);
                    }

                }
                else{
                    console.log("App.js Error");
                    console.log(error);
                }

            }.bind(this));

    }


    async getAccount(){
        var account = ethereum.selectedAddress;
        if(account){
            this.setState({
                account : account.toLowerCase()
            });
            console.log('Account : ' + account);
        }
        else{
            console.log("No account found");
        }

    }

    async getNetwork(){
        const networkVersion = ethereum.networkVersion;

        this.setState({
            network : networkVersion
        });
        console.log('Network version ' + ethereum.networkVersion);
    }

    async getBalance(){
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance : this.toEther(weiBalance)
        });
    }

    async getCandidates(){
        let candidates = await this.votationService.getCandidates();
        this.setState({
            candidates : candidates
        });
    }

    async getVoterStatus(){
        //Getting information if the user has or not voted
        
        let hasVoted = await this.votationService.hasVoted(this.state.account);
        console.log(hasVoted);
        this.setState({
            hasVoted : hasVoted
        });

        if(this.state.hasVoted){
            console.log("Has voted");
            let selectedCandidateId = await (this.votationService.getVoterElection(this.state.account));
            console.log('Selected Candidate ID: '+ selectedCandidateId);

            let candidateArray = this.state.candidates;

            let selectedCandidateName = await candidateArray[selectedCandidateId-1].name;
            console.log(selectedCandidateName);

            this.setState({
                voterStatus : 'You have voted for ' + selectedCandidateName + ' with ID : ' + (selectedCandidateId)
            });
        }
        else{
            console.log("has not voted yet");
            this.setState({
                voterStatus : 'Has not voted yet'
            });
        }
    }

    async voteForACandidate(){

        var x = document.getElementById("candidatesSelect").selectedIndex;
        var y = document.getElementById("candidatesSelect").options;

        var candidateId = ((y[x].index)+1);
        var candidateName =  y[x].text;

        //alert("Index : " + (candidateId) + " is " + (candidateName) );
        alert("Your vote is for : " + (candidateName) + " with index " + (candidateId));

        await this.votationService.voteForACandidate( (candidateId), this.state.account );

        let selectedCandidateName = await this.state.candidates[(candidateId-1)].name;
        this.setState({
            voterStatus : 'You have voted for : ' + selectedCandidateName
        });
        
        await this.getCandidates();
    }

    async load(){
        await this.getAccount();
        await this.getNetwork();
        // await this.getBalance();
        await this.getCandidates();
        await this.getVoterStatus();
    }

    async castVotes(){
        var x = document.getElementById("candidatesSelect").selectedIndex;
        var y = document.getElementById("candidatesSelect").options;
        alert("Index: " + y[x].index + " is " + y[x].text);
        // var candidateId = $('#candidatesSelect').val();
        console.log("Index selected " + y[x].index);
    }
    

    render() {
        // debugger;
        return <React.Fragment>
           <JumbotronUI />

            <NetworkAreaUI 
                network={this.state.network}
            />

            <UserInformationUI 
                account={this.state.account} 
                balance={this.state.balance} 
                voterStatus={this.state.voterStatus} 
            />

            <VotationResultsUI 
                candidates={this.state.candidates} 
            />

            <div id = "votationArea" className = "row">

                <div className = "col-sm">

                    <Panel title ="Votation Area">

                        <form>
                            <div className="form-group">
                                <label>Select Candidate</label>
                                <select className="form-control" id="candidatesSelect">
                                    {
                                        this.state.candidates.map( (candidate, i) => {
                                            return <option value = {i} key = {i}>{candidate.name}</option>
                                        })

                                    }
                                </select>
                            </div>

                            <button type = "button" className="btn btn-primary" onClick={() => this.voteForACandidate()}>Vote</button>

                        </form>

                    </Panel>

                </div>

            </div>

            <ToastContainer ref= { (input) => this.container = input }
                className = "toast-top-right"
            />

        </React.Fragment>
    }
}
