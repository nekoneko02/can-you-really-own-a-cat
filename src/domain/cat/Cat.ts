import { AffectionLevel } from './AffectionLevel';
import { Health } from './Health';
import { Hunger } from './Hunger';
import { StressLevel } from './StressLevel';

/**
 * 猫エンティティ
 * ゲーム内の猫の状態を管理する
 */
export class Cat {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _affectionLevel: AffectionLevel,
    private readonly _stressLevel: StressLevel,
    private readonly _health: Health,
    private readonly _hunger: Hunger
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get affectionLevel(): AffectionLevel {
    return this._affectionLevel;
  }

  get stressLevel(): StressLevel {
    return this._stressLevel;
  }

  get health(): Health {
    return this._health;
  }

  get hunger(): Hunger {
    return this._hunger;
  }

  /**
   * デフォルト値で猫を生成
   */
  static createDefault(id: string, name: string): Cat {
    return new Cat(
      id,
      name,
      new AffectionLevel(50),
      new StressLevel(30),
      new Health(100),
      new Hunger(50)
    );
  }

  /**
   * なつき度を更新した新しいインスタンスを返す
   */
  updateAffection(newAffection: AffectionLevel): Cat {
    return new Cat(
      this._id,
      this._name,
      newAffection,
      this._stressLevel,
      this._health,
      this._hunger
    );
  }

  /**
   * ストレス度を更新した新しいインスタンスを返す
   */
  updateStress(newStress: StressLevel): Cat {
    return new Cat(
      this._id,
      this._name,
      this._affectionLevel,
      newStress,
      this._health,
      this._hunger
    );
  }

  /**
   * 健康度を更新した新しいインスタンスを返す
   */
  updateHealth(newHealth: Health): Cat {
    return new Cat(
      this._id,
      this._name,
      this._affectionLevel,
      this._stressLevel,
      newHealth,
      this._hunger
    );
  }

  /**
   * 空腹度を更新した新しいインスタンスを返す
   */
  updateHunger(newHunger: Hunger): Cat {
    return new Cat(
      this._id,
      this._name,
      this._affectionLevel,
      this._stressLevel,
      this._health,
      newHunger
    );
  }

  /**
   * 餌を与える
   * 空腹度が減少し、なつき度が増加する
   */
  feed(): Cat {
    const newHunger = this._hunger.decrease(30);
    const newAffection = this._affectionLevel.increase(5);

    return new Cat(
      this._id,
      this._name,
      newAffection,
      this._stressLevel,
      this._health,
      newHunger
    );
  }

  /**
   * 遊ぶ
   * なつき度が増加し、ストレスが減少する
   */
  play(): Cat {
    const newAffection = this._affectionLevel.increase(10);
    const newStress = this._stressLevel.decrease(15);

    return new Cat(
      this._id,
      this._name,
      newAffection,
      newStress,
      this._health,
      this._hunger
    );
  }
}
