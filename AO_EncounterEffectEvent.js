//=============================================================================
// AO_EncounterEffectEvent.js
//=============================================================================
// Copyright (c) 2020 AO
// This software is released under the MIT License.
//
// コードの一部はMITライセンスのプラグイン製作者様のコードを参考にしています
// I appreciate great plugin creater's work.
//
/*:
* @plugindesc エンカウントエフェクト中コモンイベント
* @author AO
* 
*
* @help AO_EncounterEffectEvent.js ver1.00
* エンカウントエフェクト中にコモンイベントを強制発動させます
* エンカウントのエフェクトをピクチャ表示等で演出することが可能になります
*
* ※エフェクトの時間はプラグインパラメータで指定したフレーム数になります
* 実行するコモンイベントが全て終了していなくても
* 指定のフレーム数になると戦闘画面に移行するので
* プラグインパラメータかプラグインコマンドでフレーム数を適宜指定して下さい
*
* ※エフェクト用コモンイベントのIDを0とすることで機能を無効化できます
*
* ※キャラクター非表示を有効にした上でアニメーションを表示する場合は
* プラグインコマンド集(TkoolMV_PluginCommandBook)の
* 指定位置にアニメーションを表示するプラグインコマンドの利用を推奨します
*
* ===プラグインコマンド解説===
* プラグインパラメータで設定されている値は
* プラグインコマンドで上書きすることが可能です
* 各プラグインコマンドは戦闘開始処理前に実行する必要があります
*
* ENCOUNTER_EVENT_ID コモンイベントの番号
* 指定した番号のコモンイベントをエンカウントエフェクト時に実行します
* イベントのトリガーは無しのままでも実行されます
*
* DFAULT_ENCOUNTER_EFFECT ON
* DFAULT_ENCOUNTER_EFFECT OFF
* デフォルトのエンカウント画面エフェクトのオン・オフを切り替えます
* 
* DFAULT_ENCOUNTER_SOUND ON
* DFAULT_ENCOUNTER_SOUND OFF
* デフォルトのエンカウント時のサウンドのオン・オフを切り替えます
*
* CHARACTER_HIDING ON
* CHARACTER_HIDING OFF
* エンカウントエフェクト時にキャラクターを隠す処理をオン・オフにします
*
* AUTO_CLOSE_PICTURE ON
* AUTO_CLOSE_PICTURE OFF
* エンカウントエフェクト中に実行したピクチャの表示を
* エフェクト終了後に自動で削除する機能のオン・オフにします
*
* AUTO_CLEAR_FADE ON
* AUTO_CLEAR_FADE OFF
* エンカウントエフェクト中に実行した画面のフェードアウトを
* 戦闘開始前に自動でクリアする機能をオン・オフにします
*
* AUTO_CLEAR_TINT ON
* AUTO_CLEAR_TINT OFF
* エンカウントエフェクト中に実行した画面の色調変更を
* 戦闘開始前に自動でクリアする機能をオン・オフにします
*
* ENCOUNTER_EFFECT_SPPED フレーム数(整数)
* エンカウントエフェクトの長さをフレーム数で指定します
*
* RESET_ENCOUNTER_PARAMS
* エンカウントエフェクトに関するパラメータをプラグインパラメータ値に戻します
*
* ライセンスはMIT
* 改変歓迎です
*
* @param encounterCommonEventId
* @type number
* @min 0
* @default 0
* @desc エンカウントエフェクト中に発動するコモンイベント
*
* @param disableDefaultEncounterEffect
* @type boolean
* @on はい
* @off いいえ
* @default false
* @desc デフォルトのエンカウントエフェクトをオフにするか
*
* @param disableDefaultEncounterSound
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc デフォルトのエンカウントサウンドをオフにするか
*
* @param disableCharacterHiding
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc エフェクト中にキャラクターを隠す機能をオフにするか
*
* @param autoCloseGamePictures
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc エフェクト中コモンイベントで表示したピクチャを自動で消すか
*
* @param autoClearScreenFadeOut
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc エフェクト中コモンイベントの画面フェードアウトから自動で回復するか
*
* @param autoClearScreenTone
* @type boolean
* @on はい
* @off いいえ
* @default true
* @desc エフェクト中コモンイベントの画面色調変更を自動でクリアするか
*
* @param customEncounterSpeed
* @type number
* @min 0
* @default 60
* @desc エンカウントエフェクトのフレーム数
*
*/
 
/*
2020/7/11 初版ver1.00
*/

(function() {
    'use strict';
	const pluginName = 'AO_EncounterEffectEvent';
	const parameters = PluginManager.parameters(pluginName);
	const disableDefaultEncounterEffect = getArgBoolean(parameters.disableDefaultEncounterEffect);
	const disableDefaultEncounterSound = getArgBoolean(parameters.disableDefaultEncounterSound);
	const disableCharacterHiding = getArgBoolean(parameters.disableCharacterHiding);
	const autoCloseGamePictures = getArgBoolean(parameters.autoCloseGamePictures);
	const autoClearScreenFadeOut = getArgBoolean(parameters.autoClearScreenFadeOut);
	const autoClearScreenTone = getArgBoolean(parameters.autoClearScreenTone);
	const customEncounterSpeed = getArgNumber(parameters.customEncounterSpeed);
	const encounterCommonEventId = getArgNumber(parameters.encounterCommonEventId);
	
	function getArgString(arg, upperFlg) {
		if (typeof arg === "string") return upperFlg ? arg.toUpperCase().replace(/^\s+|\s+$/g, '') : arg.replace(/^\s+|\s+$/g, '');
		return "";
	}
	
	function getArgNumber(arg) {
		if (typeof arg === "string") {arg = arg.replace(/^\s+|\s+$/g,'');}
		else {return 0;}
		if (/^[+,-]?([1-9]\d*|0)$/g.test(arg)) {return parseFloat(arg || '0');}
		return 0;
	}
	
	function getArgBoolean(arg) {
		arg = typeof arg !== "boolean" ? getArgString(arg, true) : arg;
		return arg === "T" || arg === "TRUE" || arg === "ON" || arg === true;
	}
	
	//基本パラメータオブジェクト取得
	function getEncounterEventParameters() {
		const eventParameters = {};
		eventParameters.disableDefaultEncounterEffect = disableDefaultEncounterEffect;
		eventParameters.disableDefaultEnounterSound = disableDefaultEncounterSound;
		eventParameters.disableCharacterHiding = disableCharacterHiding;
		eventParameters.autoCloseGamePictures = autoCloseGamePictures;
		eventParameters.autoClearScreenFadeOut = autoClearScreenFadeOut;
		eventParameters.autoClearScreenTone = autoClearScreenTone;
		eventParameters.customEncounterSpeed = customEncounterSpeed;
		eventParameters.encounterCommonEventId = encounterCommonEventId;
		return eventParameters;
	}
	
	//=====================================================================================================================
	//Game_Interpreter
	//  プラグインコマンド定義
	//  ピクチャの登録と強制アップデート定義
	//=====================================================================================================================
	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		this.pluginCommandEncounterEffectEvent(command, args);
	};
	
	Game_Interpreter.prototype.pluginCommandEncounterEffectEvent = function(command, args) {
		const encounterEventParameters = $gameSystem.encounterEventParameters();
		switch(getArgString(command, true)) {
			case "DFAULT_ENCOUNTER_EFFECT":
				encounterEventParameters.disableDefaultEncounterEffect = !getArgBoolean(args[0]);
				break;
			case "DFAULT_ENCOUNTER_SOUND":
				encounterEventParameters.disableDefaultEncounterSound = !getArgBoolean(args[0]);
				break;
			case "CHARACTER_HIDING":
				encounterEventParameters.disableCharacterHiding = !getArgBoolean(args[0]);
				break;
			case "AUTO_CLOSE_PICTURE":
				encounterEventParameters.autoCloseGamePictures = getArgBoolean(args[0]);
				break;
			case "AUTO_CLEAR_FADE":
				encounterEventParameters.autoClearScreenFadeOut = getArgBoolean(args[0]);
				break;
			case "AUTO_CLEAR_TINT":
				encounterEventParameters.autoClearScreenTone = getArgBoolean(args[0]);
				break;
			case "ENCOUNTER_EFFECT_SPPED":
				encounterEventParameters.customEncounterSpeed = getArgNumber(args[0]);
				break;
			case "ENCOUNTER_EVENT_ID":
				encounterEventParameters.encounterCommonEventId = getArgNumber(args[0]);
				break;
			case "RESET_ENCOUNTER_PARAMS":
				$gameSystem.resetEncounterEffectParameters();
				break;
		}
	};
	
	const _Game_Interpreter_command231 = Game_Interpreter.prototype.command231;
	Game_Interpreter.prototype.command231 = function() {
		$gameTemp.resistGamePicture(this._params[0]);
		return _Game_Interpreter_command231.apply(this, arguments);
	};
	
	//シーン変更中はブレイクしていた処理を削除
	Game_Interpreter.prototype.forceUpdate = function() {
		while (this.isRunning()) {
			if (this.updateChild() || this.updateWait()) {
				break;
			}
			if (!this.executeCommand()) {
				break;
			}
			if (this.checkFreeze()) {
				break;
			}
		}
	};
	
	//=====================================================================================================================
	//Game_System
	//  イベントパラメータの保持
	//  画面エフェクト実行情報の保持
	//=====================================================================================================================
	const _Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		_Game_System_initialize.apply(this, arguments);
		this.clearEncounterEffectParameters();
	};
	
	Game_System.prototype.clearEncounterEffectParameters = function() {
		if (this._encounterEventParameters === undefined) {
			this._encounterEventParameters = getEncounterEventParameters();
		}
	};
	
	Game_System.prototype.resetEncounterEffectParameters = function() {
		this._encounterEventParameters = getEncounterEventParameters();
	};
	
	Game_System.prototype.encounterEventParameters = function() {
		return this._encounterEventParameters;
	};
	
	Game_System.prototype.encounterCommonEventIsActive = function() {
		return this._encounterEventParameters.encounterCommonEventId > 0;
	};
	
	//=====================================================================================================================
	//Game_Temp
	//  エフェクト中のコモンイベントで表示したピクチャの登録
	//  エフェクト実行中の画面色調変更等をフラグで保持
	//=====================================================================================================================
	Game_Temp.prototype.clearResistGamePictures = function() {
		this._resistedGamePictures = [];
	};
	
	Game_Temp.prototype.eraseResistedGamePicture = function() {
		if (!this._resistedGamePictures) return;
		if (!$gameSystem.encounterEventParameters().autoCloseGamePictures) return;
		this._resistedGamePictures.forEach((number) => {
			$gameScreen.erasePicture(number);
		});
	};
	
	Game_Temp.prototype.resistGamePicture = function(number) {
		this._resistedGamePictures.push(number);
	};
	
	Game_Temp.prototype.setInEncounterEffect = function() {
		this._inEncouterEffect = true;
	};
	
	Game_Temp.prototype.inEncounterEffect = function() {
		return this._inEncouterEffect;
	};
	
	Game_Temp.prototype.resetInEncounterEffect = function() {
		this._inEncouterEffect = false;
	};
	
	Game_Temp.prototype.setEncounterFadeOuted = function() {
		this._encounterFadeOuted = true;
	};
	
	Game_Temp.prototype.encounterFadeOuted = function() {
		return this._encounterFadeOuted;
	};
	
	Game_Temp.prototype.resetEncounterFadeOuted = function() {
		this._encounterFadeOuted = false;
	};
	
	Game_Temp.prototype.setEncounterToneChanged = function() {
		this._encounterToneChanged = true;
	};
	
	Game_Temp.prototype.encounterToneChanged = function() {
		return this._encounterToneChanged;
	};
	
	Game_Temp.prototype.resetEncounterToneChanged = function() {
		this._encounterToneChanged = false;
	};
	
	//=====================================================================================================================
	//Game_Screen
	//  フェードアウトと色調変更情報の登録
	//  
	//=====================================================================================================================
	const _Game_Screen_startFadeOut = Game_Screen.prototype.startFadeOut;
	Game_Screen.prototype.startFadeOut = function(duration) {
		_Game_Screen_startFadeOut.apply(this, arguments);
		if ($gameTemp.inEncounterEffect() && $gameSystem.encounterEventParameters().autoClearScreenFadeOut) {
			$gameTemp.setEncounterFadeOuted();
		}
	};
	
	const _Game_Screen_startTint = Game_Screen.prototype.startTint;
	Game_Screen.prototype.startTint = function(tone, duration) {
		_Game_Screen_startTint.apply(this, arguments);
		if ($gameTemp.inEncounterEffect() && $gameSystem.encounterEventParameters().autoClearScreenTone) {
			$gameTemp.setEncounterToneChanged();
		}
	};
	
	//=====================================================================================================================
	//Scene_Map
	//  エンカウントエフェクトの制御
	//  一時情報の消去
	//=====================================================================================================================
	const _Scene_Map_launchBattle = Scene_Map.prototype.launchBattle;
	Scene_Map.prototype.launchBattle = function() {
		$gameTemp.clearResistGamePictures();
		$gameTemp.setInEncounterEffect();
		if ($gameSystem.encounterCommonEventIsActive() && $gameSystem.encounterEventParameters().disableDefaultEncounterSound) {
			BattleManager.saveBgmAndBgs();
			this.stopAudioOnBattleStart();
			this.startEncounterEffect();
			this._mapNameWindow.hide();
		} else {
			_Scene_Map_launchBattle.apply(this, arguments);
		}
		this.snapForBattleBackground();
	};

	const _Scene_Map_startEncounterEffect = Scene_Map.prototype.startEncounterEffect;
	Scene_Map.prototype.startEncounterEffect = function() {
		if ($gameSystem.encounterCommonEventIsActive() && $gameSystem.encounterEventParameters().disableCharacterHiding) {
			this._encounterEffectDuration = this.encounterEffectSpeed();
		} else {
			_Scene_Map_startEncounterEffect.apply(this, arguments);
		}
		this.createEncounterEvent();
	};
	
	Scene_Map.prototype.createEncounterEvent = function() {
		if ($gameSystem.encounterCommonEventIsActive()) {
			const commonEvent = $dataCommonEvents[$gameSystem.encounterEventParameters().encounterCommonEventId];
			const interpreter = new Game_Interpreter();
			interpreter.setup(commonEvent.list);
			this._encounterEventInterpreter = interpreter;
		}
	};
	
	Scene_Map.prototype.updateEncounterEventInterpreter = function() {
		const interpreter = this._encounterEventInterpreter;
		if (interpreter) {
			interpreter.forceUpdate();
		}
	};
	
	const _Scene_Map_updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
	Scene_Map.prototype.updateEncounterEffect = function() {
		if ($gameSystem.encounterCommonEventIsActive() && $gameSystem.encounterEventParameters().disableDefaultEncounterEffect) {
			if (this._encounterEffectDuration > 0) {
				this._encounterEffectDuration--;
			}
		} else {
			_Scene_Map_updateEncounterEffect.apply(this, arguments);
		}
		this.updateEncounterEventInterpreter();
	};
	
	const _Scene_Map_encounterEffectSpeed = Scene_Map.prototype.encounterEffectSpeed;
	Scene_Map.prototype.encounterEffectSpeed = function() {
		const encounterSpeed = $gameSystem.encounterEventParameters().customEncounterSpeed;
		return  $gameSystem.encounterCommonEventIsActive() && encounterSpeed ? encounterSpeed : _Scene_Map_encounterEffectSpeed.apply(this, arguments);
	};
	
	const _Scene_Map_terminate = Scene_Map.prototype.terminate;
	Scene_Map.prototype.terminate = function() {
		$gameTemp.eraseResistedGamePicture();
		$gameTemp.clearResistGamePictures();
		$gameTemp.resetInEncounterEffect();
		_Scene_Map_terminate.apply(this, arguments);
		this._snapedForBattle = false;
	};
	
	//戦闘背景にエフェクトが入らないようにタイミングを変更して実行される
	const _Scene_Map_snapForBattleBackground = Scene_Map.prototype.snapForBattleBackground;
	Scene_Map.prototype.snapForBattleBackground = function() {
		if (!this._snapedForBattle) {
			this._spriteset.hideCharactersForSnap();
			_Scene_Map_snapForBattleBackground.apply(this, arguments);
			if ($gameSystem.encounterEventParameters().disableCharacterHiding) {
				this._spriteset.showCharactersForSnap();
			}
		}
		this._snapedForBattle = true;
	};
	
	//=====================================================================================================================
	//Spriteset_Map
	//  キャラクター再表示関数の定義
	//  キャラクター非表示処理再定義
	//=====================================================================================================================
	Spriteset_Map.prototype.hideCharactersForSnap = function() {
		this._characterSprites.forEach((sprite) => {
			if (!sprite.isTile() && sprite.visible) {
				sprite._hidedForSnap = true
				sprite.hide();
			}
		});
	};
	
	Spriteset_Map.prototype.showCharactersForSnap = function() {
		for (let i = 0; i < this._characterSprites.length; i++) {
			const sprite = this._characterSprites[i];
			if (!sprite.isTile() && sprite._hidedForSnap) {
				sprite.show();
				sprite._hidedForSnap = false;
			}
		}
	};
	
	//=====================================================================================================================
	//Scene_Battle
	//  画面エフェクトの自動消去
	//  
	//=====================================================================================================================
	const _Scene_Battle_start = Scene_Battle.prototype.start;
	Scene_Battle.prototype.start = function() {
		this.resetEncounterScreenEffect();
		_Scene_Battle_start.apply(this, arguments);
	};
	
	Scene_Battle.prototype.resetEncounterScreenEffect = function() {
		if ($gameTemp.encounterFadeOuted()) {
			$gameScreen.clearFade();
			$gameTemp.resetEncounterFadeOuted();
		}
		if ($gameTemp.encounterToneChanged()) {
			$gameScreen.clearTone();
			$gameTemp.resetEncounterToneChanged();
		}
	};
	
})();