const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/animeDB", {useNewUrlParser: true, useUnifiedTopology: true});
const animeDocSchema = {
  name: String,
  type: String,
  id: String,
  imgSrc: String,
  plotSummary: String,
  nbVotes: String,
  weightedScore: String,
  bayesianScore: String,
  genres: [String]
};
const Anime = mongoose.model('anime',animeDocSchema,'animes');
const Manga = mongoose.model('manga',animeDocSchema,'mangas');
function find(difficulty, dataVar, genres,i,type){
  var min = undefined;
  if(difficulty === "Normal"){
    min = 1000;
  }
  else if(difficulty === "Expert"){
    min = 500;
  }
  else if(difficulty === "Master"){
    min = 0;
  }
  console.log("find function runs ");
  return new Promise(function(resolve, reject){
    if(type === "anime"){
    Anime.find({genres: genres[i],nbVotes:{$gte:min}}, function(err, data){
      //var filteredData = [];
      if(err){console.log("There was an error: " + err);}
      else{

          dataVar = dataVar.concat(data);
          //console.log(data);
          console.log("length of filteredData: " + data.length);
          resolve(dataVar);
        };
      });
    }
    else if(type === "manga"){
      Manga.find({genres: genres[i],nbVotes:{$gte: min}}, function(err, data){
        //var filteredData = [];
        if(err){console.log("There was an error: " + err);}
        else{

            dataVar = dataVar.concat(data);
            console.log("length of filteredData: " + data.length);
            resolve(dataVar);
          };
        });
    }
        });
}
module.exports = {

createAnswers: function(difficulty,numAns,type,genres,numQ){
return new Promise(function(resolve, reject){
//console.log("function ran");
var j = 0;
var filteredData = [];
if(type === "anime"){
  console.log("retrieving anime");
        async function main(){
          for(let i = 0; i < genres.length;++i){
          filteredData = await find(difficulty,filteredData,genres,i,type);
          }

          let answers = {};
          let questions = [];
          let ans = [];
          for(let i  = 0; i < numQ; ++i){
              for(let j = 0; j < numAns; ++j){
                randNum = Math.floor(Math.random() * filteredData.length);
                ans.push(filteredData[randNum]);

                filteredData.splice(randNum,1);
              };
              answers = {
                answer1: ans[0],
                answer2: ans[1],
                answer3: ans[2],
                answer4: ans[3]
              };
              ans = [];
              questions.push(answers);
          };
            //console.log(questions);
            resolve(questions);
          //console.log(filteredData);
          //console.log(filteredData);
        }
          main();

}
else if(type === "manga"){
  console.log("retrieving manga");
  async function main(){
    for(let i = 0; i < genres.length;++i){
    filteredData = await find(difficulty,filteredData,genres,i,type);
    //console.log(filteredData);
    }
    let answers = {};
    let questions = [];
    let ans = [];
    for(let i  = 0; i < numQ; ++i){
        for(let j = 0; j < numAns; ++j){
          randNum = Math.floor(Math.random() * filteredData.length);
          ans.push(filteredData[randNum]);
          filteredData.splice(randNum,1);
        };
        answers = {
          answer1: ans[0],
          answer2: ans[1],
          answer3: ans[2],
          answer4: ans[3]
        };
        ans = [];
        questions.push(answers);
    };
      //console.log(questions);
      resolve(questions);
    //console.log(filteredData);
    //console.log(filteredData);
  }
    main();
}
//console.log("genres length: " + genres.length + ", j is: " + j);
});
}
};


//   let vals = [];
//   let randAns = [];
//   let tempAns = [...data.answerNames];
//   let temp = 4;
//   for(var i = 0; i < numAnswers;++i){
//   let rand = Math.floor(temp * Math.random());
//   randAns.push(tempAns[rand]);
//   if(tempAns[rand] === data.correctAnswerName){
//     vals.push("correct");
//   }
//   else{
//     vals.push("incorrect");
//   }
//   tempAns.splice(rand,1);
//   --temp;
// }
