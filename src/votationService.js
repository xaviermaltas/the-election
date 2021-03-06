
export class VotationService {

    constructor(contract) {
        this.contract = contract;
    }

    async getTotalVotes(){
        return (await this.contract.getTotalNumberOfVotes()).toNumber();
    }

    async getTotalOfCandidates(){
        return (await this.contract.getTotalOfCandidates()).toNumber();
    }

    //Map each candidate to an object of 3 properties
    mapCandidates(candidatesArray){
        return candidatesArray.map(candidate =>({
            id : candidate[0].toNumber(),
            name : candidate[1],
            voteCounter : candidate[2].toNumber()
        }));
    }


    //Return a list of objects (candidates) which have 3 properties (id,name,voteCounter)
    async getCandidates(){
        let totalOfCandidates  = await this.getTotalOfCandidates(); 

        // console.log('total of candidates: ' + totalOfCandidates);

        let candidates = [];
        for(var i = 1; i <= totalOfCandidates; i++){
            //Get all the candidates
            let candidate = await this.contract.candidates(i);
            // console.log(candidate);
            candidates.push(candidate);
        }

        return this.mapCandidates(candidates);
    }

    async voteForACandidate(candidateId, from){
        // return this.contract.voteForCandidate(candidateId, {from});
        //debugger;
        var value = 0;
        console.log(from + "is trying to vote to the candidate " + candidateId );
        return this.contract.voteForCandidate(candidateId, {from, value} );
    }

    async hasVoted(account){
        // console.log('votationSevice, hasVoter Method');
        return (await this.contract.voterStatus(account));
    }

    async getVoterElection(account){
        let selectedCandidateId = await this.contract.votesRecived(account);
        return (selectedCandidateId.toNumber());
    }

    /*
    async getVoterStatus(account){
        let hasVoted = hasVoted(account);
        let voterStatus;

        if (hasVoted == false) {
            voterStatus = 'not voted yet';
        }
        else {
            voterStatus = await this.contract.votesRecived(account);
        }

        return voterStatus;
    }*/
}
