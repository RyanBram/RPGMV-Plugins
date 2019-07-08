[トップページに戻る](README.md)

# [FTKR_CustomSimpleActorStatus](FTKR_CustomSimpleActorStatus.js) プラグイン

アクターのステータス表示を変更するプラグインです。

ダウンロード: [FTKR_CustomSimpleActorStatus.js](https://raw.githubusercontent.com/futokoro/RPGMaker/master/FTKR_CustomSimpleActorStatus.js)

# 目次

以下の項目の順でプラグインの使い方を説明します。
1. [概要](#概要)
1. [プラグインの登録](#プラグインの登録)
2. [基本設定](#基本設定)
    1. [レイアウトの基本構成](#レイアウトの基本構成)
    2. [表示できるステータス](#表示できるステータス)
3. [レイアウトの設定](FTKR_CustomSimpleActorStatus_1.ja.md)
    1. [statusListの操作](FTKR_CustomSimpleActorStatus_1.ja.md#statuslistの操作)
    1. [statusListパラメータの設定](FTKR_CustomSimpleActorStatus_1.ja.md#statuslistパラメータの設定)
    1. [その他の設定](FTKR_CustomSimpleActorStatus_1.ja.md#その他の設定)
4. [ステータスの表示](FTKR_CustomSimpleActorStatus_2.ja.md)
    1. [顔画像の表示](FTKR_CustomSimpleActorStatus_2.ja.md#顔画像の表示)
    2. [歩行キャラ画像の表示](FTKR_CustomSimpleActorStatus_2.ja.md#歩行キャラ画像の表示)
    3. [SV戦闘キャラ画像の表示](FTKR_CustomSimpleActorStatus_2.ja.md#SV戦闘キャラ画像の表示)
    4. [ステートアイコンの表示](FTKR_CustomSimpleActorStatus_2.ja.md#ステートアイコンの表示)
    5. [パラメータの差分表示](FTKR_CustomSimpleActorStatus_2.ja.md#パラメータの差分表示)
    5. [装備パラメータの表示](FTKR_CustomSimpleActorStatus_2.ja.md#装備パラメータの表示)
    5. [ＡＯＰ装備パラメータの表示](FTKR_CustomSimpleActorStatus_2.ja.md#ＡＯＰ装備パラメータの表示)
    5. [カスタムパラメータの表示](FTKR_CustomSimpleActorStatus_2.ja.md#カスタムパラメータの表示)
    6. [カスタムゲージの表示](FTKR_CustomSimpleActorStatus_2.ja.md#カスタムゲージの表示)
    7. [カスタム画像の表示](FTKR_CustomSimpleActorStatus_2.ja.md#カスタム画像の表示)
    6. [アクター別のカスタムゲージの表示](FTKR_CustomSimpleActorStatus_2.ja.md#アクター別のカスタムゲージの表示)
    6. [クラス別のカスタムゲージの表示](FTKR_CustomSimpleActorStatus_2.ja.md#クラス別のカスタムゲージの表示)
    6. [メッセージの表示](FTKR_CustomSimpleActorStatus_2.ja.md#メッセージの表示)
* [プラグインの更新履歴](#プラグインの更新履歴)
* [拡張プラグイン](#拡張プラグイン)
* [ライセンス](#ライセンス)

# 概要

当プラグインは、アクターのステータス表示のレイアウトをより詳細に設定できる処理を実装します。

当プラグインの拡張プラグイン(FTKR_CSS_***.js)と組み合わせることで、メニュー画面や、バトル画面などさまざまなステータス画面を設定できるようになります。

プラグインのバージョンによって設定方法が異なります。
v2.x.xの場合は[こちら](FTKR_CustomSimpleActorStatus_old.ja.md)を参照してください。

[目次に戻る](#目次)

# プラグインの登録

以下のプラグインと組み合わせて使用する場合は、プラグイン管理画面で以下の順の配置になるように登録してください。
```
YEP_BuffsStatesCore.js
FTKR_CustomSimpleActorStatus.js
FTKR_CSS_***.js
FTKR_ExSvMotion.js
FTKR_FacialImageDifference.js
```

[目次に戻る](#目次)

# 基本設定
## レイアウトの基本構成

ステータスウィンドウのレイアウトは、プラグインパラメータ`statusList`によって設定します。
このパラメータは、拡張プラグイン(FTKR_CSS_***.js)側で設定します。

`statusList`は、以下のようにリスト構造になっています。
このリストの１つ１つの要素によって、どんなステータスをどこに表示するのか指定します。

以下の例では、7つのステータス(face,name,level,state,class,hp,mp)を表示する設定になっています。

リストにはいくつでもステータスを追加することができます。

![画像](image/FTKR_CustomSimpleActorStatus/n01_statusList.png)

プラグインパラメータ`statusList`のリストの要素は、以下のようになっています。
以下のパラメータを個別に設定します。
* text  : [表示させるステータス](#表示できるステータス)を指定します。
* value : 表示させるステータスによって入力する内容が変わります。
* x : このステータスのウィンドウ内での表示位置(x座標)を指定します。
* y : このステータスのウィンドウ内での表示位置(y座標)を指定します。
* width : このステータスの表示幅を指定します。

![画像](image/FTKR_CustomSimpleActorStatus/n01_statusList_param.png)

これらのパラメータを設定することで、メニュー画面などのステータスウィンドウに反映されます。

![画像](image/FTKR_CustomSimpleActorStatus/n01_menuScene.png)

[目次に戻る](#目次)

## 表示できるステータス

プラグインパラメータ`statusList`のリストで設定可能な、ステータスの一覧です。

* `text`と`value`が、プラグインパラメータに入力する内容です。
* `value`が`-`になっている場合は、入力不要です。
* `text`に入力する文字列には、大文字小文字の区別はありません。
* `value`に対しては、スクリプトを入力することもできます。
* 制御文字欄に ○ があるステータスは、表示できる内容に制御文字が使用できます。

### アクター用コード

一部のコードはエネミーに対しても表示可能です。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| 名前 | name | - | - | アクターの名前を表示します
| 二つ名 | nickname | - | - | アクターの二つ名を表示します |
| 職業 | class | - | - | アクターの職業を表示します |
| レベル | level | - | - | アクターの現在レベルを表示します |
| ＨＰ | hp | - | - | アクターの現在HPと最大HPとHPゲージを表示します |
| ＭＰ | mp | - | - | アクターの現在MPと最大MPとMPゲージを表示します |
| ＴＰ | tp | - | - | アクターの現在TPとTPゲージを表示します |
| [顔画像](FTKR_CustomSimpleActorStatus_2.ja.md#顔画像の表示) | face <br> face(%1) | - <br> 行数 | - | アクターの顔画像を表示します |
| [歩行キャラ画像](FTKR_CustomSimpleActorStatus_2.ja.md#歩行キャラ画像の表示) | chara | - | - | アクターの歩行キャラ画像(正面)を表示します |
| [SV戦闘キャラ画像](FTKR_CustomSimpleActorStatus_2.ja.md#SV戦闘キャラ画像の表示) | sv | - | - | アクターのSVの戦闘キャラ画像を表示します |
| [ステートアイコン](FTKR_CustomSimpleActorStatus_2.ja.md#ステートアイコンの表示) | state <br> state2(%1) | - <br> 行数 | - | アクターに付与されているステートのアイコンを並べて表示します |
| プロフィール | profile | - | ○ | アクターのプロフィールを表示します <br> プロフィールは自動的に描画エリアを拡張して表示します |
| 通常能力値 | param(%1) | x | - | 攻撃力や防御力等の通常能力名と数値を表示します <br> x に指定する数値と表示する能力は以下の通りです <br> 0 - 最大HP、1 - 最大MP、2 - 攻撃力、3 - 防御力 <br> 4 - 魔法攻撃、5 - 魔法防御、6 - 敏捷性、7 - 運|
| 通常能力値(素) | pbase(%1) | x | - | 攻撃力や防御力等の通常能力名と装備や特徴による増減を抜かした素の数値を表示します <br> x に指定する数値は param と同じです|
| [通常能力値(差分)](FTKR_CustomSimpleActorStatus_2.ja.md#パラメータの差分表示) | pdiff(%1) | x | ○ | 攻撃力や防御力等の通常能力の装備や特徴による増減値を表示します <br> x に指定する数値は param と同じです<br>増加値は緑、減少値は赤で表示します|
| 追加能力値 | xparam(%1) | x | - | 命中率や回避率等の追加能力名と数値を表示します <br> x に指定する数値と表示する能力は以下の通りです <br> 0 - 命中率、1 - 回避率、2 - 会心率、3 - 会心回避率 <br> 4 - 魔法回避率、5 - 魔法反射率、6 - 反撃率、7 - HP再生率 <br> 8 - MP再生率、9 - TP再生率<br> 数値の表示方法は、プラグインパラメータ`Disp Decimals Param`で少数かパーセントか選択できます<br>能力値の表示名はプラグインパラメータ`XPARAM Name`で設定できます |
| 特殊能力値 | sparam(%1) | x | - | 狙われ率や防御効果率等の特殊能力名と数値を表示します <br> x に指定する数値と表示する能力は以下の通りです <br> 0 - 狙われ率、1 - 防御効果率、2 - 回復効果率、3 - 薬の知識 <br> 4 - MP消費率、5 - TPチャージ率、6 - 物理ダメージ率 <br> 7 - 魔法ダメージ率、8 - 床ダメージ率、9 - 経験獲得率<br> 数値の表示方法は、プラグインパラメータ`Disp Decimals Param`で少数かパーセントか選択できます<br>能力値の表示名はプラグインパラメータ`SPARAM Name`で設定できます|
| 装備 | equip(%1) | x | - | 装備の名前とアイコンを表示します <br> x が装備タイプ番号を示します <br>ショップ画面で`value`に`shop`と入力すると、カーソル選択中のアイテムと同じ装備箇所を表示できます |
| [装備パラメータ](FTKR_CustomSimpleActorStatus_2.ja.md#装備パラメータの表示) | eparam(%1) | x | - | 装備変更後の攻撃力や防御力等の数値を表示します<br> x に指定する数値は param と同じです |
| 装備追加能力値 | exparam(%1) | x | - | 装備変更後の命中率や回避率等の追加能力の数値を表示します<br> x に指定する数値は xparam と同じです |
| 装備特殊能力値 | esparam(%1) | x | - | 装備変更後の狙われ率や防御効果率等の特殊能力の数値を表示します<br> x に指定する数値は sparam と同じです |
| 装備不可表示 | notequip(%1) | x | ○ | 選択中の装備アイテムを、アクターが装備できない場合に x で指定した文字を表示します。x が空欄の場合は「装備不可」と表示します。<br>アイテムデータを参照しているウィンドウで使用可能です。(例：ショップ画面) |
| [カスタムパラメータ](FTKR_CustomSimpleActorStatus_2.ja.md#カスタムパラメータの表示) | custom(%1) | x | ○ | プラグインパラメータで設定したパラメータを表示します<br> x に指定する数値はカスタムパラメータIDです |
| [カスタムゲージ](FTKR_CustomSimpleActorStatus_2.ja.md#カスタムゲージの表示) | gauge(%1) | x | ○ | プラグインパラメータで設定したゲージを表示します<br> x に指定する数値はカスタムゲージIDです |
| [アクター別のカスタムゲージ](FTKR_CustomSimpleActorStatus_2.ja.md#アクター別のカスタムゲージの表示) | agauge(%1) | x | ○ | アクターのメモ欄で設定したゲージを表示します<br> x に指定する数値はカスタムゲージIDです |
| [クラス別のカスタムゲージ](FTKR_CustomSimpleActorStatus_2.ja.md#クラス別のカスタムゲージの表示) | cgauge(%1) | x | ○ | クラスのメモ欄で設定したゲージを表示します<br> x に指定する数値はカスタムゲージIDです |
| [カスタム画像](FTKR_CustomSimpleActorStatus_2.ja.md#カスタム画像の表示) | image <br> image(%1) | - <br> 画像ID | - | アクターのメモ欄で設定した画像を表示します |
| [メッセージ](FTKR_CustomSimpleActorStatus_2.ja.md#メッセージの表示) | message | - | ○ | アクターの状態変化に合わせてメッセージを表示します |

#### アクター用特殊1

以下のコードを使用するためには、[FTKR_AddOriginalParametersプラグイン](FTKR_AddOriginalParameters.ja.md)が必要です。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| ＡＯＰ能力値 | aop(%1) | x | - | オリジナルパラメータの表示名と数値を表示します <br> x に指定する数値と表示する能力はオリジナルパラメータのIDです。|
| ＡＯＰ能力値(素) | aopbase(%1) | x | - | オリジナルパラメータの表示名と装備や特徴による増減を抜かした素の数値を表示します <br> x に指定する数値は aop と同じです|
| [ＡＯＰ能力値(差分)](FTKR_CustomSimpleActorStatus_2.ja.md#パラメータの差分表示) | aopdiff(%1) | x | ○ | 攻オリジナルパラメータの装備や特徴による増減値を表示します <br> x に指定する数値は aop と同じです<br>増加値は緑、減少値は赤で表示します|
| [ＡＯＰ装備パラメータ](FTKR_CustomSimpleActorStatus_2.ja.md#ＡＯＰ装備パラメータの表示) | eaop(%1) | x | - | 装備変更後のオリジナルパラメータの数値を表示します <br> x に指定する数値は aop と同じです |


#### アクター用特殊2

以下のコードを使用するためには、[FTKR_CSS_ShopStatusプラグイン](FTKR_CSS_ShopStatus.ja.md)が必要です。<br>
FTKR_CustomSimpleActorStatus の v3.4.0 以降から標準実装。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| [装備パラメータ(差分)](FTKR_CustomSimpleActorStatus_2.ja.md#パラメータの差分表示) | ediff(%1) | x | ○ | 装備変更後の攻撃力や防御力等の通常能力の装備や特徴による増減値を表示します <br> x に指定する数値は eparam と同じです<br>増加値は緑、減少値は赤で表示します |
| 装備追加能力値(差分) | exdiff(%1) | x | ○ | 装備変更後の命中率や回避率等の追加能力の装備や特徴による増減値を表示します <br> x に指定する数値は exparam と同じです<br>増加値は緑、減少値は赤で表示します |
| 装備特殊能力値(差分) | esdiff(%1) | x | ○ | 装備変更後の狙われ率や防御効果率等の特殊能力の装備や特徴による増減値を表示します <br> x に指定する数値は esparam と同じです<br>増加値は緑、減少値は赤で表示します |
| [ＡＯＰ装備パラメータ(差分)](FTKR_CustomSimpleActorStatus_2.ja.md#パラメータの差分表示) | eaopdiff(%1) | x | ○ | 装備変更後のオリジナルパラメータの装備や特徴による増減値を表示します <br> x に指定する数値は aop と同じです<br>増加値は緑、減少値は赤で表示します |

#### アクター用特殊3

以下のコードを使用するためには、[FTKR_CSS_CustomizeBattleResultsプラグイン](FTKR_CSS_CustomizeBattleResults.ja.md)が必要です。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| メッセージ２ | message2 | - | ○ | messageコードの表示内容に加えて、レベルアップ時のスキル習得のメッセージを表示します<br>表示に２行必要です |

#### アクター用特殊4

以下のコードを使用するためには、[FTKR_SkillTreeSystemプラグイン](FTKR_SkillTreeSystem.ja.md)が必要です。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| スキルポイント | sp | - | - | アクターのスキルポイントを表示します |

#### アクター用特殊5

以下のコードを使用するためには、[FTKR_AlternatingTurnBattleプラグイン](FTKR_AlternatingTurnBattle.ja.md)が必要です。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| 行動回数 | actc | - | - | アクターの行動回数を表示します |
| アクションポイント | actp | - | - | パーティーのアクションポイントを表示します |

### 汎用コード

以下のコードは、アクター以外のパラメータを表示します。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| テキスト | text(%1) | x | ○ | 文字列 x を表示します<br>x はパラメータの参照コードを入力することが可能です<br>text($dataItems[1].name) で、アイテムID1の名前を表示 |
| JS計算式 | eval(%1) | x | - | 文字列 x をJS関数のeval()で評価しその結果を数値で表示します |
| JS計算式 | streval(%1) | x | - | 文字列 x をJS関数のeval()で評価しその結果を文字列で表示します |
| 横線を引く | line | - | - | 横線を引きます |
| マップ表示名 | mapname | - | - | 現在マップの表示名を表示します |

### アイテム用コード

以下のコードは、アクターではなくアイテムのパラメータを表示します。<br>
ここでのアイテムとは、武器や防具、スキルも含みます。<br>
アイテムデータを参照しているウィンドウで使用可能です。(例：ショップ画面)

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| アイテム名 | iname | - | - | アイテム名を表示します |
| アイテムアイコン | iicon | - | - | アイテムに設定したアイコンを表示します |
| アイテム説明 | idesc | - | ○ | アイテムに設定した説明文を2行を使って表示します |
| アイテムタイプ | itype | - | - | アイテムタイプを表示します |
| アイテム装備タイプ | ietype | - | - | アイテムの装備タイプを表示します(武器、防具のみ) |
| アイテム範囲 | iscope | - | - | アイテムの範囲を表示します(アイテム、スキルのみ) |
| アイテム属性 | ielement | - | - | アイテムの属性を表示します(アイテム、スキルのみ) |
| アイテムパラメータ | iparam(%1) | x | - | 文字列 x のプロパティのデータを表示します |
| アイテムカスタム画像 | iimage(%1) | x | - | アイテムに設定したカスタム画像ID x を表示します |
| アイテム所持数 | inumber | - | - | アイテムの所持数を表示します(アイテム、武器、防具のみ) |

### アイテム用特殊コード

以下のコードを使用するためには、[FTKR_STS_CustomSkillStatusプラグイン](FTKR_STS_CustomSkillStatus.ja.md)が必要です。<br>
これらのコードは、スキルツリーウィンドウでのみ使用可能です。

| ステータス名 | text | value | 制御文字 |説明 |
| ----------- | ----- | ---- | ---- | ---- |
| スキル習得コスト | istscost(%1) | x | - | スキルツリー上でスキルの習得コストを表示します<br>x はコスト番号を指定します<br>複数コストを設定した場合にメモ欄の上から0,1,2...と数えます |
| スキル習得回数 | istscount | - | - | スキルツリー上でスキルの習得回数を表示します |

[目次に戻る](#目次)

# プラグインの更新履歴

| バージョン | 公開日 | 更新内容 |
| --- | --- | --- |
| [ver3.5.3](FTKR_CustomSimpleActorStatus.js) | 2019/05/12 | アイテムの所持数を表示するコード(numItem)を追加<br>装備品の表示コード(equip(%1))に、ショップ画面用の専用処理を追加 |
| ver3.5.2 | 2019/04/14 | 特殊能力値(xparam)と追加能力値(sparam)を表示するコード他を追加 |
| ver3.5.1 | 2019/03/05 | 拡張プラグインのパラメータ"statusList"の"value"の値を正しく読み取れない不具合を修正<br>選択中の装備品を装備できない時に特定も文字を表示させるパラメータ notequip を追加。※装備画面とショップ画面で使用可能 |
| ver3.5.0 | 2018/12/29 | セーブしたウィンドウ設定を変更するプラグインコマンドを追加(FTKR_CSS_BattleStatus) |
| ver3.4.7 | 2018/12/27 | FTKR_CSS_ShopStatus v2.2.2 の不具合修正対応<br>FTKR_OriginalSceneWindow でアイテムデータ画像が表示できない不具合対応 |
| ver3.4.6 | 2018/12/15 | カスタムパラメータとカスタムゲージの表示処理を見直し<br>プラグインコマンドの判定処理を見直し |
| ver3.4.5 | 2018/12/13 | code(x)の形のパラメータの判定時に必ずeval()で評価していた処理を見直し |
| ver3.4.4 | 2018/12/02 | カスタム画像で、存在しない画像IDを指定した場合にエラーになる不具合を修正 |
| ver3.4.3 | 2018/11/03 | ediff(x)、aopdiff(x)、ediffaop(x)の表示内容の設定を、pdiff(x)から独立 |
| ver3.4.2 | 2018/10/28 | オリジナルパラメータおよびオリジナルゲージの数値が、一部のシーンで正常に表示できない不具合を修正 |
| ver3.4.1 | 2018/10/11 | パラメータの差分表示に制御文字を無効にする機能を追加<br>パラメータの差分表示で 0 の場合に表示しないように変更 |
| ver3.4.0 | 2018/10/10 | ediff(x)およびediffaop(x)のコードをFTKR_CSS_ShopStatusから移動 |
| ver3.3.4 | 2018/09/29 | ステータスコードに、AOPパラメータ表示用のコードを追加 |
| ver3.3.3 | 2018/09/28 | ステータスコードに、パラメータ表示用のコードを追加 |
| ver3.3.2 | 2018/09/19 | ステータスコードに、アイテム用のコードを追加 |
| ver3.3.1 | 2018/09/19 | 戦闘不能時に、ステートアイコンを表示しない不具合を修正 |
| ver3.3.0 | 2018/09/15 | ステータスコードに、アイテム用のコードを追加<br>ステータスアイコン同士間の余白サイズを設定する機能を追加<br>ステータスアイコンを高さ幅が不足しても最低１つは表示させるように変更<br>プラグインパラメータ Enable Auto Scale を有効にした場合に、表示幅が小さい場合でもサイズ調整するように変更 |
| ver3.2.0 | 2018/09/11| FTKR_GDM_WindowEditor.js 用の記述を修正 |
| ver3.1.1 | 2018/09/09| GraphicalDesignMode.js 用の記述を削除 |
| ver3.1.0 | 2018/08/30| 拡張プラグインのプラグインパラメータで表示するステータスをリストで選択できる機能を追加 |
| ver3.0.2 | 2018/08/25| 拡張プラグインで、余白と背景透明度を 0 に設定した場合に、設定が無効になる不具合を修正 |
| ver3.0.1 | 2018/08/20| 拡張プラグインでステータスウィンドウの設定を有効にした場合にエラーになる不具合を修正 |
| ver3.0.0 | 2018/08/19| ステータスの表示とパラメータの入力に、ステータスごとの表示位置指定方式を採用<br>FTKR_GDM_WindowEditor対応版に修正<br>顔画像のサイズを調整する機能を追加 |
| [ver2.7.2](archive/FTKR_CustomSimpleActorStatus_2.7.2.js) | 2018/08/18| 拡張プラグイン使用時にステートアイコンが表示されない不具合を修正 |
| ver2.7.1 | 2018/08/17| バトルシーンでステータスウィンドウが非表示でも、ステートアイコンが表示される不具合を修正 |
| ver2.7.0 | 2018/03/17| カスタム画像をゲーム中に変更するプラグインコマンドを追加 |
| ver2.6.3 | 2018/03/12| 顔画像やカスタム画像の表示透過度の判定部を関数として独立<br>コード処理部にアクターが設定されていない場合の例外処理を追加 |
| ver2.6.2 | 2018/03/11| 角括弧で設定したコードが正しく表示されない不具合を修正<br>デザインモード中にstateコードを変更した際に、ステートアイコンの表示が一部更新されない不具合を修正 |
| ver2.6.1 | 2018/01/07| 顔画像、歩行キャラ、SVキャラのX座標方向の寄せ表示部分を関数として独立 |
| ver2.6.0 | 2017/11/18| FTKR_CSS_***Status系の拡張プラグインをGraphicalDesignMode.jsに対応する処理を追加 |
| ver2.5.1 | 2017/11/08| FTKR_OriginalSceneWindow.jsで生成したウィンドウが有る場合にシーン開始時にエラーになる不具合を修正 |
| ver2.5.0 | 2017/11/08| 横線を表示するコードを追加<br>GraphicalDesignMode.jsとFTKR_CSS_GDM.jsにより、デザインモード中にゲーム内でレイアウトを変更する機能を追加 |
| ver2.4.3 | 2017/11/02| 装備画面でフリーズする不具合を修正 |
| ver2.4.2 | 2017/11/01| カスタムパラメータとカスタムゲージで、名前が表示されない不具合を修正<br>装備のパラメータが表示されない不具合を修正 |
| ver2.4.1 | 2017/10/16 | カスタムパラメータとカスタムゲージで、制御文字を使用した時に、表示位置がずれる場合がある不具合を修正 |
| ver2.4.0 | 2017/10/16 | カスタムゲージで、現在値および最大値に文字列を表示できるように変更 |
| ver2.3.0 | 2017/07/23 | 表示コードの判定部の記述を見直し<br>括弧で数値を指定する表示コードに対して、数値ではなくスクリプトで指定できるように修正<br>FTKR_AddOriginalParametersで作成したオリジナルパラメータの装備パラメータを表示するコード「eaop(x)」を追加 |
| ver2.2.0 | 2017/06/20 | テキストコードに、JS計算式の評価処理を追加<br>JS計算式の評価コードで、文字列のまま表示する機能を追加 |
| ver2.1.0 | 2017/06/19 | カスタム画像の設定仕様を変更<br>カスタム画像を複数設定できる機能を追加 |
| ver2.0.0 | 2017/06/18 | メニュー画面のレイアウト変更機能を削除 |
| [ver1.8.0](archive/FTKR_CustomSimpleActorStatus_1.8.0.js) | 2017/06/17 | カスタムパラメータに単位を表示する機能を追加 |
| ver1.7.6 | 2017/06/10 | YEP_BuffsStatesCore.jsと組み合わせた時にステートカウントの表示が正しく更新されない不具合を修正 |
| ver1.7.5 | 2017/06/10 | テキストコードに制御文字を入力すると、正しく表示できない不具合を修正 |
| ver1.7.4 | 2017/06/09 | YEP_BuffsStatesCore.jsに対応 |
| ver1.7.3 | 2017/06/08 | ステートアイコンの表示処理をMVデフォルトに戻す機能を追加 |
| ver1.7.2 | 2017/06/07 | 波括弧による描画エリアの拡張が正しく機能しない不具合を修正<br>eval()によるJS計算結果を表示するコードを追加<br>レベルアップメッセージを表示するコードを追加 |
| ver1.7.1 | 2017/06/05 | 歩行キャラが正しく表示されない不具合を修正<br>歩行キャラの向きをマップ上のプレイヤーに合わせる機能を追加<br>SVキャラのモーションを無効にする機能を追加<br>カスタム画像を表示する位置を調整する機能を追加 |
| ver1.7.0 | 2017/06/02 | アクター毎に個別に設定できるカスタムゲージを追加<br>クラス毎に個別に設定できるカスタムゲージを追加<br>プラグインパラメータEnabled Skill Statusを無効にした場合にスキル画面のステータス欄が表示しない不具合を修正 |
| ver1.6.0 | 2017/06/01 | カスタムゲージの表示内容の調整機能を見直し<br>カスタムゲージのゲージバーを非表示にする機能を追加<br>カスタムゲージに現在値と最大値の替わりに指定した値を設定する機能を追加 |
| ver1.5.3 | 2017/05/13 | 装備画面で使用可能なパラメータ表示コード'eparam'を追加 |
| ver1.5.2 | 2017/05/12 | アクターを横に並べたときに描画エリアを拡張すると、隣のアクターの表示エリアにも拡張される不具合を修正<br>画像の表示位置の調整機能を追加 |
| ver1.5.1 | 2017/05/11 | ステータスウィンドウに表示できる人数よりもパーティーが少ない場合にエラーになる不具合を修正 |
| ver1.5.0 | 2017/05/10 | FTKR_FacialImageDifference.jsに対応 |
| [ver1.4.4](/archive/FTKR_CustomSimpleActorStatus_1.4.4.js) | 2017/05/08 | メニュー画面のアクターのスプライトが正しく更新されない不具合を修正 |
| ver1.4.3 | 2017/05/06 | アクターを横に並べた時に、顔画像が正しく表示されない不具合を修正<br>縦のカーソル間隔を設定する機能を追加 |
| ver1.4.2 | 2017/05/04 | カスタムパラメータとカスタムゲージにアクターのセルフ変数を適用 |
| ver1.4.1 | 2017/04/25 | 逃走で戦闘終了するとSVキャラの表示位置が移動する不具合を修正 |
| ver1.4.0 | 2017/04/21 | メニュー画面以外の表示変更機能を拡張プラグインとして分離<br>顔画像の表示仕様を変更<br>カスタム画像のタグの仕様を変更<br>メニュー画面の簡易ステータスウィンドウの設定変更機能を追加 |
| [ver1.3.1](/archive/FTKR_CustomSimpleActorStatus_1.3.1.js) | 2017/04/21 | FTKR_ExSvMotion.jsに対応 |
| ver1.3.0 | 2017/04/19 | ステートアイコンの表示仕様を変更 |
| [ver1.2.5](/archive/FTKR_CustomSimpleActorStatus_1.2.5.js) | 2017/04/15 | ステートアイコンの表示位置を微調整 <br> 行の高さに合わせてステートアイコンのサイズを調整する機能を追加 |
| ver1.2.4 | 2017/04/12 | 顔画像の拡大縮小処理修正 |
| ver1.2.3 | 2017/04/11 | ヘルプ修正 |
| ver1.2.2 | 2017/04/11 | 機能追加、GitHubで公開開始 |
| ver1.2.1 | 2017/04/01 | 機能削除、機能追加、[ツクマテ](http://tm.lucky-duet.com/viewtopic.php?f=5&t=3305)で公開 |
| ver1.0.0 | 2017/03/09 | 初版作成、[ツクマテ](http://tm.lucky-duet.com/viewtopic.php?f=5&t=3305)で公開 |

旧バージョンを使用する場合は、ファイル名のバージョン部分(FTKR_CustomSimpleActorStatus[_1.x.x].jsの[]部分)を削除してください。

# 拡張プラグイン

以下のプラグインを使用することで、本プラグインの機能を拡張できます。

* [FTKR_CSS_MenuStatus](FTKR_CSS_MenuStatus.ja.md) - メニュー画面のステータスレイアウトを変更できます
* [FTKR_CSS_BattleStatus](FTKR_CSS_BattleStatus.ja.md) - バトル画面のステータスレイアウトを変更できます
* [FTKR_CSS_DetailedStatus](FTKR_CSS_DetailedStatus.ja.md) - ステータス画面のステータスレイアウトを変更できます
* [FTKR_CSS_EquipStatus](FTKR_CSS_EquipStatus.ja.md) - 装備画面のステータスレイアウトを変更できます
* [FTKR_CSS_SkillStatus](FTKR_CSS_SkillStatus.ja.md) - スキル画面のステータスレイアウトを変更できます
* [FTKR_CSS_CustomizeBattleResults](FTKR_CSS_CustomizeBattleResults.ja.md) - バトル終了時に戦績画面を表示します
* [FTKR_CSS_ShopStatus](FTKR_CSS_ShopStatus.ja.md) - ショップ画面のステータスレイアウトを変更できます

* [FTKR_AddOriginalParameters](FTKR_AddOriginalParameters.ja.md) - カスタムパラメータやカスタムゲージに使用可能なアクターのオリジナルパラメータを作成できます
* [FTKR_ExSvMotion.js](FTKR_ExSvMotion.ja.md) - ステート付加時のモーションを追加・変更できます。
* [FTKR_ItemSelfVariables.js](FTKR_ItemSelfVariables.ja.md) - カスタムパラメータやカスタムゲージに使用可能なアクターのセルフ変数を追加できます。
* [FTKR_FTKR_FacialImageDifference.js](FTKR_FTKR_FacialImageDifference.ja.md) - アクターの状態に合わせて表示する顔画像を変更できます。

# ライセンス

本プラグインはMITライセンスのもとで公開しています。

[The MIT License (MIT)](https://opensource.org/licenses/mit-license.php)

#
[目次に戻る](#目次)

[トップページに戻る](README.md)