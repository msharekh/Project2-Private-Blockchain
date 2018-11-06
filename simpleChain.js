/* =====  =================================================================
|  3 steps which are further detailed throughout this project lesson      |
|                                                                         |
|   Step 1	Review Boilerplate Code                                       |
|   Step 2	Modify Functions to Persist Data                              |
|   Step 3	Test New Functionality                                        |
|                                                                         |
|  =======================================================================*/


/******* Your project will be evaluated using the Project Rubric ********/
/*
1.
Configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.
SimpleChain.js includes the Node.js level library and configured to persist data within the project directory.

2.
addBlock(newBlock) function includes a method to store newBlock with LevelDB.
addBlock(newBlock) includes a method to store newBlock within LevelDB

3.
Genesis block persist as the first block in the blockchain using LevelDB
Genesis block persist as the first block in the blockchain using LevelDB.
Additionally, when adding a new block to the chain, code checks if a Genesis block already exists. If not, one is created before adding the a block.
*/


/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/
const SHA256 = require('crypto-js/sha256');

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
  this.addBlock(new Block('First block in chain'));
 }
  
 
  
 addBlock(newBlock){
   newBlock.height = this.chain.length;
   newBlock.time = new Date().getTime().toString().slice(0,-3);
   if(this.chain.length > 0){
   	newBlock.previousblockhash = this.chain[this.chain.length-1].hash;
   }
   newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
   this.chain.push(newBlock);
 }
}

//testing:
let blockchain = new BlockChain();
blockchain.addBlock(new Block('second block'));
blockchain.chain
//console.log(' resutl: '+ blockchain.chain);