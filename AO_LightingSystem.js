//=============================================================================
// AO_LightingSystem.js
//=============================================================================
// Copyright (c) 2020 AO
// This software is released under the MIT License.
//
// コードの一部はMITライセンスのプラグイン製作者様のコードを参考にしています
// I appreciate great plugin creater's work.
// This License Notice described below
// (C)2016 Triacontane
// 
/*
2020/2/8 ver 1.00 初版
2020/2/9 ver 1.01 YEP_X_AnimatedSVEnemies.js対応用スケール感知を追加
2020/2/11 ver 1.02 refreshMoldCanvas() をリファクタリングして軽量化 y座標ソート対応 ブラーパラメータの廃止
2020/2/17 ver 1.03 save時の仕様変更
2020/2/17 ver 1.031 ヘルプ記載修正
2020/2/22 ver 1.04 画面のシェイクとズームに対応
2020/2/24 ver 1.041 Sprite_Animation 内の cellSprite が正常にマネージャからリムーブされていなかった問題の修正およびLightingManagerへのレジストを見直し
2020/2/24 ver 1.042 影レイヤーの削りにノイズが描写されてしまう時があったのを修正
2020/2/29 ver 1.043 タイルセット画像を指定したキャラクターに光影削除率を設定しても正しく反映されていなかった問題の修正
2020/3/1 ver 1.044 YEP_X_AnimatedSVEnemies使用時の不具合修正、フロントビュー戦闘時の不具合修正 
2020/3/2 ver 1.045 画面シェイク時に画面両端の影レイヤ表示がずれないよう修正 
2020/3/8 ver 1.046 画像アニメーションのrow,col指定が条件によりずれる不具合を修正
2020/3/15 ver 1.047 マネージャーへのレジストをbitmapのロードに依存しないよう仕様変更
2020/4/10 ver 1.048 Battlerに付随するライトの位置が正しく表示されていなかった問題を修正。ヘルプの記載間違いを修正
2020/5/16 ver 1.049 ユーテリティ関数の不具合を修正
*/

/*:
 * @plugindesc ライティングプラグイン
 * @author AO
 *
 * @param キャラクター光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 20
 * @desc キャラクターと重なる領域の光影レイヤーの削除率(%)
 *
 * @param バトラー光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 20
 * @desc バトラーと重なる領域の光影レイヤーの削除率(%)
 *
 * @param バトラー光影除外設定
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 * @desc 全てのバトラーに光影除外を設定するか(true/false)
 *
 * @param アニメーション光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 90
 * @desc アニメーションと重なる領域の光影レイヤーの削除率(%)
 *
 * @param アニメーション光影除外設定
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 * @desc 全てのアニメーションに光影除外を設定するか(true/false)
 *
 * @param ダメージポップ光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 100
 * @desc ダメージポップと重なる領域の光影レイヤーの削除率(%)
 *
 * @param ステートアイコン光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 100
 * @desc ステートアイコンと重なる領域の光影レイヤーの削除率(%)
 *
 * @param ステートオーバーレイ光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 100
 * @desc ステートオーバーレイと重なる領域の光影レイヤーの削除率(%)
 *
 * @param サイドビュー武器光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 20
 * @desc バトラーの武器と重なる領域の光影レイヤーの削除率(%)
 *
 * @param フキダシ光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 100
 * @desc フキダシと重なる領域の光影レイヤーの削除率(%)
 *
 * @param ライトスプライト光影除外率
 * @type number
 * @min 0
 * @max 100 
 * @default 100
 * @desc 光源用スプライトと重なる領域の光影レイヤーの削除率(%)
 *
 * @param ライトスプライト不透明度反映率
 * @type number
 * @min 0
 * @max 100 
 * @default 50
 * @desc 光源用スプライトの不透明度を減少させた時に光影レイヤーの削除率を下げる割合(%)
 *
 * @param 光レイヤー成型適応
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 * @desc 光レイヤーにも影レイヤーと同様のキャラクター等による削除を適応するか(true/false)
 *
 * @param 影レイヤーブレンドモード
 * @type number
 * @min 0
 * @max 3
 * @default 2
 * @desc 影レイヤースプライトのデフォルトブレンドモード(0：通常 1：加算 2：乗算 3：スクリーン)
 *
 * @param 光レイヤーブレンドモード
 * @type number
 * @min 0
 * @max 3
 * @default 3
 * @desc 光レイヤースプライトのデフォルトブレンドモード(0：通常 1：加算 2：乗算 3：スクリーン)
 *
 * @param エネミーライト戦闘不能同期
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 * @desc エネミーバトラーが戦闘不能の時はそのライトを消去するか(true/false)
 *
 * @param キャラクター光影削除不可リージョン
 * @type number
 * @min 0
 * @max 255
 * @default 0
 * @desc キャラクターの光影削除率を自動で0にするリージョンID
 *
 * @help AO_LightingSystem.js ver1.049
 * キャラクター・イベント・アニメーション等を色調変更による塗りつぶしから
 * 除外することが可能なライティングプラグインです
 * RPGツクールMV ver1.6系にのみ対応です
 * This plugin requires RPGMakerMV ver 1.61 or higher
 *
 * プラグインパラメータで"光影除外率"を100に設定したオブジェクトは
 * このプラグインによる色調変更による塗りつぶしから除外されます
 * デフォルトのイベントコマンド"画面の色調変化"による変更からは除外されません
 * 
 * <プラグインの仕組み>
 * 光表現用スプライト(デフォルトでスクリーン合成)と
 * 影表現用スプライト(デフォルトで乗算合成)を追加します。
 * どちらのスプライトも各種スプライトと重なった部分が指定の割合で透明になります
 * 乗算の影レイヤーがスクリーンの光レイヤーより上に描写されます
 *
 * 既存のライティングプラグインと異なりライトの作製には画像を利用します
 * これにより光の形を自在に設定する事が可能です
 *
 * 画像にもともと影が描写されている場合は、画像の影部分も影レイヤーが
 * 削除されてしまいます。これは仕組み上解決できない仕様です
 * 画像から影を削除する等して対応をお願いします
 *
 * <光スプライトの仕組み>
 * 光を描写するための独自スプライトも追加されます(デフォルトで加算合成)
 * 新しくライトを描写するためにはimg/lightsフォルダに光画像(png)が必要です
 * 事前にimgフォルダ内にlightsフォルダを作製して画像(pngファイル)をおいて下さい
 * 画像のファイル名に[行x列]と記載することで
 * そのファイルを読み込んだスプライトをアニメーションさせる事が可能です
 * アニメーションは必須ではありません
 * デフォルトでは末尾までアニメーションが再生されると逆再生が始まりますが
 * 画像ファイル名に[NR]と記載すると最初のコマに戻ります
 * 例） light[3x5][NR].png
 * 逆再生ループなしで3行5列のアニメーションを持つライトのファイル名
 * 
 * <光スプライト用画像作成Tips>
 * デフォルトでは光スプライトは"加算合成"です(ライトに与えるパラメータで変更可)
 * 光スプライト用画像のアルファ値を参照して影を削る仕組みですから
 * 真っ黒な画像を用意すれば透明な光を描く事が可能です
 *
 * ========= アニメーションの光影レイヤー削除の個別設定 =========
 * 全てのアニメーションをレイヤーによる塗りつぶしから除外したくない場合は
 * プラグインパラメータのアニメーション光影除外設定をfalseにした上で
 * アニメーション名末尾に[light]と記載することで
 * アニメーション毎に除外設定を適応することが可能です
 * 除外の率に関してはプラグインパラメータの値が設定されます
 *
 * 例)"超音波"アニメーションに光影除外を設定したい場合
 * アニメーションの基本設定 名前の項目を以下のように変更
 * 超音波[Light]
 *
 * ========= メモ欄およびイベント注釈解説 =========
 * <イベントライトの設定１>
 * イベントの注釈に"<Light>ライト用各種パラメータ</Light>"を記載して下さい
 * アクティブになっているページの注釈を読み込んでライトを生成します
 * <Light>と</Light>で囲まれた部分をパラメータとして読み込みます
 * lightタグ内での改行は可能ですがパラメータは省略できません
 * ライト用各種パラメータは以下の順序で記載してください
 * <Light>
 * ファイル名(拡張子なし), アニメーションの1フレーム数, ブレンドモード(0-3), 
 * 影の削除率(%), X軸方向拡大率(%), Y軸方向拡大率(%)
 * </Light>
 * 
 * 例)ファイル名"TestLight[2x2][NR].png"を14フレームのアニメーション
 * 不透明度は130/255、拡大率は3倍で表示
 * <Light>
 * TestLight[2x2][NR],14,130,300,300
 * </Light>
 *
 * <イベントライトの設定２>
 * イベントの注釈に<LightJson>ライト用各種パラメータ(Json形式で記載)</LightJson>
 * と記載することでより柔軟なパラメータ設定が可能になります
 * <LightJson>タグ内では必要なパラメータだけ記載する事が可能です
 * 記載しなかったパラメータはデフォルト値が適応されます
 * Json形式で指定できるパラメータに関してはヘルプの末尾に記載しています
 *
 * 例)TestLight[2x2][NR].pngを14フレームのアニメーション、不透明度150
 * 拡大率5倍でイベントに表示する
 * <LightJson>
 * {"imageUrl":"TestLight[2x2][NR]", 
 * "animationWait": 14, 
 * "opacity":150,
 * "scale":{"x":5,"y":5}}
 * </LightJson>
 *
 * <イベント・アクターのメモ欄>
 * イベントおよびアクターのメモ欄に<shadowAlphaC>と記載することで
 * プラグインパラメータで指定した光影削除が設定されます
 * <shadowAlphaC:光影削除率(0-100)>と記載すると、そのイベントの光影削除率を
 * 設定することも可能です
 * メモ欄への記載がない場合は光影削除率0として扱われます
 *
 * 例)イベントの光影削除率を80%に設定
 * <shadowAlphaC:80>
 *
 * <アクター・エネミーのメモ欄>
 * エネミーおよびアクターのメモ欄に<shadowAlphaB>と記載することで
 * プラグインパラメータで指定した光影削除が設定されます
 * <shadowAlphaB:光影削除率(0-100)>と記載すると、そのイベントの光影削除率を
 * 設定することも可能です
 *
 * 例)エネミーの光影削除率を80%に設定
 * <shadowAlphaB:80>
 *
 * ========= プラグインパラメータ解説 =========
 * 以下のプラグインパラメータは
 * 影レイヤーおよび光レイヤーの塗りつぶしから目的のスプライトが除外される率(0-100)%です
 * 100%に設定すると塗りつぶしから完全に除外されます
 * <キャラクター光影除外率>
 * <バトラー光影除外率>
 * <アニメーション光影除外率>
 * <ダメージポップ光影除外率>
 * <ステートアイコン光影除外率>
 * <ステートオーバーレイ光影除外率>
 * <サイドビュー武器光影除外率>
 * <フキダシ光影除外率>
 * <ライトスプライト光影除外率>
 * キャラクター・イベント･フォロワー・バトラーはメモ欄に記載がある場合
 * そちらの数値が優先されます
 *
 * バトラーとアニメーションの二つのスプライトは
 * 以下のプラグインパラメータをtrueに設定することで
 * 個別に除外を設定する必要がなくなり
 * 全てのスプライトにプラグインパラメータで設定した除外率が適応されます
 * <バトラー光影除外設定>
 * <アニメーション光影除外設定>
 *
 * 光描写用のライトスプライトは光影除外率の他に
 * スプライトの不透明度により、影レイヤーをどの程度削除するかを
 * 以下のプラグインパラメータで指定可能です
 * <ライトスプライト不透明度反映率>
 * この値は<ライトスプライト光影除外率>と乗算される0-100の%です
 * 即ち<ライトスプライト光影除外率>が100でも<ライトスプライト不透明度反映率>が0の時
 * スプライトの不透明度が0であれば、光は描写されず影レイヤーは削られません
 * <ライトスプライト不透明度反映率>が50であった場合は
 * スプライトの不透明度が0であっても<ライトスプライト光影除外率>の50%で
 * 影レイヤーが切り取られることになります
 *
 * 以下ののパラメータでtrueを設定することにより
 * 光レイヤーはスプライトによる切り取りを行わないよう設定することが可能です
 * <光レイヤー成型適応>
 * trueに設定すると光レイヤーによる色調変更は
 * 光影除外設定を無視してスプライト上に描写されます
 *
 * 光レイヤーおよび影レイヤーのブレンドモードは以下のパラメータにより
 * 変更することも可能です
 * <影レイヤーブレンドモード>
 * <光レイヤーブレンドモード>
 * 影レイヤーのブレンドモードはデフォルトでは乗算
 * 光レイヤーのブレンドモードはデフォルトではスクリーンに設定されてます
 *
 * エネミーが戦闘不能のとき、エネミーに表示されたライトを消去したくない場合は
 * 以下のパラメータをfalseに設定してください
 * <エネミーライト戦闘不能同期>
 *
 * キャラクターが建物等の裏に移動した際に
 * キャラクターの光影除外設定を解除したい場合は以下のパラメータを利用してください
 * <キャラクター光影削除不可リージョン>
 * このパラメータで指定したリージョンに乗ったキャラクター・イベントは
 * 一時的に光影除外率が0になり影レイヤーで塗りつぶされます
 *
 * ========= プラグインコマンド解説 =========
 * <画面の色調変化コマンド>
 * AOLS_SHADOW_COLOR 赤 緑 青 アルファ フレーム数
 * AOLS影色セット 赤 緑 青 アルファ フレーム数
 * 影(乗算)レイヤーの色調変更
 * フレーム数かけてrgba(赤緑青アルファ値)の値を影レイヤｰに設定します
 * 赤・緑・青は0-255の整数・アルファは0-1の小数・フレーム数は0以上の整数です
 * ブレンドモードがデフォルトの場合乗算の結果画面は暗くなります
 *
 * 例)影レイヤー色をR:0,G:0,B:60,A:1へ360フレームで変更
 * AOLS_SHADOW_COLOR 0 0 60 1 360
 *
 * 光(スクリーン)レイヤーの色調変更
 * AOLS_LIGHT_COLOR 赤 緑 青 アルファ フレーム数
 * AOLS光色セット 赤 緑 青 アルファ フレーム数
 * フレーム数かけてrgba(赤緑青アルファ値)の値を光レイヤｰに設定します
 * 赤・緑・青は0-255の整数・アルファは0-1の小数・フレーム数は0以上の整数です
 * ブレンドモードがデフォルト(スクリーン)の場合、結果画面は明るくなります
 *
 * 例）光レイヤーの色をR:60,G:30,B:0,A:0.9へ360フレームで変更
 * AOLS光色セット 60 30 0 0.9 360
 *
 * <イベント・キャラクター・フォロワー･アクター・エネミーへライトを生成するコマンド>
 * AOLS_MAKE_TARGET_LIGHT ターゲット番号 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * AOLSターゲットライト作製 ターゲット番号 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * ターゲット番号で指定したキャラクター・バトラーに
 * ファイル名の画像光スプライトを生成します
 * ターゲット番号の指定は以下に従います
 * ===マップシーン===
 * フォロワー： ～ -2 プレイヤー : -1 実行中のイベント : 0 指定したIDのイベント : 1 ～
 * ===バトルシーン===
 * バトラー: ～ -1 行動中のバトラー : 0 エネミー : 1 ～
 * ファイル名はimg/lightsフォルダ内の拡張子無しpngファイル名です
 * フレームはファイル名でアニメーションさせる場合の
 * 1コマのフレーム数(0以上の整数値)です
 * 不透明度は0-255の整数値、拡大率はともに0-100の整数値です
 *
 * 例)一人目のフォロワーにlight[3x1].pngを光スプライトとして生成して1コマ8フレームで再生
 * AOLSターゲットライト作製 -2 light[3x1] 8 255 200 100
 * 例)エネミー1番にlight.pngを光スプライトとして生成(画像名アニメーション無し)
 * AOLS_MAKE_TARGET_LIGHT 1 light 1 200 150 150
 *
 * <イベント・キャラクター・フォロワー･アクター・エネミーのライトを全て消すコマンド>
 * AOLS_CLEAR_TARGET_LIGHTS ターゲット番号
 * AOLSターゲットライト消去 ターゲット番号
 *
 * <イベント・キャラクター・フォロワー･アクター・エネミーのライトを一つ消すコマンド>
 * AOLS_CLEAR_TARGET_LIGHT ターゲット番号 インデックス番号
 * AOLSターゲットライト単独消去 ターゲット番号 インデックス番号
 * インデックス番号はそのターゲットに加えた順番で0から始まります
 * マイナスの値を指定することで、末尾から数える事も可能です
 *
 * 例)実行中イベントの一番最後に加えたライトを削除
 * AOLS_CLEAR_TARGET_LIGHT 0 -1
 * 例)パーティの1番目のアクターのライトを全て削除
 * AOLSターゲットライト消去 -1
 *
 * <イベントに紐付け無しでマップにライトを生成するコマンド>
 * AOLS_MAKE_MAP_LIGHT マップx座標 マップy座標 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * AOLSマップライト作製 マップx座標 マップy座標 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * マップ座標x、マップ座標yを指定して、マップにライトを生成します
 * メニューの開閉ではライトは消えませんが、マップ移動をするとライトが消える仕様です
 *
 * 例)マップ座標8,4にlight[5x2].pngを画像としてライトを生成して14フレームで再生
 * AOLSマップライト作製 8 4 light[5x2] 14 150 120 100
 *
 * <イベントに紐付け無しでマップに生成したライトを消去するコマンド>
 * AOLS_CLEAR_MAP_LIGHTS
 * AOLSマップライト消去
 *
 * <イベントに紐付け無しでマップに生成したライトを一つ消去するコマンド>
 * AOLS_CLEAR_MAP_LIGHT インデックス番号
 * AOLSマップライト単独消去 インデックス番号
 * インデックス番号はイベントやキャラクターのライト消去と同じ仕様で、生成した順番で0から始まる整数です
 *
 * 例)最後から二番目に作製したマップライトの消去
 * AOLS_CLEAR_MAP_LIGHT -2
 *
 * <戦闘背景にライトを生成するコマンド>
 * AOLS_CREATE_BATTLEBACK_LIGHT 画面x座標 画面y座標 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * AOLSバトルバックライト作製 画面x座標 画面y座標 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * 画面上のx,y位置にファイル名のライトを生成します
 * 例)画面上320,200の位置にlight.png画像を3倍に拡大してライトとして表示
 * AOLS_CREATE_BATTLEBACK_LIGHT 320 200 light 1 255 300 300
 *
 * <戦闘背景に表示したライトを全て消すコマンド>
 * AOLS_CLEAR_BATTLEBACK_LIGHTS
 * AOLSバトルバックライト消去
 * 
 * <戦闘背景に表示したライトを一つ消すコマンド>
 * AOLS_CLEAR_BATTLEBACK_LIGHT インデックス番号
 * AOLSバトルバックライト単独消去 インデックス番号
 * インデックス番号は生成した順番で0から始まる整数です
 *
 * 例)戦闘背景に一番最初に生成したライトを消去
 * AOLS_CLEAR_BATTLEBACK_LIGHT 0
 *
 * <戦闘背景へのライト生成を予約するコマンド>
 * AOLS_RESERVE_BATTLEBACK_LIGHT 画面x座標 画面y座標 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * AOLSバトルバックライト予約 画面x座標 画面y座標 ファイル名 フレーム 不透明度 拡大率X 拡大率Y
 * コマンドに送り込む値は<戦闘背景にライトを生成するコマンド>と同じです
 * マップ画面で上記プラグインコマンドを実行しておくことで
 * 戦闘に入ると同時に予約されたライトを表示します
 * 例)画面上400,0の位置にlight[3x3][NR]png画像を3倍に拡大してライトとして予約
 * AOLSバトルバックライト予約 400 0 light[3x3][NR] 8 255 300 300
 *
 * <戦闘背景へ表示するライトの予約を全て取り消すコマンド>
 * AOLS_CLEAR_RESERVED_BATTLEBACK_LIGHTS
 * AOLSバトルバックライト予約消去
 *
 * <戦闘背景へ表示するライトの予約を一つ取り消すコマンド>
 * AOLS_CLEAR_RESERVED_BATTLEBACK_LIGHT インデックス番号
 * AOLSバトルバックライト予約単独消去 インデックス番号
 * 例)戦闘背景に最後から2番目に予約したライトの消去
 * AOLSバトルバックライト予約単独消去 -2
 *
 * ========= 上級"Json形式でのライト生成コマンド =========
 * AOLS_MAKE_TARGET_LIGHT_JSON ターゲット番号 "Json形式文字列"
 * AOLSターゲットライト作製_JSON ターゲット番号 "Json形式文字列"
 * AOLS_MAKE_MAP_LIGHT_JSON マップx座標 マップy座標 "Json形式文字列"
 * AOLSマップライト作製_JSON マップx座標 マップy座標 "Json形式文字列"
 * AOLS_CREATE_BATTLEBACK_LIGHT_JSON "Json形式文字列"
 * AOLSバトルバックライト作製_JSON "Json形式文字列"
 * AOLS_RESERVE_BATTLEBACK_LIGHT_JSON "Json形式文字列"
 * AOLSバトルバックライト予約_JSON "Json形式文字列"
 * 
 * ライト生成コマンド末尾に_JSONを記載したコマンドを実行することで
 * Json形式文字列でパラメータを指定する形式のコマンドがあります
 * Json形式文字列中に半角スペースを含んでも無視されます
 * 通常のプラグインコマンドより、多くの項目が設定でき
 * 必須項目はファイル名のみとなります
 * 敷居は高めですが、慣れるとより短いコマンドで、詳細な設定が可能です
 * Json形式で指定できるパラメータの詳細はヘルプ末尾を参照してください
 * ※戦闘背景ライトをJson形式コマンドで生成する場合は
 * 表示座標の指定をコマンドに送り込む代わりに、Json形式文字列内に
 * 以下の"position"パラメータを記載することで行いますので
 * 通常の戦闘背景ライト生成コマンドと異なる点に注意してください
 * "position":{"x":画面座標x,"y":画面座標y}
 *
 * ========= Jsonの書式チェックに利用できるサイト =========
 * https://lab.syncer.jp/Tool/JSON-Viewer/
 * ※Jsonの文字列記載は"(ダブルクオーテーション)による囲みのみです！
 *
 * ========= Json形式で指定できる光のパラメータ =========
 * ファイル名"imageUrl"以外は必須ではないので
 * 必要なパラメータのみ記載してください
 * スクリプトファイルのヘルプ記載直後にコピーペースト用のJson文字列を
 * 記載しています
 * 必要時AO_LightingSystem.jsを
 * テキストエディタで開いて、コピーペーストに利用してください
 *
 * "imageUrl":"ファイル名(拡張子無し)" 画像のファイル名(必須)
 * "animationWait":整数(0以上) アニメーションの１コマのフレーム数(デフォルト8)
 * "randomFrame":true/false ファイル名アニメーションのコマを不定期に飛ばすか
 *
 * "flick":true/false 自動フリックアニメーションの有無
 * "scaleFlick":true/false 自動フリックアニメーション中にスケールが0になる事を許可するか
 * "swing":true/false 自動スイングアニメーションの有無
 * "swingMaxScaleRate":小数(1以上) 自動スイングアニメーション中の最大スケール
 * "followDirection":true/false キャラクタの向き変更を光に反映するか
 * "screenBind":true/false 光を画面に固定するか
 *
 * "position":{"x":整数,"y":整数} 画面固定時の光位置
 * "shift":{"x":整数,"y":整数} XY方向に何ピクセルずらして表示するか
 * "blendMode":整数(0-3)	光スプライトのブレンドモード
 * "opacity":整数(0-255)	光スプライトの不透明度
 * "spriteAnchor":{"x":小数,"y":小数} 光スプライトアンカー位置(デフォルト0.5)
 * "anchor":{"x":小数,"y":小数} ターゲットとするキャラクタに対する光位置(デフォルト0.5)
 * "rotation":小数 光スプライトの回転(radian)
 * "scale":{"x":小数,"y":小数} 光スプライトのスケール(デフォルト1)
 *
 */ 
/*
コピーペースト用Json文字列
{
	"imageUrl":"light","animationWait":8,"randomFrame":false,"flick":false,"scaleFlick":false,"swing":false,"followDirection":false,"screenBind":false,
	"position":{"x":0,"y":0},"shift":{"x":0,"y":0},"blendMode":1,"opacity":255,"spriteAnchor":{"x":0.5,"y":0.5},"anchor":{"x":0.5,"y":0.5},
	"rotation":0,"scale":{"x":1.0,"y":1.0}
}
*/

var Imported = Imported || {};
Imported.AO_LightingSystem = true;

(function() {
	'use strict';
	
	const importedAnimatedSVEnemies = Imported.YEP_X_AnimatedSVEnemies;
	
	const pluginName = 'AO_LightingSystem';
	const parameters = PluginManager.parameters(pluginName);
	
	const characterAlpha = getArgNumber(parameters["キャラクター光影除外率"]) / 100;
	const battlerAlpha = getArgNumber(parameters["バトラー光影除外率"]) / 100;
	const battlerShadowAlphaAll = getArgBoolean(parameters["バトラー光影除外設定"]);
	const animationAlpha = getArgNumber(parameters["アニメーション光影除外率"]) / 100;
	const animationShadowAlphaAll = getArgBoolean(parameters["アニメーション光影除外設定"]);
	const damagePopAlpha = getArgNumber(parameters["ダメージポップ光影除外率"]) / 100;
	const stateIconAlpha = getArgNumber(parameters["ステートアイコン光影除外率"]) / 100;
	const stateOverlayAlpha = getArgNumber(parameters["ステートオーバーレイ光影除外率"]) / 100;
	const weaponAlpha = getArgNumber(parameters["サイドビュー武器光影除外率"]) / 100;
	const balloonAlpha = getArgNumber(parameters["フキダシ光影除外率"]) / 100;
	const defaultlightAlpha = getArgNumber(parameters["ライトスプライト光影除外率"]) / 100;
	//光スプライトの透明度を影を削る割合にどの程度反映させるか(0はスプライトの透明度を上げても反映されない)
	//もともと画像のアルファ値が255なら影は完全に削れるし、0に近ければほぼ削れない
	const lightAlphaOpactiyReflectRate = getArgNumber(parameters["ライトスプライト不透明度反映率"]) / 100;
	//光レイヤーも影レイヤーと同様の切り取りを適応するか
	const lightLayerCutting = getArgBoolean(parameters["光レイヤー成型適応"]);
	//0：通常 1：加算 2：乗算 3：スクリーン
	const shadowLayerBlendMode = getArgNumber(parameters["影レイヤーブレンドモード"]).clamp(0, 3);
	//0：通常 1：加算 2：乗算 3：スクリーン
	const lightLayerBlendMode = getArgNumber(parameters["光レイヤーブレンドモード"]).clamp(0, 3);
	
	const enemyUnableFightReflection = getArgBoolean(parameters["エネミーライト戦闘不能同期"]);
	
	//パラメータ削除中
	//const layeredAutoAlpha = getArgBoolean(parameters["キャラクター光影削除率自動調節"]);
	const layeredAutoAlpha = false;
	
	const assignedRegionId = getArgNumber(parameters["キャラクター光影削除不可リージョン"]).clamp(0, 255);
	
	const shadowLayerColor = [0,0,0,0];
	const lightLayerColor = [100,100,100,0];
	const lightImageDirectory = "img/lights/"
	
	//各種メタデータ用
	const shadowAlphaCharacterTag = "shadowAlphaC";
	const shadowAlphaBattlerTag = "shadowAlphaB";
	//アニメーションのシャドウアルファ判定はアニメーション名 this._animation.name.match(/\[light\]/i) で判定
	const lightCommentTag = "Light";
	//光スプライトのアニメーション指定用
	const notReverseTag = "NR";
	
	function getArgString(arg, upperFlg) {
		if (typeof arg === "string") return upperFlg ? arg.toUpperCase().replace(/^\s+|\s+$/g, '') : arg.replace(/^\s+|\s+$/g, '');
		return "";
	}
	
	//文字列配列を一つの文字列に変換する。プラグインコマンド用
	function argsToString(args) {
		let str = "";
		args.forEach((arg) => {str += arg;})
		return str;
	};

	function getArgNumber(arg) {
		return parseFloat((arg || '0').replace(/^\s+|\s+$/g,''));
	}
	
	function getArgBoolean(arg) {
		arg = typeof arg !== "boolean" ? getArgString(arg, true) : arg;
		return arg === "T" || arg === "TRUE" || arg === "ON" || arg === true;
	}
	
	//[r, g, b, a] 配列と "rgba(r, g, b, a)" 文字列の相互変換
	function convertArrayToRGBA(rgbaArr) {
		let rgbaStr = "rgba(";
		for (let i = 0; i < rgbaArr.length; i++) {
			rgbaStr += i === 3 ? String(Math.round(rgbaArr[i] * 100) / 100) : String(Math.round(rgbaArr[i]));
			rgbaStr += i === rgbaArr.length - 1 ? ')' : ',';
		}
		return rgbaStr;
	}
	
	function convertRGBAToArr(rgbaStr) {
		const rgbaStrArr = rgbaStr.match(/(\d+\.\d+)|(\d+)/g);
		const rgbaArr = [];
		for (let i = 0; i < rgbaStrArr.length; i++) {
			const num = i === 3 ? parseFloat(rgbaStrArr[i]) : parseInt(rgbaStrArr[i]);
			rgbaArr.push(num);
		}
		return rgbaArr;
	}
	
	function pixelToBlurStr(px) {
		return 'blur(' + px + 'px)'
	}
	
	function convertArgToObj(argStr) {
		return isJson(argStr) ? JsonEx.parse(argStr) : undefined;
	}
	
	function isJson(arg) {
		arg = (typeof arg === "function") ? arg() : arg;
		if (typeof arg  !== "string") {
			return false;
		}
		try {
			arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
			return true;
		} catch (e) {
			return false;
		}
	}
	
	//イベントから注釈の記載を文字列として取得
	function getComment(gameEvent) {
		const data = $dataMap.events[gameEvent.eventId()];
		let result = "";
		for (let i = 0; i < data.pages.length; i++) {
			let page = data.pages[i]
			for (let j = 0; i < page.list.length; i++) {
				let command = page.list[i];
				if (command && (command.code === 108 || command.code === 408)){
					result += command.parameters[0];
				}
			}
		}
		return result;
	}
	//イベントからアクティブなページの注釈を文字列として取得
	function getActiveComment(gameEvent) {
		const pageList = gameEvent.page() ? gameEvent.page().list : [];
		let result = "";
		for (let i = 0; i < pageList.length; i++) {
			const command = pageList[i];
			if (command && (command.code === 108 || command.code === 408)){
				result += command.parameters[0];
			}
		}
		return result;
	}
	
	function mapScreenX() {
		return $gameMap.displayX() * $gameMap.tileWidth();
	}
	
	function mapScreenY() {
		return $gameMap.displayY() * $gameMap.tileHeight();
	}
	
	//マップ座標でマップにbindする時に使おうかな
	function convertMapToScreenX(mapX) {
		const tw = $gameMap.tileWidth();
		return Math.floor($gameMap.adjustX(mapX * tw) + tw / 2);
	}
	
	function convertMapToScreenY(mapY) {
		const th = $gameMap.tileHeight();
		return Math.floor($gameMap.adjustY(mapY * th) + th / 2);
	}
	
	//引数文字列配列は imageUrl, animationWait, opacity, scaleX, scaleY で記載
	function strArrToLightData(strArr) {
		let lightData = {};
		lightData.imageUrl = getArgString(strArr[0]);
		lightData.animationWait = getArgNumber(strArr[1]);
		lightData.opacity = getArgNumber(strArr[2]);
		lightData.scale = {"x": getArgNumber(strArr[3]) / 100, "y": getArgNumber(strArr[4]) / 100};
		lightData = LightingManager.moldGameLight(lightData);
		return lightData;
	}
	
	function strJsonToLightData(strJson) {
		let lightData = isJson(strJson) ? convertArgToObj(strJson) : {};
		return LightingManager.moldGameLight(lightData);
	}
	
	//========================================================================================
	// ゲームオブジェクト捕獲用関数
	//  バトルシーンでターン終了時開始イベントだとnullが返るので注意。
	//  マップシーンではフォロワー： ～ -2 プレイヤー : -1 実行中のイベント : 0 指定したIDのイベント : 1 ～
	//  バトルシーンではバトラー: ～ -1 行動中のバトラー : 0 エネミー : 1 ～
	//  で捕獲する。
	//========================================================================================
	function getTargetGameObject(id) {
		return $gameParty.inBattle() ? getTargetGameBattler(id) : getTargetGameCharacter(id);
	};
	
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
	};
	
	function getTargetGameBattler(id) {
		if (id < 0) {
			return $gameParty.members().length > (id * -1) ? $gameParty.members()[id * -1 - 1] : $gameParty.members()[$gameParty.members().length - 1];
		} else if (id === 0){
			return BattleManager._subject;
		} else {
			return $gameTroop.members().length > id ? $gameTroop.members()[id - 1] : $gameTroop.members()[$gameTroop.members().length - 1];
		}
	};
	
	// gameLight データ用 書き換え書き足し後は LightingManager の moldGameLight も書き換えが必要
	const gameLightKeys = [
							//スプライト描写の有無, イメージアドレス, スプライトアニメーションのウエイトフレーム数, 画面固定フラグ
							"spriteDrawn", "imageUrl", "animationWait", "screenBind",
							//スプライトアニメーションのランダムフレームスキップフラグ,  シャドウレイヤーの削り用アルファ値
							"randomFrame", "shadowAlpha",
							//自動フリックアニメーションの有無, スケール変更により完全に透明になるフリックの有無, フリックの割合, フリック再生用透明度とスケール, フリック再生用ウエイトとフリック再生用最大ウエイト, フリック中フラグ
							"flick", "scaleFlick", "flickRate", "flickScaleRate", "flickOpactiyRate", "flickWait", "flickMaxWait", "flickNow",
							//自動スイングアニメーションの有無, スイングの割合, スイング再生用スケール割合と最大スケール, スイング再生用ウエイトと最大ウエイト, スイングスケール増加中フラグ
							"swing", "swingRate", "swingScaleRate", "swingMaxScaleRate", "swingWait", "swingMaxWait", "swingPositive",
							//キャラクターの方向追従フラグ,
							"followDirection",
							//描写位置, 描写位置のシフト値(x, y), ブレンドモード, 透明度, 回転, 
							//アンカー位置(x, y)(スプライトのアンカー位置を移動させるのではなく、描写位置を移動させる), スプライトのアンカーとスケール(ともにx, y), マップの描写位置記録用(x, y)
							"position", "shift", "blendMode", "opacity", "rotation", "anchor", "spriteAnchor", "scale", "mapScreen",
							//モーション用オブジェクトとモーション用ターゲットオブジェクト(下記のモーションキーを保持するオブジェクト)
							"motion", "target"
							];
	
	const motionKeys = [
						"position", "scale", "opacity", "rotation"
						];
	
	//他で弄る用
	Game_System.prototype.lightingManager = function() {
		return LightingManager;
	}
	//=====================================================================================================================
	//Game_Temp
	//  スクリプトコマンド定義
	//  他ファイルから操作する事を想定
	//=====================================================================================================================
	Game_Temp.prototype.setShadowLayerColor = function(r, g, b, a, duration) {
		LightingManager.setShadowLayerColor([r,g,b,a], duration);
	};
	
	Game_Temp.prototype.setLightLayerColor = function(r, g, b, a, duration) {
		LightingManager.setLightLayerColor([r,g,b,a], duration);
	};
	
	Game_Temp.prototype.createTargetLight = function(targetId, strArr) {
		const target = getTargetGameObject(targetId);
		if (target) {
			if (target.gameLights === undefined) {target.gameLights = [];}
			target.gameLights.push(strArrToLightData(strArr));
		}
	};
	
	Game_Temp.prototype.createTargetLightJson = function(targetId, strJson) {
		const target = getTargetGameObject(targetId);
		if (target) {
			if (target.gameLights === undefined) {target.gameLights = [];}
			target.gameLights.push(strJsonToLightData(strJson));
		}
	};
	
	Game_Temp.prototype.clearTargetLights = function(targetId) {
		const target = getTargetGameObject(targetId);
		if (target) {target.gameLights = [];}
	};
	
	Game_Temp.prototype.clearTargetLight = function(targetId, index) {
		const target = getTargetGameObject(targetId);
		if (target && target.gameLights && target.gameLights.length > index) {target.gameLights.splice(index, 1);}
	};
	
	Game_Temp.prototype.createMapLight = function(mapX, mapY, strArr) {
		const gameLight = strArrToLightData(strArr);
		gameLight.mapScreen.x = convertMapToScreenX(mapX);
		gameLight.mapScreen.y = convertMapToScreenY(mapY);
		$gameMap.gameLights.push(gameLight);
	};
	
	Game_Temp.prototype.createMapLightJson = function(mapX, mapY, strJson) {
		const gameLight = strJsonToLightData(strJson);
		gameLight.mapScreen.x = convertMapToScreenX(mapX);
		gameLight.mapScreen.y = convertMapToScreenY(mapY);
		$gameMap.gameLights.push(gameLight);
	};
	
	Game_Temp.prototype.clearMapLights = function() {
		$gameMap.clearGameLights();
	};
	
	Game_Temp.prototype.clearMapLight = function(index) {
		if ($gameMap.gameLights && $gameMap.gameLights.length > index) {$gameMap.gameLights.splice(index, 1);}
	};
	
	Game_Temp.prototype.reserveBattleBackLight = function(screenX, screenY, strArr) {
		const gameLight = strArrToLightData(strArr);
		gameLight.position.x = screenX;
		gameLight.position.y = screenY;
		gameLight.screenBind = true;
		$gameScreen.pushBattleLight(gameLight);
	};
	
	Game_Temp.prototype.reserveBattleBackLightJson = function(strJson) {
		const gameLight = strJsonToLightData(strJson);
		gameLight.screenBind = true;
		$gameScreen.pushBattleLight(gameLight);
	};
	
	Game_Temp.prototype.clearReservedBattleBackLights = function() {
		$gameScreen.clearBattleGameLights();
	};
	
	Game_Temp.prototype.clearReservedBattleBackLight = function(index) {
		$gameScreen.spliceBattleLight(index);
	};
	
	Game_Temp.prototype.createBattleBackLight = function(screenX, screenY, strArr) {
		const gameLight = strArrToLightData(strArr);
		gameLight.position.x = screenX;
		gameLight.position.y = screenY;
		gameLight.screenBind = true;
		$gameScreen.gameLights.push(gameLight);
	};
	
	Game_Temp.prototype.createBattleBackLightJson = function(strJson) {
		const gameLight = strJsonToLightData(strJson);
		gameLight.screenBind = true;
		$gameScreen.gameLights.push(gameLight);
	};
	
	Game_Temp.prototype.clearBattleBackLights = function() {
		$gameScreen.clearGameLights();
	};
	
	Game_Temp.prototype.clearBattleBackLight = function(index) {
		if ($gameScreen.gameLights && $gameScreen.gameLights.length > index) {$gameScreen.gameLights.splice(index, 1);}
	};
	
	
	//=====================================================================================================================
	//Game_Interpreter
	//  プラグインコマンド定義
	//  
	//=====================================================================================================================
	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		this.pluginCommandLightingSystem(command, args);
	};
	
	const metaTagPrefix = "AOLS";
	const pluginCommandMap = new Map();
	function setPluginCommand(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
	};
	
	setPluginCommand("_SHADOW_COLOR", "setShadowLayerColor");
	setPluginCommand("影色セット", "setShadowLayerColor");
	setPluginCommand("_LIGHT_COLOR", "setLightLayerColor");
	setPluginCommand("光色セット", "setLightLayerColor");
	setPluginCommand("_MAKE_TARGET_LIGHT", "createTargetLight");
	setPluginCommand("ターゲットライト作製", "createTargetLight");
	setPluginCommand("_CLEAR_TARGET_LIGHTS", "clearTargetLights");
	setPluginCommand("ターゲットライト消去", "clearTargetLights");
	setPluginCommand("_CLEAR_TARGET_LIGHT", "clearTargetLight");
	setPluginCommand("ターゲットライト単独消去", "clearTargetLight");
	setPluginCommand("_MAKE_MAP_LIGHT", "createMapLight");
	setPluginCommand("マップライト作製", "createMapLight");
	setPluginCommand("_CLEAR_MAP_LIGHTS", "clearMapLights");
	setPluginCommand("マップライト消去", "clearMapLights");
	setPluginCommand("_CLEAR_MAP_LIGHT", "clearMapLight");
	setPluginCommand("マップライト単独消去", "clearMapLight");
	setPluginCommand("_RESERVE_BATTLEBACK_LIGHT", "reserveBattleBackLight");
	setPluginCommand("バトルバックライト予約", "reserveBattleBackLight");
	setPluginCommand("_CLEAR_RESERVED_BATTLEBACK_LIGHTS", "clearReservedBattleBackLights");
	setPluginCommand("バトルバックライト予約消去", "clearReservedBattleBackLights");
	setPluginCommand("_CLEAR_RESERVED_BATTLEBACK_LIGHT", "clearReservedBattleBackLight");
	setPluginCommand("バトルバックライト予約単独消去", "clearReservedBattleBackLight");
	setPluginCommand("_CREATE_BATTLEBACK_LIGHT", "createBattleBackLight");
	setPluginCommand("バトルバックライト作製", "createBattleBackLight");
	setPluginCommand("_CLEAR_BATTLEBACK_LIGHTS", "clearBattleBackLights");
	setPluginCommand("バトルバックライト消去", "clearBattleBackLights");
	setPluginCommand("_CLEAR_BATTLEBACK_LIGHT", "clearBattleBackLight");
	setPluginCommand("バトルバックライト単独消去", "clearBattleBackLight");
	
	setPluginCommand("_MAKE_TARGET_LIGHT_JSON", "createTargetLightJson");
	setPluginCommand("ターゲットライト作製_JSON", "createTargetLightJson");
	setPluginCommand("_MAKE_MAP_LIGHT_JSON", "createMapLightJson");
	setPluginCommand("マップライト作製_JSON", "createMapLightJson");
	setPluginCommand("_RESERVE_BATTLEBACK_LIGHT_JSON", "reserveBattleBackLightJson");
	setPluginCommand("バトルバックライト予約_JSON", "reserveBattleBackLightJson");
	setPluginCommand("_CREATE_BATTLEBACK_LIGHT_JSON", "createBattleBackLightJson");
	setPluginCommand("バトルバックライト作製_JSON", "createBattleBackLightJson");
	
	Game_Interpreter.prototype.pluginCommandLightingSystem = function(command, args) {
		const pluginCommandMethod = pluginCommandMap.get(getArgString(command, true));
		switch (pluginCommandMethod) {
			case "setShadowLayerColor":
			case "setLightLayerColor":
				args = args.map((arg) => {return getArgNumber(arg);});
				$gameTemp[pluginCommandMethod](args[0], args[1], args[2], args[3], args[4]);
				break;
			case "createTargetLight":
				$gameTemp.createTargetLight(getArgNumber(args[0]), args.slice(1));
				break;
			case "createTargetLightJson":
				$gameTemp.createTargetLightJson(getArgNumber(args[0]), argsToString(args.slice(1)));
				break;
			case "clearTargetLights":
				$gameTemp.clearTargetLights(getArgNumber(args[0]));
				break;
			case "clearTargetLight":
				$gameTemp.clearTargetLight(getArgNumber(args[0]), getArgNumber(args[1]));
				break;
			case "createMapLight":
				$gameTemp.createMapLight(getArgNumber(args[0]), getArgNumber(args[1]), args.slice(2));
				break;
			case "createMapLightJson":
				$gameTemp.createMapLightJson(getArgNumber(args[0]), getArgNumber(args[1]), argsToString(args.slice(2)));
				break;
			case "clearMapLights":
				$gameTemp.clearMapLights();
				break;
			case "clearMapLight":
				$gameTemp.clearMapLights(getArgNumber(args[0]));
				break;
			case "reserveBattleBackLight":
				$gameTemp.reserveBattleBackLight(getArgNumber(args[0]), getArgNumber(args[1]), args.slice(2));
				break;
			case "reserveBattleBackLightJson":
				$gameTemp.reserveBattleBackLightJson(argsToString(args));
				break;
			case "clearReservedBattleBackLights":
				$gameTemp.clearReservedBattleBackLights();
				break;
			case "clearReservedBattleBackLight":
				$gameTemp.clearReservedBattleBackLight(getArgNumber(args[0]));
				break;
			case "createBattleBackLight":
				$gameTemp.createBattleBackLight(getArgNumber(args[0]), getArgNumber(args[1]), args.slice(2));
				break;
			case "createBattleBackLightJson":
				$gameTemp.createBattleBackLightJson(argsToString(args));
				break;
			case "clearBattleBackLights":
				$gameTemp.clearBattleBackLights();;
				break;
			case "clearBattleBackLight":
				$gameTemp.clearBattleBackLight(getArgNumber(args[0]));
				break;
		}
	};
	//=====================================================================================================================
	//LightingManager
	//  影描写用レイヤースプライトの管理および LightSource インスタンスの管理
	//  バックグラウンドスプライトの描写および LightSource データの描写
	//  Game_Light オブジェクトの成型
	//=====================================================================================================================
	class LightingManager {
		constructor() {		
		}
		
		static initMembers() {
			if (this._shadowLayerColor === undefined) {
				if ($gameScreen.shadowLayerColor()) {this._shadowLayerColor = $gameScreen.shadowLayerColor();}
				else {this._shadowLayerColor = shadowLayerColor;}
			}
			if (this._shadowLayerBlendMode === undefined) {this._shadowLayerBlendMode = shadowLayerBlendMode;}
			if (this._shadowDuration === undefined) {this._shadowDuration = 0;}
			if (this._shadowLayerTargetColor === undefined) {this._shadowLayerTargetColor = this._shadowLayerColor;}
			
			if (this._lightLayerColor === undefined) {
				if ($gameScreen.lightLayerColor()) {this._lightLayerColor = $gameScreen.lightLayerColor();}
				else {this._lightLayerColor = lightLayerColor;}
			}
			if (this._lightLayerBlendMode === undefined) {this._lightLayerBlendMode = lightLayerBlendMode;}
			if (this._lightDuration === undefined) {this._lightDuration = 0;}
			if (this._lightLayerTargetColor === undefined) {this._lightLayerTargetColor = this._lightLayerColor;}
			if (this._layerUpdateSkipDuration === undefined) {this._layerUpdateSkipDuration = 3;}
			//影レイヤーおよび光レイヤー成型用のキャンバスを生成
			if (this._moldCanvas === undefined) {
				this._moldCanvas = document.createElement('canvas');
				this._moldCanvas.width = Graphics.width;
				this._moldCanvas.height = Graphics.height;
			}
			
			if (this._lightLayerCutting === undefined) {this._lightLayerCutting = lightLayerCutting;}
			if (this.enemyUnableFightReflection === undefined) {this.enemyUnableFightReflection = enemyUnableFightReflection;}
			if (this.layeredAutoAlpha === undefined) {this.layeredAutoAlpha = layeredAutoAlpha;}
		}
		
		static registLightingLayer(shadowLayer, lightLayer) {
			this.initMembers();
			this._shadowLayer = shadowLayer;
			this._lightLayer = lightLayer;
			this._lightSprites = [];
			this.setShadowLayerColor(this._shadowLayerTargetColor, 0);
			this.setLightLayerColor(this._lightLayerTargetColor, 0);

		}
		
		static setShadowLayerColor(rgbaArr, duration) {
			this._shadowLayerTargetColor = rgbaArr.clone();
			this._shadowDuration = duration > 0 ? duration : 0;
			if (this._shadowDuration === 0) {
				this._shadowLayerColor = this._shadowLayerTargetColor.clone();
			}
		}
		
		static setLightLayerColor(rgbaArr, duration) {
			this._lightLayerTargetColor = rgbaArr.clone();
			this._lightDuration = duration > 0 ? duration : 0;
			if (this._lightDuration === 0) {
				this._lightLayerColor = this._lightLayerTargetColor.clone();
			}
		}
		
		static clearLightSource() {
			this._lightSourceList = [];
		}
		
		static registSprite(sprite, alpha) {
			if (!this._lightSourceList) {this.clearLightSource();}
			const bitmap = sprite.bitmap;
			if (bitmap) {
				let inculde = false;
				for (let i = 0; i < this._lightSourceList.length; i++) {
					if (sprite === this._lightSourceList[i]._targetSprite) {
						inculde = true;
						return;
					}
				}
				const lightSource = new LightSource(sprite);
					alpha = alpha ? alpha : 0;
					lightSource.setAlpha(alpha);
					this._lightSourceList.push(lightSource);
			}
		}
		
		static removeSprite(sprite) {
			if (!this._lightSourceList) return;
			this._lightSourceList = this._lightSourceList.filter((lightSource) => {
				return lightSource._targetSprite !== sprite;
			});
		}
		
		static update() {
			this.refreshLightSprites();
			this.updateGameObjectSet();
			//アルファ値を変化させるアップデートがあったら･･･どうなるだろう・・・？
			this.updateLightSourceList();
			//現在はリフレッシュ内でライトソースをソート中
			this.refreshLightSourceList();
			
			
			this.updateColor();
			this.refreshMoldCanvas();
			this.refreshShadowLayer();
			this.refreshLightLayer();
			
			this.updateLightingLayersPosition();
		}
		
		static updateLightingLayersPosition() {
			const screenShake = $gameScreen.shake();
			this._lightLayer.x = - screenShake;
			this._shadowLayer.x = - screenShake;
		}
		
		static updateColor() {
			this.updateShadowLayerColor();
			this.updateLightLayerColor();
		}
		
		static updateShadowLayerColor() {
			if (this._shadowDuration > 0) {
				if (this._shadowDuration < this._layerUpdateSkipDuration) {
					this._shadowLayerColor = this._shadowLayerTargetColor.clone();
				} else if (this._shadowDuration % this._layerUpdateSkipDuration === 0) {
					const d = this._shadowDuration;
					for (let i = 0; i < 4; i++){
						this._shadowLayerColor[i] = (this._shadowLayerColor[i] * (d - 1) + this._shadowLayerTargetColor[i]) / d
					}
				}
				this._shadowDuration--;
			}
		}
		
		static updateLightLayerColor() {
			if (this._lightDuration > 0) {
				if (this._lightDuration < this._layerUpdateSkipDuration) {
					this._lightLayerColor = this._lightLayerTargetColor.clone();
				} else if (this._lightDuration % this._layerUpdateSkipDuration === 0) {
					const d = this._lightDuration;
					for (let i = 0; i < 4; i++){
						this._lightLayerColor[i] = (this._lightLayerColor[i] * (d - 1) + this._lightLayerTargetColor[i]) / d
					}
				}
				this._lightDuration--;
			}
		}
		
		static refreshLightSourceList() {
			if (!this._lightSourceList) return;
			
			//アクティブでないライトソースを除去
			this._lightSourceList = this._lightSourceList.filter((lightSource) => {
				return lightSource.active();
			});

			//マップ上のソートと同様のY位置ソート 優先度z>y>id
			this._lightSourceList.sort((sourceA, sourceB) => {
				const az = sourceA.screenZ();
				const bz = sourceB.screenZ();
				if (az !== bz) {return az - bz;}
				const ay = sourceA.sortedScreenY();
				const by = sourceB.sortedScreenY();
				if (ay !== by) {return ay - by;}
				else return sourceA.spriteId() - sourceB.spriteId();
			});
		}
		
		
		static updateLightSourceList() {
			if (!this._lightSourceList) return;
			this._lightSourceList.forEach((lightSource) => {
				lightSource.update();
			})
		}
		
		//塗りつぶし除外クラス( LightSource )からcanvasを抜き出して専用canvasに描写
		static refreshMoldCanvas() {
			const width = Graphics.width;
			const height = Graphics.height;
			const context = this._moldCanvas.getContext('2d');
			
			context.save();
			context.globalCompositeOperation = "source-over";
			context.clearRect(0,0, width, height);
			context.fillRect(0, 0, width, height);
			context.restore();
			
			if (this._lightSourceList) {
				for (let i = 0; i < this._lightSourceList.length; i++) {
					const lightSource = this._lightSourceList[i];
					this.drawLightSourceImage(context, lightSource);
				}
			}
		}
		
		//回転とスケールに対応させるため、一度中心をアンカー位置に移動させて描写。スケールがマイナスの時は描写コンテキストを反転
		static drawLightSourceImage(context, lightSource) {
			if (!lightSource.visible()) return;
			context.save();
			
			context.translate(Math.floor(lightSource.screenX()), Math.floor(lightSource.screenY()));
			context.rotate(lightSource.rotation());
			
			if (lightSource.invertX()) {context.transform(-1, 0, 0, 1, 0, 0);}
			if (lightSource.invertY()) {context.transform(1, 0, 0, -1, 0, 0);}
			
			const sx = lightSource.dirtyX();
			const sy = lightSource.dirtyY();
			const sw = lightSource.dirtyWidth();
			const sh = lightSource.dirtyHeight();
			//ズーム対応にはdx,dy,dw,dhの独自補正が必要か?いやsorcepositonだけでいけるはず
			const dx = - lightSource.anchorPositionX();
			const dy = - lightSource.anchorPositionY();
			const dw = lightSource.scaledWidth();
			const dh = lightSource.scaledHeight();
			
			if (lightSource.notOverlay()) {
				//キャラクター等Y位置を考慮する場合は、一度完全に塗りつぶしてから消す
				context.globalCompositeOperation = "source-over";
				context.globalAlpha = 1
				context.drawImage(lightSource.canvas(), sx, sy, sw, sh, dx, dy, dw, dh);
				context.globalCompositeOperation = "destination-out";
				context.globalAlpha = lightSource.alpha();
				context.drawImage(lightSource.canvas(), sx, sy, sw, sh, dx, dy, dw, dh);
			} else {
				context.globalAlpha = lightSource.alpha();
				context.globalCompositeOperation = "destination-out";
				context.drawImage(lightSource.canvas(), sx, sy, sw, sh, dx, dy, dw, dh);
			}
			
			context.restore();
		}
		
		static refreshShadowLayer() {
			if (!this._shadowLayer) return;
			this.drawShadowLayer();
			this.cutShadowLayer();
			this._shadowLayer.bitmap._setDirty();
		}
		
		//塗りつぶし処理
		static drawShadowLayer() {
			const width = Graphics.width;
			const height = Graphics.height;
			const context = this._shadowLayer.bitmap._context;
			
			context.save();
			context.clearRect(0,0, width, height);
			context.globalCompositeOperation = "source-over";
			context.fillStyle = convertArrayToRGBA(this._shadowLayerColor);
			context.fillRect(0, 0, width, height);
			context.restore();
		};
		
		static cutShadowLayer() {
			const context = this._shadowLayer.bitmap._context;
			context.save();
			context.globalCompositeOperation = "destination-in";
			context.drawImage(this._moldCanvas, 0, 0);
			context.restore();
		}
		
		static refreshLightLayer() {
			if (!this._lightLayer) return;
			this.drawLightLayer();
			this.cutLightLayer();
			this._lightLayer.bitmap._setDirty();
		};
		
		static drawLightLayer() {
			const width = Graphics.width;
			const height = Graphics.height;
			const context = this._lightLayer.bitmap._context;
			context.save();
			context.clearRect(0,0, width, height);
			context.globalCompositeOperation = "source-over";
			context.fillStyle = convertArrayToRGBA(this._lightLayerColor);
			context.fillRect(0, 0, width, height);
			context.restore();
		}
		
		static cutLightLayer() {
			if (!this._lightLayerCutting) return;
			const context = this._lightLayer.bitmap._context;
			context.save();
			context.globalCompositeOperation = "destination-in";
			context.drawImage(this._moldCanvas, 0, 0);
			context.restore();
		}
		
		//スプライト位置取得用のゲームオブジェクトとスプライトのセット配列
		static clearGameObjectSets() {
			this._gameObjectSets = [];
		}
		
		//ゲームオブジェクトと描写スプライトのセットを登録してライトを生成する
		static registGameObjectSet(gameObject, sprite) {
			if (!this._gameObjectSets) {this.clearGameObjectSets();}
			//登録前に描写情報のリセット
			if (gameObject.gameLights) {gameObject.gameLights.forEach((gameLight) => {gameLight.spriteDrawn = false;})}
			this._gameObjectSets = this._gameObjectSets.filter((gameObjectSet) => {
				return gameObjectSet[0] !== gameObject;
			});
			this._gameObjectSets.push([gameObject, sprite]);
		}
		
		static updateGameObjectSet() {
			if (!this._gameObjectSets) return;
			this._gameObjectSets.forEach(function(gameObjectSet) {
				this.updateGameObjectLight(gameObjectSet);
			}.bind(this));
		}
		
		static updateGameObjectLight(gameObjectSet) {
			const gameObject = gameObjectSet[0];
			const gameSprite = gameObjectSet[1];
			if (!gameObject.gameLights) return;
			gameObject.gameLights.forEach(function(gameLight) {
				//アップデート本体はここ
				this.updateGameLightPosition(gameSprite, gameLight);
				this.updateGameLightAnimation(gameLight);
				this.updateGameLightFollowDirection(gameObject, gameLight);
				if (gameLight.spriteDrawn === false) {
					this.createLightSprite(gameLight);
					gameLight.spriteDrawn = true;
				}
			}.bind(this));
		}
		
		static createLightSprite(gameLight) {
			const spriteLight = new Sprite_Light();
			spriteLight.setup(gameLight.imageUrl, gameLight.animationWait);
			spriteLight.setTarget(gameLight);
			this._lightSprites.push(spriteLight);
			this._shadowLayer.addChild(spriteLight);
			spriteLight.bitmap.addLoadListener(function() {
				this.registSprite(spriteLight, gameLight.shadowAlpha);
			}.bind(this));
		};
		
		//これをかかなきゃダメになったのは設計ミスかな･･･ゲームオブジェクト側が対象のライトデータを持たなくなったらスプライトを消す処理。visible = false になると光源リストのリフレッシュでリストから除去
		static refreshLightSprites() {
			const gameLights = [];
			for (let i = 0; i < this._gameObjectSets.length; i++) {
				const gameObject = this._gameObjectSets[i][0];
				if (gameObject.gameLights && gameObject.gameLights.length > 0) {
					 Array.prototype.push.apply(gameLights, gameObject.gameLights);
				}
			}
			this._lightSprites.forEach(function(lightSprite) {
				if (!gameLights.includes(lightSprite._target)) {lightSprite.visible = false;}
			});
		};
		
		//screenBind の時は何もしない 対をなすスプライトが登録されていない時はマップにバインド それ以外はスプライト位置参照 アンカー位置はゲームライト参照(アンカーの定義が異なる)
		static updateGameLightPosition(gameSprite, gameLight) {
			if (gameLight.screenBind) return;
			if (!gameSprite) {
				gameLight.position.x = gameLight.mapScreen.x - mapScreenX();
				gameLight.position.y = gameLight.mapScreen.y - mapScreenY();
			} else {
				const frameWidth = gameSprite._realFrame.width ? gameSprite._realFrame.width : $gameMap.tileWidth();
				const frameHeight = gameSprite._realFrame.height ? gameSprite._realFrame.height : $gameMap.tileHeight();
				let spriteX = gameSprite.x;
				let spriteY = gameSprite.y;
				if (gameSprite.parent instanceof Sprite_Battler) {
					spriteX += gameSprite.parent.x;
					spriteY += gameSprite.parent.y;
				}
				gameLight.position.x = spriteX + $gameScreen.shake() / 2 - (frameWidth * gameSprite.scale.x) * (gameSprite.anchor.x - gameLight.anchor.x);
				gameLight.position.y = spriteY - (frameHeight * gameSprite.scale.y) * (gameSprite.anchor.y - gameLight.anchor.y);
			}	
		}
		
		//自動アニメーションのアップデート。ひどく適当
		static updateGameLightAnimation(gameLight) {
			if (gameLight.flick) {
				if (gameLight.flickWait <= 0) {
					const randomRate = Math.random();
					if (gameLight.flickNow && randomRate * 2 >= gameLight.flickRate) {
						if (gameLight.flickScaleRate === 0) {gameLight.flickScaleRate = 1;}
						else {gameLight.flickOpactiyRate = 1;}
					} else if (randomRate < gameLight.flickRate) {
						if (gameLight.scaleFlick && randomRate < gameLight.flickRate / 5) {gameLight.flickScaleRate = 0;}
						else {gameLight.flickOpactiyRate = 0.5;}
						gameLight.flickNow = true;
					}
					gameLight.flickWait = gameLight.flickMaxWait;
				}
				gameLight.flickWait--;
			}
			if (gameLight.swing) {
				if (gameLight.swingWait <= 0) {
					if (Math.random() < 0.5) {
						gameLight.swingScaleRate += gameLight.swingPositive ? (gameLight.swingMaxScaleRate - 1) / 5 : - (gameLight.swingMaxScaleRate - 1) / 5;
						if (gameLight.swingScaleRate < 1 - (gameLight.swingMaxScaleRate - 1)) gameLight.swingPositive = true;
						if (gameLight.swingScaleRate > gameLight.swingMaxScaleRate) gameLight.swingPositive = false;
					}
					gameLight.swingWait = gameLight.swingMaxWait;
				}
				gameLight.swingWait--;
			}
		}
		
		//キャラクター方向追従アップデート アンカーYの位置が0.5以上と以下で処理を分けてる
		static updateGameLightFollowDirection(gameObject, gameLight) {
			if (!gameLight.followDirection) return;
			if (!gameObject instanceof Game_CharacterBase) return;
			let direction = 0;
			//上は自作プラグイン用です
			if (gameObject._imageDirection !== undefined) {
				direction = gameObject._imageDirection;
			} else if (gameObject._direction !== undefined) {
				direction = gameObject._direction;
			}
			//キャラクターのデフォルト方向にあわせて下向きを0としてます
			const anchorY = gameLight.spriteAnchor.y;
			let degree = 0;
			switch (direction) {
				case 1:
					degree = anchorY <= 0.5 ? 45 : 315;
					break;
				case 2:
					degree = anchorY <= 0.5 ? 0 : 180;
					break;
				case 3:
					degree = anchorY <= 0.5 ? 315 : 45;
					break;
				case 4:
					degree = anchorY <= 0.5 ? 90 : 270;
					break;
				case 6:
					degree = anchorY <= 0.5 ? 270 : 90;
					break;
				case 7:
					degree = anchorY <= 0.5 ? 225 : 135;
					break;
				case 8:
					degree = anchorY <= 0.5 ? 180 : 0;
					break;
				case 9:
					degree = anchorY <= 0.5 ? 135 : 225;
					break;
			}
			gameLight.rotation = degree * Math.PI / 180;
		};
		
		//スプライト位置取得。アンカー位置の指定がなかればスプライトの中央を取得する。メソットじゃなくオブジェクトにステータスとして位置を持たせるほうがいいかな？←上はそうした！ここは現在未使用のはず
		static getGameObjectScreenPosition(gameObject, anchorX, anchorY) {
			if (anchorX === undefined) anchorX = 0.5;
			if (anchorY === undefined) anchorY = 0.5;
			const sprite = this.getGameObjectSprite(gameObject);
			const point = new Point(0, 0);
			if (sprite) {
				point.x = sprite.getGlobalPosition().x - (sprite._realFrame.width * sprite.scale.x) * (sprite.anchor.x - anchorX);
				point.y = sprite.getGlobalPosition().y - (sprite._realFrame.height * sprite.scale.y) * (sprite.anchor.y - anchorY);
			}
			return point;
		}
		
		//スプライト取得関数。現在未使用
		static getGameObjectSprite(gameObject) {
			if (!this._gameObjectSets) return;
			for (let i = 0; i < this._gameObjectSets.length; i++) {
				if (this._gameObjectSets[i][0] === gameObject) return this._gameObjectSets[i][1];
			}
		}
		
		//ゲームライトオブジェクト成型
		static moldGameLight(gameLight) {
			gameLightKeys.forEach(function(key) {
				let value = gameLight[key];
				switch (key) {
					case "spriteDrawn":
					case "flickNow":
						value = false;
						break;
					case "screenBind":
					case "followDirection":
					case "flick":
					case "scaleFlick":
					case "swing":
					case "swingPositive":
						value = Boolean(value);
						break;
					case "randomFrame":
						value = typeof value === "boolean" ? value : true;
					case "imageUrl":
						value = value ? value : "";
						break;
					case "animationWait":
					case "flickMaxWait":
					case "swingMaxWait":
						value = Number.isInteger(value) && value > 0 ? value : 8;
						break;
					case "shadowAlpha":
						value = Number.isFinite(value) ? value : defaultlightAlpha;
						break;
					case "flickRate":
						value = Number.isFinite(value) ? value : 0.1;
						break;
					case "flickScaleRate":
					case "flickOpactiyRate":
					case "swingScaleRate":
						value = Number.isFinite(value) ? value : 1;
						break;
					case "swingRate":
						value = Number.isFinite(value) ? value : 0.1;
						break;
					case "position":
					case "shift":
						value = value === undefined || value.x === undefined || value.y === undefined ? {"x":0, "y":0} : value;
						break;
					case "blendMode":
						value = Number.isInteger(value) ? value : 1;
						break;
					case "anchor":
					case "spriteAnchor":
						value = value === undefined || value.x === undefined || value.y === undefined ? {"x":0.5, "y":0.5} : value;
						break;
					case "scale":
						value = value === undefined || value.x === undefined || value.y === undefined ? {"x":1, "y":1} : value;
						break;
					case "opacity":
						value = Number.isInteger(value) ? value : 255;
						break;
					case "rotation":
					case "flickWait":
					case "swingWait":
						value = Number.isFinite(value) ? value : 0;
						break;
					case "swingMaxScaleRate":
						value = Number.isInteger(value) ? value : 1.05;
						break;
					case "motion":
					case "target":
						value = this.moldMotion(gameLight[key]);
						break;
					case "mapScreen":
						value = {"x": mapScreenX(), "y": mapScreenY()};
				}
				gameLight[key] = value;
			}.bind(this));
			return gameLight;
		}
		
		//位置情報オブジェクト成型なんやねんmotionって･･･
		static moldMotion(motion) {
			if (motion === undefined) motion = {};
			motionKeys.forEach(function(key) {
				let value = motion[key] ? motion[key] : undefined;
				switch (key) {
					case "position":
						value = value === undefined || value.x === undefined || value.y === undefined ? {"x":0, "y":0} : value;
						break;
					case "scale":
						value = value === undefined || value.x === undefined || value.y === undefined ? {"x":1, "y":1} : value;
						break;
					case "opacity":
						value = Number.isInteger(value) ? value : 255;
						break;
					case "rotation":
						value = Number.isFinite(value) ? value : 0;
						break;
				}
				motion[key] = value;
			});
			return motion;
		}
		
		static onBeforeSave() {
			$gameScreen.setLightingColors(this._shadowLayerTargetColor, this._lightLayerTargetColor);
		}
		
	}
	
	//=====================================================================================================================
	//LightSource
	//  光源として塗りつぶしから除外するスプライトのデータを保持
	//  スプライトの位置情報を返す関数群を持つ
	//=====================================================================================================================
	class LightSource {
		constructor(sprite) {
			this.initialize(sprite);
		}
		
		initialize(sprite) {
			this._targetSprite = sprite;
			this._bitmap = sprite.bitmap;
			this._realFrame = sprite._realFrame;
			this._alpha = 0.3;
			this.createImageData();
		}
		
		//イメージデータ作るの頑張ったのに全然つかってない！
		createImageData() {
			const bitmap = this._targetSprite.bitmap;
			if (bitmap) {
				bitmap.addLoadListener(function() {
					this._imageData = bitmap._context.getImageData(0, 0, bitmap.width, bitmap.height);
				}.bind(this));
			}
		}
		
		isMainSprite() {
			return this.parent() && this.parent() instanceof Sprite_Battler;
		}
		
		isCharacter() {
			return this._targetSprite._character && this._targetSprite._characterName.length > 0;
		}
		
		isAnimation() {
			return this.parent() instanceof Sprite_Animation;
		}
		
		isStateIcon() {
			return this._targetSprite instanceof Sprite_StateIcon;
		}
		
		isWeapon() {
			return this._targetSprite instanceof Sprite_Weapon;
		}
		
		isDamage() {
			return this.parent() instanceof Sprite_Damage;
		}
		
		isLayered() {
			const character = this._targetSprite._character ? this._targetSprite._character : null;
			return character && character.isInLayerTile(); 
		}
		
		isInAssignedRegion() {
			const character = this._targetSprite._character ? this._targetSprite._character : null;
			return character && assignedRegionId !== 0 && character.regionId() === assignedRegionId;
		};
		
		positionTargetSprite() {
			if (this.isMainSprite() || this.isAnimation() || this.isDamage() || this.isStateIcon() || this.isWeapon()) return this.parent();
			return this._targetSprite;
		}
		
		bitmap() {
			return this._bitmap;
		}
		
		canvas() {
			return this._bitmap._context.canvas;
		}
		
		parent() {
			return this._targetSprite.parent;
		}
		
		notOverlay() {
			const target = this.isMainSprite() ? this.parent() : this._targetSprite;
			if (Imported.YEP_GridFreeDoodads) return (target instanceof Sprite_Character || target instanceof Sprite_Battler || target instanceof Sprite_Doodad)
			return (target instanceof Sprite_Character || target instanceof Sprite_Battler);
		}
		
		active() {
			return this.parent() && this.bitmap();
		}
		
		update() {
			this.updateBitmap();
		}
		
		updateBitmap() {
			if (this._bitmap._url !== this._targetSprite.bitmap._url) {
				const bitmap = this._targetSprite.bitmap;
				bitmap.addLoadListener(function() {
					this._bitmap = bitmap;
				}.bind(this));
			}
		}
		
		//直接参照してるので未使用
		updateFrame() {
			if (this._targetSprite) return;
			this._realFrame = this._targetSprite._realFrame;
		}
		
		alpha() {
			if (this._targetSprite.light) return this._alpha * ((255 - (255 - this._targetSprite.opacity) * lightAlphaOpactiyReflectRate) / 255).clamp(0, 1);
			if (this.isCharacter()) {
				if (this.isInAssignedRegion()) return 0;
				if (LightingManager.layeredAutoAlpha && this.isCharacter() && this.isLayered()) return 0;
			} 
			return this._alpha * this._targetSprite.opacity / 255;
		}
		
		setAlpha(alphaRate) {
			this._alpha = alphaRate;
		}
		
		visible() {
			return this._targetSprite.visible || (this._targetSprite.visible && this._targetSprite.opacity !== 0);
		}
		
		scaleX() {
			return this.isMainSprite() ? this._targetSprite.scale.x * this.parent().scale.x : this._targetSprite.scale.x;
		}
		
		scaleY() {
			return this.isMainSprite() ? this._targetSprite.scale.y * this.parent().scale.y : this._targetSprite.scale.y;
		}
		
		invertX() {
			return this.scaleX() < 0;
		}
		
		invertY() {
			return this.scaleY() < 0;
		}
		
		screenX() {
			const target = this.positionTargetSprite();
			if (this.isAnimation() || this.isDamage() || this.isStateIcon() || this.isWeapon()) return target.x + this._targetSprite.x + $gameScreen.shake();
			return target.x + $gameScreen.shake();
		}
		
		screenY() {
			const target = this.positionTargetSprite();
			if (this.isAnimation() || this.isDamage() || this.isStateIcon() || this.isWeapon()) return target.y + this._targetSprite.y;
			return target.y;
		}
		
		//zがundefinedのスプライトでもソート用に値を返す
		screenZ() {
			return  this._targetSprite.z !== undefined ? this._targetSprite.z : this.notOverlay() ? 3 : 8;
		}
		
		//LightingManager._lightSourceListのsort()用。z座標設定と併せて画面高さを足す事で上側に描写している(いらんかも)
		sortedScreenY() {
			const sprite = this._targetSprite;
			const globalY = sprite.getGlobalPosition().y;
			return sprite.light ? globalY + Graphics.height * 2 : this.notOverlay() ? globalY : globalY + Graphics.height;
		}
		
		spriteId() {
			return this._targetSprite.spriteId;
		}
		
		anchorPositionX() {
			return Math.floor(this.scaledWidth() * this._targetSprite.anchor.x);
		}
		
		anchorPositionY() {
			return Math.floor(this.scaledHeight() * this._targetSprite.anchor.y);
		}
		
		
		globalPosition() {
			return this._targetSprite.getGlobalPosition();
		}
		
		rotation() {
			return this._targetSprite.rotation;
		}
		
		dirtyX() {
			return this._realFrame.left;
		}
		
		dirtyY() {
			return this._realFrame.top;
		}
		
		dirtyWidth() {
			return this._realFrame.width;
		}
		
		dirtyHeight() {
			return this._realFrame.height;
		}
		
		scaledWidth() {
			return Math.abs(Math.floor(this.dirtyWidth() * this.scaleX()));
		}
		
		scaledHeight() {
			return Math.abs(Math.floor(this.dirtyHeight() * this.scaleY()));
		}
		
	}
	
	//=====================================================================================================================
	//Spriteset_Base
	//  ライティング用スプライトの作成とアップデート
	//  マップ画面時のゲームマップおよびバトル画面時のゲームスクリーン登録ライトマネージャのアップデートもここ
	//=====================================================================================================================
	//レイヤー作製と addChild が離れてる意味はたぶんない
	const _Spriteset_Base_createLowerLayer = Spriteset_Base.prototype.createLowerLayer;
	Spriteset_Base.prototype.createLowerLayer = function() {
		$gameScreen.clearGameLights();
		this.createLightingLayer();
		_Spriteset_Base_createLowerLayer.apply(this, arguments);
		this.addLightingLayers();
	};
	
	const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
	Spriteset_Map.prototype.createLowerLayer = function() {
		_Spriteset_Map_createLowerLayer.apply(this, arguments);
		LightingManager.registGameObjectSet($gameMap, null);
	};
	
	const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
	Spriteset_Battle.prototype.createLowerLayer = function() {
		_Spriteset_Battle_createLowerLayer.apply(this, arguments);
		LightingManager.registGameObjectSet($gameScreen, null);
		$gameScreen.copyBattleLights();
	};
	
	const _Spriteset_Base_update = Spriteset_Base.prototype.update;
	Spriteset_Base.prototype.update = function() {
		_Spriteset_Base_update.apply(this, arguments);
		LightingManager.update();
	};

	Spriteset_Base.prototype.createLightingLayer = function() {
		LightingManager.clearGameObjectSets();
		LightingManager.clearLightSource();
		const width = Graphics.width;
		const height = Graphics.height;
		let bitmap = new Bitmap();
		bitmap.resize(width, height);
		this._shadowLayer = new Sprite_Base();
		this._shadowLayer.bitmap = bitmap;
		this._shadowLayer.blendMode = shadowLayerBlendMode;
		
		bitmap = new Bitmap();
		bitmap.resize(width, height);
		this._lightLayer = new Sprite_Base();
		this._lightLayer.bitmap = bitmap;
		this._lightLayer.blendMode = lightLayerBlendMode;
		
		LightingManager.registLightingLayer(this._shadowLayer, this._lightLayer);
	};
	
	Spriteset_Base.prototype.addLightingLayers = function() {
		this.addChild(this._lightLayer);
		this.addChild(this._shadowLayer);
	};
	//=====================================================================================================================
	//Game_System
	//  セーブ前に画面塗りつぶし情報をGame_Screenにコピー
	//=====================================================================================================================
	const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
	Game_System.prototype.onBeforeSave = function() {
		_Game_System_onBeforeSave.apply(this, arguments);
		LightingManager.onBeforeSave();
	};
	//=====================================================================================================================
	//Game_Object 各種
	//  影塗りつぶしの除外率設定
	//  光データの保持
	//  Game_CharacterBaseはリージョンの判定を追加
	//=====================================================================================================================
	Game_Screen.prototype.setLightingColors = function(shadowLayerColor, lightLayerColor) {
		this._shadowLayerColor = shadowLayerColor;
		this._lightLayerColor = lightLayerColor;
	};
	
	Game_Screen.prototype.shadowLayerColor = function() {
		return this._shadowLayerColor;
	};
	
	Game_Screen.prototype.lightLayerColor = function() {
		return this._lightLayerColor;
	};
	
	Game_Screen.prototype.clearGameLights = function() {
		this.gameLights = [];
	};
	
	Game_Screen.prototype.clearBattleGameLights = function() {
		this._battleGameLights = [];
	};
	
	Game_Screen.prototype.pushBattleLight = function(gameLight) {
		if (this._battleGameLights === undefined) {this.clearBattleGameLights();}
		this._battleGameLights.push(gameLight);
	};
	
	Game_Screen.prototype.spliceBattleLight = function(index) {
		if (this._battleGameLights && this._battleGameLights.length > index) {
			this._battleGameLights.splice(index, 1);
		}
	};
	
	Game_Screen.prototype.copyBattleLights = function() {
		if (this._battleGameLights) {
			this._battleGameLights.forEach((gameLight) => {
				gameLight.spriteDrawn = false;
			});
			this.gameLights = this._battleGameLights.slice();
		}
	};
	
	const _Game_Map_setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function(mapId) {
		_Game_Map_setup.apply(this, arguments);
		this.clearGameLights();
	};
	
	Game_Map.prototype.clearGameLights = function() {
		this.gameLights = [];
	};
	
	Game_CharacterBase.prototype.clearGameLights = function() {
		this.gameLights = [];
	};
	
	//シャドウアルファ用メタデータ取得
	Game_CharacterBase.prototype.shadowAlpha = function() {
		return this._shadowAlpha;
	};
	
	//レイヤータイル上のキャラクター光影削除率を自動で設定するため
	Game_CharacterBase.prototype.isInLayerTile = function() {
		return $gameMap.tileId(this.x, this.y, 3) || $gameMap.tileId(this.x, this.y, 4) || $gameMap.tileId(this.x, this.y, 5);
	};
		
	const _Game_Player_refresh = Game_Player.prototype.refresh;
	Game_Player.prototype.refresh = function() {
		_Game_Player_refresh.apply(this, arguments);
		this.refreshShadowAlpha();
	};
	//メタデータがブーリアンならデフォルト値を設定。値を持っていたら値を設定する
	Game_Player.prototype.refreshShadowAlpha = function() {
		const meta =  $gameParty.leader() ? $dataActors[$gameParty.leader().actorId()].meta : undefined;
		const shadowAlpha = meta && meta[shadowAlphaCharacterTag] ? meta[shadowAlphaCharacterTag] : undefined;
		if (typeof shadowAlpha === "boolean") {this._shadowAlpha = shadowAlpha ? characterAlpha : 0}
		else {this._shadowAlpha = shadowAlpha && isFinite(shadowAlpha) ? (getArgNumber(meta[shadowAlphaCharacterTag]) / 100).clamp(0, 1) : 0;}
	};
	
	const _Game_Follower_refresh = Game_Follower.prototype.refresh;
	Game_Follower.prototype.refresh = function() {
		_Game_Follower_refresh.apply(this, arguments);
		this.refreshShadowAlpha();
	};
	
	Game_Follower.prototype.refreshShadowAlpha = function() {
		const meta =  this.actor() ? $dataActors[this.actor().actorId()].meta : undefined;
		const shadowAlpha = meta && meta[shadowAlphaCharacterTag] ? meta[shadowAlphaCharacterTag] : undefined;
		if (typeof shadowAlpha === "boolean") {this._shadowAlpha = shadowAlpha ? characterAlpha : 0}
		else {this._shadowAlpha = shadowAlpha && isFinite(shadowAlpha) ? (getArgNumber(meta[shadowAlphaCharacterTag]) / 100).clamp(0, 1) : 0;}
	};
	
	Game_Battler.prototype.clearGameLights = function() {
		this.gameLights = [];
	};
	
	Game_Battler.prototype.shadowAlpha = function() {
		return battlerShadowAlphaAll && !this._shadowAlpha ? battlerAlpha : this._shadowAlpha;
	};
	
	const _Game_Actor_setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId) {
		_Game_Actor_setup.apply(this, arguments);
		const meta = this.actor() ? this.actor().meta : null;
		const shadowAlpha = meta && meta[shadowAlphaBattlerTag] ? meta[shadowAlphaBattlerTag] : undefined;
		if (typeof shadowAlpha === "boolean") {this._shadowAlpha = shadowAlpha ? battlerAlpha : 0}
		else {this._shadowAlpha = shadowAlpha && isFinite(shadowAlpha) ? (getArgNumber(meta[shadowAlphaBattlerTag]) / 100).clamp(0, 1) : 0;}
	};
	
	const _Game_Enemy_setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y) {
		_Game_Enemy_setup.apply(this, arguments);
		const meta = this.enemy() ? this.enemy().meta : null;
		const shadowAlpha = meta && meta[shadowAlphaBattlerTag] ? meta[shadowAlphaBattlerTag] : undefined;
		if (typeof shadowAlpha === "boolean") {this._shadowAlpha = shadowAlpha ? battlerAlpha : 0}
		else {this._shadowAlpha = shadowAlpha && isFinite(shadowAlpha) ? (getArgNumber(meta[shadowAlphaBattlerTag]) / 100).clamp(0, 1) : 0;}
	};
	
	const _Game_Enemy_performCollapse = Game_Enemy.prototype.performCollapse;
	Game_Enemy.prototype.performCollapse = function() {
		_Game_Enemy_performCollapse.apply(this, arguments);
		if (LightingManager.enemyUnableFightReflection) {this.clearGameLights();}
	};
	
	const _Game_Event_refresh = Game_Event.prototype.refresh;
	Game_Event.prototype.refresh = function() {
		_Game_Event_refresh.apply(this, arguments);
		this.refreshShadowAlpha();
	};
	
	Game_Event.prototype.refreshShadowAlpha = function() {
		const meta =  this.event() ? this.event().meta : null;
		const shadowAlpha = meta && meta[shadowAlphaCharacterTag] ? meta[shadowAlphaCharacterTag] : undefined;
		if (typeof shadowAlpha === "boolean") {this._shadowAlpha = shadowAlpha ? characterAlpha : 0}
		else {this._shadowAlpha = shadowAlpha && isFinite(shadowAlpha) ? (getArgNumber(meta[shadowAlphaCharacterTag]) / 100).clamp(0, 1) : 0;}
	};
	
	//アクティブなページから注釈データを取得してライトデータを作成する
	const _Game_Event_setupPage = Game_Event.prototype.setupPage;
	Game_Event.prototype.setupPage = function() {
		_Game_Event_setupPage.apply(this, arguments);
		this.clearGameLights();
		this.setupCommentGameLights();
	};
	
	Game_Event.prototype.clearGameLights = function() {
		this.gameLights = [];
	};
	
	//注釈からアクティブなページのライト情報をセットアップ
	Game_Event.prototype.setupCommentGameLights = function() {
		//<light></light> タグは imageUrl, animationWait, opacity, scaleX, scaleY で記載
		//<lightJson></lightJson> タグはJson形式で並びは自由
		const comment = getActiveComment(this);
		const commentList = comment.match(/<light>((?:(?!<light>)[\s|\S])+)<\/light>/gi);
		const commentJsonList = comment.match(/<lightJson>((?:(?!<lightJson>)[\s|\S])+)<\/lightJson>/gi);
		
		if (commentList) {
			for (let i = 0; i < commentList.length; i++) {
				const strList = commentList[i].replace(/<([^<]+)>/g, '').split(/,/g);
				this.gameLights.push(strArrToLightData(strList));
			}
		}
		
		if (commentJsonList) {
			for (let i = 0; i < commentJsonList.length; i++) {
				const commentJson = commentJsonList[i].replace(/<([^<]+)>/g, '');
				this.gameLights.push(strJsonToLightData(commentJson));
			}
		}
	};
	
	//=====================================================================================================================
	//Sprite 各種
	//  生成時やBitmap変更時にLightingManagerにスプライトを登録
	//  再生終了時は除去
	//  Game_Object持ちはGame_Objectを登録
	//=====================================================================================================================
	const _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
	Sprite_Character.prototype.updateBitmap = function() {
		if (this.isImageChanged()) this._imageChanging = true;
		_Sprite_Character_updateBitmap.apply(this, arguments);
		if (this._imageChanging) {
			const shadowAlpha = this._character.shadowAlpha();
			if (shadowAlpha !== undefined && (this._characterName.length > 0) || this._tileId) {
				this.bitmap.addLoadListener(function() {
					LightingManager.registSprite(this, shadowAlpha);
				}.bind(this));
			}
			this._imageChanging = false;
		}
	};
	
	const _Sprite_Character_setCharacter = Sprite_Character.prototype.setCharacter;
	Sprite_Character.prototype.setCharacter = function(character) {
		_Sprite_Character_setCharacter.apply(this, arguments);
		LightingManager.registGameObjectSet(character, this);
	};
	
	Sprite_Animation.prototype.shadowAlpha = function() {
		return animationShadowAlphaAll || this._animation.name.match(/\[light\]/i);
	};
	
	Sprite_Animation.prototype.needRegist = function(sprite) {
		if (!$gameSystem.isSideView() && this._target && this._target.parent && this._target.parent instanceof Sprite_Actor) return false;
		return sprite.visible && this.shadowAlpha() && !sprite.registedInLigitingManager;
				
	};
	

	const _Sprite_Animation_remove = Sprite_Animation.prototype.remove;
	Sprite_Animation.prototype.remove = function() {
		_Sprite_Animation_remove.apply(this, arguments);
		this.removeCellSprites();
	};
	
	Sprite_Animation.prototype.removeCellSprites = function() {
		this._cellSprites.forEach((sprite) => {
			LightingManager.removeSprite(sprite);
			sprite.registedInLigitingManager = false;
		});
	};
	
	const _Sprite_Animation_updateCellSprite = Sprite_Animation.prototype.updateCellSprite;
	Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {
		_Sprite_Animation_updateCellSprite.apply(this, arguments);
		if (this.needRegist(sprite)) {
			LightingManager.registSprite(sprite, animationAlpha);
			sprite.registedInLigitingManager = true;
		}
	};
	
	
	const _Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
	Sprite_Actor.prototype.updateBitmap = function() {
		const name = this._actor.battlerName();
		if (this._battlerName !== name) {this._imageChanging = true;}
		_Sprite_Actor_updateBitmap.apply(this, arguments);
		if (this._imageChanging ) {
			const shadowAlpha = this._battler.shadowAlpha();
			if (shadowAlpha !== undefined) {
				this._mainSprite.bitmap.addLoadListener(function() {
				LightingManager.registSprite(this._mainSprite, shadowAlpha);
				}.bind(this));
			}
			this._imageChanging = false;
		}
	};
	
	const _Sprite_Actor_setBattler = Sprite_Actor.prototype.setBattler;
	Sprite_Actor.prototype.setBattler = function(battler) {
		const changed = (battler !== this._actor)
		_Sprite_Actor_setBattler.apply(this, arguments);
		if (changed) {LightingManager.registGameObjectSet(battler, this._mainSprite);}
	};
	
	const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
	Sprite_Enemy.prototype.updateBitmap = function() {
		const name = this._enemy.battlerName();
		const hue = this._enemy.battlerHue();
		if (this._battlerName !== name || this._battlerHue !== hue) {this._imageChanging = true;}
		_Sprite_Enemy_updateBitmap.apply(this, arguments);
		if (this._imageChanging) {
			const shadowAlpha = this._battler.shadowAlpha();
			if (shadowAlpha !== undefined) {
				//animatedSVEnemy対応用にメインスプライトがあればそちらを登録
				const sprite = importedAnimatedSVEnemies && this._enemy.hasSVBattler() ? this._mainSprite : this;
				sprite.bitmap.addLoadListener(function() {
					LightingManager.registSprite(sprite, shadowAlpha);
				});
			}
			this._imageChanging = false;
		}
	};
	
	const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
	Sprite_Enemy.prototype.setBattler = function(battler) {
		_Sprite_Enemy_setBattler.apply(this, arguments);
		const sprite = importedAnimatedSVEnemies && this._enemy.hasSVBattler() ? this._mainSprite : this;
		LightingManager.registGameObjectSet(battler, sprite);
	};
	
	const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
	Sprite_Enemy.prototype.update = function() {
		if (!this._appeared && !this._enemy.isAlive()) {
			const sprite = importedAnimatedSVEnemies && this._enemy.hasSVBattler() ? this._mainSprite : this;
			LightingManager.removeSprite(sprite);
		};
		_Sprite_Enemy_update.apply(this, arguments);
	};
	
	const _Sprite_Damage_createChildSprite = Sprite_Damage.prototype.createChildSprite;
	Sprite_Damage.prototype.createChildSprite = function() {
		const sprite = _Sprite_Damage_createChildSprite.apply(this, arguments);
		LightingManager.registSprite(sprite, damagePopAlpha);
		return sprite;
	};
	
	const _Sprite_Damage_update = Sprite_Damage.prototype.update;
	Sprite_Damage.prototype.update = function() {
		_Sprite_Damage_update.apply(this, arguments);
		if (!this.isPlaying()) {
			this.children.forEach((child) => {
				LightingManager.removeSprite(child);
			});
		}
	};
	
	const _Sprite_StateIcon_updateIcon = Sprite_StateIcon.prototype.updateIcon;
	Sprite_StateIcon.prototype.updateIcon = function() {
		_Sprite_StateIcon_updateIcon.apply(this, arguments);
		if (this._iconIndex === 0 && this.registedInLigitingManager) {
			LightingManager.removeSprite(this);
			this.registedInLigitingManager = false;
		} else if (!this.registedInLigitingManager){
			LightingManager.registSprite(this, stateIconAlpha);
			this.registedInLigitingManager = true;
		}
	};
	
	const _Sprite_StateOverlay_updatePattern = Sprite_StateOverlay.prototype.updatePattern;
	Sprite_StateOverlay.prototype.updatePattern = function() {
		_Sprite_StateOverlay_updatePattern.apply(this, arguments);
		if ($gameSystem.isSideView() && this._overlayIndex > 0 && !this.registedInLigitingManager) {
			LightingManager.registSprite(this, stateOverlayAlpha);
			this.registedInLigitingManager = true;
		} else if (this._overlayIndex <= 0 && this.registedInLigitingManager){
			LightingManager.removeSprite(this);
			this.registedInLigitingManager = false;
		}
	};
	
	const _Sprite_Weapon_setup = Sprite_Weapon.prototype.setup;
	Sprite_Weapon.prototype.setup = function(weaponImageId) {
		_Sprite_Weapon_setup.apply(this, arguments);
		if ($gameSystem.isSideView()) {LightingManager.registSprite(this, weaponAlpha);}
		this.registedInLigitingManager = true;
	};
	
	const _Sprite_Weapon_updatePattern = Sprite_Weapon.prototype.updatePattern;
	Sprite_Weapon.prototype.updatePattern = function() {
		_Sprite_Weapon_updatePattern.apply(this, arguments);
		if (!this.isPlaying() && this.registedInLigitingManager) {
			LightingManager.removeSprite(this);
			this.registedInLigitingManager = false;
		}
	};
	
	const _Sprite_Balloon_setup = Sprite_Balloon.prototype.setup;
	Sprite_Balloon.prototype.setup = function() {
		_Sprite_Balloon_setup.apply(this, arguments);
		LightingManager.registSprite(this, balloonAlpha);
		this.registedInLigitingManager = true;
	};
	//これは正直どうなのか･･･残りフレームが1になった時にライティングマネージャから除去
	const _Sprite_Balloon_update = Sprite_Balloon.prototype.update;
	Sprite_Balloon.prototype.update = function() {
		if (this._duration === 1) {
			LightingManager.removeSprite(this);
			this.registedInLigitingManager = false;
		}
		_Sprite_Balloon_update.apply(this, arguments);
	};
	
	//試験的にYEP_GridFreeDoodadsに対応中。影削除率は0
	if (Imported.YEP_GridFreeDoodads) {
		const _Sprite_Doodad_initData = Sprite_Doodad.prototype.initData;
		Sprite_Doodad.prototype.initData = function() {
			_Sprite_Doodad_initData.apply(this, arguments);
			this.bitmap.addLoadListener(function() {
				LightingManager.registSprite(this, 0);
				this.registedInLigitingManager = true;
			}.bind(this));
		};
	}
	
	//=====================================================================================================================
	//Sprite_Light
	//  光表示用の独自スプライトクラス。ターゲットにGameLightを設定する
	//  ファイル名を読み込んで自動でアニメーションの行と列を設定する
	//=====================================================================================================================
	class Sprite_Light extends Sprite {
		
		initialize() {
			super.initialize();
			this.initMembers();
		}
		
		initMembers() {
			this._filename = "";
			this.light = true;
			this._target = null;
			this.z = 8;
			this.blendMode = 1;
			this.anchor.x = 0.5;
			this.anchor.y = 0.5;
			
			this._maxRow = 1;
			this._maxCol = 1;
			this._randomFrame = true;
			this._randomFrameSkipRate = 0.2;
			this._reverseLoop = true;
			this._reverse = false;
			
			this._animationCount = 0;
			this._animationWait = 1;
			this._pattern = 0;
		}
		
		setup(filename, animationWait) {
			this.bitmap = ImageManager.loadBitmap(lightImageDirectory, filename, 0, true);
			this.setFilename(filename);
			this.setAnimationWait(animationWait);
		}
		
		setFilename(filename) {
			this._filename = filename;
			this.setFilenameStatus();
		}
		
		setFilenameStatus() {
			if (!this._filename) return;
			const matchArr = this._filename.match(/\[([^\[\.]+)\]/g);
			if (matchArr) {
				matchArr.forEach(function(matchStr) {
					const rowColArr = matchStr.replace(/(^\[|\]$)/g,'').split(/x/i);
					if (rowColArr.length > 1) {this.setSize(getArgNumber(rowColArr[0]), getArgNumber(rowColArr[1]));}
					else if (matchStr.match(/\[NR\]/)) {this._reverseLoop = false;}
				}.bind(this))
			}
		}
		
		setSize(maxRow, maxCol) {
			this._maxRow = maxRow;
			this._maxCol = maxCol;
		}
		
		setAnimationWait(animationWait) {
			this._animationWait = animationWait ? animationWait : 1;
		}
				
		setTarget(target) {
			this._target = target;
			this.targetUpdate();
			this.updateFrame();
		}
		
		update() {
			super.update();
			this.targetUpdate();
			this._animationCount++;
			if (this._animationCount >= this.animationWait()) {
				this.updatePattern();
				this.updateFrame();
				this._animationCount = 0;
			}
		}
		
		targetUpdate() {
			if (!this._target) return;
			const target = this._target;
			this._randomFrame = target.randomFrame;
			this.x = target.position.x + target.shift.x;
			this.y = target.position.y + target.shift.y;
			this.anchor.x = target.spriteAnchor.x;
			this.anchor.y = target.spriteAnchor.y;
			this.scale.x = target.scale.x * target.flickScaleRate * target.swingScaleRate;
			this.scale.y = target.scale.y * target.flickScaleRate * target.swingScaleRate;
			this.opacity = target.opacity * target.flickOpactiyRate;
			this.rotation = target.rotation;
			if (this.blendMode !== target.blendMode) {this.blendMode = target.blendMode;}
		}
		
		animationWait() {
			return this._animationWait;
		}
		
		updatePattern() {
			this.addPattern();
			const maxPattern = this._maxRow * this._maxCol - 1;
			if (this._pattern > maxPattern) {
				if (this._reverseLoop) {
					this._reverse = true;
					this._pattern = maxPattern > 0 ? maxPattern - 1 : 0;
				}
				else {this._pattern = 0;}
			} else if (this._reverse && this._pattern < 0) {
				this._reverse = false;
				this._pattern = maxPattern > 0 ? 1 : 0;
			}
		}
		
		addPattern() {
			if (this._randomFrame && Math.random() < this._randomFrameSkipRate) return;
			if (this._reverse) {this._pattern--;}
			else {this._pattern++;}
		}
		
		updateFrame() {
			const col = Math.floor(this._pattern % this._maxCol);
			const row = this._pattern < this._maxCol ? 0 : Math.floor(this._pattern / this._maxCol);
			const patternWidth = this.patternWidth();
			const patternHeight = this.patternHeight();
			this.setFrame(col * patternWidth, row * patternHeight, patternWidth, patternHeight);
		}
		
		patternWidth() {
			return this.bitmap ? this.bitmap.width / this._maxCol : 1;
		}
		
		patternHeight() {
			return this.bitmap ? this.bitmap.height / this._maxRow : 1;
		}
		
		//直接登録も可能にしたけど未使用
		registSelf(shadowAlpha) {
			shadowAlpha = shadowAlpha === undefined && this._target ? this._target.shadowAlpha : shadowAlpha; 
			this.bitmap.addLoadListener(function() {
				LightingManager.registSprite(this, shadowAlpha);
			}.bind(this));
		}
	}

})();