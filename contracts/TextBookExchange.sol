// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TBE is ERC20 {
    
    mapping(address=>uint) public uploadCount;
    mapping(address=>uint) public rewardCount;
    mapping(address=>bool) public isBanned;
    mapping (address=>uint) public SpamCount;
    address SuperUser; //owner 
    
    modifier onlySuperUser()
  { 
      require(msg.sender==SuperUser);
      _;
      
  }

   
   modifier ValidUser()
   { require(isBanned[msg.sender]==false);
       _;
   }
   

    
  constructor(uint _supply) ERC20("TextBookExchange","TEXEX"){
    _mint(msg.sender, _supply*(10**decimals()));
    SuperUser = msg.sender;
    uploadCount[msg.sender] = 0;
    rewardCount[msg.sender] = 10;
  }
   function UploadBook() public ValidUser returns (uint256){
       _mint(msg.sender, 1*(10**decimals()));
       uploadCount[msg.sender] += 1;
       if(rewardCount[msg.sender] == uploadCount[msg.sender]) reward();
       return balanceOf(msg.sender);
   }
   
   function BuyBook() public ValidUser returns (uint256){
       uint newVal = balanceOf(msg.sender)-(1*(10**decimals()));
       require(newVal >= 0);
       _burn(msg.sender, 1*(10**decimals()));
       return balanceOf(msg.sender);
   }
   
   function uploadCountofUser() public view ValidUser returns (uint){
       return uploadCount[msg.sender];
   }
   
   function reward() internal ValidUser returns(bool) {
        _mint(msg.sender,1*(10**decimals()));
        rewardCount[msg.sender] *= 2;
        return true;
   }
   
   function removeSpamBooks(address person) payable public onlySuperUser returns(bool) {
       require(uploadCount[person]>0);
       uint newBal = balanceOf(person) / 2;
       _burn(person, newBal);
       uploadCount[person] -= 1;
       SpamCount[person] += 1;
       if (SpamCount[person]>= 2){
           isBanned[person] = true;
       }
       return true;
   }
}