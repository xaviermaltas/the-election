//Modul que es focalitza en el provider (Metamask)

//Ens serveix retornar una promesa asyncrona
//tal que ens estem registrant per rebre una notificació quan
//el DOM dispara un event load, tal que ens asegura que 
//Metamask s'ha carregat com a extensió


import Web3 from 'web3';

const getWeb3 = () => {

    return new Promise ( (resolve, reject) => {
        window.addEventListener('load', function() {
            let web3 = window.web3;

            if(typeof web3 !== undefined){
                web3 = new Web3(web3.currentProvider);
                console.log("Web 3 Provider Info Below");
                console.log(web3);
                resolve(web3);
            }
            else{
                console.log("No provider found, please install Metamask");
                reject();
            }
        });
    });
};

export default getWeb3;
