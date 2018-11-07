/* =====  =================================================================
|  3 steps which are further detailed throughout this project lesson      |
|                                                                         |
|   Step 1	Review Boilerplate Code                                       |
|   Step 2	Modify Functions to Persist Data                              |
|   Step 3	Test New Functionality                                        |
|                                                                         |
|  =======================================================================*/


/*
done - Requirement 1	Configure LevelDB to persist dataset
done - Requirement 2	Modify simpleChain.js functions to persist data with LevelDB
done - Requirement 3	Modify getBlock() function
Requirement 4	Modify getBlockHeight() function
Requirement 5	Modify validate functions
*/


/******* Your project will be evaluated using the Project Rubric ********/
/*
1.
Configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.
SimpleChain.js includes the Node.js level library and configured to persist data within the project directory.

2.
addBlock(newBlock) function includes a method to store newBlock with LevelDB.
addBlock(newBlock) includes a method to store newBlock within LevelDB

addLevelDBData(key,value)
addDataToLevelDB(value)
getLevelDBData(key)

3.
Genesis block persist as the first block in the blockchain using LevelDB
Genesis block persist as the first block in the blockchain using LevelDB.
Additionally, when adding a new block to the chain, code checks if a Genesis block already exists. If not, one is created before adding the a block.
*/


/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/
const SHA256 = require('crypto-js/sha256');

/*---(1)---*/

/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
  

// Add data to levelDB with value
function addDataToLevelDB(newBlock) {
  let i = 0;  
  
  db.createReadStream()
  .on('data', function(data) {
    i++;
    // return console.log('addDataToLevelDB data -Block #' + i);
    var obj = JSON.parse(data.value);
    //return console.log('data key=' + data.key +' value ='+ data.value +' obj hash ='+ obj.hash)
    //return console.log('  obj hash ='+ obj.hash)
    
  }).on('error', function(err) {
    console.log('addDataToLevelDB erro -Block #' + i);
    return console.log('Unable to read data stream!', err)
  }).on('end', function() {
    // C console.log('addDataToLevelDB end -Block #' + i);
    //console.log('LevelDB Block #' + i);
    //addLevelDBData(i, newBlock);
  }).on('close', function() {
    // C console.log('addDataToLevelDB close -Block #' + i);
    //console.log('LevelDB Block #' + i);
    addLevelDBData(i, newBlock);
    //return(i);
  });
  
}


// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
   db.put(key, value, function(err) {
    if(err != null){
      return console.log('Block ' + key + ' submission failed', err);
    }else{
      return console.log('return Block ' + key + ' saved successfully');
    }       
  });
  
  
  
  // });
}


 

 // Get data from levelDB with key
function getLevelDBData(key){

  return new Promise((resolve, reject) => {      
    db.get(key, function(err, value) {
      if (err) return console.log('block not found!', err);
      resolve(value);
    })

  });
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
    //this.addBlock(new Block('First block in chain'));
  }
  
  
  /*################################################
  ################ Add block  ######################
  ################################################*/
  addBlock(newBlock){
    
    // Block height
    newBlock.height = bc.getBlockHeight();

     // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    
    // previous block hash
    if(bc.getBlockHeight() > 0){
      newBlock.previousblockhash = bc.getBlock(bc.getBlockHeight()-1).hash;
    }
    
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    
    // Adding block object to chain
    /******* BlockChain Array ********/    
    this.chain.push(newBlock);
    
    /******* LEVELDB ********/    
    return new Promise(function(resolve,regect){
      // Adding block object to LevelDB
       
      addDataToLevelDB(JSON.stringify(newBlock).toString());
      resolve('saved');
       
      
      // C console.log('LevelDB Block #' + i);
      //addLevelDBData(i, newBlock);
    });
    
    // var k = 0;
    // db.get(k,function(err,v){
    //   console.log('block '+k+' ............. value ='+ v);
    // });
  }
  
  /*################################################
  ################ Get block  ######################
  ################################################*/
  getBlock(blockHeight){
    // return object as a single string
    /******* BlockChain Array ********/ 
    //return JSON.parse(JSON.stringify(this.chain[blockHeight]));
    
    /******* LEVELDB ********/    
          
      return getLevelDBData(blockHeight).then((data) => {  console.log(data); });
             
      // db.get(blockHeight, function(err, value) {
      //   if (err) return console.log('block not found!', err);
      //   resolve(value);
      // });
      
      
      
      
     
    
  }
  /*################################################
  ################ Get block height ################
  ################################################*/
  getBlockHeight(){
    
    /******* BlockChain Array ********/    
    //return this.chain.length-1;
    
    /******* LEVELDB ********/   
    let bc = new BlockChain();

    return bc.getCreateReadStream().then((data) => {  console.log(data); });   
       
  }
  
  getCreateReadStream(){
    var BlockHeight=0;
    return new Promise((resolve, reject) => {
                   
         
        //Returns a Readable Stream of keys
        db.createReadStream()
        .on('data', function (data) { 
          BlockHeight++;
        })
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('close', function () {
          // C console.log('Stream closed')
        })
        .on('end', function () {
          // C console.log('Stream ended')
          resolve(BlockHeight);
        }); 
                
    }); 
  }
  
  
  /*################################################
  ################ validate block  #################
  ################################################*/
  validateBlock(blockHeight){
    // get block chain
    let bc = new BlockChain();
    
    // get block 
    let block = bc.getBlock(blockHeight).then((block) => {  
      var block=JSON.parse(block);
      //console.log(block); 
      // get block hash
      let blockHash=block.hash;
      
      //console.log('blockHash =>>>>>>'+ blockHash);
      //console.log('\n')
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      
      //testing wrong hash...
      //validBlockHash = '7dcab3849d3eedffd113a804324c85e4d68f35ad84cedfc3eaba2b3a440c5191';
      //console.log('validBlockHash =......'+ validBlockHash);
      
      // Compare
      if (blockHash===validBlockHash) {
        //console.log('BlockHash OK');
        //console.log('Block #'+blockHeight+' hash:\n'+blockHash+'====='+validBlockHash);      
        
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);      
        console.log('BlockHash Changed!!!');
        return false;
      }
      
    });
    
    
    
    
    // let blockHash = bc.getBlock(blockHeight).then((data) => {  
    //   console.log('hash='+ JSON.parse(data).hash); 
    // });
    
    
    
    
    
    
  }
  
  //   bc.validateBlock(2)
  
  /*################################################
  ################ validate Chain  #################
  ################################################*/
  
  validateChain(){
    let errorLog = [];
    
    // get block chain
    let bc = new BlockChain();

    //to get blockchain length
    bc.getBlockHeight().then((BlockHeight) => {  
      
      let blockchainLength= BlockHeight; 
      console.log('blockchainLength = ' + blockchainLength);
    

      for (var i = 0; i < blockchainLength-1; i++) {
        //console.log('Block for loop = ' + i);
  
        // validate block
        if (bc.validateBlock(i)) errorLog.push(i);
        // compare blocks hash link
        let block = bc.getBlock(i).then((b) => {  
          var block=JSON.parse(b);

          let blockHash = block.hash;
          console.log('blockHash = ' + i +':'+ blockHash);
        });
 



        db.createReadStream()
        .on('data', function (data) {
          // C console.log(data.key, '=', data.value)
          
          cnt++;
          return console.log('data cnt=' + cnt +' key=' + data.key +' value ='+ data.value)
        })
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('close', function () {
          console.log('Stream closed')
        })
        .on('end', function () {
          console.log('Stream ended')
          return console.log("end cnt =" + cnt);
        });







        
          // let previousHash =bc.getBlock(i+1).then((block) => { 
          //   console.log(JSON.parse(block).hash)
          
          //console.log('previousHash = ' + previousHash);
  
          // if (blockHash!==previousHash) {
          //   errorLog.push(i);
          // }
         
        }
        if (errorLog.length>0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: '+errorLog);
        } else {
          console.log('No errors detected');
        }
            



    });


    
  }

  ///   bc.validateChain();

readBlockChainDB() {

  return new Promise((resolve, reject) => {
    let cnt=0;
    db.createReadStream()
        .on('data', function (data) {
          return console.log('data cnt=' + cnt +' key=' + data.key +' value ='+ data.value+'\n')
        })
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('close', function () {
          //console.log('Stream closed')
        })
        .on('end', function () {
          //console.log('Stream ended')
          resolve("end cnt =" + cnt);
        });

  });

  
}
//bc.readBlockChainDB().then((result) => {console.log(result);  });
  
}///<-------end BlockChain

/*
validateChain(){
  let errorLog = [];
  for (var i = 0; i < this.chain.length-1; i++) {
    // validate block
    if (!this.validateBlock(i)) errorLog.push(i);
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
*/

//testing:

// let bc = new BlockChain()
// bc.addBlock(new Block('2nd block'))
// bc.addBlock(new Block('3rd block'))
// bc.addBlock(new Block('4rd block'))
// bc.addBlock(new Block('5rd block'))
// bc.chain
// bc.getBlockHeight()
// bc.getBlock(0)
//bc.validateBlock(2)
//bc.validateChain()



//5: Generate 10 blocks using a for loop
// let bc = new BlockChain();
// for (var i = 0; i <= 3; i++) {
//   bc.addBlock(new Block("test data "+i));
// }

let bc = new BlockChain();

//GenesisBlock
let GenesisBlock  = new Block("First block in chain -Genesis Block - " + 0);
bc.addBlock(GenesisBlock).then((result) => {
  console.log(result);   
});

i=0;
(function theLoop (i) {
  setTimeout(function () {
    let blockTest = new Block("Test Block - " + (i + 1));
    bc.addBlock(blockTest).then((result) => {
      console.log(result);
      // bc.getBlock(i).then((data) => {  
      //   console.log('hash='+ JSON.parse(data).hash); 
      // });
      i++;
      if (i < 3) theLoop(i);
    });
  }, 1000);
})(0);

// bc.getBlock(2).then((data) => {  

//   var obj = JSON.parse(data);


//   console.log('hash='+ obj.hash); 
// });

// bc.getBlock(2).then((data) => {  

//   console.log( JSON.parse(data).hash);   
// });


//bc.getBlock(2).then((result) => {  console.log(result);});

/*



bc.getBlockHeight().then((result) => {  console.log(result); });
bc.validateBlock(2)

*/
//6: Validate blockchain

//blockchain.validateChain();

//7: Induce errors by changing block data

// let inducedErrorBlocks = [2,4,7];
// for (var i = 0; i < inducedErrorBlocks.length; i++) {
//   blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
// }

//8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.

//blockchain.validateChain();




/*
done - Requirement 1	Configure LevelDB to persist dataset
done - Requirement 2	Modify simpleChain.js functions to persist data with LevelDB
done - Requirement 3	Modify getBlock() function
Requirement 4	Modify getBlockHeight() function
Requirement 5	Modify validate functions
*/









/* reveiew
addBlock(newBlock){
  return new Promise(function(resolve,regect){
        // Adding block object to LevelDB
        
        addDataToLevelDB(JSON.stringify(newBlock).toString());


  */