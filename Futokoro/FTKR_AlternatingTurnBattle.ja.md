[トップページに戻る](README.md)

# [FTKR_AlternatingTurnBattle](FTKR_AlternatingTurnBattle.js) プラグイン

敵味方交互にターンが進むターン制戦闘システムのプラグインです。

ダウンロード: [FTKR_AlternatingTurnBattle.js](https://raw.githubusercontent.com/futokoro/RPGMaker/master/FTKR_AlternatingTurnBattle.js)

# 目次

以下の項目の順でプラグインの使い方を説明します。
1. [概要](#概要)
2. [プラグインの登録](#プラグインの登録)
1. [機能の分割](#機能の分割)
1. [ターンの進行](#ターンの進行)
1. [プレイヤーのターン](#プレイヤーのターン)
1. [エネミーのターン](#エネミーのターン)
1. [戦闘行動の強制](#戦闘行動の強制)
1. [FTKR_ExBattleCommandの追加コマンド設定](#ftkr_exbattlecommandの追加コマンド設定)
* [プラグインの更新履歴](#プラグインの更新履歴)
* [ライセンス](#ライセンス)

# 概要

このプラグインを導入すると、敵味方交互にターンが進むターン制戦闘システムに変更します。

この戦闘システムは、基本的にプレイヤー側が有利に戦闘を進めることができます。

# 機能の分割

このプラグインの v2.0.0 から、以下の機能を別のプラグインに分割しました。

* 行動回数に関する機能は、[FTKR_BattleActionTimes](FTKR_BattleActionTimes.ja.md)プラグインに分割しました。
* アクションポイントに関する機能は、[FTKR_BattleActionPoints](FTKR_BattleActionPoints.ja.md)プラグインに分割しました。
* ステータスウィンドウをタッチ・クリックしてアクターを切り替える機能は、[FTKR_AltTB_SelectTouchedActor](https://raw.githubusercontent.com/futokoro/RPGMaker/master/FTKR_AltTB_SelectTouchedActor.js)プラグインに分割しました。

[目次に戻る](#目次)

# プラグインの登録

以下のプラグインと組み合わせる場合は、プラグイン管理画面で、以下の順の配置になるように登録してください。
```
FTKR_CustomSimpleActorStatus.js (ステータス表示を変更)
FTKR_FVActorAnimation.js        (フロントビューでアクター画像にアニメーション)
↑このプラグインよりも上に登録↑
FTKR_AlternatingTurnBattle.js
↓このプラグインよりも下に登録↓
FTKR_ExBattleCommand.js
FTKR_BattleActionTimes.js       (バトル画面に行動回数を表示)
FTKR_BattleActionPoints.js      (消費コストにアクションポイントを追加)
FTKR_BattleWindowLayout.js      (バトル画面のコマンドの位置を変更)
FTKR_CSS_BattleStatus.js        (バトル画面のステータス表示を変更)
FTKR_DisplayCommandFrame.js     (カーソルの変わりに枠や画像を表示)
```

## 他作者制作の戦闘用プラグインとの併用について

このプラグインのターン制戦闘システムは、ツクールMVのデフォルト戦闘システムと比べると大きく変わっています。
そのため、ツクールMVのデフォルト戦闘システムを前提とした他の戦闘用プラグインとは、併用できない可能性が高いです。うまく動作しない場合はプラグイン同士が競合している状態のため、このプラグインを使うことはできません。

基本的に仕様が大きく違うため、競合を回避しようとするとそのプラグインとの専用処理を入れることになります。それでは対応しきれないため、このプラグインにおいては他のプラグインとの競合対策は行いません。

[目次に戻る](#目次)

# ターンの進行

ターンの進行は、以下の様になります。
```
・０ターン目(*1)
・１ターン目
　ターン開始
　　⇒プレイヤーターン開始
　　(⇒プレイヤー自動行動ターン)(*2)
　　　⇒プレイヤーターン中(コマンド入力)
　　　(⇒プレイヤー自動行動ターン)(*2)
　　　　⇒プレイヤーターン終了
　　　　　⇒エネミーターン開始
　　　　　　⇒エネミーターン中
　　　　　　　⇒エネミーターン終了
　　　　　　　　⇒ターン終了
・２ターン目
　ターン開始
　　⇒･･･
```
*1: ０ターン目には、ターン開始～ターン終了はありません。<br>
*2: プレイヤー自動行動ターンは、プラグインパラメータ`Confused Action Timing`で、どちらか片方のタイミングで実行します。

先制攻撃が発生すると、エネミーの１ターン目が無くなり、連続でプレイヤーが行動できます。

不意打ちが発生すると、プレイヤーの１ターン目が無くなり、エネミーターンから始まります。

[目次に戻る](#目次)

# プレイヤーのターン

プレイヤーのターンでは、以下の仕様になります。

1. アクターの行動順は任意に選択できます。
2. pgUpキーとpgDnキーで行動させるアクターを選択できます。(*1)
3. アクターを選択し行動を決定すると、即座にスキルが発動し、その後に次に行動するアクター選択に移ります。
4. キャラが行動すると、そのキャラの行動回数を１消費します。
5. 全員が行動済み、または行動できない状態になるか、パーティーコマンドの「ターン終了」を選ぶと、エネミーのターンに移ります。
6. キャンセルキーで、パーティーコマンドを表示できます。
7. 誰かが行動したターンでは、パーティーコマンドの「逃げる」は実行できなくなります。
8. 行動制約のあるステートを受けているアクター、または自動戦闘の特徴を持つアクターは行動選択できず、プレイヤーターンの開始時または終了時に行動制約に合わせた自動行動を行います。この自動行動は行動回数の消費を無視します。(*2)
9. 自動行動を行うキャラが複数いる場合の行動順は、アクターの敏捷性と使用するスキルの速度補正によって決まります。
1. アクターに付与されたステートおよび強化のターン経過は、エネミーターン終了時に１進みます。

(*1)プラグインパラメータ`Change Player`で操作方法は変更できます。<br>
(*2)プラグインパラメータ`Confused Action Timing`で実行タイミングは変更できます。

[目次に戻る](#目次)

## プレイヤーターンでのアクター変更を禁止する

プラグインパラメータ`Change Player`で「禁止」に設定した場合、プレイヤーターンでアクターを変更できなくなります。

この場合のアクターの行動順は、パーティーの並び順と同じです。

[目次に戻る](#目次)

# エネミーのターン

エネミーのターンでは、従来のMVのシステムとほぼ同じです。

1. エネミーは、ターン開始時に使用するスキルと行動順を決めます。
1. エネミーの行動順は、エネミーの敏捷性と使用するスキルの速度補正によって決まります。
3. エネミーに付与されたステートおよび強化のターン経過は、プレイヤーターン終了時に１進みます。

[目次に戻る](#目次)

# 戦闘行動の強制

イベントコマンドの「戦闘行動の強制」は、プレイヤーターン・エネミーターン問わずに実行させることができます。

例えばエネミーターン中に、アクターに対して「戦闘行動の強制」でスキルの「攻撃」を使用させた場合は、そのエネミーターンの間に、アクターが「攻撃」を実行します。

[目次に戻る](#目次)

# FTKR_ExBattleCommandの追加コマンド設定

FTKR_ExBattleCommandプラグインで本プラグインのコマンド設定にするためには、プラグインパラメータ`Party Commands`を以下の内容に変更してください。

### fightを変更
| パラメータ | 値 | 備考 |
| --- | --- | --- |
| enabled | $gameParty.canInput() |  |
| ext | 空欄 | |
| skillId | 任意 | |

### customsに追加
| パラメータ | 値 | 備考 |
| --- | --- | --- |
| name | ターン終了 | 任意のコマンド名にしても問題ありません。 |
| symbol |  turnEnd | 大文字小文字に注意してください。 |
| enabled | 空欄 | スクリプトで条件を追加しても問題ありません。 |
| ext | 空欄 | |
| skillId | 任意 | |

[目次に戻る](#目次)

# プラグインの更新履歴

| バージョン | 公開日 | 更新内容 |
| --- | --- | --- |
| [ver2.1.0](FTKR_AlternatingTurnBattle.js) | 2018/12/19 | プレイヤーターンでアクターを変更する操作を禁止する機能を追加<br>パーティーコマンドを表示する操作を禁止する機能を追加 |
| ver2.0.5 | 2018/12/18 | 他プラグインとの競合回避処理追加 |
| ver2.0.4 | 2018/12/15 | プラグインパラメータ Change Player を左右キーに設定して、アクター変更を行うとエラーになる不具合を修正。(v2.0.3のバグ) |
| ver2.0.3 | 2018/12/11 | FTKR_AISkillEvaluateとの競合回避<br>FTKR_BattleActionTimesと組み合わせた時に、行動回数の修正がターン終了時にリセットされない不具合を修正 |
| ver2.0.2 | 2018/12/08 | ターンが進むタイミングがずれていたのを修正<br>アクターとエネミーが受けたステートのターン経過のタイミングを見直し<br>戦闘行動の強制を実行後のターン進行が、正しく進まない不具合を修正 |
| ver2.0.1 | 2018/12/02 | プラグインパラメータ Disable Change When Party Cannot Act を削除しパーティーが行動できなくなった時に、自動でパーティーコマンドに戻すように変更<br>パーティーが行動できなくなった時に、ターン終了コマンドに自動でカーソルを合わせる機能を追加 |
| ver2.0.0 | 2018/12/02 | 行動回数に関する処理を見直し、別プラグインに独立<br>アクションポイントに関する処理を見直し、別プラグインに独立<br>タッチまたはクリックでコマンド選択中のアクターを変更する機能を別プラグインに独立<br>ターン中の処理を全面見直し<br>行動制約のあるパーティーメンバーの行動処理を見直し<br>アクターの自動戦闘の効果が出るように変更 |
| [ver1.6.2](archive/FTKR_AlternatingTurnBattle_1.6.2.js) | 2018/11/17 | 行動制限付きステートを付与したターンに解除した場合に、戦闘が止まってしまう不具合を修正。この場合は、行動できずにターンを終了するようにしました。 |
| ver1.6.1 | 2018/11/11 | ACを無効にした場合に、エネミーターンが終了しない不具合を修正<br>「逃げる」コマンドに失敗した時に、１ターン余計に進んでしまう不具合を修正<br>「逃げる」コマンドを実行し戦闘終了させた時に、画面外に逃げたSVアクターが画面内に戻ってきてしまう不具合を修正 |
| ver1.6.0 | 2018/11/09 | アクターコマンドおおびアイテム・スキルウィンドウのアクションポイントを非表示にする機能を追加 |
| ver1.5.0 | 2018/10/28 | パーティーが行動できなくなった場合に、アクター変更操作を禁止して自動でパーティーコマンドに戻す機能を追加<br>AP0スキルを覚えていれば、パーティーのAPが0でも行動可能にする機能を追加<br>パーティーが行動できなくなった場合に、パーティーコマンドの戦うを選択できないように変更 |
| ver1.4.9 | 2018/10/21 | エネミーが行動制約のあるステートを受けた場合に、ターンが進行しなくなる不具合を修正 |
| ver1.4.8 | 2018/10/20 | v1.4.7の修正内容による、行動選択時にエラーになる不具合を修正<br>行動回数の増加のプラグインコマンドの入力内容で、パーティーと敵グループの番号指定がずれている不具合を修正 |
| ver1.4.7 | 2018/10/20 | エネミーの行動回数を増加をさせても反映されない不具合を修正 |
| ver1.4.6 | 2018/10/16 | ｖ1.4.5の修正内容によるYEP_BattleEngineCoreとの競合部分の回避処理を追加 |
| ver1.4.5 | 2018/10/04 | パーティーが行動制約のあるステートを受けても効果が発生しない不具合を修正<br>行動制約による強制行動の実行タイミングを設定する機能を追加 |
| ver1.4.4 | 2018/09/15 | イベントコマンド「戦闘行動の強制」を使用した場合に、行動選択時にエラーになる不具合を修正<br>プラグインパラメータ AP Window Layout を設定せずに、APを有効にした場合に戦闘開始時にエラーになる不具合を修正 |
| ver1.4.3 | 2018/08/26 |  v1.4.2の修正箇所の不具合(最大値設定無しの場合にプラグインコマンドで行動回数が増加しない)修正 |
| ver1.4.2 | 2018/08/25 |  戦闘中にプラグインコマンドで行動回数を増加させても、行動選択時にエラーになる不具合を修正<br>戦闘中にプラグインコマンドで行動回数が増減した場合に、ステータスウィンドウに反映されない不具合を修正 |
| ver1.4.1| 2018/08/21 |  戦闘シーン以外でも actionCount() にて行動回数を取得できるように修正<br>行動回数に最大値を設定する機能を追加<br>行動回数の表示方式に、ゲージとアイコンを追加 |
| ver1.4.0| 2018/08/18 | アクションポイントの最大値を設定する機能を追加<br>アクションポイントの表示方式を現在値と最大値、ゲージ、またはアイコンに変更<br>アクションポイントウィンドウの表示レイヤーをパーティーコマンドウィンドウの下に変更<br>アクションポイントウィンドウの背景を設定する機能を追加 |
| ver1.3.3| 2018/08/17 | FTKR_CustomSimpleActorStatus または FTKR_FVActorAnimation と組合せた時に、行動済みのアクターの「名前＋顔画像をグレー表示」が正常に動作しない不具合を修正。 |
| ver1.3.2 | 2018/08/05 | 行動後モーションを停止に設定した場合、ターン開始時に待機モーションに戻らない不具合を修正。(サイドビュー)<br>プレイヤーターン終了時に未行動のアクターのモーションを設定する機能を追加<br>キー操作でアクターを変更する場合に、行動回数を追加したアクターから次のアクターにカーソルが正常に移らない不具合を修正<br>複数回行動可能なアクターが、行動後にまだ行動回数が残っていても１歩下がってしまう不具合を修正。(サイドビュー)<br>行動回数消費を無効かつアクターコマンド選択から開始に設定した場合に、最初のアクターが前進後にすぐに一歩下がってしまう不具合を修正。(サイドビュー) |
| ver1.3.1| 2018/07/27 | FTKR_FVActorAnimation.jsと組み合わせた時に、FTKR_FVActorAnimationのアクターエフェクト機能が正常に動作しない不具合を修正<br>FTKR_CustomSimpleActorStatus.jsで行動回数とアクションポイントを表示する機能を追加 |
| ver1.3.0| 2018/05/04 | 使用したスキル命中時に、<AltTB_GainAP:n>で設定したAP取得の条件を設定できる機能を追加 |
| ver1.2.2| 2018/04/30 | 自動でプレイヤーターンを飛ばす処理が正常に動作しない不具合を修正<br>エネミーターンに移行した直後にゲームが止まる不具合を修正<br>特定のスキル・アイテムの行動回数の消費を無効にする機能を追加 |
| ver1.2.1| 2018/04/29 | AP0になった時に、ゲームがフリーズする不具合を修正<br>戦闘行動の強制で消費APを無効にしても、AP0になった際に戦闘行動の強制を実行できない不具合を修正<br>アクターの行動回数を無効にした時に、同じアクターを２回以上行動させるとエラーになる不具合を修正<br>アクターの行動回数を無効にした時に、エネミーターンが終わらない不具合を修正<br>プレイヤーが全員行動できなくなった時に、自動でプレイヤーターンを飛ばすかどうか設定する機能を追加<br>パーティーの初期APとスキル・アイテムの消費APのデフォルト値を、どちらも 0 に設定できるように変更 |
| ver1.2.0| 2018/04/29 | アクションポイントウィンドウのレイアウト設定機能を追加<br>スキル使用後にAPを一定値自動取得可能な機能を追加<br>アクターの行動回数による行動制限を無効にする機能を追加 |
| ver1.1.0| 2018/04/09 | アクターコマンドのAP表示部の処理を見直し<br>APの表示幅や表示色を設定する機能を追加<br>残り行動回数を表示する機能を追加<br>マウスクリックでアクターを変更する機能を追加 |
| ver1.0.0 | 2018/04/08 | 初版作成 |

## 拡張プラグイン

以下のプラグインを使用することで、本プラグインの機能を拡張できます。

* [FTKR_AltTB_BattleEventConditions](FTKR_AltTB_BattleEventConditions.ja.md) - このプラグインのターン進行に合わせたバトルイベントのターン条件を設定できます。
* [FTKR_AltTB_SelectTouchedActor](https://raw.githubusercontent.com/futokoro/RPGMaker/master/FTKR_AltTB_SelectTouchedActor.js) - ステータスウィンドウを直接クリック・タップすることで、アクター選択を切り替えることができます。
* [FTKR_BattleWindowLayout](FTKR_BattleWindowLayout.ja.md) - 戦闘時のウィンドウ配置を変更する。

## ライセンス

本プラグインはMITライセンスのもとで公開しています。

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php)

#
[目次に戻る](#目次)

[トップページに戻る](README.md)