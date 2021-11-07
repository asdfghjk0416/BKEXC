
pragma solidity >=0.4.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TBE is ERC20 {
    
    mapping(address => uint) public uploadCount;
    mapping(address=>uint) public rewardCount;

  constructor(uint _supply) ERC20("TextBookExchange","TEXEX"){
    _mint(msg.sender, _supply *(10**decimals())); 
    uploadCount[msg.sender] = 0;
    rewardCount[msg.sender] = 10;
  }
  function UploadBook() public returns (uint256){
       _mint(msg.sender, 1*(10**decimals()));
       uploadCount[msg.sender] += 1;
       if(rewardCount[msg.sender] == uploadCount[msg.sender]) reward();
       return balanceOf(msg.sender);
  }
   
  function BuyBook() public returns (uint256){
       uint newVal = balanceOf(msg.sender)-(1*(10**decimals()));
       require(newVal >= 0);
       _burn(msg.sender, 1*(10**decimals()));
       return balanceOf(msg.sender);
  }
   
  function uploadCountofUser() public view returns (uint){
       return uploadCount[msg.sender];
  }
   
  function reward() internal returns(bool success) {
        _mint(msg.sender,1*(10**decimals()));
        rewardCount[msg.sender] *= 2;
        return true;
  }
}