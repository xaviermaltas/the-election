import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import ElectionContract from "./election";
import { VotationService } from "./votationService";
import { ToastContainer } from "react-toastr";


const converter = (web3) =>{
    return(value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
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
        }
    }

    //Component que es carrega una única vegada despres d'inicialitzar la pàgina
    async componentDidMount(){
        // Web3 Provider
            this.web3 = await getWeb3();

        //Web3 Provider Version
            console.log('Your web3 provider version is: ' + this.web3.version);

        //console.log("Current Provider");
            console.log(this.web3.currentProvider);

        //Metamask Account
            //If u get an error at the Browser console that your account is not found
            //Write : ethereum.enable()
            var account = ( await this.web3.eth.getAccounts() )[0];
            console.log('Your account is: ' + account);

        //Here we define an Instance of our Election Smart Contract
            this.electionInstance = await ElectionContract(this.web3.currentProvider);

        //Conversion from wey to Eth
            this.toEther = converter(this.web3);

        //Creation of an instance of VotationService class
            this.votationService = new VotationService(this.electionInstance);

        //Get and print the network Id
            web3.version.getNetwork((err, netId) => {
                console.log('Network ID : ' + netId);
            })
       
        //Subscripcio a un event de votacio
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

 
        //Subscripcio al event del canvi de compte
        //Actualització de valors, tornant a executar this.load()
            if(account){

                this.web3.currentProvider.publicConfigStore.on('update', async function(event){
                    this.setState({
                        account : event.selectedAddress.toLowerCase()
                    }, async () => {
                        await this.load();
                    });
                }.bind(this));


                this.setState({
                        account : account.toLowerCase()
                    },
                        //Callback. Load the app while the account is setted
                        async ()=>{
                            //Method for initializing our app
                            await this.load();
                        }
                );
            }else{
                console.log("No account found");
            }     
            

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
            candidates
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
    }

    async load(){
        await this.getBalance();
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
            <div className="jumbotron">
                <h4 className="display-4">Voting Application</h4>
            </div>

            <div id = "yourAccount" className = "row">
                <div className = "col-sm">

                    <Panel title = "Your Account">
                        <p><strong> Address : </strong>{this.state.account} </p>
                        <p><strong> Balance : </strong>{this.state.balance} ETH</p>
                        <p><strong> Status :  </strong> {this.state.voterStatus} </p>
                    </Panel>

                </div>
            </div>

            <div id = "votationResults" className = "row">
                <div className = "col-sm">

                    <Panel title = "Votation Results">

                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Votes</th>
                                </tr>
                            </thead>
                            <tbody id="candidatesResults">
                                {
                                    this.state.candidates.map( (candidate, i) => {
                                        // debugger;
                                        return <tr key = {i}>
                                            <td>{candidate.id}</td>
                                            <td>{candidate.name}</td>
                                            <td>{candidate.voteCounter}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>

                    </Panel>

                </div>
            </div>

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

                            {/* <button className = "btn btn-sm btn-success text-white" type = "submit" onClick={() => this.voteForACandidate(1) }> Vooote</button> */}
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
