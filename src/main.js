let _system;

// マウスダウン
// 起点を設定
// マウスダウン中はdrawLayerに描画
// 終わったらそれをbrushLayerに描画してDrawはclear
// 毎フレームbase,brushの順に描画

// xとかyはブラシが保持した方が良さそう...

// OpenProcessingに落とせません。ふざけてる...
// 仕方ないや。こっちでやろ。

const DRAW_DETAIL = 50;
const SPEED_FACTOR = 0.1;

function setup() {
  createCanvas(800, 640);
  let _drawer = new Drawer();
  let _brush = new CircleBrush(2);
  _drawer.setBrush(_brush);
  _system = new DrawSystem();
  _system.setDrawer(_drawer);
}

function draw() {
  clear();
  _system.step();
  _system.display();
}

class DrawSystem{
  constructor(){
    this.baseLayer = createGraphics(width, height);
    this.brushLayer = createGraphics(width, height);
    this.debugLayer = createGraphics(width, height); // デバッグ用
    this.prepareBaseLayer();
  }
  prepareBaseLayer(){
    let bl = this.baseLayer;
    bl.fill(255);
    bl.textSize(16);
    bl.textAlign(LEFT, TOP);
    bl.text("drawing test", 10, 10);
  }
  setDrawer(_drawer){
    this.drawer = _drawer;
  }
  getBrushLayer(){
    return this.brushLayer;
  }
  start(){
    this.drawer.start();
  }
  step(){
    if(this.drawer.getIsDrawing()){ this.drawer.step(); }
  }
  complete(){
    this.drawer.complete(this.brushLayer);
  }
  clear(){
    this.brushLayer.clear();
  }
  display(){
    image(this.baseLayer, 0, 0);
    image(this.brushLayer, 0, 0);
    image(this.drawer.getDrawLayer(), 0, 0);
    image(this.debugLayer, 0, 0);
  }
}

class Drawer{
  constructor(){
    this.drawLayer = createGraphics(width, height);
    this.isDrawing = false;
    // xとyはbrushが保持するので。
    this.speedFactor = 0.1;
    // ブラシ
    // データをこれに送るとこれがdrawLayerに描画します。
    this.brush = undefined;
  }
  setBrush(newBrush){
    // ゆくゆくはブラシの集合体みたいのを作って
    // そこから文字列で取得できるように...
    // 個別のコンフィグとかもしたいし。
    this.brush = newBrush;
    this.brush.initialize(this.drawLayer);
  }
  getBrush(){
    return this.brush;
  }
  getIsDrawing(){
    return this.isDrawing;
  }
  getDrawLayer(){
    return this.drawLayer;
  }
  start(){
    this.brush.set(mouseX, mouseY);
    this.isDrawing = true;
  }
  step(){
    this.brush.step(this.drawLayer);
  }
  complete(gr){
    gr.image(this.drawLayer, 0, 0);
    this.drawLayer.clear();
    this.isDrawing = false;
  }
}

// grにどんな指示を出すのかについても
// こっちが指定しないといけなさそうだけど
// まあ特にリセットする必要もないかな
// 継承先でいろいろさせればいい
class Brush{
  constructor(w){
    // currentPos.
    this.cx = 0;
    this.cy = 0;
    this.lastX = 0; // 備え付けでOK. draw内で適宜更新する。
    this.lastY = 0;
    this.w = w; // ブラシの幅情報
  }
  initialize(gr){
    // brushごとの初期化処理
  }
  setParam(paramName, value){
    // 汎用パラメータ設定関数
    this[paramName] = value;
  }
  set(x, y){
    this.cx = x;
    this.cy = y;
    this.lastX = x;
    this.lastY = y;
  }
  step(gr){
    // 逐次更新処理。この中でdrawを実行する。
    let px = this.cx;
    let py = this.cy;
    let qx = this.cx;
    let qy = this.cy;
    qx += (mouseX - px) * SPEED_FACTOR;
    qy += (mouseY - py) * SPEED_FACTOR;
    let dirVec = createVector(qx-px, qy-py).normalize();
    let norVec = createVector(-dirVec.y, dirVec.x);
    for(let i = 0; i < DRAW_DETAIL; i++){
      let x = px + (qx - px) * i / DRAW_DETAIL;
      let y = py + (qy - py) * i / DRAW_DETAIL;
      this.draw(gr, x, y, dirVec, norVec);
    }
    this.cx = qx;
    this.cy = qy;
  }
  draw(gr, x, y, dirVec, norVec){
    // brushごとの描画処理
    // dirVecが進行方向の単位ベクトル、
    // norVecがそれをx軸としたときのy軸、
    // xとyが描画に使う位置情報。あっちではほんとにこのくらい
    // しか使ってない。simple is best.
  }
}

// シンプルに
class CircleBrush extends Brush{
  constructor(w){
    super(w);
    this.col = "#fff";
  }
  initialize(gr){
    gr.fill(this.col);
    gr.noStroke();
  }
  draw(gr, x, y, dirVec, norVec){
    // たとえばw*0.5だけ進んだ時描画するようにするなど
    if(mag(this.lastX - x, this.lastY - y) > this.w*0.5){
      gr.circle(x, y, this.w);
      this.lastX = x;
      this.lastY = y;
    }
  }
}

function mousePressed(){
  _system.start();
}

function mouseReleased(){
  _system.complete();
}

function keyTyped(){
  // Dキーで全消し
  if(keyCode == 68){ _system.clear(); }
  // Ctrl+Zで戻る機能（そのうち実装）
  if(keyIsDown(17)&&keyCode==90){ console.log("back"); }
  // Ctrl+Yで進む機能（そのうち実装）
  if(keyIsDown(17)&&keyCode==89){ console.log("forward"); }
}
