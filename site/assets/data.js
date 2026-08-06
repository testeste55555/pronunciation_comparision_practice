export const APP_VERSION = '0.1.0-mvp';

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

const sharedNote = '音声学監修前のUI動作確認用モデル。数値は後から差し替え可能です。';

export const sounds = {
  shi: {
    id: 'shi',
    label: 'し',
    teacherTitle: '日本語「し」',
    japanese: {
      ipa: '[ɕi]', place: '歯茎硬口蓋付近', manner: '摩擦', voicing: '無声', airflow: '細い口腔呼気',
      lips: '非円唇・やや横', glottis: '開放・振動なし',
      coaching: ['舌を完全には接触させない', '舌前部と口蓋の間に細い通路を作る', '息を途切れさせず流す'],
      pose: { tongueTipX: 36, tongueTipY: 51, tongueBodyY: 48, tongueArch: 18, lipGap: 11, lipRound: 0.12, jaw: 5, airflow: 1, voiced: 0 }
    },
    candidates: {
      'vi-north': {
        ipa: '[s]-like candidate', place: '前方寄りの暫定比較', manner: '摩擦', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に舌前部を日本語モデルより前方へ置いた暫定モデル。',
        pose: { tongueTipX: 30, tongueTipY: 56, tongueBodyY: 53, tongueArch: 11, lipGap: 12, lipRound: 0.05, jaw: 6, airflow: 1, voiced: 0 }
      },
      'ceb-cebu': {
        ipa: '[s]-like candidate', place: '前方寄りの暫定比較', manner: '摩擦', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に舌先を歯茎寄りへ置いた暫定モデル。',
        pose: { tongueTipX: 29, tongueTipY: 55, tongueBodyY: 54, tongueArch: 10, lipGap: 12, lipRound: 0.04, jaw: 6, airflow: 1, voiced: 0 }
      },
      unknown: {
        ipa: '未設定', place: '個別観察', manner: '未設定', voicing: '未設定', airflow: '未設定',
        comparison: '教師が学習者の実際の音を確認して使用するための中立モデル。',
        pose: { tongueTipX: 32, tongueTipY: 54, tongueBodyY: 52, tongueArch: 12, lipGap: 12, lipRound: 0.06, jaw: 6, airflow: 0.8, voiced: 0 }
      }
    },
    focus: 'tongue', status: 'provisional', confidence: 'low', note: sharedNote
  },
  fu: {
    id: 'fu',
    label: 'ふ',
    teacherTitle: '日本語「ふ」',
    japanese: {
      ipa: '[ɸɯ]', place: '両唇', manner: '摩擦', voicing: '無声', airflow: '唇の狭い間からの呼気',
      lips: '弱い丸め・突き出しすぎない', glottis: '開放・振動なし',
      coaching: ['上の歯で下唇を噛まない', '唇を軽く近づける', '息を唇の中央から流す'],
      pose: { tongueTipX: 31, tongueTipY: 66, tongueBodyY: 61, tongueArch: 5, lipGap: 5, lipRound: 0.7, jaw: 3, airflow: 1.15, voiced: 0 }
    },
    candidates: {
      'vi-north': {
        ipa: '[f]-like candidate', place: '唇歯寄りの暫定比較', manner: '摩擦', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に上歯と下唇の接近を強めた暫定モデル。',
        pose: { tongueTipX: 31, tongueTipY: 65, tongueBodyY: 60, tongueArch: 4, lipGap: 3, lipRound: 0.25, jaw: 3, airflow: 1.05, voiced: 0, lipDental: 1 }
      },
      'ceb-cebu': {
        ipa: '[f]/[p]-like candidate', place: '暫定比較', manner: '摩擦または閉鎖寄り', voicing: '無声', airflow: '口腔呼気',
        comparison: 'UI検証用に唇の閉鎖を日本語モデルより強くした暫定モデル。',
        pose: { tongueTipX: 31, tongueTipY: 65, tongueBodyY: 60, tongueArch: 4, lipGap: 2, lipRound: 0.35, jaw: 2, airflow: 0.85, voiced: 0 }
      },
      unknown: {
        ipa: '未設定', place: '個別観察', manner: '未設定', voicing: '未設定', airflow: '未設定',
        comparison: '教師が学習者の実際の音を確認して使用するための中立モデル。',
        pose: { tongueTipX: 31, tongueTipY: 65, tongueBodyY: 60, tongueArch: 4, lipGap: 4, lipRound: 0.45, jaw: 3, airflow: 0.8, voiced: 0 }
      }
    },
    focus: 'lips', status: 'provisional', confidence: 'low', note: sharedNote
  },
  ra: {
    id: 'ra',
    label: 'ら',
    teacherTitle: '日本語「ら」',
    japanese: {
      ipa: '[ɾa]', place: '歯茎', manner: 'はじき', voicing: '有声', airflow: '口腔気流',
      lips: '自然に開く', glottis: '振動あり',
      coaching: ['舌先を短く一度だけ触れさせる', '押し付けたままにしない', '接触後すぐに離す'],
      pose: { tongueTipX: 31, tongueTipY: 40, tongueBodyY: 59, tongueArch: 10, lipGap: 18, lipRound: 0.03, jaw: 11, airflow: 0.45, voiced: 1, tap: 1 }
    },
    candidates: {
      'vi-north': {
        ipa: '[r]/[z]-like candidate', place: '暫定比較', manner: '持続または摩擦寄り', voicing: '有声', airflow: '口腔気流',
        comparison: 'UI検証用に接触時間を長めにした暫定モデル。',
        pose: { tongueTipX: 30, tongueTipY: 39, tongueBodyY: 58, tongueArch: 11, lipGap: 18, lipRound: 0.03, jaw: 11, airflow: 0.5, voiced: 1, tap: 0.35 }
      },
      'ceb-cebu': {
        ipa: '[r]-like candidate', place: '歯茎付近の暫定比較', manner: '震えまたは持続寄り', voicing: '有声', airflow: '口腔気流',
        comparison: 'UI検証用に舌先運動を複数回・長めにした暫定モデル。',
        pose: { tongueTipX: 30, tongueTipY: 39, tongueBodyY: 58, tongueArch: 11, lipGap: 18, lipRound: 0.03, jaw: 11, airflow: 0.55, voiced: 1, tap: 0.2, trill: 1 }
      },
      unknown: {
        ipa: '未設定', place: '個別観察', manner: '未設定', voicing: '未設定', airflow: '未設定',
        comparison: '教師が学習者の実際の音を確認して使用するための中立モデル。',
        pose: { tongueTipX: 31, tongueTipY: 43, tongueBodyY: 59, tongueArch: 9, lipGap: 18, lipRound: 0.03, jaw: 11, airflow: 0.45, voiced: 1, tap: 0.5 }
      }
    },
    focus: 'tongue', status: 'provisional', confidence: 'low', note: sharedNote
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
