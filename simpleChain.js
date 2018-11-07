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

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  // return new Promise((resolve, reject) => {
    console.log('Block ' + key + ' with value =' + value + '');
    db.put(key, value, function(err) {
      if(err != null){
        return console.log('Block ' + key + ' submission failed', err);
      }else{
        return console.log('Block ' + key + ' saved successfully');
      }       
    });

    var k = 5;
    db.get(key,function(err,v){
      console.log('block value ='+ v);
    });

  // });
}

// Get data from levelDB with key
function getLevelDBData(key){
  // db.get(key, function(err, value) {
  //   if (err) return console.log('Not found!', err);
  //   console.log('Value = ' + value);
  // })
    var cnt=0;
    return new Promise((resolve, reject) => {

      //XXXXXXXXXXXXXXXXXXXX
      db.createReadStream()
      .on('data', function (data) {
        console.log(data.key, '=', data.value)
        cnt++;
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
        console.log("LEVELDB cnt =" + cnt);
      });
      //XXXXXXXXXXXXXXXXXXXX



        db.get(key, function(err, value) {
            if (err) return console.log('Not found!', err);
            resolve(value);
        });
    })


}

// Add data to levelDB with value
function addDataToLevelDB(newBlock) {
    let i = 0;    

    return new Promise((resolve, reject) => {     


      db.createReadStream()
        .on('data', function(data) {
        i++;
        return console.log('addDataToLevelDB data -Block #' + i);
      }).on('error', function(err) {
          console.log('addDataToLevelDB erro -Block #' + i);
          return console.log('Unable to read data stream!', err)
      }).on('end', function() {
        console.log('addDataToLevelDB end -Block #' + i);
        //console.log('LevelDB Block #' + i);
        //addLevelDBData(i, newBlock);
      }).on('close', function() {
        console.log('addDataToLevelDB close -Block #' + i);
        // console.log('LevelDB Block #' + i);
        // addLevelDBData(i, newBlock);
        resolve(i);
      });

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
  this.addBlock(new Block('First block in chain'));
 }
  
 
/*################################################
################ Add block  ######################
################################################*/
 addBlock(newBlock){

   // Block height
   newBlock.height = this.chain.length;
   // UTC timestamp
   newBlock.time = new Date().getTime().toString().slice(0,-3);
     
   // previous block hash
   if(this.chain.length > 0){
     newBlock.previousblockhash = this.chain[this.chain.length-1].hash;
   }

   // Block hash with SHA256 using newBlock and converting to a string
   newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
   
   // Adding block object to chain
     /******* BlockChain Array ********/    
   this.chain.push(newBlock);

    /******* LEVELDB ********/    
     // Adding block object to LevelDB
  addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString()).then(function(v){
    console.log('addDataToLevelDB then ');
    console.log('LevelDB Block #' + i);
    addLevelDBData(i, newBlock);
    });
 }

/*################################################
################ Get block  ######################
################################################*/
getBlock(blockHeight){
  // return object as a single string
  /******* BlockChain Array ********/ 
  //return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  
/******* LEVELDB ********/
  getLevelDBData(blockHeight).then(function(v){
    console.log('levelDB value is ' + v);
    })
 
}
/*################################################
################ Get block height ################
################################################*/
  getBlockHeight(){

    /******* BlockChain Array ********/    
    //return this.chain.length-1;

    /******* LEVELDB ********/    

    var cnt=0;
    return new Promise((resolve, reject) => {
      
      //Returns a Readable Stream of keys
       db.createReadStream()
      .on('data', function (data) {
        console.log(data.key, '=', data.value)
        console.log('key=', data)

        cnt++;
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
        console.log("LEVELDB BlockHeight =" + cnt);
      }); 


      //Returns a Readable Stream of values
      db.createValueStream()
      .on('data', function (data) {
        console.log('value=', data)
      })



    }); 
  }




/*################################################
################ validate block  #################
################################################*/
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
        /******* LEVELDB ********/    
    //resolve(true);

      return true;
    } else {
      console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          /******* LEVELDB ********/    
      //resolve(false);
      return false;
    }

   

}

/*################################################
################ validate Chain  #################
################################################*/
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
}

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
let bc = new BlockChain();
for (var i = 0; i <= 10; i++) {
  bc.addBlock(new Block("test data "+i));
}

//6: Validate blockchain
 
//blockchain.validateChain();
 
//7: Induce errors by changing block data
 
// let inducedErrorBlocks = [2,4,7];
// for (var i = 0; i < inducedErrorBlocks.length; i++) {
//   blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
// }
 
//8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
 
//blockchain.validateChain();
 


 