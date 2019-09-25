pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Election is Ownable{
    address public owner;
    uint public candidatesCount;
    uint public totalVotes;

    struct Candidate {
        uint id;
        string name;
        uint voteCounter;
    }

    struct Votant {
        address ad;
        bool voteStatus;
    }

    mapping(address => uint) public votesRecived;
    mapping(address => bool) public voterStatus;
    mapping(uint => Candidate) public candidates;

    event VoteEmited(address indexed voter, uint candidateId, string candidateName );

    constructor() public{
        
        owner = msg.sender;
        candidatesCount = 0;
        totalVotes = 0;

        addCandidate("Xavier");
        addCandidate("Javi");
        addCandidate("Pau");
        addCandidate("Irene");
    }

    function getTotalOfCandidates() public view returns(uint){
        return candidatesCount;
    }

    function getTotalNumberOfVotes() public view returns (uint){
        return totalVotes;
    }

    function addCandidate (string candidateName) public isOwner{
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, 0);
    }

    function voteForCandidate(uint candidateId) public payable {
        //Require valid candidate
        require( (candidateId > 0) && (candidateId <= candidatesCount) );

        //Require that the voter has not voted before
        require( !(voterStatus[msg.sender]) );
        // require( votesRecived[msg.sender] );

        //Record that the voter has already voted
        voterStatus[msg.sender] = true;

        //Update candidate voteCounter
        Candidate storage candidate = candidates[candidateId];
        candidate.voteCounter += 1;

        //Update votesRecived
        votesRecived[msg.sender] = candidateId;

        //Update totalVotes
        totalVotes += 1;

        emit VoteEmited( msg.sender, candidateId, candidate.name );
    }

    function getNumberOfVotesForACandidate(uint candidateId) public view returns(uint) {
        Candidate storage candidate = candidates[candidateId];
        return candidate.voteCounter;
    }

    

    
}