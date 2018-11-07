// let promiceToDo = new Promise(function(resolve,reject){
//   //clean room
//   let isClean = true;

//   if(isClean){
//     resolve('clean');
//   }else{
//     reject('dirty');
//   }

//  });

//  promiceToDo.then(function(fromResolve){
//    console.log('the room is '+ fromResolve);
//  }).catch(function(fromReject){
//   console.log('the room is '+ fromReject);
//  })


//  return new Promise((resolve, reject) => {
//   db.get(key, function(err, value) {
//       if (err) return console.log('Not found!', err);
//       resolve(value);
//   });
// })


// getBlockHeight().then((height) => {
//   newBlock.Height = height + 1;
// })




var promise1 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve('foo');
  }, 300);
});

promise1.then(function(value) {
  console.log(value);
  // expected output: "foo"
});

console.log(promise1);
// expected output: [object Promise]










// function getBlocksCount() {

//   /*
//       let self = this;
 
//       return new Promise(function(resolve, reject) {
//         let count = 0;
//         //open db stream
//         db.createReadStream()
//           .on('data', function (data) {
//                 // Count each object inserted
//                 count++;
//            })
//           .on('error', function (err) {
//              //Error accessing db stream
//              console.log('Oh my!', err);
//              reject(err);
//            })
//           .on('end', function () {
//               //resolve with the count value
//               console.log("end strem");
//               console.log("Count =" + count);
//               resolve(count-1);
//           });
 
//       });
 
