//=============================================================================
// AttackChain.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.0 2019/05/08 ダメージ数値と単位表記の画像指定で敵専用の画像を指定できる機能を追加
// 2.0.0 2019/05/02 ダメージ数値と単位表記に任意の画像を使用できる機能を追加
// 1.5.0 2018/07/20 味方のみコンボ継続する設定を追加
// 1.4.2 2018/03/12 ダメージの桁数が多い場合に表示が見きれる場合がある問題を修正
// 1.4.1 2017/09/19 連携表示の単位の表示倍率を調整できる機能を追加
// 1.4.0 2017/09/18 一定連携以上でスキルが別のスキルに変化する機能を追加
// 1.3.2 2017/07/16 EST_BATTLE_ROYALE_EVO.jsとの競合を解消
// 1.3.1 2017/07/03 プラグインパラメータの型指定を追加
// 1.3.0 2017/07/03 最大連携数およびダメージのカウントを無効にするスイッチおよび初期化するスクリプトを追加
// 1.2.0 2017/06/14 連携ダメージ数を表示する機能と最大連携ダメージを取得できる機能を追加
//                  機械翻訳による英語化対応
// 1.1.1 2017/06/02 最大連携数が正しくカウントできていなかった問題を修正
// 1.1.0 2017/05/20 チェイン表示の時間設定と、指定数の連携に満たさずに使用すると必ず失敗するスキルを作る機能を追加
// 1.0.0 2017/05/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AttackChainPlugin
 * @author triacontane
 *
 * @param Unit
 * @desc It is a unit of chain number.
 * @default Chain!!
 * @type string
 *
 * @param DamageUnit
 * @desc It is a unit of chain damage.
 * @default Damage!!
 * @type string
 *
 * @param UnitImage
 * @desc チェイン数の単位を表示する画像です。指定した場合こちらが優先されます。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param DamageUnitImage
 * @desc チェイン数のダメージ単位を表示する画像です。指定した場合こちらが優先されます。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param EnemyUnitImageSuffix
 * @desc 敵用の単位画像、ダメージ単位画像を別途指定したい場合のファイル名の接尾辞です。
 * @default
 *
 * @param FontSize
 * @desc It is the font size of chain display.
 * @default 48
 * @type number
 *
 * @param DamageFontSize
 * @desc It is the font size of damage display.
 * @default 36
 * @type number
 *
 * @param ChainCountImage
 * @desc コンボ数を表示する数値画像ファイルです。0-9までの数値を等間隔に横に並べた画像を用意してください。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param ChainDamageImage
 * @desc コンボダメージを表示する数値画像ファイルです。0-9までの数値を等間隔に横に並べた画像を用意してください。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param EnemyImageSuffix
 * @desc 敵用のチェイン画像、ダメージ画像を別途指定したい場合のファイル名の接尾辞です。
 * @default
 *
 * @param ChainX
 * @desc The X coordinate of the chain display.
 * @default 8
 * @type number
 *
 * @param ChainY
 * @desc The Y coordinate of the chain display.
 * @default 80
 * @type number
 *
 * @param Duration
 * @desc The time in which the chain is displayed. If this value is exceeded, it fades out.
 * @default 0
 * @type number
 *
 * @param DamageRate
 * @desc Increase / decrease value of damage increased by 1 chain (%).
 * @default 10
 * @type number
 *
 * @param MaxRate
 * @desc This is the maximum magnification of damage increased by the chain.
 * @default 500
 * @type number
 *
 * @param CancelChangeTarget
 * @desc It will be canceled if attacking a target other than the chain continuing chain.
 * @default true
 * @type boolean
 *
 * @param CancelMiss
 * @desc It will be canceled if Missed attacks.
 * @default true
 * @type boolean
 *
 * @param CancelNoAttack
 * @desc It will be canceled if doing other than damaging attacks.
 * @default true
 * @type boolean
 *
 * @param CancelOpposite
 * @desc It will be canceled if the enemy acts.
 * @default true
 * @type boolean
 *
 * @param InvalidSwitchId
 * @desc When the specified switch is ON, the maximum number of cooperation and the maximum damage count are invalid.
 * @default 0
 * @type switch
 *
 * @param SkillChangeMessage
 * @desc A message when a skill change has occurred through cooperation. %1:before skill %2:after skill
 * @default %1 changed to %2!
 *
 * @param PartyOnly
 * @desc Not be effective for troop
 * @default false
 * @type boolean
 *
 * @help During battle, damage magnification will rise when friendly attacks are continuous.
 * Maximum collaboration damage is displayed simultaneously with the number of chains.
 * It will be canceled when chain of opponent starts during chain continuation.
 * You can also specify additional cancellation conditions with parameters.
 *
 * The following functions can be added in the note of the skill.
 * Can use \v[n]
 * <AC_Rate:200> # Set the chain damage magnification to 200% further.
 * <AC_End>      # I will forcibly terminate cooperation with that skill.
 * <AC_Cond:5>   # 5 Failure to use with less than cooperation always fails.
 *
 * You can set skill change when the number of cooperation becomes constant.
 * <AC_SkillChangeChain:2>       # Skill changes over 2 collaboration.
 * <AC_SkillChangeId:10>         # Set skill ID after skill change to [10].
 * <AC_SkillChangeMessage:aaa>   # Message [aaa] is displayed when the skill changes.
 *
 * In the skill change message, the following values are converted.
 * %1 : before skill name
 * %2 : after skill name
 *
 * There is no plugin command in this plugin.
 *
 * The following can be executed from the event command "script".
 * $gameParty.getChainCount();     # Acquisition of number of current parties
 * $gameParty.getMaxChainCount();  # Get maximum number of parties
 * $gameParty.getChainDamage();    # Current Party collaboration Damage Acquisition
 * $gameParty.getMaxChainDamage(); # Get party's maximum collaboration damage
 * $gameParty.resetMaxChain();     # Reset maximum cooperation number and damage
 *
 * This plugin is released under the MIT License.
 */

/*:ja
 * @plugindesc 連携攻撃プラグイン
 * @author トリアコンタン
 *
 * @param 単位
 * @desc チェイン数の単位です。
 * @default Chain!!
 * @type string
 *
 * @param ダメージ単位
 * @desc チェインダメージの単位です。
 * @default Damage!!
 * @type string
 *
 * @param 単位画像ファイル
 * @desc チェイン数の単位を表示する画像です。指定した場合こちらが優先されます。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param ダメージ単位画像ファイル
 * @desc チェイン数のダメージ単位を表示する画像です。指定した場合こちらが優先されます。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param 敵用単位画像ファイル接尾辞
 * @desc 敵用の単位画像、ダメージ単位画像を別途指定したい場合のファイル名の接尾辞です。
 * @default
 *
 * @param フォントサイズ
 * @desc チェイン表示のフォントサイズです。
 * @default 48
 * @type number
 *
 * @param ダメージフォントサイズ
 * @desc ダメージ表示のフォントサイズです。
 * @default 36
 * @type number
 *
 * @param チェイン画像ファイル
 * @desc チェイン数を表示する数値画像ファイルです。0-9までの数値を等間隔に横に並べた画像を用意してください。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param ダメージ画像ファイル
 * @desc チェインダメージを表示する数値画像ファイルです。0-9までの数値を等間隔に横に並べた画像を用意してください。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param 敵用画像ファイル接尾辞
 * @desc 敵用のチェイン画像、ダメージ画像を別途指定したい場合のファイル名の接尾辞です。
 * @default
 *
 * @param X座標
 * @desc チェイン表示のX座標です。
 * @default 8
 * @type number
 *
 * @param Y座標
 * @desc チェイン表示のY座標です。
 * @default 80
 * @type number
 *
 * @param 表示時間
 * @desc チェインが表示される時間(フレーム数)です。この値を超過するとフェードアウトします。(0の場合ずっと表示)
 * @default 0
 * @type number
 *
 * @param ダメージ倍率
 * @desc 1チェインごとに増加するダメージの増減値(%)です。
 * @default 10
 * @type number
 *
 * @param 最大倍率
 * @desc チェインによって増加するダメージの最大倍率です。
 * @default 500
 * @type number
 *
 * @param ターゲット変更で解除
 * @desc チェイン継続中のターゲット以外に攻撃すると解除されます。
 * @default true
 * @type boolean
 *
 * @param ミスで解除
 * @desc 攻撃をミスすると解除されます。
 * @default true
 * @type boolean
 *
 * @param 攻撃以外で解除
 * @desc ダメージを与える攻撃以外を行うと解除されます。
 * @default true
 * @type boolean
 *
 * @param 相手行動で解除
 * @desc 敵方が行動すると解除されます。
 * @default true
 * @type boolean
 *
 * @param 無効スイッチ番号
 * @desc 指定したスイッチがONのとき最大連携数および最大ダメージのカウントが無効になります。
 * @default 0
 * @type switch
 *
 * @param 味方のみに適用
 * @desc プラグインの効果が敵グループには作用しなくなります。
 * @default false
 * @type boolean
 *
 * @param スキル変化メッセージ
 * @desc 連携によってスキル変化が起こった場合のメッセージです。%1:変化前スキル名 %2:変化後スキル名
 * @default %1が%2に変化した！
 *
 * @help 戦闘中、味方の攻撃が連続したときにダメージ倍率が上昇します。
 * チェイン数と同時に最大連携ダメージも表示されます。
 * チェインの継続中に相手側のチェインがスタートしたら解除されます。
 * さらにパラメータで追加の解除条件を指定できます。
 *
 * スキルのメモ欄で以下の機能を追加できます。
 * 数値には制御文字\v[n]が使用できます。
 * <AC_倍率:200> # チェインダメージ倍率をさらに200%にします。
 * <AC_Rate:200> # 同上
 * <AC_終了>     # そのスキルで連携を強制終了します。
 * <AC_End>      # 同上
 * <AC_条件:5>   # 5連携に満たない状態で使用すると必ず失敗します。
 * <AC_Cond:5>   # 同上
 *
 * 連携数が一定上になった場合のスキル変化を設定できます。
 * <AC_スキル変化連携数:2>       # 2連携以上でスキル変化します。
 * <AC_SkillChangeChain:2>       # 同上
 * <AC_スキル変化ID:10>          # スキル変化後のスキルIDを[10]に設定します。
 * <AC_SkillChangeId:10>         # 同上
 * <AC_スキル変化メッセージ:aaa> # スキル変化時にメッセージ[aaa]を表示します。
 * <AC_SkillChangeMessage:aaa>   # 同上
 *
 * スキル変化メッセージでは以下の値が変換されます。
 * %1 : 変化前スキル名
 * %2 : 変化後スキル名
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * イベントコマンド「スクリプト」から以下が実行可能です。
 * $gameParty.getChainCount();     # 現在のパーティ連携数取得
 * $gameParty.getMaxChainCount();  # パーティの最大連携数を取得
 * $gameParty.getChainDamage();    # 現在のパーティ連携ダメージ取得
 * $gameParty.getMaxChainDamage(); # パーティの最大連携ダメージを取得
 * $gameParty.resetMaxChain();     # 最大連携数およびダメージをリセット
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/**
 * 連携数を表示するスプライトです。
 * @constructor
 */
function Sprite_ChainCount() {
    this.initialize.apply(this, arguments);
}

/**
 * 連携ダメージを表示するスプライトです。
 * @constructor
 */
function Sprite_ChainDamage() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName    = 'AttackChain';
    var metaTagPrefix = 'AC_';

    //=============================================================================
    // ユーザ設定領域
    //=============================================================================
    var userSettings = {
        /* チェイン画像の色設定 */
        chainColor    : {
            party: 'rgba(0, 128, 255, 1.0)',
            troop: 'red'
        },
        /* 連携表示の単位の表示倍率 */
        chainUnitScale: 0.75
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                  = {};
    param.unit                 = getParamString(['Unit', '単位']);
    param.damageUnit           = getParamString(['DamageUnit', 'ダメージ単位']);
    param.fontSize             = getParamNumber(['FontSize', 'フォントサイズ']) || 48;
    param.damageFontSize       = getParamNumber(['DamageFontSize', 'ダメージフォントサイズ']) || 48;
    param.maxRate              = getParamNumber(['MaxRate', '最大倍率']) || 100;
    param.damageRate           = getParamNumber(['DamageRate', 'ダメージ倍率']);
    param.chainX               = getParamNumber(['ChainX', 'X座標']) || 0;
    param.chainY               = getParamNumber(['ChainY', 'Y座標']) || 0;
    param.duration             = getParamNumber(['Duration', '表示時間']) || 0;
    param.cancelChangeTarget   = getParamBoolean(['CancelChangeTarget', 'ターゲット変更で解除']);
    param.cancelMiss           = getParamBoolean(['CancelMiss', 'ミスで解除']);
    param.cancelNoAttack       = getParamBoolean(['CancelNoAttack', '攻撃以外で解除']);
    param.cancelOpposite       = getParamBoolean(['CancelOpposite', '相手行動で解除']);
    param.partyOnly            = getParamBoolean(['PartyOnly', '味方のみに適用']);
    param.invalidSwitchId      = getParamNumber(['InvalidSwitchId', '無効スイッチ番号'], 0);
    param.skillChangeMessage   = getParamString(['SkillChangeMessage', 'スキル変化メッセージ']);
    param.chainCountImage      = getParamString(['ChainCountImage', 'チェイン画像ファイル']);
    param.chainDamageImage     = getParamString(['ChainDamageImage', 'ダメージ画像ファイル']);
    param.unitImage            = getParamString(['UnitImage', '単位画像ファイル']);
    param.damageUnitImage      = getParamString(['DamageUnitImage', 'ダメージ単位画像ファイル']);
    param.enemyImageSuffix     = getParamString(['EnemyImageSuffix', '敵用画像ファイル接尾辞']);
    param.enemyUnitImageSuffix = getParamString(['EnemyUnitImageSuffix', '敵用単位画像ファイル接尾辞']);

    //=============================================================================
    // Game_Unit
    //  チェイン回数を保持します。
    //=============================================================================
    var _Game_Unit_initialize      = Game_Unit.prototype.initialize;
    Game_Unit.prototype.initialize = function() {
        _Game_Unit_initialize.apply(this, arguments);
        this.resetMaxChain();
    };

    Game_Unit.prototype.getChainCount = function() {
        return this._chainCount || 0;
    };

    Game_Unit.prototype.getChainDamage = function() {
        return this._chainDamage || 0;
    };

    Game_Unit.prototype.getMaxChainCount = function() {
        return this._maxChain || 0;
    };

    Game_Unit.prototype.getMaxChainDamage = function() {
        return this._maxChainDamage || 0;
    };

    Game_Unit.prototype.addChainDamage = function(damageValue) {
        this._chainDamage = this.getChainDamage() + damageValue;
        if (this.isCountMaxChain() && (this._chainDamage > this._maxChainDamage || !this._maxChainDamage)) {
            this._maxChainDamage = this._chainDamage;
        }
    };

    Game_Unit.prototype.addChainCount = function(damage) {
        if (!this.isUseChain()) {
            return;
        }
        this._chainCount = this.getChainCount() + 1;
        this.opponentsUnit().resetChainCount();
        if (this.isCountMaxChain() && (this._chainCount > this._maxChain || !this._maxChain)) {
            this._maxChain = this._chainCount;
        }
        this.addChainDamage(damage);
    };

    Game_Unit.prototype.resetChainCount = function() {
        this._chainCount = 0;
        this.resetChainDamage();
    };

    Game_Unit.prototype.resetChainDamage = function() {
        this._chainDamage = 0;
    };

    Game_Unit.prototype.getChainRate = function(addRate) {
        return (100 + this.getChainCount() * param.damageRate * addRate).clamp(0, param.maxRate || Infinity) / 100;
    };

    Game_Unit.prototype.resetMaxChain = function() {
        this._maxChain       = 0;
        this._maxChainDamage = 0;
    };

    Game_Unit.prototype.isCountMaxChain = function() {
        return !$gameSwitches.value(param.invalidSwitchId);
    };

    Game_Unit.prototype.opponentsUnit = function() {
        return null;
    };

    Game_Party.prototype.opponentsUnit = function() {
        return $gameTroop;
    };

    Game_Party.prototype.isUseChain = function() {
        return true;
    };

    Game_Troop.prototype.opponentsUnit = function() {
        return $gameParty;
    };

    Game_Troop.prototype.isUseChain = function() {
        return !param.partyOnly;
    };

    //=============================================================================
    // Game_Action
    //  チェインをダメージに反映させます。
    //=============================================================================
    var _Game_Action_apply      = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        this._hitForChain    = false;
        this._damageForChain = false;
        _Game_Action_apply.apply(this, arguments);
        this.updateChain(target);
    };

    var _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        this._hitForChain = true;
        _Game_Action_applyItemUserEffect.apply(this, arguments);
    };

    var _Game_Action_executeDamage      = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        if (value > 0 && this.isHpEffect()) {
            this._damageForChain = true;
            if (param.cancelChangeTarget && BattleManager.isChangeTarget(target)) {
                this.friendsUnit().resetChainCount();
            }
        }
        _Game_Action_executeDamage.apply(this, arguments);
    };

    var _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var damageValue = _Game_Action_makeDamageValue.apply(this, arguments);
        if (this.isHpEffect()) {
            damageValue *= this.friendsUnit().getChainRate(this.getAdditionalChainRate());
        }
        return Math.floor(damageValue);
    };

    Game_Action.prototype.getMetaTextForAttackChain = function(names) {
        return getMetaValues(this.item(), names);
    };

    Game_Action.prototype.getMetaNumberForAttackChain = function(names) {
        return getArgNumber(this.getMetaTextForAttackChain(names));
    };

    Game_Action.prototype.getAdditionalChainRate = function() {
        return (this.getMetaNumberForAttackChain(['倍率', 'Rate']) || 100) / 100;
    };

    Game_Action.prototype.isForceEndChain = function() {
        return this.getMetaTextForAttackChain(['終了', 'End']) !== undefined;
    };

    Game_Action.prototype.isChainConditionOk = function() {
        return this.getMetaNumberForAttackChain(['条件', 'Cond']) <= this.friendsUnit().getChainCount();
    };

    Game_Action.prototype.isChangeSkillDueToChain = function() {
        return this.getMetaNumberForAttackChain(['スキル変化連携数', 'SkillChangeChain']) <= this.friendsUnit().getChainCount();
    };

    Game_Action.prototype.getChangeSkillIdDueToChain = function() {
        return this.getMetaNumberForAttackChain(['スキル変化ID', 'SkillChangeId']);
    };

    Game_Action.prototype.updateChain = function(target) {
        if (this.isChainCancel()) {
            this.friendsUnit().resetChainCount();
        }
        if (this._damageForChain) {
            this.friendsUnit().addChainCount(target.result().hpDamage);
            BattleManager.setChainTarget(target);
        }
        if (param.cancelOpposite) {
            this.opponentsUnit().resetChainCount();
        }
    };

    Game_Action.prototype.isChainCancel = function() {
        if (this.isForceEndChain()) {
            return true;
        } else if (param.cancelMiss && !this._hitForChain) {
            return true;
        } else if (param.cancelNoAttack && !this._damageForChain) {
            return true;
        }
        return false;
    };

    var _Game_Action_itemHit      = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        return this.isChainConditionOk() ? _Game_Action_itemHit.apply(this, arguments) : 0.0;
    };

    Game_Action.prototype.changeSkillDueToChain = function() {
        if (!this.isChangeSkillDueToChain()) {
            return;
        }
        var itemId = this.getChangeSkillIdDueToChain();
        if (itemId > 0) {
            this._item.changeItem(itemId);
        }
    };

    Game_Action.prototype.getSkillChangeMessage = function() {
        return this._item.getChangeMessage();
    };

    //=============================================================================
    // Game_Item
    //  スキルを別のものに変化させます。
    //=============================================================================
    Game_Item.prototype.changeItem = function(newItemId) {
        this._originalItemId = this._itemId;
        this.setObject(this.getObjectFromId(newItemId));
    };

    Game_Item.prototype.getChangeMessage = function() {
        if (!this._originalItemId) {
            return null;
        }
        var originalItem  = this.getObjectFromId(this._originalItemId);
        var changeMessage = getMetaValues(originalItem, ['スキル変化メッセージ', 'SkillChangeMessage']) || param.skillChangeMessage;
        if (changeMessage) {
            changeMessage = changeMessage.format(originalItem.name, this.object().name);
        }
        this._originalItemId = null;
        return changeMessage;
    };

    Game_Item.prototype.getObjectFromId = function(id) {
        if (this.isSkill()) {
            return $dataSkills[id];
        } else if (this.isItem()) {
            return $dataItems[id];
        } else if (this.isWeapon()) {
            return $dataWeapons[id];
        } else if (this.isArmor()) {
            return $dataArmors[id];
        }
        return null;
    };

    //=============================================================================
    // BattleManager
    //  チェイン状態を画面表示するために取得します。
    //=============================================================================
    var _BattleManager_setup = BattleManager.setup;
    BattleManager.setup      = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.resetChainCount();
        $gameTroop.resetChainCount();
    };

    var _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction      = function() {
        this._subject.currentAction().changeSkillDueToChain();
        _BattleManager_startAction.apply(this, arguments);
    };

    BattleManager.getChainParty = function() {
        if (this.isPartyChain()) {
            return $gameParty;
        } else {
            return $gameTroop;
        }
    };

    BattleManager.isPartyChain = function() {
        return $gameParty.getChainCount() > 0;
    };

    BattleManager.setChainTarget = function(target) {
        this._chainTarget = target;
    };

    BattleManager.isChangeTarget = function(target) {
        return this._chainTarget !== target;
    };

    //=============================================================================
    // Window_BattleLog
    //  連携によるスキル変化メッセージを表示します。
    //=============================================================================
    var _Window_BattleLog_startAction      = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        this._actionForChainAttack = action;
        _Window_BattleLog_startAction.apply(this, arguments);
    };

    var _Window_BattleLog_displayAction      = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        this.displayChangeAction();
        _Window_BattleLog_displayAction.apply(this, arguments);
    };

    Window_BattleLog.prototype.displayChangeAction = function() {
        var message = this._actionForChainAttack.getSkillChangeMessage();
        if (message) {
            this.push('addText', message);
        }
    };

    //=============================================================================
    // Scene_Battle
    //  ヒット数を追加します。
    //=============================================================================
    var _Scene_Battle_createSpriteset      = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function() {
        _Scene_Battle_createSpriteset.apply(this, arguments);
        this.createChainCountSprite();
        if (param.damageUnit || param.damageUnitImage) {
            this.createChainDamageSprite();
        }
    };

    Scene_Battle.prototype.createChainCountSprite = function() {
        this._chainCountSprite = new Sprite_ChainCount();
        this.addChild(this._chainCountSprite);
    };

    Scene_Battle.prototype.createChainDamageSprite = function() {
        this._chainDamageSprite = new Sprite_ChainDamage();
        this.addChild(this._chainDamageSprite);
    };

    //=============================================================================
    // Sprite_ChainCount
    //=============================================================================
    Sprite_ChainCount.prototype             = Object.create(Sprite.prototype);
    Sprite_ChainCount.prototype.constructor = Sprite_ChainCount;

    Sprite_ChainCount.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._chainValue = 0;
        this._duration   = 0;
        this.createCountBitmap();
        this.createUnitBitmap();
        this.update();
    };

    Sprite_ChainCount.prototype.createBitmap = function() {
        var fontSize             = this.getFontSize();
        var width                = Graphics.boxWidth;
        var height               = fontSize + 12;
        this.bitmap              = new Bitmap(width, height);
        this.bitmap.fontSize     = fontSize;
        this.bitmap.fontItalic   = true;
        this.bitmap.outlineWidth = this.getOutlineWidth();
        this.bitmap.outlineColor = 'white';
        this.updatePlacement();
    };

    Sprite_ChainCount.prototype.createCountBitmap = function() {
        var fileName = this.getCountImageFile();
        if (fileName) {
            this._countBitmap      = ImageManager.loadSystem(fileName, 0);
            this._countEnemyBitmap = ImageManager.loadSystem(fileName + param.enemyImageSuffix || '', 0);
        }
    };

    Sprite_ChainCount.prototype.createUnitBitmap = function() {
        var fileName = this.getUnitFile();
        if (fileName) {
            this._unitBitmap      = ImageManager.loadSystem(fileName, 0);
            this._unitEnemyBitmap = ImageManager.loadSystem(fileName + param.enemyUnitImageSuffix || '', 0);
        }
    };

    Sprite_ChainCount.prototype.getCountImageFile = function() {
        return param.chainCountImage;
    };

    Sprite_ChainCount.prototype.getUnitFile = function() {
        return param.unitImage;
    };

    Sprite_ChainCount.prototype.updatePlacement = function() {
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.x        = this.getInitX() + this.width / 2;
        this.y        = this.getInitY() + this.height / 2;
    };

    Sprite_ChainCount.prototype.update = function() {
        this.updateChainValue();
        if (this._duration > 0) {
            this._duration--;
            this.updateScale();
        } else {
            this.updateFade();
        }
        this.updateVisibly();
    };

    Sprite_ChainCount.prototype.updateChainValue = function() {
        var chainValue = this.getChainValue();
        if (chainValue !== this._chainValue) {
            this._chainValue = chainValue;
            this.refresh();
        }
    };

    Sprite_ChainCount.prototype.updateScale = function() {
        if (this.scale.x > 1.0) {
            this.scale.x -= 0.1;
            if (this.scale.x < 1.0) this.scale.x = 1.0;
        }
        if (this.scale.y > 1.0) {
            this.scale.y -= 0.1;
            if (this.scale.y < 1.0) this.scale.y = 1.0;
        }
        if (this.opacity < 255) {
            this.opacity += 32;
        }
    };

    Sprite_ChainCount.prototype.updateFade = function() {
        if (this.opacity > 0) {
            this.opacity -= 8;
        }
    };

    Sprite_ChainCount.prototype.updateVisibly = function() {
        this.visible = this.getChainParty().getChainCount() > 1;
    };

    Sprite_ChainCount.prototype.getChainParty = function() {
        return BattleManager.getChainParty();
    };

    Sprite_ChainCount.prototype.getItalicWidth = function() {
        return 4;
    };

    Sprite_ChainCount.prototype.getValueLength = function() {
        return this._chainValue.toString().length;
    };

    Sprite_ChainCount.prototype.getCharNumber = function() {
        return this.getValueLength() + this.getChainUnit().length * 2;
    };

    Sprite_ChainCount.prototype.getInitX = function() {
        return param.chainX;
    };

    Sprite_ChainCount.prototype.getInitY = function() {
        return param.chainY;
    };

    Sprite_ChainCount.prototype.getChainValue = function() {
        return this.getChainParty().getChainCount();
    };

    Sprite_ChainCount.prototype.getFontSize = function() {
        return param.fontSize;
    };

    Sprite_ChainCount.prototype.getChainUnit = function() {
        return param.unit;
    };

    Sprite_ChainCount.prototype.getOutlineWidth = function() {
        return Math.floor(this.getFontSize() / 6);
    };

    Sprite_ChainCount.prototype.getTextColor = function() {
        return userSettings.chainColor[(this.isPartyChain() ? 'party' : 'troop')];
    };

    Sprite_ChainCount.prototype.refresh = function() {
        this.createBitmap();
        this.refreshText(this._chainValue, this.getChainUnit());
        this.refreshScale();
        this._duration = param.duration || Infinity;
    };

    Sprite_ChainCount.prototype.refreshText = function(number, unit) {
        var x = 0;
        if (this._countBitmap) {
            x = this.drawCountImage(number);
        } else {
            x = this.drawCount(number);
        }
        if (this._unitBitmap) {
            this.drawUnitImage(x);
        } else {
            this.drawUnit(x, unit);
        }
    };

    Sprite_ChainCount.prototype.drawCountImage = function(number) {
        var bitmap = this.isPartyChain() ? this._countBitmap : this._countEnemyBitmap;
        var width  = bitmap.width / 10;
        var height = bitmap.height;
        number.toString().split('').forEach(function(digit, index) {
            this.bitmap.blt(bitmap, width * digit, 0, width, height, index * width, 0, width, height);
        }, this);
        return number.toString().length * width;
    };

    Sprite_ChainCount.prototype.drawCount = function(number) {
        this.bitmap.textColor = this.getTextColor();
        this.bitmap.fontSize  = this.getFontSize();
        var maxWidth          = this.bitmap.width - this.getItalicWidth();
        this.bitmap.drawText(number, 0, 0, maxWidth, this.bitmap.fontSize, 'left');
        return number.toString().length * this.getFontSize() / 2 + this.getItalicWidth() + 8;
    };

    Sprite_ChainCount.prototype.drawUnitImage = function(x) {
        var bitmap = this.isPartyChain() ? this._unitBitmap : this._unitEnemyBitmap;
        var w      = bitmap.width;
        var h      = bitmap.height;
        this.bitmap.blt(bitmap, 0, 0, w, h, x, 0, w, h);
    };

    Sprite_ChainCount.prototype.drawUnit = function(x, unit) {
        this.bitmap.textColor = this.getTextColor();
        this.bitmap.fontSize *= userSettings.chainUnitScale;
        this.bitmap.drawText(unit, x, 0, this.bitmap.width - x, this.getFontSize(), 'left');
    };

    Sprite_ChainCount.prototype.refreshScale = function() {
        this.scale.x = 2.0;
        this.scale.y = 2.0;
        this.opacity = 128;
    };

    Sprite_ChainCount.prototype.isPartyChain = function() {
        return BattleManager.isPartyChain();
    };

    //=============================================================================
    // Sprite_ChainDamage
    //=============================================================================
    Sprite_ChainDamage.prototype             = Object.create(Sprite_ChainCount.prototype);
    Sprite_ChainDamage.prototype.constructor = Sprite_ChainDamage;

    Sprite_ChainDamage.prototype.getChainValue = function() {
        return this.getChainParty().getChainDamage();
    };

    Sprite_ChainDamage.prototype.getCountImageFile = function() {
        return param.chainDamageImage;
    };

    Sprite_ChainDamage.prototype.getUnitFile = function() {
        return param.damageUnitImage;
    };

    Sprite_ChainDamage.prototype.getFontSize = function() {
        return param.damageFontSize || Math.floor(Sprite_ChainCount.prototype.getFontSize.call(this) * 0.75);
    };

    Sprite_ChainDamage.prototype.getChainUnit = function() {
        return param.damageUnit;
    };

    Sprite_ChainDamage.prototype.getTextColor = function() {
        return 'black';
    };

    Sprite_ChainDamage.prototype.getInitY = function() {
        return param.chainY + param.fontSize;
    };
})();
