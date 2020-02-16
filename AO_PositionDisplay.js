//=============================================================================
// AO_PositionDisplay.js
//=============================================================================
// Copyright (c) 2020 AO
/*:
 * @plugindesc マウスでクリックした座標を表示する
 * @author AO
 *
 * @param Display Position X
 * @desc 表示X位置
 * @default 16
 * @type number
 *
 * @param Display Position Y
 * @desc 表示Y位置
 * @default 16
 * @type number
 *
 * @param Display FontSize
 * @desc 表示フォントサイズ
 * @default 16
 * @type number
 * @max 64
 * @min 0
 * @help parallax mapping通行判定作製用等に。
 *
 * テストプレイ時のみクリックした画面位置を
 * マップ座標に変換して表示します
 * 併せて画面上のpixel座標も表示します
 * 
 * ライセンスはMIT
 * 改変歓迎です
 *
 */ 
/*
2020/2/13 ver 1.00 初版
2020/2/15 ver 1.01 ユーティリティ関数の不具合修正
*/
(function() {
	'use strict';
	const pluginName = 'AO_PositionDisplay';
	const parameters = PluginManager.parameters(pluginName);
	const positionX = getArgNumber(parameters["Display Position X"] || 16);
	const positionY = getArgNumber(parameters["Display Position Y"] || 16);
	const fontSize = getArgNumber(parameters["Display FontSize"] || 16);
	
	const mapPositionStr = "map position";
	const screenPositionStr = "screen position";
	const separatorStr = " : ";
	const positionSeparatorStr = " , ";
	
	function getArgNumber(arg) {
		if (typeof arg === "string") {arg = arg.replace(/^\s+|\s+$/g,'');}
		else {return 0;}
		if (/^([1-9]\d*|0)(\.\d+)?$/g.test(arg)) {return parseFloat(arg || '0');}
		return 0;
	}
	
	//===========================================================
	//Sprite_Position
	//  マップ位置表示用のスプライト定義
	//===========================================================
	class Sprite_Position extends Sprite_Base {
		initialize() {
			super.initialize();
			this.initMembers()
		}
		
		initMembers() {
			this.x = positionX;
			this.y = positionY;
			this.clickedMapX = -1;
			this.clickedMapY = -1;
			this.lineSpace = 2;
			this.padding = 4;
			
			this.clickedScreenX = -1;
			this.clickedScreenY = -1;
			
			this.bitmap = new Bitmap();
			this.bitmap.fontSize = fontSize;
			
			this.refreshPosition();
		}
		
		calcBitmapSize() {
			let text = this.mapPositionText();
			const height = this.textHeight() * 2 + this.lineSpace + this.padding * 2;
			let width = this.bitmap.measureTextWidth(text) + this.padding * 2;
			text = this.screenPositionText();
			width = this.bitmap.measureTextWidth(text) + this.padding * 2 < width ? width : this.bitmap.measureTextWidth(text) + this.padding * 2;
			return {"width":width, "height":height};
		}
		
		textHeight() {
			return fontSize * 1.1618;
		}
		
		mapPositionText() {
			if ($gameParty.inBattle()) return "Now in Battle";
			const posX = this.clickedMapX >= 0 ? String(this.clickedMapX) : "0";
			const posY = this.clickedMapY >= 0 ? String(this.clickedMapY) : "0";
			return mapPositionStr + separatorStr + posX + positionSeparatorStr + posY;
		}
		
		screenPositionText() {
			const posX = this.clickedScreenX >= 0 ? String(this.clickedScreenX) : "0";
			const posY = this.clickedScreenY >= 0 ? String(this.clickedScreenY) : "0";
			return screenPositionStr + separatorStr + posX + positionSeparatorStr + posY;
		}
		
		setClickedPosition() {
			this.clickedScreenX = TouchInput.x;
			this.clickedScreenY = TouchInput.y;
			this.clickedMapX = $gameMap.canvasToMapX(TouchInput.x);
			this.clickedMapY = $gameMap.canvasToMapY(TouchInput.y);
		};
		
		refreshPosition() {
			this.setClickedPosition();
			this.drawClickedPosition();
		}
		
		drawClickedPosition() {
			const size = this.calcBitmapSize();
			const bitmap = this.bitmap;
			bitmap.resize(size.width, size.height);
			bitmap.drawText(this.mapPositionText(), 0, - this.textHeight() / 2, size.width, size.height, "center");
			bitmap.drawText(this.screenPositionText(), 0, this.textHeight() / 2 + this.lineSpace, size.width, size.height, "center");
			this.setFrame(0, 0, size.width, size.height);
			
		};
	}

	//===========================================================
	//Spriteset
	//  位置表示用スプライトの作成
	//===========================================================
	Spriteset_Base.prototype.createPositionDisplaySprite = function() {
		const sprite = new Sprite_Position();
		this.addChild(sprite);
		$gameTemp.setPositionDisplaySprite(sprite);
	};
	
	const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
	Spriteset_Map.prototype.initialize = function() {
		_Spriteset_Map_initialize.apply(this, arguments);
		this.createPositionDisplaySprite();
	};
	
	const _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
	Spriteset_Battle.prototype.initialize = function() {
		_Spriteset_Battle_initialize.apply(this, arguments);
		this.createPositionDisplaySprite();
	};
		
	//===========================================================
	//Game_Temp
	//  マップ位置の保持
	//===========================================================
	Game_Temp.prototype.updatePositionDisplay = function() {
		if (this.isPlaytest() && TouchInput.isPressed()) this._positionDisplaySprite.refreshPosition();
	};
	
	Game_Temp.prototype.setPositionDisplaySprite = function(sprite) {
		this._positionDisplaySprite = sprite;
	};
	
	//===========================================================
	//Game_Screen
	//  マップ位置の更新
	//===========================================================
	const _Game_Screen_update = Game_Screen.prototype.update;
	Game_Screen.prototype.update = function() {
		_Game_Screen_update.apply(this, arguments);
		$gameTemp.updatePositionDisplay();
	};
	
})();