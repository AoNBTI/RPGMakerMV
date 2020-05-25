//=============================================================================
// AO_BalloonWindow.js
//=============================================================================
// Copyright (c) 2020 AO
// This software is released under the MIT License.
//
// コードの一部はMITライセンスのプラグイン製作者様のコードを参考にしています
// I appreciate great plugin creater's work.
//
/*
2020/4/30 初版ver1.00
2020/5/3 ver1.001 ヘルプの制御文字記載を修正。テキストアラインコマンドの機能が停止していた問題の修正
2020/5/9 ver1.002 名前からターゲット番号を取得する方法の変更。ステートに沈黙状態の定義を追加
2020/5/9 ver1.003 プラグインパラメーターにウィンドウの最大移動速度を追加
2020/5/24 ver1.004 戦闘中のパーティメンバー入れ替えによるバグをフィクス
2020/5/24 ver1.005 パーティメンバー入れ替え時に自動で全てのキューをクリアするプラグインパラメータの追加
2020/5/25 ver1.01 名前ウィンドウ表示機能追加。パーティメンバー入れ替え時にウィンドウが最小で残っていた不具合の修正
*/
/*:
* @plugindesc 吹き出し風メッセージウインドウ表示プラグイン
* @author AO
*
* @param デフォルトフォント
* @type string
* @default GameFont
* @desc ウィンドウに利用されるフォント。変更する場合は別途フォントロードプラグインが必要
*
* @param デフォルトフォントサイズ
* @type number
* @default 22
* @desc デフォルトのフォントサイズ
*
* @param 最大フォントサイズ
* @type number
* @min 0
* @default 128
* @desc 最大のフォントサイズ
*
* @param 最小フォントサイズ
* @type number
* @min 0
* @default 8
* @desc 最小のフォントサイズ
*
* @param フォントサイズ変化値
* @type number
* @min 1
* @max 20
* @default 8
* @desc 制御文字によるフォントサイズの変更値
*
* @param デフォルトフォントカラー
* @type string
* @default rgba(255, 255, 255, 1)
* @desc フォントのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルトフォントアウトラインカラー
* @type string
* @default rgba(0, 0, 0, 0.5)
* @desc フォントアウトラインのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルトウィンドウカラー
* @type string
* @default rgba(50, 50, 50, 0.5)
* @desc ウィンドウのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルトウィンドウラインカラー
* @type string
* @default rgba(255, 255, 255, 1)
* @desc ウィンドウラインのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルトウィンドウ形状
* @type select
* @option ウィンドウ角が斜め
* @0
* @option ウィンドウがトゲトゲ
* @1
* @option ウィンドウ角が丸
* @2
* @default 0
*
* @param デフォルトウィンドウアンカー形状
* @type select
* @option 三角
* @0
* @option 丸の連なり
* @1
* @default 0
*
* @param デフォルト名前フォント
* @type string
* @default GameFont
* @desc 名前ウィンドウに利用されるフォント。変更する場合は別途フォントロードプラグインが必要
*
* @param デフォルト名前フォントサイズ
* @type number
* @default 20
* @desc デフォルトの名前表示フォントサイズ
*
* @param デフォルト名前フォントカラー
* @type string
* @default rgba(255, 255, 255, 1)
* @desc 名前表示フォントのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルト名前フォントアウトラインカラー
* @type string
* @default rgba(0, 0, 0, 0.5)
* @desc 名前表示フォントアウトラインのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルト名前ウィンドウカラー
* @type string
* @default rgba(50, 50, 50, 0.5)
* @desc 名前ウィンドウのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルト名前ウィンドウラインカラー
* @type string
* @default rgba(255, 255, 255, 1)
* @desc 名前ウィンドウラインのデフォルト色"rgba(赤(0-255),緑(0-255),青(0-255),アルファ値(0-1))"
*
* @param デフォルト名前ウィンドウ形状
* @type select
* @option ウィンドウ角が斜め
* @0
* @option ウィンドウがトゲトゲ
* @1
* @option ウィンドウ角が丸
* @2
* @default 2
*
* @param 文字ウエイトフレーム
* @type number
* @min 1
* @default 15
* @desc 一文字あたりのウエイトフレーム数
*
* @param 最小ウエイトフレーム
* @type number
* @min 1
* @default 180
* @desc ウィンドウ表示の最小フレーム数
*
* @param デフォルトウィンドウSE
* @desc ウィンドウ表示時のSE
* @type file
* @dir audio/se
*
* @param SEボリューム
* @type number
* @min 0
* @max 100
* @default 50
* @desc ウィンドウ表示SE再生のボリューム
*
* @param フェイス倍率
* @type number
* @min 1
* @max 100
* @default 50
* @desc 顔グラフィック表示倍率
*
* @param 戦闘終了時キュークリア
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc 戦闘終了時に台詞表示予約をクリアするか
*
* @param 戦闘終了時バトラークリア
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc 戦闘終了時にバトラーの台詞をクリアするか
*
* @param マップ移動時キュークリア
* @type boolean
* @on はい
* @off いいえ
* @default false
* @desc マップ移動時に台詞表示予約をクリアするか
*
* @param メンバー離脱時キュークリア
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc ”パーティメンバーを外す”コマンド実行時に自動で全てのキューをクリアするか
*
* @param コマンドオーバーライド自動解除
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc 表示コマンド実行後に自動で通常コマンドに戻すか
*
* @param ウィンドウ最大移動速度
* @type number
* @min 0
* @default 5
* @desc 最大で1フレームあたり何ピクセル移動できるか
*
* @param フロントビュー用位置1
* @type struct<Position>
* @desc フロントビュー用フキダシ位置1s
*
* @param フロントビュー用位置2
* @type struct<Position>
* @desc フロントビュー用フキダシ位置2
*
* @param フロントビュー用位置3
* @type struct<Position>
* @desc フロントビュー用フキダシ位置3
*
* @param フロントビュー用位置4
* @type struct<Position>
* @desc フロントビュー用フキダシ位置4
*
* @help AO_BalloonWindow.js ver1.01
* フキダシウィンドウ風スプライトを表示可能にします
* 表示されるウィンドウは自動で表示・消去され
* 一文字ずつの表示はされません
* このプラグインの利用にはRPGツクールver1.6.2以上が必要です
* This plugin requires RPGMakerMVver1.6.2 or heigher
*
* =============プラグインコマンド解説=============
* プラグインコマンド:SET_BALLOONWINDOW
* コマンド実行後のエディタ上の"文章の表示"コマンドを
* プラグインによる文章表示に切り替えます
*
* ===SET_BALLOONWINDOW実行後の"文章の表示"コマンド詳細===
* "顔"：設定した顔画像が表示されます
* "背景":"暗くする"を選択すると即時表示
*        それ以外ではキューに台詞を追加
* "ウィンドウ位置":"下"を選択した場合はキャラクターの
*              下方に、それ以外は上方に表示
* ※"キュー"とは順番に台詞を表示するための入れ物です
* キューに追加された台詞は自動で連続表示されていきます
* それぞれ独立した会話等を表現するためには
* 複数のキューを利用するとよいでしょう
* またキューの数に制限はありません
* 
* "文章":この中に特定の文字列を埋め込む事で
*       フキダシを表示する対象を指定したり
*       台詞を追加するキューを指定したり出来ます
* 
* ===フキダシ対象の指定===
* 文章内に以下の記載をすることでターゲットを指定します
* 指定がない場合は記載したイベントが対象となります
*
* "<targetId:ターゲット番号>"
* ターゲット番号によるターゲット指定(MAP画面)
* 0:記載したイベント
* -1:プレイヤー
* -2:一番目のフォロワー
* -3:二番目のフォロワー
* マイナス以降の数字を大きくする事で以降のフォロワーを
* 指定できます
* 1:ID1のイベント
* 2:ID2のイベント
* 正の整数はイベントをIDで指定します
*
* ターゲット番号によるターゲット指定(戦闘画面)
* 0:行動中のバトラー
* -1:先頭のパーティメンバー
* -2:一番目のパーティメンバー
* -3:二番目のパーティメンバー
* マイナス以降の数字を大きくする事で以降のパーティメンバーを
* 指定できます
* 1:一番目の敵
* 2:二番目の敵
* 正の整数は敵を並びで指定します
*
* "<targetName:名前>"
* 名前部分にキャラクター・イベント名を記載する事で
* 名前によってターゲットを指定できます
* 名前の重複は非対応です
*
* ===キュー番号の指定===
* 文章内に以下の記載をすることで
* 台詞を追加するキューを指定します
* 指定がない場合は0番のキューに追加されます
* またマップシーンと戦闘シーンのキューは
* 番号が同じでも区別されます
*
* "<queueId:キュー番号>"
* キュー番号部分に0以上の整数を記載することで
* 台詞を追加するキューを指定します
*
* <文章内記載例:1番のキューにハロルドの台詞を追加>
* <targetName:ハロルド><queueId:1>
* 俺が勇者ハロルドだ！
* ※名前で敵バトラーを指定する場合で同名の敵が複数居る場合は
*  末尾に全角で"Ａ"や"Ｂ"を記載する必要があります
*
* プラグインコマンド:RESET_BALLOONWINDOW
* 文章の表示を通常のコマンドに戻します
* プラグインパラメータの"コマンドオーバーライド自動解除"が
* "はい"の時はこのコマンドは必要ありません
*
* プラグインコマンド:CLEAR_MAPBALLOONWINDOWQUE キュー番号
* キュー番号(正の整数)で指定された番号の
* マップシーン用キューを空にします
*
* プラグインコマンド:CLEAR_MAPBALLOONWINDOWQUES
* マップシーンで用いられる全てのキューを空にします
*
* プラグインコマンド:CLEAR_BATTLEBALLOONWINDOWQUE キュー番号
* キュー番号(正の整数)で指定された番号の
* 戦闘シーン用キューを空にします
* 
* プラグインコマンド:CLEAR_BATTLEBALLOONWINDOWQUES
* 戦闘シーンで用いられる全てのキューを空にします
*
* プラグインコマンド:CLEAR_BALLOONWINDOWQUES
* シーンを問わず全てのキューを空にします
*
* =============制御文字解説=============
* 文章の表示において、メッセージ内で使用できる制御文字一覧
* ===利用可能なデフォルトの制御文字===
* \V[n] ： n番目の変数を表示
* \N[n] : n番目のアクター名を表示
* \P[n] : n番目のパーティメンバー名を表示
* \G : 通貨単位の表示
* \C[n] : 文字色をn番目の色に変更
* \I[n] : n番目のアイコン表示
* \{ : 文字を一段階大きくする
* \} : 文字を一段階小さくする
* \\ : バックスラッシュの表示
* 
* ===追加された制御文字===
* \CFS[d] : フォントサイズをd(正の整数)に変更
* \CTC[rgba(r, g, b, a)] : 文字色を指定値変更する
* ※rgba(r, g, b, a)で色(赤・緑・青・アルファ値)を指定できます
*   r・g・bはそれぞれ0-255の整数でaは0-1の整数値です
*   以降の制御文字でも形式と数値範囲は同様です
* \COC[rgba(r, g, b, a)] : 文字のアウトライン色変更する
* ※以降の制御文字では一部末尾に;(セミコロン)が必要です！
* \RTC; : テキストカラーをリセットする
* \ROC; : テキストアウトラインカラーをリセットする
* \CWCL[rgba(r, g, b, a)] : ウィンドウカラーを変更する
* \CWLCL[rgba(r, g, b, a)] : ウィンドウのアウトラインカラーを変更する
* \CWSQ; : ウィンドウの角形状を斜め線にする
* \CWCR; : ウィンドウの角形状を丸くする
* \CWSP; : ウィンドウの形状をギザギザにする
* \CATR; : ウィンドウアンカーの形状を三角にする
* \CACR; : ウィンドウアンカーの形状を丸の連なりにする
* \WUP; : ウィンドウをキャラクターの上方表示にする
* \WUN; : ウィンドウをキャラクターの下方表示にする
* \CTAL; : テキストを左揃えにする
* \CTAC; : テキストを中央揃えにする
* \CTAR; : テキストを右揃えにする
* \SPSE[s] : 再生SE名をsにする
*           sにはSEの名称(Absorb1等)を記載します
* \SSEV[d] : SEのボリュームをd(0-100)にする
* \SSEPT[d] : SEのピッチをd(50-150)にする
* \SSEPA[d] : SEの位相をd(-100-100)にする
* \WIG; : ウィンドウが画面内に留まるようにする
* \WOG; : ウィンドウの画面外移動を許可する
* \SFN[s] : 顔グラフィックのファイル名をsにする
* \SFI[d] : 顔グラフィックのインデックスをdにする
*           ※顔グラフィックのインデックスは左上が0
*             右にいくと数値が大きくなるため
*             上段が0-3で下段が4-7です
* \SDW[d] : ウィンドウ表示時間を手動d(フレーム数)にする
* \QWF[d] : キューにおける次のウィンドウの待ち時間を手動でd(フレーム数)にする
* \NC[キャラクター名]: 名前ウィンドウにキャラクター名を表示
* 
*
* =============キャラクター・バトラーのメモ欄解説=============
* イベントのメモ欄に以下の記載をする事で
* ウィンドウのアンカー端位置(フキダシのシッポ位置)にオフセット値を設定できます
* <bwcOffsets:top,left,right,bottom>
* top,left,right,bottomにそれぞれ整数値を記載することで
* アンカー端位置を中央に近づけることが可能です 
* 透明部分が多い画像ファイルを利用した場合に便利です
*
* 例)
* <bwcOffsets:24,0,0,12>
* アンカー端の表示位置を上側は24ピクセル
* 下側は12ピクセルイベントの中央に近づける
*
* 敵キャラのメモ欄には以下の記載で同様の設定が可能です
* <bwbOffsets:top,left,right,bottom>
* 
* アクターのメモ欄では歩行画像にオフセットを指定する場合は
* <bwcOffsets:top,left,right,bottom>
* サイドビューバトラーにオフセット値を指定する場合は
* <bwbOffsets:top,left,right,bottom>
* の記述で指定することが可能です
*
* =============ステートのメモ欄解説=============
* ステートのメモ欄に"<CantSpeak>"と記載する事で
* そのステートにかかったバトラーに対するウィンドウ表示を無効化できます
*
* ライセンスはMIT
* 改変歓迎です
*
*/

/*~struct~Position:
 * @param x
 * @type number
 * @default 400 
 * @param y
 * @type number
 * @default 400
*/

var Imported = Imported || {};
Imported.AO_BalloonWindow = true;
 
(function() {
	'use strict';
	const pluginName = 'AO_BalloonWindow';
	const parameters = PluginManager.parameters(pluginName);
	
	const importedAnimatedSVEnemies = Imported.YEP_X_AnimatedSVEnemies;
	
	const defaultFontFamily = getArgString(parameters["デフォルトフォント"]);
	const defaultFontSize = getArgNumber(parameters["デフォルトフォントサイズ"]);
	const defaultFontColor = getArgString(parameters["デフォルトフォントカラー"]);
	const defaultFontOutlineColor = getArgString(parameters["デフォルトフォントアウトラインカラー"]);
	const maxFontSize = getArgNumber(parameters["最大フォントサイズ"]);
	const fontSizeDelta = getArgNumber(parameters["フォントサイズ変化値"]);
	const minFontSize = getArgNumber(parameters["最小フォントサイズ"]);
	const defaultWindowColor = getArgString(parameters["デフォルトウィンドウカラー"]);
	const defaultWindowLineColor = getArgString(parameters["デフォルトウィンドウラインカラー"]);
	const defaultWindowShape = getArgNumber(parameters["デフォルトウィンドウ形状"]);
	const defaultAnchorShape = getArgNumber(parameters["デフォルトウィンドウアンカー形状"]);
	const singleCharacterWait = getArgNumber(parameters["文字ウエイトフレーム"]);
	const minmumDisplayFrame = getArgNumber(parameters["最小ウエイトフレーム"]);
	const defaultSeName = getArgString(parameters["デフォルトウィンドウSE"]);
	const defaultSeVolume = getArgNumber(parameters["SEボリューム"]);
	const defaultFaceImageScale = getArgNumber(parameters["フェイス倍率"]);
	const clearQueueInBattleEnd = getArgBoolean(parameters["戦闘終了時キュークリア"]);
	const clearBattlerBalloonWindowsInEveryBattle = getArgBoolean(parameters["戦闘終了時バトラークリア"]);
	const clearQueueInMapChanged = getArgBoolean(parameters["マップ移動時キュークリア"]);
	const clearQueueInRemovePartyMember = getArgBoolean(parameters["メンバー離脱時キュークリア"]);
	const resetOverride = getArgBoolean(parameters["コマンドオーバーライド自動解除"]);
	const maxWindowSpeed = getArgNumber(parameters["ウィンドウ最大移動速度"]);
	const partyMemberPosition01 = parameters["フロントビュー用位置1"] ? JSON.parse(parameters["フロントビュー用位置1"]) : {"x":400, "y":400};
	const partyMemberPosition02 = parameters["フロントビュー用位置2"] ? JSON.parse(parameters["フロントビュー用位置2"]) : {"x":400, "y":400};
	const partyMemberPosition03 = parameters["フロントビュー用位置3"] ? JSON.parse(parameters["フロントビュー用位置3"]) : {"x":400, "y":400};
	const partyMemberPosition04 = parameters["フロントビュー用位置4"] ? JSON.parse(parameters["フロントビュー用位置4"]) : {"x":400, "y":400};
	const partyMemberAnchorPosition01 = new Point(partyMemberPosition01.x, partyMemberPosition01.y);
	const partyMemberAnchorPosition02 = new Point(partyMemberPosition02.x, partyMemberPosition02.y);
	const partyMemberAnchorPosition03 = new Point(partyMemberPosition03.x, partyMemberPosition03.y);
	const partyMemberAnchorPosition04 = new Point(partyMemberPosition04.x, partyMemberPosition04.y);
	const partyMemberAnchorPositions = [partyMemberAnchorPosition01, partyMemberAnchorPosition02, partyMemberAnchorPosition03, partyMemberAnchorPosition04];
	
	const defaultNameFontFamliy = getArgString(parameters["デフォルト名前フォント"]);
	const defaultNameFontSize = getArgNumber(parameters["デフォルト名前フォントサイズ"]);
	const defaultNameFontColor = getArgString(parameters["デフォルト名前フォントカラー"]);
	const defaultNameFontOutlineColor = getArgString(parameters["デフォルト名前フォントアウトラインカラー"]);
	const defaultNameWindowColor = getArgString(parameters["デフォルト名前ウィンドウカラー"]);
	const defaultNameWindowLineColor = getArgString(parameters["デフォルト名前ウィンドウラインカラー"]);
	const defaultNameWindowShape = getArgNumber(parameters["デフォルト名前ウィンドウ形状"]);
	
	const textAlignTypes = {"left": 0, "center": 1, "right": 3};
	const defaultTextAligin = textAlignTypes.left;
	const defaultLineSpace = 4;
	
	const windowShapeTypes = {"square": 0, "spike": 1, "circle": 2}
	const anchorShapeTypes = {"triangle": 0, "circle": 1}
	
	const defaultWindowPadding = 8;
	const defaultWindowLineWidth = 2;
	const defaultNameWindowPadding = 4;
	
	const defaultAnchorWidth = 24;
	const defaultAnchorHeight = 48;
	const defaultAnchorMultiple = 2;
	
	const openAnimationCount = 15;
	const closeAnimationCount = 30;
	
	const defaultSeWait = 10;
	
	const defaultSePitch = 100;
	const defaultSePan = 0
	
	const targetIdStrings = "targetId";
	const targetNameStrings = "targetName";
	const queueIdStrings = "queueId";
	
	function getArgNumber(arg) {
		if (typeof arg === "string") {arg = arg.replace(/^\s+|\s+$/g,'');}
		else {return 0;}
		if (/^[+,-]?([1-9]\d*|0)$/g.test(arg)) {return parseFloat(arg || '0');}
		return 0;
	}
	
	function getArgString(arg, upperFlg) {
		if (typeof arg === "string") return upperFlg ? arg.toUpperCase().replace(/^\s+|\s+$/g, '') : arg.replace(/^\s+|\s+$/g, '');
		return "";
	}
	
	function getArgBoolean(arg) {
		arg = typeof arg !== "boolean" ? getArgString(arg, true) : arg;
		return arg === "T" || arg === "TRUE" || arg === "ON" || arg === true;
	}
	
	function degreeToRadian(degree) {
		return degree * Math.PI / 180;
	}
	
	function radianToDegree(radian) {
		return radian * 180 / Math.PI;
	}
	
	function calcCosine(x, y) {
		return x / Math.sqrt(x * x + y * y);
	}
	
	function calcRadian(cosine) {
		return Math.acos(cosine);
	}
	
	function cssColorToArr(cssColorStrings) {
		let colors = [], resultStr, re;
		if (/#([a-f0-9]{6,8})/i.test(cssColorStrings)) {
			re = /([a-f0-9]{2})/gi;
			while (resultStr = re.exec(cssColorStrings)) {
				colors.push(parseInt(resultStr[1], 16));
			}
		} else if (/(rgba|rgb)\(((\d{1,3},?\s*){3,4})\)/i.test(cssColorStrings)) {
			re = /(\d{1,3})/gi;
			while (resultStr = re.exec(cssColorStrings)) {
				colors.push(parseInt(resultStr[1], 10));
			}
		}
		return colors;
	}
	
	function balloonWindowState(text) {
		return {
			"text": text, "position": {"x": 0, "y": 0}, "displayFrame": Infinity, "nextPopWait": 0, "queueWait": false,
			"openAnimationCount" : openAnimationCount, "closeAnimationCount": closeAnimationCount, "sePlayingCount": defaultSeWait,
		}
	}
	
	//表示時間設定関数
	function setDisplayWait(balloonWindowState) {
		if (balloonWindowState.displayFrame !== Infinity) return;
		const controlWait = controlCharacterWait(balloonWindowState);
		if (controlWait >= 0) {
			balloonWindowState.displayFrame = controlWait;
		} else {
			const text = convertEscapeCharacters(balloonWindowState.text, true, true);
			const textWait = text.length * singleCharacterWait
			balloonWindowState.displayFrame = textWait > minmumDisplayFrame ? textWait : minmumDisplayFrame;
		}	
	}
	
	//制御文字による表示時間の取得
	function controlCharacterWait(balloonWindowState) {
		let text = balloonWindowState.text;
		text = text.replace(/\\/g, '\x1b');
		text = text.replace(/\x1b\x1b/g, '\\');
		const arr = /\x1bSDW\[(\d+)\]/gi.exec(text);
		if (arr) {
			return getArgNumber(arr[1]);
		} else {
			return -1;
		}
	}
	
	//ディスプレイウエイト(表示時間)設定後に設定されるキュー内の次のウィンドウポップの待ち時間設定関数
	function setNextPopWait(balloonWindowState) {
		if (balloonWindowState.displayFrame === Infinity) return;
		balloonWindowState.nextPopWait = Math.floor(balloonWindowState.displayFrame / 3 * 2);
		setControlCharacterQueWait(balloonWindowState);
	}
	
	//制御文字によるキューのウエイトフレーム設定およびキューウエイト設定用制御文字の除去
	function setControlCharacterQueWait(balloonWindowState) {
		let text = balloonWindowState.text
		text = text.replace(/\\/g, '\x1b');
		text = text.replace(/\x1b\x1b/g, '\\');
		let arr;
		const re = /\x1bQWF\[(\d+)\]/gi;
		while (arr = re.exec(text)) {
			balloonWindowState.text = text.replace(arr[0], "");
			balloonWindowState.nextPopWait = getArgNumber(arr[1]);
		}
	}
	
	function textState() {
		return {
			"text" : "",
			"index": 0, "x": 0, "y": 0, "left": 0, "lineIndex": 0, "sizeWidth": 0, "sizeHeight": 0, "height": 0,
			"align": textAlignTypes.left, "lineWidthArr": [],
			"fontFamily": defaultFontFamily, "fontSize": defaultFontSize, "fontColor": defaultFontColor, "fontOutlineColor": defaultFontOutlineColor
		}
	}
	
	function copyTextState(orgTextState) {
		const newTextState = textState();
		for (let key in newTextState) {
			newTextState[key] = orgTextState[key]
		}
		return newTextState;
	}
	
	function windowState() {
		return {
			"position": new Point(0, 0), "scale": new Point(1, 1), "opacity": 255, "rotation": 0,
			"anchorTop": new Point(0, 0), "upper": true, "size": {"width": 0, "height": 0},
			"shape": defaultWindowShape, "padding": defaultWindowPadding, "inGraphics": true,
			"color": defaultWindowColor, "lineWidth": defaultWindowLineWidth, "lineColor": defaultWindowLineColor,
			"seName": defaultSeName, "seVolume": defaultSeVolume, "sePitch": defaultSePitch, "sePan": defaultSePan,
			"faceName": "", "faceIndex": 0, "faceSize": {"width": 0, "height": 0}, "faceImageScale": defaultFaceImageScale / 100,
			"collisionSize": {"width": 0, "height": 0},
			"animationState": animationState(false)
		}
	}
	
	function anchorState() {
		return {
			"position": new Point(0, 0), "scale" : new Point(1, 0), "rotation": 0, "size": {"width": 0, "height": 0},
			"shape": defaultAnchorShape, "width": defaultAnchorWidth, "height": defaultAnchorHeight,
			"color": defaultWindowColor, "lineWidth": defaultWindowLineWidth, "lineColor": defaultWindowLineColor,
			"animationState": animationState(false)
		}
	}
	
	function nameState(textState, windowState) {
		const nameState = {"textState": textState, "windowState": windowState};
		textState.text = "";
		textState.name = true;
		textState.align = textAlignTypes.center;
		textState.fontFamily = defaultNameFontFamliy;
		textState.fontSize = defaultNameFontSize;
		textState.fontColor = defaultNameFontColor;
		windowState.shape = defaultNameWindowShape;
		windowState.padding = defaultNameWindowPadding;
		windowState.color = defaultNameWindowColor;
		windowState.lineColor = defaultNameWindowLineColor;
		return nameState;
	}
	
	function animationState(visible) {
		const scale = visible ? new Point(1, 1) : new Point(0, 0);
		const opacity = visible ? 255 : 0;
		return {
			"scale": scale, "opacity": opacity
		}
	}
	
	function rectangleOffsets() {
		return {"top" : 0, "left": 0, "right": 0, "bottom": 0};
	}
	
	//キュー状態。マップＩＤが0の時は戦闘中
	function queuedState(targetId, gameObjectId, balloonWindowState) {
		return {
			"targetId": targetId, "gameObjectId": gameObjectId, "mapId": -1, "balloonWindowState": balloonWindowState
		}
	}
	
	function actorName(n) {
		const actor = n >= 1 ? $gameActors.actor(n) : null;
		return actor ? actor.name() : '';
	};

	function partyMemberName(n) {
		const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
		return actor ? actor.name() : '';
	};
	
	function textHeight(fontSize) {
		return fontSize + 8;
	}
	
	function convertEscapeCharacters(text, forSize, forWait) {
		text = text.replace(/\\/g, '\x1b');
		text = text.replace(/\x1b\x1b/g, '\\');
		text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
			return $gameVariables.value(parseInt(arguments[1]));
		}.bind(this));
		text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
			return actorName(parseInt(arguments[1]));
		}.bind(this));
		text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
			return partyMemberName(parseInt(arguments[1]));
		}.bind(this));
		
		if (forSize) {
			//サイズ計算に必要ない制御文字の削除
			//C[d],I[d],CTC[r,g,b,a](テキストカラー変更),COC[r,g,b,a](テキストアウトラインカラー変更),RTC;(テキストカラーリセット),ROC;(テキストアウトラインカラーリセット)
			//CWCL[r,g,b,a](ウィンドウカラー変更),CWLCL[r,g,b,a](ウインドウアウトラインカラー変更),
			//CWSQ;(ウインドウ形状四角),CWSP;(ウインドウ形状スパイク),CWCR;(ウインドウ形状サークル),
			//CATR;(アンカー形状三角),CACR;(アンカー形状丸)
			//WUP;(ウインドウ表示上方),WUN;(ウインドウ表示下方)
			//CTAL;(アラインレフト), CTAC;(アラインセンター), CTAR(アラインライト)
			//SPSE[s], SSEV[d], SSEPT[d] SSEPA[d](SE再生、SEボリューム、SEピッチ、SEパン)
			//WIG;,WOG;(ウインドウの強制グラフィック内表示の有無)
			//SFN[s], SFI[d](フェースファイル名指定、フェースインデックス指定)
			//SDW[d](表示時間ウエイト設定)
			//NC[name](名前表示設定)
			text = text.replace(/\x1bC\[(\d+)\]/gi, "");
			//text = text.replace(/\x1bI\[(\d+)\]/gi, "");
			text = text.replace(/\x1bCTC\[rgba\([^].*?\)]/gi, "");
			text = text.replace(/\x1bCOC\[rgba\([^].*?\)]/gi, "");
			text = text.replace(/\x1bRTC;/gi, "");
			text = text.replace(/\x1bROC;/gi, "");
			text = text.replace(/\x1bCWCL\[rgba\([^].*?\)]/gi, "");
			text = text.replace(/\x1bCWLCL\[rgba\([^].*?\)]/gi, "");
			text = text.replace(/\x1bCWSQ;/gi, "");
			text = text.replace(/\x1bCWSP;/gi, "");
			text = text.replace(/\x1bCWCR;/gi, "");
			text = text.replace(/\x1bWUP;/gi, "");
			text = text.replace(/\x1bWUN;/gi, "");
			if (forWait) {
				text = text.replace(/\x1bCTAL;/gi, "");
				text = text.replace(/\x1bCTAC;/gi, "");
				text = text.replace(/\x1bCTAR;/gi, "");
			}
			text = text.replace(/\x1bSPSE\[([^\]]+)\]/gi, "");
			text = text.replace(/\x1bSSEV\[(\d+)\]/gi, "");
			text = text.replace(/\x1bSSEPC\[(\d+)\]/gi, "");
			text = text.replace(/\x1bSSEPA\[(\d+)\]/gi, "");
			text = text.replace(/\x1bWIG;/gi, "");
			text = text.replace(/\x1bWOG;/gi, "");
			text = text.replace(/\x1bSFN\[([^\]]+)\]/gi, "");
			text = text.replace(/\x1bSEI\[(\d+)\]/gi, "");
			text = text.replace(/\x1bNC\[([^\]]+)\]/gi, "");
			//CFS[d](フォントサイズ変更),RFS(フォントサイズリセット),{(フォントサイズ増加),}(フォントサイズ低下)は残してある
		}
		
		text = text.replace(/\x1bSDW\[(\d+)\]/gi, "");
		text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
		return text;
	}
	
    function getTargetGameObject(id) {
		return $gameParty.inBattle() ? getTargetGameBattler(id) : getTargetGameCharacter(id);
	}
	
	function getTargetGameBattler(id) {
		if (id < 0) {
			return $gameParty.members().length > (id * -1) ? $gameParty.members()[id * -1 - 1] : $gameParty.members()[$gameParty.members().length - 1];
		} else if (id === 0){
			return BattleManager._subject;
		} else {
			return $gameTroop.members().length > id ? $gameTroop.members()[id - 1] : $gameTroop.members()[$gameTroop.members().length - 1];
		}
	}
	
	function getTargetGameCharacter(id) {
		if (id < -1) {
			return $gamePlayer.followers()._data.length > (id * -1) - 1 ? 
			$gamePlayer.followers().follower((id * -1) - 2) : $gamePlayer.followers().follower($gamePlayer.followers()._data.length - 1);
		} else if (id === -1) {
			return $gamePlayer;
		} else if (id === 0) {
			return $gameMap.event($gameMap._interpreter.eventId());
		} else{
			return $gameMap.event(id);
		}
	}
	
	function getTargetGameObjectData(targetGameObject) {
		if (targetGameObject instanceof Game_Player) return $gameParty.leader() ? $dataActors[$gameParty.leader().actorId()] : null;
		if (targetGameObject instanceof Game_Event) return targetGameObject.event() ? targetGameObject.event() : null;
		if (targetGameObject instanceof Game_Follower) return targetGameObject.actor() ? $dataActors[targetGameObject.actor().actorId()] : null;
		if (targetGameObject instanceof Game_Actor) return targetGameObject.actor() ? targetGameObject.actor() : null;
		if (targetGameObject instanceof Game_Enemy) return targetGameObject.enemy() ? targetGameObject.enemy() : null;
	}
	
	function getTargetGameObjectMeta(targetGameObject) {
		const dataObject = getTargetGameObjectData(targetGameObject);
		if (dataObject) return dataObject.meta;
	}
	
	function getNameTargetNumber(name) {
		if ($gameParty.inBattle()) {
			const actorId = $gameParty.members().findIndex((actor) => {
				return actor.name() === name;
			});
			if (actorId >= 0) return - (actorId + 1);
			const enemyId = $gameTroop.members().findIndex((enemy) => {
				return enemy.name() === name;
			});
			if (enemyId >= 0) return enemyId + 1;
		} else {
			const partyMemberId = $gameParty.members().findIndex((member) => {
				return member.name() === name;
			});
			if (partyMemberId === 0) return -1;
			if (partyMemberId > 0 && $gamePlayer.followers().isVisible())  return - (partyMemberId + 1);
			const mapEvents = $dataMap.events.filter((event) => {
				if (event) return event.name === name;
			})
			if (mapEvents.length) return mapEvents[0].id;
		}
	}
	
	//=====================================================================================================================
	// Game_Battler
	//  直接テキストを追加するメソッドと沈黙状態を定義
	//=====================================================================================================================
	Game_Battler.prototype.clearBalloonWindowStates = function() {
		this.balloonWindowStates = [];
	};
	
	Game_Battler.prototype.createBalloonWindow = function(text) {
		if (this.balloonWindowStates === undefined) {
			this.clearBalloonWindowStates();
		}
		this.balloonWindowStates.push(balloonWindowState(text));
	};
	
	Game_Battler.prototype.canSpeak = function() {
		let canSpeak = true;
		this.states().forEach((state) => {
		//ステートのメモ欄に"<CantSpeak>"を記載するといわゆる沈黙扱い
			if (state.meta.CantSpeak) canSpeak = false;
		});
		return this.isAlive() && canSpeak;
	};
	
	
	//=====================================================================================================================
	// Game_Party
	//  メンバー離脱時の自動キュークリアを設定
	//=====================================================================================================================
	const _Game_Party_removeActor = Game_Party.prototype.removeActor;
	Game_Party.prototype.removeActor = function(actorId) {
		if (clearQueueInRemovePartyMember && this._actors.contains(actorId)) {
			$gameSystem.clearBalloonWindowQueues();
		}
		_Game_Party_removeActor.apply(this, arguments);
	};

	//=====================================================================================================================
	// Game_Temp
	//  スクリプトコマンドの保持
	//=====================================================================================================================
	Game_Temp.prototype.createBalloonWindow = function(targetId, text) {
		const gameObject = getTargetGameObject(targetId);
		//ゲームなんとかにデータ配列が無いときは定義
		if (gameObject) {
			if (gameObject.balloonWindowStates === undefined) {
				gameObject.balloonWindowStates = [];
			}
			gameObject.balloonWindowStates.push(balloonWindowState(text));	
		}
	};
	
	Game_Temp.prototype.queueBalloonWindow = function(queueIndex, targetId, text) {
		BalloonWindowManager.queueBalloonWindowState(queueIndex, targetId, balloonWindowState(text));
	}
	
	Game_Temp.prototype.clearMapBalloonWindowQueue = function(queueIndex) {
		$gameSystem._mapBalloonWindowQueues[queueIndex] = [];
	}
	
	Game_Temp.prototype.clearBattleBalloonWindowQueue = function(queueIndex) {
		$gameSystem._battleBalloonWindowQueues[queueIndex] = [];
	}
	
	//=====================================================================================================================
	// Game_System
	//  専用キューの保持と初期化
	//=====================================================================================================================
	const _Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		_Game_System_initialize.apply(this, arguments);
		this.clearBalloonWindowQueues();
	};
	
	Game_System.prototype.clearBalloonWindowQueues = function() {
		this.clearMapBalloonWindowQueues();
		this.clearBattleBalloonWindowQueues();
	};
	
	Game_System.prototype.clearMapBalloonWindowQueues = function() {
		this._mapBalloonWindowQueues = [];
	}
	
	Game_System.prototype.clearBattleBalloonWindowQueues = function() {
		this._battleBalloonWindowQueues = [];
	}
	
	Game_System.prototype.balloonWindowQueues = function() {
		return BalloonWindowManager.inBattle() ? this._battleBalloonWindowQueues : this._mapBalloonWindowQueues;
	};
	
	//=====================================================================================================================
	//Game_Interpreter
	//  プラグインコマンド定義
	//  文章の表示コマンドオーバーライド
	//=====================================================================================================================
	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		this.pluginCommandBalloonWindow(command, args);
	};
	
	Game_Interpreter.prototype.pluginCommandBalloonWindow = function(command, args) {
		switch (command) {
			case "SET_BALLOONWINDOW":
				BalloonWindowManager.overrideCommand101();
				break;
			case "RESET_BALLOONWINDOW":
				BalloonWindowManager.approveCommand101();
				break;
			case "CLEAR_MAPBALLOONWINDOWQUE":
				$gameTemp.clearMapBalloonWindowQueue(getArgNumber(args[0]));
				break;
			case "CLEAR_MAPBALLOONWINDOWQUES":
				$gameSystem.clearMapBalloonWindowQueues();
				break;
			case "CLEAR_BATTLEBALLOONWINDOWQUE":
				$gameTemp.clearBattleBalloonWindowQueue(getArgNumber(args[0]));
				break;
			case "CLEAR_BATTLEBALLOONWINDOWQUES":
				$gameSystem.clearBattleBalloonWindowQueues();
				break;
			case "CLEAR_BALLOONWINDOWQUES":
				$gameSystem.clearBalloonWindowQueues();
				break;
		}
	};
	
	const _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
	Game_Interpreter.prototype.command101 = function() {
		if (BalloonWindowManager.command101IsOverrided()) {
			this.commandBalloonWindow();
			if (resetOverride) BalloonWindowManager.approveCommand101();
			return false;
		} else {
			return _Game_Interpreter_command101.apply(this, arguments);
		}
	};
	
	Game_Interpreter.prototype.commandBalloonWindow = function() {
		let commandText = "";
		//顔グラフィックの設定
		if (this._params[0].length > 0) {
			commandText += "\\SFN[" + this._params[0] + "]" + "\\SFI[" + this._params[1] + "]";
		}
		//ウインドウ位置の指定
		if (this._params[3] === 2) {
			commandText += "\\WUN;";
		}
		
		//キューに加えるか否かの設定・暗くするを選択すると即時表示
		const queued = this._params[2] === 0 ? true : false;
		//テキスト文章の生成
		let text = "";
		while (this.nextEventCode() === 401) {
			this._index++;
			text += this.currentCommand().parameters[0];
			if (this.nextEventCode() === 401) {
				text += "\n";
			}
		}
		
		//キュー番号の抽出
		const queueIdTag = "<" + queueIdStrings + ":" + "([0-9+])" + ">";
		const queueIdRe = new RegExp(queueIdTag, "gi");
		let queueId = 0;
		let queueIdArr;
		while (queueIdArr = queueIdRe.exec(text)) {
			text = text.replace(queueIdArr[0], "");
			queueId = getArgNumber(queueIdArr[1]);
		}
		
		//ターゲット番号の抽出
		const targetIdTag = "<" + targetIdStrings + ":" + "([-]?([1-9]\d*|0))" + ">";
		const targetNameTag = "<" + targetNameStrings + ":" + "(.+)" + ">";
		const nameRe = new RegExp(targetNameTag, "gi");
		let targetId = 0;
		let nameArr;
		while (nameArr = nameRe.exec(text)) {
			text = text.replace(nameArr[0], '');
			targetId = getNameTargetNumber(nameArr[1]);
		}
		const idRe = new RegExp(targetIdTag, "gi");
		let idArr;
		while (idArr = idRe.exec(text)) {
			text = text.replace(idArr[0], '');
			targetId = getArgNumber(idArr[1]);
		}
		//先頭の改行・空白スペースの除去
		while (/^\s/.test(text)) {
			text = text.replace(/^\s/, '');
		}
		text = commandText + text;
		
		//ウインドウ生成
		if (queued) {
			$gameTemp.queueBalloonWindow(queueId, targetId, text);
		} else {
			$gameTemp.createBalloonWindow(targetId, text);
		}
		
		return false;
	};
	
	//=============================================================================
	// Spriteset_Base
	//  ウインドウとアンカー表示用コンテナの追加と登録
	//=============================================================================	
	const _Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
	Spriteset_Base.prototype.initialize = function() {
		BalloonWindowManager.initialize();
		this.createBalloonAnchorContainer();
		this.createBalloonWindowContainer();
		_Spriteset_Base_initialize.apply(this, arguments);
		this.addBalloonWindowContainers();
	};
	
	const _Spriteset_Base_update = Spriteset_Base.prototype.update;
	Spriteset_Base.prototype.update = function() {
		_Spriteset_Base_update.apply(this, arguments);
		BalloonWindowManager.update();
	};
	
	Spriteset_Base.prototype.createBalloonWindowContainer = function() {
		this._balloonWindowContainer = new PIXI.Container();
		BalloonWindowManager.registBalloonWindowContainer(this._balloonWindowContainer);
	};
	
	Spriteset_Base.prototype.createBalloonAnchorContainer = function() {
		this._balloonAnchorContainer = new PIXI.Container();
		BalloonWindowManager.registBalloonAnchorContainer(this._balloonAnchorContainer);
	};
	
	Spriteset_Base.prototype.addBalloonWindowContainers = function() {
		this.addChild(this._balloonAnchorContainer);
		this.addChild(this._balloonWindowContainer);
	};
	
	//=============================================================================
	// Spriteset_Map Spriteset_Battle
	//  マネージャに戦闘状態を登録。必要時はキューをクリア
	//=============================================================================	
	const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
	Spriteset_Map.prototype.initialize = function() {
		BalloonWindowManager.setInMap();
		_Spriteset_Map_initialize.apply(this, arguments);
		if (clearQueueInBattleEnd) {$gameSystem.clearBattleBalloonWindowQueues();}
		if (clearQueueInMapChanged) {$gameSystem.clearMapBalloonWindowQueues();}
	};
	
	const _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
	Spriteset_Battle.prototype.initialize = function () {
		BalloonWindowManager.setInBattle();
		_Spriteset_Battle_initialize.apply(this, arguments);
	};
	
	//=============================================================================
	// Sprite_Character・Sprite_Acotor・Sprite_Enemy
	//  ゲームオブジェクトとスプライトセットのレジスト
	//=============================================================================	
    const _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        if (this.isImageChanged()) this._characterChange = true;
        _Sprite_Character_updateBitmap.apply(this, arguments);
        if (this._characterChange && this._character) {
			BalloonWindowManager.registGameObjectSet(this._character, this);
            this._characterChange = false;
        }
    };
	
	const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
	Sprite_Actor.prototype.setBattler = function(battler) {
		const changed = (battler !== this._actor)
		_Sprite_Actor_setBattler.apply(this, arguments);
		if (changed) {BalloonWindowManager.registGameObjectSet(battler, this._mainSprite);}
	};
	
	const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
	Sprite_Enemy.prototype.setBattler = function(battler) {
		const changed = (battler !== this._enemy)
		_Sprite_Enemy_setBattler.apply(this, arguments);
		if (changed) {
			const sprite = importedAnimatedSVEnemies && this._enemy.hasSVBattler() ? this._mainSprite : this;
			BalloonWindowManager.registGameObjectSet(battler, sprite);
		}
	};
	
	//=====================================================================================================================
	// BalloonWindowManager
	//  ゲームオブジェクト・スプライト・データオブジェクトの一元管理
	//  当たり判定処理・キュー処理・描写情報のアップデート(情報保持はGame_Character等)
	// 
	//=====================================================================================================================
	class BalloonWindowManager {
		constructor() {
			this.clearGameObjectSets();
		}
		
		static initialize() {
			this.clearGameObjectSets();
			this.clearGameBalloonWindows();
			this.setWindowSkin();
			this.setIconSet();
			this.createAnchorBitmaps();
			this.approveCommand101();
		}
		
		static clearGameObjectSets() {
			this._gameObjectId = 0;
			this._gameObjects = [];
			this._dataObjects = [];
			this._sprites = [];
		}
		
		static setWindowSkin() {
			this._windowskin = ImageManager.loadSystem("Window");
		}
		
		static windowSkin() {
			return this._windowskin;
		}
		
		static setIconSet() {
			this._iconSet = ImageManager.loadSystem('IconSet');
		}
		
		static iconSet() {
			return this._iconSet;
		}
		
		static graphicsRectangle() {
			return new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
		}
		
		static detectInGraphics(rectangle) {
			const graphicsRect = this.graphicsRectangle();
			const vector = new Point(0, 0);
			if (rectangle.top < graphicsRect.top) {
				vector.y = graphicsRect.top - rectangle.top;
			} else if (rectangle.bottom > graphicsRect.bottom) {
				vector.y = graphicsRect.bottom - rectangle.bottom;
			}
			if (rectangle.left < graphicsRect.left) {
				vector.x = graphicsRect.left - rectangle.left;
			} else if (rectangle.right > graphicsRect.right) {
				vector.x = graphicsRect.right - rectangle.right;
			}
			return vector;
		}
		
		static setInMap() {
			this._inBattle = false;
		}
		
		static setInBattle() {
			this._inBattle = true;
		}
		
		static inBattle() {
			return this._inBattle;
		}
		
		static overrideCommand101() {
			this._overridCommand101 = true;
		}
		
		static approveCommand101() {
			this._overridCommand101 = false;
		}
		
		static command101IsOverrided() {
			return this._overridCommand101;
		}
		
		static createAnchorBitmaps() {
			this.createTriangleAnchorBitmap();
			this.createCircleAnchorBitmap();
		}
		
		static createTriangleAnchorBitmap() {
			this._triangleAnchorBitmap = new BalloonWindowBitmap();
			this._triangleAnchorBitmap.drawTriangleAnchor(
														0, 0, defaultAnchorWidth, defaultAnchorHeight * defaultAnchorMultiple,
														defaultWindowLineWidth, defaultWindowColor, defaultWindowLineColor
														);
		}
		
		static createCircleAnchorBitmap() {
			this._circleAnchorBitmap = new BalloonWindowBitmap();
			this._circleAnchorBitmap.drawCircleAnchor(
													0, 0, defaultAnchorWidth, defaultAnchorHeight * defaultAnchorMultiple,
													defaultWindowLineWidth, defaultWindowColor, defaultWindowLineColor
													);
		}
		
		static triangleAnchorBitmapSize() {
			return {"width": this._triangleAnchorBitmap.width, "height": this._triangleAnchorBitmap.height};
		}
		
		static circleAnchorBitmapSize() {
			return {"width": this._circleAnchorBitmap.width, "height": this._circleAnchorBitmap.height};
		}
		
		static registBalloonWindowContainer(container) {
			this._balloonWindowContainer = container;
		}
		
		static registBalloonAnchorContainer(container) {
			this._balloonAnchorContainer = container;
		}
		
		static balloonWindowContainer() {
			return this._balloonWindowContainer;
		}
		
		static balloonAnchorContainer() {
			return this._balloonAnchorContainer;
		}
		
		//キューの作製とキューへの追加
		static clearBalloonWindowQueues() {
			$gameSystem.clearBalloonWindowQueues();
		}
		
		static queueBalloonWindowState(queueIndex, targetId, balloonWindowState) {
			const queues = $gameSystem.balloonWindowQueues();
			if (queues[queueIndex] === undefined) {
				queues[queueIndex] = [];
			}
			//実行中のイベント・行動中のバトラーのみゲームオブジェクトidで登録する
			let gameObjectId = -1;
			if (targetId === 0) {
				gameObjectId = this.gameObjectId(getTargetGameObject(targetId));
			}
			//キューにゲームオブジェクトＩＤとウインドウステートを登録
			//ポップのウエイトをどう設定しようか
			balloonWindowState.queueWait = true;
			setDisplayWait(balloonWindowState);
			setNextPopWait(balloonWindowState);
			const queued = queuedState(targetId, gameObjectId, balloonWindowState);
			//キュー内情報にマップIDを登録する
			if (this.inBattle()) {
				queued.mapId = 0
			} else if (gameObjectId >= 0){
				queued.mapId = $gameMap.mapId();
			}
			queues[queueIndex].push(queued);
		}
		
		static registGameObjectSet(gameObject, sprite) {
			//バトラーは設定により登録時にクリア
			if (clearBattlerBalloonWindowsInEveryBattle && gameObject instanceof Game_BattlerBase) {
				gameObject.balloonWindowStates = [];
			}
			//既に登録時は登録情報を変更
			if (this.gameObjectId(gameObject) > 0) {
				this.clearGameObjectSet(gameObject);
			}
			this.setGameObjectRectangleOffsets(gameObject);
			this._gameObjects[this._gameObjectId] = gameObject;
			this._dataObjects[this._gameObjectId] = getTargetGameObjectData(gameObject);
			this._sprites[this._gameObjectId] = sprite;
			this._gameObjectId++;
		}
		
		static clearGameObjectSet(gameObject) {
			const id = this.gameObjectId(gameObject);
			if (id >= 0) {
				delete this._gameObjects[id];
				delete this._dataObjects[id];
				delete this._sprites[this._gameObjectId];
			}
		}
		
		//初回のみメモ欄から取得して表示オフセットをセット
		static setGameObjectRectangleOffsets(gameObject, targetOffsets) {
			if (gameObject.rectangleOffsets === undefined) {
				gameObject.rectangleOffsets = rectangleOffsets();
				const meta = getTargetGameObjectMeta(gameObject);
				let metaArr;
				if (meta && gameObject instanceof Game_CharacterBase && meta.bwcOffsets) {
					metaArr = meta.bwcOffsets.split(",");
				} else if (meta && gameObject instanceof Game_Battler && meta.bwbOffsets) {
					metaArr = meta.bwbOffsets.split(",");
				}
				if (metaArr) {
					gameObject.rectangleOffsets.top = getArgNumber(metaArr[0]);
					gameObject.rectangleOffsets.left = getArgNumber(metaArr[1]);
					gameObject.rectangleOffsets.right = getArgNumber(metaArr[2]);
					gameObject.rectangleOffsets.bottom = getArgNumber(metaArr[3]);
				}
			}
			if (targetOffsets) {
				gameObject.rectangleOffsets = targetOffsets;
			}
		}
		
		static gameObjectId(gameObject) {
			return this._gameObjects.indexOf(gameObject);
		}
		
		static gameObjectSprite(gameObject) {
			return this._sprites[this.gameObjectId(gameObject)];
		}
		
		//名前からターゲット番号を取得する。作成時にゲームオブジェクトに戻されるから邪道
		static nameTargetNumber(name) {
			const nameIndex = this._dataObjects.findIndex((dataObject) => {
				if (dataObject) {
					return dataObject.name === name;
				}
			});
			if (nameIndex >= 0) {
				const gameObject = this._gameObjects[nameIndex];
				if (this.inBattle()) {
					const partyMemberIndex = $gameParty.members().indexOf(gameObject);
					if (partyMemberIndex >= 0) return - (partyMemberIndex + 1);
					const troopMemberIndex = $gameTroop.members().indexOf(gameObject);
					if (troopMemberIndex >= 0) return troopMemberIndex + 1;
				} else {
					if (gameObject === $gamePlayer) return -1;
					const followerIndex = $gamePlayer.followers()._data.indexOf(gameObject);
					if (followerIndex >= 0) return - (followerIndex + 2);
					const eventIndex = $gameMap._events.indexOf(gameObject)
					if (eventIndex >= 0) return eventIndex + 1;
				}
			}
			return 0;
		}
		
		static gameObjectRectangle(gameObject, skipUpdate) {
			const sprite = this.gameObjectSprite(gameObject);
			//フロントビュー時のアクターはスプライト位置と関係なくパラメータで設定した値を返す
			if ($gameSystem.isSideView() === false && gameObject instanceof Game_Actor) {
				const memberIndex = $gameParty.members().findIndex((gameActor) => {return gameObject === gameActor});
				if (memberIndex >= 0) {
					const anchorPosition = partyMemberAnchorPositions[memberIndex];
					//幅と高さを１で持たせてビットマップ読み込み前と判別する
					return new PIXI.Rectangle(anchorPosition.x, anchorPosition.y, 1, 1);
				}
			}
			if (sprite) {
				const rectangle = sprite.getBounds(skipUpdate);
				const rectangleOffsets = gameObject.rectangleOffsets;
				const x = rectangle.x + rectangleOffsets.left;
				const y = rectangle.y + rectangleOffsets.top;
				const width = rectangle.width - rectangleOffsets.left - rectangleOffsets.right;
				const height = rectangle.height - rectangleOffsets.top - rectangleOffsets.bottom;
				return new PIXI.Rectangle(x, y, width, height);
			}
		}
		
		static gameObjectScreenTop(gameObject) {
			const sprite = this.gameObjectSprite(gameObject);
			if (sprite) {
				const rectangle = sprite.getBounds(false);
				return new Point(rectangle.x + rectangle.width / 2, rectangle.top);
			} else {
				return null;
			}
		}
		
		static gameObjectScreenBottom(gameObject) {
			const sprite = this.gameObjectSprite(gameObject);
			if (sprite) {
				const rectangle = sprite.getBounds();
				return new Point(rectangle.x + rectangle.width / 2, rectangle.bottom);
			} else {
				return null;
			}
		}
		
		static clearGameBalloonWindows() {
			this._gameBalloonWindows = [];
		}
		
		static registGameBalloonWindow(gameBalloonWindow) {
			this._gameBalloonWindows.push(gameBalloonWindow);
		}
		
		static update() {
			this.updateBalloonWindowQueues();
			this.updateBalloonWindowStates();
			
			if (this._balloonWindowContainer) {
				this._balloonWindowContainer.children.forEach((child) => {
					child.update();
				});
			}
			if (this._balloonAnchorContainer) {
				this._balloonAnchorContainer.children.forEach((child) => {
					child.update();
				})
			}
			if (this._gameBalloonWindows) {
				this._gameBalloonWindows.forEach((gameBalloonWindow) => {
					gameBalloonWindow.update();
				})
				//当たり判定処理関数
				this.updateGameBalloonWindowPosition();
			}
		}
		
		//ウィンドウ同士の当たり判定
		static updateGameBalloonWindowPosition() {
			const gameBalloonWindows = this._gameBalloonWindows;
			for (let i = 0; i < gameBalloonWindows.length - 1; i++) {
				const gameBalloonWindow = gameBalloonWindows[i];
				const gameObjectRectangle = this.gameObjectRectangle(gameBalloonWindow.gameObject);
				
				//重なったら動くの処理
				const detectRect = gameBalloonWindow.collisionRectangle;
				const targetRect = gameBalloonWindows[i + 1].collisionRectangle;
				const moveVector = this.detectRectsCollision(detectRect, targetRect);
				if (Math.abs(moveVector.x) < Math.abs(moveVector.y)) {
					gameBalloonWindow.windowState.position.x += moveVector.x;
				} else {
					gameBalloonWindow.windowState.position.y += moveVector.y;
				}
			}
		}
		
		static updateBalloonWindowQueues() {
			const queues = $gameSystem.balloonWindowQueues();
			queues.forEach((queue) => {
				if (queue) {
					const queueLeadr = queue[0];
					const balloonWindowState = queueLeadr ? queueLeadr.balloonWindowState : null;
					//キューの先頭が未表示なら表示
					if (queueLeadr && balloonWindowState && balloonWindowState.queueWait) {
						//実行中のイベント・行動中のバトラーはゲームオブジェクトidで再生
						if (queueLeadr.gameObjectId >= 0) {
							//マップIDが同じときのみ再生
							if (queueLeadr.mapId === $gameMap.mapId()) {
								this.addBalloonWindow(this._gameObjects[queueLeadr.gameObjectId], balloonWindowState);
							}
						} else {
							this.addBalloonWindow(getTargetGameObject(queueLeadr.targetId), balloonWindowState);
						}
						balloonWindowState.queueWait = false;
					}
					//ウエイトがおわったらキューから除去してシフト
					if (balloonWindowState && balloonWindowState.nextPopWait > 0) {
						balloonWindowState.nextPopWait--;
					} else if (queue.length > 0){
						queue.shift();
					}
				}
			});
		}
		
		//ゲームオブジェクトが持つ自動描写用ウインドウステート配列を更新する
		static updateBalloonWindowStates() {
			if (this._gameObjects) {
				this._gameObjects.forEach(function(gameObject) {
					this.updateGameObject(gameObject);
				}.bind(this))
			}
		}
		
		static updateGameObject(gameObject) {
			if (gameObject.balloonWindowStates) {
				//表示されていないバルーンウインドウの表示
				gameObject.balloonWindowStates.forEach(function(balloonWindowState) {
					if (balloonWindowState.displayFrame <= 0) {
						//描写終了したバルーンウインドウステートのレジストを解除
						this.removeBalloonWindow(balloonWindowState);
					} else if (this._gameBalloonWindows.some((gameBalloonWindow) => {
						return gameBalloonWindow.balloonWindowState === balloonWindowState;
					}) === false)  {
						this.createBalloonWindow(gameObject, balloonWindowState);
					}
					balloonWindowState.displayFrame--;
				}.bind(this))
				//描写終了したバルーンウインドウステートの除去
				gameObject.balloonWindowStates =  gameObject.balloonWindowStates.filter((balloonWindowState) => {
					return balloonWindowState.displayFrame >= 0;
				})
			}
		}
		
		static removeBalloonWindow(balloonWindowState) {
			this._gameBalloonWindows = this._gameBalloonWindows.filter((gameBalloonWindow) => {
				return gameBalloonWindow.balloonWindowState !== balloonWindowState;
			})
		}
		
		static addBalloonWindow(gameObject, balloonWindowState) {
			if (!gameObject) return;
			//行動制約時は追加出来ない仕様
			if (gameObject instanceof Game_BattlerBase && !gameObject.canSpeak()) return;
			//バルーンウィンドウ用配列が無いときは初期化
			if (gameObject.balloonWindowStates === undefined) {
				gameObject.balloonWindowStates = [];
			}
			gameObject.balloonWindowStates.push(balloonWindowState);
		}
		
		static createBalloonWindow(gameObject, balloonWindowState) {
			const balloonWindow = new Game_BalloonWindow();
			balloonWindow.setup(gameObject, balloonWindowState);
			const spriteWindow = new Sprite_BalloonWindow();
			const spriteAnchor = new Sprite_BalloonWindowAnchor();
			spriteWindow.setup(balloonWindow);
			spriteAnchor.setup(balloonWindow);
			this.balloonWindowContainer().addChild(spriteWindow);
			this.balloonAnchorContainer().addChild(spriteAnchor);
			this.registGameBalloonWindow(balloonWindow);
			balloonWindow.setInitialPosition(gameObject, balloonWindowState);
			balloonWindow.update();
			spriteWindow.update();
			spriteAnchor.update();
		}
		
		static moveRectangle(point, rectangle) {
			return new PIXI.Rectangle(rectangle.x + point.x, rectangle.y + point.y, rectangle.width, rectangle.height);
		}
		
		static detectRectsCollision(detectRect, targetRect) {
			const resultVector = new Point(0, 0);
			//X軸方向の判定
			const vXa = detectRect.right - targetRect.left;
			const vXb = targetRect.right - detectRect.left;
			//Y軸方向の判定
			const vYa = detectRect.bottom - targetRect.top;
			const vYb = targetRect.bottom - detectRect.top;
			//当たっている時
			if (vXa >= 0 && vXb >= 0 && vYa >= 0 && vYb >= 0) {
				//X軸方向のベクトルセット
				if (vXa >= 0 && vXb >= 0) {
					const dX = vXa < vXb ? vXa : vXb;
					resultVector.x = detectRect.left < targetRect.left ?  - dX : dX;
				}
				//Y軸方向のベクトルセット
				if (vYa >= 0 && vYb >= 0) {
					const dY = vYa < vYb ? vYa : vYb;
					resultVector.y = detectRect.top < targetRect.top ? - dY : dY;
				}	
			}
			return resultVector;
		}
		
	}
	
	//======================================================
	//Game_BalloonWindow
	// テキスト・ウインドウ・ウインドウアンカー情報の保持
	// バルーンウィンドウ情報はゲームキャラクター等が保持するものを参照
	//======================================================
	class Game_BalloonWindow {
		constructor() {
			this.initialize();
		}
		
		initialize() {
			this.initMembers();
		}
		
		initMembers() {
			this.text = "";
			this.textRectangle = null;
			//ウインドウのレクトはスプライトから逆設定される
			this.windowRectangle = null;
			this.collisionRectangle = null;
			this.balloonWindowState = null;
			this.textState = textState();
			this.windowState = windowState();
			this.anchorState = anchorState();
			this.nameState = nameState(textState(), windowState());
		}
		
		setup(gameObject, balloonWindowState) {
			this.setTargetGameObject(gameObject);
			this.balloonWindowState = balloonWindowState;
			this.setText(balloonWindowState.text);
			this.setDisplayWait(balloonWindowState);
		}
		
		setText(text) {
			this.text = text;
			this.textState.text = text;
		}
		
		setDisplayWait(balloonWindowState) {
			if (balloonWindowState.displayFrame !== Infinity) return;
			const controlWait = this.controlCharacterWait(balloonWindowState);
			if (controlWait >= 0) {
				balloonWindowState.displayFrame = controlWait;
			} else {
				const text = convertEscapeCharacters(balloonWindowState.text, true, true);
				const textWait = text.length * singleCharacterWait
				balloonWindowState.displayFrame = textWait > minmumDisplayFrame ? textWait : minmumDisplayFrame;	
			}
		}
		
		controlCharacterWait(balloonWindowState) {
			let text = balloonWindowState.text;
			text = text.replace(/\\/g, '\x1b');
			text = text.replace(/\x1b\x1b/g, '\\');
			const arr = /\x1bSDW\[(\d+)\]/gi.exec(text);
			if (arr) {
				return getArgNumber(arr[1]);
			} else {
				return -1;
			}
		}
		
		//サイズ計算後に外側から再セットされる
		setTextStateSize(width, height) {
			this.textState.sizeWidth = width;
			this.textState.sizeHeight = height;
		}
		
		setTargetGameObject(gameObject) {
			this.gameObject = gameObject;
		}
		
		setInitialPosition(gameObject, balloonWindowState) {
			const gameObjectRectangle = BalloonWindowManager.gameObjectRectangle(gameObject);
			if (gameObjectRectangle.width === 0 || gameObjectRectangle.height === 0) {
				if (this.balloonWindowState) {
					this.windowState.position.x = this.balloonWindowState.position.x;
					this.windowState.position.y = this.balloonWindowState.position.y;
				} 
			} else {
				const targetPosition = this.windowTargetPosition(gameObjectRectangle);
				this.windowState.position.x = targetPosition.x;
				this.windowState.position.y = targetPosition.y;
			}		
		}
		
		completed() {
			return this.balloonWindowState.displayFrame <= 0;
		}
		
		update() {
			const gameObjectRectangle = BalloonWindowManager.gameObjectRectangle(this.gameObject);
			this.updateWindowPosition(gameObjectRectangle);
			this.updateAnchorTop(gameObjectRectangle);
			this.updateAnchorState(gameObjectRectangle);
			this.updateBalloonWindowState();
			this.updateAnimationStates();
			this.updateSe();
		}
		
		updateWindowPosition(gameObjectRectangle) {
			const windowPosition = this.windowState.position;
			//ゲームオブジェクト位置へ移動
			const targetPosition = this.windowTargetPosition(gameObjectRectangle);
			let vectorX = targetPosition.x - windowPosition.x;
			let vectorY = targetPosition.y - windowPosition.y;
			const vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
			if (vectorLength > maxWindowSpeed) {
				vectorX = vectorX / vectorLength * maxWindowSpeed;
				vectorY = vectorY / vectorLength * maxWindowSpeed;
			}
			this.windowState.position.x += vectorX;
			this.windowState.position.y += vectorY;	
			this.updateRectangles();
			
			if (this.windowState.inGraphics) {
				const inGraphicsVector = BalloonWindowManager.detectInGraphics(this.windowRectangle);
				if (inGraphicsVector.x !== 0 || inGraphicsVector.y !== 0) {
					//画面内へ移動
					this.windowState.position.x += inGraphicsVector.x;
					this.windowState.position.y += inGraphicsVector.y;
				}
			}
			
			this.updateRectangles();
		}
		
		updateRectangles() {
			//スプライトから逆設定されたRectangleの位置情報更新。Rectangleは左上が原点のため
			const windowPosition = this.windowState.position
			const windowRectangle = this.windowRectangle;
			windowRectangle.x = windowPosition.x - windowRectangle.width / 2;
			windowRectangle.y = windowPosition.y - windowRectangle.height / 2;
			const textRectangle = this.textRectangle;
			textRectangle.x = windowPosition.x - textRectangle.width / 2;
			textRectangle.y = windowPosition.y - textRectangle.height / 2;
			const collisionRectangle = this.collisionRectangle;
			collisionRectangle.x = windowPosition.x - collisionRectangle.width / 2;
			collisionRectangle.y = windowPosition.y - collisionRectangle.height / 2;
		}

		updateAnchorTop(gameObjectRectangle) {
			const windowState = this.windowState;
			const windowRectangle = this.windowRectangle;
			const anchorPosition = this.anchorState.position;
			const anchorTopPosition = windowState.anchorTop;
			
			//アンカー描写用トップ位置の更新
			if (windowRectangle.left >= anchorPosition.x) {
				anchorTopPosition.x = windowRectangle.left;
			} else if (windowRectangle.right <= anchorPosition.x) {
				anchorTopPosition.x = windowRectangle.right;
			} else {
				anchorTopPosition.x = anchorPosition.x;
			} 
			if (windowRectangle.top >= anchorPosition.y) {
				anchorTopPosition.y = windowRectangle.top;
			} else if (windowRectangle.bottom <= anchorPosition.y) {
				anchorTopPosition.y = windowRectangle.bottom;
			} else {
				anchorTopPosition.y = anchorPosition.y;
			}	
		}
		
		windowTargetPosition(gameObjectRectangle) {
			//理想位置の取得
			const targetPosition = new Point(0, 0);
			const addY = this.windowState.size.height / 2;
			targetPosition.x = gameObjectRectangle.left + gameObjectRectangle.width / 2;
			if (this.windowState.upper) {
				targetPosition.y = gameObjectRectangle.top - defaultAnchorHeight - addY;
			} else {
				targetPosition.y = gameObjectRectangle.bottom + defaultAnchorHeight + addY;
			}
			return targetPosition;
		}
		
		updateAnchorState(gameObjectRectangle) {
			const anchorState = this.anchorState;
			
			//アンカー位置計算。キャラクターグラフィックの周囲を回転する
			const windowRectangle = this.windowRectangle;
			
			if (gameObjectRectangle) {
				
				if (windowRectangle.left > gameObjectRectangle.right) {
					anchorState.position.x = gameObjectRectangle.right;
				} else if (windowRectangle.left + gameObjectRectangle.width / 2 > gameObjectRectangle.right) {
					anchorState.position.x = windowRectangle.left;
				} else if (windowRectangle.right < gameObjectRectangle.left) {
					anchorState.position.x = gameObjectRectangle.left;
				} else if (windowRectangle.right - gameObjectRectangle.width / 2 < gameObjectRectangle.left) {
					anchorState.position.x = windowRectangle.right;
				} else {
					anchorState.position.x = gameObjectRectangle.left + gameObjectRectangle.width / 2;
				}
				
				if (windowRectangle.top > gameObjectRectangle.bottom) {
					anchorState.position.y = gameObjectRectangle.bottom;
				} else if (windowRectangle.top + gameObjectRectangle.height / 2 > gameObjectRectangle.bottom) {
					anchorState.position.y = windowRectangle.top;
				} else if (windowRectangle.bottom < gameObjectRectangle.top) {
					anchorState.position.y = gameObjectRectangle.top;
				} else if (windowRectangle.bottom - gameObjectRectangle.height / 2 < gameObjectRectangle.top) {
					anchorState.position.y = windowRectangle.bottom;
				} else {
					anchorState.position.y = gameObjectRectangle.top + gameObjectRectangle.height / 2
				}
			}
			
			//アンカートップ位置計算
			const anchorTop = this.windowState.anchorTop;
			//ローテーション計算
			const rotation = Math.PI / 2 - calcRadian(calcCosine(anchorTop.x - anchorState.position.x, anchorTop.y - anchorState.position.y));
			anchorState.rotation = anchorTop.y < anchorState.position.y ?  rotation : - (rotation + Math.PI);
			//スケール計算
			const deltaX = Math.abs(anchorState.position.x - anchorTop.x);
			const deltaY = Math.abs(anchorState.position.y - anchorTop.y);
			let bitmapSize;
			if (anchorState.shape === anchorShapeTypes.circle) {
				bitmapSize = BalloonWindowManager.circleAnchorBitmapSize();
			} else {
				bitmapSize = BalloonWindowManager.triangleAnchorBitmapSize();
			}
			
			if (deltaX === 0) {
				anchorState.scale.y = Math.round(deltaY / bitmapSize.height * 1000) / 1000;
			} else if (deltaY === 0) {
				anchorState.scale.y = Math.round(deltaX / bitmapSize.height * 1000) / 1000;
			} else {
				const deltaLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
				anchorState.scale.y = Math.round(deltaLength / bitmapSize.height * 1000) / 1000;
			}
		}
		
		updateBalloonWindowState() {
			//位置情報の更新
			this.balloonWindowState.position = this.windowState.position;
			//オブジェクトがデータを持たないときは終了
			if (this.gameObject.balloonWindowStates.indexOf(this.balloonWindowState) < 0) {	
				this.balloonWindowState.displayFrame = 0;
			}
		}
		
		updateAnimationStates() {
			if (this.balloonWindowState.openAnimationCount > 0) {
				this.updateStartAnimation(this.windowState.animationState);
				this.updateStartAnimation(this.anchorState.animationState);
				this.balloonWindowState.openAnimationCount--;
			} else if (this.balloonWindowState.displayFrame <= closeAnimationCount) {
				this.updateEndAnimation(this.windowState.animationState);
				this.updateEndAnimation(this.anchorState.animationState);
			} else {
				this.updateInterAnimation(this.windowState.animationState);
				this.updateInterAnimation(this.anchorState.animationState);
			}
		}
		
		updateStartAnimation(animationState) {
			const scale = animationState.scale;
			scale.x += scale.x < 1 ? 1 / openAnimationCount : 0;
			scale.y += scale.y < 1 ? 1 / openAnimationCount : 0;
		}
		
		updateInterAnimation(animationState) {
			const scale = animationState.scale;
			scale.x = 1;
			scale.y = 1;
		}
		
		updateEndAnimation(animationState) {
			const scale = animationState.scale;
			scale.x -= scale.x > 0 ? 1 / closeAnimationCount : 0;
			scale.y -= scale.y > 0 ? 1 / closeAnimationCount : 0;
		}
		
		updateSe() {
			const balloonWindowState = this.balloonWindowState;
			const sePlayingCount = balloonWindowState.sePlayingCount;
			const windowState = this.windowState;
			if (sePlayingCount < 0 || windowState.seName.length <= 0) return;
			if (sePlayingCount === 0) {
				AudioManager.playSe({"name":windowState.seName, "volume":windowState.seVolume, "pitch":windowState.sePitch, "pan":windowState.sePan});
			}
			if (sePlayingCount >= 0) {
				balloonWindowState.sePlayingCount--;
			}
		}
	}
	
	//======================================================
	//Sprite_BalloonWindow
	// 文字表示用スプライト
	// コアスクリプトからのWindowクラスの関数も移行して保持
	//======================================================
	class Sprite_BalloonWindow extends Sprite {
		
		initialize() {
			super.initialize();
			this.initMembers();
			this.initSprites();
		}
		
		initMembers() {
			this._balloonWindow = null;
			//テキストサイズ測定用
			this._tempCanvas = document.createElement("canvas");
			this._tempContext = this._tempCanvas.getContext("2d");
		}
		
		initSprites() {
			this._backgroundContainer = new PIXI.Container();
			this._nameContainerSprite = new Sprite();
			this._mainSprite = new Sprite();
			this._nameSprite = new Sprite();
			this._nameBackSprite = new Sprite();
			this._faceSprite = new Sprite();
			this._backSprite = new Sprite();
			this.registSprite();
		}
		
		registSprite() {
			this.addChild(this._backgroundContainer);
			this._backgroundContainer.addChild(this._backSprite);
			this._backgroundContainer.addChild(this._faceSprite);
			this.addChild(this._mainSprite);
			this._nameContainerSprite.addChild(this._nameBackSprite);
			this._nameContainerSprite.addChild(this._nameSprite);
			this.addChild(this._nameContainerSprite);
		}
		
		setup(balloonWindow) {
			this._balloonWindow = balloonWindow;
			this.setupMainBitmap(balloonWindow);
			this.drawTextEx(balloonWindow.textState, false);
			this.setupNameBitmap(balloonWindow);
			this.drawTextEx(balloonWindow.nameState.textState, false);
			this.setupFace(balloonWindow);
			this.setupBackBitmap(balloonWindow);
			this.setupNameBackBitmap(balloonWindow);
			this.setupNamePosition();
			this.updatePosition();
			this.updateRectangles();
		}
		
		setupMainBitmap(balloonWindow) {
			//テキストサイズに併せたビットマップ生成
			const textState = this.drawTextEx(balloonWindow.textState, true);
			const bitmap = new BalloonWindowBitmap();
			bitmap.resize(textState.sizeWidth, textState.sizeHeight);
			//サイズはオリジナルに代入する
			balloonWindow.setTextStateSize(textState.sizeWidth, textState.sizeHeight);
			this._mainSprite.bitmap = bitmap;
			this._mainSprite.move(- bitmap.width / 2, - bitmap.height / 2);
		}
		
		setupFace(balloonWindow) {
			const windowState = balloonWindow.windowState;
			if (windowState.faceName.length <= 0) return;
			const bitmap = ImageManager.loadFace(windowState.faceName);
			this._faceSprite.bitmap = bitmap;
			const pw = Window_Base._faceWidth;
			const ph =  Window_Base._faceHeight;
			const sx = windowState.faceIndex % 4 * pw;
			const sy = Math.floor(windowState.faceIndex / 4) * ph;
			this._faceSprite.setFrame(sx, sy, pw, ph);
			this._faceSprite.scale = new Point(windowState.faceImageScale, windowState.faceImageScale);
			windowState.faceSize.width = pw * this._faceSprite.scale.x;
			windowState.faceSize.height = ph * this._faceSprite.scale.y;
		}
		
		setupNameBitmap(balloonWindow) {
			const nameState = balloonWindow.nameState;
			const nameTextState = balloonWindow.nameState.textState;
			if (nameTextState.text.length <= 0) return;
			const textState = this.drawTextEx(nameTextState, true);
			textState.index = 0;
			const bitmap = new BalloonWindowBitmap();
			bitmap.resize(textState.sizeWidth, textState.sizeHeight);
			nameTextState.sizeWidth = textState.sizeWidth;
			nameTextState.sizeHeight = textState.sizeHeight;
			this._nameSprite.bitmap = bitmap;
			this._nameSprite.move(- bitmap.width / 2, - bitmap.height / 2);
		}
		
		setupBackBitmap(balloonWindow) {
			const textState = balloonWindow.textState;
			const windowState = balloonWindow.windowState;
			const bitmap = new BalloonWindowBitmap();
			const width = textState.sizeWidth + windowState.faceSize.width;
			const height = Math.max(textState.sizeHeight, windowState.faceSize.height);
			switch (windowState.shape) {
				case windowShapeTypes.circle:
					bitmap.drawNineSliceRect(0, 0, width, height, windowState);
					break;
				case windowShapeTypes.spike:
					bitmap.drawSpike(0, 0, width, height, windowState);
					break;
				default:
					bitmap.drawSquare(0, 0, width, height, windowState);
			}
			this._backSprite.bitmap = bitmap;
			this._backSprite.move(- bitmap.width / 2, - bitmap.height / 2);
			//サイズの逆設定
			windowState.size.width = bitmap.width;
			windowState.size.height = bitmap.height;
			
			this._faceSprite.move(- bitmap.width / 2 + windowState.padding, - windowState.faceSize.height / 2);
			this._mainSprite.move(this._mainSprite.x + windowState.faceSize.width / 2, this._mainSprite.y);
		}
		
		setupNameBackBitmap(balloonWindow) {
			const textState = balloonWindow.nameState.textState;
			if (textState.text.length <= 0) return;
			const windowState = balloonWindow.nameState.windowState;
			const bitmap = new BalloonWindowBitmap();
			const width = textState.sizeWidth;
			const height = textState.sizeHeight;
			switch (windowState.shape) {
				case windowShapeTypes.circle:
					bitmap.drawNineSliceRect(0, 0, width, height, windowState);
					break;
				case windowShapeTypes.spike:
					bitmap.drawSpike(0, 0, width, height, windowState);
					break;
				default:
					bitmap.drawSquare(0, 0, width, height, windowState);
			}
			this._nameBackSprite.bitmap = bitmap;
			this._nameBackSprite.move(- bitmap.width / 2, - bitmap.height / 2);
			//サイズの逆設定
			windowState.size.width = bitmap.width;
			windowState.size.height = bitmap.height;
			this._nameBackSprite.move(- bitmap.width / 2, - bitmap.height / 2);
		}
		
		setupNamePosition() {
			this._nameContainerSprite.move(- this._backSprite.width / 2 + this._nameBackSprite.width / 2, - this._backSprite.height / 2 - this._nameBackSprite.height / 2);
		}
		
		update() {
			super.update();
			this.updateComplete();
			this._backgroundContainer.children.forEach((child) => {
				child.update();
			});
			this.updatePosition();
			this.updateRectangles();
		}
		
		//スプライトの自動除去
		updateComplete() {
			if (this._balloonWindow.completed()) {
				this.parent.removeChild(this);
			}
		}
		
		updatePosition() {
			const windowState = this._balloonWindow.windowState;
			this.x = Math.floor(windowState.position.x);
			this.y = Math.floor(windowState.position.y);
			this.scale.x = windowState.scale.x * windowState.animationState.scale.x;
			this.scale.y = windowState.scale.y * windowState.animationState.scale.y;
			this.opacity = windowState.opacity;
		}
		
		//Game_BalloonWindowにレクトを逆設定
		updateRectangles() {
			const windowState = this._balloonWindow.windowState;
			const textRectangle = this._mainSprite.getBounds(false);
			textRectangle.width = textRectangle.width + windowState.padding;
			textRectangle.height = textRectangle.height + windowState.padding;
			this._balloonWindow.textRectangle = textRectangle;
			
			const windowRectangle = this._backSprite.getBounds(false);
			this._balloonWindow.windowRectangle = windowRectangle;
			
			const collisionRectangle = new PIXI.Rectangle(windowRectangle.x + windowState.padding / 2, windowRectangle.y + windowState.padding / 2,
														windowRectangle.width - windowState.padding, windowRectangle.height - windowState.padding);
			this._balloonWindow.collisionRectangle = collisionRectangle;
		}
		
		drawTextEx(textState, forSize) {
			if (forSize) {
				textState = copyTextState(textState);
				textState.forSize = true;
			}
			textState.text = convertEscapeCharacters(textState.text, forSize, false);
			textState.height = this.calcTextHeight(textState, false);
			let newWidth = 0;
			while (textState.index < textState.text.length) {
				//改行時は新規に幅を加えない。制御文字処理前に保存しないと座標が取れなくなるため。
				if (forSize) {
					newWidth = textState.x;
				}
				this.processCharacter(textState);
				//画像サイズの更新
				if (forSize) {
					newWidth = Math.max(newWidth, textState.x);
					const newHeight = textState.y + textState.height;
					textState.sizeWidth = textState.sizeWidth < newWidth ? newWidth : textState.sizeWidth;
					textState.sizeHeight = textState.sizeHeight < newHeight ? newHeight : textState.sizeHeight;
				}
			}
			//テキストのアライン用に行の幅を保持する
			if (forSize) {textState.lineWidthArr.push(newWidth);}
			return textState;
		}
				
		calcTextHeight(textState, allLines) {
			textState = copyTextState(textState);
			const lines = textState.text.slice(textState.index).split(/\n/g);
			const maxRow = allLines ? lines.length : 1;
			let maxFontSize = textState.fontSize;
			let textHeight = 0;
			const re = /\x1b{|\x1b}|\x1bCFS\[(\d+)\]/gi;
			let resultArr;
			for (let i = 0; i < maxRow; i++) {
				while (resultArr = re.exec(lines[i])) {
					const escapeCharacters = resultArr[0];
					if (escapeCharacters === "\x1b{") {
						this.makeFontBigger(textState);
					} else if (escapeCharacters === "\x1b}") {
						this.makeFontSmaller(textState);
					} else if (/\x1bCFS\[(\d+)\]/i.test(escapeCharacters)) {
						this.changeFontSize(textState, getArgNumber(resultArr[1]));
					}
					maxFontSize = textState.fontSize > maxFontSize ? textState.fontSize : maxFontSize;
				}
				textHeight += maxFontSize;
			}
			return textHeight;
		}
		
		measureTextWidth(text, textState) {
			const context = this._tempContext;
			context.save();
			context.font = this.makeFontNameText(textState);
			const width = context.measureText(text).width;
			context.restore();
			return width;
		}
		
		makeFontNameText(textState) {
			const fontFace = Graphics.isFontLoaded(textState.fontFamily) ? textState.fontFamily : defaultFontFamily;
			return textState.fontSize + 'px ' + fontFace;
		}
		
		processCharacter(textState) {
			switch (textState.text[textState.index]) {
			case '\n':
				this.processNewLine(textState);
				break;
			case '\x1b':
				this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
				break;
			default:
				this.processNormalCharacter(textState);
				break;
			}
		}
		
		processNewLine(textState) {
			if (textState.forSize) {
				textState.lineWidthArr.push(textState.x);
			}
			textState.lineIndex ++;
			textState.x = textState.left;
			textState.y += textState.height + defaultLineSpace;
			textState.index++;
			textState.height = this.calcTextHeight(textState, false)
		}
		
		processEscapeCharacter(code, textState) {
			switch (code) {
				case 'C' :
					this.changeTextColor(textState, this.textColor(this.obtainEscapeParam(textState)));
					break;
				case 'I':
					this.processDrawIcon(textState, this.obtainEscapeParam(textState));
					break;
				case '{':
					this.makeFontBigger(textState);
					break;
				case '}':
					this.makeFontSmaller(textState);
					break;
				case 'CFS':
					this.changeFontSize(textState, this.obtainEscapeParam(textState));
					break;
				case 'CTC':
					this.changeTextColor(textState, this.obtainEscapeRGBA(textState));
					break;
				case 'COC':
					this.changeTextOutlineColor(textState, this.obtainEscapeRGBA(textState));
					break;
				case 'RTC;':
					this.resetTextColor(textState);
					break;
				case 'ROC;':
					this.resetTextOutlineColor(textState);
					break;
				case 'CWCL':
					this.changeWindowColor(this.obtainEscapeRGBA(textState));
					break;
				case 'CWLCL':
					this.changeWindowLineColor(this.obtainEscapeRGBA(textState));
					break;
				case 'CWSQ;':
					this.changeWindowSqare();
					break;
				case 'CWSP;':
					this.changeWindowSpike();
					break;
				case 'CWCR;':
					this.changeWindowCircle();
					break;
				case 'CATR;':
					this.changeAnchorTriangle();
					break;
				case 'CACR;':
					this.changeAnchorCircle();
					break;
				case 'WUP;':
					this.setWindowUpper();
					break;
				case 'WUN;':
					this.setWindowUnder();
					break;
				case 'CTAL;':
					this.changeTextAlignLeft();
					break;
				case 'CTAC;':
					this.changeTextAlignCenter();
					break;
				case 'CTAR;':
					this.changeTextAlignRight();
					break;
				case 'SPSE':
					this.setPlaySe(this.obtainEscapeStrings(textState));
					break;
				case 'SSEV':
					this.setSeVolume(this.obtainEscapeParam(textState));
					break;
				case 'SSEPT':
					this.setSePitch(this.obtainEscapeParam(textState));
					break;
				case 'SSEPA':
					this.setSePan(this.obtainEscapeParam(textState));
					break;
				case 'WIG;':
					this.setInGraphics();
					break;
				case 'WOG;':
					this.setOutGraphics();
					break;
				case 'SFN':
					this.setFaceName(this.obtainEscapeStrings(textState));
					break;
				case 'SFI':
					this.setFaceIndex(this.obtainEscapeParam(textState));
					break;
				case 'NC':
					this.setNameText(this.obtainEscapeStrings(textState));
					break;
			}
		}
		
		obtainEscapeCode(textState) {
			textState.index++;
			const regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+;*/i;
			const arr = regExp.exec(textState.text.slice(textState.index));
			if (arr) {
				textState.index += arr[0].length;
				return arr[0].toUpperCase();
			} else {
				return '';
			}
		}
		
		obtainEscapeParam(textState) {
			const arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
			if (arr) {
				textState.index += arr[0].length;
				return parseInt(arr[0].slice(1));
			} else {
				return '';
			}
		}
		
		obtainEscapeRGBA(textState) {
			const arr = /^\[rgba\([^].*?\)]/.exec(textState.text.slice(textState.index));
			if (arr) {
				textState.index += arr[0].length;
				return arr[0].slice(1, -1);
			} else {
				return '';
			}
		}
		
		obtainEscapeStrings(textState) {
			const arr = /^\[[^\]]+\]/.exec(textState.text.slice(textState.index));
			if (arr) {
				textState.index += arr[0].length;
				return arr[0].slice(1, -1);
			} else {
				return '';
			}
		}
		
		textColor(n) {
			const px = 96 + (n % 8) * 12 + 6;
			const py = 144 + Math.floor(n / 8) * 12 + 6;
			return BalloonWindowManager.windowSkin() ? BalloonWindowManager.windowSkin().getPixel(px, py) : '#ffffff';
		};
		
		changeTextColor(textState, color) {
			textState.fontColor = color;
		}
		
		processDrawIcon(textState, iconIndex) {
			if (!textState.forSize) {
				let addX = 0;
				addX = (textState.align === textAlignTypes.center && addX === 0) ? Math.floor((textState.sizeWidth - textState.lineWidthArr[textState.lineIndex]) / 2) : addX;
				addX = (textState.align === textAlignTypes.right && addX === 0) ? textState.sizeWidth - textState.lineWidthArr[textState.lineIndex] : addX;
				this.drawResizeIcon(iconIndex, textState.x + addX, textState.y, textState.height);
			}
			textState.x += textState.height;
		}
		
		drawResizeIcon(iconIndex, x, y, textHeight) {
			const bitmap = BalloonWindowManager.iconSet();
			const pw = Window_Base._iconWidth;
			const ph = Window_Base._iconHeight;
			const sx = iconIndex % 16 * pw;
			const sy = Math.floor(iconIndex / 16) * ph;
			const scale = textHeight;
			this._mainSprite.bitmap.scaleBlt(bitmap, sx, sy, pw, ph, x, y, scale, scale);
		}
		
		changeFontSize(textState, fontSize) {
			fontSize = fontSize > maxFontSize ? maxFontSize : fontSize;
			fontSize = fontSize < minFontSize ? minFontSize : fontSize;
			textState.fontSize = fontSize;
		}
		
		makeFontBigger(textState) {
			textState.fontSize += textState.fontSize + fontSizeDelta <= maxFontSize ? fontSizeDelta : maxFontSize - textState.fontSize;
		}
		
		makeFontSmaller(textState) {
			textState.fontSize -= textState.fontSize - fontSizeDelta >= minFontSize ? fontSizeDelta : textState.fontSize - minFontSize;
		}
		
		changeTextOutlineColor(textState, color) {
			textState.fontOutlineColor = color;
		}
		
		resetTextColor(textState) {
			this.changeTextColor(textState, defaultFontColor);
		}
		
		resetTextOutlineColor(textState) {
			this.changeTextOutlineColor(textState, defaultFontOutlineColor);
		}
		
		changeWindowColor(color) {
			 this._balloonWindow.windowState.color = color;
		}
		
		changeWindowLineColor(color) {
			this._balloonWindow.windowState.lineColor = color;
		}
		
		changeWindowSqare() {
			this._balloonWindow.windowState.shape = windowShapeTypes.square;
		}
		
		changeWindowCircle() {
			this._balloonWindow.windowState.shape = windowShapeTypes.circle;
		}
		
		changeWindowSpike() {
			this._balloonWindow.windowState.shape = windowShapeTypes.spike;
		}
		
		changeAnchorTriangle() {
			this._balloonWindow.anchorState.shape = anchorShapeTypes.triangle;
		}
		
		changeAnchorCircle() {
			this._balloonWindow.anchorState.shape = anchorShapeTypes.circle;
		}
		
		setWindowUpper() {
			this._balloonWindow.windowState.upper = true;
		}
		
		setWindowUnder() {
			this._balloonWindow.windowState.upper = false;
		}
		
		changeTextAlignLeft() {
			this._balloonWindow.textState.align = textAlignTypes.left;
		}
		
		changeTextAlignCenter() {
			this._balloonWindow.textState.align = textAlignTypes.center;
		}
		
		changeTextAlignRight() {
			this._balloonWindow.textState.align = textAlignTypes.right;
		}
		
		setPlaySe(seName) {
			this._balloonWindow.windowState.seName = seName;
		}
		
		setSeVolume(seVolume) {
			this._balloonWindow.windowState.seVolume = seVolume.clamp(0, 100);
		}
		
		setSePitch(sePitch) {
			this._balloonWindow.windowState.sePitch = sePitch.clamp(0, 100);
		}
		
		setSePan(sePan) {
			this._balloonWindow.windowState.sePan = sePan.clamp(-150, 150);
		}
		
		setInGraphics() {
			this._balloonWindow.windowState.inGraphics = true;
		}
		
		setOutGraphics() {
			this._balloonWindow.windowState.inGraphics = false;
		}
		
		setFaceName(faceName) {
			this._balloonWindow.windowState.faceName = faceName;
		}
		
		setFaceIndex(faceIndex) {
			this._balloonWindow.windowState.faceIndex = faceIndex;
		}
		
		setNameText(nameText) {
			this._balloonWindow.nameState.textState.text = nameText;
		}
		
		processNormalCharacter(textState) {
			const c = textState.text[textState.index++];
			const w = this.measureTextWidth(c, textState);
			if (!textState.forSize) {
				let addX = 0;
				addX = (textState.align === textAlignTypes.center) ? 
						Math.floor((textState.sizeWidth - textState.lineWidthArr[textState.lineIndex]) / 2) : addX;
				addX = (textState.align === textAlignTypes.right) ? textState.sizeWidth - textState.lineWidthArr[textState.lineIndex] : addX;
				let bitmap = this._mainSprite.bitmap;
				if (textState.name) {
					bitmap = this._nameSprite.bitmap;
				}
				bitmap.setFontFace(textState.fontFamily);
				bitmap.setFontSize(textState.fontSize);
				bitmap.setTextColor(textState.fontColor);
				bitmap.setTextOutlineColor(textState.fontOutlineColor);
				bitmap.drawText(c, textState.x + addX, textState.y, w * 2, textState.height);
			}
			textState.x += w;
		}	
	}
	
	//======================================================
	//Sprite_BalloonWindowAnchor
	// アンカー状態を参照してスケール・ローテーションを変化して表示
	// 
	//======================================================
	class Sprite_BalloonWindowAnchor extends Sprite {
		
		initialize() {
			super.initialize();
			this.initMembers();
		}
		
		initMembers() {
			this._gameBalloonWindows = null;
			this.anchor.x = 0.5;
			this.anchor.y = 1.0;
		}
		
		setup(balloonWindow) {
			this._balloonWindow = balloonWindow;
			const windowState = this._balloonWindow.windowState;
			const bitmap = new BalloonWindowBitmap();
			if (balloonWindow.anchorState.shape === anchorShapeTypes.circle) {
				bitmap.drawCircleAnchor(0, 0, defaultAnchorWidth, defaultAnchorHeight * defaultAnchorMultiple,
				defaultWindowLineWidth, windowState.color, windowState.lineColor);
			} else {
				bitmap.drawTriangleAnchor(0, 0, defaultAnchorWidth, defaultAnchorHeight * defaultAnchorMultiple,
				defaultWindowLineWidth, windowState.color, windowState.lineColor);
			}
			this.bitmap = bitmap;
			this.updatePosition();
		}
		
		update() {
			super.update();
			this.updateComplete();
			this.updatePosition();
		}
		
		//スプライトの自動除去
		updateComplete() {
			if (this._balloonWindow.completed()) {
				this.parent.removeChild(this);
			}
		}
		
		updatePosition() {
			const anchorState = this._balloonWindow.anchorState;
			this.x = Math.floor(anchorState.position.x);
			this.y = Math.floor(anchorState.position.y);
			const scale = anchorState.scale;
			const animationScale = anchorState.animationState.scale;
			this.scale.x = scale.x * animationScale.x;
			this.scale.y = scale.y * animationScale.y;
			this.rotation = anchorState.rotation;
		}
	}
		
	//======================================================
	//BalloonWindowBitmap
	// 描写関数を新たに定義
	// 
	//======================================================
	class BalloonWindowBitmap extends Bitmap {
		
		initialize() {
			super.initialize();	
		}
		
		scaleBlt(source, sx, sy, sw, sh, dx, dy, dw, dh) {
			if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
					sx + sw <= source.width && sy + sh <= source.height) {
				this._context.globalCompositeOperation = 'source-over';
				this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
				this._setDirty();
			}
		}
		
		setFontFace(fontFamily) {
			this.fontFace = Graphics.isFontLoaded(fontFamily) && fontFamily ? fontFamily : defaultFontFamily;
		}
		
		setFontSize(fontSize) {
			this.fontSize = fontSize ? fontSize : defaultFontSize;
		}
		
		setTextColor(color) {
			this.textColor = color ? color : defaultFontColor;
		}
		
		setTextOutlineColor(color) {
			this.outlineColor = color ? color : defaultFontOutlineColor;
		}
		
		//ウインドウ描写用追加メソッド
		drawNineSliceRect(x, y, width, height, windowState) {
			const padding = windowState.padding;
			this.resize(width + padding * 2 + windowState.lineWidth * 2, height + padding * 2 + windowState.lineWidth * 2);
			x += windowState.lineWidth;
			y += windowState.lineWidth;
			const context = this._context;
			context.save();
			context.fillStyle = windowState.color;
			context.lineWidth = windowState.lineWidth;
			context.strokeStyle = windowState.lineColor;
			context.beginPath();
			context.moveTo(x + padding, y);
			context.lineTo(x + padding, y);
			context.lineTo(x + width + padding, y);
			context.quadraticCurveTo(x + width + padding * 2, y, x + width + padding * 2, y + padding);
			context.lineTo(x + width + padding * 2, y + height + padding);
			context.quadraticCurveTo(x + width + padding * 2,  y + height + padding * 2, x + width + padding, y + height + padding * 2);
			context.lineTo(x + padding, y + height + padding * 2);
			context.quadraticCurveTo(x, y + height + padding * 2, x, y + height + padding);
			context.lineTo(x, y + padding);
			context.quadraticCurveTo(x, y, x + padding, y);
			context.stroke();
			context.fill();
			context.restore();
			this._setDirty();
		};
		
		drawSquare(x, y, width, height, windowState) {
			const padding = windowState.padding;
			this.resize(width + padding * 2 + windowState.lineWidth * 2, height + padding * 2 + windowState.lineWidth * 2);
			x += windowState.lineWidth;
			y += windowState.lineWidth;
			const context = this._context;
			context.save();
			context.fillStyle = windowState.color;
			context.lineWidth = windowState.lineWidth;
			context.strokeStyle = windowState.lineColor;
			context.beginPath();
			context.moveTo(x + padding, y);
			context.lineTo(x + padding, y);
			context.lineTo(x + width + padding, y);
			context.lineTo(x + width + padding * 2, y + padding);
			context.lineTo(x + width + padding * 2, y + height + padding);
			context.lineTo(x + width + padding, y + height + padding * 2);
			context.lineTo(x + padding, y + height + padding * 2);
			context.lineTo(x, y + height + padding);
			context.lineTo(x, y + padding);
			context.lineTo(x + padding, y);
			context.closePath();
			context.stroke();
			context.fill();
			context.restore();
			this._setDirty();
		};
		
		drawSpike(x, y, width, height, windowState) {
			const padding = windowState.padding;
			const w = width + padding * 2;
			const h = height + padding * 2;
			const spikeWidth = Math.min(width, height, padding) / 2;
			this.resize(w + windowState.lineWidth * 2, h + windowState.lineWidth * 2);
			x += windowState.lineWidth;
			y += windowState.lineWidth;
			const context = this._context;
			context.save();
			
			context.fillStyle = windowState.color;
			context.lineWidth = windowState.lineWidth;
			context.strokeStyle = windowState.lineColor;
			
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x, y);
			let nx = x + padding;
			let ny = y + padding / 2;
			let upper = false;
			while(nx < width + padding - spikeWidth) {
				nx += spikeWidth / 2 + Math.floor(Math.random() * (spikeWidth + 1));
				context.lineTo(nx, ny);
				ny = upper ? y + padding / 2 : y;
				upper = upper ? false : true; 
			}
			if (!upper) context.lineTo(nx + spikeWidth / 4, y + padding / 2);
			context.lineTo(w, y);
			
			nx = w - padding / 2;
			ny = y + padding;
			let right = false;
			while(ny < height + padding - spikeWidth) {
				ny += spikeWidth / 2 + Math.floor(Math.random() * (spikeWidth + 1));
				context.lineTo(nx, ny);
				nx = right ? w - padding / 2: w;
				right = right ? false : true;
			}
			if (!right) context.lineTo(w - padding / 2, ny + spikeWidth / 4);
			context.lineTo(w, h);
			
			nx = w - padding;
			ny = h - padding / 2;
			let bottom = false;
			while(nx > padding + spikeWidth) {
				nx -= spikeWidth / 2 + Math.floor(Math.random() * (spikeWidth + 1));
				context.lineTo(nx, ny);
				ny = bottom ? h - padding / 2 : h;
				bottom = bottom ? false : true;
			}
			if (!bottom) context.lineTo(nx - spikeWidth / 4, h - padding / 2);
			context.lineTo(x, h);
			
			nx = padding / 2;
			ny = h - padding;
			let left = false;
			while(ny > padding + spikeWidth) {
				ny -= spikeWidth / 2 + Math.floor(Math.random() * (spikeWidth + 1));
				context.lineTo(nx, ny);
				nx = left ? x + padding / 2: x;
				left = left ? false : true;
			}
			if (!left) context.lineTo(x + padding / 2, ny - spikeWidth / 4);
			context.lineTo(x, y);
			
			context.stroke();
			context.fill();
			context.restore();
			this._setDirty();
		}
		
		drawTriangleAnchor(x, y, width, height, lineWidth, color, lineColor) {
			width = width - lineWidth * 2;
			height = height - lineWidth * 2;
			this.resize(width + lineWidth * 2, height + lineWidth * 2);
			x += lineWidth;
			y += lineWidth;
			const context = this._context;
			context.save();
			context.fillStyle = color;
			context.lineWidth = lineWidth;
			context.strokeStyle = lineColor;
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x, y);
			context.lineTo(x + width, y);
			context.lineTo(x + width / 2, y + height);
			context.lineTo(x, y);
			context.stroke();
			context.fill();
			context.restore();
			this._setDirty();
		}
		
		drawCircleAnchor(x, y, width, height, lineWidth, color, lineColor) {
			width = width - lineWidth * 2;
			height = height - lineWidth * 2;
			this.resize(width + lineWidth * 2, height + lineWidth * 2);
			x += lineWidth;
			y += lineWidth;
			const context = this._context;
			context.save();
			context.fillStyle = color;
			context.lineWidth = lineWidth;
			context.strokeStyle = lineColor;
			let r = Math.min(width, height) / 2;
			let rRate = 4 / 5;
			
			while (y + r < height) {
				context.beginPath();
				context.arc(x + width / 2, y + r, r, 0, Math.PI * 2, false);
				context.stroke();
				context.fill();
				y += r * 2 + lineWidth;
				r = r * rRate;
				r = r > (this.height - y) / 2 ? (this.height - y) / 2 : r;
			}
			
			context.restore();
			this._setDirty();
		}
			
	}
	
})();