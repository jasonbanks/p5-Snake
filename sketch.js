let snakewidth=10;
let wallsize=10;

let colorblack;
let colorwhite;
let colorred;
let colorblue;
let backdrop;
let board=640;

let gridmax=62;

let fruits_x=[];
let fruits_y=[];
let segments_x=[];
let segments_y=[];

let mode=0;
let facing='U';
let fruits_count=1;
let segments_count=1;
let debugMode = 0;
let maxfruit = 3;
let fruitcount=0;
let fruitspeed=2000;

let gamespeed=20;
let delta=0;
let score=0;
let add_seg=false;


function setup() {
  frameRate(30);
  colorMode(RGB, 255);
  createCanvas(board,board);
  noStroke();

  colorblack = color(0,0,0);
  colorwhite = color(255,255,255);
  colorred = color(255,0,0);
  colorblue = color(100,100,255);
  backdrop = color(220,220,220);
}

function draw() {

  background(backdrop);
  //-- paint in background

  //-- draw outside wall
  fill(colorblack);
  rect(0,0,board,wallsize);
  rect(0,0,wallsize,board);
  rect(board-wallsize,0,board,board);
  rect(0,board-wallsize,board,board);
  
  switch (mode)
  {
    case 0: StartGame(); break;
    case 2: PlayGame(); break;
    case 3: UhOh(); break;
  }  

  if (debugMode==1)
  {
    showDebug();
  }
}

function UhOh()
{
  text("You are very dead!",20,20);
  text("score: " + score,20,40);
}

function AddFruit()
{
  if (fruits_count<maxfruit)
  {
    fruits_count+=1;
    fruits_x.push(floor(random(5+gridmax-10)));
    fruits_y.push(floor(random(5+gridmax-10)));
  }
}

function StartGame()
{
  mode=2;

  //fruits_x = new [];
  //fruits_y = new [];
  fruits_count=0;
  AddFruit();

  facing='U';
  //segments_x = new [];
  //segments_y = new [];
  segments_count=3;
  segments_x.push(30);
  segments_x.push(30);
  segments_x.push(30);
  segments_y.push(30);
  segments_y.push(31);
  segments_y.push(32);

  gamespeed=10;
  delta = 1000/gamespeed;
  anim = 0;
  fruitcount=0;

  score=0;
  add_seg = false;
  canMove=true;
}

function moveSnake()
{
  if (add_seg==true)
  {
    segments_x.unshift(segments_x[0]);
    segments_y.unshift(segments_y[0]);
    add_seg=false;
    segments_count+=1;
  }
  for(let index=segments_count-1;index>0;index--)
  {
    segments_x[index]=segments_x[index-1];
    segments_y[index]=segments_y[index-1];
  }


  switch (facing)
  {    
    case 'U': segments_y[0] = segments_y[0]-1; break;      
    case 'D': segments_y[0] = segments_y[0]+1; break;      
    case 'L': segments_x[0] = segments_x[0]-1; break;      
    case 'R': segments_x[0] = segments_x[0]+1; break;      
      break;
  }
}
function keyPressed() 
{
  //if (canMove)
  //{
    switch(keyCode)
    {
      case UP_ARROW: if (facing!='D') facing='U'; break;
      case DOWN_ARROW: if (facing!='U') facing='D'; break;
      case LEFT_ARROW: if (facing!='R') facing='L'; break;
      case RIGHT_ARROW: if (facing!='L') facing='R'; break;
      case 68: toggleDebug(); break;
    }
  //}
  //canMove=false;
}

function toggleDebug()
{
  debugMode = !debugMode;
}

function PlayGame()
{
  fruitcount += deltaTime;
  if (fruitcount>fruitspeed)
  {
    fruitcount-=fruitspeed;
    AddFruit();
  }

  anim = anim + deltaTime;
  if (anim > delta)
  {
    anim-=delta;    
    moveSnake();
    doChecks();
    canMove=true;
  }
  
  //-- check collisions
  
  //-- update board
  //--   
  for(let index=0;index<segments_count;index++)
  {
    drawSnakeSegment(segments_x[index],segments_y[index]);
  }
  
  for(let index=0;index<fruits_count;index++)
  {
    drawFruit(fruits_x[index], fruits_y[index]);
  }
}


function doChecks()
{
  let headx = segments_x[0];
  let heady = segments_y[0];

  if (headx<0 || headx>=gridmax ||
    heady<0 || heady>=gridmax)
    {
      mode=3;
    }

  
  for (let i=1;i<segments_count+1;i++)
  {
    if (headx==segments_x[i] &&
        heady==segments_y[i])
      {
        //-- you are dead!
        mode=3;
      }
  }
  
  let found=-1;
  
  for (let i=0;i<fruits_count;i++)
  {
    if (headx==fruits_x[i] &&
        heady==fruits_y[i])
      {
        score+=1;
        add_seg=true;
        found=i;
      }
  }

  if (found!=-1)
  {
    let index=0;
    while (index<found)
    {
      fruits_x.push(fruits_x.shift());
      fruits_y.push(fruits_y.shift());
      index+=1;
    }

    fruits_x.shift(); 
    fruits_y.shift();
    fruits_count-=1;
  }

  
}

function drawSnakeSegment(x,y)
{
  fill(colorblue);  
//  strokeWeight(snakewidth);
  let left = wallsize + (snakewidth*x);
  let top = wallsize + (snakewidth *y);
  rect (left,top,snakewidth,snakewidth);
}

function drawFruit(x,y)
{
  fill(colorred);
//  strokeWeight(snakewidth);
  let left = wallsize + (snakewidth*x);
  let top = wallsize + (snakewidth *y);
  rect (left,top,snakewidth,snakewidth);
}

function showDebug()
{
  fill(0);
  text("mode: " + mode, 20,20);
  text("segs: " + segments_count, 20,30);
  text("fruits: " + fruits_count, 20,40);
  text("facing: " + facing,20,50);
  text("delta: " + deltaTime,20,60);
  text("allow move: " + canMove,20,70);

  let c = segments_count;
  if (c>10) c=10;
  for(let i=0;i<c;i++)
  {
    text("seg(" + segments_x[i] + "," + segments_y[i]+ ")", 300,20+(10*i));
  }
  
  c = fruits_count;
  if (c>10) c=10;
  for(let i=0;i<c;i++)
  {
    text("fr(" + fruits_x[i] + "," + fruits_y[i]+ ")", 450,20+(10*i));
  }
}