//=============================================================================
// AO_WeatherEffect.js
//=============================================================================
// Copyright (c) 2020 AO
// This software is released under the MIT License.
//
// コードの一部はMITライセンスのプラグイン製作者様のコードを参考にしています
// I appreciate great plugin creater's work.
/*
2020/3/15 初版ver1.00
2020/3/18 ver1.001 bitmapのロード終了前にSunLightエフェクトの描写が始まると描写位置がずれる事がある問題の修正
*/
/*:
 * @plugindesc 天候画面エフェクトを追加
 * @author AO
 *
 * @param 雷エフェクト画面フラッシュ
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 * @desc 雷エフェクト時に画面をフラッシュするか(true/false)
 *
 * @param 雷効果音の種類
 * @desc 雷エフェクト時の効果音
 * @type file
 * @default Thunder9
 * @dir audio/se
 *
 * @param 雷効果音音量
 * @desc 雷効果音の音量
 * @default 30
 * @min 0
 * @type number
 *
 * @param 室内効果音音量抑制
 * @desc 雷効果音の音量抑制割合(パーセント)
 * @default 25
 * @min 0
 * @type number
 *
 * @help AO_WeatherEffect ver 1.001
 * デフォルトの天候とは別の仕組みを持つ
 * 天候の画面エフェクトを追加します
 *
 * ※天候を描写するためにはimg/weatherEffectsフォルダに画像(png)が必要です
 * weatherEffectsフォルダが無い場合は作成し、そこに必要なpng画像を配置してください
 *
 * =====プラグインコマンド解説=====
 * <天候エフェクト作製コマンド>
 * "CREATE_WEATHER_EFFECT ID 画像名 エフェクト番号 強さ 時間 拡大率X 拡大率Y 回転 画像アニメーションウエイト"
 * IDにエフェクト番号の動きの画像名エフェクトを追加します
 * 同一IDに新しいエフェクト作製コマンドを行うと上書きされます
 * 回転は現在”太陽光”エフェクトのみで有効です
 *
 * 例)
 * CREATE_WEATHER_EFFECT 1 Rain 1 500 300 100 100 0 60
 * ID1番に"Rain.png"の画像を雨エフェクトとして強さ500に300フレームで追加
 * スプライトの拡大率はX100%、Y100%、回転は0度
 *
 * <エフェクト番号一覧>
 * 0:ランダムライト, 1:雨, 2:雪, 3:太陽光
 * 4:雲, 5:雲の影, 6:霧
 * 7:雷, 8:落ち葉, 9:上昇するライト
 * 10:下降するライト
 *
 * エフェクトの雨・雪・雲・雲の影・落ち葉は
 * 風の影響を受けて横方向に移動します
 * 
 * 雷エフェクトおよび太陽光エフェクト・各種ライトエフェクトは
 * AO_LightingSystem.jsと連動します
 * ある程度の負荷が見込まれるので
 * PCダウンロード利用を想定の方向けです
 * https://raw.githubusercontent.com/AoNBTI/RPGMakerMV/master/AO_LightingSystem.js
 * どちらのプラグインを上に配置しても動作します
 * 天候エフェクトの表示を上にしたい方はこのプラグインを下に
 * ライティングエフェクトを上に表示したい方はこのプラグインを上に配置してください
 * 
 * <エフェクトスプライトのアニメーション>
 * 天候を描写するためにはimg/weatherEffectsフォルダに画像(png)が必要です
 * 事前にimgフォルダ内にweatherEffectsフォルダを作製して画像(pngファイル)をおいて下さい
 * 画像のファイル名に[行x列]と記載することで
 * そのファイルを読み込んだスプライトをアニメーションさせる事が可能です
 * アニメーションは必須ではありません
 * デフォルトでは末尾までアニメーションが再生されると逆再生が始まりますが
 * 画像ファイル名に[NR]と記載すると最初のコマに戻ります
 * 例） Effect[3x5][NR].png
 * 逆再生ループなしで3行5列のアニメーションを持つエフェクトのファイル名
 *
 * <天候エフェクト削除コマンド>
 * REMOVE_WEATHER_EFFECT ID 時間
 * IDの天候エフェクトを指定した時間をかけて削除します
 *
 * 例)
 * REMOVE_WEATHER_EFFECT 2 400
 * ID2番のエフェクトを400フレームで削除
 *
 * <風設定コマンド>
 * SET_WEATHER_WIND 強さ 時間
 * 強さ(整数)の風を時間をかけて適応します
 * 強さの値は正負の整数を設定可能で
 * 負の値だと画面右から左へ
 * 正の値だと画面左から右へ
 * 風の強さが設定されます
 *
 * 例)
 * SET_WEATHER_WIND -15 200
 * 強さ-15の風を200フレームで設定
 *
 *
 * =====マップメモ欄設定解説=====
 * マップのメモ欄に以下の記載をすること
 * そのマップではエフェクト表示を無効化します
 * <DISABLE_WEATHER_EFFECT>
 *
 * 天候エフェクトによる音再生を無効化する場合は
 * マップのメモ欄に以下の記載を追加します
 * <DISABLE_WEATHER_SOUND>
 *
 * 天候エフェクトによる音再生を抑制するマップ(室内など)では
 * マップのメモ欄に以下の記載をします
 * <MUFFLE_WEATHER_SOUND>
 * 
 * ライセンスはMIT
 * 改変歓迎です
 *
 */

var Imported = Imported || {};
Imported.AO_WeatherEffect = true;
 
(function() {
	'use strict';
	const pluginName = 'AO_WeatherEffect';
	const parameters = PluginManager.parameters(pluginName);
	const disableWeatherEffectTag = "DISABLE_WEATHER_EFFECT";
	const disableWeatherSoundTag = "DISABLE_WEATHER_SOUND";
	const muffleWeatherSoundTag = "MUFFLE_WEATHER_SOUND";
	
	const thunderFlashScreen = getArgBoolean(parameters["雷エフェクト画面フラッシュ"]);
	const thunderFlashScreenInner = false;
	const thunderSe = getArgString(parameters["雷効果音の種類"]);
	const thunderSeVolume = getArgNumber(parameters["雷効果音音量"]);
	const muffleWeatherSoundRate = normalizePercentage(getArgNumber(parameters["室内効果音音量抑制"]));
	
	const weatherEffectDirectory = "img/weatherEffects/";
	
	const graphicsRectPaddingRate = 1;
	const rebornRectPaddingRate = 2;
	const drawingRectPaddingRate = 2;
	
	const rebornWait = 5;
	const rainMoveSpeed = 4;
	const snowMoveSpeed = 1;
	const fallenLeaveMoveSpeed = 0.75;
	
	const rebornTypes = {
						"inScreen": 0,
						"topLeft": 7,  "left": 4, "bottomLeft": 1,
						"top": 8, "center": 5, "bottom": 2, 
						"topRight": 9, "right": 6, "bottomRight": 3,
						"topLeftOut": 10, "topOut": 11, "topRightOut": 12,
						"leftOut": 13, "rightOut": 14,
						"bottomLeftOut": 15, "bottomOut": 16, "bottomRightOut": 17
						}
	const rebornTwoWays = [7, 1, 9, 3, 10, 12, 15, 17];
	const fadeDuration = 60;
	const effectTypes = {
						"default": 0, "rain": 1, "snow": 2, "sunLight": 3,
						"cloud": 4, "cloudShadow": 5, "fog": 6,	"thunder": 7,
						"fallenLeaves": 8, "risingLight": 9, "settingLight": 10,
						}
	const updateTypes = {
						"standard": 0, "rain": 1, "snow": 2, "sunLight": 3,
						"cloud": 4, "fog": 5, "thunder": 6,	"fallenLeaves": 7,
						"rise": 8, "set": 9
						}
	
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
		arg = getArgString(arg, true);
		return arg === "T" || arg === "TRUE" || arg === "ON";
	}
	
	function toRadian(degree) {
		return degree * Math.PI / 180;
	}
	
	function normalizePercentage(percentage) {
		return Math.floor(percentage) / 100;
	}
	
	function setEffectFilename(effect, filename) {
		effect.filename = filename;
	}
	
	function setEffectSpriteScale(effect, scaleX, scaleY) {
		scaleX = scaleX === undefined ? 1 : scaleX;
		scaleY = scaleY === undefined ? 1 : scaleY;
		effect.spriteScale.x = scaleX;
		effect.spriteScale.y = scaleY;
	}
	
	function setEffectRotation(effect, rotation) {
		rotation = rotation === undefined ? 0 : rotation;
		effect.rotation = rotation;
	}
	
	function setEffectAnimationWait(effect, animationWait) {
		animationWait = animationWait === undefined ? 24 : animationWait;
		effect.animationWait = animationWait;
	}
	
	
	//=====================================================================================================================
	//WeatherEffectプリセット各種作製
	//  weatherEffectObject()から取得されるオブジェクトを元に必要な情報を書き換える形式(各プロパティの詳細はweatherEffectObject()を参照)
	//  必要ならパラメータ書き換えでエフェクトを編集できるはず
	//=====================================================================================================================
	function createEffectSnow(effect) {
		effect.type = effectTypes.snow;
		effect.updateType = updateTypes.snow;
		effect.z = 5;
		effect.blendMode = 3;
		effect.windEffect = true;
		effect.windEffectRate = 0.15;
		effect.anchor = new Point(0.5, 0.25);
		return effect;
	}
	
	function createEffectRain(effect) {
		effect.z = 5;
		effect.type = effectTypes.rain;
		effect.updateType = updateTypes.rain;
		effect.windEffect = true;
		effect.windEffectRate = 0.25;
		return effect;
	}
	
	function createEffectSunLight(effect) {
		effect.type = effectTypes.sunLight;
		effect.updateType = updateTypes.sunLight;
		effect.light = true;
		effect.z = 7;
		effect.anchor.y = 0.0;
		effect.anchor.x = 0.5;
		effect.blendMode = 1;
		effect.screenBind = true;
		effect.rebornWait = 360;
		effect.rebornType = rebornTypes.top;
		effect.windEffect = false;
		effect.windEffectRate = 0;
		return effect;
	}
	
	function createEffectCloud(effect) {
		effect.type = effectTypes.cloud;
		effect.updateType = updateTypes.cloud;
		effect.blendMode = 0;
		effect.windEffectRate = 0.08;
		effect.z = 6;
		effect.rebornWait = 600;
		return effect;
	}
	
	function createEffectCloudShadow(effect) {
		effect.type = effectTypes.cloudShadow;
		effect.updateType = updateTypes.cloud;
		effect.blendMode = 2;
		effect.windEffectRate = 0.05;
		effect.z = 1;
		effect.rebornWait = 600;
		return effect;
	}
	
	function createEffectFog(effect) {
		effect.type = effectTypes.fog;
		effect.updateType = updateTypes.fog;
		effect.blendMode = 0;
		effect.windEffect = false;
		effect.rebornWait = 600;
		effect.z = 4;
		return effect;
	}
	
	function createEffectThunder(effect) {
		effect.type = effectTypes.thunder;
		effect.updateType = updateTypes.thunder;
		effect.light = true;
		effect.z = 7;
		effect.anchor.y = 0;
		effect.anchor.x = 0.5;
		effect.rotation = 0;
		effect.blendMode = 1;
		effect.rebornWait = 0;
		effect.screenBindY = true;
		effect.rebornType = rebornTypes.top;
		effect.windEffect = false;
		return effect;
	}
	
	function createEffectFallenLeaves(effect) {
		effect.type = effectTypes.fallenLeaves;
		effect.updateType = updateTypes.fallenLeaves;
		effect.rebornWait = 60;
		effect.windEffect = true;
		effect.windEffectRate = 0.15;
		return effect;
	}
	
	function createEffectRisingLight(effect) {
		effect.type = effectTypes.risingLight;
		effect.updateType = updateTypes.rise;
		effect.light = true;
		effect.rebornWait = 360;
		effect.blendMode = 1;
		effect.z = 3;
		effect.windEffect = false;
		return effect;
	}
	
	function createEffectSettingLight(effect) {
		effect.type = effectTypes.settingLight;
		effect.updateType = updateTypes.set;
		effect.light = true;
		effect.rebornWait = 360;
		effect.blendMode = 1;
		effect.z = 3;
		effect.windEffect = false;
		return effect;
	}
	
	function createEffectRandomLight(effect) {
		effect.light = true;
		effect.z = 3;
		effect.blendMode = 1;
		return effect;
	}
	
	//=====================================================================================================================
	//WeatherEffectObject
	//  各種エフェクトプリセットに利用される基本オブジェクトの生成
	//  
	//=====================================================================================================================
	function weatherEffectObject() {
		return {
			//基本再生情報用。必須
			"id": -1, "active" : true, "toDisable": false, "removable": false,
			
			//エフェクト関連情報
			//エフェクトのタイプ名とアップデートのタイプ
			"type": effectTypes.default, "updateType": updateTypes.standard,
			//pngファイル名, 画像ファイルによるアニメーションのウエイト, 画面に固定するか, X座標を画面に固定するか, Y座標を画面に固定するか
			"filename": "TestLight[2x2]", "animationWait": 60, "screenBind": false, "screenBindX": false, screenBindY: false,
			//リボーンのタイプ, オートリボーンフラグ(アップデートで設定される), リフレッシュが必要か, リボーン時(マップ切り替え時等)のアニメーション自動早送りウエイト
			"rebornType": rebornTypes.inScreen, "rebornAuto": false, "needRefresh": false, "rebornWait": 5, 
			
			//エフェクトスプライトの表示パラメータ
			"spriteScale": {"x": 1, "y": 1}, "spriteOpacity": 255, "spriteMoveSpeedRate": 1, "spriteRotationRate": 1,
			
			//スプライトの初期パラメータ
			"blendMode":0, "anchor": {"x": 0.5, "y": 0.5}, "scale": {"x": 1, "y": 1}, "rotation": 0, "z": 3,
			
			//ライティングプラグイン用フラグとZ軸値
			"light": false, "lightingZ": 7, 
			
			//エフェクトのパワー、パワー目標値、パワーのアップデート時間
			"power": 0, "powerTarget": 0, "powerDuration": 0,
			
			//風の影響を受けるか、受けて傾いて表示されるか
			"windEffect": true, "windAngled": true, "windEffectRate": 0.25, 
		}
	}
	
	function copyWeatherEffectObject(effect, effectOrg) {
		if (!effectOrg) effectOrg = weatherEffectObject();
		effect.id = effectOrg.id;
		effect.type = effectOrg.type;
		effect.updateType = effectOrg.updateType;
		effect.filename = effectOrg.filename;
		effect.screenBind = effectOrg.screenBind;
		effect.rebornType = effectOrg.rebornType;
		effect.spriteScale = effectOrg.spriteScale;
		effect.spriteOpacity = effectOrg.spriteOpacity;
		effect.spriteMoveSpeedRate = effectOrg.spriteMoveSpeedRate;
		effect.blendMode = effectOrg.blendMode;
		effect.anchor = effectOrg.anchor;
		effect.scale = effectOrg.scale;
		effect.light = effectOrg.light;
		effect.lightingZ = effectOrg.lightingZ;
		effect.power = effectOrg.power;
		effect.powerTarget = effectOrg.powerTarget;
		effect.powerDuration = effectOrg.powerDuration;
		effect.windEffect = effectOrg.windEffect;
		effect.windAngled = effectOrg.windAngled;
		effect.windEffectRate = effectOrg.windEffectRate;
	}
	
	//=====================================================================================================================
	//Game_Interpreter
	//  プラグインコマンド定義
	//  
	//=====================================================================================================================
	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		this.pluginCommandWeatherEffect(command, args);
	};
	
	Game_Interpreter.prototype.pluginCommandWeatherEffect = function(command, args) {
		let id, filename, effectType, power, duration, scaleX, scaleY, effectRotation, animationWait;
		switch(command) {
			case "CREATE_WEATHER_EFFECT":
				id = args.length >= 0 ? getArgNumber(args[0]) : 0;
				filename = args.length > 0 ? getArgString(args[1]) : "";
				effectType = args.length > 1 ? getArgNumber(args[2]) : 0;
				power = args.length > 2 ? getArgNumber(args[3]) : 0;
				duration = args.length > 3 ? getArgNumber(args[4]) :0;
				scaleX = args.length > 4 ? getArgNumber(args[5]) : 100;
				scaleY = args.length > 5 ? getArgNumber(args[6]) : 100;
				effectRotation = args.length > 6 ? getArgNumber(args[7]) : 0;
				animationWait = args.length > 7 ? getArgNumber(args[8]) : 24;
				$gameTemp.createWeatherEffect(id, filename, effectType, power, duration, scaleX, scaleY, effectRotation, animationWait);
				break;
			case "REMOVE_WEATHER_EFFECT":
				id = args.length >= 0 ? getArgNumber(args[0]) : 0;
				duration = args.length > 0 ? getArgNumber(args[1]) : 0;
				$gameTemp.removeWeatherEffect(id, duration);
				break;
			case "SET_WEATHER_WIND":
				power = args.length >= 0 ? getArgNumber(args[0]) : 0;
				duration = args.length > 0 ? getArgNumber(args[1]) : 0;
				$gameTemp.setWindPower(power, duration);
				break;
		}
	};
	
	//=====================================================================================================================
	//Game_Temp
	//  各種スクリプトコマンドの提供
	//  新規エフェクト追加時はcreateWeatherEffectに条件分岐を追加する必要あり
	//=====================================================================================================================
	Game_Temp.prototype.createWeatherEffect = function(id, filename, effectType, power, duration, scaleX, scaleY, effectRotation, animationWait) {
		const effectOrg = WeatherEffectManager.effect(id);
		const effect = weatherEffectObject();
		copyWeatherEffectObject(effect, weatherEffectObject());
		setEffectFilename(effect, filename);
		setEffectSpriteScale(effect, normalizePercentage(scaleX), normalizePercentage(scaleY));
		setEffectRotation(effect, effectRotation);
		setEffectAnimationWait(effect, animationWait);
		switch (effectType) {
			case effectTypes.rain:
				createEffectRain(effect);
				break;
			case effectTypes.snow:
				createEffectSnow(effect);
				break;
			case effectTypes.sunLight:
				createEffectSunLight(effect);
				break;
			case effectTypes.cloud:
				createEffectCloud(effect);
				break;
			case effectTypes.cloudShadow:
				createEffectCloudShadow(effect);
				break;
			case effectTypes.fog:
				createEffectFog(effect);
				break;
			case effectTypes.thunder:
				createEffectThunder(effect);
				break;
			case effectTypes.fallenLeaves:
				createEffectFallenLeaves(effect);
				break;
			case effectTypes.risingLight:
				createEffectRisingLight(effect);
				break;
			case effectTypes.settingLight:
				createEffectSettingLight(effect);
				break;
			default:
				createEffectRandomLight(effect);
				break;
		}
		effect.id = id;
		if (effectOrg) effect.needRefresh = true;
		effect.powerTarget = power;
		effect.powerDuration = duration;
		$gameScreen.addWeatherEffect(effect);
	}
	
	Game_Temp.prototype.removeWeatherEffect = function(id, duration) {
		const effect = WeatherEffectManager.effect(id);
		if (effect) {
			effect.toDisable = true;
			effect.powerTarget = 0;
			effect.powerDuration = duration;
		}
	};
	
	Game_Temp.prototype.setWindPower = function(power, duration) {
		WeatherEffectManager.setWindPower(power, duration);
	};
	
	//=====================================================================================================================
	//WeatherEffectManager
	//  エフェクトデータとそのエフェクトのコンテナを結びつけて管理
	//  画面サイズとスクロール情報の保持
	//  風情報を保持してエフェクトに提供
	//=====================================================================================================================
	class WeatherEffectManager {
		constructor() {		
		}
		
		static initialize() {
			if (this.effectSets === undefined) {this.clearEffectSets();}
			if (this._graphicsRect === undefined) {this.refreshGraphicsRect();}
			if (this._drawingRect === undefined) {this.refreshDrawingRect();}
			if (this._rebornRects === undefined) {this.refreshRebornRects();}
			
			if (this._windPower === undefined) {
				if ($gameScreen._windPower) {
					this.setWindPower($gameScreen._windPower, 0);
				} else {
					this.setWindPower(0, 0);
				}
			}
		}
		
		static clearEffectSets() {
			this.effectSets = [];
		}
		
		static refreshGraphicsRect() {
			const x = - Graphics.width * (graphicsRectPaddingRate - 1) / 2;
			const y = - Graphics.height * (graphicsRectPaddingRate - 1) / 2;
			this._graphicsRect = new PIXI.Rectangle(x, y, Graphics.width * graphicsRectPaddingRate, Graphics.height * graphicsRectPaddingRate);
		}
		
		static refreshDrawingRect() {
			const x = - Graphics.width * (drawingRectPaddingRate - 1) ;
			const y = - Graphics.height * (drawingRectPaddingRate - 1) ;
			const width = Graphics.width * ((drawingRectPaddingRate - 1)  * 2 + 1);
			const height = Graphics.height * ((drawingRectPaddingRate - 1)  * 2 + 1);
			this._drawingRect = new PIXI.Rectangle(x, y, width, height);
		}
		
		//トップレフト等の二方向レクトは、後からグラフィクスレクト座標を除外する
		static createRebornRect(rebornType) {
			let x, y, width, height;
			switch (rebornType) {
				case rebornTypes.top:
				case rebornTypes.topOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1) / 2;
					y = - Graphics.height * (rebornRectPaddingRate - 1);
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * (rebornRectPaddingRate - 1);
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.bottom:
				case rebornTypes.bottomOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1) / 2;
					y = Graphics.height;
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * (rebornRectPaddingRate - 1);
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.left:
				case rebornTypes.leftOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1);
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					width = Graphics.width * (rebornRectPaddingRate - 1);
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.right:
				case rebornTypes.rightOut:
					x = Graphics.width;
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					width = Graphics.width * (rebornRectPaddingRate - 1);
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.leftTop:
				case rebornTypes.topLeftOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1);
					y = - Graphics.height * (rebornRectPaddingRate - 1);
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.bottomLeft:
				case rebornTypes.bottomLeftOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1);
					y = 0;
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.topRight:
				case rebornTypes.topRightOut:
					x = 0;
					y = - Graphics.height * (rebornRectPaddingRate - 1);
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.right:
				case rebornTypes.rightOut:
					x = Graphics.width;
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					width = Graphics.width * (rebornRectPaddingRate - 1);
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.bottomRight:
				case rebornTypes.bottomRightOut:
					x = 0;
					y = 0;
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
				default:
					x = - Graphics.width * (rebornRectPaddingRate - 1) / 2;
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					width = Graphics.width * rebornRectPaddingRate;
					height = Graphics.height * rebornRectPaddingRate;
					return new PIXI.Rectangle(x, y, width, height);
			}
		}
		
		static refreshRebornRects() {
			const rects = {};
			rects.inScreen = this.createRebornRect();
			rects.topLeft = this.createRebornRect(rebornTypes.topLeft);
			rects.topLeftOut = this.createRebornRect(rebornTypes.topLeftOut);
			rects.top = this.createRebornRect(rebornTypes.top);
			rects.topOut = this.createRebornRect(rebornTypes.topOut);
			rects.topRight = this.createRebornRect(rebornTypes.topRight);
			rects.topRightOut = this.createRebornRect(rebornTypes.topRightOut);
			rects.left = this.createRebornRect(rebornTypes.left);
			rects.leftOut = this.createRebornRect(rebornTypes.leftOut);
			rects.right = this.createRebornRect(rebornTypes.right);
			rects.rightOut = this.createRebornRect(rebornTypes.rightOut);
			rects.bottomLeft = this.createRebornRect(rebornTypes.bottomLeft);
			rects.bottomLeftOut = this.createRebornRect(rebornTypes.bottomLeftOut);
			rects.bottom = this.createRebornRect(rebornTypes.bottom);
			rects.bottomOut = this.createRebornRect(rebornTypes.bottomOut);
			rects.bottomRight = this.createRebornRect(rebornTypes.bottomRight);
			rects.bottomRightOut = this.createRebornRect(rebornTypes.bottomRightOut);
			this._rebornRects = rects;
		}
		
		static rebornRect(rebornType) {
			const rebornKeys = Object.keys(rebornTypes).filter((key) => {
				return rebornTypes[key] === rebornType;
			});
			return rebornKeys.length ? this._rebornRects[rebornKeys[0]] : this._rebornRects.inScreen; 
		}
		
		static removalRect(rebornType) {
			let x, y;
			const width = Graphics.width * rebornRectPaddingRate;
			const height = Graphics.height * rebornRectPaddingRate;
			switch (rebornType) {
				case rebornTypes.top:
				case rebornTypes.topOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1) / 2;
					y = 0;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.bottom:
				case rebornTypes.bottomOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1) / 2;
					y = - Graphics.height * (rebornRectPaddingRate - 1);
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.left:
				case rebornTypes.leftOut:
					x = 0;
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.right:
				case rebornTypes.rightOut:
					x = Graphics.width;
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.leftTop:
				case rebornTypes.topLeftOut:
					x = 0;
					y = 0;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.bottomLeft:
				case rebornTypes.bottomLeftOut:
					x = 0;
					y = - Graphics.height * (rebornRectPaddingRate - 1);
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.topRight:
				case rebornTypes.topRightOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1);
					y = 0;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.right:
				case rebornTypes.rightOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1);
					y = - Graphics.height * (rebornRectPaddingRate - 1) / 2;
					return new PIXI.Rectangle(x, y, width, height);
				case rebornTypes.bottomRight:
				case rebornTypes.bottomRightOut:
					x = - Graphics.width * (rebornRectPaddingRate - 1);
					y = - Graphics.height * (rebornRectPaddingRate - 1);
					return new PIXI.Rectangle(x, y, width, height);
				default:
					return new PIXI.Rectangle(0, 0, 0, 0);
			}
		}
		
		static registEffect(effect) {
			if (!this.effectSets[effect.id]) {this.effectSets[effect.id] = {};}
			this.effectSets[effect.id].effect = effect;
		}
		
		static effect(effectId) {
			const effectSet = this.effectSets[effectId];
			return effectSet ? effectSet.effect : undefined;
		}
		
		static effects() {
			return this.effectSets.map((effectSet) => {
				if (effectSet && effectSet.effect) return effectSet.effect;
			});
		}
		
		static removeEffect(effect) {
			delete this.effectSets[effect.id];
		}
		
		static graphicsRect() {
			return this._graphicsRect;
		}
		
		static drawingRect() {
			return this._drawingRect;
		}
		
		//エフェクトセットオブジェクトにID文字列をキーにして登録。行儀が悪い気がするけど･･･。
		static registContainer(container) {
			if (this.effectSets[container.id]) {
				this.effectSets[String(container.id)].container = container;
			}
		}
		
		static clearContainers() {
			this.effectSets.forEach((effectSet) => {
				if (effectSet) effectSet.container = null;
			})
		};
		
		static effectContainer(effect) {
			const effectSet = this.effectSets[effect.id];
			return effectSet ? effectSet.container : undefined;
		}
		
		static hasContainer(effect) {
			return this.effectSets[effect.id] && this.effectSets[effect.id].container ? true : false;
		}
		
		static updateWeatherEffect(effect) {
			this.updateWeatherEffectPower(effect);
			this.updateWeatherWindPower(effect);
			//toDisableがtrueでdurationが0になるとactiveをfalseに。activeがfalseでGame_Screenから取り除かれる
			if (effect.powerDuration === 0 && effect.toDisable) {
				effect.active = false;
			}
		}
		
		static updateWeatherEffectPower(effect) {
			if (effect.powerDuration > 0) {
				effect.power = (effect.power * (effect.powerDuration - 1) + effect.powerTarget) / effect.powerDuration;
				effect.powerDuration--;
			} else if (effect.powerDuration === 0 && effect.power !== effect.powerTarget) {
				effect.power = effect.powerTarget;
			}
		}
		
		static updateWeatherWindPower(effect) {
			if (this._windPowerDuration > 0) {
				this._windPower = (this._windPower * (this._windPowerDuration - 1) + this._windPowerTarget) / this._windPowerDuration;
				this._windPowerDuration--;
				$gameScreen._windPower = this._windPower;
			} else if (this._windPowerDuration === 0 && this._windPower !== this._windPowerTarget) {
				this._windPower = this._windPowerTarget;
				$gameScreen._windPower = this._windPower;
			}
		}
		
		//風力保持。プラスで右方向、マイナスで左方向
		static windPower() {
			return this._windPower;
		}
		
		static setWindPower(power, duration) {
			if (this._windPower === undefined) {this._windPower = power;}
			this._windPowerTarget = power;
			this._windPowerDuration = duration;
		}
		
		static setScrollDirection(direction) {
			this._scrollDirection = direction;
		}
		
		static setScrollDistance(distance) {
			this._scrollDistance = distance;
		}
		
		static clearScrollParameters() {
			this._scrollDirection = 5;
			this._scrollDistance = 0;
		}
		
		static scrollParameters() {
			return {"direction": this._scrollDirection, "distance": this._scrollDistance};
		}
		
		static scrolledX() {
			switch(this._scrollDirection) {
				case 7:
				case 4:
				case 1:
					return - this._scrollDistance;
				case 9:
				case 6:
				case 3:
					return this._scrollDistance;
				default:
					return 0;
			}
		}
		
		static scrolledY() {
			switch(this._scrollDirection) {
				case 7:
				case 8:
				case 9:
					return - this._scrollDistance;
				case 1:
				case 2:
				case 3:
					return this._scrollDistance
				default:
					return 0;
			}
		}
		
		static flashScreen(red, green, blue, alpha, duration) {
			if (thunderFlashScreen && this.validEffect()) {
				$gameScreen.startFlash([red, green, blue, alpha], duration);
			}
		}
		
		static playSe(name, volume, pitch, pan) {
			if (this.validSound()) {
				if (this.validMuffleSound()) volume = volume * muffleWeatherSoundRate;
				AudioManager.playSe({"name": name, "volume": volume, "pitch": pitch, "pan": pan});	
			}
		}
		
		static validEffect() {
			return this._effectable;
		}
		
		static validSound() {
			return this._soundable;
		}
		
		static enableEffect() {
			this._effectable = true;
		}
		
		static disableEffect() {
			this._effectable = false;
		}
		
		static enableSound() {
			this._soundable = true;
		}
		
		static disableSound() {
			this._soundable = false;
		}
		
		static validMuffleSound() {
			return this._soundMuffle;
		}
		
		static enableMuffle() {
			this._soundMuffle = true;
		}
		
		static disableMuffle() {
			this._soundMuffle = false;
		}
		
		static refreshValidation() {
			this.refreshEffectValidation();
			this.refreshSoundValidation();
			this.refreshSoundMuffleValidation();
		}
		
		static refreshEffectValidation() {
			if ($gameMap.canWeatherEffects()) {
				this.enableEffect();
			} else {
				this.disableEffect();
			}
		}
		
		static refreshSoundValidation() {
			if ($gameMap.canWeatherSounds()) {
				this.enableSound();
			} else {
				this.disableSound();
			}
		}
		
		static refreshSoundMuffleValidation() {
			if ($gameMap.muffleWeatherSounds()) {
				this.enableMuffle();
			} else {
				this.disableMuffle();
			}
		}

	}

	//=====================================================================================================================
	//Game_Screen
	//  エフェクトデータ配列の保持
	//  
	//=====================================================================================================================
	const _Game_Screen_clear = Game_Screen.prototype.clear;
	Game_Screen.prototype.clear = function() {
		_Game_Screen_clear.apply(this, arguments);
		this.clearWeatherEffects();
		this.clearWeatherWindPower();
	};
	
	Game_Screen.prototype.clearWeatherEffects = function() {
		this._weatherEffects = [];
	};
	
	Game_Screen.prototype.weatherEffects = function() {
		return this._weatherEffects;
	};
	
	Game_Screen.prototype.addWeatherEffect = function(newEffect) {
		const effects = this._weatherEffects.filter((effect) => {
			return effect.id !== newEffect.id;
		});
		effects.push(newEffect);
		this._weatherEffects = effects
	};
	
	Game_Screen.prototype.removeWeatherEffect = function(effectId) {
		this._weatherEffects = this._weatherEffects.filter((effect) => {
			return effect.id !== effectId;
		});
	};
	
	const _Game_Screen_update = Game_Screen.prototype.update;
	Game_Screen.prototype.update = function() {
		_Game_Screen_update.apply(this, arguments);
		this.updateWeatherEffects();
	};
	
	Game_Screen.prototype.updateWeatherEffects = function() {
		this.refreshWeatherEffects();
		this._weatherEffects.forEach(function(effect) {
			WeatherEffectManager.updateWeatherEffect(effect);
		});
	};
	
	Game_Screen.prototype.refreshWeatherEffects = function() {
		this._weatherEffects = this._weatherEffects.filter((effect) => {
			return effect.removable === false;
		});
		//removableじゃないeffectは自動でマネージャにレジストするように
		const effects = WeatherEffectManager.effects();
		this._weatherEffects.forEach((effect) => {
			if (!effects.includes(effect)) {
				WeatherEffectManager.registEffect(effect);
			}
		});
	};
	
	Game_Screen.prototype.clearWeatherWindPower = function() {
		this._windPower = 0;
	};

	//=====================================================================================================================
	//Game_Map
	//  スクロール情報の登録
	//  メタ情報取得保持
	//=====================================================================================================================
	const _Game_Map_updateScroll = Game_Map.prototype.updateScroll;
	Game_Map.prototype.updateScroll = function() {
		WeatherEffectManager.clearScrollParameters();
		_Game_Map_updateScroll.apply(this, arguments);
	};
	
	const _Game_Map_scrollDown = Game_Map.prototype.scrollDown;
	Game_Map.prototype.scrollDown = function(distance) {
		const lastY = this._displayY;
		_Game_Map_scrollDown.apply(this, arguments);
		const newY = this._displayY;
		const moveDistance = newY - lastY;
		if (moveDistance !== 0) {
			WeatherEffectManager.setScrollDirection(2);
			WeatherEffectManager.setScrollDistance(moveDistance);
		}
	};
	
	const _Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
	Game_Map.prototype.scrollLeft = function(distance) {
		const lastX = this._displayX;
		_Game_Map_scrollLeft.apply(this, arguments);
		const newX = this._displayX;
		const moveDistance = lastX - newX;
		if (moveDistance !== 0) {
			WeatherEffectManager.setScrollDirection(4);
			WeatherEffectManager.setScrollDistance(moveDistance);
		}
	};
	
	const _Game_Map_scrollRight = Game_Map.prototype.scrollRight;
	Game_Map.prototype.scrollRight = function(distance) {
		const lastX = this._displayX;
		_Game_Map_scrollRight.apply(this, arguments);
		const newX = this._displayX;
		const moveDistance = newX - lastX;
		if (moveDistance !== 0) {
			WeatherEffectManager.setScrollDirection(6);
			WeatherEffectManager.setScrollDistance(moveDistance);
		}
	};
	
	const _Game_Map_scrollUp = Game_Map.prototype.scrollUp;
	Game_Map.prototype.scrollUp = function(distance) {
		const lastY = this._displayY;
		_Game_Map_scrollUp.apply(this, arguments);
		const newY = this._displayY;
		const moveDistance = lastY - newY;
		if (moveDistance !== 0) {
			WeatherEffectManager.setScrollDirection(8);
			WeatherEffectManager.setScrollDistance(moveDistance);
		}
	};
	
	const _Game_Map_setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function() {
		_Game_Map_setup.apply(this, arguments);
		this._canWeatherEffects = this.validateWeatherEffects();
		this._canWeatherSounds = this.validateWeatherSounds();
		this._muffleWeatherSounds = this.validateMufflingWeatherSounds()
	}
	
	Game_Map.prototype.canWeatherEffects = function() {
		return this._canWeatherEffects;
	}
	
	Game_Map.prototype.canWeatherSounds = function() {
		return this._canWeatherSounds;
	}
	
	Game_Map.prototype.muffleWeatherSounds = function() {
		return this._muffleWeatherSounds;
	}
	
	Game_Map.prototype.validateWeatherEffects = function() {
		return !$dataMap.meta.hasOwnProperty(disableWeatherEffectTag);
	};
	
	Game_Map.prototype.validateWeatherSounds = function() {
		return !$dataMap.meta.hasOwnProperty(disableWeatherSoundTag);
	};
	
	Game_Map.prototype.validateMufflingWeatherSounds = function() {
		return $dataMap.meta.hasOwnProperty(muffleWeatherSoundTag);
	}
	
	//=====================================================================================================================
	//Spriteset_Base
	//  天候エフェクト用レイヤーコンテナの作成
	//  
	//=====================================================================================================================
	const _Spriteset_Base_createLowerLayer = Spriteset_Base.prototype.createLowerLayer;
	Spriteset_Base.prototype.createLowerLayer = function() {
		WeatherEffectManager.initialize();
		_Spriteset_Base_createLowerLayer.apply(this, arguments);
		WeatherEffectManager.clearContainers();
		this.createWeaterLayer();
		WeatherEffectManager.refreshValidation();
	};
	
	Spriteset_Base.prototype.createWeaterLayer = function() {
		this._weatherLayer = new WeatherLayer();
		this.addChild(this._weatherLayer);
	};
	
	
	//=====================================================================================================================
	//WeatherLayer
	//  Game_Screenのエフェクトデータ配列を読み込んで、WeatherEffectContainerを作製削除する
	//  
	//=====================================================================================================================
	class WeatherLayer extends PIXI.Container {
		constructor() {
			super()
			this.initialize();
		}
		
		initialize() {
			this._width = Graphics.width;
			this._height = Graphics.height;
		}
		
		createEffectLayer(effect) {
			const container = new WeatherEffectContainer(effect.id);
			container.setup(effect);
			WeatherEffectManager.registContainer(container);
			this.addChild(container);
		}
		
		update() {
			this.refreshEffectLayers();
			this.updateEffectLayers();
		}
		
		//ゲームスクリーンに登録されたエフェクトでレイヤーが作製されていない場合は作成。
		//コンテイナーがリムーバブルにセットされるとコンテイナー側が自動で自身をレイヤーから削除。ウェザーエフェクトマネージャからは手動で削除
		//エフェクトのリムーバブルがTrueにセットされるとゲームスクリーン内から削除される
		//エフェクトの入れ替えによりリフレッシュが必要な場合はコンテナにセットアップ
		refreshEffectLayers() {
			const effects = $gameScreen.weatherEffects();
			effects.forEach((effect) => {
				if (effect.active === false) {
					const container = WeatherEffectManager.effectContainer(effect);
					if (container) container.removable = true;
					WeatherEffectManager.removeEffect(effect);
					effect.removable = true;
				} else if (!WeatherEffectManager.hasContainer(effect)) {
					this.createEffectLayer(effect);
				} else if (effect.needRefresh) {
					const container = WeatherEffectManager.effectContainer(effect);
					if (container) container.setup(effect);
					effect.needRefresh = false;
				}
			});
		}
		
		updateEffectLayers() {
			this.children.forEach((child) => {
				child.update();
			});
		}
		
	}

	//=====================================================================================================================
	//WeatherEffectContainer
	//  エフェクトのspriteを作製削除、配列として保持
	//  
	//=====================================================================================================================
	class WeatherEffectContainer extends PIXI.Container {
		
		constructor(id) {
			super();
			this.initialize(id);
		}
		
		initialize(id) {
			this.id = id;
			this._width = Graphics.width;
			this._height = Graphics.height;
			this._sprites = [];
			
			this.effect = null;
			this.origin = new Point(0, 0);
			this.removable = false;
		}
		
		setup(effect) {
			this.setEffect(effect);
			this.createRebornRect(effect);
		}
		
		setEffect(effect) {
			this.effect = effect;
		}
		
		createRebornRect(effect) {
			this.rebornRect = WeatherEffectManager.createRebornRect(effect.rebornType);
		}
		
		update() {
			this.updateRemove();
			this.updateOrigin();
			this.updateAllSprites();
		}
		
		updateRemove() {
			if (this.removable && this._sprites.length === 0) {
				this.parent.removeChild(this);
			}
		}
		
		updateOrigin() {
			if ($gameParty.inBattle() || this.effect.screenBind) return;
			if (!this.effect.screenBindX) this.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
			if (!this.effect.screenBindY) this.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
		}
		
		updateAllSprites() {
			this._sprites = this._sprites.filter((sprite) => {
				return sprite.parent;
			});
			const maxSprites = Math.floor(this.effect.power);
			
			//ここはいろいろ書き換える必要がありそうだぞ･･･
			while (this._sprites.length < maxSprites) {
				const fadeIn = this.effect.powerDuration > 0 || this._sprites.length === maxSprites - 1;
				this.addSprite(fadeIn);
			}
			while (this._sprites.filter((sprite) => {return !sprite._fadeOut}).length > maxSprites) {
				this.removeSprite();
			}
			
			this._sprites.forEach(function(sprite) {
				sprite.update();
				this.updateSprite(sprite);
			}, this);
			this.sortAllSprites();
		}
		
		updateSprite(sprite) {
			sprite.x = sprite.aX + sprite.shiftX - this.origin.x;
			sprite.y = sprite.aY + sprite.shiftY - this.origin.y;
			sprite.scale = sprite.aScale;
			sprite.opacity = sprite.aOpacity * sprite.opacityRate;
			sprite.rotation = sprite.aRotation;
		}
		
		sortAllSprites() {
			this._sprites.sort((spriteA, spriteB) => {
				const aZ = spriteA.z;
				const bZ = spriteB.z;
				if (aZ !== bZ) {return aZ - bZ;}
				//const aY = spriteA.y;
				//const bY = spriteB.y;
				//if (aY !== bY) {return aY - bY;}
				return spriteA.spriteId - spriteB.spriteId;
			})
		}
		
		addSprite(fadeIn) {
			const sprite = new Sprite_Effect();
			this._sprites.push(sprite);
			this.addChild(sprite);
			//セットアップ後にparentのパラメータを読み込むのでaddChild後に。前でも一応動くけど。
			sprite.setup(this.effect);
			if (fadeIn) {sprite.setFadeIn();}
			else {sprite.setInEffect();}
			
		}
		
		//スプライトはフェードアウトがセットされると、フェードアウト後に親から自身を取り除く
		removeSprite() {
			const sprites = this._sprites.filter((sprite) => {return sprite._fadeOut === false;})
			const sprite = sprites.pop();
			sprite.setFadeOut()
		}
		
	}
	
	//=====================================================================================================================
	//Sprite_Effect
	//  WeatherEffect専用スプライト
	//  各種アニメーションの再生
	//=====================================================================================================================
	class Sprite_Effect extends Sprite {
		initialize() {
			super.initialize();
			this.initMembers();
		}
		
		initMembers() {
			//アニメーション制御用パラメータ
			this.aX = 0;
			this.aY = 0;
			this.shiftX = 0;
			this.shiftY = 0;
			this.aScale = new Point(1, 1);
			this.aOpacity = 255;
			this.aRotation = 0.0;
			//アニメーション制御用デルタ値
			this._deltaPhase = 0;
			this._deltaCount = 0;
			this._deltaWait = 0;
			this._dX = 0;
			this._dY = 0;
			this._dScale = new Point(0, 0);
			this._dScaleRate = new Point(1, 1);
			this._dRandomScale = new Point(1, 1);
			this._dOpacity = 0;
			this._dOpacityRate = 0;
			this._dRotation = 0.0;
			
			this._deltaAnimationCompleted = false;
			
			//フェード用
			this._fadeIn = false;
			this._fadeOut = false;
			this._fadeDuration = 0;
			this.opacityRate = 1;
			
			//ファイル名で再生させるスプライトアニメーション用パラメータ
			//パーティクルコンテナ内では無効
			this._maxRow = 1;
			this._maxCol = 1;
			this._reverseLoop = true;
			this._reverse = false;
			this._animationCount = 0;
			this._animationWait = 1;
			this._pattern = 0;
			
			//リスボーン用
			this._maxWidth = 0;
			this._maxHeight = 0;
		}
		
		setup(effect) {
			this.bitmap = ImageManager.loadBitmap(weatherEffectDirectory, effect.filename, 0, true);
			this._url = this.bitmap._url;
			this.effect = effect;
			this.setEffectStatus(effect);
			this.bitmap.addLoadListener(
				this.updateFrame.bind(this)
			);
			this.reborn();
		}
		
		setEffectStatus(effect) {
			this.effectType = effect.type;
			this.updateType = effect.updateType;
			this.setFilename(effect.filename);
			this.setAnimationWait(effect.animationWait);
			
			this.blendMode = effect.blendMode;
			this.z = effect.z;
			this.scale.x = effect.scale.x;
			this.scale.y = effect.scale.y;
			this.anchor.x = effect.anchor.x;
			this.anchor.y = effect.anchor.y;
			this.rotation = toRadian(effect.rotation);
			
			if (effect.light) {
				this.setLight();
			} else {
				this.resetLight();
			}
			
			this.z = effect.z;
			
			this.windEffect = effect.windEffect;
			this.windAngled = effect.windAngled;
			this.windEffectRate = effect.windEffectRate;
			this.rebornWait = effect.rebornWait;
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
		
		setLight() {
			this.light = true;
			//For AO_LightingSystem
			if ($gameSystem.lightingManager && !this.registedLightingManager) {
				$gameSystem.lightingManager().registSprite(this, 1);
				this.registedLightingManager = true;
			}
		}
		
		resetLight() {
			this.light = false;
			//For AO_LightingSystem
			if ($gameSystem.lightingManager && this.registedLightingManager) {
				$gameSystem.lightingManager().removeSprite(this);
				this.registedLightingManager = false;
			}
		}
		
		setFadeIn() {
			this.opacityRate = 0;
			this._fadeIn = true;
			this._fadeOut = false;
			this._fadeDuration = fadeDuration;
		}
		
		//マップ移動時に進行したエフェクトを生成するため
		setInEffect() {
			this._fadeIn = false;
			this._fadeOut = false;
			let runningFrame = Math.randomInt(this.rebornWait) + this.rebornWait;
			while (runningFrame > 0) {
				this.updateTypeAnimation();
				runningFrame--;
			}
		}
		
		setFadeOut() {
			this._fadeIn = false;
			this._fadeOut = true;
			this._fadeDuration = fadeDuration;
		}
				
		update() {
			if (!this.bitmapIsReady()) return;
			super.update();
			this.updateFade();
			this._animationCount++;
			if (this._animationCount >= this.animationWait()) {
				this.updatePattern();
				this.updateFrame();
				this._animationCount = 0;
			}
			this.updateTypeAnimation();
			this.updateAnimationMembers();
			this.updateVisiblity();
			if (this.needReborn()) {
				if (this.needRefresh()) {
					this.refreshEffect();
				} else {
					this.reborn(true);
				}
			}
			
		}
		
		bitmapIsReady() {
			return this.bitmap && this.bitmap.isReady();
		}
		
		updateVisiblity() {
			if (this.inScreen() && WeatherEffectManager.validEffect()) {
				this.visible = true;
			} else {
				this.visible = false;
			}
		}
		
		updateFade() {
			if (this._fadeDuration > 0) {
				if (this._fadeIn) {
					this.opacityRate += 1 / fadeDuration;
				} else if (this._fadeOut) {
					this.opacityRate -= 1 / fadeDuration;
				}
				this.opacityRate.clamp(0, 1);
				this._fadeDuration--;
			}
			if (this._fadeDuration === 0 && this._fadeIn) {
				this.opacityRate = 1;
				this._fadeIn = false;
			}
			if (this._fadeDuration === 0 && this._fadeOut) {
				this.opacityRate = 0;
				if (this.parent) this.parent.removeChild(this);
				//For AO_LightingSystem
				if ($gameSystem.lightingManager && this.light && this.registedLightingManager) {$gameSystem.lightingManager().removeSprite(this);}
			}
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
		
		//レクト内にスプライトが存在するか判定する
		inRectangle(rect) {
			const spriteRect = this.getBounds(false);
			this.refreshMaxSize(spriteRect);
			//nineRectで判定してるのでスケールが大きすぎると漏れる
			//左端判定
			if (rect.contains(spriteRect.left, spriteRect.top)) return true;
			if (rect.contains(spriteRect.left, spriteRect.top + spriteRect.height / 4)) return true;
			if (rect.contains(spriteRect.left, spriteRect.top + spriteRect.height / 2)) return true;
			if (rect.contains(spriteRect.left, spriteRect.top + spriteRect.height / 4 * 3)) return true;
			if (rect.contains(spriteRect.left, spriteRect.bottom)) return true;
			//右端判定
			if (rect.contains(spriteRect.right, spriteRect.top)) return true;
			if (rect.contains(spriteRect.right, spriteRect.top + spriteRect.height / 4)) return true;
			if (rect.contains(spriteRect.right, spriteRect.top + spriteRect.height / 2)) return true;
			if (rect.contains(spriteRect.right, spriteRect.top + spriteRect.height / 4 * 3)) return true;
			if (rect.contains(spriteRect.right, spriteRect.bottom)) return true;
			//真ん中判定
			if (rect.contains(spriteRect.left + spriteRect.width / 2, spriteRect.top)) return true;
			if (rect.contains(spriteRect.left + spriteRect.width / 2, spriteRect.top + spriteRect.height / 4)) return true;
			if (rect.contains(spriteRect.left + spriteRect.width / 2, spriteRect.top + spriteRect.height / 2)) return true;
			if (rect.contains(spriteRect.left + spriteRect.width / 2, spriteRect.top + spriteRect.height / 4 * 3)) return true;
			if (rect.contains(spriteRect.left + spriteRect.width / 2, spriteRect.bottom)) return true;
			return false;
		}
		
		refreshMaxSize(spriteRect) {
			if (spriteRect.width > this._maxWidth) {
				this._maxWidth = spriteRect.width;
			}
			if (spriteRect.height > this._maxHeight) {
				this._maxHeight = spriteRect.height;
			}
		}
		
		inScreen() {
			const graphicsRect = WeatherEffectManager.graphicsRect();
			return this.inRectangle(graphicsRect);
		}
			
		needReborn() {
			//リスボーンの条件は見直しがいつか必要かな
			//if (!this.visible) return true;
			if (this._deltaAnimationCompleted) return true;
			if (!this.inRectangle(WeatherEffectManager.drawingRect())) return true;
			//return !this.inRectangle(WeatherEffectManager.drawingRect());
			return false;
		}
		
		autoRebornType() {
			//速度割合で細かく分岐したほういいかな？
			let rebornType = this.effect.rebornType;
			const scrolledX = WeatherEffectManager.scrolledX();
			const scrolledY = WeatherEffectManager.scrolledY();
			if (scrollX < 0 && scrolledY < 0) {
				rebornType = rebornTypes.topLeft;
			} else if (scrolledX < 0 && scrolledY > 0) {
				rebornType = rebornTypes.bottomLeft;
			} else if (scrolledX > 0 && scrolledY > 0) {
				rebornType = rebornTypes.bottomRight;
			} else if (scrolledX > 0 && scrolledY < 0) {
				rebornType = rebornTypes.topRight;
			} else if (scrolledX < 0 && scrolledY < 0) {
				rebornType = rebornTypes.bottomRight;
			} else if (scrolledX < 0) {
				rebornType = rebornTypes.left;
			} else if (scrolledX > 0) {
				rebornType = rebornTypes.right;
			} else if (scrolledY > 0) {
				rebornType = rebornTypes.bottom;
			} else if (scrolledY < 0) {
				rebornType = rebornTypes.top;
			} else if (this._dY === 0 && this._dX > 0) {
				rebornType = rebornTypes.leftOut;
			} else if (this._dY === 0 && this._dX < 0) {
				rebornType = rebornTypes.rightOut;
			} else if (this._dX === 0 && this._dY > 0){
				rebornType = rebornTypes.topOut;
			} else if (this._dX === 0 && this._dY < 0) {
				rebornType = rebornTypes.bottomOut;
			} else if (this._dX > 0 && this._dY > 0) {
				rebornType = rebornTypes.topLeftOut;
			} else if (this._dX > 0 && this._dY < 0) {
				rebornType = rebornTypes.bottomLeftOut;
			} else if (this._dX < 0 && this._dY > 0) {
				rebornType = rebornTypes.topRightOut;
			} else if (this._dX < 0 && this._dY < 0) {
				rebornType = rebornTypes.bottomRightOut;
			}
			return rebornType;
		}
		
		autoRebornRect() {
			let rebornRect = WeatherEffectManager.rebornRect(this.effect.rebornType);
			const scrolledX = WeatherEffectManager.scrolledX();
			const scrolledY = WeatherEffectManager.scrolledY();
			if (scrollX < 0 && scrolledY < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.topLeft);
			} else if (scrolledX < 0 && scrolledY > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.bottomLeft);
			} else if (scrolledX > 0 && scrolledY > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.bottomRight);
			} else if (scrolledX > 0 && scrolledY < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.topRight);
			} else if (scrolledX < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.left);
			} else if (scrolledX > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.right);
			} else if (scrolledY > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.bottom);
			} else if (scrolledY < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.top);
			} else if (this._dY === 0 && this._dX > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.leftOut);
			} else if (this._dY === 0 && this._dX < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.rightOut);
			} else if (this._dX === 0 && this._dY > 0){
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.topOut);
			} else if (this._dX === 0 && this._dY < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.bottomOut);
			} else if (this._dX > 0 && this._dY > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.topLeftOut);
			} else if (this._dX > 0 && this._dY < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.bottomLeftOut);
			} else if (this._dX < 0 && this._dY > 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.topRightOut);
			} else if (this._dX < 0 && this._dY < 0) {
				rebornRect = WeatherEffectManager.rebornRect(rebornTypes.bottomRightOut);
			}
			return rebornRect;
		}
		
		//リスボーン関数。引数にTrueを送るとフェードイン
		reborn(fadeIn) {
			//ここで引数に特定のrebornTypeを送ればリスボーンポイントを制御できるはず･･･あとはどう送るか･･･
			const rebornRect = this.effect.rebornAuto ? this.autoRebornRect() : WeatherEffectManager.rebornRect(this.effect.rebornType);
			const originX = this.parent ? this.parent.origin.x : 0;
			const originY = this.parent ? this.parent.origin.y : 0;
			let aX = Math.randomInt(rebornRect.width) + rebornRect.left + originX;
			let aY = Math.randomInt(rebornRect.height) + rebornRect.top + originY;
			const rebornType = this.effect.rebornAuto ? this.autoRebornType() : this.effect.rebornType;
			//二方向リスボーンはアスペクト比で場合わけ
			if (rebornTwoWays.includes(rebornType)) {
				const removalRect = WeatherEffectManager.removalRect(rebornType);
				const speedRatio = this._dX ? Math.abs(this._dY / this._dX) : 0;
				const aspectRatio = Graphics.width * speedRatio / (Graphics.width + Graphics.height);
				const rebornTopBottom = Math.random() < aspectRatio;
				if (rebornTopBottom) {
					switch(rebornType) {
						case rebornTypes.topLeft:
						case rebornTypes.topLeftOut:
							while (aX > removalRect.left && aY > removalRect.top) {
								aY -= Math.randomInt(5) + 1;
							}
							break;
						case rebornTypes.topRight:
						case rebornTypes.topRightOut:
							while (aX < removalRect.right && aY > removalRect.top) {
								aY -= Math.randomInt(5) + 1;
							}
							break;
						case rebornTypes.bottomLeft:
						case rebornTypes.bottomLeftOut:
							while (aX > removalRect.left && aY < removalRect.bottom) {
								aY += Math.randomInt(5) + 1;
							}
							break;
						case rebornTypes.bottomRight:
						case rebornTypes.bottomRightOut:
							while (aX < removalRect.right && aY < removalRect.bottom) {
								aY += Math.randomInt(5) + 1;
							}
							break;
					}	
				} else {
					switch(rebornType) {
						case rebornTypes.topLeft:
						case rebornTypes.topLeftOut:
							while (aY > removalRect.top && aX > removalRect.left) {
								aX -= Math.randomInt(5) + 1;
							}
							break;
						case rebornTypes.bottomLeft:
						case rebornTypes.bottomLeftOut:
							while (aY < removalRect.bottom && aX > removalRect.left) {
								aX -= Math.randomInt(5) + 1;
							}
							break;
						case rebornTypes.topRight:
						case rebornTypes.topRightOut:
							while (aY > removalRect.top && aX < removalRect.right) {
								aX += Math.randomInt(5) + 1;
							}
							break;
						case rebornTypes.bottomRight:
						case rebornTypes.bottomRightOut:
							while (aY < removalRect.bottom && aX < removalRect.right) {
								aX += Math.randomInt(5) + 1;
							}
							break;
					}
				}
				
			}
			
			//完全に画面外リスボーンして欲しいときに使用
			
			let addtiveX = 0, addtiveY = 0;
			
			switch (rebornType) {
				case rebornTypes.topLeftOut:
					addtiveX = - this._maxWidth;
					addtiveY = - this._maxHeight;
					break;
				case rebornTypes.topOut:
					addtiveY = - this._maxHeight;
					break;
				case rebornTypes.topRightOut:
					addtiveX = this._maxWidth;
					addtiveY = - this._maxHeight;
					break;
				case rebornTypes.leftOut:
					addtiveX = - this._maxWidth;
					break;
				case rebornTypes.rightOut:
					addtiveX = this._maxWidth;
					break;
				case rebornTypes.bottomLeftOut:
					addtiveX = - this._maxWidth;
					addtiveY = this._maxHeight;
					break;
				case rebornTypes.bottomOut:
					addtiveY = this._maxHeight;
					break;
				case rebornTypes.bottomRightOut:
					addtiveX = this._maxWidth;
					addtiveY = this._maxHeight;
					break;
			}
			
			this.aX = aX + addtiveX / 2;
			this.aY = aY + addtiveY / 2;
			
			if (fadeIn) {this.setFadeIn();}
			this.deltaAnimationReset();
		}
		
		needRefresh() {
			if (!this.parent) return false;
			return this.effect !== this.parent.effect;
		}
		
		refreshEffect() {
			this.setup(this.parent.effect);
			this.setInEffect();
		}
		
		//アニメーションタイプによるアニメーション関連
		resetDeltaPhase() {
			this._deltaPhase = 0;
		}
		
		addDeltaPhase() {
			this._deltaPhase++;
			this.resetDeltaCount();
		}
		
		repeatDeltaPhase() {
			if (this._deltaPhase > 0) {
				this._deltaPhase--;
			}
		}
		
		resetDeltaCount() {
			this._deltaCount = 0;
		}
		
		addDeltaCount() {
			this._deltaCount++;
		}
		
		setDeltaWait(wait) {
			this._deltaWait = Number.isInteger(wait) ? wait : Infinity;
		}
		
		updateTypeAnimation() {
			if (this._deltaPhase < 0) return;
			this.addDeltaCount();
			if (this._deltaCount > this._deltaWait) {
				switch (this.updateType) {
					case updateTypes.rain:
						this.updateDeltaRain();
						break;
					case updateTypes.snow:
						this.updateDeltaSnow();
						break;
					case updateTypes.sunLight:
						this.updateDeltaSunLight();
						break;
					case updateTypes.cloud:
						this.updateDeltaCloud();
						break;
					case updateTypes.fog:
						this.updateDeltaFog();
						break;
					case updateTypes.thunder:
						this.updateDeltaThunder();
						break;
					case updateTypes.fallenLeaves:
						this.updateDeltaFallenLeaves();
						break;
					case updateTypes.rise:
						this.updateDeltaRise();
						break;
					case updateTypes.set:
						this.updateDeltaSet();
						break;
					default:
						this.updateDeltaStandard();
						break;
				}
				this.addDeltaPhase();
				this.resetDeltaCount();
			}
		}
		
		updateAnimationMembers() {
			this.updateAnimationRateMembers();
			this.aX += this._dX * this.effect.spriteMoveSpeedRate;
			this.aY += this._dY * this.effect.spriteMoveSpeedRate;
			this.aScale.x = this.effect.spriteScale.x * this._dScaleRate.x * this._dRandomScale.x;
			this.aScale.y = this.effect.spriteScale.y * this._dScaleRate.y * this._dRandomScale.y; 
			this.aOpacity = this.effect.spriteOpacity * this._dOpacityRate;
			this.aRotation += this._dRotation * this.effect.spriteRotationRate;
		}
		
		//割合で乗算されるパラメータの変換
		updateAnimationRateMembers() {
			this._dScaleRate.x += this._dScale.x;
			this._dScaleRate.y += this._dScale.y;
			this._dOpacityRate += this._dOpacity / 255;
		}
		
		//フェーズ０でビジブルtrueを送るとメニュー開閉時に重いかも･･･
		resetDeltaAnimationMembers(visible) {
			this._dScaleRate.x = visible ? 1 : 0;
			this._dScaleRate.y = visible ? 1 : 0;
			this._dOpacityRate = visible ? 1 : 0;
			this._dScale = new Point(0 , 0);
			this._dOpacity = 0;
			this._dRotation = 0;
		}
		
		deltaAnimationReset() {
			this._deltaAnimationCompleted = false;
			this._deltaPhase = 0;
			this._deltaWait = 0;
			this._deltaCount = 0;
			
			this._dX = 0;
			this._dY = 0;
			this._dScale = new Point(0, 0);
			this._dOpacity = 0;
			this._dRotation = 0.0;
			this._dRandomScale = new Point(1, 1);
		}
		
		deltaAnimationComplete() {
			this._deltaAnimationCompleted = true;
			this._deltaPhase = -1;
			this._deltaWait = Infinity;
			this._deltaCount = 0;
		}
		
		setRebornAuto(rate) {
			const effect = this.effect;
			if (Math.random() < rate) {effect.rebornAuto = true;}
			else {effect.rebornAuto = false;}
		}
		
		updateDeltaStandard() {
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers(true);
					this._dOpacityRate = 0;
					this._dScaleRate = new Point(0 , 0);
					this._dX = (Math.randomInt(11) - 5) / 10;
					this._dY = (Math.randomInt(11) - 5) / 10;
					this._dRotation = toRadian((Math.randomInt(11) - 5) / 10);
					this.setDeltaWait(Math.randomInt(rebornWait) + rebornWait);
					break;
				case 1:
					this._dOpacity = 255 / 60;
					this._dScale = new Point(1 / 60, 1 / 60); 
					this.setDeltaWait(60);
					break;
				case 2:
					this._dScaleRate = new Point(1, 1);
					this._dOpacityRate = 1;
					this.resetDeltaAnimationMembers(true);
					this.setDeltaWait(Math.randomInt(120) + 60);
					break;
				case 3:
					this._dOpacity = - 255 / 60;
					this._dScale = new Point(- 1 / 60, - 1 / 60); 
					this.setDeltaWait(60);
					break;
				case 4:
					this._dOpacity = 0;
					this._dScale = new Point(0, 0); 
					this.setDeltaWait();
					this.deltaAnimationComplete();
					break;
			}
		};
		
		updateDeltaRain() {
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers(true);
					this._dOpacityRate = 0;
					this._dY = rainMoveSpeed;
					if (this.windEffect && this.windAngled) {
						this._dX = WeatherEffectManager.windPower() * this.windEffectRate;
						this.aRotation = Math.atan(- this._dX / this._dY);
					}
					this.setDeltaWait(Math.randomInt(rebornWait) + rebornWait);
					break;
				case 1:
					this._dOpacity = 1 / 5;
					this.setDeltaWait(5);
					break;
				case 2:
					this._dOpacityRate = 1;
					this.resetDeltaAnimationMembers(true);
					this.setDeltaWait(Math.randomInt(120) + 60);
					break;
				case 3:
					this._dOpacity = - 1 / 5;
					this.setDeltaWait(5);
					break;
				case 4:
					this._dOpacity = 0;
					this.setDeltaWait();
					this.deltaAnimationComplete();
					this.setRebornAuto(0.5);
					break;
			}
		};
		
		updateDeltaSnow() {
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers(true);
					const rScale = Math.random() / 2 + 0.75;
					this._dRandomScale = new Point(rScale, rScale);
					this._dOpacityRate = 0;
					this._dY = snowMoveSpeed;
					if (this.windEffect && this.windAngled) {
						this._dX = WeatherEffectManager.windPower() * this.windEffectRate;
						this.aRotation = Math.atan(- this._dX / this._dY);
					}
					this.setDeltaWait(Math.randomInt(rebornWait) + rebornWait);
					break;
				case 1:
					this._dOpacity = 1 /5;
					this.setDeltaWait(5);
					break;
				case 2:
					this._dOpacityRate = 1;
					this.resetDeltaAnimationMembers(true);
					this.setDeltaWait(10);
					break;
				case 3:
					this._dX += (Math.randomInt(11) - 5) / 10;
					this._dRotation = toRadian((Math.randomInt(11) - 5) / 10);
					this.setDeltaWait(Math.randomInt(120) + 60);
					break;
				case 4:
					this._dX += this._dX > 0 ? - (Math.randomInt(11) / 10) : Math.randomInt(11) / 10;
					this._dRotation = this._dRotation > 0 ? toRadian(- Math.randomInt(11) /10) : toRadian(Math.randomInt(11) /10);
					this.setDeltaWait(Math.randomInt(121) + 60);
					break;
				case 5:
					this._dOpacity = - 1 / 5;
					this.setDeltaWait(5);
					break;
				case 6:
					this._dOpacity = 0;
					this.setDeltaWait();
					this._dRandomScale = new Point(0, 0);
					this.deltaAnimationComplete();
					this.setRebornAuto(0.5);
					break;
			}
			
		}
		
		
		updateDeltaSunLight() {
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers(true);
					this.aRotation = toRadian(this.effect.rotation);
					this.shiftY = - Math.ceil(this.patternWidth() / 2 * Math.sin(this.aRotation));
					const rScaleX = Math.random() / 2 + 0.75;
					const rScaleY = Math.random() / 2 + 0.75;
					this._dRandomScale = new Point(rScaleX, rScaleY);
					this._dScaleRate = new Point(1, 0);
					this.setDeltaWait(Math.randomInt(rebornWait * 5) * 10 + rebornWait);
					break;
				case 1:
					const fadeInWait = 360
					this._dScale = new Point(0, 1 / fadeInWait);
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					this.resetDeltaAnimationMembers(true);
					this.setDeltaWait(Math.randomInt(241) + 120);
					this._dScale = new Point(0, - 0.01 / this._deltaWait);
					this._dOpacity = - 1 / this._deltaWait;
					break;
				case 3:
					this.setDeltaWait(Math.randomInt(241) + 120);
					this._dScale = new Point(0, 0.01 / this._deltaWait);
					this._dOpacity = 1 / this._deltaWait;
					break;
				case 4:
					this.setDeltaWait(Math.randomInt(241) + 120);
					this._dScale = new Point(0, - 0.01 / this._deltaWait);
					this._dOpacity = - 1 / this._deltaWait;
					break;
				case 5:
					this.setDeltaWait(Math.randomInt(241) + 120);
					this._dScale = new Point(0, 0.01 / this._deltaWait);
					this._dOpacity = 1 / this._deltaWait;
					break;
				case 6:
					const fadeOutWait = 360;
					this._dScale = new Point(0, - 1 / fadeOutWait);
					this._dOpacity = - 1 / this._deltaWait;
					this.setDeltaWait(fadeOutWait);
					break;
				case 7:
					this.setDeltaWait();
					this._dRandomScale = new Point(0, 0);
					this.deltaAnimationComplete();
					break;
			}
		}
		
		updateDeltaCloud() {
			const windPower = this.windEffect ? WeatherEffectManager.windPower() : 0;
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers();
					const rScaleX = Math.random() / 2 + 0.75;
					const rScaleY = Math.random() / 2 + 0.75;
					this._dRandomScale = new Point(rScaleX, rScaleY);
					this._dScaleRate = new Point(0, 0);
					this._dOpacityRate = 0;
					this.setDeltaWait(Math.randomInt(rebornWait * 10) * 10 + rebornWait);
					break;
				case 1:
					this._dX = (Math.randomInt(31)  - 15) / 20;
					if (windPower !== 0 && this.windAngled) {
						this._dX = windPower * this.windEffectRate * (Math.random() / 4);
					}
					const fadeInWait = 480;
					this._dOpacity = 255 / fadeInWait;
					this._dScale = new Point(1 / fadeInWait, 1 / fadeInWait);
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					if (windPower !== 0 && this.windAngled) {
						this._dX = windPower * this.windEffectRate * (Math.random() / 2 + 0.75);
					}
					this.setRebornAuto(0.6);
					this.resetDeltaAnimationMembers(true);
					this._dScaleRate = new Point(1, 1);
					this._dOpacityRate = 1;
					this.setDeltaWait(Math.randomInt(300) + 1800);
					break;
				case 3:
					const fadeOutWait = 480;
					this._dOpacity = - 255 / fadeOutWait;
					this._dScale = new Point(- 1 / fadeOutWait, - 1 / fadeOutWait);
					this.setDeltaWait(fadeOutWait);
					break;
				case 4:
					this.setDeltaWait();
					this._dRandomScale = new Point(0, 0);
					this.deltaAnimationComplete();
					break;
			}
		}
		
		updateDeltaFog() {
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers();
					const rScaleX = Math.random() + 0.5;
					const rScaleY = Math.random() + 0.5;
					this._dRandomScale = new Point(rScaleX, rScaleY);
					this._dScaleRate = new Point(0, 0);
					this._dOpacityRate = 0;
					this.setDeltaWait(Math.randomInt(rebornWait * 10) * 10 + rebornWait);
					break;
				case 1:
					this._dX = (Math.randomInt(61)  - 30) / 120;
					this._dY = (Math.randomInt(61)  - 30) / 120;
					const fadeInWait = 480;
					this._dOpacity = 255 / fadeInWait;
					this._dScale = new Point(1 / fadeInWait, 1 / fadeInWait);
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					this.setRebornAuto(0.1);
					this.resetDeltaAnimationMembers(true);
					this._dScaleRate = new Point(1, 1);
					this._dOpacityRate = 1;
					this.setDeltaWait(Math.randomInt(300) + 300);
					break;
				case 3:
					const fadeOutWait = 480;
					this._dOpacity = - 255 / fadeOutWait;
					this._dScale = new Point(- 1 / fadeOutWait, - 1 / fadeOutWait);
					this.setDeltaWait(fadeOutWait);
					break;
				case 4:
					this.setDeltaWait();
					this._dRandomScale = new Point(0, 0);
					this.deltaAnimationComplete();
					break;
			}
		}
		
		updateDeltaThunder() {
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers();
					this.aRotation = toRadian(this.effect.rotation);
					this._dScaleRate = new Point(1, 0);
					this.setDeltaWait(rebornWait);
					break;
				case 1:
					const fadeInWait = 5;
					this._dScale = new Point(0, 1 / fadeInWait);
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					WeatherEffectManager.flashScreen(255, 255, 255, 255, 10);
					this.resetDeltaAnimationMembers(true);
					this._dScale = new Point(0, 0);
					this.setDeltaWait(15);
					break;
				case 3:
					const pitch = 100 - Math.randomInt(50);
					WeatherEffectManager.playSe(thunderSe, thunderSeVolume, pitch, 0);
					this.setDeltaWait(Math.randomInt(20) + 20);
				case 4:
					const fadeOutWait = 5;
					this._dOpacity = - this.aOpacity / fadeOutWait;
					this.setDeltaWait(fadeOutWait);
					break;
				case 5:
					this.resetDeltaAnimationMembers();
					this.setDeltaWait(Math.randomInt(rebornWait * 10) * 10 + rebornWait);
					break;
				case 6:
					this.deltaAnimationComplete();
					this.setDeltaWait();
					break;
			}
		}
		
		updateDeltaFallenLeaves() {
			const windEffect = this.windEffect ? WeatherEffectManager.windPower() * this.windEffectRate : 0;
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers(true);
					this._dScaleRate = new Point(0, 0);
					const rScale = Math.random() / 2 + 0.75;
					this._dRandomScale = new Point(rScale, rScale);	
					this._dX = windEffect + Math.random() - 0.5;
					this._dY = fallenLeaveMoveSpeed + (Math.randomInt(11) - 5) / 100;
					this.anchor.x = Math.random() * this.effect.anchor.x;
					this.anchor.y = Math.random() * this.effect.anchor.y;
					this._dRotation = toRadian((Math.random() - 0.5) / 10);
					this._dRotation += windEffect / 100;
					this.setDeltaWait(Math.randomInt(rebornWait) + rebornWait);
					break;
				case 1:
					const fadeInWait = 30;
					this._dScale = new Point(1 / fadeInWait, 1 / fadeInWait);
					this._dX += this._dX > 0 ? - Math.random() : Math.random();
					this._dRotation = this._dRotation > 0 ? - Math.random() / 10 : Math.random() / 10;
					this._dRotation += windEffect / 100;
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					this.resetDeltaAnimationMembers(true);
					this._dX += this._dX > 0 ? - Math.random() : Math.random();
					this._dRotation = this._dRotation > 0 ? - Math.random() / 10 : Math.random() / 10;
					this._dRotation += windEffect / 100;
					this.setDeltaWait(Math.randomInt(121) + 120);
					break;
				case 3:
					this._dX += this._dX > 0 ? - Math.random() : Math.random();
					this._dRotation = this._dRotation > 0 ? - Math.random() / 10 : Math.random() / 10;
					this._dRotation += windEffect / 100;
					if (Math.random() < 0.8) {this.repeatDeltaPhase();}
					this.setDeltaWait(Math.randomInt(121) + 120);
					break;
				case 4:
					this.setRebornAuto(0.7);
					const fadeOutWait = 60;
					this._dScale = new Point(- 1 / fadeOutWait, 1 / fadeOutWait);
					this._dX += this._dX > 0 ? - Math.random() : Math.random();
					this._dRotation = this._dRotation > 0 ? - Math.random() / 10 : Math.random() / 10;
					this._dRotation += windEffect / 100;
					this.setDeltaWait(fadeOutWait);
					break;
				case 5:
					this.resetDeltaAnimationMembers();
					this._dRandomScale = new Point(0, 0);
					this.deltaAnimationComplete();
					this.setDeltaWait();
					break;
			}
		}
		
		updateDeltaRise() {
			const windEffect = this.windEffect ? WeatherEffectManager.windPower() * this.windEffectRate : 0;
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers();
					const rScale = Math.random() / 2 + 0.75;
					this._dRandomScale = new Point(rScale, rScale);	
					this.setDeltaWait(Math.randomInt(rebornWait));
					break;
				case 1:
					this._dY = - Math.randomInt(11) / 50 - 0.1;
					this._dX = windEffect;
					const fadeInWait = 300;
					this._dOpacity = 255 / fadeInWait;
					this._dScale = new Point(1 / fadeInWait, 1 / fadeInWait);
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					this.setRebornAuto(0.3);
					this.resetDeltaAnimationMembers(true);
					this.setDeltaWait(Math.randomInt(120) + 240);
					break;
				case 3:
					const fadeOutWait = 300;
					this._dOpacity = - 255 / fadeOutWait;
					this._dScale = new Point(- 1 / fadeOutWait, - 1 / fadeOutWait);
					this.setDeltaWait(fadeOutWait);
					break;
				case 4:
					this.setDeltaWait(Math.randomInt(360));
					this._dRandomScale = new Point(0, 0);
					break;
				case 5:
					this.setDeltaWait();
					this.deltaAnimationComplete();
					break;
			}
		}
		
		updateDeltaSet() {
			const windEffect = this.windEffect ? WeatherEffectManager.windPower() * this.windEffectRate : 0;
			switch(this._deltaPhase) {
				case 0:
					this.resetDeltaAnimationMembers();
					const rScale = Math.random() / 2 + 0.75;
					this._dRandomScale = new Point(rScale, rScale);	
					this.setDeltaWait(Math.randomInt(rebornWait));
					break;
				case 1:
					this._dY = Math.randomInt(11) / 50 + 0.1;
					this._dX = windEffect;
					const fadeInWait = 300;
					this._dOpacity = 255 / fadeInWait;
					this._dScale = new Point(1 / fadeInWait, 1 / fadeInWait);
					this.setDeltaWait(fadeInWait);
					break;
				case 2:
					this.setRebornAuto(0.3);
					this.resetDeltaAnimationMembers(true);
					this.setDeltaWait(Math.randomInt(120) + 240);
					break;
				case 3:
					const fadeOutWait = 300;
					this._dOpacity = - 255 / fadeOutWait;
					this._dScale = new Point(- 1 / fadeOutWait, - 1 / fadeOutWait);
					this.setDeltaWait(fadeOutWait);
					break;
				case 4:
					this.setDeltaWait(Math.randomInt(360));
					this._dRandomScale = new Point(0, 0);
					break;
				case 5:
					this.setDeltaWait();
					this.deltaAnimationComplete();
					break;
			}
		}
		
	}


})();