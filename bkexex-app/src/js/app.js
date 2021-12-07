var books =[
  {
      "uploader" : "",
      "link": "https://docs.google.com/document/d/1EthPpgha_UjZrB1NlVar6xBDqlcLp-j3WptYL7BJAwE/edit?usp=sharing",
      "isSpam": false,
      "name": "CSE426",
      "sold": false,
  }]

App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('TBE.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contracts.vote = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contracts.vote.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '#up', function(){ var link = $('#link1').val(), name=$('#name1').val; App.uploadBook(link,name)});
    $(document).on('click', '#by', function(){ name1=$('#Name').val, address=$('#add').value; App.BuyBook(name1,address)});
    $(document).on('click', '#sp', function(){ var name = $('#nameS').val(); App.handleSpam(nameS); });
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      web3.eth.defaultAccount=web3.eth.accounts[0]
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        }
      });
    });
  },

  uploadBook:function(link, name){
      console.log(link);
      console.log(name);
      //update the json table here
      var uploadInstance;
      web3.eth.getAccounts(function(error, accounts) {
        var account = accounts[0];
        var newBook={
          "uploader": account,
          "link": link,
          "isSpam": false,
          "name": name,
          "sold": false,
        }
        books.push(newBook)
        console.log(account)
        App.contracts.vote.deployed().then(function(instance) {
          uploadInstance = instance;
                return uploadInstance.UploadBook({from: account});
        }).then(function(result, err){
                if(result){
                   if(parseInt(result.receipt.status) == 1)
                   alert(" uploaded book successfully")
                   else
                   alert(" upload book not done successfully due to revert")
                   } else {
                   console.log(err)
                   alert(" upload book failed")
                   }   
                })
          })  
  },

  // web3upload:function(){
  //   var buyInstance;
  //   web3.eth.getAccounts(function(error, accounts) {
  //     var account = accounts[0];
  //     console.log(account)
  //     App.contracts.vote.deployed().then(function(instance) {
  //       buyInstance = instance;
  //             return buyInstance.UploadBook({from: account});
  //     }).then(function(result, err){
  //             if(result){
  //                if(parseInt(result.receipt.status) == 1)
  //                alert(" uploaded book successfully")
  //                else
  //                alert(" upload book not done successfully due to revert")
  //                } else {
  //                console.log(err)
  //                alert(" upload book failed")
  //                }   
  //             })
  //       })
  // },

  BuyBook:function(name, address){
    console.log(address);
    console.log(name);
    //update the json table here
    var buyInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];
      for (let step = 0; step < books.length; step++) {
        if (books[step].name==name){
          books[step].sold = true;
        }
      }
      console.log(account)
      App.contracts.vote.deployed().then(function(instance) {
        buyInstance = instance;
              return buyInstance.BuyBook({from: account});
      }).then(function(result, err){
              if(result){
                 if(parseInt(result.receipt.status) == 1)
                 alert(" bought book successfully")
                 else
                 alert(" buyBook not done successfully due to revert")
                 } else {
                 console.log(err)
                 alert(" buy book failed")
                 }   
              })
    })  
},

    // buyBook:function(name,address){
    //   var addr;
    //   for (let step = 0; step < books.length; step++) {
    //     if (books[step].uploader == address && books[step].name==name){
    //       books[step].sold = true;
    //     }
    //   }
    //   //update the json table here
    //   App.web3Buy()
    // },

    // web3Buy:function(){
    //     var uploadInstance;
    //     web3.eth,getAccounts(function(error, accounts) {
    //     var account = accounts[0];
    //     App.contracts.vote.deployed().then(function(instance) {
    //     uploadInstance = instance;
    //           return uploadInstance.BuyBook({from: account});
    //     }).then(function(result, err){
    //           if(result){
    //              if(parseInt(result.receipt.status) == 1)
    //              alert(addr + " uploaded book successfully")
    //              else
    //              alert(addr + " upload book not done successfully due to revert")
    //              } else {
    //              console.log(err)
    //              alert(addr + " upload book failed")
    //              }   
    //           })
    //     })
    // },

      handleSpam:function(addr){
        var uploadInstance;
        web3.eth,getAccounts(function(error, accounts) {
        var account = accounts[0];
        App.contracts.vote.deployed().then(function(instance) {
        uploadInstance = instance;
              return uploadInstance.removeSpamBooks(addr, {from: account});
        }).then(function(result, err){
              if(result){
                 if(parseInt(result.receipt.status) == 1)
                 alert(addr + " uploaded book successfully")
                 else
                 alert(addr + " upload book not done successfully due to revert")
                 } else {
                 console.log(err)
                 alert(addr + " upload book failed")
                 }   
              })
        })
    },


  getChairperson : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      if(App.chairPerson != App.currentAccount){
        jQuery('#address_div').css('display','none');
        jQuery('#register_div').css('display','none');
      }else{
        jQuery('#address_div').css('display','block');
        jQuery('#register_div').css('display','block');
      }
    })
  },

  handleRegister: function(addr){
    var voteInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.register(addr, {from: account});
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " registration done successfully")
            else
            alert(addr + " registration not done successfully due to revert")
        } else {
            alert(addr + " registration failed")
        }   
    })
    })
},

  handleVote: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.vote(proposalId, {from: account});
      }).then(function(result, err){
            if(result){
                console.log(result.receipt.status);
                if(parseInt(result.receipt.status) == 1)
                alert(account + " voting done successfully")
                else
                alert(account + " voting not done successfully due to revert")
            } else {
                alert(account + " voting failed")
            }   
        });
    });
  },

  handleWinner : function() {
    console.log("To get winner");
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.reqWinner();
    }).then(function(res){
    console.log(res);
      alert(App.names[res] + "  is the winner ! :)");
    }).catch(function(err){
      console.log(err.message);
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
