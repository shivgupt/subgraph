const axios = require('axios');

const url = 'http://127.0.0.1:8000/cli/graphql';
const getAllAccountsWithRep = `
    query {
        accounts (
            where: {
                daoAvatarAddress_in: ["0xa3f5411cfc9eee0dd108bf0d07433b6dd99037f1"],
                reputation_not: [null]
            }
        ) {
            reputation
            address
            votes { proposalId { proposalId } }
            stakes { proposalId { proposalId } }
            proposals { proposalId }
        }
    }
`

const execute = async (query, variables) => {
    try{
            const response = await axios.post(url, { query, variables }); 

            //console.log(JSON.stringify(response, null, 2));
            return response.data.data;
        } catch (error) { console.log( error ) }

}

execute(getAllAccountsWithRep, {}).then( (result) => {
    //console.log(JSON.stringify(result))
    let notActiveAccounts = []
    for( let i = 0; i < result.accounts.length; i++) {
        if ( result.accounts[i].stakes.length == 0 & result.accounts[i].votes.length == 0 ) {
            console.log(JSON.stringify(result.accounts[i]))
        }
    }
    
})
