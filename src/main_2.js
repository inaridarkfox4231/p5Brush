let _system;
let _dat; // グローバル～

let config = {
  brush: "circle",
  col: "#fff",
}

// グラデーションブラシ
// 同じ場所に上書きするタイプ。
// x,y,z,wを決めるとx,yからz,wに向かってグラデーションする。
// 描画は通常のあれ。そのうち実装。
// デフォルトで0,0のw,hですかね

// ノイズに従って色が変化するペンとか面白そう

// クリップと塗りつぶし...？？

// 2022/07/04
// 複製しました。こっちを更新していきます。

// log
// とりあえず完了...

// 戻るは要するにキャンバスをいくつか用意しといて
// 適当なタイミングでセーブしてそこに戻る感じ
// だからどんどんひとつのキャンバスに描いていってよくって
// タッチが離れるとかそういうタイミングでセーブすればいいだけ
// だと思う
// もしくはオフスクリーンに同時に描いていくなど。

// pointerにoffscreenという、
// targetと同じサイズのキャンバスを持たせて、
// activeな間そこに描画していってそれをtargetに貼り付ける感じに
// するといい。そうすれば、
// こっちのキャンバスだけADDにするとかができるようになるので。
// （貼り付けの際は上からそのまま押し付ける）
// ブラシがそれをstartUp処理でやってくれる予定

// そうです。pointerにはactive/inActiveを実装します。で、
// activeなときだけ～描く。

// ------------------------------------------------------------- //

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

// みつあみとか縄みたいのも面白そうね

// 最後にクリックした場所からシフトキーでクリックでライン
// とかあってもよさそう
// 他にもスナップ機能とか
// いろいろ実装したい
// Altクリックでスポイトとか
// Rで回転させてもいい（15°刻み）

// よく考えたら導入時のcolって要らないな？
// これ省いて別に変えられるようにしよう。wのデフォは
// ブラシによって変えられるようにするけど。

// ブラシごとにパラメータ変えるんだったら、
// Scatterのstarとheartとかも切り替えできるようにしないとね

// 円弧のSVGで月形を実装、円も実装してCircleブラシはなくす。

// pointerクラス
// デバイス
// そこに色とか太さを持たせてあと描画開始終了フラグさらに位置情報
// drawerに登録してその情報で描画する
// ブラシと連携させる
// ブラシはdrawerからポインターを受け取りリアルタイムで
// 色や位置や太さ情報を受け取り
// それに基づいて描画処理を行なうようにするってわけ
// こうすることで
// マウス描画と自由に点が動く、規則に従って動くなど、
// の、両立が可能になるし、
// ゆくゆくはスタイラスで描けるようになる、はず。

// あとSVGについては関数から呼び出すようにする
// 同じこといくつも書くのめんどくさい
// グローバルにオブジェクト用意しておいて文字列で一括呼び出し
// でいいじゃん。クソ面倒。

// という感じなので
// すべて面倒でも色や幅情報は描画時に決める感じで
// 書き直してください
// それやらないと始まらないです
// 五線譜、描画中に幅変更するのOKでした
// いけます！！
// 音楽ブラシの方はそこら辺ちょっとうまくいってないので

// fill optionは選べるように
// これとSVG描画のあれ、グローバルの関数に入れるときに
// 選べるようにするといいかもしれない

// pointerのプロパティ
// fill:flag.
// stroke:flag.
// w(weight)
// fillColor, strokeColor
// x,y
// 描画フラグ（マウスダウンでON, マウスアップでOFF）
// 結局のところ、これ自身をpath描画するときに渡してしまう。
// すなわちブラシに渡して描画時にブラシから渡すわけ。

// drawerにpointer渡してグローバルのpointerのactivateすることで
// 描画がなされるようにすれば
// System側からstartとかする必要なくなるので記述が楽になるわけ

// てかさ...

// もしかしてdrawer要らない？？（そうかもね）
// ポインターをブラシに渡す...

// ああ、整理しないとダメね...
// いちいちdrawer経由するのがバカバカしくなってきた

// 状況を整理しよう
// 今どんな風に描画がなされているのか？？
// というか描画は...
// Systemがあってそこにブラシが格納されてる
// どのブラシを使うのかSystemに登録されてて
// そのブラシに位置情報を...
/*
  System - Brushes
         - Pointer
  PointerをBrushに渡してそれにx,y,px,py,w,col,flag,activeが入ってて
  activeならBrushが描画をするしなければ何もしない
  その方がシンプルでわかりやすい気がしてきた
*/

// DrawSystemはSystemに改名
// start: カレントブラシに描画発動を依頼→不要？
// pointerにactivateする形であれするんだったら
// いや要るか...最初の処理が必要のはず
// Brushに描画開始時の処理を新たに追加してそれの中身を
// いじることで...とかできそうだし（ランダムシードの設定とか）
// いや普通に要るわ。
// step: カレントブラシが描画処理を実行する
// activeが要らないのか...そうね。
// pointerの初期化処理は要ると思う。
// 自動的に動くことを想定しているならそうするべき。
// あと別グラフィックに描画するのありだと思う
// ていうかグラフィック渡してそこに描画させる形にしよう。
// そうすれば描画のポストエフェクトと処理を分離するのが容易に
// なる。background(0,9)であれしたりとか。blendModeの設定も
// 外部から自由に行えるし。オーバーレイ掛けたりとか。
// Completeで描画終了時の処理。自由に動く場合は要らないかもだけど。
// そうでない場合（マウスやスタイラスで動かす場合）は要ると思う。

// 結論：drawerは不要。
// 大幅にアプデしないといけないわね...

// Pointerを複数用意する？
// 複数...
// Systemも複数...？？
// Pointerごとに違うブラシを設定してそれぞれ...
// ああなるほど、Pointerにブラシを持たせてそれをSystem側で...
// ってやればいける？のか？複数のPointerに違うブラシを持たせるとか
// するのも今の状態では無理ですね。
// System-Pointer
// Pointers？？
// 複数タッチ？ああー。。。

// Systemは複数のPointerを保持して毎フレームstepさせるだけ
// グラフィックを渡す、ブラシを渡す
// 描画の終了と開始はPointerがやるのでSystemから命令することはない
// active関連の処理やっぱ要るわね
// んでactivateとinActivate
// 同じグラフィックを共有するので
// 今までのようにある程度描いてclear～といったようなことはしない
// どんどん描いていく
// blend指示がある場合はその都度Brush側で切り替える

// brushによって適切なwが違うので
// Pointerはwの割合（1～0.1的な）をいじれるだけにする
// 筆圧とか表現したい

// あと
// fillOptionはさすがにブラシ側でいじるべきでしょ
// Pointerに持たせるのは無意味

// あるいは
// Pointerにブラシを一通り持たせてその内容をいじる...？
// もしくは別々の...んー。

// Systemにブラシの一覧を持たせる
// SystemがPointerにブラシを渡す
// プログラムによってはブラシの構成が違う
// 特定の目的に応じた利用を可能にしたいってわけ
// こっちでブラシを作って名前を決めて持たせてもいいし
// System側でブラシを改変して複製とかもできるようにする
// そんなところで。

// ブラシから色を排除してwはパラメータの一部とし
// wでいいか

const DRAW_DETAIL = 50;
//const SPEED_FACTOR = 0.1;

let myCanvas;

// 円と月を追加
const pathData = {
  heart:"M 0 0.56 C -1 -0.14 -0.5 -0.84 0 -0.35 C 0.5 -0.84 1 -0.14 0 0.56",
  star:"M 0 -0.5 L 0.1123 -0.1545 L 0.4755 -0.1545 L 0.1816 0.059 L 0.2939 0.4045 L 0 0.191 L -0.2939 0.4045 L -0.1816 0.059 L -0.4755 -0.1545 L -0.1123 -0.1545 Z",
  circle:"M 0.5 0 A 0.5 0.5 0 1 1 0.5 -0.01 Z",
  moon:"M 0.5 0.49 A 0.7 0.7 0 1 1 0.5 -0.49 A 0.5 0.5 0 1 0 0.5 0.49 Z",
// 0.8倍にした
// つまり線の間隔は8です（標準で）
  quarterRest:"M -1.714 -12.000 L 4.190 -4.952 C 0.000 -0.635 1.334 2.413 5.016 5.778 L 4.762 6.222 C 3.302 5.524 1.905 5.270 0.318 6.286 C -0.889 7.619 0.190 8.889 1.650 10.158 L 1.270 10.540 C -0.571 8.698 -3.619 6.032 -1.905 4.127 C -0.698 2.540 0.826 3.048 1.968 3.492 L -2.603 -1.460 C -1.587 -3.132 0.381 -4.952 0.571 -6.603 C 0.635 -8.952 -0.889 -10.286 -1.968 -11.682 Z",
  eighthNoteFlag:"M 3.722 -28.174 L 3.548 -0.348 L 4.418 -0.348 L 4.418 -19.478 C 7.548 -17.566 8.591 -15.304 9.634 -12.000 C 10.157 -10.087 9.634 -7.826 8.766 -5.566 C 7.896 -4.000 9.461 -2.782 9.982 -4.870 C 11.200 -7.304 11.896 -12.174 9.809 -15.652 C 8.070 -19.478 5.809 -21.739 4.766 -25.566 L 4.418 -28.174 Z",
  eighthRest:"M -1.000 -4.500 C 0.750 -6.500 -0.750 -8.500 -2.000 -8.500 C -5.000 -9.000 -5.250 -5.500 -3.500 -4.000 C -1.250 -2.750 0.500 -2.500 2.500 -4.000 L -1.000 8.000 L 0.750 8.000 L 4.750 -8.250 L 3.500 -8.500 C 3.500 -6.000 2.000 -4.500 0.000 -4.000 Z",
}

// パス2Dの生成
const paths = {};
for(let _key of Object.keys(pathData)){
  paths[_key] = new Path2D(pathData[_key]);
}

// パス描画
function drawPath(gr, name, col, size, fillFlag = true){
  if(fillFlag){
    gr.fill(col);
    gr.noStroke();
    gr.scale(size);
    gr.drawingContext.fill(paths[name]);
  }else{
    gr.stroke(col);
    gr.strokeWeight(0.1);
    gr.noFill();
    gr.scale(size);
    gr.drawingContext.stroke(paths[name]);
  }
}

// リズムたち
const rhythmPatterns = [[2,1,2,1],[1,1,2,1],[0,0,2,0],[2,2,1,3],[0,0,2,2,],[2,3,2,3],[2,2,2,1]];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // myCanvasを渡してそこに描画させる感じ
  myCanvas = createGraphics(width, height);

  // myCanvasを渡してそこに描画させる
  _system = new System(myCanvas);
  const p = new MousePointer(myCanvas);
  _system.registPointer(p);

  //let _drawer = new Drawer();
  //_system.setDrawer(_drawer);

  _system.registBrush(new CircleBrush("circle", {intervalFactor:1.5}));
  _system.registBrush(new LineBrush("line", {}));
  _system.registBrush(new MultiLineBrush("multiLine", { multiple:5}));

  _system.registBrush(new MusicBrush("music", {}));

  _system.registBrush(new TriangleBrush("triangle", {}));

  _system.registBrush(new ThornBrush("thorn", {interval:1.0, colorBand:0.8, thick:0.02}));

  _system.registBrush(new CurveIconBrush("curveHeart", {kind:"heart", intervalFactor:1.35, blendOption:ADD}));
  _system.registBrush(new CurveIconBrush("curveStar", {kind:"star", intervalFactor:1.1, fill:true, blendOption:ADD}));

  // 0.8の方がそれっぽいから
  // 修正しないといけないかもしれない
  // SVGデータ作り直すの面倒なのでこのデータをいじります

  _system.registBrush(new ScatterIconBrush("scatterStar", {w:20, secondCol:"#eef", fill:false}));

  _system.registBrush(new ScatterIconBrush("scatterHeart", {w:20, secondCol:"#fff", kind:"heart", intervalFactor:0.5, sizeMinRatio:0.5, sizeMaxRatio:0.75, blendOption:ADD}));

  _system.registBrush(new ScatterIconBrush("scatterMoon", {w:40, secondCol:"#a44", kind:"moon", intervalFactor:0.5, sizeMinRatio:0.25, sizeMaxRatio:0.5, blendOption:ADD}));


  // 星屑とかやってみたいわね
  // scatterは月とか。

  // _systemにブラシをセットすることはなくなった。
  // とはいえまあ今一つしかないので...
  // 切り替える形にするつもり。
  _system.setBrush("scatterHeart");
  _system.setCol("#44a");

  //_drawer.setBrush(_brush9);
}

function draw() {
  clear();
  // 引数がなくなりました。
  _system.update();
  _system.draw();
  image(myCanvas, 0, 0);
}

// --------------------------------------------------- //
// DrawSystem.(Systemの方がいいかなぁ)

// baseLayerは固定背景です
// brushLayerはdrawerに描画した内容を貼り付けるところです。
// infoLayerは情報用です。

// 大幅に書き換えます

// 案1:スケッチネーム
// これを用意して保存の際に使う（なければ""で初期化）
// かぶらないように秒数を使う
// 案2:サイズ変更の際のオプション
//   CUT:元の画像を左上ベースでコピペ。はみ出た分は消える。
//   STRETCH:元の画像を新しい画像に合うように比率調整
//   CLEAR:元の画像を破棄してすべてのレイヤーをクリアする
//   加えてサイズを指定できるようにしてもいいと思う
//   初期サイズをコンストラクタで指定できるようにはする
//   読み込み画像使う際にそれが出来ないと不便なので
//   他にもいろいろ...
// 案3:カスタム背景
//   というかこちらで用意した画像を背景として使えるようにする
class System{
  constructor(nodeLayer){
    this.nodeLayer = nodeLayer;
    this.baseLayer = createGraphics(nodeLayer.width, nodeLayer.height);
    this.paintLayer = createGraphics(nodeLayer.width, nodeLayer.height);
    this.infoLayer = createGraphics(nodeLayer.width, nodeLayer.height); // デバッグ用
    this.prepareBaseLayer();
    this.prepareInfoLayer();
    this.brushes = {};
    this.pointer = undefined;
  }
  registPointer(pointer){
    this.pointer = pointer;
    // paintLayerが現状唯一の書き込み可能なレイヤー
    // （背景は固定）
    pointer.setTargetLayer(this.paintLayer);
  }
  prepareBaseLayer(){
    let bl = this.baseLayer;
    bl.background(0, 32, 64);
  }
  prepareInfoLayer(){
    let il = this.infoLayer;
    il.fill(255);
    il.noStroke();
    il.rect(0, 0, 100, 50);
    il.fill(0);
    il.textSize(14);
    il.textAlign(LEFT, TOP);
    il.text("drawing test", 10, 10);
    il.text("D: clear", 10, 30);
  }
  registBrush(newBrush){
    const name = newBrush.getName();
    this.brushes[name] = newBrush;
  }
  setBrush(name){
    const brush = this.brushes[name];
    //this.drawer.setBrush(_brush);
    this.pointer.setBrush(brush);
  }
  setCol(col){
    this.pointer.setCol(col);
  }
  configBrush(name, param = {}){
    const _brush = this.brushes[name];
    for(let key of Object.keys(param)){
      _brush.setParam(key, param[key]);
    }
  }
  //setDrawer(_drawer){
  //  this.drawer = _drawer;
  //}
  //getPaintLayer(){
    // これを取得しpointerにtargetとして設定する感じですかね
  //  return this.paintLayer;
  //}
  start(x, y){
    // トリガーでpointerの位置を決める。
    // マウスとは限らない場合を考慮しx,yとしました。
    this.pointer.setPos(x, y);
    this.pointer.activate();
  }
  update(){
    this.pointer.update();
    //this.pointer.draw();
    //if(this.drawer.getIsDrawing()){ this.drawer.step(x, y); }
  }
  complete(){
    this.pointer.inActivate();
    //this.drawer.complete(this.brushLayer);
  }
  clear(){
    this.paintLayer.clear();
  }
  draw(){
    this.nodeLayer.clear();
    // 背景
    this.nodeLayer.image(this.baseLayer, 0, 0);
    // これまで描画した内容をpaintLayerにおいていく
    this.nodeLayer.image(this.paintLayer, 0, 0);
    // 描画途中のpointerによる描画内容をおく(activeな場合)
    //gr.image(this.drawer.getDrawLayer(), 0, 0);
    this.pointer.draw();
    // 必要ならinfo.
    this.nodeLayer.image(this.infoLayer, 0, 0);
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
/*
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
    this.drawClear();
    this.isDrawing = false;
  }
  drawClear(){
    // drawLayerだけ個別でclearするようにする
    // たとえばパラメータチェンジの際にこれを呼び出すことで
    // パラメータいじる間の描画を防ぐことができる...（はず）
    this.drawLayer.clear();
  }
}
*/
// ----------------------------------------------------------- //
// Pointer.
// fillかstrokeの2択でいいよ
// targetCanvasは土台でtargetLayerは対象レイヤー。
// activeである間はtargetCanvasの方に描画途中のoffscreenを
// 描画し続ける感じ。描画が終了したら、
// targetLayerの方にoffscreenを貼り付けたうえでoffscreenをclear
// という仕組みにする。こうすることで、
// offscreenだけblendModeをいじるみたいなことが可能になると同時に
// targetLayerを差し替えることでレイヤー管理の可能性も出てくる
// あくまで可能性ですが

// lastX,lastYはpointer側に持たせます
// （）
// そうしないと同じブラシの共有ができないので。
// まあブラシ側が持つべき情報じゃない...
// お絵描きツールならそれでいいんだけどね...

// 五線譜とかもそうだけどちょっと無理があるわね
// パラメータ用のオブジェクトがあればいいわけね
// んー

// x,yは現在位置、px,pyは前の位置、lx,lyは最後に描画した位置
// です。

// tempDistとtotalDistを導入しました
// これを使って色を連続的に変えたりできるはず。んー。
class Pointer{
  constructor(targetNode){
    this.pos = {x:0, y:0, px:0, py:0, lx:0, ly:0};
    this.col = "#fff"; // デフォルト：白
    this.force = 1; // wをこれで可変にする。渡すとき考慮。
    this.brush = undefined; // ブラシ
    this.targetNode = targetNode; // 描画先のノード
    this.targetLayer = undefined; // 描画終了時の貼付先レイヤー
    // offscreen. リサイズではこっちもいじらないとなぁ。
    // どう設定するかはbrushが決める。
    this.offscreen = createGraphics(targetNode.width, targetNode.height);
    this.active = false; // activeなときに
    this.params = {}; // 特殊なブラシ用のパラメータセット
    // マウスダウンからの距離と総合距離
    this.tempDist = 0;
    this.totalDist = 0;
  }
  setPos(x, y){
    this.pos.x = x;
    this.pos.y = y;
    this.pos.px = x;
    this.pos.py = y;
    this.pos.lx = x;
    this.pos.ly = y;
  }
  setCol(col){
    this.col = col;
  }
  setForce(force){
    this.force = force;
  }
  setBrush(brush){
    this.brush = brush;
  }
  setTargetLayer(targetLayer){
    this.targetLayer = targetLayer;
  }
  getPos(){
    return this.pos;
  }
  getCol(){
    return this.col;
  }
  getForce(){
    return this.force;
  }
  getBrush(){
    return this.brush;
  }
  activate(){
    this.active = true;
    // オフスクリーンに描画準備
    // startUpとは...
    this.brush.startUp(this.offscreen, this.params);
    this.tempDist = 0;
  }
  inActivate(){
    this.active = false;
    // targetLayerに結果を貼り付けてクリアする
    this.targetLayer.image(this.offscreen, 0, 0);
    this.offscreen.clear();
    this.totalDist += this.tempDist;
  }
  isActive(){
    return this.active;
  }
  update(){
    /* 位置更新処理 */
    if(!this.active){ return; }
    this.tempDist += mag(this.pos.x - this.pos.px, this.pos.y - this.pos.py);
  }
  draw(){
    /* colとforceを使ってbrushでtargetに描画 */
    // よく考えたらstepの方が正解だったわ
    // stepの中でdrawするんだったわ
    if(!this.active){ return; }
    // offscreenに描画してから
    this.brush.step(this.offscreen, this.pos, this.col, this.force, this.params);
    // ノードに貼り付け。ノードは毎フレームクリアされるので
    // これでOK.
    this.targetNode.image(this.offscreen, 0, 0);
  }
}

class MousePointer extends Pointer{
  constructor(targetNode, speedFactor = 0.1){
    super(targetNode);
    this.speedFactor = speedFactor;
  }
  update(){
    if(!this.active){ return; }
    // マウス位置に向かって動かす
    const mx = mouseX;
    const my = mouseY;
    let {pos} = this;
    pos.px = pos.x;
    pos.py = pos.y;
    pos.x += (mx - pos.x) * this.speedFactor;
    pos.y += (my - pos.y) * this.speedFactor;
    this.tempDist += mag(pos.x - pos.px, pos.y - pos.py);
  }
}

// 挙動部分だけ...

// ----------------------------------------------------------- //
// Brush.

// grにどんな指示を出すのかについても
// こっちが指定しないといけなさそうだけど
// まあ特にリセットする必要もないかな
// 継承先でいろいろさせればいい

class Brush{
  constructor(name){
    // currentPos.
    //this.cx = 0;
    //this.cy = 0;
    //this.lastX = 0; // 備え付けでOK. draw内で適宜更新する。
    //this.lastY = 0;
    // pointerのlx,lyをこちらで更新する。そして利用する。
    this.name = name; // ブラシの名前
    //this.w = w; // ブラシの幅情報
    //this.col = col; // ブラシの色（デフォは黒で統一）
    this.firstDrawed = true; // 最初のdrawだけなんかさせたい的な
  }
  //initialize(gr){
    // brushごとの初期化処理→廃止
    // blendとかは中でやるのでいいです。
  //}
  startUp(gr, params){
    // offscreenとparamsで
    // 描画開始時に行う処理。
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
  getName(){
    return this.name;
  }
  /*
  set(x, y){
    this.cx = x;
    this.cy = y;
    this.lastX = x;
    this.lastY = y;
    this.noStart = true;
  }
  */
  step(target, pos, col, force, params){
    // 逐次更新処理。この中でdrawを実行する。

    // pointerの情報からx,y,px,pyを抜き出す感じなので
    // lastX,lastY以外は要らないかなと。
    // ていうかこの2つは最後に描画した時のx,yです
    // こちらで使う情報ではないのです

    // 位置更新はポインターに任せてここでは描画だけやります
    let px = pos.px;
    let py = pos.py;
    let qx = pos.x;
    let qy = pos.y;
    let speed = mag(qx-px,qy-py);
    if(speed<1){ return; }
    let dx = (qx-px)/speed;
    let dy = (qy-py)/speed;
    for(let i = 0; i < DRAW_DETAIL; i++){
      let ax = px + (qx - px) * i / DRAW_DETAIL;
      let ay = py + (qy - py) * i / DRAW_DETAIL;
      this.draw(target, ax, ay, dx, dy, pos, col, force, params);
    }
    /*
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
    */
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    // brushごとの描画処理
    // (dx,dy)が単位ベクトル
    // xとyが描画に使う位置情報。あっちではほんとにこのくらい
    // しか使ってない。simple is best.

    // forceは普段1だしparamsは普段{}で使われない
    // posのlxとlyを更新する必要がある
  }
}

// wは基本的に直径もしくは線の太さ

// シンプルに
// ただ内容がかぶってるのでおそらく廃止されます（
// intervalFactorはwの何倍離すか
class CircleBrush extends Brush{
  constructor(name, param){
    super(name);
    //this.registParam(param, "col", "#fff");
    this.registParam(param, "w", 10);
    this.registParam(param, "intervalFactor", 1.5);
  }
  startUp(gr, params){
    gr.blendMode(BLEND);
    gr.noStroke();
    this.firstDrawed = false;
  }
  /*
  initialize(gr){
    gr.blendMode(BLEND);
    gr.fill(this.col);
    gr.noStroke();
  }
  */
  draw(gr, x, y, dx, dy, pos, col, force, params){
    // たとえばw*0.5だけ進んだ時描画するようにするなど
    const _w = this.w * force;
    if(!this.firstDrawed){ this.firstDrawed = true; }
    if(mag(pos.lx - x, pos.ly - y) < _w * this.intervalFactor){ return; }
    // これからはこっちでcolやforceを使っていく...
    gr.fill(col);
    gr.circle(x, y, _w);
    //this.lastX = x;
    //this.lastY = y;
    pos.lx = x;
    pos.ly = y;
  }
}

// 線を引く
class LineBrush extends Brush{
  constructor(name, param){
    super(name);
    this.registParam(param, "w", 2);
    //this.registParam(param, "col", "#fff");
    //this.col = col;
  }
  /*
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noFill();
    gr.stroke(this.col);
    gr.strokeWeight(this.w);
  }
  */
  startUp(gr, params){
    gr.blendMode(BLEND);
    gr.noFill();
    this.firstDrawed = false;
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    const _w = this.w * force;
    if(!this.firstDrawed){ this.firstDrawed = true; }
    if(mag(pos.lx - x, pos.ly - y) < _w * 0.5){ return; }
    gr.stroke(col);
    gr.strokeWeight(_w);
    gr.line(pos.lx, pos.ly, x, y);
    pos.lx = x;
    pos.ly = y;
  }
}

// 多重線を引く
class MultiLineBrush extends Brush{
  constructor(name, param){
    super(name);
    //this.registParam(param, "col", "#fff");
    this.registParam(param, "w", 1);
    this.registParam(param, "multiple", 5);
    this.registParam(param, "intervalFactor", 10);
    //this.col = col;
    //this.multiple = multiple;
    //this.intervalFactor = intervalFactor; // 幅のこれ倍だけ離す
    // lastX,Yとは別に線それぞれに対してlastX,Yに相当する
    // 配列を用意して記録しつつそれらの間に線を引く。
    // これで途切れずに済む。
    //this.lastXs = [];
    //this.lastYs = [];
    // これをparamsでやる...
  }
  /*
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noFill();
    gr.stroke(this.col);
    gr.strokeWeight(this.w);
  }
  */
  startUp(gr, params){
    gr.blendMode(BLEND);
    gr.noFill();
    params.lastXs = [];
    params.lastYs = [];
    this.firstDrawed = false;
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    const _w = this.w * force;
    const d = _w * this.intervalFactor;
    const l = (this.multiple-1) * 0.5 * d;
    if(!this.firstDrawed){
      for(let i = 0; i < this.multiple; i++){
        params.lastXs.push(x-dy*(-l+i*d));
        params.lastYs.push(y+dx*(-l+i*d));
      }
      this.firstDrawed = true;
    }

    //const d = _w * this.intervalFactor;
    //const l = (this.multiple-1) * 0.5 * d;
    //if(!this.firstDrawed){
      // 最初だけの処理
      //this.lastXs = [];
      //this.lastYs = [];

    //  this.noStart = false;
    //  return;
    //}
    const m = mag(pos.lx - x, pos.ly - y);
    if(m < _w * 0.5){ return; }
    gr.stroke(col);
    gr.strokeWeight(_w)

    for(let i = 0; i < this.multiple; i++){
      const nextX = x-dy*(-l+i*d);
      const nextY = y+dx*(-l+i*d);
      if(params.lastXs[i] == undefined){noLoop()}
      gr.line(params.lastXs[i], params.lastYs[i], nextX, nextY);
      params.lastXs[i] = nextX;
      params.lastYs[i] = nextY;
    }
    pos.lx = x;
    pos.ly = y;
  }
}

// やっぱややこしいから1でいいや。
// つまり音符とかも細い長方形で描くということ...
// 四分休符はあれで。4で割って幅とする。

// 致命的なバグだ...
// 直します。

// lastXs,lastYs,barProg, tone, rhythmArray, rhythm,
// drawFlag, tupletParamまで。spaceはその都度計算するし、
// path関連はグローバルを使う。
class MusicBrush extends Brush{
  constructor(name, param){
    super(name);
    this.registParam(param, "w", 1);
    //this.registParam(param, "col", "#fff");
    // 五線譜記述用
    //this.lastXs = [];
    //this.lastYs = [];
    // 四分休符描画用
    //this.quarterRestPath = new Path2D(pathData.quarterRest);
    //this.eighthNoteFlagPath = new Path2D(pathData.eighthNoteFlag);
    //this.eighthRestPath = new Path2D(pathData.eighthRest);
    //this.space = w*8; // 五線譜の間隔
    //this.barProg = 0; // バープログレス（進行度）
    // x,yとlastX,lastYの距離を加算していく
    // 165を超えたところでリセットする感じ
    // 整数部分を取って描画の基準とする
    //this.tone = 0; // トーン-4～4
    // 連符があまり差があると不格好なのでそこら辺の制御に使う
    //this.rhythmArray = [0, 0, 1, 2];
    //this.rhythm = 0;
    // 冒頭で決める。0で四分音符、1で連符、2で休符。
    // バリエーションからランダムに取得しても良さそうだけど。
    // 165の頭で決めて40で割った商から以下略
    //this.drawFlag = false;
    // 音符の重複描画を防ぐためのフラグ
    //this.tupletParam = {close:{x:0,y:0}, far:{x:0,y:0}, lower:false};
    // 連符描画用
  }
  /*
  initialize(gr){
    gr.blendMode(BLEND);
    gr.fill(this.col);
    gr.stroke(this.col);
    gr.strokeWeight(this.w);
    this.setRhythm();
  }
  */
  startUp(gr, params){
    gr.blendMode(BLEND);
    // 各種パラメタ
    params.lastXs = [];
    params.lastYs = [];
    params.barProg = 0;
    params.tone = 0;
    params.rhythmArray = [0,1,2,3];
    params.rhythm = 0;
    params.drawFlag = true;
    params.tupletParam = {close:{x:0,y:0}, far:{x:0,y:0}, lower:false};
    this.firstDrawed = false;
  }
  /*
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
  */
  draw5line(gr, x, y, dx, dy, space, params){
    //const d = this.space;
    const l = 2*space;
    for(let i = 0; i < 5; i++){
      const nextX = x-dy*(-l+i*space);
      const nextY = y+dx*(-l+i*space);
      gr.line(params.lastXs[i], params.lastYs[i], nextX, nextY);
      params.lastXs[i] = nextX;
      params.lastYs[i] = nextY;
    }
  }
  setRhythm(params){
    params.rhythmArray = random(rhythmPatterns);
    // おいおいね
    // いくつかのパターンから選ばれるようにするとか？
  }
  drawQuarterNote(gr, x, y, dx, dy, col, tone, size, space, inv = false){
    gr.push();
    gr.translate(x, y); // x, yに行く
    gr.rotate(atan2(dy, dx)); // 進行方向
    gr.translate(0, tone*space*0.5); // 縦ずれ
    if(inv){
      gr.rotate(Math.PI); // 上の場合
    }

    gr.noStroke();
    gr.fill(col);
    gr.rotate(1+PI/2); // 楕円描画
    gr.ellipse(0, 0, space*1.1, space*0.8);
    gr.rotate(-1-PI/2); // 楕円描画終わり

    gr.stroke(col);
    gr.noFill();
    gr.line(space*0.5, -size*2, space*0.5, -size*2-space*3.3); // 3.5だったんですけど小さくしました
    gr.pop();
  }
  drawQuarterRest(gr, x, y, dx, dy, col, size){
    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));

    //gr.scale(this.w);
    //gr.drawingContext.fill(this.quarterRestPath);
    drawPath(gr, "quarterRest", col, size);

    gr.pop();
  }
  drawEighthRest(gr, x, y, dx, dy, col, size){
    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));

    //gr.scale(this.w);
    //gr.drawingContext.fill(this.eighthRestPath);
    drawPath(gr, "eighthRest", col, size);

    gr.pop();
  }
  drawEighthNote(gr, x, y, dx, dy, col, tone, size, space, inv = false){
    gr.push();
    gr.noStroke();
    gr.fill(col);
    gr.translate(x, y); // x, yに行く
    gr.rotate(atan2(dy, dx)); // 進行方向
    gr.translate(0, tone*space*0.5); // 縦ずれ
    if(inv){
      gr.rotate(Math.PI); // 上の場合
    }
    gr.rotate(1+PI/2); // 楕円描画
    gr.ellipse(0, 0, space*1.1, space*0.8);
    gr.rotate(-1-PI/2); // 楕円描画終わり
    // TODO:ここで旗
    if(tone < 0){
      gr.rotate(Math.PI); // 戻す
      gr.applyMatrix(1,0,0,-1,0,0);
      gr.translate(-space, -size*2); // 割と力ずく
    }

    //gr.scale(this.w);
    //gr.drawingContext.fill(this.eighthNoteFlagPath);
    drawPath(gr, "eighthNoteFlag", col, size);

    gr.pop();
  }
  setTuplesParam(x, y, dx, dy, tone, space, tupletParam, lower){
    tupletParam.lower = lower;
    // upperがtrueの場合はdx,dy方向にずらしてからdy,-dx方向に
    // spaceの2.7と3.5で...どのくらいずらすかというとspace/2です。
    const t = tone;
    const d = space * 0.5;
    const e = (lower ? -1:1);
    tupletParam.close = {x:x - dy*t*d + e*dx*d + e*dy*d*7.5, y:y + dx*t*d + e*dy*d - e*dx*d*7.5};
    tupletParam.far = {x:x - dy*t*d + e*dx*d + e*dy*d*6.3, y:y + dx*t*d + e*dy*d - e*dx*d*6.3};
  }
  drawTuplesFlag(gr, x, y, dx, dy, col, tone, space, tupletParam){
    // 向きは記録されたものを使う。
    const {x:x1, y:y1} = tupletParam.close;
    const {x:x2, y:y2} = tupletParam.far;
    const t = tone;
    const d = space * 0.5;
    const e = (tupletParam.lower ? -1:1);

    gr.noStroke();
    gr.fill(col);
    gr.quad(x1,y1,x - dy*t*d + e*dx*d + e*dy*d*7.5,y + dx*t*d + e*dy*d - e*dx*d*7.5, x - dy*t*d + e*dx*d + e*dy*d*6.3, y + dx*t*d + e*dy*d - e*dx*d*6.3, x2, y2);
  }
  getNextTone(t){
    // tに対して±5の範囲で行き先をランダムに取得
    const _min = max(t-5, -4);
    const _max = min(t+5, 4);
    return _min + Math.floor(Math.random()*(_max-_min));
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    // 五線譜描画は基本で、それとは別になんか置いていく。
    const _w = this.w * force;
    const space = _w*8; // 間隔
    const l = 2*space;
    if(!this.firstDrawed){
      //this.drawStart(x, y, dx, dy);
      for(let i = 0; i < 5; i++){
        params.lastXs.push(x-dy*(-l+i*space));
        params.lastYs.push(y+dx*(-l+i*space));
      }
      this.firstDrawed = true;
      //return;
    }
    const m = mag(pos.lx - x, pos.ly - y);
    if(m < _w * 0.5){ return; }
    gr.stroke(col);
    gr.strokeWeight(_w);
    this.draw5line(gr, x, y, dx, dy, space, params);

    pos.lx = x;
    pos.ly = y;

    // 以下、音符など
    const prevBP = Math.floor(params.barProg / _w);
    params.barProg += m; // 累積距離
    // ここでbpが増えた場合にのみ
    // 描画命令の可否をリセットする
    const bp = Math.floor(params.barProg / _w);
    if(prevBP < bp){ params.drawFlag = true; }
    // するとあるbarProgで描画がなされたとき、そのあとのフレームで
    // bpが増えなければ、同じところへの描画は為されない。
    // ちょっと気になったので。
    if(bp > 165){
      // 区切り線を引く
      gr.push();
      gr.translate(x, y);
      gr.rotate(atan2(dy, dx));
      gr.stroke(col);
      gr.strokeWeight(_w);
      gr.line(0, -space*2, 0, space*2);
      gr.pop();
      this.setRhythm(params);
      params.barProg = 0;
    }
    const rhythmId = Math.floor(bp / 40);
    if(bp % 40 == 0 && rhythmId < 4){
      params.rhythm = params.rhythmArray[rhythmId];
      if(params.rhythm !== 3){
        // 音程を決める
        params.tone = Math.floor(random()*9)-4;
      }
    }

    if(bp % 40 == 26 && params.drawFlag){
      if(params.rhythm == 0){
        this.drawQuarterNote(gr, x, y, dx, dy, col, params.tone, _w, space, (params.tone < 0));
      }
      if(params.rhythm == 3){
        this.drawQuarterRest(gr, x, y, dx, dy, col, _w);
      }
      params.drawFlag = false;
    }
    if((bp % 40 == 16 || bp % 40 == 36) && params.drawFlag){
      if(params.rhythm == 1){
        if(bp % 40 == 16){
          this.drawEighthNote(gr, x, y, dx, dy, col, params.tone, _w, space, (params.tone < 0));
        }else{
          this.drawEighthRest(gr, x, y, dx, dy, col, _w);
        }
        params.drawFlag = false;
        if(bp % 40 == 16){
          // 再生成
          params.tone = Math.floor(random()*9)-4;
        }
      }
      if(params.rhythm == 2){
        if(bp % 40 == 16){
          this.drawQuarterNote(gr, x, y, dx, dy, col, params.tone, _w, space, (params.tone < 0));
          params.drawFlag = false;
          // ここで位置を記録
          this.setTuplesParam(x, y, dx, dy, params.tone, space, params.tupletParam, (params.tone < 0));
          // 再計算
          params.tone = this.getNextTone(params.tone);
        }
        if(bp % 40 == 36){
          this.drawQuarterNote(gr, x, y, dx, dy, col, params.tone, _w, space, params.tupletParam.lower);
          // ここで旗を描画
          this.drawTuplesFlag(gr, x, y, dx, dy, col, params.tone, space, params.tupletParam);
          params.drawFlag = false;
        }
      }
    }
  }
}

// 三角形移しますね。

// これもSVGの方がいいかなって思ってしまった
// グラデも統一的に付けられるしなー
// 進行方向に向かって、とか。
class TriangleBrush extends Brush{
  constructor(name, param){
    super(name);
    this.registParam(param, "w", 16);
    // 縦方向の伸びに対する横幅の半分（デフォは1/3）
    this.registParam(param, "widthFactor", 0.333);
    //this.registParam(param, "col", "#fff");
    this.registParam(param, "intervalFactor", 1.2);
    // 白抜きの場合の直径に対する線の太さ
    this.registParam(param, "strokeWeightFactor", 0.05);
    // 白抜きかどうか
    this.registParam(param, "fill", true);
    //this.col = col;
    //this.intervalFactor = intervalFactor;
    // 三角形の形（正三角形とか）いじっても面白そうだけど。
  }
  /*
  initialize(gr){
    gr.blendMode(BLEND);
    gr.noStroke();
    gr.fill(this.col);
  }
  */
  startUp(gr, params){
    gr.blendMode(BLEND);
    this.firstDrawed = false;
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    const _w = this.w * force;
    if(!this.firstDrawed){ this.firstDrawed = true; }
    if(mag(pos.lx - x, pos.ly - y) < _w * this.intervalFactor){ return; }
    // ここで描画

    if(this.fill){
      gr.fill(col);
      gr.noStroke();
    }else{
      gr.noFill();
      gr.stroke(col);
      gr.strokeWeight(max(1,_w*this.strokeWeightFactor));
    }
    // (横幅の半分)/(縦の伸び)
    const wf = this.widthFactor;
    gr.triangle(pos.lx-dy*_w*wf, pos.ly+dx*_w*wf, pos.lx+dy*_w*wf, pos.ly-dx*_w*wf, pos.lx + dx * _w, pos.ly + dy * _w);
    pos.lx = x;
    pos.ly = y;
  }
}

// baseColはベース色
// intervalはとげの配置間隔（ピクセル）で1～1.5が良き
// 幅は40くらいを想定
// colorBandは色のブレ具合で0.7くらいだといい感じ
// thickはとげの厚さでデフォは0.04くらい、要するに渡しに対する幅
class ThornBrush extends Brush{
  constructor(name, param){
    super(name);
    this.registParam(param, "w", 45);
    //this.registParam(param, "col", "#2a2");
    this.registParam(param, "interval", 1);
    this.registParam(param, "colorBand", 0.7);
    this.registParam(param, "thick", 0.04);
    //this.interval = interval;
    //this.colorBand = colorBand;
    //this.thick = thick;
  }
  /*
  initialize(gr){
    gr.blendMode(LIGHTEST);
    gr.noStroke();
  }
  */
  startUp(gr, params){
    gr.blendMode(LIGHTEST);
    this.firstDrawed = false;
  }
  drawThorn(gr, x0, y0, x1, y1){
    const midX = (x0+x1)/2;
    const midY = (y0+y1)/2;
    const diffX = (y0-y1)*this.thick;
    const diffY = (x1-x0)*this.thick;
    // quadにしよう。
    gr.quad(x0,y0,midX+diffX,midY+diffY,x1,y1,midX-diffX,midY-diffY);
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    const _w = this.w * force;
    if(mag(pos.lx - x, pos.ly - y)<this.interval){ return; }
    // 1～w/2のランダム値
    let r1 = 1 + Math.random()*(_w/2-1);
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
    //let _r, _g, _b;
    const _color = color(col);
    let _r = red(_color);
    let _g = green(_color);
    let _b = blue(_color);
    if(h < 0.5){
      _r = _r * (1 - band + h * band * 2);
      _g = _g * (1 - band + h * band * 2);
      _b = _b * (1 - band + h * band * 2);
    }else{
      _r = _r + (255 - _r) * (h - 0.5) * band * 2;
      _g = _g + (255 - _g) * (h - 0.5) * band * 2;
      _b = _b + (255 - _b) * (h - 0.5) * band * 2;
    }
    gr.noStroke();
    gr.fill(_r, _g, _b);
    // このq0,q1がx,yからのdiffになる感じ。
    this.drawThorn(gr, x+q0.x, y+q0.y, x+q1.x, y+q1.y);
    pos.lx = x;
    pos.ly = y;
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
  constructor(name, param){
    super(name);
    //this.registParam(param, "col", "#f4f");
    this.registParam(param, "w", 20);
    this.registParam(param, "kind", "heart");
    this.registParam(param, "intervalFactor", 1.2);
    this.registParam(param, "fill", true);
    this.registParam(param, "blendOption", BLEND);
    //this.col = col;
    //this.kind = kind;
    // pathはグローバルで
    //this.path = new Path2D(pathData[this.kind]);
    //this.intervalFactor = intervalFactor;
  }
  //initialize(gr){
  //  gr.blendMode(BLEND);
    //gr.noStroke();
    //gr.fill(this.col);
  //}
  startUp(gr, params){
    gr.blendMode(this.blendOption);
    this.firstDrawed = false;
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    const _w = this.w * force;
    if(!this.firstDrawed){ this.firstDrawed = true; }
    if(mag(pos.lx - x, pos.ly - y)<_w * this.intervalFactor){ return; }

    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));

    drawPath(gr, this.kind, col, _w, this.fill);

    gr.pop();
    /*
    if(this.fill){
      gr.noStroke();
      gr.fill(this.col);
    }else{
      gr.stroke(this.col);
      gr.noFill();
      gr.strokeWeight(0.1);
    }
    gr.push();
    gr.translate(x, y);
    gr.rotate(atan2(dy, dx));
    gr.scale(this.w);
    if(this.fill){
      gr.drawingContext.fill(this.path);
    }else{
      gr.drawingContext.stroke(this.path);
    }
    gr.pop();

    */
    pos.lx = x;
    pos.ly = y;
  }
}

// 色を2つ指定するとその間のblend（線形補間）で
// いろんな色のいろんな大きさのオブジェクトが配置される感じ
// 向きもランダムで
class ScatterIconBrush extends Brush{
  constructor(name, param){
    super(name);
    this.registParam(param, "w", 20);
    //this.registParam(param, "col", "#ff4");
    this.registParam(param, "secondCol", this.col); // 補間色
    this.registParam(param, "kind", "star");
    this.registParam(param, "intervalFactor", 0.25);
    this.registParam(param, "sizeMinRatio", 0.3); // 1.0～0.3倍
    this.registParam(param, "sizeMaxRatio", 1); // 一応。
    this.registParam(param, "fill", true);
    this.registParam(param, "blendOption", BLEND);
    // 設置する範囲の半径倍率（wの何倍か）
    //this.col = col;
    //this.kind = kind;
    //this.path = new Path2D(pathData[this.kind]);
    //this.intervalFactor = intervalFactor;
  }
  /*
  initialize(gr){
    gr.blendMode(BLEND);
    //gr.noStroke();
  }
  */
  startUp(gr, params){
    gr.blendMode(this.blendOption);
    this.firstDrawed = false;
  }
  draw(gr, x, y, dx, dy, pos, col, force, params){
    const _w = this.w * force;
    if(!this.firstDrawed){ this.firstDrawed = true; }
    if(mag(pos.lx - x, pos.ly - y)<_w * this.intervalFactor){ return; }
    gr.push();
    const _radius = Math.sqrt(Math.random())*this.w;
    const _angle = Math.random()*Math.PI*2;
    gr.translate(x + _radius * Math.cos(_angle), y + _radius * Math.sin(_angle));
    const rotationAngle = Math.random()*Math.PI*2;
    gr.rotate(rotationAngle);
    const sizeFactor = this.sizeMinRatio + Math.random()*(this.sizeMaxRatio - this.sizeMinRatio);
    //gr.scale(this.w * sizeFactor);

    const iconCol = lerpColor(color(col), color(this.secondCol), Math.random());

    drawPath(gr, this.kind, iconCol, _w * sizeFactor, this.fill);

    /*
    if(this.fill){
      gr.noStroke();
      gr.fill(iconCol);
    }else{
      gr.noFill();
      gr.stroke(iconCol);
      gr.strokeWeight(0.1);
    }
    if(this.fill){
      gr.drawingContext.fill(this.path);
    }else{
      gr.drawingContext.stroke(this.path);
    }
    */

    gr.pop();
    pos.lx = x;
    pos.ly = y;
  }
}
/*
// シンプルなツタ（はっぱが両側に付くだけ）
class SimpleIvyBrush extends Brush{

}

// エアブラシ
class AirBrush extends Brush{

}
*/
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

// drawSVGPath.

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
