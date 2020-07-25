const https = require("https");//used to send get response to external servers
const xml2js = require("xml2js");//ANN servers send back xml, this npm package is to convert xml into a javascript object
const util = require("util");
const mongoose = require("mongoose");
const performance = require('perf_hooks').performance;
mongoose.connect("mongodb://localhost:27017/animeDB", {useNewUrlParser: true, useUnifiedTopology: true});
//this is the path to get genres obj.ann.anime[0].info[4]._

const animeDocSchema = {
  name: String,
  type: String,
  id: String,
  imgSrc: String,
  plotSummary: String,
  nbVotes: String,
  weightedScore: String,
  bayesianScore: String,
  genres: [String],
  releaseDates: [String]
};
let name, ratings, type, id, imgSrc, nbVotes, weightedScore, bayesianScore;
const Anime = mongoose.model("anime",animeDocSchema);
const Manga = mongoose.model("manga",animeDocSchema);
let arrAnime = [];
let arrManga = [];
var i  = 0;
function findPlace(){
return new Promise(function(resolve,reject){
Anime.find(function(err,res){
arrAnime = res;
Manga.find(function(err,result){
arrManga = result;
console.log("anime length: " + arrAnime.length);
if(arrAnime.length !== 0 && arrManga.length !== 0){
  console.log("boolean: " + arrManga[arrManga.length-1].id > arrAnime[arrAnime.length-1].id);
if(arrManga[arrManga.length-1].id > arrAnime[arrAnime.length-1].id){
  console.log("ehllo");
  i  = arrManga[arrManga.length-1].id;
  console.log("i should be " + i);
  resolve(i);
  //console.log("i is: " + i);
}
else{
  i  = arrAnime[arrAnime.length-1].id;
  console.log("i should be " + i);
  resolve(i);
  //console.log("i is: " + i);
}
}
else{
  i = 0;
  resolve(i);
}
});
});
});
};
async function calibration(){
  let result = await findPlace();
  console.log("previous i was " + result);
}


async function main(){
  if(i === 23520){
    clearInterval(myTimer);
  }
let answers = await getDetails();
}
function change() {
        return new Promise(function(resolve, reject) {

            // Setting 2000 ms time
            setTimeout(resolve, 1000);
        });
    }
calibration().then(async function(){
//   while(i < 23520){
//   var t0  = performance.now();
//   await main();
//   var t1 = performance.now();
//   var totalTime = t1 - t0;
//   console.log("main took " + totalTime +" to run");
//   if(totalTime < 1000){
//     waitTime = 1000 - totalTime;
//     setTimeout(function(){console.log("took to short amount of time");}, waitTime);
//   }
//   else if(totalTime >= 1000){
//     continue;
//   }
// }
var myTimer = setInterval(main, 1000);
});
function getDetails(){
    ++i;
  // if(i >= 23,000){
  //   clearInterval(myTimer);
  // }
  //console.log("-------------------NEW ANIME DETAILS--------------------");
  return new Promise(function(resolve,reject){
  https.get("https://cdn.animenewsnetwork.com/encyclopedia/api.xml?title="+ i, function(response){
    console.log("i is " + i );
    var chunks = [];
    response.on("data", function (chunk) {
    chunks.push(chunk);
  });
  response.on("end", function () {
    var body = Buffer.concat(chunks);
    const xml = body.toString();

    xml2js.parseString(xml, function (err, result) {
    //console.log(util.inspect(result, false, null)); // Output: Hello world!
    if(result === undefined){
      console.log("result is undefined")
      console.log(result);
      resolve(result);
    }
    else if(result.ann.warning !== undefined){
      console.log("there was an error");
      console.log(result);
      resolve(result);
    }
    else{
      let manga = false;
      let anime = false;
      if(result.ann.anime === undefined){
        var root = result.ann.manga[0];
        manga = true;
      }
      else{
        var root  =  result.ann.anime[0];
        anime = true;
    }
      var releaseDates = [];
      var genres = [];
      var plotSummary = "";
      if(root.info !== undefined){
      imageSrc = root.info[0].$.src;
      for(var j = 0; j < root.info.length; ++j){
        var type = root.info[j].$.type;
        if(type === "Plot Summary"){
          plotSummary = root.info[j]._;
        }
        if(type === "Genres"){
          genres.push(root.info[j]._);
        }
      }
    }
    else{
      imageSrc = "none";
      plotSummary = "";
      type = "none";
      genres = [];
    }
      if(root.release !== undefined && root.release.length !== 0){
        for(let r = 0; r < root.release.length; ++r){
            let date = root.release[r].$.date;
            releaseDates.push(date);
        }
      }
      else{
        releaseDates.push("none");
      }
      if(root.ratings == undefined){
          nbVotes = "none";
          weightedScore = "none"
          bayesianScore = "none";
      }
      else{
        nbVotes = root.ratings[0].$.nb_votes;
        weightedScore = root.ratings[0].$.weighted_score;
        bayesianScore = root.ratings[0].$.bayesian_score;

      }
      if(root.$ == undefined){
        name = "none";
        id = "none";
      }
      else{
        name = root.$.name;
        id = root.$.id;
      }
      if(anime){
      let anime = new Anime({
          name: name,
          type: "Anime",
          id: id,
          imgSrc: imageSrc,
          plotSummary: plotSummary,
          nbVotes: nbVotes,
          weightedScore: weightedScore,
          bayesianScore: bayesianScore,
          genres: genres,
          releaseDates: releaseDates
      });
      console.log("anime ID: " + id);
      resolve(anime.save());
    }
    else if(manga){
      let manga= new Manga({
        name: name,
        type: "Manga",
        id: id,
        imgSrc: imageSrc,
        plotSummary: plotSummary,
        nbVotes: nbVotes,
        weightedScore: weightedScore,
        bayesianScore: bayesianScore,
        genres: genres,
        releaseDates: releaseDates
      });
      console.log("manga ID: " + id);
      resolve(manga.save());
    }

    }
    });
  });
  });
    });
};

// async function test() {
//     for (let i = 0; i < 2; i++) {
//         console.log('Before await for ', i);
//         let result = await Promise.resolve(i);
//         console.log('After await. Value is ', result);
//     }
// }
//
// test().then(_ => console.log('After test() resolved'));
//
// console.log('After calling test');


// depending if it is anime or manga, we need to check if result.ann.anime[0] is undefined, if so then we check if result.ann.manga[0] is undefined.
//if true add that one to the manga collection
//deal with the ones with no genres after
