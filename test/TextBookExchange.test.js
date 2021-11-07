const TBE = artifacts.require("TBE")

contract("TBE",(accounts) => {
    // console.log(accounts);
    before(async() =>{
        TBX = await TBE.deployed()
    })

    it("gives the owner of the token 5 ",async() =>{
        let balance = await TBX.balanceOf(accounts[0])
        //converts from wei to ether to preent "BN"(i.e big number))
        balance = web3.utils.fromWei(balance)
        assert.equal(balance,5,"Balance should be 1M tokens for contract")
    })

    it("can transfer tokens between account ",async() =>{
        let amount = web3.utils.toWei("1000",'ether')
        await TBX.transfer(accounts[1], amount, {from: accounts[0]})

        let balance = await TBX.balanceOf(accounts[1])
        //converts from wei to ether to preent "BN"(i.e big number))
        balance = web3.utils.fromWei(balance)
        assert.equal(balance, '1000',"Balance should be")
    })
})