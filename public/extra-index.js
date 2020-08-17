var genres = [];
var difficulty = "normal";
for(var i = 0; i < 28; ++i){
document.querySelectorAll("button")[i].addEventListener("click",function(){
  //alert("a button was clicked with a value of: " + this.value);
  if(this.value === "username"){
    //alert("username inputed");
    //alert("ajax request was made");
    let input = document.querySelector("input");
    this.classList.add("hide");
    // var inputBox = document.querySelector("input");
    // sessionStorage.setItem("usernameField",inputBox.value);
    input.classList.add("hide");
    var para = document.createElement("P");                 // Create a <p> element
    para.innerHTML = "Welcome " + input.value + "!";                // Insert text
    document.querySelector(".inputField").appendChild(para);     // Append <p> to <div> with id="myDIV"
    $.post("/",{button: this.value, input: input.value},function(data, status){
      //alert("Data: " + data + "\nStatus: " + status);
    });
  }
  else if(this.classList.contains("genres")){
    if(this.classList.contains("clicked")){
      this.classList.remove("clicked");
      var index = genres.indexOf(this.value);
      genres.splice(index,1);
    }
    else{
      this.classList.add("clicked");
      genres.push(this.value);
    }

  }
  else if(this.value === "difficulty"){
    let clicked = document.querySelector(".clicked.difficulty");
    if(clicked !== null && clicked !==this){
      clicked.classList.remove("clicked");
      this.classList.add("clicked");
      difficulty = this.innerHTML;
    }
    else if(this.classList.contains("clicked")){
      this.classList.remove("clicked");
      difficulty = "Normal";
    }
    else{
      this.classList.add("clicked");
      difficulty = this.innerHTML;
    }
    //console.log("difficulty");
  }
  else if(this.value === "play"){
    //alert(genres);
    $.post("/",{button: "ajax", genres: genres, difficulty: difficulty },function(data, status){
    });
    var input = document.createElement("input");
    input.name = "button";
    input.value = "play";
    input.classList.add("hide");
    document.querySelector(".inputField").appendChild(input);
    document.querySelector("form").submit();
  }
});
};

// if(sessionStorage.getItem("usernameField")){
//   document.querySelector(".btn-sm").classList.add("hide");
//   var inputBox = document.querySelector("input");
//   inputBox.classList.add("hide");
//   var para = document.createElement("P");                 // Create a <p> element
//   para.innerHTML = "Welcome " + sessionStorage.getItem("usernameField") + "!";                // Insert text
//   document.querySelector(".inputField").appendChild(para);
// };
