// =============================================================================
// AB_EnemyHateExtention.js
// Version: 1.0
// ヱビさんのEnemyHateプラグインのライン表示を拡張します
// =============================================================================
// Original Plugin Bellow
// =============================================================================
// AB_EnemyHate.js
// Version: 1.18
// -----------------------------------------------------------------------------
// Copyright (c) 2015 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================
/*:
 * @plugindesc AB_EnemyHateのライン表示を拡張
 * @author ヱビ extended by AO
 *
 * @requiredPlugin AB_EnemyHate.js
 * 
 * @param 行動時ヘイトライン消去
 * @desc インプット中のみヘイトラインを表示する
 * @type boolean
 * @on はい
 * @off いいえ
 * @default true
 *
 * @param ヘイトライン不透明度
 * @type number
 * @min 0
 * @max 255
 * @default 196
 * @desc ヘイトライン表示レイヤーの不透明度(0-255)
 *
 * @param ヘイトラインブレンドモード
 * @type number
 * @min 0
 * @max 3
 * @default 3
 * @desc ヘイトライン表示レイヤーのブレンドモード
 * 0：通常 1：加算 2：乗算 3：スクリーン
 *
 * @param ヘイトライン色変化割合
 * @type number
 * @min 0
 * @decimals 2
 * @default 1.00
 * @desc ヘイトラインの色変化割合(数値を大きくすると鋭敏に色が変化します)
 * @help
 * ※このプラグインはツクールMVで動作確認しています
 * ※このプラグインの動作には、エビさんの"AB_EnemyHate.js"が必要です
 *
 * エビさんのAB_EnemyHate.jsにおける
 * サイドビューバトル用のヘイトライン表示を新しく追加します
 *
 * AB_EnemyHate.jsのダウンロードはこちら
 * http://www.zf.em-net.ne.jp/~ebi-games/
 *
 * アクター・エネミーのメモ欄に
 * <HateLineOffset:x,y>と記載することで
 * ヘイトラインの表示位置を調節することができます
 *
 * 例)
 * <HateLineOffset:16,32>
 * バトラーのヘイトライン表示位置を
 * 右に13ピクセル・下に32ピクセルずらす
 *
 */
 
/*
2021/2/11 初版ver1.00
*/


(function() {
	'use strict';
	const importedEnemyHate = PluginManager.parameters('AB_EnemyHate') ? true : false;
	if (!importedEnemyHate) {
		throw new Error('ExtendedEnemyHateLine.js require AB_EnemyHate.js');
	}
	
	const pluginName = "AB_EnemyHateExtention";
	const parameters = PluginManager.parameters(pluginName);
	
	const hateLineWidth = 0.5;
	const hateOutLineWidth = 2;
	const hateOutLineColor = "rgb(100, 100, 100)";
	
	const hateLineShadowBlur = 20;
	const hateLineShadowOffsetX = 0;
	const hateLineShadowOffsetY = 5;
	
	const hideInInput = getArgBoolean(parameters["行動時ヘイトライン消去"]);
	const allwaysRefresh = false;
	const hateLineOffsetTag = "HateLineOffset";
	const hateLineHideTag = "HideHateLine";
	const hateLineBlendMode = getArgNumber(parameters["ヘイトラインブレンドモード"]);
	const hateLineOpacity = getArgNumber(parameters["ヘイトライン不透明度"]);
	const changeColorRate = getArgNumber(parameters["ヘイトライン色変化割合"]);
	
	function getArgNumber(arg) {
		if (typeof arg === "number") return arg;
		if (typeof arg === "string") {
			arg = arg.replace(/^\s+|\s+$/g,'');
			if (/^[+,-]?([1-9]\d*|0)(\.\d+)?$/.test(arg)) {
				return parseFloat(arg || '0');
			}
		}
		return 0;
	}
	
	function getArgString(arg, upperFlg) {
		if (typeof arg === "string") return upperFlg ? arg.toUpperCase().replace(/^\s+|\s+$/g, '') : arg.replace(/^\s+|\s+$/g, '');
		return "";
	}
	
	function getArgBoolean(arg) {
		arg = getArgString(arg, true);
		return arg === "T" || arg === "TRUE" || arg === "ON";
	};
	
	const _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
	Scene_Battle.prototype.createSpriteset = function() {
		HateLineManager.initHateLines();
		_Scene_Battle_createSpriteset.apply(this, arguments);
		this.createHateLineLayer();
	};
	
	Scene_Battle.prototype.createHateLineLayer = function() {
		this._hateLineLayer = new Sprite_HateLineLayer();
		this._hateLineLayer.setFrame(0, 0, Graphics.width, Graphics.height);
		this.addChild(this._hateLineLayer);
		HateLineManager.setHateLineLayer(this._hateLineLayer);
	};
	
	const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
	Scene_Battle.prototype.startPartyCommandSelection = function() {
		_Scene_Battle_startPartyCommandSelection.apply(this, arguments);
		this._hateLineLayer.show();
	};
	
	const _Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
	Scene_Battle.prototype.endCommandSelection = function() {
		_Scene_Battle_endCommandSelection.apply(this, arguments);
		if (HateLineManager.hideInInput()) this._hateLineLayer.hide();
	};
	
	const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
	Spriteset_Battle.prototype.createLowerLayer = function() {
		HateLineManager.clearBattlerSprites();
		_Spriteset_Battle_createLowerLayer.apply(this, arguments);
		this.registBattlerSpritesForHateLine();
	};
	
	Spriteset_Battle.prototype.registBattlerSpritesForHateLine = function() {
		this._enemySprites.forEach((enemySprite) => {
			HateLineManager.registEnemySprite(enemySprite);
		});
		this._actorSprites.forEach((actorSprite) => {
			HateLineManager.registActorSprite(actorSprite);
		});
	};
	
	Game_Actor.prototype.hateLineOffset = function() {
		const actor = this.actor();
		const offset = new Point();
		if (actor && actor.meta.hasOwnProperty(hateLineOffsetTag)) {
			const offsetTagStrings = actor.meta[hateLineOffsetTag];
			const offsetTagArray = offsetTagStrings.split(",");
			offset.x = getArgNumber(offsetTagArray[0] || 0);
			offset.y = getArgNumber(offsetTagArray[1] || 0);
		}
		return offset;
	}
	
	Game_Actor.prototype.hideHateLine = function() {
		if (this.actor && this.actor().meta.hasOwnProperty(hateLineHideTag)) return true;
		const states = this.states();
		for (let i = 0; i < states.length; i++) {
			if (states[i].meta.hasOwnProperty(hateLineHideTag)) return true;
		}
		return false;
	};
	
	Game_Enemy.prototype.hateLineOffset = function() {
		const enemy = this.enemy();
		const offset = new Point();
		if (enemy && enemy.meta.hasOwnProperty(hateLineOffsetTag)) {
			const offsetTagStrings = enemy.meta[hateLineOffsetTag];
			const offsetTagArray = offsetTagStrings.split(",");
			offset.x = getArgNumber(offsetTagArray[0] || 0);
			offset.y = getArgNumber(offsetTagArray[1] || 0);
		}
		return offset;
	};
	
	Game_Enemy.prototype.hideHateLine = function() {
		if (this.enemy && this.enemy().meta.hasOwnProperty(hateLineHideTag)) return true;
		const states = this.states();
		for (let i = 0; i < states.length; i++) {
			if (states[i].meta.hasOwnProperty(hateLineHideTag)) return true;
		}
		return false;
	};
	
	Sprite_Battler.prototype.hateLineOffset = function() {
		const battler = this._battler;
		if (battler) {
			return battler.hateLineOffset();
		}
		return new Point();
	};
	
	Sprite_Battler.prototype.hateLineIsVisible = function() {
		return this._battler ? !this._battler.hideHateLine() : false;
	};
	
	class HateLineManager {
		
		static initialize() {
			this._enemySprites = [];
			this._actorSprites = [];
		}
		
		static initHateLines() {
			this._hideInInput = hideInInput;
			this._allwaysRefresh = allwaysRefresh
			this.clearHateLineLayer();
		}
		
		static clearHateLineLayer() {
			this._hateLineLayer = undefined;
		}
		
		static hideInInput() {
			return this._hideInInput;
		}
		
		static allwaysRefresh() {
			return this._allwaysRefresh;
		}
		
		static clearBattlerSprites() {
			this._enemySprites = [];
			this._actorSprites = [];
		}
		
		static setHateLineLayer(hateLineLayer) {
			this._hateLineLayer = hateLineLayer;
		}
		
		static registEnemySprite(sprite) {
			if (!this._enemySprites.includes(sprite)) {
				this._enemySprites.push(sprite);
			}
		}
		
		static enemySprites() {
			return this._enemySprites;
		}
		
		static registActorSprite(sprite) {
			if (!this._actorSprites.includes(sprite)) {
				this._actorSprites.push(sprite);
			}
		}
		
		static actorSprite(actor) {
			for (let i = 0; i < this._actorSprites.length; i++) {
				const sprite = this._actorSprites[i];
				if (sprite._actor === actor) return sprite;
			}
		}
		
		static spriteHeight(sprite) {
			return sprite._mainSprite ? sprite._mainSprite.height : sprite.height;
		}
		
		static hateLinesNeedRefresh() {
			if (!this._hateLineLayer.visible) return false;
			if (this._allwaysRefresh) return true;
			if (this._hateLineLayer.isOpening()) return true;
			return BattleManager._spriteset ? BattleManager._spriteset.isAnyoneMoving() : false;
		}
		
	}
	
	
	class Sprite_HateLineLayer extends Sprite {
		
		initialize() {
			super.initialize();
			this.setupBitmap();
			this.setupParameters();
		}
		
		setupBitmap() {
			this.bitmap = new HateLineBitmap(Graphics.width, Graphics.height);
		}
		
		setupParameters() {
			this._opacity = HateLineManager.hideInInput() ? 0 : hateLineOpacity;
			this._opacityTarget = this._opacity;
			this._opacityMax = hateLineOpacity;
			this._opacityDuration = 0;
			this.opacity = this._opacity;
			
			this._opening = false;
			this._openDuration = 30;
			this._closing = false;
			this._closeDuration = 30;
			
			this.blendMode = hateLineBlendMode;
		}
		
		show() {
			if (!this.isOpening()) {
				this.refreshHateLines();
				this._closing = false;
				this._opening = true;
				this.setOpacityTarget(this._opacityMax, this._openDuration);
			}
		}
		
		isOpening() {
			return this._opening;
		}
		
		hide() {
			if (!this.isClosing()) {
				this._opening = false;
				this._closing = true;
				this.setOpacityTarget(0, this._closeDuration);
			}
		}
		
		isClosing() {
			return this._closing;
		}
		
		update() {
			this.updateVisiblity();
			this.updateOpacity();
			if (HateLineManager.hateLinesNeedRefresh()) {
				this.refreshHateLines();
			}
		}
		
		updateVisiblity() {
			if (this.opacity === 0 && this._opacityTarget > 0) {
				this.visible = true;
			} else if (this.opacity === 0) {
				this.visible = false;
			}
		}
		
		updateOpacity() {
			if (this._opacityDuration > 0) {
				const d = this._opacityDuration;
				this._opacity = Math.floor((this._opacity * (d - 1) + this._opacityTarget) / d);
				this.opacity = this._opacity;
				this._opacityDuration--;
				if (this._opacityDuration === 0) {
					this.opacity = this._opacityTarget;
				}
			}
		}
		
		setOpacityTarget(opacityTarget, opacityDuration) {
			this._opacityTarget = opacityTarget;
			this._opacityDuration = opacityDuration;
		}
		
		clearHateLines() {
			this.bitmap.clear();
		}
		
		refreshHateLines() {
			this.clearHateLines();
			HateLineManager.enemySprites().forEach((enemySprite) => {
				if (!enemySprite.hateLineIsVisible()) return;
				const enemy = enemySprite._enemy;
				if (enemy && enemy.isAlive()) {
					const actor = enemy.hateTarget();
					const actorSprite = HateLineManager.actorSprite(actor);
					if (!actorSprite || !actorSprite.hateLineIsVisible()) return;
					
					const enemyOffset = enemySprite.hateLineOffset();
					const actorOffset = actorSprite.hateLineOffset();
					const color = this.hateLineColor(enemy);
					this.bitmap.drawHateLine(
						color,
						enemySprite.x + enemyOffset.x, enemySprite.y + enemyOffset.y - HateLineManager.spriteHeight(enemySprite),
						actorSprite.x + actorOffset.x, actorSprite.y + actorOffset.y - HateLineManager.spriteHeight(actorSprite)
					);
				}
			});
		}
		
		hateLineColor(enemy) {
			const hates = enemy.hates().filter((hate) => {
						if (!!hate) return hate;
			})
			const maxHate = hates.reduce((a, b) => {
				return Math.max(a, b);
			});
			const avarageHate = hates.reduce((a, c) => {
				return a + c;
			}, 0) / hates.length;
			let changeColorValue = Math.floor((maxHate - avarageHate) * changeColorRate);
			
			let r = 0;
			let g = 0;
			let b = 255;
			
			g += changeColorValue > 255 ? 255 : changeColorValue;
			changeColorValue = changeColorValue > 255 ? changeColorValue - 255 : 0;
			b -= changeColorValue > 255 ? 255 : changeColorValue;
			changeColorValue = changeColorValue > 255 ? changeColorValue - 255 : 0;
			r += changeColorValue > 255 ? 255 : changeColorValue;
			changeColorValue = changeColorValue > 255 ? changeColorValue - 255 : 0;
			g -= changeColorValue > 255 ? 255 : changeColorValue;
			changeColorValue = changeColorValue > 255 ? changeColorValue - 255 : 0;
			b += changeColorValue > 255 ? 255 : changeColorValue;
			return [r, g, b];
		}
		
	}
	
	class HateLineBitmap extends Bitmap {
		
		initialize(width, height) {
			super.initialize(width, height);
			this.initHateLineParams();
		}
		
		initHateLineParams() {
			this._smooth = true;
			
			this._hateLineWidth = hateLineWidth;
			this._hateOutLineWidth = hateOutLineWidth;
			
			this._hateOutLineColor = hateOutLineColor;
			
			this._lineWidth = hateOutLineWidth;
			this._strokeStyle = hateOutLineColor;
			this._lineCap = "round";
		}
		
		drawHateLine(color, ex, ey, ax, ay) {
			const w = Math.floor(Math.abs(ex - ax));
			const h =  Math.floor(Math.max(w / 4, Math.abs(ey - ay) + w / 5));
			const context = this._context;
			context.save();
			context.lineCap = this._lineCap;
			const colorStrings = this.convertColor(color);
			
			context.globalCompositeOperation = "lighter";
			context.shadowColor = colorStrings;
			context.shadowOffsetX = hateLineShadowOffsetX;
			context.shadowOffsetY = hateLineShadowOffsetY;
			context.shadowBlur = hateLineShadowBlur;
			
			context.beginPath();
			context.lineWidth = this._hateOutLineWidth * 2 + this._hateLineWidth;
			context.strokeStyle = this._hateOutLineColor;
			context.moveTo(ex, ey);
			context.quadraticCurveTo(ex + w / 2, ey - h, ax, ay);
			context.stroke();
			
			context.lineWidth = this._hateLineWidth;
			context.strokeStyle = colorStrings;
			context.moveTo(ex, ey);
			context.quadraticCurveTo(ex + w / 2, ey - h, ax, ay);
			context.stroke();
			
			context.restore();
			this._setDirty();
		}
		
		convertColor(colorArray) {
			return "rgb(" + String(colorArray[0]) + "," + String(colorArray[1]) + "," + String(colorArray[2]) + ")";
		}
		
	}
	
})();