import ElectionContract from "../build/contracts/Election.json";
import contract from "truffle-contract";

//Definició d'una instancia del nostre Smart Contract d' Election
export default async(provider) => {
    const election = contract(ElectionContract);
    election.setProvider(provider);

    //Await per esperar a que la instancia estigui materialitzada
    let instance = await election.deployed();
    return instance;
};
