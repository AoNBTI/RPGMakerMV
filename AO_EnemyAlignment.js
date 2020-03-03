//=============================================================================
// AO_EnemyAlignment.js
//=============================================================================
// Copyright (c) 2020 AO
 /*
2020/2/13 ver 1.00 初版
2020/3/2 ver 1.001 ヘルプ記載を修正
*/
/*:
 * @plugindesc 敵グループを整列させる
 * @author AO
 * @help AO_EnemyAlignment.js ver 1.001 
 * エネミーの配置をイベントの注釈で設定可能にします
 *
 * 敵グループ設定内バトルイベントの注釈に
 * 位置情報を記載することで、戦闘開始時の敵位置を
 * 設定できるようにします
 *
 * バトルイベントに注釈コマンドで以下のように記載してください
 * <setHome>
 * グループに加えた順番:画面x座標,画面y座標;
 * </setHome>
 * 
 * ※注意
 * 座標は敵画像のアンカー位置(画像の基準位置)を指定します
 * デフォルトのアンカー位置は敵画像の下端中央です
 *
 * 例)
 * 1番目の敵をx座標100,y座標400に配置
 * 2番目の敵をx座標100,y座標600に配置
 * <setHome>
 * 1:100,400;
 * 2:100,600;
 * </setHome>
 *
 * このプラグインにプラグインコマンドはありません
 * ライセンスはMIT
 * 改変歓迎です
 */
/*
TODO
screenX,screenY,の書き換えはなんか副作用あるのかな？必要ならSprite_EnemyのsetHomeにデータを送れるように改変を。
*/
 
(function() {
	'use strict';
	const pluginName = 'AO_EnemyAlignment';
	const parameters = PluginManager.parameters(pluginName);
	
	function getArgNumber(arg) {
		arg = arg.replace(/^\s+|\s+$/g,'');
		if (typeof arg === "string" &&  /^([1-9]\d*|0)(\.\d+)?$/g.test(arg)) {
			return parseFloat(arg || '0');
		}
		return 0;
	}
	
	//全てのページの注釈文字列を返すユーティリティ。引数は$dataEvent、$dataTroop、あとは何でいけるかしらん
	function getComment(gameData) {
		let result = "";
		for (let i = 0; i < gameData.pages.length; i++) {
			let page = gameData.pages[i]
			for (let j = 0; i < page.list.length; i++) {
				let command = page.list[i];
				if (command && (command.code === 108 || command.code === 408)){
					result += command.parameters[0];
				}
			}
		}
		return result;
	}
	
	function createAlignmentObject(alignmentStr) {
		const alignment = {};
		const regExp = /\d+/g;
		//実はタグで囲まれた中の整数値を順番に抽出してるだけ！
		let result = regExp.exec(alignmentStr);
		alignment["index"] = result ? getArgNumber(result[0]) : NaN;					
		result = regExp.exec(alignmentStr);
		alignment["x"] = result ? getArgNumber(result[0]) : NaN;
		result = regExp.exec(alignmentStr);
		alignment["y"] = result ? getArgNumber(result[0]) : NaN;
		return alignment;
	}
	
	function getAlignmentStatusArr(commentStr) {
		const commentList = commentStr.match(/<sethome>((?:(?!<sethome>)[\s|\S])+)<\/sethome>/gi);
		const alignmentStatusArr = [];
		if (commentList) {
			for (let i = 0; i < commentList.length; i++) {
				//区切り文字";"でsplitして配列にしている。他の文字に変えたければここで
				const alignmentStatusList = commentList[i].replace(/<([^<]+)>/g, '').split(/;/g);
				for (let j = 0; j < alignmentStatusList.length; j++) {
					const alignmentStr = alignmentStatusList[j];
					if (alignmentStr) {alignmentStatusArr.push(createAlignmentObject(alignmentStr));}
				}
			}
		}
		return alignmentStatusArr;
	}
	
	const _Game_Troop_setup = Game_Troop.prototype.setup;
	Game_Troop.prototype.setup = function(troopId) {
		_Game_Troop_setup.apply(this, arguments);
		this.setCommentHome();
	};
	
	Game_Troop.prototype.setCommentHome = function() {
		const members = this.members();
		getAlignmentStatusArr(getComment(this.troop())).forEach(function(alignment) {
			if (!isNaN(alignment.index) && !isNaN(alignment.x) && !isNaN(alignment.y)) {
				if (members.length >= alignment.index) {
					const member = this.members()[alignment.index - 1];
					member._screenX = alignment.x;
					member._screenY = alignment.y;
				}
			}
		}.bind(this));
	};

})();