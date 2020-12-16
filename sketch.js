var dog,happyDog,dogImg,garden,bedroom;
var database;
var foodS,foodStock;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload()
{
  dogImg=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(800, 700);
  database = firebase.database();

  var dog=createSprite(250,300,100,100);
  dog.addImage(dogImg);
  dog.scale=0.5;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20);

  foodObj=new Food()

  feed=createButton("Feed the dog");
  feed.position(1100,390);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(1200,390);
  addFood.mousePressed(addFoods);

}


function draw() {  
  drawSprites();
  background(46,139,87);
  

  fill(255,255,254);
  stroke("black");
  text("food remaining :"+foodS,170,200);
  textSize(13);

  fill(255,255,254);
  textSize(25);
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
 }else if(currentTime==(lastFed+2)){
  update("Sleeping");
    foodObj.bedroom();
 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
    foodObj.washroom();
 }else{
  update("Hungry")
  foodObj.display();
 }
 
 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog)

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}



