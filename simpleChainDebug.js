// $(document).ready(function(){
  


// });

const SHA256 = require('crypto-js/sha256');
  
 

//const level = require('level');
//const chainDB = './chaindata';
//const db = level(chainDB);
  
function c(txt){
  console.log(txt);
  }
  
/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/
class Block{
  constructor(data){
    this.hash = "",
    this.height = 0,
    this.body = data,
    this.time = 0,
    this.previousblockhash = ""
  }
}


/* ===== BlockChain Class ===================================
|  Class with a constructor for BlockChain       |
|  ====================================================*/
class BlockChain{
  constructor(){
    this.chain = [];
    // this.addBlock(new Block("First block in the chain - Genesis block"));
  }
  
 // Add new block
 addBlock(newBlock){

   // Block height
    newBlock.height = this.chain.length;
    
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    this.chain.push(newBlock);
    
    return new Promise(function(resolve,reject){
        resolve('saved');
    });
  
}

// Get block height
getBlockHeight(){
  return this.chain.length-1;
}

// get block
getBlock(blockHeight){
  // return object as a single string
  return JSON.parse(JSON.stringify(this.chain[blockHeight]));
}

// validate block
validateBlock(blockHeight){
  // get block object
  let block = this.getBlock(blockHeight);
  // get block hash
  let blockHash = block.hash;
  // remove block hash to test block integrity
  block.hash = '';
  // generate block hash
  let validBlockHash = SHA256(JSON.stringify(block)).toString();
  // Compare
  if (blockHash===validBlockHash) {
      return true;
    } else {
      console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
      return false;
    }
}

// Validate blockchain
validateChain(){
  let errorLog = [];
  for (var i = 0; i < this.chain.length-1; i++) {
    // validate block
    if (!this.validateBlock(i))errorLog.push(i);
    // compare blocks hash link
    let blockHash = this.chain[i].hash;
    let previousHash = this.chain[i+1].previousBlockHash;
    if (blockHash!==previousHash) {
      errorLog.push(i);
    }
  }
  if (errorLog.length>0) {
    console.log('Block errors = ' + errorLog.length);
    console.log('Blocks: '+errorLog);
  } else {
    console.log('No errors detected');
  }
}


}//<-------end BlockChain

 

  //testing:

  let bc = new BlockChain();

  //GenesisBlock
  let GenesisBlock  = new Block("First block in chain -Genesis Block - " + 0);
    bc.addBlock(GenesisBlock).then((result) => {
      c("Block  #" + i +"\tGenesis") ;
    });

  i=0;
  (function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block("Test Block - " + (i + 1));
        bc.addBlock(blockTest).then((result) => {
          i++;
          c("Block  #" + i) ;
            if (i < 3) theLoop(i);
            else {
              //testing 
              //c(bc.chain)
              c("getBlockHeightbc \t" + bc.getBlockHeight())
              c( bc.getBlock(0))
              c("validateBlock \t" + bc.validateBlock(2))
              c("validateChain \t" + bc.validateChain())
            }
        });
    }, 1000);
    
     

  })(0);
  
 


  // bc.chain

  //c(bc.chain)
  



