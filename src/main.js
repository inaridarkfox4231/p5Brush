let _system;

// どこまでやるのか
// 戻るの仕様がよく分からないのでそこら辺調べる
// あとはサイズ指定して透明で保存できるようにするとか
// 実用性はどうでもいいのでそんなもんで
// どうせこれも将来なんか書く際のこやしになるだけ

// kumaleonに落としたいのです
// ボタンでブラシ切り替え、色だけ変えられるようにする。
// そんなもんでいいよ。とりあえず。

// Scatterに月型とかキラキラとか増やすとか

// てかそれより消しゴムを作ってほしいんだけど。
// おそらくブラシ...でいける...？
// 透明度のあるあれをかぶせればいいみたい。
// なのでブラシの応用でできるはず...です。

// ソフ消しは透明度circleのerase貼り付けでいけますよ
// エアブラシはエアブラシで別に作りましょう
// Eキーを押している間だけ消しゴムになる仕様にしても面白そう
// Eキー離したら自動的に元のブラシに戻るようにすればなお良し

// 以上です
// あっちでブラシ切り替え実装しちゃった
// 本来は...
// updateDisplayとか使って
// いやhideでいいか
// あのあれ
// まずブラシに名前を付けて
// あとsystem側からブラシを操作できるようにポインタを渡す
// 以上

const DRAW_DETAIL = 50;
const SPEED_FACTOR = 0.1;

const pathData = {};
pathData.heart = "M 0 0.56 C -1 -0.14 -0.5 -0.84 0 -0.35 C 0.5 -0.84 1 -0.14 0 0.56";
pathData.star = "M 0 -0.5 L 0.1123 -0.1545 L 0.4755 -0.1545 L 0.1816 0.059 L 0.2939 0.4045 L 0 0.191 L -0.2939 0.4045 L -0.1816 0.059 L -0.4755 -0.1545 L -0.1123 -0.1545 Z";

// 0.8倍にした
// つまり線の間隔は8です（標準で）
pathData.quarterRest = "M -1.714 -12.000 L 4.190 -4.952 C 0.000 -0.635 1.334 2.413 5.016 5.778 L 4.762 6.222 C 3.302 5.524 1.905 5.270 0.318 6.286 C -0.889 7.619 0.190 8.889 1.650 10.158 L 1.270 10.540 C -0.571 8.698 -3.619 6.032 -1.905 4.127 C -0.698 2.540 0.826 3.048 1.968 3.492 L -2.603 -1.460 C -1.587 -3.132 0.381 -4.952 0.571 -6.603 C 0.635 -8.952 -0.889 -10.286 -1.968 -11.682 Z";
pathData.eighthNoteFlag = "M 3.722 -28.174 L 3.548 -0.348 L 4.418 -0.348 L 4.418 -19.478 C 7.548 -17.566 8.591 -15.304 9.634 -12.000 C 10.157 -10.087 9.634 -7.826 8.766 -5.566 C 7.896 -4.000 9.461 -2.782 9.982 -4.870 C 11.200 -7.304 11.896 -12.174 9.809 -15.652 C 8.070 -19.478 5.809 -21.739 4.766 -25.566 L 4.418 -28.174 Z";
pathData.eighthRest = "M -1.000 -4.500 C 0.750 -6.500 -0.750 -8.500 -2.000 -8.500 C -5.000 -9.000 -5.250 -5.500 -3.500 -4.000 C -1.250 -2.750 0.500 -2.500 2.500 -4.000 L -1.000 8.000 L 0.750 8.000 L 4.750 -8.250 L 3.500 -8.500 C 3.500 -6.000 2.000 -4.500 0.000 -4.000 Z";

function setup() {
  createCanvas(windowWidth, windowHeight);
  let _drawer = new Drawer();
  let _brush1 = new CircleBrush(10, {col:"#fa4", intervalFactor:1.5});
  let _brush2 = new LineBrush(1, {col:"#af4"});
  let _brush3 = new MultiLineBrush(1, {col:"#4af", multiple:5});
  let _brush4 = new TriangleBrush(16, {col:"#ff0", intervalFactor:1.2});
  let _brush5 = new ThornBrush(45, {baseCol:"#04f", interval:1.0, colorBand:0.8, thick:0.02});
  let _brush6 = new CurveIconBrush(20, {col:"#f4f", kind:"heart", intervalFactor:1.35});
  let _brush7 = new CurveIconBrush(20, {col:"#fa4", kind:"star", intervalFactor:1.1});
  // 0.8の方がそれっぽいから
  // 修正しないといけないかもしれない
  // SVGデータ作り直すの面倒なのでこのデータをいじります
  let _brush8 = new MusicBrush(1, {col:"#4af"});

  let _brush9 = new ScatterIconBrush(20, {col:"#0af", secondCol:"#aff"});

  let _brush10 = new ScatterIconBrush(20, {col:"#f0f", secondCol:"#fff", kind:"heart", intervalFactor:0.5, sizeMinRatio:0.5, sizeMaxRatio:0.75});
  // 星屑とかやってみたいわね
  _drawer.setBrush(_brush9);
  _system = new DrawSystem();
  _system.setDrawer(_drawer);
}

function draw() {
  clear();
  // xとyにしないと。
  _system.step(mouseX, mouseY);
  _system.display();
}

// --------------------------------------------------- //
// DrawSystem.

// baseLayerは固定背景です
// brushLayerはdrawerに描画した内容を貼り付けるところです。
// infoLayerは情報用です。
class DrawSystem{
  constructor(){
    this.baseLayer = createGraphics(width, height);
    this.brushLayer = createGraphics(width, height);
    this.infoLayer = createGraphics(width, height); // デバッグ用
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
  start(x, y){
    this.drawer.start(x, y);
  }
  step(x, y){
    if(this.drawer.getIsDrawing()){ this.drawer.step(x, y); }
  }
  complete(){
    this.drawer.complete(this.brushLayer);
  }
  clear(){
    this.brushLayer.clear();
  }
  display(){
    image(this.baseLayer, 0, 0);
    // これまで描画した内容をbrushLayerにおいていく
    image(this.brushLayer, 0, 0);
    // 描画途中のブラシの描画内容をおく
    image(this.drawer.getDrawLayer(), 0, 0);
    image(this.infoLayer, 0, 0);
  }
}

// ------------------------------------------------------- //
// Drawer.

// ここを再利用できるのかどうかって話
// drawLayerですが、ここに描いていく。で、済んだらgrを受け取って
// そこに落とす（complete関数）
// start(x,y)で起点を指定
// step(x,y)を毎フレーム実行する
// あのあれ、毎フレームのマウス位置しか渡してないです。
// 詳しい処理はBrushでやってる。

// なのでこれを移植するのであれば
// ここに好きなブラシを登録して文字列で呼び出して使う、
// そしてcomplete関数で好きなフレームに落とせばいいんだ。
// わぉ！かんたん！
// しかもx,yを曲線上の点にすれば
// パラメトライズされた曲線状にブラシを適用することもできる。
// (一度に全部描くと負荷が大きそうだけど...)
// んーその場合は毎フレームとかすればいいよ
// んで切りのいいところで切る
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
  start(x, y){
    this.brush.set(x, y);
    this.isDrawing = true;
  }
  step(x, y){
    this.brush.step(this.drawLayer, x, y);
  }
  complete(gr){
    gr.image(this.drawLayer, 0, 0);
    this.drawLayer.clear();
    this.isDrawing = false;
  }
}

// ----------------------------------------------------------- //
// Brush.

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
  registParam(param, paramName, dft){
    // paramのparamName属性があればそれを設定、なければdftを設定
    this.setParam(paramName, param[paramName], dft);
  }
  setParam(paramName, value, dft = undefined){
    // 汎用パラメータ設定関数
    // valueがundefinedの場合はdftを設定する感じ
    // 無くてもいい
    if(value == undefined){ this[paramName] = dft; return; }
    this[paramName] = value;
  }
  set(x, y){
    this.cx = x;
    this.cy = y;
    this.lastX = x;
    this.lastY = y;
    this.noStart = true;
  }
  step(gr, x, y){
    // 逐次更新処理。この中でdrawを実行する。
    let px = this.cx;
    let py = this.cy;
    let qx = this.cx;
    let qy = this.cy;
    qx += (x - px) * SPEED_FACTOR;
    qy += (y - py) * SPEED_FACTOR;
    let speed = mag(qx-px, qy-py);
    if(speed < 1){ return; }
    let dx = (qx-px)/speed;
    let dy = (qy-py)/speed;
    for(let i = 0; i < DRAW_DETAIL; i++){
      let ax = px + (qx - px) * i / DRAW_DETAIL;
      let ay = py + (qy - py) * i / DRAW_DETAIL;
      this.draw(gr, ax, ay, dx, dy);
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
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#fff");
    this.registParam(param, "intervalFactor", 1.5);
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
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#fff");
    //this.col = col;
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
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#fff");
    this.registParam(param, "multiple", 1);
    this.registParam(param, "intervalFactor", 10);
    //this.col = col;
    //this.multiple = multiple;
    //this.intervalFactor = intervalFactor; // 幅のこれ倍だけ離す
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

// やっぱややこしいから1でいいや。
// つまり音符とかも細い長方形で描くということ...
// 四分休符はあれで。4で割って幅とする。

// 致命的なバグだ...
// 直します。
class MusicBrush extends Brush{
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#fff");
    // 五線譜記述用
    this.lastXs = [];
    this.lastYs = [];
    // 四分休符描画用
    this.quarterRestPath = new Path2D(pathData.quarterRest);
    this.eighthNoteFlagPath = new Path2D(pathData.eighthNoteFlag);
    this.eighthRestPath = new Path2D(pathData.eighthRest);
    this.space = w*8; // 五線譜の間隔
    this.barProg = 0; // バープログレス（進行度）
    // x,yとlastX,lastYの距離を加算していく
    // 165を超えたところでリセットする感じ
    // 整数部分を取って描画の基準とする
    this.tone = 0; // トーン-4～4
    // 連符があまり差があると不格好なのでそこら辺の制御に使う
    this.rhythmArray = [0, 0, 1, 2];
    this.rhythm = 0;
    // 冒頭で決める。0で四分音符、1で連符、2で休符。
    // バリエーションからランダムに取得しても良さそうだけど。
    // 165の頭で決めて40で割った商から以下略
    this.drawFlag = false;
    // 音符の重複描画を防ぐためのフラグ
    this.tupletParam = {close:{x:0,y:0}, far:{x:0,y:0}, lower:false};
    // 連符描画用
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.fill(this.col);
    gr.stroke(this.col);
    gr.strokeWeight(this.w);
    this.setRhythm();
  }
  drawStart(x, y, dx, dy){
    // 初期化
    const d = this.space;
    const l = 2*d;
    // 最初だけの処理
    this.lastXs = [];
    this.lastYs = [];
    for(let i = 0; i < 5; i++){
      this.lastXs.push(x-dy*(-l+i*d));
      this.lastYs.push(y+dx*(-l+i*d));
    }
    this.barProg = 0;
  }
  draw5line(gr, x, y, dx, dy){
    const d = this.space;
    const l = 2*d;
    for(let i = 0; i < 5; i++){
      const nextX = x-dy*(-l+i*d);
      const nextY = y+dx*(-l+i*d);
      gr.line(this.lastXs[i], this.lastYs[i], nextX, nextY);
      this.lastXs[i] = nextX;
      this.lastYs[i] = nextY;
    }
  }
  setRhythm(){
    this.rhythmArray = [0, 1, 2, 3];
    // おいおいね
  }
  drawQuarterNote(gr, x, y, dx, dy, inv = false){
    gr.push();
    gr.translate(x, y); // x, yに行く
    gr.rotate(atan2(dy, dx)); // 進行方向
    gr.translate(0, this.tone*this.space*0.5); // 縦ずれ
    if(inv){
      gr.rotate(Math.PI); // 上の場合
    }
    gr.rotate(1+PI/2); // 楕円描画(あ、そうかPI/2か。)
    gr.ellipse(0, 0, this.space*1.1, this.space*0.8);
    gr.rotate(-1-PI/2); // 楕円描画終わり（お騒がせしました...）
    gr.line(this.space*0.5, -this.w*2, this.space*0.5, -this.w*2-this.space*3.3); // 3.5だったんですけど小さくしました
    gr.pop();
  }
  drawQuarterRest(gr, x, y, dx, dy){
    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));
    gr.scale(this.w);
    gr.drawingContext.fill(this.quarterRestPath);
    gr.pop();
  }
  drawEighthRest(gr, x, y, dx, dy){
    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));
    gr.scale(this.w);
    gr.drawingContext.fill(this.eighthRestPath);
    gr.pop();
  }
  drawEighthNote(gr, x, y, dx, dy, inv = false){
    gr.push();
    gr.translate(x, y); // x, yに行く
    gr.rotate(atan2(dy, dx)); // 進行方向
    gr.translate(0, this.tone*this.space*0.5); // 縦ずれ
    if(inv){
      gr.rotate(Math.PI); // 上の場合
    }
    gr.rotate(1+PI/2); // 楕円描画
    gr.ellipse(0, 0, this.space*1.1, this.space*0.8);
    gr.rotate(-1-PI/2); // 楕円描画終わり
    // TODO:ここで旗
    if(this.tone < 0){
      gr.rotate(Math.PI); // 戻す
      gr.applyMatrix(1,0,0,-1,0,0);
      gr.translate(-this.space, -this.w*2); // 割と力ずく
    }
    gr.scale(this.w);
    gr.drawingContext.fill(this.eighthNoteFlagPath);
    gr.pop();
  }
  setTuplesParam(x, y, dx, dy, lower){
    this.tupletParam.lower = lower;
    // upperがtrueの場合はdx,dy方向にずらしてからdy,-dx方向に
    // spaceの2.7と3.5で...どのくらいずらすかというとspace/2です。
    const t = this.tone;
    const d = this.space * 0.5;
    const e = (lower ? -1:1);
    this.tupletParam.close = {x:x - dy*t*d + e*dx*d + e*dy*d*7, y:y + dx*t*d + e*dy*d - e*dx*d*7};
    this.tupletParam.far = {x:x - dy*t*d + e*dx*d + e*dy*d*6.3, y:y + dx*t*d + e*dy*d - e*dx*d*6.3};
  }
  drawTuplesFlag(gr, x, y, dx, dy){
    // 向きは記録されたものを使う。
    const {x:x1, y:y1} = this.tupletParam.close;
    const {x:x2, y:y2} = this.tupletParam.far;
    const t = this.tone;
    const d = this.space * 0.5;
    const e = (this.tupletParam.lower ? -1:1);
    gr.quad(x1,y1,x - dy*t*d + e*dx*d + e*dy*d*7,y + dx*t*d + e*dy*d - e*dx*d*7, x - dy*t*d + e*dx*d + e*dy*d*6.3, y + dx*t*d + e*dy*d - e*dx*d*6.3, x2, y2);
  }
  getNextTone(t){
    // tに対して±5の範囲で行き先をランダムに取得
    const _min = max(t-5, -4);
    const _max = min(t+5, 4);
    return _min + Math.floor(Math.random()*(_max-_min));
  }
  draw(gr, x, y, dx, dy){
    // 五線譜描画は基本で、それとは別になんか置いていく。
    if(this.noStart){
      this.drawStart(x, y, dx, dy);
      this.noStart = false;
      return;
    }
    const m = mag(this.lastX - x, this.lastY - y);
    if(m < this.w * 0.5){ return; }
    this.draw5line(gr, x, y, dx, dy);

    this.lastX = x;
    this.lastY = y;

    // 以下、音符など
    const prevBP = Math.floor(this.barProg / this.w);
    this.barProg += m; // 累積距離
    // ここでbpが増えた場合にのみ
    // 描画命令の可否をリセットする
    const bp = Math.floor(this.barProg / this.w);
    if(prevBP < bp){ this.drawFlag = true; }
    // するとあるbarProgで描画がなされたとき、そのあとのフレームで
    // bpが増えなければ、同じところへの描画は為されない。
    // ちょっと気になったので。
    if(bp > 165){
      // 区切り線を引く
      gr.push();
      gr.translate(x, y);
      gr.rotate(atan2(dy, dx));
      gr.line(0, -this.space*2, 0, this.space*2);
      gr.pop();
      this.setRhythm();
      this.barProg = 0;
    }
    const rhythmId = Math.floor(bp / 40);
    if(bp % 40 == 0 && rhythmId < 4){
      this.rhythm = this.rhythmArray[rhythmId];
      if(this.rhythm !== 3){
        this.tone = Math.floor(random()*9)-4;
      }
    }

    if(bp % 40 == 26 && this.drawFlag){
      if(this.rhythm == 0){
        this.drawQuarterNote(gr, x, y, dx, dy, (this.tone < 0));
      }
      if(this.rhythm == 3){
        this.drawQuarterRest(gr, x, y, dx, dy);
      }
      this.drawFlag = false;
    }
    if((bp % 40 == 16 || bp % 40 == 36) && this.drawFlag){
      if(this.rhythm == 1){
        if(bp % 40 == 16){
          this.drawEighthNote(gr, x, y, dx, dy, (this.tone < 0));
        }else{
          this.drawEighthRest(gr, x, y, dx, dy);
        }
        this.drawFlag = false;
        if(bp % 40 == 16){
          // 再生成
          this.tone = Math.floor(random()*9)-4;
        }
      }
      if(this.rhythm == 2){
        if(bp % 40 == 16){
          this.drawQuarterNote(gr, x, y, dx, dy, (this.tone < 0));
          this.drawFlag = false;
          // ここで位置を記録
          this.setTuplesParam(x, y, dx, dy, (this.tone < 0));
          // 再計算
          this.tone = this.getNextTone(this.tone);
        }
        if(bp % 40 == 36){
          this.drawQuarterNote(gr, x, y, dx, dy, this.tupletParam.lower);
          // ここで旗を描画
          this.drawTuplesFlag(gr, x, y, dx, dy);
          this.drawFlag = false;
        }
      }
    }
  }
}

// 三角形移しますね。
class TriangleBrush extends Brush{
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#fff");
    this.registParam(param, "intervalFactor", 1);
    //this.col = col;
    //this.intervalFactor = intervalFactor;
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
  constructor(w, param){
    super(w);
    this.registParam(param, "baseCol", "#2a2");
    const _color = color(this.baseCol);
    this.r = red(_color);
    this.g = green(_color);
    this.b = blue(_color);
    this.registParam(param, "interval", 1);
    this.registParam(param, "colorBand", 0.7);
    this.registParam(param, "thick", 0.04);
    //this.interval = interval;
    //this.colorBand = colorBand;
    //this.thick = thick;
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
    // quadにしよう。
    gr.quad(x0,y0,midX+diffX,midY+diffY,x1,y1,midX-diffX,midY-diffY);
    /*
    gr.beginShape();
    gr.vertex(x0, y0);
    gr.quadraticVertex(midX+diffX, midY+diffY, x1, y1);
    gr.quadraticVertex(midX-diffX, midY-diffY, x0, y0);
    gr.endShape();
    */
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

// ベジエはコンポーネントにします
// 一つだけ作って生成時に渡してって感じ
// 基本的には初期化したうえで一つの図形を描画する形を
// 構成するものです
// 使うのはquadとbezierとlineですけど
// まあそれしかないので

// 複数のサブパスで奇遇規則...なるほど...
// それ実装したいから一旦保留かなぁ。

// ハートブラシ
// Path2Dを使おう
// 複数パスが可能で奇遇規則にも対応してる優れものらしい
// strokeWeightがscaleで変化してしまう問題には対応してないので
// 主にfillオンリーの場合に使用は限られるが...
// あれ
// webglならそこら辺大丈夫だと思うけどね。
// だから大きさ変えてstrokeオンリーのあれこれ複製するなら
// まあそういうのは普通に毎回描くべきだろ....2Dで。
// というわけなので臨機応変に切り替えていこ

// カーブアイコンブラシ
// ハート 星 など
class CurveIconBrush extends Brush{
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#f4f");
    this.registParam(param, "kind", "heart");
    this.registParam(param, "intervalFactor", 1.2);
    //this.col = col;
    //this.kind = kind;
    this.path = new Path2D(pathData[this.kind]);
    //this.intervalFactor = intervalFactor;
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noStroke();
    gr.fill(this.col);
  }
  draw(gr, x, y, dx, dy){
    if(mag(this.lastX - x, this.lastY - y)<this.w * this.intervalFactor){ return; }
    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));
    gr.scale(this.w);
    gr.drawingContext.fill(this.path);
    gr.pop();
    this.lastX = x;
    this.lastY = y;
  }
}

// 色を2つ指定するとその間のblend（線形補間）で
// いろんな色のいろんな大きさのオブジェクトが配置される感じ
// 向きもランダムで
class ScatterIconBrush extends Brush{
  constructor(w, param){
    super(w);
    this.registParam(param, "col", "#ff4");
    this.registParam(param, "secondCol", this.col); // 補間色
    this.registParam(param, "kind", "star");
    this.registParam(param, "intervalFactor", 0.25);
    this.registParam(param, "sizeMinRatio", 0.3); // 1.0～0.3倍
    this.registParam(param, "sizeMaxRatio", 1); // 一応。
    // 設置する範囲の半径倍率（wの何倍か）
    //this.col = col;
    //this.kind = kind;
    this.path = new Path2D(pathData[this.kind]);
    //this.intervalFactor = intervalFactor;
  }
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noStroke();
  }
  draw(gr, x, y, dx, dy){
    if(mag(this.lastX - x, this.lastY - y)<this.w * this.intervalFactor){ return; }
    const iconCol = lerpColor(color(this.col), color(this.secondCol), Math.random());
    gr.fill(iconCol);
    gr.push();
    const _radius = Math.sqrt(Math.random())*this.w;
    const _angle = Math.random()*Math.PI*2;
    gr.translate(x + _radius * Math.cos(_angle), y + _radius * Math.sin(_angle));
    const rotationAngle = Math.random()*Math.PI*2;
    gr.rotate(rotationAngle);
    const sizeFactor = this.sizeMinRatio + Math.random()*(this.sizeMaxRatio - this.sizeMinRatio);
    gr.scale(this.w * sizeFactor);
    gr.drawingContext.fill(this.path);
    gr.pop();
    this.lastX = x;
    this.lastY = y;
  }
}

// シンプルなツタ（はっぱが両側に付くだけ）
class SimpleIvyBrush extends Brush{

}

// エアブラシ
class AirBrush extends Brush{

}

// ------------------------------------------------------- //
// interaction.

function mousePressed(){
  _system.start(mouseX, mouseY);
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

// ----------------------------------------------------------- //
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
