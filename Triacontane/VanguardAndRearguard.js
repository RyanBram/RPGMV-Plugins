//=============================================================================
// VanguardAndRearguard.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.8.1 2019/06/17 1.8.0の修正で「後衛メンバー上限」のパラメータ取得処理が消えていたのを戻した
// 1.8.0 2019/06/15 戦闘画面でX座標やY座標が指定値以下の場合、自動で後衛に配置できる機能を追加
// 1.7.3 2019/01/20 後衛の人数の上限が設定されているとき、控えメンバーは常に前衛に設定されるよう仕様変更
// 1.7.2 2019/01/19 後衛の人数の上限を設定できる機能で控えメンバーを常に含めた上限にするよう仕様変更
// 1.7.1 2019/01/14 MPP_ActiveTimeBattle.jsと併用したときにアクターコマンドからチェンジが選択できない競合を修正
// 1.7.0 2019/01/01 後衛の人数の上限を設定できる機能を追加
// 1.6.0 2018/10/21 前衛・後衛の仕様を味方側もしくは敵側のみに適用できる機能を追加
// 1.5.4 2018/05/27 前衛のみ、後衛のみのスキルについて効果範囲を単体にすると対象外のバトラーを選択できてしまう制約事項を明記
// 1.5.3 2018/04/10 前衛に詰める機能有効時、控えのメンバーがいるときに戦闘メンバーを全員後衛にできてしまう問題を修正
// 1.5.2 2018/01/07 FTKR_CSS_MenuStatus.jsとの競合を解消
// 1.5.1 2017/10/25 ヘルプの英語化対応
// 1.5.0 2017/08/18 前衛が全滅したときに後衛が前衛に詰められる設定を追加
// 1.4.0 2017/06/11 メニュー画面でフェイスを右にずらす機能を有効にするかどうかのパラメータを追加
// 1.3.2 2017/04/22 全回復のイベント後、隊列ステートが解除されてしまう不具合を修正
// 1.3.1 2017/02/27 YEP_BattleEngineCore.jsと組み合わせたときに、後衛時のノックバックが過剰になる現象を修正
// 1.3.0 2017/01/14 敵キャラの前衛、後衛ステートアイコンを非表示にできる機能を追加
// 1.2.2 2016/10/25 後衛の敵キャラが逃走したときに位置が元に戻ってしまう現象を修正
// 1.2.1 2016/10/25 前衛・後衛の位置補正値に負の値を設定できるよう修正
// 1.2.0 2016/09/15 特定のキャラクターに対するチェンジを禁止する設定を追加
//                  前衛(あるいは後衛)のバトラーが全員戦闘不能で敗北になるような設定を追加
// 1.1.1 2016/06/18 アクター加入時に前衛ステートを強制設定する処理を追加
// 1.1.0 2016/06/06 戦闘不能時に隊列ステートが解除される不具合を修正
//                  前衛メンバーが生存している限り、後衛メンバーが狙われなくなる機能を追加
// 1.0.0 2016/06/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Vanguard and rearguard
 * @author triacontane
 *
 * @param VanguardStateId
 * @desc State ID of vanguard.
 * @default 4
 * @type state
 *
 * @param RearguardStateId
 * @desc State ID of rearguard.
 * @default 5
 * @type state
 *
 * @param ChangeInMenu
 * @desc Changeable formation in menu screen.
 * @default true
 * @type boolean
 *
 * @param RearDefense
 * @desc Rearguard member never targeting, if vanguard member alive.
 * @default false
 * @type boolean
 *
 * @param SkillIdChange
 * @desc Skill ID of formation change.
 * @default 0
 * @type skill
 *
 * @param RearguardOffsetX
 * @desc Offset X Position of rearguard.
 * @default 48
 * @type number
 *
 * @param RearguardOffsetY
 * @desc Offset Y Position of rearguard.
 * @default 0
 * @type number
 *
 * @param ChangeSpeed
 * @desc Move speed of formation change.
 * @default 8
 * @type number
 *
 * @param HiddenIcon
 * @desc Hide the enemy character's vanguard, state game icon of the rear guard. (Actor icon is displayed)
 * @default false
 * @type boolean
 *
 * @param FaceShift
 * @desc On the menu screen, display the rearguard face graphics slightly shifted to the right.
 * @default true
 * @type boolean
 *
 * @param ShiftVanguard
 * @desc At the time the wiped out, the guards will be forcibly moved to vanguard.
 * @default false
 * @type boolean
 *
 * @param ValidActor
 * @desc 前衛・後衛の仕様をアクター側に適用します。
 * @default true
 * @type boolean
 *
 * @param ValidEnemy
 * @desc 前衛・後衛の仕様を敵キャラ側に適用します。
 * @default true
 * @type boolean
 *
 * @param RearguardLimit
 * @desc 後衛になれるメンバーの上限です。0に設定すると無制限になります。
 * @default 0
 * @type number
 *
 * @param EnemyRearBorderX
 * @desc 敵キャラの配置X座標(中心原点)が指定したラインより小さいと自動的に後衛配置されます。
 * @default 0
 * @type number
 *
 * @param EnemyRearBorderY
 * @desc 敵キャラの配置Y座標(下原点)が指定したラインより小さいと自動的に後衛配置されます。
 * @default 0
 * @type number
 *
 * @help We add the concept of "vanguard" "rearguard" to battle.
 * After designating the state at "vanguard" and the state at "guard"
 * Please set special effects of "vanguard" and "rearguard"
 * by using "Trait" column and so on.
 *
 * It is recommended to set the priority to "0".
 * [SV] Motion and [SV] Superimposition is the state with the highest priority
 * It is due to the MV's specification that it will be given priority.
 *
 * The state specified as "vanguard" "rearguard" will not be canceled
 * even if it satisfies the cancellation condition.
 * To change it, choose one of the following methods.
 *
 * - Select the same character by "Sort" on the menu screen.
 * - Execute the "change" command on the battle screen.
 * - Grant the target state from the event.
 *
 * When changing during battle is effective, change the
 * target of the change skill to "user"
 * Further please set in the memo field as follows.
 * (We recommend copying existing skill "defense")
 * <VARChange>
 *
 * The memo field above is also valid for skills other than change.
 * If you want to change the skill user, please set the following
 * in the memo field.
 * <VARUserChange>
 *
 * If you want to create a skill that targets only vanguard,
 * Please set as follows in the memo field of skill.
 * <VAROnlyVanguard>  # target only vanguard
 * <VAROnlyRearguard> # target only rearguard
 *
 * However, it is invalid when using from the menu screen.
 *
 * If you want to rearrange the initial placement of enemy characters,
 * please set as follows in the memo field.
 * <VARRearguard>
 *
 * If you want to ban the vanguard of vanguard and fix it
 * with vanguard or rearguard,
 * Please set as follows in the memo field of actor and enemy character.
 * <VARChangeDisable> # Changes to the target butler are prohibited.
 *
 * - Plugin Command
 *
 * VAR_SET_DEFEAT_CONDITION 1 # We will change the defeat conditions of our enemy ally.
 *  0: Normal
 *  1: All vanguards are unable to fight and defeat
 *  2: All rearguards are unable to fight and defeat
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 前衛後衛プラグイン
 * @author トリアコンタン
 *
 * @param 前衛ステートID
 * @desc 前衛のステートIDです。
 * @default 4
 * @type state
 *
 * @param 後衛ステートID
 * @desc 後衛のステートIDです。
 * @default 5
 * @type state
 *
 * @param メニューチェンジ可能
 * @desc メニュー画面で前衛・後衛の切り替えが可能になります。
 * @default true
 * @type boolean
 *
 * @param 後衛防御
 * @desc 前衛メンバーが生存している限り、後衛メンバーが狙われなくなります。
 * @default false
 * @type boolean
 *
 * @param チェンジスキルID
 * @desc 戦闘中の前衛・後衛切り替えコマンドで実行されるスキルIDです。0を指定すると戦闘中はチェンジ不可となります。
 * @default 0
 * @type skill
 *
 * @param 後衛時X補正
 * @desc 後衛時のX座標を前衛時に対する相対値で指定します。サイドビューかつ敵キャラの場合は反転します。
 * @default 48
 * @type number
 *
 * @param 後衛時Y補正
 * @desc 後衛時のX座標を前衛時に対する相対値で指定します。
 * @default 0
 * @type number
 *
 * @param チェンジ速度
 * @desc 戦闘中にチェンジした場合のグラフィックの移動速度です。
 * @default 8
 * @type number
 *
 * @param アイコン非表示
 * @desc 敵キャラの前衛、後衛のステートアイコンを非表示にします。（アクターのアイコンは表示されます）
 * @default false
 * @type boolean
 *
 * @param フェイスシフト
 * @desc メニュー画面で、後衛の顔グラフィックを右に少しずらして表示します。
 * @default true
 * @type boolean
 *
 * @param 前衛に詰める
 * @desc 前衛が全滅した時点で後衛が強制的に前衛に移動します。また、前衛がいない状態では後衛に移動できなくなります。
 * @default false
 * @type boolean
 *
 * @param アクターに適用
 * @desc 前衛・後衛の仕様をアクター側に適用します。
 * @default true
 * @type boolean
 *
 * @param 敵キャラに適用
 * @desc 前衛・後衛の仕様を敵キャラ側に適用します。
 * @default true
 * @type boolean
 *
 * @param 後衛メンバー上限
 * @desc 後衛になれるメンバーの上限です。0に設定すると無制限になります。
 * @default 0
 * @type number
 *
 * @param 敵キャラ後衛ラインX座標
 * @desc 敵キャラの配置X座標(中心原点)が指定したラインより小さいと自動的に後衛配置されます。
 * @default 0
 * @type number
 *
 * @param 敵キャラ後衛ラインY座標
 * @desc 敵キャラの配置Y座標(下原点)が指定したラインより小さいと自動的に後衛配置されます。
 * @default 0
 * @type number
 *
 * @help 戦闘に「前衛」「後衛」の概念を追加します。
 * 「前衛」時のステートと「後衛」時のステートを指定したうえで
 * 「特徴」欄などを使って「前衛」と「後衛」それぞれの特殊効果を設定してください。
 * 優先度は「0」に設定することを推奨します。
 * [SV]モーションおよび[SV]重ね合わせが優先度のもっとも高いステートのものが
 * 優先されるというMVの仕様のためです。
 *
 * 「前衛」「後衛」に指定されたステートは、解除条件を満たしても解除されません。
 * 変更するには以下のいずれかの方法を選択します。
 *
 * ・メニュー画面の「並び替え」で同じキャラクターを選択する。
 * ・戦闘画面で「チェンジ」コマンドを実行する。
 * ・イベントから対象ステートを付与する。
 *
 * 戦闘中のチェンジを有効した場合、チェンジ用スキルの対象を「使用者」にして
 * さらにメモ欄に以下の通り設定してください。
 * (既存スキル「防御」をコピーすることをオススメします)
 * <VARチェンジ>
 *
 * 上記メモ欄はチェンジ以外のスキルでも有効です。
 * スキル使用者をチェンジ対象にしたい場合はメモ欄に以下の通り設定してください。
 * <VAR使用者チェンジ>
 *
 * 前衛のみ、後衛のみを対象にしたスキルを作成したい場合、
 * スキルのメモ欄に以下の通り設定してください。
 * <VAR前衛のみ> # 前衛のみ対象スキル
 * <VAR後衛のみ> # 後衛のみ対象スキル
 *
 * ただし、メニュー画面から使用する場合は無効です。
 * また、ターゲットの選択制限はできないので原則として効果範囲が「全体」の
 * スキルにのみ試用できます。
 *
 * 敵キャラの初期配置を後衛にしたい場合、メモ欄に以下の通り設定してください。
 * <VAR後衛>
 *
 * 前衛後衛のチェンジを禁止して前衛か後衛で固定したい場合、
 * アクターおよび敵キャラのメモ欄に以下の通り設定してください。
 * <VARチェンジ禁止>  # 対象バトラーに対するチェンジは禁止されます。
 * <VARChangeDisable> # 同上
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * VAR_敗北条件設定 1         # 敵味方の敗北条件を変更します。
 * VAR_SET_DEFEAT_CONDITION 1 # 同上
 *  0:通常 1:前衛が全員戦闘不能で敗北 2:後衛が全員戦闘不能で敗北
 *
 * スクリプト
 *  イベントコマンド「スクリプト」もしくは「条件分岐」のスクリプトから実行。
 *
 * 敵グループ内に前衛メンバーが存在しているかどうかの判定
 * $gameTroop.members().some(function(enemy) { return enemy.isVanguard(); });
 *
 * 敵グループ内に前衛メンバーが生存しているかどうかの判定
 * $gameTroop.aliveMembers().some(function(enemy) { return enemy.isVanguard(); });
 *
 * YEP_BattleEngineCore.jsと組み合わせたときに
 * 後衛時のノックバックが過剰になる現象を修正しています。
 * 併用する場合は、当プラグインをYEP_BattleEngineCore.jsより下に
 * 配置してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'VanguardAndRearguard';
    var metaTagPrefix = 'VAR';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramVanguardStateId  = getParamNumber(['VanguardStateId', '前衛ステートID'], 2);
    var paramRearguardStateId = getParamNumber(['RearguardStateId', '後衛ステートID'], 2);
    var paramChangeInMenu     = getParamBoolean(['ChangeInMenu', 'メニューチェンジ可能'], 1);
    var paramSkillIdChange    = getParamNumber(['SkillIdChange', 'チェンジスキルID'], 0);
    var paramRearguardOffsetX = getParamNumber(['RearguardOffsetX', '後衛時X補正']);
    var paramRearguardOffsetY = getParamNumber(['RearguardOffsetY', '後衛時Y補正']);
    var paramChangeSpeed      = getParamNumber(['ChangeSpeed', 'チェンジ速度'], 1);
    var paramRearDefense      = getParamBoolean(['RearDefense', '後衛防御']);
    var paramHiddenIcon       = getParamBoolean(['HiddenIcon', 'アイコン非表示']);
    var paramFaceShift        = getParamBoolean(['FaceShift', 'フェイスシフト']);
    var paramShiftVanguard    = getParamBoolean(['ShiftVanguard', '前衛に詰める']);
    var paramValidEnemy       = getParamBoolean(['ValidEnemy', '敵キャラに適用']);
    var paramValidActor       = getParamBoolean(['ValidActor', 'アクターに適用']);
    var paramRearguardLimit   = getParamNumber(['RearguardLimit', '後衛メンバー上限']);
    var paramEnemyRearBorderX = getParamNumber(['EnemyRearBorderX', '敵キャラ後衛ラインX座標']);
    var paramEnemyRearBorderY = getParamNumber(['EnemyRearBorderY', '敵キャラ後衛ラインY座標']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        this.pluginCommandVanguardAndRearguard(command.replace(metaTagPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandVanguardAndRearguard = function(command, args) {
        switch (getCommandName(command)) {
            case '_敗北条件設定' :
            case '_SET_DEFEAT_CONDITION' :
                var condition = getArgNumber(args[0], 0, 2);
                $gameParty.setDefeatCondition(condition);
                $gameTroop.setDefeatCondition(condition);
                break;
        }
    };

    //=============================================================================
    // Game_BattlerBase
    //  前衛・後衛の概念を追加定義します。
    //=============================================================================
    var _Game_BattlerBase_recoverAll      = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() {
        var prevVanguard = !this.isRearguard();
        _Game_BattlerBase_recoverAll.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    var _Game_BattlerBase_die      = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        var prevVanguard = !this.isRearguard();
        _Game_BattlerBase_die.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    var _Game_BattlerBase_addNewState      = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        if (stateId === this.deathStateId()) {
            this.friendsUnit().shiftVanguard();
        }
    };

    var _Game_BattlerBase_hide      = Game_BattlerBase.prototype.hide;
    Game_BattlerBase.prototype.hide = function() {
        _Game_BattlerBase_hide.apply(this, arguments);
        this.friendsUnit().shiftVanguard();
    };

    Game_BattlerBase.prototype.setFormationState = function(vanguardFlg) {
        if (!this.isValidFormationState()) {
            return;
        }
        if (this.friendsUnit().isNeedShiftVanguard(this)) {
            vanguardFlg = true;
        }
        var additionalStateId = (vanguardFlg ? paramVanguardStateId : paramRearguardStateId);
        var removeStateId     = (vanguardFlg ? paramRearguardStateId : paramVanguardStateId);
        if (!this.isStateAffected(additionalStateId)) {
            this.addNewState(additionalStateId);
        }
        if (this.isStateAffected(removeStateId)) {
            this.eraseState(removeStateId);
        }
    };

    Game_BattlerBase.prototype.changeFormationState = function() {
        if (this.isChangeableFormationState()) {
            this.setFormationState(!this.isVanguard());
            return true;
        }
        return false;
    };

    Game_BattlerBase.prototype.isChangeableRearguard = function() {
        return this.isRearguard() || paramRearguardLimit <= 0 || this.friendsUnit().rearguardMembers().length < paramRearguardLimit;
    };

    Game_BattlerBase.prototype.isValidFormationState = function() {
        return true;
    };

    Game_BattlerBase.prototype.isVanguard = function() {
        return this.isStateAffected(paramVanguardStateId);
    };

    Game_BattlerBase.prototype.isRearguard = function() {
        return this.isStateAffected(paramRearguardStateId);
    };

    Game_BattlerBase.prototype.isVanguardStateOf = function(stateId) {
        return stateId === paramVanguardStateId;
    };

    Game_BattlerBase.prototype.isRearguardStateOf = function(stateId) {
        return stateId === paramRearguardStateId;
    };

    Game_BattlerBase.prototype.changeSkillId = function() {
        return paramSkillIdChange;
    };

    Game_BattlerBase.prototype.getFormationOffsetX = function() {
        return this.isRearguard() ? paramRearguardOffsetX : 0;
    };

    Game_BattlerBase.prototype.getFormationOffsetY = function() {
        return this.isRearguard() ? paramRearguardOffsetY : 0;
    };

    Game_BattlerBase.prototype.isChangeableFormationState = function() {
        if (!this.isChangeableRearguard()) {
            return false;
        }
        var battler = (this.isActor() ? this.actor() : this.isEnemy() ? this.enemy() : null);
        if (battler) {
            return !getMetaValues(battler, ['チェンジ禁止', 'ChangeDisable']);
        }
        return false;
    };

    //=============================================================================
    // Game_Battler
    //  前衛・後衛ステートの解除を無効にします。
    //=============================================================================
    var _Game_Battler_removeState      = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        if (!this.isVanguardStateOf(stateId) && !this.isVanguardStateOf(stateId)) {
            _Game_Battler_removeState.apply(this, arguments);
        }
    };

    var _Game_Battler_addState      = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        if (this.isVanguardStateOf(stateId)) {
            this.setFormationState(true);
        } else if (this.isRearguardStateOf(stateId)) {
            this.setFormationState(false);
        } else {
            _Game_Battler_addState.apply(this, arguments);
        }
    };

    var _Game_Battler_performActionStart      = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        if (!action.isChange()) {
            _Game_Battler_performActionStart.apply(this, arguments);
        }
    };

    var _Game_Battler_escape      = Game_Battler.prototype.escape;
    Game_Battler.prototype.escape = function() {
        var prevVanguard = this.isVanguard();
        _Game_Battler_escape.apply(this, arguments);
        this.setFormationState(prevVanguard);
    };

    //=============================================================================
    // Game_Actor
    //  チェンジ用のモーションを定義します。
    //=============================================================================
    var _Game_Actor_setup      = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.apply(this, arguments);
        if (!this.isVanguard() && !this.isRearguard()) {
            this.setFormationState(true);
        }
    };

    var _Game_Actor_performAction      = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        _Game_Actor_performAction.apply(this, arguments);
        if (action.isChange()) {
            this.requestMotion('guard');
        }
    };

    Game_Actor.prototype.isValidFormationState = function() {
        return paramValidActor;
    };

    //=============================================================================
    // Game_Enemy
    //  前衛・後衛ステートの初期値を設定します。
    //=============================================================================
    Game_Enemy.prototype.initFormationState = function() {
        this.setFormationState(this.getInitialFormationState());
    };

    Game_Enemy.prototype.getInitialFormationState = function() {
        if (getMetaValues(this.enemy(), ['Rearguard', '後衛'])) {
            return false;
        }
        return this._screenX > paramEnemyRearBorderX && this._screenY > paramEnemyRearBorderY;
    };

    Game_Enemy.prototype.getFormationOffsetX = function() {
        return Game_BattlerBase.prototype.getFormationOffsetX.call(this) * ($gameSystem.isSideView() ? -1 : 1);
    };

    Game_Enemy.prototype.stateIcons = function() {
        var icons = Game_BattlerBase.prototype.stateIcons.apply(this, arguments);
        return paramHiddenIcon ? this.filterFormationIcon(icons) : icons;
    };

    Game_Enemy.prototype.filterFormationIcon = function(icons) {
        var vanguardState  = $dataStates[paramVanguardStateId];
        var rearguardState = $dataStates[paramRearguardStateId];
        return icons.filter(function(iconIndex) {
            if (vanguardState && vanguardState.iconIndex === iconIndex) {
                return false;
            }
            if (rearguardState && rearguardState.iconIndex === iconIndex) {
                return false;
            }
            return true;
        });
    };

    Game_Enemy.prototype.isValidFormationState = function() {
        return paramValidEnemy;
    };

    //=============================================================================
    // Game_Unit
    //  メンバー全体の前衛・後衛状態を管理します。
    //=============================================================================
    var _Game_Unit_aliveMembers = Game_Unit.prototype.aliveMembers;
    if (paramRearDefense) {
        Game_Unit.prototype.aliveMembers = function() {
            var members = this.vanguardMembers();
            return members.length > 0 ? members : _Game_Unit_aliveMembers.apply(this, arguments);
        };
    }

    Game_Unit.prototype.vanguardMembers = function() {
        return _Game_Unit_aliveMembers.apply(this, arguments).filter(function(member) {
            return member.isVanguard();
        });
    };

    Game_Unit.prototype.rearguardMembers = function() {
        return _Game_Unit_aliveMembers.apply(this, arguments).filter(function(member) {
            return member.isRearguard();
        });
    };

    Game_Unit.prototype.setDefeatCondition = function(value) {
        this._defeatCondition = value;
    };

    Game_Unit.prototype.getDefeatCondition = function() {
        return this._defeatCondition || 0;
    };

    var _Game_Unit_isAllDead      = Game_Unit.prototype.isAllDead;
    Game_Unit.prototype.isAllDead = function() {
        var defeatCondition = this.getDefeatCondition();
        switch (defeatCondition) {
            case 2:
                return this.rearguardMembers().length === 0;
            case 1:
                return this.vanguardMembers().length === 0;
            default :
                return _Game_Unit_isAllDead.apply(this, arguments);
        }
    };

    Game_Unit.prototype.isNeedShiftVanguard = function(exceptionBattler) {
        var inBattle   = this._inBattle;
        this._inBattle = true;
        var result     = paramShiftVanguard && !this.isAliveVanguardMember(exceptionBattler);
        this._inBattle = inBattle;
        return result;
    };

    Game_Unit.prototype.isAliveVanguardMember = function(exceptionBattler) {
        var vanguardMember = this.vanguardMembers();
        return vanguardMember.length > 0 && (vanguardMember.length > 1 || vanguardMember[0] !== exceptionBattler);
    };

    Game_Unit.prototype.shiftVanguard = function() {
        if (!this.isNeedShiftVanguard(null)) {
            return;
        }
        this.aliveMembers().forEach(function(member) {
            member.setFormationState(true);
        });
    };

    var _Game_Party_swapOrder      = Game_Party.prototype.swapOrder;
    Game_Party.prototype.swapOrder = function(index1, index2) {
        _Game_Party_swapOrder.apply(this, arguments);
        if (paramRearguardLimit <= 0) {
            return;
        }
        var size = this.battleMembers().length;
        if (index1 >= size) {
            $gameActors.actor(this._actors[index1]).setFormationState(true);
        }
        if (index2 >= size) {
            $gameActors.actor(this._actors[index2]).setFormationState(true);
        }
    };

    //=============================================================================
    // Game_Troop
    //  敵キャラの前衛・後衛状態を初期設定します。
    //=============================================================================
    var _Game_Troop_setup      = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        this.members().forEach(function(enemy) {
            enemy.initFormationState();
        });
    };

    //=============================================================================
    // Game_Action
    //  チェンジスキルを設定します。
    //=============================================================================
    Game_Action.prototype.setChange = function() {
        this.setSkill(this.subject().changeSkillId());
    };

    Game_Action.prototype.isChange = function() {
        return this.item() === $dataSkills[this.subject().changeSkillId()];
    };

    var _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        if (getMetaValues(this.item(), ['Change', 'チェンジ'])) {
            var result1 = target.changeFormationState();
            if (result1) {
                this.makeSuccess(target);
            }
        }
        if (getMetaValues(this.item(), ['UserChange', '使用者チェンジ'])) {
            var result2 = this.subject().changeFormationState();
            if (result2) {
                this.makeSuccess(target);
            }
        }
    };

    var _Game_Action_repeatTargets      = Game_Action.prototype.repeatTargets;
    Game_Action.prototype.repeatTargets = function(targets) {
        if (getMetaValues(this.item(), ['OnlyVanguard', '前衛のみ'])) {
            arguments[0] = targets.filter(function(target) {
                return target.isVanguard();
            });
        }
        if (getMetaValues(this.item(), ['OnlyRearguard', '後衛のみ'])) {
            arguments[0] = targets.filter(function(target) {
                return target.isRearguard();
            });
        }
        return _Game_Action_repeatTargets.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Battle
    //  前衛・後衛のチェンジを追加定義します。
    //=============================================================================
    var _Scene_Battle_createActorCommandWindow      = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.apply(this, arguments);
        this._actorCommandWindow.setHandler('change', this.commandChange.bind(this));
    };

    Scene_Battle.prototype.commandChange = function() {
        // for MPP_ActiveTimeBattle.js
        if (BattleManager.actor().onMadeAction) {
            if (BattleManager.inputtingAction()) {
                BattleManager.inputtingAction().setChange();
                BattleManager.actor().onMadeAction();
                this.selectNextCommand();
            }
        } else {
            BattleManager.inputtingAction().setChange();
            this.selectNextCommand();
        }
    };

    //=============================================================================
    // Scene_Menu
    //  前衛・後衛のチェンジを追加定義します。
    //=============================================================================
    var _Scene_Menu_onFormationOk      = Scene_Menu.prototype.onFormationOk;
    Scene_Menu.prototype.onFormationOk = function() {
        if (paramChangeInMenu) {
            var pendingIndex = this._statusWindow.pendingIndex();
            var index        = this._statusWindow.index();
            var actor        = $gameParty.members()[index];
            if (pendingIndex >= 0 && index === pendingIndex &&
                (index < $gameParty.battleMembers().length || paramRearguardLimit <= 0)) {
                actor.changeFormationState();
            }
        }
        _Scene_Menu_onFormationOk.apply(this, arguments);
    };

    //=============================================================================
    // Window_MenuStatus
    //  前衛・後衛で描画位置を変更します。
    //=============================================================================
    Window_MenuStatus.shiftWidth              = paramFaceShift ? 24 : 0;
    Window_MenuStatus.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isRearguard()) {
            arguments[1] += Window_MenuStatus.shiftWidth;
        }
        Window_Base.prototype.drawActorFace.apply(this, arguments);
    };

    Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
        if (actor.isRearguard()) {
            arguments[1] += Window_MenuStatus.shiftWidth;
            arguments[3] -= Window_MenuStatus.shiftWidth;
        }
        Window_Base.prototype.drawActorSimpleStatus.apply(this, arguments);
    };

    var _Window_MenuStatus_drawCssActorStatus = Window_MenuStatus.prototype.drawCssActorStatus;
    if (_Window_MenuStatus_drawCssActorStatus) {
        Window_MenuStatus.prototype.drawCssActorStatus = function(index, actor, x, y, width, height, lss) {
            var spaceArray = FTKR.CSS.MS.simpleStatus.space.split(',').num();
            if (!this._shiftWidth) {
                this._defaultSpace = spaceArray[1];
                this._shiftWidth   = Math.min(this._defaultSpace, Window_MenuStatus.shiftWidth);
            }
            if (actor.isRearguard()) {
                arguments[2] += this._shiftWidth;
                arguments[4] -= this._shiftWidth;
                spaceArray[1] = this._defaultSpace - this._shiftWidth;
            } else {
                spaceArray[1] = this._defaultSpace;
            }
            FTKR.CSS.MS.simpleStatus.space = spaceArray.toString();
            _Window_MenuStatus_drawCssActorStatus.apply(this, arguments);
        };
    }

    //=============================================================================
    // Window_ActorCommand
    //  チェンジコマンドを追加定義します。
    //=============================================================================
    var _Window_ActorCommand_makeCommandList      = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.apply(this, arguments);
        if (this._actor && paramSkillIdChange) {
            this.addChangeCommand();
        }
    };

    Window_ActorCommand.prototype.addChangeCommand = function() {
        var skill = $dataSkills[paramSkillIdChange];
        this.addCommand(skill ? skill.name : 'Change', 'change', this.isChangeEnabled());
    };

    Window_ActorCommand.prototype.isChangeEnabled = function() {
        return this._actor ? this._actor.isChangeableFormationState() : false;
    };

    //=============================================================================
    // Sprite_Battler
    //  前衛・後衛によって位置を変動させます。
    //=============================================================================
    var _Sprite_Battler_initMembers      = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._formationX = 0;
        this._formationY = 0;
    };

    var _Sprite_Battler_setHome      = Sprite_Battler.prototype.setHome;
    Sprite_Battler.prototype.setHome = function(x, y) {
        _Sprite_Battler_setHome.apply(this, arguments);
        this._formationX = this._battler.getFormationOffsetX();
        this._formationY = this._battler.getFormationOffsetY();
    };

    var _Sprite_Battler_updatePosition      = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        _Sprite_Battler_updatePosition.apply(this, arguments);
        this.updateFormation();
        this.x += this._formationX;
        this.y += this._formationY;
    };

    Sprite_Battler.prototype.updateFormation = function() {
        var targetFormationX = this._battler.getFormationOffsetX();
        var targetFormationY = this._battler.getFormationOffsetY();
        if (targetFormationX > this._formationX) {
            this._formationX = Math.min(this._formationX + paramChangeSpeed, targetFormationX);
        }
        if (targetFormationX < this._formationX) {
            this._formationX = Math.max(this._formationX - paramChangeSpeed, targetFormationX);
        }
        if (targetFormationY > this._formationY) {
            this._formationY = Math.min(this._formationY + paramChangeSpeed, targetFormationY);
        }
        if (targetFormationY < this._formationY) {
            this._formationY = Math.max(this._formationY - paramChangeSpeed, targetFormationY);
        }
    };

    var _Sprite_Battler_stepFlinch      = Sprite_Battler.prototype.stepFlinch;
    Sprite_Battler.prototype.stepFlinch = function() {
        this._homeX += this._formationX;
        this._homeY += this._formationY;
        _Sprite_Battler_stepFlinch.apply(this, arguments);
        this._homeX -= this._formationX;
        this._homeY -= this._formationY;
    };

    var _Sprite_Actor_stepFlinch      = Sprite_Actor.prototype.stepFlinch;
    Sprite_Actor.prototype.stepFlinch = function() {
        this._homeX += this._formationX;
        this._homeY += this._formationY;
        _Sprite_Actor_stepFlinch.apply(this, arguments);
        this._homeX -= this._formationX;
        this._homeY -= this._formationY;
    };
})();

