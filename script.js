let promiceToDo = new Promise(function(resolve,reject){
  //clean room
  let isClean = true;

  if(isClean){
    resolve('clean');
  }else{
    reject('dirty');
  }

 });

 promiceToDo.then(function(fromResolve){
   console.log('the room is '+ fromResolve);
 }).catch(function(fromReject){
  console.log('the room is '+ fromReject);
 })


 return new Promise((resolve, reject) => {
  db.get(key, function(err, value) {
      if (err) return console.log('Not found!', err);
      resolve(value);
  });
})


getBlockHeight().then((height) => {
  newBlock.Height = height + 1;
})
