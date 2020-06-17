//=============================================================================
// AO_SonantDrawing.js
//=============================================================================
// Copyright (c) 2020 AO
/*
2020/6/3 初版ver1.00
*/
/*:
 * @plugindesc 濁点を表示を改善します
 * @author AO
 *
 * @help AO_SonantDrawing.js ver1.0
 * なんかイイ感じに濁点表示を変えます
 * ウィンドウ内に全角濁点｢゛｣を入力した時の
 * 描写位置が調節されます
 *
 * ライセンスはMIT
 * 改変歓迎です
 */ 
 
(function() {
	'use strict';
	const pluginName = 'AO_SonantDrawing';
	const parameters = PluginManager.parameters(pluginName);
	
	function checkSmallCharacter(c) {
		return /ぁ|ぃ|ぅ|ぇ|ぉ|っ|ゃ|ゅ|ょ|ゎ|ァ|ィ|ゥ|ェ|ォ|ッ|ャ|ュ|ョ|ｧ|ｨ|ｩ|ｪ|ｫ|ｯ|ｬ|ｭ|ｮ/.test(c);
	}
	
	const _Window_Base_processNormalCharacter = Window_Base.prototype.processNormalCharacter;
	Window_Base.prototype.processNormalCharacter = function(textState) {
		_Window_Base_processNormalCharacter.apply(this, arguments);
		this.drawSonant(textState);
	};
	
	Window_Base.prototype.drawSonant = function(textState) {
		const nextC = textState.text[textState.index];
		if (!/゛/.test(nextC)) return;
		const beforeC = textState.index > 0 ? textState.text[textState.index - 1] : undefined;
		const width = this.textWidth(nextC);
		const reduceX = beforeC ? this.textWidth(beforeC) / 10 : 0;
		const addY = beforeC && checkSmallCharacter(beforeC) ? this.contents.fontSize / 5 : 0;
		this.contents.drawText(nextC, textState.x - reduceX, textState.y + addY, width * 2, textState.height);
		textState.x += width / 4 - reduceX;
		textState.index++;
	};
	
})();