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
    App.showNumberofbooks();
    App.showReward();
    App.current_bal();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '#up', function(){ var link = $('#link1').val(), name=$('#name1').val(); App.uploadBook(link,name)});
    $(document).on('click', '#by', function(){ var name=$('#name').val(), address=$('#link').val(); App.BuyBook(name,address)});
    // $(document).on('click', '#sp', function(){ var name = $('#nameS').val(); App.handleSpam(name); });
    $(document).on('click', '#ar', function(){ var address = $('#nameS').val(); App.AdminSpam(address); });

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
                  //  App.showReward(); 
                   else
                   alert(" upload book not done successfully due to revert")
                   } else {
                   console.log(err)
                   alert(" upload book failed")
                   }   
                })
          })  
  },

  BuyBook:function(name, address){
    console.log(address);
    console.log(name);
    //update the json table here
    var buyInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];
      // for (let step = 0; step < books.length; step++) {
      //   if (books[step].name==name){
      //     books[step].sold = true;
      //   }
      // }
      console.log(account);
      App.contracts.vote.deployed().then(function(instance) {
        buyInstance = instance;
              return buyInstance.BuyBook({from: account});
      }).then(function(result, err){
              // console.log('hello');
              if(result){
                 if(parseInt(result.receipt.status) == 1)
                 alert(" bought book successfully")
                  // alert("number of tokens:")
                 else
                 alert("buyBook not done successfully due to revert")
                 } else {
                 console.log(err)
                 alert(" buy book failed")
                 }   
          })
    })
  },
  //shows the current balance
  current_bal:function(){
      var numInstance;
      web3.eth.getAccounts(function(error, accounts) {
        var account = accounts[0];
        App.contracts.vote.deployed().then(function(instance) {
          numInstance = instance;
          //have to fix the decimal places and stuff
          return numInstance.balanceOf(account)
        }).then(function(res){
            console.log(res);
            jQuery('#tok').val(web3.fromWei(res, 'ether'));
          }).catch(function(err){
            console.log(err.message);
          })
        })
    },   
  
  //this function shows the number of books uploaded 
  showNumberofbooks:function(){
    var numInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];
      App.contracts.vote.deployed().then(function(instance) {
        numInstance = instance;
        return numInstance.uploadCountofUser();
      }).then(function(res){
          console.log(res);
          jQuery('#balance').val(res);
        }).catch(function(err){
          console.log(err.message);
        })
      })
  },   

    //this function shows the number of books uploaded 
    showReward:function(){
      var rewardInstance;
      web3.eth.getAccounts(function(error, accounts) {
        var account = accounts[0];
        App.contracts.vote.deployed().then(function(instance) {
          rewardInstance = instance;
          return rewardInstance.booksTillReward();
        }).then(function(res,err){
          console.log(res);
          jQuery('#reward').val(res);
          }).catch(function(err){
            console.log(err.message);
          })
        })
    },   
  
    //   handleSpam:function(addr){
    //     console.log(addr)
    //     var spamInstance;
    //     web3.eth.getAccounts(function(error, accounts) {
    //     var account = accounts[0];
    //     //update json part here to remove the book reported as spam
    //     App.contracts.vote.deployed().then(function(instance) {
    //     spamInstance = instance;
    //           return spamInstance.removeSpamBooks(addr, {from: account});
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


  getChairperson : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      if(App.chairPerson != App.currentAccount){
        jQuery('#fm3').css('display','none');
      }else{
        jQuery('#fm3').css('display','block');
      }
    })
  },

  AdminSpam:function(addr){
    var removeSpamInstance;
    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];
      //json part here
      console.log(account);
      App.contracts.vote.deployed().then(function(instance) {
        removeSpamInstance = instance;
              return removeSpamInstance.removeSpamBooks(addr,{from: account});
      }).then(function(result, err){
              // console.log('hello');
              if(result){
                 if(parseInt(result.receipt.status) == 1)
                 alert("remove spam books successfully")
                  // alert("number of tokens:")
                 else
                 alert("buyBook not done successfully due to revert")
                 } else {
                 console.log(err)
                 alert(" buy book failed")
                 }   
          })
    })
  },

//   handleRegister: function(addr){
//     var voteInstance;
//     web3.eth.getAccounts(function(error, accounts) {
//     var account = accounts[0];
//     App.contracts.vote.deployed().then(function(instance) {
//       voteInstance = instance;
//       return voteInstance.register(addr, {from: account});
//     }).then(function(result, err){
//         if(result){
//             if(parseInt(result.receipt.status) == 1)
//             alert(addr + " registration done successfully")
//             else
//             alert(addr + " registration not done successfully due to revert")
//         } else {
//             alert(addr + " registration failed")
//         }   
//     })
//     })
// },
  //upload count of user
  //check number of uploads required to get award

  // handleVote: function(event) {
  //   event.preventDefault();
  //   var proposalId = parseInt($(event.target).data('id'));
  //   var voteInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     var account = accounts[0];

  //     App.contracts.vote.deployed().then(function(instance) {
  //       voteInstance = instance;

  //       return voteInstance.vote(proposalId, {from: account});
  //     }).then(function(result, err){
  //           if(result){
  //               console.log(result.receipt.status);
  //               if(parseInt(result.receipt.status) == 1)
  //               alert(account + " voting done successfully")
  //               else
  //               alert(account + " voting not done successfully due to revert")
  //           } else {
  //               alert(account + " voting failed")
  //           }   
  //       });
  //   });
  // },

//   handleWinner : function() {
//     console.log("To get winner");
//     var voteInstance;
//     App.contracts.vote.deployed().then(function(instance) {
//       voteInstance = instance;
//       return voteInstance.reqWinner();
//     }).then(function(res){
//     console.log(res);
//       alert(App.names[res] + "  is the winner ! :)");
//     }).catch(function(err){
//       console.log(err.message);
//     })
//   }
};
//prevents page from refreshing when clicking submit
$("#by").click(function (e) {
  e.preventDefault();
});

$("#ar").click(function (e) {
  e.preventDefault();
});

$(function() {
  $(window).load(function() {
    App.init();
  });
});
