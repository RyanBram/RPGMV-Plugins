//=============================================================================
// ChangeWindowTouchPolicy.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2018/11/19 プラグインによって追加されたウィンドウの実装次第で挙動がおかしくなる現象を修正
// 1.1.0 2016/06/03 モバイルデバイスでウィンドウのカーソルを1回で決定できる機能を追加
// 1.0.0 2015/12/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Change Window Touch Policy
 * @author triacontane
 *
 * @param ActionOutsideFrame
 * @desc Select what happens when you touch outside the window. (ok or cancel or off)
 * @default cancel
 *
 * @help Changes the behavior of touching or clicking a window.
 * 1. Focus on items with mouse hover
 * 2. Click once in the focus state to determine the item
 * 3. Added customizable behavior when clicking outside the window
 *
 * There are no plug-in commands for this plug-in.
 *
 * Terms of Use：
 *  It is possible to modify and redistribute without the author's permission,
 *  and there are no restrictions on the form of use
 *  (commercial use, 18 prohibited use, etc.).
 *  This plugin is yours now.
 */
/*:ja
 * @plugindesc ウィンドウタッチ仕様変更プラグイン
 * @author トリアコンタン
 *
 * @param 枠外タッチ動作
 * @desc ウィンドウの枠外をタッチした場合の動作を選択します。(決定 or キャンセル or なし)
 * @default キャンセル
 *
 * @help ウィンドウをタッチもしくはクリックした場合の挙動を変更します。
 * 1. マウスオーバーで項目にフォーカス
 * 2. フォーカス状態で1回クリックすると項目決定
 * 3. ウィンドウの枠外をクリックした場合の動作(カスタマイズ可能)を追加
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    var pluginName = 'ChangeWindowTouchPolicy';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramActionOutsideFrame = getParamString(['ActionOutsideFrame', '枠外タッチ動作']).toLowerCase();

    //=============================================================================
    // Window_Selectable
    //  タッチ周りの仕様を書き換えのため元の処理を上書き
    //=============================================================================
    var _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        if (this.maxItems() === 0) {
            _Window_Selectable_processTouch.apply(this, arguments);
            return;
        }
        if (this.isOpenAndActive()) {
            if ((TouchInput.isMoved() || TouchInput.isTriggered()) && this.isTouchedInsideFrame()) {
                this.onTouch(TouchInput.isTriggered());
            } else if (TouchInput.isCancelled()) {
                if (this.isCancelEnabled()) this.processCancel();
            } else if (TouchInput.isTriggered()) {
                switch (paramActionOutsideFrame) {
                    case '決定':
                    case 'ok':
                        if (this.isOkEnabled()) this.processOk();
                        break;
                    case 'キャンセル':
                    case 'cancel':
                        if (this.isCancelEnabled()) this.processCancel();
                        break;
                    case 'なし':
                    case 'off':
                        break;
                }
            }
        }
    };

    var _Window_Selectable_onTouch      = Window_Selectable.prototype.onTouch;
    Window_Selectable.prototype.onTouch = function(triggered) {
        if (Utils.isMobileDevice() && this.isCursorMovable()) {
            var x        = this.canvasToLocalX(TouchInput.x);
            var y        = this.canvasToLocalY(TouchInput.y);
            var hitIndex = this.hitTest(x, y);
            this.select(hitIndex);
        }
        _Window_Selectable_onTouch.apply(this, arguments);
    };

    //=============================================================================
    // TouchInput
    //  ポインタ移動時にマウス位置の記録を常に行うように元の処理を上書き
    //=============================================================================
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
})();

