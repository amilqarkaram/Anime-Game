const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/animeDB", {useNewUrlParser: true, useUnifiedTopology: false});
const scoreSchema = {
  username: String,
  score: String
};
const Score = mongoose.model("score",scoreSchema);
module.exports = {

addInfo: function(name,score){
let info = new Score({
  username: name,
  score: score
});
return info.save();
},
getInfo: function(){
return new Promise(function(resolve, reject){
  Score.find(function(err,data){
    if(err){console.log("There was an error: " + err);}
    else{
      //console.log(data);
      resolve(data);
    }
  });
  }
  );
},



};
