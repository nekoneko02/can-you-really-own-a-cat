/**
 * InteractionManager
 *
 * プレイヤーとオブジェクトのインタラクションを管理します。
 * - インタラクション範囲判定（50px以内）
 * - ハイライト表示
 * - インタラクト実行（TODO: PhaserAction実行は将来実装）
 */

import { InteractiveObject } from './InteractiveObject';

export class InteractionManager {
  private scene: Phaser.Scene;
  private objects: InteractiveObject[] = [];
  private nearestObject: InteractiveObject | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * インタラクト可能なオブジェクトを登録
   * @param object インタラクト可能オブジェクト
   */
  addObject(object: InteractiveObject): void {
    this.objects.push(object);
  }

  /**
   * インタラクション範囲判定を更新
   * @param playerX プレイヤーのX座標
   * @param playerY プレイヤーのY座標
   */
  update(playerX: number, playerY: number): void {
    // 前フレームのハイライトを解除
    if (this.nearestObject) {
      this.nearestObject.unhighlight();
      this.nearestObject = null;
    }

    // インタラクト可能なオブジェクトを検索
    const inRangeObjects = this.objects.filter((obj) =>
      obj.isInRange(playerX, playerY)
    );

    if (inRangeObjects.length === 0) {
      return;
    }

    // 最も近いオブジェクトを選択
    this.nearestObject = inRangeObjects.reduce((nearest, obj) => {
      const nearestDist = nearest.getDistanceFrom(playerX, playerY);
      const objDist = obj.getDistanceFrom(playerX, playerY);
      return objDist < nearestDist ? obj : nearest;
    });

    // ハイライト表示
    this.nearestObject.highlight();
  }

  /**
   * 現在インタラクト可能なオブジェクトを取得
   */
  getNearestObject(): InteractiveObject | null {
    return this.nearestObject;
  }

  /**
   * インタラクトを実行
   */
  interact(): void {
    if (!this.nearestObject) {
      return;
    }

    const objectId = this.nearestObject.id;

    console.log(`[InteractionManager] インタラクト: ${objectId}`);

    // TODO: 将来実装
    // 1. GameControllerにinteractイベントを送信
    //    - controller.tick({ interact: true, targetObject: objectId })
    // 2. GameControllerからPhaserActionを受け取る
    //    - const phaserAction = gameView.phaserAction
    // 3. PhaserActionの種類に応じて処理を分岐
    //    - MOVE_TO: プレイヤーを対象位置に移動
    //    - INTERACT_WITH: 対象オブジェクトとのインタラクション実行
    //    - WAIT: 何もしない
  }

  /**
   * すべてのオブジェクトを破棄
   */
  destroy(): void {
    this.objects.forEach((obj) => obj.destroy());
    this.objects = [];
    this.nearestObject = null;
  }
}
