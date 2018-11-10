// $(document).ready(function(){



// });

const SHA256 = require('crypto-js/sha256');

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
// this.db = level(chainDB);

function c(txt){
  console.log(txt);
}



  
  //---------((((((((((((((((((((((((((()))))))))))))))))))))))))))
  
  
  //--------- Add data to levelDB with key/value pair
  function addLevelDBData(key,value){
    db.put(key, value, function(err) {
      if (err) {
        return ('Block ' + key + ' submission failed', err);
        // reject('error in addLevelDBData')

      }else{
        // getLevelDBData(key);
      }
      
      
    })
    
    
  }
  
  //--------- Get data from levelDB with key
  function getLevelDBData(key){
    
    return new Promise(function (resolve,reject){
      
      db.get(key, function(err, value) {
        if (err) return console.log('Not found!', err);     
        resolve(value);
      })   
    });
  }
  
  //--------- Add data to levelDB with value
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
    this.previousBlockHash = ""
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
  
 
  
  
  
  
  /*################################################
  ################ Add block  ######################
  ################################################*/
  addBlock(newBlock){  
    
    let self = this;
    return new Promise(function(resolve,reject){
      
      
      // let h = 0;        
      
      self.getBlockHeight().then((h) => {   
        
        if(h>0){
          c('\n=============================') 
          c('\ncatch h '+ h)
        }
        
        c('fn addBlock ' + h)
        
        /// Block height         
        newBlock.height = h;
        // let objBlock=[];
        // objBlock.push(newBlock)
        // objBlock.push(h)
        
        // return objBlock;          
      // }).catch(e => console.error(`.catch(${e})`)).then((objBlock) => { 
      // .then((objBlock) => { 
        
        //*************** formating block *****************
        /*    objBlock:-
        -   objBlock[0]...........newBlock
        -   objBlock[1]...........h
        -   objBlock[2]...........previousBlock
        */
        // UTC timestamp
        // c('objBlock\t'+objBlock)
        // let newBlock=objBlock[0];
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        c('newBlock.time\t'+newBlock.time)
        
        // let h=objBlock[1]
        //  h=objBlock[1]
        
        
        if(h>0)
        {
          
          c('\nblock height >0 !!!!!!!!!!!!   = '+h);
          
          
          
          
          // previous block hash
          self.getBlock(h-1).then((previousBlock) => { 
            
            c('previousBlock,,,,,\t'+previousBlock) 
            
            newBlock.previousBlockHash = JSON.parse((previousBlock)).hash; 
            c('previousBlock.hash\t'+JSON.parse((previousBlock)).hash);
            
            // Block height
            newBlock.height = h;

            //check existance of newBlock
            c(newBlock)
            
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            c('newBlock.hash\t'+newBlock.hash);
            
            //finally VERY IMPORTANT - stringify block
            newBlock=JSON.stringify(newBlock).toString();
            
            // Adding block object to chain
            //*************** adding block to DB *****************
            addLevelDBData(h,newBlock)
          }).catch(e => console.error(`.catch(${e})`)) 
        }
        else{
          newBlock.body=newBlock.body.toString()+' ***** GENESIS Block *****'
          
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          c('GENESIS newBlock.hash\t'+newBlock.hash);
          
          
          
          //finally VERY IMPORTANT - stringify block
          newBlock=JSON.stringify(newBlock).toString();
          c(newBlock)
          // Adding block object to chain
          //*************** adding block to DB *****************
          addLevelDBData(0,newBlock)
          
        }
        // resolve('saved')
        resolve('okkkkkk.')

      // })
      
      
      
    });
    
  }).catch(e => console.error(`.catch(${e})`))
    
    
  }
  
  
  
  
  
  
  /*################################################
  ################ Get block height ################
  ################################################*/
  getBlockHeight(){

    let self = this;
    return new Promise(function(resolve,reject){
      
      let h = 0;
      let result =0
      db.createReadStream().on('data', function(data) {
        h++;
      }).on('error', function(err) {
        console.log('Unable to read data stream!', err)
        result=0;

      }).on('close', function() {
        // console.log('p BlockHeight\t' + h);
        resolve(h);
      })
      // (result)
    })
  }
  
  /*################################################
  ################ Get block  ######################
  ################################################*/
  getBlock(blockHeight){
    // return object as a single string
    
    return new Promise(function (resolve,reject){
      
      db.get(blockHeight, function(err, block) {
        if (err) return console.log('Not found!', err);          
        resolve(block);
      })   
    });
    
  }
  
  /*################################################
  ################ validate block  #################
  ################################################*/
  validateBlock(blockHeight){
    let self = this;
    return new Promise(function (resolve,reject){
      
      let result
      // get block chain
      //let bc = new BlockChain();
      
      // get block object
      
      self.getBlock(blockHeight).then((b) => {  
        // let block=JSON.parse(block);
        let block=JSON.parse(b);
        // get block hash
        let blockHash = block.hash
        
        // remove block hash to test block integrity
        block.hash = '';
        
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        
        // Compare
        if (blockHash===validBlockHash) {
          // c('*** Matched ***')
          // c('Block #'+blockHeight+'  hash:\n'+blockHash+' === '+validBlockHash);
          
          result = true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          result = false;
        }
        resolve(result);
        
      }).catch(e => console.error(`.catch(${e})`));
      // c(r);
      
      
    })
    
  }
  
  /*################################################
  ################ validate Chain  #################
  ################################################*/
  validateChain(){
    
    
    let self = this;
    
    let errorLog = [];
    // let bc = new BlockChain();
    
    //get blockHieght
    self.getBlockHeight().then((h) => {
      
      let result
      
      
      (function theLoop (i) {
        setTimeout(function () {
          
          //validate blocks 
          c(i)        
          // let i=0
          var promise_validateBlock = self.validateBlock(i).then((result) => {
            let isValidateBlock = result;
            c(i+' isValidateBlock\t'+result)
            
            return(result)
          })
          
          var promise_getBlock = self.getBlock(i).then((b) => {
            let block=JSON.parse(b);
            let blockHash = block.hash;
            // c('blockHash\t'+blockHash)
            
            return(blockHash)
          }).catch(function(error) {
            console.log('error'+error);
          });
          
          var promise_getNextBlock = self.getBlock(i+1).then((b) => {
            let nextblock=JSON.parse(b);
            
            let previousHash = nextblock.previousBlockHash;
            // c('previousHash\t'+previousHash)
            
            return(previousHash)
          }).catch(function(error) {
            console.log('error'+error);
          });
          
          
          
          Promise.all([promise_validateBlock, promise_getBlock,promise_getNextBlock]).then((values) => {
            console.log('\nPromise.all\n');
            
            let isValidateBlock=values[0];
            c('isValidateBlock\t'+isValidateBlock);
            let blockHash=values[1];
            c('blockHash\t'+blockHash);
            let previousHash=values[2];
            c('previousHash\t'+previousHash);
            c('ticking..\t'+i);
            
            if (blockHash!==previousHash) {
              errorLog.push(i);
            }
            
            i++;
            if (i < h -1){
              theLoop(i);
            }
            else{
              console.log('no more blocks to check');
              
              if (errorLog.length>0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: '+errorLog);
              } else {
                console.log('No errors detected');
              }
            }
          }).catch(function(error) {
            console.log('all errors'+error);
          });
          
        }, 2000);
      })(0);
      
      
      
    }).catch(e => console.error(`.catch(${e})`))
    
    // })
    
    
    
  }
  
  
  
  showBlockChain(){
    return new Promise(function(resolve,reject){
      let i = 0;
      // for ( n=0 ; n<h ; n++ ){
      
      // }
      let blocks=[];
      db.createReadStream().on('data', function(data) {
        
        i++;
        blocks.push(data)
        
      }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
      }).on('close', function() {
        
        
        resolve(blocks)
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
  
  let myBlockChain = new BlockChain();
  
  (function theLoop (i) {
    setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      myBlockChain.addBlock(blockTest).then((result) => {
        console.log(result);
        i++;
        if (i < 10) theLoop(i);
      }).catch(e => console.error(`.catch(${e})`));
    }, 10000);
  })(0);
  
  
  
}



// runTest2();

bc.validateChain()

// c(bc.getBlock(2).then((b) => {
//             c(JSON.parse(b))
// }));

// c(bc.getBlockHeight().then((block) => {   
//   c("getBlockHeight\t"+block);  
// }));

// bc.validateBlock(3).then((result) => {
//    c(result)
// })

// addTestBlock();

// bc.addBlock(new Block("First block in chain")).then((result) => {
//   c("Block DB \t Genesis") ;
// }).catch(e => console.error(`.addBlock catch(${e})`)) ;

//bc.validateChain()


// bc.showBlockChain().then((result) => {
//   c(result);
// })

// bc.validateBlock(0).then((result) => {
//    c(result)
// })

// c(bc.getBlock(0).then((b) => {
//             c(JSON.parse(b).hash)
// }));



//testPromise();
// testPromiseAll();


//===========================
//===========================
//===========================
//===========================





function setDelay(i) {
  setTimeout(function(){
    console.log('ticking..\t'+i);
  }, 1000);
}

function testPromiseAll(){
  var promise1 = Promise.resolve(3);
  var promise2 = 42;
  var promise3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, 'foo');
  });
  
  Promise.all([promise1, promise2, promise3]).then(function(values) {
    console.log(values);
  });
}
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

