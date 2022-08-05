let yoff = 0.0;
let background_color;
let foreground_color;
let current_color;
let color_saturation= 1;
let layer_height;
let ground_height= 0;
let vertical_sky_counter=0;
let lerp_level=0;
let xoff_incr;

function setup() {
  colorMode(HSB, 360, 100, 100);
  let palettes = [[color(0),color('#b25926')],[color('#fed38f'),color('#b25926')],[color('#9CBBAA'),color('#533825')]];    
  createCanvas(600, 600);
  blendMode(MULTIPLY); 
  let palette_index = floor(random(palettes.length));
  background_color =palettes[palette_index][0]; foreground_color =palettes[palette_index][1];
  xoff_incr = (floor(random(1,4)))/100;//higher => more jagged landscape
  layer_height = height*1.7;//lower multiplier => landscape appears lower on canvas
  drawClearSkyGradations(background_color, getNewShadeForColor(foreground_color, .9), height, width);
}

function drawLand() {
  noStroke();
  color_saturation-=.00005;
  if(layer_height>0){
    layer_height=layer_height-3;//higher # subtracted => more vertical distance between layers
    current_color=getNewShadeForColor(foreground_color, color_saturation);
    fill(current_color);
    beginShape();
    let xoff = 0; 
    for (let x = 0; x <= width; x += 10) {
      let y = map(noise(xoff, yoff), 0, 1, ground_height, layer_height);
      vertex(x, height- y);
      xoff += xoff_incr;
    }
    yoff += 0.01;
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function drawSky(top_color, bottom_color, h, w) {
  let stroke_weight=.5;
  let incr = (1/(h/stroke_weight));
  strokeWeight(stroke_weight);
  let c = lerpColor(top_color, bottom_color,  lerp_level);
  lerp_level+=incr;
  stroke(c);
  line(0,vertical_sky_counter,w,vertical_sky_counter);
  if(vertical_sky_counter<h) vertical_sky_counter++;
  else return(0);
  return(vertical_sky_counter);
}

function draw() {
  drawLand();
}

function getNewShadeForColor(c, shade_perc){
  //negative shade_perc(%) fades from dark to color saturated, positive from light to saturated
  let h = hue(c); let s= saturation(c)-(shade_perc*(saturation(c)) ); let b= brightness(c)+(shade_perc*(100-brightness(c)));
  if(b>100) b=100;
  if(s<0) s=0;
  return (color(h,s,b)); 
}

function drawClearSkyGradations(top_color, bottom_color, h, w){
  let stroke_weight=1;
  let incr = (1/(h/stroke_weight));
  let lerp_level = 0;
  strokeWeight(stroke_weight);
  for (let j = 0; j < h; j++){  
    let c = lerpColor(top_color, bottom_color,  lerp_level);
    lerp_level+=incr;
    stroke(c);
    line(0,j,w,j);
  }
}