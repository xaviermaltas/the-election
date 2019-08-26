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
        }
    }

    async componentDidMount(){
        this.web3 = await getWeb3();
        console.log('Your web3 provider version is: ' + this.web3.version);
        
        console.log("Current Provider");
        console.log(this.web3.currentProvider);
        
        var account = ( await this.web3.eth.getAccounts() )[0];
        console.log('Your account is: ' + account);

        //Here we define an Instance of our Election Smart Contract
        this.election = await ElectionContract(this.web3.currentProvider);

        this.toEther = converter(this.web3);

        this.votationService = new VotationService(this.election);

        //Get the network Id
        web3.version.getNetwork((err, netId) => {
            console.log('Network ID : ' + netId);
        })
        
        //Subscripcio a un event de votacio
        let voteEmited = this.election.VoteEmited();
        console.log(voteEmited);
        voteEmited.watch( function(error, result) {

            if(!error){
                const{ voter, candidateId , candidateName} = result.args;
                console.log(voter);

                if( voter === this.state.account ){
                    this.container.success('You purchased a flight to ' + candidateName +' with a cost of ', 'Flight Selling');
                }
                
                this.container.success( candidateName +' with a cost of ', 'Flight Selling');
                console.log('The voter ' + voter + ', voted to : ' + candidateName);

            }
            else{
                console.log("App.js Error");
                console.log(error);
            }
            
        }.bind(this));


       

        if(account){

            //Subscripcio al event del canvi de compte
            //Actualització de valors, tornant a executar this.load()
            this.web3.currentProvider.publicConfigStore.on('update', async function(event){
                this.setState({
                    account : event.selectedAddress.toLowerCase()
                }, () => {
                    this.load();
                });
            }.bind(this));
    
    
            this.setState({
                    account : account.toLowerCase()
                    // account : account
                }, 
                    //Callback. Load the app while the account is setted
                    ()=>{
                        //Method for initializing our app
                        this.load();
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

    async voteForACandidate(){

        var x = document.getElementById("candidatesSelect").selectedIndex;
        var y = document.getElementById("candidatesSelect").options;

        var candidateId = ((y[x].index)+1);
        var candidateName =  y[x].text;
        
        //alert("Index : " + (candidateId) + " is " + (candidateName) );
        alert("Your vote is for : " + (candidateName) + " with index " + (candidateId));

        await this.votationService.voteForACandidate( (candidateId), this.state.account );
    }

    async load(){
        this.getBalance();
        this.getCandidates();
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

            <div className = "row"> 
                <div className = "col-sm">

                    <Panel title = "Your Account">
                        <p><strong> {this.state.account} </strong></p>
                        <span><strong> Balance : </strong>{this.state.balance} ETH</span>
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
