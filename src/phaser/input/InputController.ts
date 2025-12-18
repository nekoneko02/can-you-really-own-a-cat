/**
 * InputController
 *
 * キーボード入力を抽象化し、PlayerInputに変換する。
 * 将来的にタッチ操作などの他の入力方式にも対応できるよう設計。
 */

import Phaser from 'phaser';
import { Direction } from '@/domain/types';
import { PlayerInput } from '@/application/types';

/**
 * 入力コントローラー
 *
 * Phaserのキーボード入力を取得し、PlayerInput形式に変換します。
 */
export class InputController {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: { [key: string]: Phaser.Input.Keyboard.Key };

  /**
   * コンストラクタ
   *
   * @param scene - Phaserシーン
   */
  constructor(scene: Phaser.Scene) {
    // カーソルキーを設定
    this.cursors = scene.input.keyboard?.createCursorKeys();

    // WASDキーとSpaceキーを設定
    if (scene.input.keyboard) {
      this.keys = {
        w: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        space: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      };
    }
  }

  /**
   * 入力を取得してPlayerInputに変換
   *
   * @returns PlayerInput | null - 入力がない場合はnull
   */
  getInput(): PlayerInput | null {
    if (!this.cursors || !this.keys) return null;

    // 方向キーの判定（優先順位: 上 > 下 > 左 > 右）
    let direction: Direction = Direction.NONE;

    if (this.cursors.up.isDown || this.keys.w.isDown) {
      direction = Direction.UP;
    } else if (this.cursors.down.isDown || this.keys.s.isDown) {
      direction = Direction.DOWN;
    } else if (this.cursors.left.isDown || this.keys.a.isDown) {
      direction = Direction.LEFT;
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      direction = Direction.RIGHT;
    }

    // インタラクトキーの判定
    const interact = this.keys.space.isDown;

    // どの入力もない場合はnullを返す
    if (direction === Direction.NONE && !interact) {
      return null;
    }

    return {
      direction: direction !== Direction.NONE ? direction : undefined,
      interact: interact || undefined,
    };
  }
}
