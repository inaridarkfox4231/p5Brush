let _system;

// マウスダウン
// 起点を設定
// マウスダウン中はdrawLayerに描画
// 終わったらそれをbrushLayerに描画してDrawはclear
// 毎フレームbase,brushの順に描画

// xとかyはブラシが保持した方が良さそう...

// お騒がせしました。
// ダークモードで背景無いのを黒と勘違いしてた。馬鹿。

// さてと。

// 二重線難しいのね...
// あーなるほど
// 変位を記録していってそれらを結べばいいんだ。
// 毎回計算し直すから途切れちゃうわけね。

// そうか
// 点そのものを記録するのね。
// 変位じゃなくて。

// +と*間違えた。あってる？んかな。

// ベジエまでの道のりが遠い

// コンフィグに関してはそのうちまあ...
// 自由に追加していじれるようにしましょう。

// 色の濃淡が連続的に変化するのも面白そう...

// ハートとかツタやりたい。あと木の枝みたいのと
// とげとげやりたいです。肉球とかも。
// スレッドお化け坊や（？？？）
// ベジエで。

// ベジエの重心っていうのは多分、重複無しで。まあ当然...
// そうなるとそこら辺難しいね。
// 重複無しのリストが必要だわね。今日はここまで。

// 文字とかでも面白いかもね。
// なんか、古文とか（知らんけど）

// とげブラシ？？
// できた
// Math.random()をMath.randomって書いてた
// こういうのエラー出してくれないのほんと（社会性フィルター）
// にゃ～ん

// ハートブラシは実装したいよね
// あと矢印とか作ってみたい（普通のやつ）
// 星とかもいいね（いろいろあったやつ）

const DRAW_DETAIL = 50;
const SPEED_FACTOR = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let _drawer = new Drawer();
  let _brush1 = new CircleBrush(5, "#fa4", 2);
  let _brush2 = new LineBrush(1, "#af4");
  let _brush3 = new MultiLineBrush(1, "#4af", 5);
  let _brush4 = new TriangleBrush(16, "#ff0", 1.2);
  let _brush5 = new ThornBrush(40, "#0a0", 1.2, 0.8, 0.04);
  _drawer.setBrush(_brush5);
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
    bl.background(0);
    bl.fill(255);
    bl.textSize(14);
    bl.textAlign(LEFT, TOP);
    bl.text("drawing test", 10, 10);
    bl.text("D: clear", 10, 30);
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
    this.noStart = true; // 最初のdrawだけなんかさせたい的な
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
    this.noStart = true;
  }
  step(gr){
    // 逐次更新処理。この中でdrawを実行する。
    let px = this.cx;
    let py = this.cy;
    let qx = this.cx;
    let qy = this.cy;
    qx += (mouseX - px) * SPEED_FACTOR;
    qy += (mouseY - py) * SPEED_FACTOR;
    let speed = mag(qx-px, qy-py);
    if(speed < 1){ return; }
    let dx = (qx-px)/speed;
    let dy = (qy-py)/speed;
    for(let i = 0; i < DRAW_DETAIL; i++){
      let x = px + (qx - px) * i / DRAW_DETAIL;
      let y = py + (qy - py) * i / DRAW_DETAIL;
      this.draw(gr, x, y, dx, dy);
    }
    this.cx = qx;
    this.cy = qy;
  }
  draw(gr, x, y, dx, dy){
    // brushごとの描画処理
    // (dx,dy)が単位ベクトル
    // xとyが描画に使う位置情報。あっちではほんとにこのくらい
    // しか使ってない。simple is best.
  }
}

// シンプルに
class CircleBrush extends Brush{
  constructor(w, col = "#fff", intervalFactor = 0.5){
    super(w);
    this.col = col;
    this.intervalFactor = intervalFactor;
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.fill(this.col);
    gr.noStroke();
  }
  draw(gr, x, y, dx, dy){
    // たとえばw*0.5だけ進んだ時描画するようにするなど
    if(mag(this.lastX - x, this.lastY - y) < this.w*this.intervalFactor){ return; }
    gr.circle(x, y, this.w);
    this.lastX = x;
    this.lastY = y;
  }
}

// 線を引く
class LineBrush extends Brush{
  constructor(w, col = "#fff"){
    super(w);
    this.col = col;
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noFill();
    gr.stroke(this.col);
    gr.strokeWeight(this.w);
  }
  draw(gr, x, y, dx, dy){
    if(mag(this.lastX - x, this.lastY - y) < this.w * 0.5){ return; }
    gr.line(this.lastX, this.lastY, x, y);
    this.lastX = x;
    this.lastY = y;
  }
}

// 多重線を引く
class MultiLineBrush extends Brush{
  constructor(w, col = "#fff", multiple = 1, intervalFactor = 10){
    super(w);
    this.col = col;
    this.multiple = multiple;
    this.intervalFactor = intervalFactor; // 幅のこれ倍だけ離す
    // lastX,Yとは別に線それぞれに対してlastX,Yに相当する
    // 配列を用意して記録しつつそれらの間に線を引く。
    // これで途切れずに済む。
    this.lastXs = [];
    this.lastYs = [];
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noFill();
    gr.stroke(this.col);
    gr.strokeWeight(this.w);
  }
  draw(gr, x, y, dx, dy){
    const d = this.w * this.intervalFactor;
    const l = (this.multiple-1) * 0.5 * d;
    if(this.noStart){
      // 最初だけの処理
      this.lastXs = [];
      this.lastYs = [];
      for(let i = 0; i < this.multiple; i++){
        this.lastXs.push(x-dy*(-l+i*d));
        this.lastYs.push(y+dx*(-l+i*d));
      }
      this.noStart = false;
      return;
    }
    if(mag(this.lastX - x, this.lastY - y) < this.w * 0.5){ return; }

    for(let i = 0; i < this.multiple; i++){
      const nextX = x-dy*(-l+i*d);
      const nextY = y+dx*(-l+i*d);
      gr.line(this.lastXs[i], this.lastYs[i], nextX, nextY);
      this.lastXs[i] = nextX;
      this.lastYs[i] = nextY;
    }
    this.lastX = x;
    this.lastY = y;
  }
}

// 三角形移しますね。
class TriangleBrush extends Brush{
  constructor(w, col = "#fff", intervalFactor = 1){
    super(w);
    this.col = col;
    this.intervalFactor = intervalFactor;
    // 三角形の形（正三角形とか）いじっても面白そうだけど。
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noStroke();
    gr.fill(this.col);
  }
  draw(gr, x, y, dx, dy){
    if(mag(this.lastX - x, this.lastY - y) < this.w * this.intervalFactor){ return; }
    gr.triangle(this.lastX-dy*this.w/3, this.lastY+dx*this.w/3, this.lastX+dy*this.w/3, this.lastY-dx*this.w/3, this.lastX + dx * this.w, this.lastY + dy * this.w);
    this.lastX = x;
    this.lastY = y;
  }
}

// baseColはベース色
// intervalはとげの配置間隔（ピクセル）で1～1.5が良き
// 幅は40くらいを想定
// colorBandは色のブレ具合で0.7くらいだといい感じ
// thickはとげの厚さでデフォは0.04くらい、要するに渡しに対する幅
class ThornBrush extends Brush{
  constructor(w, baseCol = "#2a2", interval = 1, colorBand = 0.7, thick = 0.04){
    super(w);
    const _color = color(baseCol);
    this.r = red(_color);
    this.g = green(_color);
    this.b = blue(_color);
    this.interval = interval;
    this.colorBand = colorBand;
    this.thick = thick;
  }
  initialize(gr){
    gr.blendMode(LIGHTEST);
    gr.noStroke();
  }
  drawThorn(gr, x0, y0, x1, y1){
    const midX = (x0+x1)/2;
    const midY = (y0+y1)/2;
    const diffX = (y0-y1)*this.thick;
    const diffY = (x1-x0)*this.thick;
    gr.beginShape();
    gr.vertex(x0, y0);
    gr.quadraticVertex(midX+diffX, midY+diffY, x1, y1);
    gr.quadraticVertex(midX-diffX, midY-diffY, x0, y0);
    gr.endShape();
  }
  draw(gr, x, y, dx, dy){
    if(mag(this.lastX - x, this.lastY - y)<this.interval){ return; }
    // 1～w/2のランダム値
    let r1 = 1 + Math.random()*(this.w/2-1);
    let t1 = Math.random()*Math.PI*2;
    let x1 = r1*cos(t1);
    let y1 = r1*sin(t1);
    let rt1 = calcIntersections(cos(t1)/r1, sin(t1)/r1, 0, 0, this.w/2+1);
    let rt2 = calcIntersections(cos(t1)/r1, sin(t1)/r1, 0, 0, this.w);
    let p0 = rt2[0];
    let p1 = rt1[0];
    let p2 = rt1[1];
    let p3 = rt2[1];
    if(mag(p0.x-p1.x,p0.y-p1.y) > mag(p0.x-p2.x,p0.y-p2.y)){
      let tmpX = p2.x; let tmpY = p2.y;
      p2.x = p1.x; p2.y = p1.y;
      p1.x = tmpX; p1.y = tmpY;
    }
    let h0 = Math.random();
    let h1 = Math.random();
    let q0 = {};
    q0.x = p0.x + (p1.x-p0.x)*h0;
    q0.y = p0.y + (p1.y-p0.y)*h0;
    let q1 = {};
    q1.x = p2.x + (p3.x-p2.x)*h1;
    q1.y = p2.y + (p3.y-p2.y)*h1;
    // 次に色。
    const h = Math.random();
    const band = this.colorBand;
    let _r, _g, _b;
    if(h < 0.5){
      _r = this.r * (1 - band + h * band * 2);
      _g = this.g * (1 - band + h * band * 2);
      _b = this.b * (1 - band + h * band * 2);
    }else{
      _r = this.r + (255 - this.r) * (h - 0.5) * band * 2;
      _g = this.g + (255 - this.g) * (h - 0.5) * band * 2;
      _b = this.b + (255 - this.b) * (h - 0.5) * band * 2;
    }
    gr.fill(_r, _g, _b);
    // このq0,q1がx,yからのdiffになる感じ。
    this.drawThorn(gr, x+q0.x, y+q0.y, x+q1.x, y+q1.y);
    this.lastX = x;
    this.lastY = y;
  }
}

// ハートブラシ
// あの形でおしりが頭にくるようなのを作りたい。
// ベジエブラシっていうクラスを別に用意...した方が
// いいのかもしれない。
// 調べたら中心ではないっぽい？...

// アイコンブラシっていうクラスを設けて
// アイコン部分だけとっかえるのもいいと思う。
class HeartBrush extends Brush{

}

function mousePressed(){
  _system.start();
}

function mouseReleased(){
  _system.complete();
}

function keyTyped(){
  // Dキーで全消し
  if(keyCode==68){ _system.clear(); }
  // Ctrl+Zで戻る機能（そのうち実装）
  if(keyIsDown(17)&&keyCode==90){ console.log("back"); }
  // Ctrl+Yで進む機能（そのうち実装）
  if(keyIsDown(17)&&keyCode==89){ console.log("forward"); }
  // Shift+Aキーでブラシを変える機能。設定はデバッグモードで
  // 詳細表示予定
  if(keyIsDown(16)&&keyCode==65){
    console.log("change brush");
  }
}

// utility.

// 直線ax+by=1と中心(cx,cy)半径rの円の交点を出す汎用関数
// ax+by=1だと計算が楽になる上に直線の取り扱いが容易なのよね
// これでまあまあ便利です
function calcIntersections(a, b, cx, cy, r){
  let result = [];
  let divisor = a*a + b*b;
  let k = divisor * Math.pow(r, 2) - Math.pow(cx*a + cy*b - 1, 2);
  if(k < 0){ return []; }
  let g = cx*b - cy*a;
  let det = Math.sqrt(k);
  let x1 = (a + b*g + b*det) / divisor;
  let y1 = (b - a*g - a*det) / divisor;
  result.push({x:x1, y:y1});
  if(det === 0){ return []; }
  let x2 = (a + b*g - b*det) / divisor;
  let y2 = (b - a*g + a*det) / divisor;
  result.push({x:x2, y:y2});
  return result;
}
