// $(document).ready(function(){



// });

const SHA256 = require('crypto-js/sha256');



const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

function c(txt){
  console.log(txt);
}


//---------((((((((((((((((((((((((((()))))))))))))))))))))))))))


// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
    getLevelDBData(key);
    
  })
  
  
}

// Get data from levelDB with key
function getLevelDBData(key){
  
  return new Promise(function (resolve,reject){
    
    db.get(key, function(err, value) {
      if (err) return console.log('Not found!', err);     
      resolve(value);
    })   
  });
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
  let i = 0;
  db.createReadStream().on('data', function(data) {
    i++;
  }).on('error', function(err) {
    return console.log('Unable to read data stream!', err)
  }).on('close', function() {
    console.log('Block #' + i);
    addLevelDBData(i, value);
  });
}


//--------((((((((((((((((((((((((((()))))))))))))))))))))))))))

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
  addBlockTest(newBlock){  
    
  }
  
  
  
  // Add new block
  addBlock(newBlock){    
    return new Promise(function(resolve,reject){
      
      let h = 0;        
      
      bc.getBlockHeight().then((h) => {         
        c('fn addBlock')
        
        /// Block height         
        newBlock.height = h;
        let objBlock=[];
        objBlock.push(newBlock)
        objBlock.push(h)
        
        return objBlock;          
      }).then((objBlock) => { 
        
        //*************** formating block *****************
        
        // UTC timestamp
        c('objBlock\t'+objBlock)
        let newBlock=objBlock[0];
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        c('newBlock.time\t'+newBlock.time)
        
        let h=objBlock[1]
        
        // let bc=new BlockChain();
        
        if(h==0)
        {
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          c('newBlock.hash\t'+newBlock.hash);
          
          // Adding block object to chain
          //*************** adding block to DB *****************
          addLevelDBData(h,newBlock)
        }
        else{
          c('block heith >0 !!!!!!!!!!!!   ='+h);
          
          // previous block hash
          bc.getBlock(h-1).then((previousBlock) => { 
            c('previousBlock,,,,,\t'+previousBlock) 
            // c('hash='+ JSON.parse(previousBlock).hash); 
            
            // newBlock.previousBlockHash = previousBlock.hash; 
            // c('previousBlock.hash\t'+previousBlock.hash);
            
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            c('newBlock.hash\t'+newBlock.hash);
            
            // Adding block object to chain
            //*************** adding block to DB *****************
            addLevelDBData(h,newBlock)
          })
        }
        
        // return newBlock; 
        
      })
      
      
      
    });
    
    
    
    
  }
  
  
  
  
  
  
  // Get block height
  getBlockHeight(){
    return new Promise(function(resolve,reject){
      
      let h = 0;
      db.createReadStream().on('data', function(data) {
        h++;
      }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
      }).on('close', function() {
        console.log('p BlockHeight\t' + h);
        resolve(h);
      })
    })
  }
  
  // get block
  getBlock(blockHeight){
    // return object as a single string
    
    return new Promise(function (resolve,reject){
      
      db.get(blockHeight, function(err, block) {
        if (err) return console.log('Not found!', err);   
        let b={};
        b.hash='kfksdfksa';  
        resolve(b);
      })   
    });
    
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


  showBlockChain(){
    return new Promise(function(resolve,reject){
      let i = 0;
      db.createReadStream().on('data', function(data) {
        // c(JSON.parse(data.value))
        // let objBlock = {};
        // objBlock.JSON.parse(data.value);
        // resolve(objBlock);
        // let objBlock=JSON.parse(JSON.stringify(data));
        // c(objBlock);
        i++;
        resolve(data)
        // c('block#'+data.key+"\tvalue:\t"+data.value);
        // c('  obj hash ='+ obj.hash)
      }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
      }).on('close', function() {
        // console.log('closing Block #' + data);
      });
    });
  }
  
  
}//<-------end BlockChain





//testing:
let bc = new BlockChain();


function addTestBlock(){
  // let bc = new BlockChain(); 
  
  let i = 0;   
    let newBlock = new Block('---test block----')
    c(newBlock);
    // Block height
    newBlock.height = i;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    // if(this.chain.length>0){
    //   newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    // }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain

    c(newBlock);
    // this.chain.push(newBlock);
    newBlock=JSON.stringify(newBlock).toString();

    c(newBlock);

    db.put(i, newBlock, function(err) {
      
      if (err) return console.log('Block ' + key + ' submission failed', err);
      
    })        
    // });
}
function runTest2(){
  
  let bc = new BlockChain();
  
  //GenesisBlock
  let GenesisBlock  = new Block("First block in chain -Genesis Block - " + 0);
  bc.addBlock(GenesisBlock).then((result) => {
    c("Block DB \t#" + i +"\tGenesis") ;
  });
  
  i=0;
  (function theLoop (i) {
    setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      bc.addBlock(blockTest).then((result) => {
        i++;
        if (i < 3) theLoop(i);
        else {
          //testing 
          
          //c(bc.chain)
          //c("getBlockHeight \t array \t" + bc.getBlockHeight())
          // c(bc.getBlock(0))
          // bc.getBlock(0).then((result) => {
          //   c("Block DB \t#" + result) ;
          // });
          //c("validateBlock \t array \t" + bc.validateBlock(2))
          //c("validateChain \t array \t" + bc.validateChain())
          //c("getDBblockHeight \t" + bc.getDBblockHeight())                  
          
        }
      });
    }, 1000);            
    
  })(0);
  
}

//addTestBlock();
//runTest2();

bc.showBlockChain().then((result) => {
  // c(JSON.stringify(result.value));
  // c(result.value);
  c(JSON.parse((result.value)).hash);
})

// c(bc.getBlock(0).then((b) => {
//   // c("Block DB \t#" + block) ;
//   //  var hash =jQuery.parseJSON(JSON.stringify(block));
//   let block={};
//   block=b;
//   block.previousHash='ffffffff';
//   //  var hash =JSON.stringify(block);
//   //  JSON.parse(block).hash ;
//   // c("hash\t"+hash);  
//   c("block.previousHash\t"+block.hash);  
// }));

// c(bc.getBlockHeight().then((block) => {   
//   // c("getBlockHeight\t"+block);  
// }));
// c(bc.chain)
// c(bc.updateChain());
// c(bc.chain)

// c(bc.getBlock(0).then(function(block) {
//     c(block) ;
// }));


//testPromise();
//updateChain();
// bc.chain

//c(bc.chain)

//fill Chain
// function updateChain(){   

//   let bc = new BlockChain();
//   let i = 0;

//   bc.chain=[];
//   db.createReadStream().on('data', function(data) {
//     i++;
//     c('current block#'+i+data.key+"\tvalue:\t"+data.value);
//     //pupulate chain with existing blocks in db  
//     let _block=data.value;  
//     bc.chain.push(_block);
//   }).on('error', function(err) {
//     return console.log('Unable to read data stream!', err)
//   }).on('close', function() {
//      c('all:'+bc.chain)
//   });
// }

function testPromise(){
  return new Promise(function(resolve, reject) {
    
    setTimeout(() => resolve(100), 1000); // (*)
    
  }).then(function( a ) { // (**)
    
    c(a); // 1
    let r=[];
    r.push(a*2)
    return r;
    
  }).then(function(r) { // (***)
    
    
    c("Hello");     
    c(r); // 2
    r.push(333);
    return r;
    
    
  }).then(function(x) {
    
    c(x); // 4
    c(x[1]); // 4
    
    
  });
}

