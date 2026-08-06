export const APP_VERSION = '0.2.0-structural-prototype';

export const profiles = {
  'vi-north': {
    id: 'vi-north',
    label: 'ベトナム語（北部・ハノイ系）',
    shortLabel: '北部ベトナム語',
    status: 'provisional',
    warning: '代表的傾向をもとにした比較候補です。地域差・個人差があります。'
  },
  'ceb-cebu': {
    id: 'ceb-cebu',
    label: 'セブアノ語（Bisaya／Binisaya・Cebu City系）',
    shortLabel: 'セブアノ語',
    status: 'provisional',
    warning: '代表的傾向をもとにした比較候補です。地域差・個人差があります。'
  },
  unknown: {
    id: 'unknown',
    label: '地域不明・個別観察',
    shortLabel: '地域不明',
    status: 'provisional',
    warning: '学習者本人の発音を聞き、比較候補として使用してください。'
  }
};

const MODEL_WARNING = '制御点方式への移行確認用モデルです。音声学的監修前のため授業には使用できません。';

const tongue = (root, rear, mid, front, blade, tip) => ({ root, rear, mid, front, blade, tip });

const neutralTongue = tongue(
  { x: 104, y: 162 }, { x: 128, y: 139 }, { x: 158, y: 123 },
  { x: 188, y: 116 }, { x: 215, y: 116 }, { x: 236, y: 119 }
);

export const sounds = {
  shi: {
    id: 'shi',
    label: 'し',
    teacherTitle: '日本語「し」',
    japanese: {
      ipa: '[ɕi]', place: '歯茎硬口蓋付近', manner: '摩擦', voicing: '無声', airflow: '細い口腔呼気',
      lips: '非円唇・やや横', glottis: '開放・振動なし',
      coaching: ['舌を完全には接触させない', '舌前部と口蓋の間に細い通路を作る', '息を途切れさせず流す'],
      pose: {
        tongue: tongue(
          { x: 104, y: 162 }, { x: 130, y: 136 }, { x: 160, y: 111 },
          { x: 190, y: 93 }, { x: 217, y: 88 }, { x: 237, y: 94 }
        ),
        lipGap: 11, lipRound: 0.08, jaw: 4, airflow: 1, voiced: false, velumOpen: 0
      }
    },
    candidates: {
      'vi-north': {
        ipa: '[s]-like candidate', place: '前方寄りの暫定比較', manner: '摩擦', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に舌端・舌先を日本語モデルより前方へ置いた仮説モデル。',
        pose: {
          tongue: tongue(
            { x: 104, y: 162 }, { x: 129, y: 139 }, { x: 158, y: 119 },
            { x: 189, y: 105 }, { x: 220, y: 99 }, { x: 244, y: 101 }
          ),
          lipGap: 12, lipRound: 0.02, jaw: 5, airflow: 1, voiced: false, velumOpen: 0
        }
      },
      'ceb-cebu': {
        ipa: '[s]-like candidate', place: '前方寄りの暫定比較', manner: '摩擦', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に舌端・舌先を歯茎寄りへ置いた仮説モデル。',
        pose: {
          tongue: tongue(
            { x: 104, y: 162 }, { x: 129, y: 140 }, { x: 158, y: 120 },
            { x: 190, y: 106 }, { x: 221, y: 100 }, { x: 245, y: 102 }
          ),
          lipGap: 12, lipRound: 0.02, jaw: 5, airflow: 1, voiced: false, velumOpen: 0
        }
      },
      unknown: {
        ipa: '未設定', place: '個別観察', manner: '未設定', voicing: '未設定', airflow: '未設定',
        comparison: '教師が学習者の実際の音を確認して使用するための中立モデル。',
        pose: { tongue: neutralTongue, lipGap: 12, lipRound: 0.03, jaw: 5, airflow: 0.8, voiced: false, velumOpen: 0 }
      }
    },
    focus: 'tongue', status: 'prototype-only', confidence: 'low', note: MODEL_WARNING
  },
  fu: {
    id: 'fu',
    label: 'ふ',
    teacherTitle: '日本語「ふ」',
    japanese: {
      ipa: '[ɸɯ]', place: '両唇', manner: '摩擦', voicing: '無声', airflow: '唇の狭い間からの呼気',
      lips: '弱い丸め・突き出しすぎない', glottis: '開放・振動なし',
      coaching: ['上の歯で下唇を噛まない', '唇を軽く近づける', '息を唇の中央から流す'],
      pose: {
        tongue: tongue(
          { x: 104, y: 162 }, { x: 130, y: 143 }, { x: 160, y: 131 },
          { x: 190, y: 127 }, { x: 216, y: 127 }, { x: 237, y: 130 }
        ),
        lipGap: 5, lipRound: 0.62, jaw: 2, airflow: 1.15, voiced: false, velumOpen: 0
      }
    },
    candidates: {
      'vi-north': {
        ipa: '[f]-like candidate', place: '唇歯寄りの暫定比較', manner: '摩擦', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に上歯と下唇の接近を強めた仮説モデル。',
        pose: { tongue: neutralTongue, lipGap: 3, lipRound: 0.18, jaw: 2, airflow: 1.05, voiced: false, lipDental: true, velumOpen: 0 }
      },
      'ceb-cebu': {
        ipa: '[f]/[p]-like candidate', place: '暫定比較', manner: '摩擦または閉鎖寄り', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に唇の閉鎖を日本語モデルより強くした仮説モデル。',
        pose: { tongue: neutralTongue, lipGap: 2, lipRound: 0.28, jaw: 1, airflow: 0.85, voiced: false, velumOpen: 0 }
      },
      unknown: {
        ipa: '未設定', place: '個別観察', manner: '未設定', voicing: '未設定', airflow: '未設定',
        comparison: '教師が学習者の実際の音を確認して使用するための中立モデル。',
        pose: { tongue: neutralTongue, lipGap: 4, lipRound: 0.4, jaw: 2, airflow: 0.8, voiced: false, velumOpen: 0 }
      }
    },
    focus: 'lips', status: 'prototype-only', confidence: 'low', note: MODEL_WARNING
  },
  ra: {
    id: 'ra',
    label: 'ら',
    teacherTitle: '日本語「ら」',
    japanese: {
      ipa: '[ɾa]', place: '歯茎', manner: 'はじき', voicing: '有声', airflow: '口腔気流',
      lips: '自然に開く', glottis: '振動あり',
      coaching: ['舌先を短く一度だけ触れさせる', '押し付けたままにしない', '接触後すぐに離す'],
      pose: {
        tongue: tongue(
          { x: 104, y: 162 }, { x: 128, y: 142 }, { x: 158, y: 130 },
          { x: 188, y: 124 }, { x: 216, y: 110 }, { x: 239, y: 88 }
        ),
        lipGap: 19, lipRound: 0.02, jaw: 10, airflow: 0.45, voiced: true, tap: 1, velumOpen: 0
      }
    },
    candidates: {
      'vi-north': {
        ipa: '[r]/[z]-like candidate', place: '暫定比較', manner: '持続または摩擦寄り', voicing: '有声', airflow: '口腔気流',
        comparison: 'UI検証用に舌先の接近を長く保つ仮説モデル。',
        pose: {
          tongue: tongue(
            { x: 104, y: 162 }, { x: 128, y: 142 }, { x: 158, y: 129 },
            { x: 188, y: 122 }, { x: 216, y: 106 }, { x: 240, y: 87 }
          ),
          lipGap: 19, lipRound: 0.02, jaw: 10, airflow: 0.5, voiced: true, tap: 0.25, velumOpen: 0
        }
      },
      'ceb-cebu': {
        ipa: '[r]-like candidate', place: '歯茎付近の暫定比較', manner: '震えまたは持続寄り', voicing: '有声', airflow: '口腔気流',
        comparison: 'UI検証用に舌先運動を複数回にした仮説モデル。',
        pose: {
          tongue: tongue(
            { x: 104, y: 162 }, { x: 128, y: 142 }, { x: 158, y: 129 },
            { x: 188, y: 122 }, { x: 216, y: 106 }, { x: 240, y: 87 }
          ),
          lipGap: 19, lipRound: 0.02, jaw: 10, airflow: 0.55, voiced: true, tap: 0.55, trill: true, velumOpen: 0
        }
      },
      unknown: {
        ipa: '未設定', place: '個別観察', manner: '未設定', voicing: '未設定', airflow: '未設定',
        comparison: '教師が学習者の実際の音を確認して使用するための中立モデル。',
        pose: { tongue: neutralTongue, lipGap: 19, lipRound: 0.02, jaw: 10, airflow: 0.45, voiced: true, tap: 0.5, velumOpen: 0 }
      }
    },
    focus: 'tongue', status: 'prototype-only', confidence: 'low', note: MODEL_WARNING
  }
};

export const scenes = [
  { id: 'blank', label: '無地にする' },
  { id: 'source-audio', label: '母語音候補を聞く' },
  { id: 'source-motion', label: '母語音候補の動き' },
  { id: 'target-audio', label: '日本語音を聞く' },
  { id: 'target-motion', label: '日本語音の動き' },
  { id: 'tongue', label: '舌だけ見る' },
  { id: 'lips', label: '唇だけ見る' },
  { id: 'airflow', label: '息だけ見る' },
  { id: 'voice', label: '喉・声帯だけ見る' },
  { id: 'transition', label: '母語音→日本語音' },
  { id: 'difference', label: '差分だけ見る' },
  { id: 'imitate', label: 'まねする間を作る' }
];

export const defaultState = {
  profileId: 'vi-north',
  soundId: 'shi',
  sceneId: 'blank',
  speed: 0.5,
  locked: false,
  revision: 0
};
