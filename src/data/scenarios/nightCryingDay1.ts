import { EventScenario } from '@/domain/EventScenario';
import { EventStep } from '@/domain/EventStep';
import { Choice } from '@/domain/Choice';
import { Consequence } from '@/domain/Consequence';

/**
 * 初日の夜泣きイベントシナリオ
 */
export function createNightCryingDay1Scenario(): EventScenario {
  // ステップ1: 夜中に起こされる（初期ステップ）
  const step1 = new EventStep({
    id: 'step1_wakeup',
    description: `【夜中 3:00】

「ニャアアアア！ニャアアアア！」

猫が大声で鳴いています。
時計を見ると、3時です。

明日は朝9時から予定があります。

どうしますか？`,
    catStateDescription: [],
    choices: [
      new Choice({
        id: 'investigate',
        text: '起きて様子を見る',
        consequenceText: 'あなたは起きて、猫の様子を確認しました。',
        execute: () =>
          new Consequence({
            text: 'あなたは起きて、猫の様子を確認しました。',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepA1_investigate',
      }),
      new Choice({
        id: 'ignore',
        text: '無視して寝続ける',
        consequenceText: 'あなたは無視して寝続けることにしました。',
        execute: () =>
          new Consequence({
            text: 'あなたは無視して寝続けることにしました。',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepB1_ignore',
      }),
      new Choice({
        id: 'move_out',
        text: '猫を別の部屋に追い出す',
        consequenceText: 'あなたは猫を別の部屋に追い出し、ドアを閉めました。',
        execute: () =>
          new Consequence({
            text: 'あなたは猫を別の部屋に追い出し、ドアを閉めました。',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepC1_move_out',
      }),
    ],
  });

  // 分岐A: ステップA-1（原因調査）
  const stepA1 = new EventStep({
    id: 'stepA1_investigate',
    description: `猫は部屋の中を走り回っています。
トイレは綺麗です。ご飯も残っています。

（鳴き声は続いています）

どうしますか？`,
    catStateDescription: ['元気そうだ', '少し興奮している'],
    choices: [
      new Choice({
        id: 'play',
        text: '遊んであげる',
        consequenceText:
          '猫は喜んで遊び始めました。\n\n20分が経過しました。\n猫は満足したようで、鳴き声が止まりました。\n\n猫は眠り始めました。',
        execute: () =>
          new Consequence({
            text: '猫は喜んで遊び始めました。\n\n20分が経過しました。\n猫は満足したようで、鳴き声が止まりました。\n\n猫は眠り始めました。',
            catStateChanges: { affection: 10, stress: -10 },
            playerStatsChanges: {},
            eventCompleted: true,
          }),
        nextStepId: null, // 完了
      }),
      new Choice({
        id: 'pet',
        text: '撫でてあげる',
        consequenceText:
          '猫は撫でられるのを嫌がり、逃げてしまいました。\n\n（鳴き声は続いています）',
        execute: () =>
          new Consequence({
            text: '猫は撫でられるのを嫌がり、逃げてしまいました。\n\n（鳴き声は続いています）',
            catStateChanges: { affection: -5, stress: 5 },
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepA1_investigate', // ループ
      }),
      new Choice({
        id: 'snack',
        text: 'おやつをあげる',
        consequenceText:
          '猫はおやつを食べましたが、\nすぐにまた鳴き始めました。\n\n（鳴き声は続いています）',
        execute: () =>
          new Consequence({
            text: '猫はおやつを食べましたが、\nすぐにまた鳴き始めました。\n\n（鳴き声は続いています）',
            catStateChanges: { hunger: -10 },
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepA1_investigate', // ループ
      }),
      new Choice({
        id: 'wait',
        text: 'もう少し様子を見る',
        consequenceText: '10分が経過しました。\n\n（鳴き声は続いています）',
        execute: () =>
          new Consequence({
            text: '10分が経過しました。\n\n（鳴き声は続いています）',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepA1_investigate', // ループ
      }),
    ],
  });

  // 分岐B: ステップB-1（我慢）
  const stepB1 = new EventStep({
    id: 'stepB1_ignore',
    description: `「ニャアアアア！ニャアアアア！」

鳴き声はどんどん大きくなります。
壁の向こうから「ドン！ドン！」という音が聞こえました。

30分が経過しました。
鳴き声は止まりません。

どうしますか？`,
    catStateDescription: [],
    choices: [
      new Choice({
        id: 'get_up',
        text: 'やっぱり起きて様子を見る',
        consequenceText: 'あなたは起きて、猫の様子を確認しました。',
        execute: () =>
          new Consequence({
            text: 'あなたは起きて、猫の様子を確認しました。',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepA1_investigate', // 分岐Aに合流
      }),
      new Choice({
        id: 'endure',
        text: '耐えて寝続ける',
        consequenceText:
          '1時間が経過しました。\nようやく鳴き声が止まりました。\n\nあなたは再び眠りにつきました。',
        execute: () =>
          new Consequence({
            text: '1時間が経過しました。\nようやく鳴き声が止まりました。\n\nあなたは再び眠りにつきました。',
            catStateChanges: { stress: 15, affection: -10 },
            playerStatsChanges: {},
            eventCompleted: true,
          }),
        nextStepId: null, // 完了
      }),
      new Choice({
        id: 'move_out_delayed',
        text: '猫を別の部屋に追い出す',
        consequenceText: 'あなたは猫を別の部屋に追い出し、ドアを閉めました。',
        execute: () =>
          new Consequence({
            text: 'あなたは猫を別の部屋に追い出し、ドアを閉めました。',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepC1_move_out', // 分岐Cに合流
      }),
    ],
  });

  // 分岐C: ステップC-1（締め出し）
  const stepC1 = new EventStep({
    id: 'stepC1_move_out',
    description: `猫はドアを引っ掻いて鳴いています。

「ニャアアア...ニャアアア...」

ドア越しに鳴き声が聞こえます。
猫はすばしっこく、締め出すのも一苦労でした。

どうしますか？`,
    catStateDescription: [],
    choices: [
      new Choice({
        id: 'sleep',
        text: 'このまま寝る',
        consequenceText:
          '鳴き声は聞こえ続けていますが、\n少しずつ小さくなっていきました。\n\n30分後、鳴き声は止まりました。\n\nあなたは眠りにつきました。',
        execute: () =>
          new Consequence({
            text: '鳴き声は聞こえ続けていますが、\n少しずつ小さくなっていきました。\n\n30分後、鳴き声は止まりました。\n\nあなたは眠りにつきました。',
            catStateChanges: { stress: 20, affection: -15 },
            playerStatsChanges: {},
            eventCompleted: true,
          }),
        nextStepId: null, // 完了
      }),
      new Choice({
        id: 'bring_back',
        text: 'やっぱり猫を部屋に戻す',
        consequenceText: 'あなたは猫を部屋に戻しました。',
        execute: () =>
          new Consequence({
            text: 'あなたは猫を部屋に戻しました。',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'stepA1_investigate', // 分岐Aに合流
      }),
    ],
  });

  // EventScenarioを作成
  return new EventScenario({
    id: 'night_crying_day1',
    title: '初日の夜泣き',
    initialStepId: 'step1_wakeup',
    steps: [step1, stepA1, stepB1, stepC1],
  });
}
