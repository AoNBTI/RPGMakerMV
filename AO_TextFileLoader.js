//=============================================================================
// AO_TextFileLoader.js
//=============================================================================
// Copyright (c) 2020 AO
// This software is released under the MIT License.
//
// コードの一部はMITライセンスのプラグイン製作者様のコードを参考にしています
// I appreciate great plugin creater's work.
/*
2020/5/17 ver1.00 初版
*/
/*:
 * @plugindesc 外部テキストファイルを読み込む
 * @author AO
 *
 * @param filePath
 * @desc テキストファイル設置フォルダ名
 * @default texts
 * @type string
 *
 * @param 条件ブロックランダム
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 * @desc if等の条件文内で複数条件を満たすページを全て読み込んでランダムで表示するか
 *
 * @param 被ダメージ台詞発動率
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc デフォルトのダメージ自動台詞発動率(AO_BalloonWindow併用時のみ)
 *
 * @param スキル台詞発動率
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc デフォルトのスキル自動台詞発動率(AO_BalloonWindow併用時のみ)
 *
 * @param 回避台詞発動率
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc デフォルトの回避自動台詞発動率(AO_BalloonWindow併用時のみ)
 *
 * @param 戦闘不能台詞発動率
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc デフォルトの戦闘不能自動台詞発動率(AO_BalloonWindow併用時のみ)
 *
 * @param 戦闘開始時台詞人数
 * @type number
 * @min 0
 * @default 1
 * @desc デフォルトの戦闘開始時の自動台詞人数(AO_BalloonWindow併用時のみ)
 *
 * @param 戦闘終了時台詞人数
 * @type number
 * @min 0
 * @default 1
 * @desc デフォルトの戦闘終了時の自動台詞人数(AO_BalloonWindow併用時のみ)
 *
 * @help AO_TextFileLoader.js ver1.00
 * このプラグインの利用にはRPGツクールver1.6.2以上が必要です
 * This plugin requires RPGMakerMVver1.6.2 or heigher
 *
 * テキストファイルを読み込んで変数への代入やウィンドウへの表示が可能になります
 * ※プロジェクトフォルダに別途プラグインパラメータで指定したフォルダが必要です
 * デフォルトでは"texts"フォルダが必要となります
 * 作製したフォルダにtextファイルを配置しプラグインコマンドを実行することで
 * テキストファイルを読み込めます
 * ※テキストファイルは拡張子"txt"、エンコード"UTF-8(BOM無し)"で保存して下さい
 * ※RPGツクールMVの仕様上、ファイル名は半角英数である必要があります
 * ※AO_BalloonWindow.jsとの連動には
 * AO_BalloonWindow.js ver1.003以上が必要です
 *
 * テキストファイルの読み込み状態は保存されるため
 * 続けて読み込むことで会話を表現したり
 * ランダムに読み込ませてNPCの台詞をランダムにすることが可能です
 * また独自のタグを利用することで変数やスイッチによる分岐が可能です
 *
 * -------プラグインコマンド解説---------
 * CREATE_TEXTSTATE 任意の名前 ファイル名
 * ファイル名のtxtファイルを読み込んで
 * 指定した名前で読み込み状態を保持します
 *
 * TEXT_TO_VARIABLE 任意の名前
 * CREATE_TEXTSTATEで作製したtxtファイルの読み込み状態を呼び出して
 * 読み込んだ文章をゲーム内変数に代入します
 * 
 * TEXT_TO_WINDOW 任意の名前
 * CREATE_TEXTSTATEで作製したtxtファイルの読み込み状態を呼び出して
 * 読み込んだ文章をウィンドウ表示に利用します
 * このコマンド実行直後に"文章の表示"、"文章のスクロール表示"を行うと
 * 読み込んだ文章が表示されます
 *
 * TEXT_TO_POPUPWINDOW 任意の名前
 * CREATE_TEXTSTATEで作製したtxtファイルの読み込み状態を呼び出して
 * 読み込んだ文章をフキダシウィンドウプラグインによるフキダシウィンドウに表示します
 * ※別途フキダシウィンドウプラグインが必要です
 * フキダシウィンドウプラグインのプラグインコマンド
 * MWP_VALID [キャラクターID] [ウィンドウ位置]
 * の実行直後に"TEXT_TO_POPUPWINDOW"コマンドを実行して
 * "文章の表示"コマンドを実行すると
 * フキダシウィンドウに読み込んだ文章が表示されます
 *
 * TEXT_TO_BALLOONWINDOW 任意の名前
 * CREATE_TEXTSTATEで作製したtxtファイルの読み込み状態を呼び出して
 * 読み込んだ文章をAO_BalloonWindow.jsによるスプライトのウィンドウに表示します
 * ※別途AO_BalloonWindowプラグインが必要です
 * プラグインの順番はAO_BalloonWindowを上に配置してください
 * このプラグインコマンドを実行すると即座にスプライトのウィンドウが表示されます
 * 表示対象のキャラクターはtextファイル内で指定可能です
 *
 * CLEAR_TEXTSTATE 任意の名前
 * CREATE_TEXTSTATEで作製した
 * "任意の名前"のtxtファイルの読み込み状態を消去します
 *
 * CLEAR_TEXTSTATE_ALL
 * CREATE_TEXTSTATEで作製したtxtファイルの読み込み状態を全て消去します
 *
 * -------テキストファイル内記述解説---------
 * 各種タグを文章内に埋め込むことで、読み込みの制御が可能になります
 * ===基本タグ===
 * ...</p> : ページの終わりを指定します。この記載までが一つのページとみなされます
 * <random>...
 * </random> : このタグで囲まれたページ内からランダムで一つが読み込まれます
 * <loop> : テキストファイルの末尾まで読み込んだら先頭に戻ります。デフォルトで有効です
 * </loop> : テキストファイルの末尾まで読み込むと、末尾のページで読み込みが止まります
 *
 * ===条件分岐タグ===
 * <if:条件>...</if> : 条件を満たすときのみ...部分が読み込まれます
 *
 * <if:条件1>ページ1
 * <elseif:条件2>ページ2</elseif>
 * 条件1を満たすときはページ1部分が読み込まれ
 * 条件1を満たさないが条件2を満たすときページ2部分が読み込まれます
 *
 * <if:条件1>ページ1
 * <elseif:条件2>ページ2
 * <else>ページ3</else>
 * 条件1を満たすときはページ1部分が読み込まれ
 * 条件1を満たさないが条件2を満たすときページ2部分が読み込まれ
 * 両方満たさないときはページ3部分が読み込まれます
 *
 * ※<if:条件>タグで条件分岐がスタートして
 * </if>タグまたは</elseif>か</else>タグで条件分岐が終了します
 * </if></elseif></else>の記載忘れに注意してください
 * <if>...<elseif>...<elseif>...<else>...</else>
 * のように複数の条件分岐を記述する事も可能です
 *
 * <while;条件>...</while> 
 * 条件を満たす間は...の部分のページを読み込み続けます
 *
 * ※これらの条件分岐内に、条件を満たすページが複数ある場合は
 * 全てのページを読み込んでその中から一つがランダムで表示されます
 *
 * ===条件文の記載===
 * <if:...>や<elseif:...>の...部分に記載できる条件文の解説です
 *
 * actor[id].ステータス 不等号 数値(またはtrue,false)
 * id(半角整数値)のアクターのhp,mp,tpとhp%,mp%,tp%
 * およびlevelを取得して数値と比較できます
 * ※不等号部分の記載は以下の記述が利用できます
 * == : 等しい
 * != : 等しくない
 * >= : 左側が右側以上
 * > : 右側より左が大きい
 * <= : 左側が右側以下
 * < : 左側が右側より小さい
 *
 * 例)
 * ID1のアクターHPが満タンの時読み込むページ
 * <if:actor[1].hp% == 100>HPは満タン！</p></if>
 *
 * アクターがパーティにいるかどうかを判別するには
 * inPartyと記載することで判別可能です
 *
 * 例)
 * ID2のアクターがパーティにいる時読めるページ
 * <if:actor[2].inParty == true>2番のアクターがパーティにいる</p></if>
 *
 * またアクターが特定のステートを付与されているかは
 * state[id]と記載することで可能です
 *
 * 例)
 * ID3のアクターが1番のステートにかかっていない時読めるページ
 * <if;actor[1].state[1] == true>戦闘不能です</p></if>
 *
 * 戦闘中はactor部分をenemyと記載して
 * 敵のステータスで条件分岐するページも作製可能です
 * id部分は敵グループ内に加えた順番になります
 *
 * v[id] 不等号 数値
 * s[id] ==(または!=) ON(またはOFF)
 * v[id]でidに記載した番号の変数を取得できます
 * s[id]でidに記載した番号のスイッチ状態を取得できます
 *
 * 例)
 * スイッチ2番がオンの時読み込めるページ
 * <if:s[2] == ON>ここは2番のスイッチがオンなら読める</p></if>
 * 変数1番が10以下の時読み込めるページ
 * <if:v[1] <= 10>変数１が10以下だよ</p></if>
 *
 *
 *
 * -------AO_BalloonWindowとの連動---------
 * AO_BalloonWindowのver1.003以降と連動します
 * このプラグインの上にAO_BalloonWindowを配置することで
 * 戦闘時の自動台詞設定機能等を利用できます
 *
 * ===AO_BalloonWindowを表示するターゲットの指定===
 * テキスト内に以下の記載をすることでBalloonWindowを表示する
 * ターゲットを指定できます
 * <targetName:名前>または<targetId:ターゲット番号>
 *
 * ===アクター・エネミーの戦闘自動台詞設定===
 * メモ欄に特定の記載をすることで戦闘時に読み込んで表示する
 * txtファイルを指定できます
 *
 * <ABWEngage: ファイル名> : 戦闘開始時に読み込むtxtファイルを指定
 * <ABWDamage: ファイル名> : 被ダメージ時に読み込むtxtファイルを指定
 * <ABWDamagePercent: 0-100の整数値 : ダメージ時の台詞発動百分率
 * <ABWEvade: ファイル名> : 回避時に読み込むtxtファイルを指定
 * <ABWEvadePercent: 0-100の整数値 : 回避時の台詞発動百分率
 * <ABWCollapse: ファイル名> : 戦闘不能時に読み込むtxtファイルを指定
 * <ABWCollapsePercent: 0-100の整数値 : 戦闘不能時の台詞発動百分率
 * <ABWVictory: ファイル名> : 勝利時に読み込むtxtファイルを指定
 * ※個々で別々のファイル名を指定する事になります
 * 
 * <ABWPrefix: ファイル接頭辞> : YEP_X_ActSeqPack2利用時や
 * スキル発動時に読み込むテキストファイルの接頭辞を指定
 * ※スキル使用者によって読み込むtxtファイルが変わります
 * ※キャラクター名を半角英数にした接頭辞を指定するとわかりやすいかもしれません
 *
 * ===スキルメモ欄===
 * 発動したスキルに応じてtxtファイルを読み込みたい場合は
 * スキルメモ欄に以下の記載を行います
 *
 * <ABW: スキルファイル名>
 * ※注意
 * スキル用に実際に配置するファイル名は"ファイル接頭辞"と"スキルファイル名"を
 * 続けて記載したファイル名になります！
 *
 * 例)
 * アクターメモ欄 : <ABWPrefix: Ald>
 * スキルメモ欄 : <ABW: Fire>
 * textsフォルダに配置するtxtファイル名: AldFire.txt
 *
 * 戦闘時自動台詞用に新たな条件が利用できます
 * gameParty.条件 不等号 数値(またはtrue,false)
 * gamePartyでパーティメンバーのステータスを取得できます
 * 取得できるステータスは以下
 * gameParty.allAlive : パーティが全員生きているか
 * gameParty.ahp% : 全員のHP%平均値
 * gameParty.amp% : 全員のMP%平均値
 * gameParty.atp% : 全員のTP%平均値
 * 
 * 例)
 * 戦闘終了時のtxtファイル内記載例
 * <targetName:アルド>
 * <if:gameparty.ahp% > 90>
 * パーティメンバーの体力が90%以上残っている時</p>
 * <elseif:gameparty.ahp% > 50>
 * パーティメンバーの体力が90%以上残っている時</p>
 * <else>
 * 50%より低かったとき</p>
 * </else>
 *
 * また以下の記載で”先制攻撃"と”不意打ち”を検出できます
 * <if:preemptive == true>先制攻撃の時</if>
 * <if:surprise == true>不意打ちの時</if>
 *
 * 例)
 * 戦闘開始時のtxtファイル記載例
 * <targetName:アルド>
 * <if:preemptive>
 * チャンスだッ！</p>
 * <elseif:surprise>
 * 気をつけろ！みんな！</p>
 * <else>
 * くるぞっ！</p>
 * </else>
 *
 * ※"== true"は省略しても判定は変わりません
 * 
 * AO_BalloonWindowの制御文字はtxtファイル内に記載しても有効です
 * 詳細はAO_BalloonWindowのヘルプを参照してください
 * 例)
 * ダメージ時のtxtファイル記載例
 * <targetName:チムグ>
 * <if:actor[2].hp% >= 70>
 * わッ！</p>
 * くっ！</p>
 * <elseif:actor[2].hp% >= 35>
 * \SPSE[Absorb1]\CWSP;もうっ！</p>
 * \SPSE[Absorb1]\CWSP;ぐッ！</p>
 * <else>
 * \SPSE[Absorb1]\CWSP;ダメッ！</p>
 * \SPSE[Absorb1]\CWSP;あぁっ！</p>
 * </else>
 *
 * YEP_X_ActSeqPack2を併用している場合は
 * アクションシーケンス内でテキストファイルの読み込みが可能です
 * BALLOONWINDOW ファイル名: target
 * ※注意
 * アクションシーケンス用に実際に配置するファイル名は
 * targetの"ファイル接頭辞"と"ファイル名"を続けて記載したファイル名になります
 * またアクションシーケンスの仕様上ファイル名は"全て大文字"で記載する必要があります！
 *
 * 例)
 * BALLOONWINDOW FIRE : user
 * アルドがスキルを使用した場合で
 * アルドのメモ欄内<ABWPrefix: Ald>であったときは
 * 読み込むファイル名は"AldFIRE.txt"です
 *
 * ライセンスはMIT
 * 改変歓迎です
 *
 */

var Imported = Imported || {};
Imported.AO_TextFileLoader = true;

(function() {
	'use strict';
	const pluginName = 'AO_TextFileLoader';
	const parameters = PluginManager.parameters(pluginName);
	
	const randomInBlock = getArgBoolean(parameters["条件ブロックランダム"] || "true");
	const damageSpeakPercent = getArgNumber(parameters["被ダメージ台詞発動率"] || 100);
	const skillSpeakPercent = getArgNumber(parameters["スキル台詞発動率"] || 100);
	const evadeSpeakPercent = getArgNumber(parameters["回避台詞発動率"] || 100);
	const collapseSpeakPercent = getArgNumber(parameters["戦闘不能台詞発動率"] || 100);
	const maxEngageBattlerNumber = getArgNumber(parameters["戦闘開始時台詞人数"] || 1);
	const maxVictoryActorNumber = getArgNumber(parameters["戦闘終了時台詞人数"] || 1);
	const filePath = getArgString(parameters['filePath'] || 'texts') + "/";
	
	const disableMapAutoBalloonWindow = true;
	
	const encoding = 'utf-8';
	
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
	
	function obtainRandomElement(arr, max) {
		if (max === undefined || max > arr.length) max = arr.length;
		arr = arr.slice();
		const result = [];
		while (max > 0) {
			const index = Math.randomInt(arr.length);
			result.push(arr[index]);
			arr = arr.filter((member) => {return member !== arr[index]})
			max--;
		}
		return result;
	}
	
	function localDirectoryPath(directory) {
		const path = require('path');
		const base = path.dirname(process.mainModule.filename);
		return path.join(base, directory);
	}
	
	function readTextFile(directory, filename, encoding) {
		encoding = (typeof encoding === 'undefined') ? null : encoding;
		const fs = require('fs');
		const filePath = localDirectoryPath(directory) + filename + '.txt';
		if (fs.existsSync(filePath)) return fs.readFileSync(filePath, encoding );
    }
	
	function readRawText(filename) {
		return readTextFile(filePath, filename, encoding);
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
	
	function getObjectTargetNumber(gameObject) {
		if ($gameParty.inBattle()) {
			const actorId = $gameParty.members().indexOf(gameObject);
			if (actorId >= 0) return - (actorId + 1);
			const enemyId = $gameTroop.members().indexOf(gameObject);
			if (enemyId >= 0) return enemyId + 1;
		} else {
			const partyMemberId = $gameParty.members().indexOf(gameObject);
			if (partyMemberId === 0) return -1;
			if (partyMemberId > 0 && $gamePlayer.followers().isVisible())  return - (partyMemberId + 1);
			const eventId = $dataMap.events.indexOf(gameObject);
			if (eventId >= 0) return eventId + 1;
		}
	}
	
	function getSkillFilename(gameAction) {
		if (!gameAction.isSkill()) return;
		const subjectData = gameAction._subjectActorId > 0 ? $dataActors[gameAction._subjectActorId] : $dataEnemies[$gameTroop.members()[gameAction._subjectEnemyIndex].enemyId()];
		const subjectPrefix = subjectData && subjectData.meta && subjectData.meta.ABWPrefix ? subjectData.meta.ABWPrefix : "";
		const skillFilename = gameAction.item() && gameAction.item().meta && gameAction.item().meta.ABW ? gameAction.item().meta.ABW : "";
		return subjectPrefix.length && skillFilename.length ? getArgString(subjectPrefix) + getArgString(skillFilename) : null;
	}
	

	//=====================================================================================================================
    // TextStateManager
    //  テキストファイルの読み込み更新処理
	//  読み込んだ条件式等タグの処理
    //=====================================================================================================================
	class TextStateManager {
		constructor() {
		}
		
		static textStateObject(text) {
			return {
				"text": text, "index": 0, "loop": true, "random": false, "skip": false,
				"blockLevel": 0, "skipIf":[false], "skipElse":[false],//各ブロックレベルでelse|ifelseをスキップするかbooleanで保存する配列
				"while": false, "addedIndex": 0,
				"antiRepeat": true, "antiRepeatTexts": [], "maxAntiRepeat": 1,
				"loadedText": "", "loadedTexts": [], "loading": false,
				"balloonWindowTargetName":"", "balloonWindowTargetId": null, "balloonWindowQueueId": null,
			}
		}
		
		static createTextState(name, filename) {
			const text = readRawText(filename);
			if (text) {
				const textState = this.textStateObject(text);
				$gameSystem.addTextState(name, textState);
			}			
		}

		static textState(name) {
			return $gameSystem.textState(name);
		}
		
		//メッセージの上書き確認
		static overrideMessage() {
			return this._overrideTextState && this._overrideTextState.loadedText.length ? true : false;
		}
		
		static overrideTextState() {
			const textState = this._overrideTextState;
			if (this._overrideCount === undefined) this._overrideCount = 0;
			if (this._overrideCount <= 0) {
				this._overrideTextState = null;
				this._overrideCount = 0;
			} else {
				this._overrideCount--;
			}
			return textState;
		}
		
		static setOverrideTextState(textState) {
			this._overrideTextState = textState;
		}
		
		static setOverrideCount(count) {
			this._overrideCount = count;
		};
		
		static setBalloonWindowForcedTarget(textState, forcedTarget) {
			if (typeof forcedTarget === 'undefined') return;
			if (typeof forcedTarget === 'string') {
				textState.balloonWindowTargetName = forcedTarget;
				textState.balloonWindowTargetId = null;
			} else if (typeof forcedTarget === "number") {
				textState.balloonWindowTargetId = forcedTarget;
				textState.balloonWindowTargetName = "";
			}
		}
		
		static setBalloonWindow(textState, forcedTarget) {
			this.setBalloonWindowForcedTarget(textState, forcedTarget);
			const targetId = textState.balloonWindowTargetName.length ? getNameTargetNumber(textState.balloonWindowTargetName) : textState.balloonWindowTargetId;
			console.log(targetId, textState);
			$gameTemp.createBalloonWindow(targetId, textState.loadedText);
		}
		
		static setBalloonWindowQueue(textState, forcedTarget) {
			this.setBalloonWindowForcedTarget(textState, forcedTarget);
			const queueIndex = textState.balloonWindowQueueId === null ? 0 : textState.balloonWindowQueueId;
			const targetId = textState.balloonWindowTargetName.length ? getNameTargetNumber(textState.balloonWindowTargetName) : textState.balloonWindowTargetId;
			$gameTemp.queueBalloonWindow(queueIndex, targetId, textState.loadedText);
		}
		
		static addTextStateIndex(textState, value) {
			textState.index += value;
			textState.addedIndex += value;
		}
		
		static resetTextStateIndex(textState) {
			textState.index = 0;
		}
		
		static resetTextStateAddedIndex(textState) {
			textState.addedIndex = 0;
		}
		
		static loadNextText(textState) {
			this.initLoadingStatus(textState);
			while (textState.loading) {
				const tagCommand = this.obtainTagCommand(textState);
				if (tagCommand.length) {
					this.processTag(tagCommand, textState);
				} else {
					this.processNormalCharacter(textState);
				}
				
				if (textState.index >= textState.text.length - 1) {
					textState.loading = false;
					if (textState.loadedText.length) {
						this.pushLoadedText(textState);
					}
				}
				this.checkLoopEnd(textState);
			}
			
			this.randomChoice(textState);
			if (textState.while) this.addTextStateIndex(textState, - textState.addedIndex);
		}
		
		static initLoadingStatus(textState) {
			textState.loading = true;
			textState.loadedTexts = [];
			textState.blockLevel = 0;
			textState.skipElse = [];
			this.resetTextStateAddedIndex(textState)
			if (textState.index >= textState.text.length - 1) {
				if (textState.loop) {
					this.resetTextStateIndex(textState);
				} else {
					textState.loadedTexts.push(textState.loadedText);
					textState.loading = false;
				}
			};
			textState.loadedText = "";
		}
		
		static checkLoopEnd(textState) {
			if (textState.addedIndex > textState.text.length) textState.loading = false;
		}
		
		static checkLoadingEnd(textState) {
			return !textState.random && textState.blockLevel === 0 && !textState.skipElse[0] && textState.loadedTexts.length;
		}
		
		static obtainTagCommand(textState) {
			const text = textState.text.slice(textState.index);
			const arr = /^<([^>:]+)[>:]/ig.exec(text);
			if (arr) {
				//タグコマンド分はインデックスを進める
				this.addTextStateIndex(textState, arr[0].length);
				return arr[1].toUpperCase();
			} else {
				return "";
			}
		}
		
		static processTag(tagCommand, textState) {
			//ブロックのレベル操作はここでのみにすること！
			switch (tagCommand) {
				case "P":
					break;
				case "/P":
					this.processPageEnd(textState);
					break;
				case "RANDOM":
					textState.random = true;
					break;
				case "/RANDOM":
					textState.random = false;
					this.processPageEnd(textState);
					break;
				case "LOOP":
					textState.loop = true;
					break;
				case "/LOOP":
					textState.loop = false;
					break;
				case "IF":
					textState.skip = false;
					this.processIfCondition(textState);
					textState.blockLevel++;
					break;
				case "ELSEIF":
					textState.skip = false;
					textState.blockLevel--;
					this.processElseifCondition(textState);
					textState.blockLevel++;
					break;
				case "ELSE":
					textState.skip = false;
					textState.blockLevel--;
					this.processElseCondition(textState);
					textState.blockLevel++;
					break;
				case "WHILE":
					textState.while = true;
					this.processWhileCondition(textState);
					textState.blockLevel++;
					break;
				case "/WHILE":
					textState.blockLevel--;
					this.processPageEnd(textState);
					break;
				case "/IF":
				case "/ELSE":
				case "/ELSEIF":
					textState.skip = false;
					textState.blockLevel--;
					this.resetSkip(textState);
					this.processPageEnd(textState);
					break;
			}
			this.processBalloonWindowTag(tagCommand, textState);
		}
		
		//AO_BalloonWindow用制御コマンド
		static processBalloonWindowTag(tagCommand, textState) {
			if (!Imported.AO_BalloonWindow) return;
			if (textState.skip) return;
			switch (tagCommand) {
				case "TARGETNAME":
					this.setBalloonWindowTargetName(textState);
					break;
				case "TARGETID":
					this.setBalloonWindowTargetId(textState);
					break;
				case "QUEUEID":
					this.setBalloonWindowQueueId(textState);
					break;
				case "/QUEUE":
					this.resetBalloonWindowQueue(textState);
					break;
			}
		}
		
		static pushLoadedText(textState) {
			if (!randomInBlock && !textState.random && textState.loadedTexts.length) return;
			if (!textState.skip) {
				const text = textState.loadedText.replace(/^\s+/, "");
				if (text.length) {
					textState.loadedTexts.push(text);
				}
			}
			textState.loadedText = "";
		}
		
		static processNormalCharacter(textState) {
			if (textState.index < textState.text.length) {
				if (!textState.skip) textState.loadedText += textState.text[textState.index];
				this.addTextStateIndex(textState, 1);
			}
		}
		
		static processPageEnd(textState) {
			this.pushLoadedText(textState);
			if (this.checkLoadingEnd(textState)) {
				textState.loading = false;
			}
		}
		
		static resetSkip(textState, blockLevel) {
			blockLevel = blockLevel ? blockLevel : textState.blockLevel;
			textState.skipIf[blockLevel] = false;
			textState.skipElse[blockLevel] = false;
		}
		
		static setSkipIf(textState, blockLevel) {
			blockLevel = blockLevel ? blockLevel : textState.blockLevel;
			textState.skipIf[blockLevel] = true;
			textState.skipElse[blockLevel] = false;
		}
		
		static setSkipElse(textState, blockLevel) {
			blockLevel = blockLevel ? blockLevel : textState.blockLevel;
			textState.skipIf[blockLevel] = false;
			textState.skipElse[blockLevel] = true;
		}
		
		static setSkipAll(textState, blockLevel) {
			blockLevel = blockLevel ? blockLevel : textState.blockLevel;
			textState.skipIf[blockLevel] = true;
			textState.skipElse[blockLevel] = true;
		}
		
		static processIfCondition(textState) {
			const text = textState.text.slice(textState.index);
			const conditionArr = /^\s*([^>=<!]+)([>=!<]{0,2})([^>=<!]*)>\s*/gi.exec(text);
			let result;
			if (conditionArr) {
				this.addTextStateIndex(textState, conditionArr[0].length);
				const gameObjectStatus = this.obtainGameObjectStatus(getArgString(conditionArr[1]));
				const inequality = this.obtainInequality(getArgString(conditionArr[2]));
				const conditionStatus = this.obtainConditionStatus(conditionArr[3]);
				result = this.evalCondition(gameObjectStatus, inequality, conditionStatus);
			}
			//現ブロックレベルのIF文スキップが設定されている時はfalse
			if (textState.skipIf[textState.blockLevel]) {
				result = false;
			}
			if (result) {
				this.setSkipElse(textState);
				//一段階多いブロックレベルを全てよめるようにする
				this.resetSkip(textState, textState.blockLevel + 1);
			} else {
				textState.skip = true;
				//現段階のスキップを解除する
				this.resetSkip(textState);
				//一段階多いブロックレベルを全てスキップにする
				this.setSkipAll(textState, textState.blockLevel + 1);
			}
		}
		
		static processElseifCondition(textState) {
			const text = textState.text.slice(textState.index);
			const conditionArr = /^\s*([^>=<!]+)([>=!<]{0,2})([^>=<!]*)>\s*/gi.exec(text);
			let result;
			if (conditionArr) {
				this.addTextStateIndex(textState, conditionArr[0].length);
				const gameObjectStatus = this.obtainGameObjectStatus(getArgString(conditionArr[1]));
				const inequality = this.obtainInequality(getArgString(conditionArr[2]));
				const conditionStatus = this.obtainConditionStatus(conditionArr[3]);
				result = this.evalCondition(gameObjectStatus, inequality, conditionStatus);
			}
			if (textState.skipElse[textState.blockLevel]) {
				textState.skip = true;
				this.setSkipAll(textState, textState.blockLevel + 1);
			} else if (result) {
				this.setSkipElse(textState);
				this.resetSkip(textState, textState.blockLevel + 1);
			} else {
				textState.skip = true;
				this.resetSkip(textState);
				this.setSkipAll(textState, textState.blockLevel + 1);
			}
		}
		
		static processElseCondition(textState) {
			if (textState.skipElse[textState.blockLevel]) return textState.skip = true;
			this.resetSkip(textState, textState.blockLevel + 1);
		}
		
		static processWhileCondition(textState) {
			const text = textState.text.slice(textState.index);
			const conditionArr = /^\s*([^>=<!]+)([>=!<]{0,2})([^>=<!]*)>\s*/gi.exec(text);
			let result;
			if (conditionArr) {
				this.addTextStateIndex(textState, conditionArr[0].length);
				const gameObjectStatus = this.obtainGameObjectStatus(getArgString(conditionArr[1]));
				const inequality = this.obtainInequality(getArgString(conditionArr[2]));
				const conditionStatus = this.obtainConditionStatus(conditionArr[3]);
				result = this.evalCondition(gameObjectStatus, inequality, conditionStatus);
			}
			if (!result) {
				textState.while = false;
				this.skipWhileCondition(textState);
			}
		}
		
		
		static evalCondition(gameObjectStatus, inequality, conditionStatus) {
			let result;
			if (inequality) {
				switch (inequality) {
					case '==':
					case '===':
					result = gameObjectStatus === conditionStatus ? true : false;
					break;
				case '!=':
				case '!==':
					result = gameObjectStatus !== conditionStatus ? true : false;
					break;
				case '<=':
					result = gameObjectStatus <= conditionStatus ? true : false;
					break;
				case '>=':
					result = gameObjectStatus >= conditionStatus ? true : false;
					break;
				case '>':
					result = gameObjectStatus > conditionStatus ? true : false;
					break;
				case '<':
					result = gameObjectStatus < conditionStatus ? true : false;
					break;
				}
			} else {
				result = gameObjectStatus ? true : false;
			}
			
			//console.log(gameObjectStatus, inequality, conditionStatus, result);
			return result;
		}
		
		static skipWhileCondition(textState) {
			const text = textState.text.slice(textState.index);
			const skipArr = /<\/while>/i.exec(text);
			if (skipArr) this.addTextStateIndex(textState, skipArr.index);
		}
		
		static obtainGameObjectStatus(gameObjectStatus) {
			//Check preemptive adn Surprise Battle Start
			const preemptiveStatusArr = /^\s*(preemptive)/i.exec(gameObjectStatus);
			if (preemptiveStatusArr) return BattleManager._preemptive;
			const surpriseStatusArr = /^\s*(surprise)/i.exec(gameObjectStatus);
			if (surpriseStatusArr) return BattleManager._surprise;
			//Game_Party Game_Troop
			const gameUnitStatusArr = /^\s*(gameParty).(.+)|^\s*(gameTroop).(.+)/i.exec(gameObjectStatus);
			if (gameUnitStatusArr) {
				const gameUnit = this.obtainGameUnit(getArgString(gameUnitStatusArr[1], true));
				const gameUnitCondition = gameUnitStatusArr[2] ? this.obtainGameUnitCondition(gameUnit, getArgString(gameUnitStatusArr[2], true)) : gameUnit;
				return gameUnitCondition;
			}
			//Game_Actor Game_Variable GameSwitch
			const gameObjectStatusArr = /^([a-z]+)\[(\d+)\].{0,1}(\S*)/gi.exec(gameObjectStatus);
			if (gameObjectStatusArr) {
				const gameObject = this.obtainGameObject(getArgString(gameObjectStatusArr[1], true), getArgNumber(gameObjectStatusArr[2]));
				const gameObjectCondition = gameObjectStatusArr[3] ? this.obtainGameObjectCondition(gameObject, getArgString(gameObjectStatusArr[3], true)) : gameObject;
				return gameObjectCondition;
			}
		}
		
		static obtainGameObject(gameObjectName, gameObjectId) {
			switch (gameObjectName) {
				case "ACTOR":
					return $gameActors.actor(gameObjectId);
				case "ENEMY":
					if ($gameTroop.members().length > gameObjectId - 1) return $gameTroop.members()[gameObjectId - 1];
				case "V":
					return $gameVariables.value(gameObjectId);
				case "S":
					return $gameSwitches.value(gameObjectId);
				default:
					return null;
			}
		}
		
		static obtainGameUnit(gameUnitName) {
			switch (gameUnitName) {
				case "GAMEPARTY":
					return $gameParty;
				case "GAMETROOP":
					return $gameTroop;
				default:
					return null;
			}
		}
		
		static obtainGameObjectCondition(gameObject, condition) {
			if (gameObject instanceof Game_Battler) {
				//各種パラメータは数値を返す
				switch (condition) {
					case "HP":
					case "MP":
					case "TP":
						return gameObject[condition.toLowerCase()];
					case "LV":
					case "LEVEL":
						return gameObject.level;
					case "HP%":
					case "MP%":
						const numerator = gameObject[condition.replace(/%/gi, "").toLowerCase()];
						const denominator = gameObject["m" + condition.replace(/%/gi, "").toLowerCase()];
						return Math.floor(numerator / denominator * 100);
					case "TP%":
						return gameObject.tpRate();
					case "INPARTY":
						//パーティメンバー存在判定。ブーリアンを返す
						if (gameObject instanceof Game_Actor) return $gameParty.members().includes(gameObject);
						if (gameObject instanceof Game_Enemy) return $gameTroop.members().includes(gameObject);
						return false;
				}
				//ステート処理。ブーリアンを返す
				const stateArr = /^STATE\[(\d+)\]/gi.exec(condition);
				if (stateArr) {
					const state = $dataStates[getArgNumber(stateArr[1])];
					return gameObject.states().includes(state);
				}
			}
			return gameObject;
		}
		
		static obtainGameUnitCondition(gameUnit, condition) {
			if (gameUnit instanceof Game_Party) {
				const partySize = $gameParty.size();
				if (partySize === 0) return;
				switch (condition) {
					case "ALLALIVE":
						return $gameParty.aliveMembers().length === partySize;
					case "AHP%":
						let hpSum = 0;
						let mhpSum = 0;
						$gameParty.members().forEach((member) => {
							hpSum += member.hp;
							mhpSum += member.mhp;
						});
						return Math.floor(hpSum / mhpSum * 100);
					case "AMP%":
						let mpSum = 0;
						let mmpSum = 0;
						$gameParty.members().forEach((member) => {
							mpSum += member.mp;
							mmpSum += member.mmp;
						});
						return Math.floor(mpSum / mmpSum * 100);
					case "ATP%":
						let tpSum = 0;
						let mtpSum = 0;
						$gameParty.members().forEach((member) => {
							tpSum += member.tp;
							mtpSum += member.maxTp();
						});
						return Math.floor(tpSum / mtpSum * 100);
				}
			} //何か思いついたら$gameTroopにも対応する
		}
		
		static obtainInequality(inequality) {
			switch (inequality) {
				case "==":
				case "===":
				case "!=":
				case "!==":
				case ">=":
				case "<=":
				case "<":
				case ">":
					return inequality;
				default:
					return null;
			}
		}
		
		static obtainConditionStatus(conditionStatus) {
			if (/^\s*\d+\s*$|\s*0\s*$/i.test(conditionStatus)) {
				return getArgNumber(conditionStatus);
			} else {
				return getArgBoolean(conditionStatus);
			}
		}
		
		static setBalloonWindowTargetName(textState) {
			const text = textState.text.slice(textState.index);
			const targetNameArr = /^(.+)>/i.exec(text);
			if (targetNameArr) {
				this.addTextStateIndex(textState, targetNameArr[0].length);
				textState.balloonWindowTargetName = getArgString(targetNameArr[1]);
				textState.balloonWindowTargetId = null;
			}
		}
		
		static setBalloonWindowTargetId(textState) {
			const text = textState.text.slice(textState.index);
			const targetIdArr = /^(\d+)>/i.exec(text);
			if (targetIdArr) {
				this.addTextStateIndex(textState, targetIdArr[0].length);
				textState.balloonWindowTargetId = getArgNumber(targetIdArr[1]);
				textState.balloonWindowTargetName = "";
			}
		}
		
		static setBalloonWindowQueueId(textState) {
			const text = textState.text.slice(textState.index);
			const queueIdArr = /^(\d+)>/i.exec(text);
			if (queueIdArr) {
				this.addTextStateIndex(textState, queueIdArr[0].length);
				textState.balloonWindowQueueId = getArgNumber(queueIdArr[1]);
			}
		}
		
		static resetBalloonWindowQueue(textState) {
			textState.balloonWindowQueueId = null;
		}
		
		//文字列配列からアンチリピート配列に含まれない文字列を一つ選択する
		static randomChoice(textState) {
			const loadedTexts = textState.loadedTexts;
			const antiRepeatTexts = textState.antiRepeatTexts;
			const resultTexts = loadedTexts.filter((text) => {
				if (!antiRepeatTexts.includes(text)) return text;
			});
			const resultArr = resultTexts.length > 0 ? resultTexts : loadedTexts;
			if (resultArr.length) {
				textState.loadedText = resultArr[Math.floor(Math.random() * resultArr.length)];
			}
			if (textState.antiRepeat) {
				textState.antiRepeatTexts.push(textState.loadedText);
				if (textState.antiRepeatTexts.length > textState.maxAntiRepeat) {
					textState.antiRepeatTexts.shift();
				}
			}	
		}
		
	}
	
	//=====================================================================================================================
	//Game_Interpreter
	//  プラグインコマンド定義
	//  
	//=====================================================================================================================
	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		this.pluginCommandTextFileLoader(command, args);
	};
	
	Game_Interpreter.prototype.pluginCommandTextFileLoader = function(command, args) {
		switch (command) {
			case "CREATE_TEXTSTATE":
				$gameTemp.createTextState(getArgString(args[0]), getArgString(args[1]));
				break;
			case "TEXT_TO_VARIABLE":
				$gameTemp.loadTextStateToVariable(getArgString(args[0]), getArgNumber(args[1]));
				break;
			case "TEXT_TO_WINDOW":
				$gameTemp.loadTextStateToWindow(getArgString(args[0]));
				break;
			case "TEXT_TO_POPUPWINDOW":
				$gameTemp.loadTextStateToPopUpWindow(getArgString(args[0]));
				break;
			case "TEXT_TO_BALLOONWINDOW":
				$gameTemp.loadTextStateToBalloonWindow(getArgString(args[0]));
				break;
			case "CLEAR_TEXTSTATE":
				$gameSystem.clearTextState(getArgString(args[0]));
				break;
			case "CLEAR_TEXTSTATE_ALL":
				$gameSystem.clearTextStates(getArgString(args[0]));
				break;
		}
	};
	
	//=====================================================================================================================
    // Game_Temp
    //  各種スクリプトコマンド保持
    //=====================================================================================================================
	Game_Temp.prototype.createTextState = function(name, filename) {
		TextStateManager.createTextState(name, filename);
	};
	
	Game_Temp.prototype.loadTextStateToVariable = function(name, gameVariableId) {
		const textState = TextStateManager.textState(name);
		if (textState) {
			TextStateManager.loadNextText(textState);
			$gameVariables.setValue(gameVariableId, textState.loadedText);
		}
	};
	
	Game_Temp.prototype.loadTextStateToWindow = function(name) {
		const textState = TextStateManager.textState(name);
		if (textState) {
			TextStateManager.loadNextText(textState);
			TextStateManager.setOverrideTextState(textState);
			if ($gameSystem._messagePopupCharacterId) {
				TextStateManager.setOverrideCount(1);
			}
		}
	};
	
	Game_Temp.prototype.loadTextStateToPopUpWindow = function(name) {
		const textState = TextStateManager.textState(name);
		if (textState) {
			TextStateManager.loadNextText(textState);
			TextStateManager.setOverrideTextState(textState);
			TextStateManager.setOverrideCount(1);
		}
	};
	
	Game_Temp.prototype.loadTextStateToBalloonWindow = function(name, forcedTarget) {
		if (!Imported.AO_BalloonWindow) return;
		const textState = TextStateManager.textState(name);
		if (textState) {
			TextStateManager.loadNextText(textState);
			if (textState.balloonWindowQueueId) {
				TextStateManager.setBalloonWindowQueue(textState, forcedTarget);
			} else {
				TextStateManager.setBalloonWindow(textState, forcedTarget);
			}
		}
	}
	
	//=====================================================================================================================
    // Game_Message
    //  allText()の戻り値をオーバーライド
    //=====================================================================================================================
	const _Game_Message_allText = Game_Message.prototype.allText;
	Game_Message.prototype.allText = function() {
		if (TextStateManager.overrideMessage()) {
			return TextStateManager.overrideTextState().loadedText;
		}
		return _Game_Message_allText.apply(this, arguments);
	};
	
	//=====================================================================================================================
    // Game_System
    //  読み込んだテキストファイル情報の保持
    //=====================================================================================================================
	const _Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		_Game_System_initialize.apply(this, arguments);
		this.clearTextStates();
	};
	
	Game_System.prototype.clearTextStates = function() {
		this._textStates = {};
	};
	
	Game_System.prototype.clearTextState = function(name) {
		delete this._textStates[name]
	}
	
	Game_System.prototype.textStates = function() {
		return this._textStates;
	};
	
	Game_System.prototype.textState = function(name) {
		return this._textStates[name];
	}
	
	Game_System.prototype.addTextState = function(name, textState) {
		this._textStates[name] = textState;
	};
	
	//=====================================================================================================================
    // AO_BalloonWindow関連
    //  バルーンウィンドウの戦闘時における各種自動表示
    //=====================================================================================================================
	if (Imported.AO_BalloonWindow) {
		
		//=====================================================================================================================
		// Game_Battler, Game_Actor, Game_Enemy
		//  自動で読み込むテキストファイル名の保持と読み込みの実行
		//=====================================================================================================================
		Game_Battler.prototype.getDataBattler = function() {
		};
		
		Game_Battler.prototype.setAutoBalloonWindowInfo = function() {
			//metaデータ取得成型
			const dateBatteler = this.getDataBattler();
			const metaData = dateBatteler ? dateBatteler.meta : null;
			//"ABWPrefix":アクションシーケンスおよびスキル用ファイル名接頭辞, "ABWEngage": 戦闘開始時の台詞, "ABWDamage":ダメージ時の台詞, "ABWEvade":回避時の台詞, "ABWCollapse":死亡時の台詞
			//"ABWDamagePercent":ダメージ時の台詞発動百分率, "ABWEvadePercent":回避時の台詞発動百分率, "ABWCollapsePercent":死亡時の台詞発動百分率
			const autoBalloonWindowInfo = {};
			autoBalloonWindowInfo.prefix = getArgString(metaData.ABWPrefix);
			autoBalloonWindowInfo.engage = getArgString(metaData.ABWEngage);
			autoBalloonWindowInfo.damage = getArgString(metaData.ABWDamage);
			autoBalloonWindowInfo.damageSpeakPercent = metaData.ABWDamagePercent === undefined ? damageSpeakPercent : getArgNumber(metaData.ABWDamagePercent) / 100;
			autoBalloonWindowInfo.evade = getArgString(metaData.ABWEvade);
			autoBalloonWindowInfo.evadeSpeakPercent = metaData.ABWEvadePercent === undefined ? evadeSpeakPercent : getArgNumber(metaData.ABWEvadePercent) / 100;
			autoBalloonWindowInfo.collapse = getArgString(metaData.ABWCollapse);
			autoBalloonWindowInfo.collapseSpeakPercent = metaData.ABWCollapsePercent === undefined ? collapseSpeakPercent : getArgNumber(metaData.ABWCollapsePercent) / 100;
			autoBalloonWindowInfo.victory = getArgString(metaData.ABWVictory);
			this.autoBalloonWindowInfo = autoBalloonWindowInfo;
		};
		
		Game_Battler.prototype.loadTextStateToBalloonWindow = function() {
		};
		
		//for YEP_X_ActSeqPack2
		Game_Battler.prototype.actionLoadTextStateToBalloonWindow = function(filename) {
			if (!this.canSpeak()) return;
			if (!this.autoBalloonWindowInfo.prefix || !this.autoBalloonWindowInfo.prefix.length) return;
			const textStateName = this.autoBalloonWindowInfo.prefix + filename;
			if (!TextStateManager.textState(textStateName)) {
				TextStateManager.createTextState(textStateName, textStateName);
			}
			$gameTemp.loadTextStateToBalloonWindow(textStateName, getObjectTargetNumber(this));
		};
		
		const _Game_Actor_setup = Game_Actor.prototype.setup;
		Game_Actor.prototype.setup = function() {
			_Game_Actor_setup.apply(this, arguments);
			this.setAutoBalloonWindowInfo();
		};
		
		Game_Actor.prototype.getDataBattler = function() {
			return $dataActors[this.actorId()];
		};
		
		Game_Actor.prototype.loadTextStateToBalloonWindow = function(textStateName) {
			if (disableMapAutoBalloonWindow && !$gameParty.inBattle()) return;
			if (!TextStateManager.textState(textStateName)) {
				TextStateManager.createTextState(textStateName, textStateName);
			}
			$gameTemp.loadTextStateToBalloonWindow(textStateName);
		}

		const _Game_Enemy_setup = Game_Enemy.prototype.setup;
		Game_Enemy.prototype.setup = function() {
			_Game_Enemy_setup.apply(this, arguments);
			this.setAutoBalloonWindowInfo();
		};
		
		Game_Enemy.prototype.getDataBattler = function() {
			return $dataEnemies[this.enemyId()];
		};
		
		Game_Enemy.prototype.loadTextStateToBalloonWindow = function(textStateName) {
			if (disableMapAutoBalloonWindow && !$gameParty.inBattle()) return;
			if (!TextStateManager.textState(textStateName)) {
				TextStateManager.createTextState(textStateName, textStateName);
			}
			//エネミーは末尾の"A"や"B"に対応するため強制ターゲットを利用する
			const forcedTarget = this._letter && this._letter.length ? getObjectTargetNumber(this) : undefined;
			$gameTemp.loadTextStateToBalloonWindow(textStateName, forcedTarget);
		}
		
		const _Game_Battler_performDamage = Game_Battler.prototype.performDamage;
		Game_Battler.prototype.performDamage = function() {
			_Game_Battler_performDamage.apply(this, arguments);
			this.createDamageBalloonWindow();
		};
		
		Game_Battler.prototype.createDamageBalloonWindow = function() {
			if (!this.canSpeak()) return;
			if (!this.autoBalloonWindowInfo.damage || !this.autoBalloonWindowInfo.damage.length) return;
			if (this.autoBalloonWindowInfo.damageSpeakPercent <= Math.random() ) return;
			const textStateName = this.autoBalloonWindowInfo.damage;
			this.loadTextStateToBalloonWindow(textStateName);
		};
		
		const _Game_Battler_performEvasion = Game_Battler.prototype.performEvasion;
		Game_Battler.prototype.performEvasion = function() {
			_Game_Battler_performEvasion.apply(this, arguments);
			this.createEvasionBalloonWindow();
		};

		const _Game_Battler_performMagicEvasion = Game_Battler.prototype.performMagicEvasion;
		Game_Battler.prototype.performMagicEvasion = function() {
			_Game_Battler_performMagicEvasion.apply(this, arguments);
			this.createEvasionBalloonWindow();
		};
		
		Game_Battler.prototype.createEvasionBalloonWindow = function() {
			if (!this.canSpeak()) return;
			if (!this.autoBalloonWindowInfo.evade || !this.autoBalloonWindowInfo.evade.length) return;
			if (this.autoBalloonWindowInfo.evadeSpeakPercent <= Math.random() ) return;
			const textStateName = this.autoBalloonWindowInfo.evade;
			this.loadTextStateToBalloonWindow(textStateName);
		};
		
		const _Game_Battler_performCollapse = Game_Battler.prototype.performCollapse;
		Game_Battler.prototype.performCollapse = function() {
			_Game_Battler_performCollapse.apply(this, arguments);
			this.createCollapseBalloonWindow();
		};
		
		Game_Battler.prototype.createCollapseBalloonWindow = function() {
			if (!this.autoBalloonWindowInfo.collapse || !this.autoBalloonWindowInfo.collapse.length) return;
			if (this.autoBalloonWindowInfo.collapseSpeakPercent <= Math.random() ) return;
			const textStateName = this.autoBalloonWindowInfo.collapse;
			this.loadTextStateToBalloonWindow(textStateName);
		};
		
		Game_Battler.prototype.createSkillBalloonWindow = function(filename) {
			if (!this.canSpeak()) return;
			if (!filename || !filename.length) return;
			this.loadTextStateToBalloonWindow(filename);
		};
		
		Game_Battler.prototype.createVictoryBalloonWindow = function() {
			if (!this.canSpeak()) return;
			if (!this.autoBalloonWindowInfo.victory || !this.autoBalloonWindowInfo.victory.length) return;
			const textStateName = this.autoBalloonWindowInfo.victory;
			this.loadTextStateToBalloonWindow(textStateName);
		};
		
		Game_Battler.prototype.createEngageBalloonWindow = function() {
			if (!this.canSpeak()) return;
			if (!this.autoBalloonWindowInfo.engage || !this.autoBalloonWindowInfo.engage.length) return;
			const textStateName = this.autoBalloonWindowInfo.engage;
			this.loadTextStateToBalloonWindow(textStateName);
		};
		
		//=====================================================================================================================
		// BattleManager
		//  スキル実行時のスキルデータ取得と表示の実行
		//=====================================================================================================================
		const _BattleManager_startAction = BattleManager.startAction;
		BattleManager.startAction = function() {
			const action = this._subject.currentAction();
			const battler = this._subject
			battler.createSkillBalloonWindow(getSkillFilename(action));
			_BattleManager_startAction.apply(this, arguments);
		};
		
		//For YEP_X_ActSeqPack2
		if (Imported.YEP_X_ActSeqPack2) {
			
			const _battleManege_processActionSequence = BattleManager.processActionSequence;
			BattleManager.processActionSequence = function(actionName, actionArgs) {			
				_battleManege_processActionSequence.apply(this, arguments);
				if (actionName.match(/BALLOONWINDOW[ ](.*)/i)) {
					return this.actionCreateBalloonWindow(getArgString(RegExp.$1), actionArgs);
				}
			};
			
			BattleManager.actionCreateBalloonWindow = function(filename, actionArgs) {
				const movers = this.makeActionTargets(actionArgs[0]);
				if (movers) {
					movers.forEach((mover) => {
						mover.actionLoadTextStateToBalloonWindow(filename);
					});
				}
				return false;
			};
			
		}
				
		//=====================================================================================================================
		// Game_Unit
		//  戦闘開始時の表示実行
		//=====================================================================================================================
		const _Game_Unit_onBattleStart = Game_Unit.prototype.onBattleStart;
		Game_Unit.prototype.onBattleStart = function() {
			_Game_Unit_onBattleStart.apply(this, arguments);
			this.createEngageBalloonWindow();
			//一部プラグインによるpeformVictory多重実行による過剰表示防止用
			this._createdVictoryBalloonWindow = false;
		};
		
		Game_Unit.prototype.createEngageBalloonWindow = function() {
			const members = this.members().filter((member) => {
				return member.canSpeak() && member.autoBalloonWindowInfo 
				&& member.autoBalloonWindowInfo.engage && member.autoBalloonWindowInfo.engage.length;
			});
			obtainRandomElement(members, maxEngageBattlerNumber).forEach((member) => {
				member.createEngageBalloonWindow();
			});
		};
		
		//=====================================================================================================================
		// Game_Party
		//  戦闘勝利時の表示実行
		//=====================================================================================================================
		const _Game_Party_performVictory = Game_Party.prototype.performVictory;
		Game_Party.prototype.performVictory = function() {
			if (!this._createdVictoryBalloonWindow) {
				this.createVictoryBalloonWindow();
				this._createdVictoryBalloonWindow = true;
			}
			_Game_Party_performVictory.apply(this, arguments);
		};
		
		Game_Party.prototype.createVictoryBalloonWindow = function() {
			const members = this.members().filter((member) => {
				return member.canSpeak() && member.autoBalloonWindowInfo 
				&& member.autoBalloonWindowInfo.victory && member.autoBalloonWindowInfo.victory.length;
			});
			obtainRandomElement(members, maxVictoryActorNumber).forEach((member) => {
				member.createVictoryBalloonWindow();
			});
		};
		
	}
	
})();