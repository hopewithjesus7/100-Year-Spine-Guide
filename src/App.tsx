import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, BookOpen, Stethoscope, ArrowRight, ChevronLeft, Info, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, BrainCircuit, Activity, ShieldAlert, Dumbbell, Bed, Play, Square, Wind, Timer, Heart, Compass, Footprints } from 'lucide-react';

const questions = [
  {
    id: 'q1',
    text: '현재 가장 불편한 증상은 무엇인가요?',
    options: [
      { text: '허리 주변(가운데, 골반 위)이 뻐근하고 아파요', nextId: 'q_disc' },
      { text: '엉덩이부터 허벅지, 종아리까지 뻗치듯이 땅기고 아파요', nextId: 'q_rad' },
      { text: '앉아있을 땐 괜찮은데, 걷다 보면 다리가 아파서 쉬어야 해요', nextId: 'q_sten' },
      { text: '척추위생을 지키는데도 몇 달째 낫지 않아요', nextId: 'q_not_healing' },
      { text: '양쪽 다리에 힘이 빠지고 대소변 보기가 힘들어요', resultId: 'emergency' }
    ]
  },
  {
    id: 'q_disc',
    text: '언제 허리가 가장 아프신가요?',
    options: [
      { text: '무거운 물건을 들거나 삐끗한 직후예요', resultId: 'acute_disc' },
      { text: '아침에 세수할 때나, 방바닥에 오래 앉았다 일어설 때 한 번에 펴기 힘들어요', resultId: 'chronic_disc' },
      { text: '몇 달/몇 년째 계속 아프고, 일상생활이 우울할 정도로 힘들어요', resultId: 'disc_collapse' }
    ]
  },
  {
    id: 'q_rad',
    text: '다리가 땅기는 증상(방사통)에 대해 더 자세히 알려주세요.',
    options: [
      { text: '앉아있을 때 심해지고, 서서 걸으면 오히려 좀 나아요', resultId: 'disc_herniation' },
      { text: '발목이나 발가락에 힘이 빠져서 잘 안 움직여요', resultId: 'motor_weakness' },
      { text: '허리를 뒤로 젖힐 때(신전) 다리 통증이 극심해져요', resultId: 'severe_rad' }
    ]
  },
  {
    id: 'q_sten',
    text: '걷다가 쉴 때, 어떤 자세를 하면 편해지나요?',
    options: [
      { text: '허리를 약간 구부리고 앉아서 쉬면 금방 편해져요', resultId: 'stenosis' },
      { text: '서서 허리를 뒤로 젖히면(신전) 편해져요', resultId: 'stenosis_mild' }
    ]
  },
  {
    id: 'q_not_healing',
    text: '일상생활에서 주로 어떤 행동을 하시나요? 가장 가까운 것을 고르세요.',
    options: [
      { text: '허리 근육을 키우려고 윗몸일으키기나 스트레칭을 매일 해요', resultId: 'result_bad_exercise' },
      { text: '소파 대신 방바닥에 자주 앉거나, 바닥에 요를 깔고 자요', resultId: 'result_floor_sitting' },
      { text: '허리를 낫게 하려고 하루 2~3시간씩 무리해서 걸어요', resultId: 'result_over_walking' }
    ]
  }
];

const results: Record<string, { title: string; desc: string; action: string; warning: string }> = {
  emergency: {
    title: '🚨 마미총 증후군 의심 (응급 상황)',
    desc: '양쪽 다리와 방광으로 가는 신경이 심하게 눌린 상태일 수 있습니다.',
    action: '가능한 한 빨리 응급실이나 척추 전문 병원을 방문해 진료를 받아야 합니다.',
    warning: '치료 시기를 놓치면 후유증이 남을 수 있으니 지체하지 마세요.'
  },
  acute_disc: {
    title: '⚡ 급성 디스크성 요통',
    desc: '디스크 내부(섬유륜)가 살짝 찢어지거나 상처를 입은 상태입니다. 근육이 뭉친 것이 아닙니다.',
    action: '아픔을 참고 허리를 펴서 요추전만(C자 곡선)을 회복하세요. 허리 뒤에 쿠션을 대고 눕거나 앉는 것이 좋습니다.',
    warning: '통증이 다리 쪽으로 뻗쳐간다면 디스크 탈출로 진행될 수 있으니 주의하세요. 허리를 구부리는 스트레칭은 절대 금물입니다.'
  },
  chronic_disc: {
    title: '🩹 만성 디스크성 요통',
    desc: '디스크 상처가 벌어졌다 붙었다를 반복하는 상태입니다. 일어설 때 허리가 바로 펴지지 않는 것은 상처가 다시 붙고 있다는 좋은 신호입니다.',
    action: '방바닥에 앉는 것을 피하고, 의자에 앉을 때는 등받이에 쿠션을 대세요. 일어서기 전 30초간 허리를 꼿꼿이 펴고 천천히 일어나는 것이 좋습니다.',
    warning: '허리를 억지로 구부려 유연하게 만들려고 하지 마세요. 아물어가는 디스크를 다시 찢는 행동입니다.'
  },
  disc_collapse: {
    title: '🌧️ 디스크 붕괴 (디붕)',
    desc: '디스크 손상이 무수히 반복되어 아주 작은 자극에도 심한 통증을 느끼는 상태입니다. 우울감이 동반되기 쉽습니다.',
    action: '절망하지 마세요. 나쁜 자세와 운동을 철저히 배제하고 척추위생을 지키면 3개월 후부터 서서히 좋아집니다. 갓난아기 다루듯 허리를 조심해야 합니다.',
    warning: '조급한 마음에 무리한 운동이나 검증되지 않은 치료를 받으면 수렁에 더 깊이 빠질 수 있습니다.'
  },
  disc_herniation: {
    title: '🌩️ 디스크 탈출증 (좌골신경통)',
    desc: '디스크 내부의 젤리(수핵)가 껍질을 뚫고 나와 다리로 가는 신경에 염증을 일으킨 상태입니다.',
    action: '다리가 땅기지 않는 범위 내에서 허리를 펴는 신전 동작을 하세요. 통증이 너무 심하면 참지 말고 소염제나 주사 치료로 염증을 가라앉히는 것이 좋습니다.',
    warning: '시간이 지나면 튀어나온 디스크는 저절로 흡수되고 염증도 가라앉습니다. 함부로 수술을 결정하기보다 보존적 치료를 우선하세요.'
  },
  motor_weakness: {
    title: '⚠️ 운동 신경 마비 의심',
    desc: '디스크 탈출이 심하여 근육을 움직이는 신경 뿌리가 강하게 눌린 상태입니다.',
    action: '전문의 진료가 시급합니다. 발목 힘이 점점 더 빠지고 돌아오지 않는다면 수술적 치료를 고려해야 할 수 있습니다.',
    warning: '단순한 통증과 달리 근력 저하는 영구적인 손상을 남길 수 있습니다.'
  },
  severe_rad: {
    title: '🔥 극심한 신경뿌리 염증',
    desc: '신경뿌리에 염증이 매우 심해서 허리를 펴는 동작(신전)조차 신경을 자극하는 상태입니다.',
    action: '억지로 신전 동작을 하지 마세요. 전문의를 찾아가 신경뿌리 염증을 줄이는 주사나 약물 치료를 먼저 받아야 합니다.',
    warning: '염증이 가라앉은 후에 다시 척추위생(요추전만)을 시작해야 합니다.'
  },
  stenosis: {
    title: '🚶 척추관 협착증 (간헐적 파행)',
    desc: '나이가 들면서 척추관이 좁아진 상태에서, 최근 디스크에 새로운 상처가 생겨 걸을 때마다 신경이 자극받는 상태입니다.',
    action: '걷다가 다리가 아프면 잠시 서서 허리를 뒤로 젖히는 신전 동작을 해보세요. 그래도 아프면 누워서 쉬는 것이 가장 좋습니다.',
    warning: '허리를 구부리면 당장은 편하지만 장기적으로는 디스크를 더 망가뜨립니다. 구부려서 쉬는 것은 피하세요.'
  },
  stenosis_mild: {
    title: '🚶 가벼운 척추관 협착증',
    desc: '협착이 있지만 신전 동작으로 통증이 조절되는 긍정적인 상태입니다.',
    action: '걷기 -> 아프면 서서 신전 동작 -> 다시 걷기를 반복하세요. 척추위생을 꾸준히 지키면 걸을 수 있는 거리가 점점 늘어납니다.',
    warning: '무리해서 걷지 말고, 통증이 보내는 신호에 귀 기울이세요.'
  },
  result_bad_exercise: {
    title: '🚫 나쁜 운동으로 인한 디스크 재손상',
    desc: '허리 근육을 키우려다 오히려 디스크를 계속 찢고 있는 상태입니다. 운동으로 낫는 허리는 없습니다.',
    action: '윗몸일으키기, 누워 다리 들기, 허리 앞으로 굽히기 스트레칭(윌리엄스 운동)을 당장 중단하세요. 아픈 허리에는 운동이 아니라 \'좋은 자세\'가 치료약입니다.',
    warning: '운동 후 다음 날 아침에 허리가 더 아프다면 그 운동은 당신의 디스크를 찢고 있는 \'소매치기\'입니다.'
  },
  result_floor_sitting: {
    title: '🪑 좌식 생활로 인한 요추전만 붕괴',
    desc: '방바닥에 앉는 자세는 무릎이 골반보다 높아져 허리의 C자 곡선(요추전만)을 완벽하게 무너뜨립니다.',
    action: '방바닥 생활을 청산하고 반드시 의자와 침대를 사용하세요. 의자에 앉을 때도 무릎이 골반보다 약간 낮게 위치하도록 의자 높이를 조절해야 합니다.',
    warning: '바닥에 앉아서 치는 고스톱, 바닥에서 양말 신기 등은 디스크에 치명적입니다. 피치 못할 땐 자주 일어나 신전 동작을 하세요.'
  },
  result_over_walking: {
    title: '🚶 과도한 운동과 휴식 부족',
    desc: '걷기는 디스크를 낫게 하는 유일한 운동이지만, 과하면 오히려 디스크를 찌그러뜨립니다.',
    action: '운동 시간을 줄이고, 걷기 운동 직후에는 반드시 푹신한 침대에 누워 허리쿠션(베개)을 받치고 쉬어야 합니다. 쉴 때는 운동한 시간만큼 혹은 그 2배로 쉬는 것이 좋습니다. (운동은 납품, 휴식은 수금입니다!)',
    warning: '아무리 좋은 운동도 내 허리가 견딜 수 있는 범위를 넘어서면 독이 됩니다. 통증에 귀 기울이세요. 무리가 되지 않는 선에서 걷기와 달리기를 병행하는 것도 좋습니다.'
  }
};

const vol1Concepts = [
  {
    title: "통증의 진짜 원인, 디스크",
    content: "근육이 뭉쳐서 아픈 게 아니에요. 허리 통증의 97%는 디스크 내부가 찢어지거나 상처를 입어서 발생합니다.",
    details: "디스크는 수핵(젤리), 섬유륜(껍질), 종판으로 구성된 찹쌀떡 같은 구조물입니다. 허리를 삐끗했을 때 근육이 뭉치는 것은 찢어진 디스크를 보호하기 위해 우리 몸이 스스로 '깁스'를 하는 것과 같은 이로운 반사 작용입니다. 불이 났을 때 소방차가 모이는 것과 같으므로, 뭉친 근육을 억지로 풀기보다 디스크 상처가 아물도록 기다려야 합니다.",
    icon: <AlertCircle className="text-rose-500" size={24} />
  },
  {
    title: "요추전만, 허리의 수호천사",
    content: "허리가 앞으로 C자 형태로 자연스럽게 휘어진 곡선을 '요추전만'이라고 합니다. 이 곡선이 유지될 때 디스크는 가장 안전합니다.",
    details: "요추전만은 중력을 이겨내고 충격을 흡수하는 최고의 강도를 가집니다. 요추전만이 무너지면 디스크가 찌그러지고 결국 척추관 협착증 등 심각한 질환으로 이어집니다. 허리가 아프다면 무조건 요추전만을 사수해야 합니다. '범죄신고는 112, 화재신고는 119, 허리가 아프면 요추전만'을 기억하세요!",
    icon: <CheckCircle2 className="text-emerald-500" size={24} />
  },
  {
    title: "신전 동작의 기적",
    content: "허리를 뒤로 젖히는 '신전 동작'은 디스크 내부의 젤리(수핵)를 앞으로 밀어내어 뒤쪽의 상처를 맞붙게 해줍니다.",
    details: "허리를 앞으로 구부리면 수핵이 뒤로 밀려나 껍질(후방 섬유륜)을 찢게 됩니다. 반대로 허리를 뒤로 젖히는 신전 동작을 하면 수핵이 앞으로 밀려나고, 찢어졌던 뒤쪽 껍질이 맞붙어 상처가 아물게 됩니다. 이때 느껴지는 뻐근함은 상처가 붙는 아주 좋은 통증입니다. 반대로 허리를 구부리는 스트레칭은 상처를 벌어지게 하니 절대 피하세요.",
    icon: <Info className="text-blue-500" size={24} />
  },
  {
    title: "방사통과 디스크성 요통",
    content: "다리가 저리고 땅기는 '방사통'은 디스크가 터진 것이고, 허리 가운데만 아픈 '디스크성 요통'은 디스크 내부가 찢어진 것입니다.",
    details: "허리만 아픈 '디스크성 요통'은 디스크 껍질이 찢어진 상태입니다. 반면 엉덩이부터 다리까지 저리고 땅기는 '방사통(좌골신경통)'은 디스크가 완전히 터져 흘러나온 수핵이 신경뿌리에 묻어 심한 염증을 일으킨 상태입니다. 방사통은 디스크가 심하게 손상되었다는 강력한 경고 신호입니다.",
    icon: <Activity className="text-amber-500" size={24} />
  }
];

const vol2Concepts = [
  {
    title: "허리 운동의 오해: 근력 강화보다 걷기가 먼저다",
    content: "허리 근육을 키우면 디스크가 낫는다는 것은 착각입니다. 아픈 허리에는 근력 운동이 아니라 '좋은 자세'와 '걷기/달리기'가 진짜 치료약입니다.",
    details: "디스크가 찢어져 아픈 상태에서 윗몸일으키기나 허리 굽히기 스트레칭(윌리엄스 운동)을 하는 것은 상처를 더 찢는 최악의 행동입니다. 팔 뼈가 부러진 사람이 팔 굽혀 펴기를 하는 것과 같습니다. 허리 근육 강화는 디스크가 완전히 나은 다음에 해야 안전하며, 통증이 있을 때는 무리가 되지 않는 선에서 걷기와 달리기를 하는 것이 가장 좋습니다.",
    icon: <Dumbbell className="text-rose-500" size={24} />
  },
  {
    title: "진짜 수호천사, 2차 자연 복대",
    content: "허리 속 코어 근육(1차 복대)에 억지로 힘을 주면 디스크 압력이 높아져 해롭습니다. 진짜 수호천사는 '엉덩이와 등 근육'입니다.",
    details: "등과 엉덩이를 덮는 '2차 자연 복대(흉요근막, 활배근, 대둔근)'가 허리를 보호하는 진짜 핵심입니다. 단, 디스크 회복 자체에는 엉덩이/등 근육 강화 운동보다 걷기와 달리기가 훨씬 좋습니다. 만약 엉덩이와 등 근육 운동을 하더라도 아무 운동이나 해선 안 되며, 허리의 C자 곡선(요추전만)이 무너지지 않는 안전한 운동만 선별해서 조심스럽게 해야 합니다.",
    icon: <ShieldAlert className="text-blue-500" size={24} />
  },
  {
    title: "디스크 보호의 핵심, 안·적·천 원칙",
    content: "허리를 구부려야 할 때는 '안·적·천'을 기억하세요. 안 구부리고, 적게 구부리고, 천천히 구부려야 합니다.",
    details: "1. 안 구부린다: 길바닥에 100만 원 이하가 떨어져 있으면 줍지 않는다는 마음가짐을 가지세요.\n2. 적게 구부린다: 어쩔 수 없다면 무릎과 엉덩이 관절을 사용해 허리 굽힘을 최소화하세요.\n3. 천천히 구부린다: 속도에 비례해 디스크 충격이 커집니다.\n* 피치 못하게 구부렸다면 직후에 반드시 신전 동작을 하세요 (안적천-신 원칙).",
    icon: <CheckCircle2 className="text-emerald-500" size={24} />
  },
  {
    title: "일상 속 깨알 척추위생",
    content: "서기, 앉기, 자기 등 일상생활의 모든 순간에 요추전만을 사수하는 것이 척추위생의 완성입니다.",
    details: "서 있을 때: 가슴을 내미는 '당당한 가슴법'이 좋습니다. 엉덩이를 뒤로 빼는 오리궁둥이는 허리 근육을 긴장시켜 해롭습니다.\n앉을 때: 무릎이 골반보다 약간 낮아야 요추전만이 유지됩니다. 방바닥에 앉는 것은 최악입니다.\n잘 때: 푹신한 매트리스에 허리 베개를 받치고 하늘을 보고 자는 것이 가장 좋습니다.",
    icon: <Bed className="text-indigo-500" size={24} />
  },
  {
    title: "백년허리 3마라와 3하라",
    content: "허리를 망치는 3가지를 절대 하지 말고, 허리를 살리는 3가지를 실천하세요.",
    details: "[3마라]\n1. 허리 구부리는 스트레칭 절대로 하지 마라!\n2. 아플 때 허리 주변 근육 강화 운동 절대로 하지 마라!\n3. 허리 운동 진도 앞서 나가지 마라!\n\n[3하라]\n1. 매일 가능한 범위에서 걷기 운동을 하라! (무리가 되지 않으면 걷기와 달리기도 좋습니다.)\n2. 2차 자연복대(엉덩이, 활배근)를 강화하라!\n3. 운동 후 충분히 쉬어라! (운동은 납품, 휴식은 수금입니다. 쉴 때는 운동한 시간만큼 혹은 그 2배로 쉬는 것이 좋으며, 허리쿠션을 넣고 쉬는 것을 권장합니다.)",
    icon: <Info className="text-amber-500" size={24} />
  }
];

const vol3Concepts = [
  {
    title: "신체활동 부족은 독, 운동은 해독제",
    content: "하루 종일 앉아있는 '좌독(坐毒)'과 TV 시청은 수명을 단축시킵니다. 이를 해독할 수 있는 유일한 방법은 운동입니다.",
    details: "하루 8시간 이상 앉아있으면 사망률이 59% 증가하지만, 하루 60~75분의 중강도 운동(경쾌하게 걷기 등)으로 이 '좌독'을 완전히 해독할 수 있습니다. 운동은 암, 치매, 심혈관 질환을 예방하는 인류 최고의 명약입니다. 근육이 수축할 때 분비되는 '마이오카인(근육호르몬)'이 온몸의 장기를 치유합니다. 단, 과부하 원리에 따라 내 몸에 맞게 서서히 강도를 높여야 부상을 막을 수 있습니다.",
    icon: <Activity className="text-rose-500" size={24} />
  },
  {
    title: "오래 살려면 유산소, 멋지게 살려면 무산소",
    content: "유산소 운동은 심폐기능을 높이고 수명을 늘려주며, 무산소(근력) 운동은 노년기 근감소증을 예방하고 삶의 질을 높입니다.",
    details: "걷기, 달리기 같은 유산소 운동은 대사질환을 예방하는 기본입니다. 여기에 근력 운동을 더하면 체지방 감소(지방을 태우는 쓰레기 소각로 증설 효과), 남성호르몬 증가, 뼈와 관절 강화, 낙상 예방에 탁월한 효과를 봅니다. 100세 시대의 건강수명을 늘리려면 유산소 운동을 기본으로 하되, 반드시 근력 운동을 병행하여 근감소증을 막아야 합니다.",
    icon: <Dumbbell className="text-indigo-500" size={24} />
  },
  {
    title: "100세 시대 운동의 딜레마와 연부조직",
    content: "운동을 안 하면 몸이 약해지고, 하면 척추와 관절이 아픈 딜레마가 있습니다. 범인은 뼈나 근육보다 먼저 늙는 '연부조직'입니다.",
    details: "디스크, 연골, 힘줄 같은 '힘 받는 연부조직'은 30세 이후 급격히 노화됩니다. 나쁜 운동은 없지만, '내 손상된 척추/관절에 맞지 않는 운동'이 있을 뿐입니다. 디스크가 찢어진 상태에서 윗몸일으키기나 과도한 스트레칭을 하는 것은 상처를 벌리는 행위입니다. 통증(신의 경고)을 무시하지 말고, 연부조직을 철저히 보호하며 운동해야 합니다.",
    icon: <ShieldAlert className="text-amber-500" size={24} />
  },
  {
    title: "내 몸에 맞는 유산소 운동 찾기",
    content: "무릎이나 허리가 아프다면 운동 종목을 현명하게 선택해야 합니다. 무작정 남들이 좋다는 운동을 따라해선 안 됩니다.",
    details: "무릎이 아프다면 계단 오르기나 등산은 피하고, 평지 걷기, 실내 자전거, 아쿠아로빅, 일립티컬이 좋습니다. 허리가 아프다면 상체를 숙이는 사이클, 무리한 요가/필라테스 동작(분절 운동 등), 무리한 스트레칭을 피해야 합니다. 트레드밀 걷기는 평지보다 무릎 부담이 적어 무릎이 약한 분들에게 추천합니다.",
    icon: <Compass className="text-blue-500" size={24} />
  },
  {
    title: "신이 내린 최고의 명약, 걷기",
    content: "걷기는 수명을 연장하고 허리 디스크와 무릎 연골을 튼튼하게 재생시키는 최고의 치료제입니다.",
    details: "올바른 걷기 자세가 모든 것의 핵심입니다. 첫째, 허리를 꼿꼿이 펴서 '요추전만'을 만들고, 양쪽 견갑골을 등 뒤로 모아 가슴을 활짝 엽니다. 둘째, 흔히 턱을 당기라고 하지만 이는 목 디스크 압력을 높이는 잘못된 자세입니다. 오히려 턱을 거만하게 약간 치켜들어 '경추전만'을 유지하고, 측면에서 봤을 때 귓구멍에서 내린 수직선이 골반 중심(항문)을 지나도록 해야 합니다. 셋째, 발은 '뒤꿈치 → 발바닥 → 발가락' 순으로 지면을 누르듯 딛고, 발끝은 정면이나 5~7도 바깥을 향하게 걷습니다.\n\n통증 관리도 매우 중요합니다. 무작정 참으며 걷는 것은 독입니다. 걸을 때 허리 가운데가 뻐근하다면 요추전만을 더 강하게 유지하고, 다리가 당긴다면 통증이 오기 직전까지만 걷고 1~2시간 충분히 쉬었다가 다시 걷는 '적절한 과부하' 원칙을 지켜야 합니다. 매 끼니 직후 30분씩 나누어 걷는 것이 가장 이상적입니다.",
    icon: <Footprints className="text-emerald-500" size={24} />
  },
  {
    title: "근력 운동 시 주의사항 (브릿지 운동 등)",
    content: "근력 운동은 필수지만, 허리가 아픈 사람에게는 독이 될 수 있는 동작이 많아 각별한 주의가 필요합니다.",
    details: "유산소 운동과 달리 근력 운동은 자세와 강도에 따라 척추와 관절에 미치는 영향이 매우 큽니다. 예를 들어, 엉덩이 근육을 키우기 위해 흔히 하는 '브릿지 운동'도 허리 디스크가 손상된 사람에게는 통증을 유발하고 상태를 악화시킬 수 있습니다. 본 요약본에서는 다루기 힘든 디스크 환자용 맞춤 근력 운동의 디테일이 매우 많으므로, 근력 운동을 시작하시기 전에는 반드시 정선근 교수님의 『백년운동』 책 3부(무산소편)를 정독하시거나 정선근 교수님의 유튜브 채널을 참고하시기를 강력히 권장합니다.",
    icon: <AlertCircle className="text-rose-500" size={24} />
  }
];

const vol1Quiz = [
  {
    question: "갑자기 허리를 삐끗해서 근육이 심하게 뭉쳤습니다. 올바른 대처법은?",
    options: [
      "근육 이완제와 마사지로 뭉친 근육을 억지로 푼다.",
      "허리를 앞으로 숙이는 스트레칭을 한다.",
      "근육 뭉침은 디스크를 보호하려는 좋은 반응이므로, 요추전만을 유지하며 쉰다."
    ],
    answer: 2,
    explanation: "근육 뭉침은 찢어진 디스크를 보호하기 위한 우리 몸의 소방수 역할입니다. 억지로 풀기보다 디스크가 쉴 수 있게 요추전만을 유지해야 합니다."
  },
  {
    question: "허리를 뒤로 젖히는 '신전 동작'을 할 때 허리 가운데가 뻐근하게 아픕니다. 이 통증의 의미는?",
    options: [
      "디스크가 더 찢어지고 있다는 나쁜 신호다.",
      "찢어졌던 디스크 상처가 서로 맞붙으면서 나는 좋은 통증이다.",
      "신경이 눌려서 발생하는 방사통이다."
    ],
    answer: 1,
    explanation: "신전 동작 시 느껴지는 뻐근함은 벌어졌던 디스크 껍질(후방 섬유륜) 상처가 맞붙으면서 나는 좋은 통증입니다."
  },
  {
    question: "허리 디스크가 심하게 손상되었을 때 나타나는 가장 확실한 경고 신호는?",
    options: [
      "허리 한가운데만 뻐근하게 아픈 디스크성 요통",
      "엉덩이부터 다리까지 찌릿하게 저리고 당기는 방사통(좌골신경통)",
      "아침에 일어날 때 허리가 뻣뻣한 느낌"
    ],
    answer: 1,
    explanation: "방사통은 디스크가 완전히 터져 흘러나온 수핵이 신경뿌리에 묻어 심한 염증을 일으킨 상태로, 디스크가 심하게 손상되었다는 강력한 경고 신호입니다."
  }
];

const vol2Quiz = [
  {
    question: "허리가 아플 때, 허리 근육(코어)을 강화하기 위해 윗몸일으키기를 하는 것은 어떨까요?",
    options: [
      "허리 근육이 강해져서 디스크를 보호하므로 매우 좋다.",
      "디스크가 찢어진 상태에서 강한 압박을 가해 상처를 더 찢는 최악의 행동이다.",
      "통증이 참을 만하다면 계속해도 무방하다."
    ],
    answer: 1,
    explanation: "운동으로 낫는 허리는 없습니다. 아픈 허리에 윗몸일으키기를 하는 것은 팔 뼈가 부러진 사람이 팔 굽혀 펴기를 하는 것과 같습니다."
  },
  {
    question: "일상생활에서 피치 못하게 허리를 구부려야 할 때 지켜야 할 '안·적·천' 원칙이 아닌 것은?",
    options: [
      "웬만하면 안 구부린다.",
      "안전하게 구부린다.",
      "어차피 구부릴 거면 천천히 구부린다."
    ],
    answer: 1,
    explanation: "안·적·천 원칙은 '안 구부린다, 적게 구부린다, 천천히 구부린다'입니다. 구부린 직후에는 반드시 신전 동작을 해야 합니다."
  },
  {
    question: "다음 중 허리 디스크를 망치는 가장 나쁜 행동은 무엇인가요?",
    options: [
      "허리를 꼿꼿이 펴고 가슴을 내밀며 걷기",
      "의자에 앉을 때 무릎이 골반보다 약간 낮게 위치하도록 앉기",
      "방바닥에 앉아서 고스톱 치기"
    ],
    answer: 2,
    explanation: "방바닥에 앉는 자세는 무릎이 골반보다 높아져 요추전만을 완벽하게 무너뜨립니다. 디스크를 찢는 가장 나쁜 행동 중 하나입니다."
  }
];

const vol3Quiz = [
  {
    question: "하루 8시간 앉아있는 '좌독'을 해독하기 위해 필요한 중강도 운동 시간은?",
    options: [
      "하루 10~20분",
      "하루 60~75분",
      "하루 3시간 이상"
    ],
    answer: 1,
    explanation: "하루 8시간 이상 앉아있으면 사망률이 크게 증가하지만, 하루 60~75분의 중강도 운동(시속 5.6km로 경쾌하게 걷기 등) 또는 30분 이상의 고강도 운동(달리기 등)으로 '좌독'을 완전히 해독할 수 있습니다. 하루 걷기 30분 또는 뛰기 15분이라는 기준은 미국 보건복지부 가이드라인에 명시된 일반적인 건강 유지를 위한 기본 최소 권장량을 의미합니다."
  },
  {
    question: "올바른 걷기 자세에 대한 설명으로 틀린 것은?",
    options: [
      "허리를 꼿꼿이 펴서 요추전만을 만든다.",
      "턱을 몸쪽으로 강하게 당겨 시선을 발끝으로 향하게 한다.",
      "양쪽 견갑골을 등 뒤로 모아 가슴을 활짝 연다."
    ],
    answer: 1,
    explanation: "흔히 턱을 당기라고 하지만 이는 목 디스크 압력을 높이는 잘못된 자세입니다. 턱을 거만하게 약간 치켜들어 '경추전만'을 유지해야 합니다."
  },
  {
    question: "무릎이 아플 때 걷기 운동을 대체하기 좋은 유산소 운동은?",
    options: [
      "계단 오르기",
      "가파른 등산",
      "실내 자전거 타기"
    ],
    answer: 2,
    explanation: "계단 오르기나 등산은 무릎에 체중의 수 배에 달하는 하중을 가해 무릎이 아픈 사람에게는 독이 될 수 있습니다. 실내 자전거 타기나 아쿠아로빅이 좋습니다. 그러나 맹점은 허리에 있습니다. 상체를 앞으로 둥글게 구부린 채 타는 자전거 자세나 '허리 구부리는 동작'은 허리 디스크에 매우 나쁜 영향을 줍니다. 허리를 꼿꼿하게 펴고 탈 수 있는 형태를 이용해야 허리와 무릎 모두의 건강을 지킬 수 있습니다."
  }
];

function HomeView({ onNavigate }: { onNavigate: (view: 'learn' | 'diagnosis' | 'timer') => void, key?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto py-12"
    >
      <motion.span 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-1.5 text-xs font-bold tracking-wider bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full mb-8"
      >
        정선근 교수의 명저 요약 (진단편 & 치료편)
      </motion.span>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
        className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight"
      >
        건강한 허리를 위한<br/>올바른 관리 가이드
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-stone-500 dark:text-stone-400 mb-12 text-lg md:text-xl leading-relaxed"
      >
        정선근 교수님의 저서를 바탕으로 허리 통증의 원인과 관리법을 정리했습니다.<br/>
        안전하고 건강한 회복을 위한 참고 자료로 활용해 보세요.
      </motion.p>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4"
      >
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('timer')}
          className="col-span-1 sm:col-span-2 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white py-5 px-6 rounded-2xl font-bold text-xl transition-colors shadow-md hover:shadow-lg"
        >
          <Timer size={26} />
          SOS 신전 동작 타이머
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('learn')}
          className="flex-1 flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 py-4 px-6 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <BookOpen size={22} />
          핵심 내용 학습하기
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('diagnosis')}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 border border-stone-200 dark:border-stone-700 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-sm"
        >
          <Stethoscope size={22} />
          내 허리 통증 진단하기
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 px-4 text-center max-w-lg mx-auto"
      >
        <p className="text-xs text-stone-400 dark:text-stone-500 leading-relaxed">
          본 서비스는 참고용이며 의학적 진단을 대신할 수 없습니다.<br />
          자세한 내용은 정선근 교수님의 저서나 유튜브 채널을 참고해 주시고, 통증이 심하거나 지속될 경우 반드시 전문의의 진료를 받으시기 바랍니다.
        </p>
      </motion.div>
    </motion.div>
  );
}

function LearnView({ onBack, onStartQuiz, unlockedVols }: { onBack: () => void, onStartQuiz: (quizId: 'vol1' | 'vol2' | 'vol3') => void, unlockedVols: string[], key?: string }) {
  const [activeTab, setActiveTab] = useState<'vol1' | 'vol2' | 'vol3'>('vol1');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const currentConcepts = activeTab === 'vol1' ? vol1Concepts : activeTab === 'vol2' ? vol2Concepts : vol3Concepts;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto w-full pb-12"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors font-medium">
        <ChevronLeft size={20} />
        돌아가기
      </button>
      
      <h2 className="text-3xl font-extrabold mb-8 tracking-tight">핵심 요약 보기</h2>

      <div className="flex flex-col sm:flex-row p-1 bg-stone-200/50 dark:bg-stone-800/50 rounded-2xl mb-8 gap-1">
        <button 
          onClick={() => { setActiveTab('vol1'); setExpandedIdx(null); }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${activeTab === 'vol1' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          백년허리 1권 (진단)
        </button>
        <button 
          onClick={() => { 
            if (unlockedVols.includes('vol2')) {
              setActiveTab('vol2'); setExpandedIdx(null); 
            } else {
              alert('1권 퀴즈를 통과해야 열립니다!');
            }
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${!unlockedVols.includes('vol2') ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'vol2' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          {!unlockedVols.includes('vol2') && <span className="mr-1">🔒</span>}
          백년허리 2권 (치료)
        </button>
        <button 
          onClick={() => { 
            if (unlockedVols.includes('vol3')) {
              setActiveTab('vol3'); setExpandedIdx(null); 
            } else {
              alert('2권 퀴즈를 통과해야 열립니다!');
            }
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${!unlockedVols.includes('vol3') ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'vol3' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
        >
          {!unlockedVols.includes('vol3') && <span className="mr-1">🔒</span>}
          백년운동 (유산소)
        </button>
      </div>
      
      <div className="space-y-4 mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {currentConcepts.map((concept, idx) => {
              const isExpanded = expandedIdx === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-stone-800/50 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden"
                >
                  <button 
                    onClick={() => toggleExpand(idx)}
                    className="w-full text-left p-6 md:p-8 flex items-start gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors"
                  >
                    <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl shrink-0">
                      {concept.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
                      <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">
                        {concept.content}
                      </p>
                    </div>
                    <div className="shrink-0 text-stone-400 mt-1">
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 md:p-8 pt-0 border-t border-stone-100 dark:border-stone-700/50 bg-stone-50/50 dark:bg-stone-800/30">
                          <h4 className="text-sm font-bold text-stone-500 dark:text-stone-400 mb-3 mt-6">자세히 알아보기</h4>
                          <p className="text-stone-700 dark:text-stone-200 leading-relaxed font-medium whitespace-pre-line">
                            {concept.details}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-stone-100 dark:bg-stone-800/80 p-8 rounded-3xl text-center border border-stone-200 dark:border-stone-700">
        <BrainCircuit className="mx-auto mb-4 text-stone-400" size={40} />
        <h3 className="text-2xl font-bold mb-3">
          {activeTab === 'vol1' ? '1권 퀴즈 풀고 2권 잠금 해제하기' : activeTab === 'vol2' ? '2권 퀴즈 풀고 유산소편 잠금 해제하기' : '유산소편 퀴즈 풀기'}
        </h3>
        <p className="text-stone-500 dark:text-stone-400 mb-6">
          {activeTab === 'vol1' ? '1권의 핵심 내용을 잘 이해했는지 확인하고 다음 단계로 넘어가세요.' : activeTab === 'vol2' ? '2권의 핵심 내용을 잘 이해했는지 확인하고 다음 단계로 넘어가세요.' : '유산소 운동의 핵심을 잘 이해했는지 확인해보세요.'}
        </p>
        <button 
          onClick={() => onStartQuiz(activeTab)}
          className="inline-flex items-center justify-center gap-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 py-4 px-8 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
        >
          퀴즈 풀기 시작
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

function QuizView({ onBack, quizId, onPass }: { onBack: () => void, quizId: 'vol1' | 'vol2' | 'vol3', onPass: () => void, key?: string }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = quizId === 'vol1' ? vol1Quiz : quizId === 'vol2' ? vol2Quiz : vol3Quiz;
  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      if (score === questions.length) {
        onPass();
      }
      setQuizFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const isPassed = score === questions.length;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto w-full text-center py-12"
      >
        <div className={`inline-flex items-center justify-center w-24 h-24 ${isPassed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-500'} rounded-full mb-6`}>
          {isPassed ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
        </div>
        <h2 className="text-4xl font-extrabold mb-4">퀴즈 완료!</h2>
        <p className="text-2xl font-medium text-stone-600 dark:text-stone-300 mb-8">
          총 {questions.length}문제 중 <span className="text-stone-900 dark:text-white font-bold">{score}문제</span>를 맞혔습니다.
        </p>
        
        <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-2xl mb-8 text-stone-600 dark:text-stone-300 leading-relaxed">
          {isPassed ? 
            (quizId === 'vol1' ? "완벽합니다! 1권의 핵심을 정확히 이해하셨습니다. 이제 2권(치료편)이 잠금 해제되었습니다." : quizId === 'vol2' ? "완벽합니다! 2권의 핵심을 정확히 이해하셨습니다. 이제 백년운동(유산소편)이 잠금 해제되었습니다." : "완벽합니다! 백년운동의 핵심을 정확히 이해하셨습니다.") : 
            "아쉽습니다! 모든 문제를 맞혀야 다음 단계가 잠금 해제됩니다. 틀린 문제가 있다면 다시 한번 학습하기를 통해 복습해보세요."}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleRetry}
            className="flex-1 py-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 border border-stone-200 dark:border-stone-700 rounded-2xl font-bold text-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            다시 풀기
          </button>
          <button 
            onClick={onBack}
            className="flex-1 py-4 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
          >
            학습 메인으로
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto w-full pb-12"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors font-medium">
        <ChevronLeft size={20} />
        학습 메인으로
      </button>

      <div className="mb-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-wider text-stone-400">
          {quizId === 'vol1' ? '1권 퀴즈' : quizId === 'vol2' ? '2권 퀴즈' : '유산소편 퀴즈'}
        </span>
        <span className="text-sm font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold mb-8 leading-tight">{question.question}</h2>

      <div className="space-y-4 mb-8">
        {question.options.map((opt, idx) => {
          let btnClass = "w-full text-left p-5 md:p-6 rounded-2xl border transition-all font-medium text-lg ";
          
          if (!showExplanation) {
            btnClass += "bg-white dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 text-stone-700 dark:text-stone-200";
          } else {
            if (idx === question.answer) {
              btnClass += "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-100";
            } else if (idx === selected) {
              btnClass += "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-900 dark:text-rose-100";
            } else {
              btnClass += "bg-white dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 opacity-50 text-stone-500";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showExplanation}
              className={btnClass}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {showExplanation && idx === question.answer && <CheckCircle2 className="text-emerald-500 shrink-0 ml-4" size={24} />}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-100 dark:bg-stone-800 p-6 rounded-2xl mb-8"
          >
            <h4 className="font-bold mb-2 flex items-center gap-2">
              {selected === question.answer ? 
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 size={18}/> 정답입니다!</span> : 
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1"><AlertCircle size={18}/> 오답입니다.</span>
              }
            </h4>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showExplanation && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="w-full py-4 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
        >
          {currentQ < questions.length - 1 ? '다음 문제' : '결과 보기'}
        </motion.button>
      )}
    </motion.div>
  );
}

function DiagnosisView({ onBack }: { onBack: () => void, key?: string }) {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState('q1');
  const [resultId, setResultId] = useState<string | null>(null);

  const currentQuestion = questions.find(q => q.id === currentId);
  const result = resultId ? results[resultId] : null;

  const handleOptionClick = (option: any) => {
    if (option.resultId) {
      setResultId(option.resultId);
    } else if (option.nextId) {
      setHistory([...history, currentId]);
      setCurrentId(option.nextId);
    }
  };

  const handleBack = () => {
    if (resultId) {
      setResultId(null);
    } else if (history.length > 0) {
      const prevId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentId(prevId);
    } else {
      setShowDisclaimer(true);
    }
  };

  if (showDisclaimer) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-2xl mx-auto w-full pb-12"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors font-medium">
          <ChevronLeft size={20} />
          홈으로
        </button>

        <div className="bg-stone-100 dark:bg-stone-800/50 rounded-3xl p-8 md:p-10 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">진단 전 주의사항</h2>
          <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-8">
            본 자가 진단은 정선근 교수님의 저서를 바탕으로 구성된 <strong>참고용 자료</strong>입니다.<br />
            정확한 진단과 치료를 위해서는 반드시 <strong>전문의가 있는 병원에 방문하여 진료</strong>를 받으셔야 합니다.
          </p>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="w-full py-4 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 rounded-2xl font-bold text-lg transition-colors shadow-md"
          >
            동의하고 진단 시작하기
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto w-full pb-12"
    >
      <button onClick={handleBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors font-medium">
        <ChevronLeft size={20} />
        {history.length === 0 && !resultId ? '홈으로' : '이전으로'}
      </button>

      <AnimatePresence mode="wait">
        {!resultId && currentQuestion && (
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="text-sm font-bold tracking-wider text-stone-400 mb-3 block">자가 진단 테스트</span>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 leading-tight">{currentQuestion.text}</h2>
            
            <motion.div 
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {currentQuestion.options.map((opt, idx) => (
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  className="w-full text-left p-5 md:p-6 rounded-2xl bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-md transition-colors group flex justify-between items-center"
                >
                  <span className="text-lg font-semibold text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white transition-colors pr-4">{opt.text}</span>
                  <ArrowRight className="text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors shrink-0" size={20} />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {resultId && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-stone-800/80 p-6 md:p-10 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-xl"
          >
            <div className="inline-block px-4 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-full text-sm font-bold mb-6 text-stone-600 dark:text-stone-300">진단 결과</div>
            <h2 className="text-3xl font-extrabold mb-4">{result.title}</h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed font-medium">{result.desc}</p>
            
            <div className="space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2 text-lg">
                  <CheckCircle2 size={20} /> 이렇게 대처하세요
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed font-medium">{result.action}</p>
              </div>
              
              <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-800/30">
                <h3 className="font-bold text-rose-800 dark:text-rose-400 mb-3 flex items-center gap-2 text-lg">
                  <AlertCircle size={20} /> 주의사항
                </h3>
                <p className="text-rose-700 dark:text-rose-300 leading-relaxed font-medium">{result.warning}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setResultId(null);
                setCurrentId('q1');
                setHistory([]);
              }}
              className="mt-10 w-full py-4 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              다시 진단하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimerView({ onBack }: { onBack: () => void, key?: string }) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);

  const phaseInfo = {
    idle: { text: '준비되셨나요?', subtext: '시작 버튼을 눌러 신전 동작을 함께 해보세요.', scale: 1, color: 'bg-stone-200 dark:bg-stone-800', textColor: 'text-stone-500' },
    inhale: { text: '코로 숨을 들이마시며\n허리를 젖히세요', subtext: '가슴을 활짝 펴고 요추전만을 만듭니다.', scale: 1.5, color: 'bg-emerald-400 dark:bg-emerald-500', textColor: 'text-emerald-900 dark:text-emerald-50' },
    hold: { text: '숨을 참고\n자세를 유지하세요', subtext: '뻐근함은 상처가 붙는 좋은 통증입니다.', scale: 1.5, color: 'bg-amber-400 dark:bg-amber-500', textColor: 'text-amber-900 dark:text-amber-50' },
    exhale: { text: '입을 오므려\n천천히 숨을 내쉬세요', subtext: '원래 자세로 돌아옵니다.', scale: 1, color: 'bg-blue-400 dark:bg-blue-500', textColor: 'text-blue-900 dark:text-blue-50' }
  };

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      setTimeLeft(0);
      return;
    }

    let timer: NodeJS.Timeout;
    if (phase === 'idle') {
      setPhase('inhale');
      setTimeLeft(3);
    } else if (phase === 'inhale') {
      timer = setTimeout(() => {
        setPhase('hold');
        setTimeLeft(5);
      }, 3000);
    } else if (phase === 'hold') {
      timer = setTimeout(() => {
        setPhase('exhale');
        setTimeLeft(3);
      }, 5000);
    } else if (phase === 'exhale') {
      timer = setTimeout(() => {
        setPhase('inhale');
        setTimeLeft(3);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [phase, isActive]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase]);

  const current = phaseInfo[phase];

  if (showInstructions) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-2xl mx-auto w-full pb-12"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors font-medium">
          <ChevronLeft size={20} />
          홈으로
        </button>

        <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Timer size={28} />
            </div>
            <h2 className="text-2xl font-extrabold">SOS 신전 동작 타이머</h2>
          </div>
          
          <p className="text-stone-600 dark:text-stone-300 mb-8 leading-relaxed text-lg">
            이 타이머는 찢어진 디스크 상처를 아물게 하고, 건강한 허리 곡선(요추전만)을 되찾아주는 가장 강력한 치료법입니다. 올바른 호흡과 자세로 척추위생을 실천해 보세요.
          </p>

          <div className="space-y-6">
            <div className="bg-stone-50 dark:bg-stone-900/50 p-5 rounded-2xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="bg-stone-200 dark:bg-stone-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">0</span>
                준비 자세: 당당한 가슴 만들기
              </h3>
              <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-1 ml-1">
                <li><strong>서 있을 때:</strong> 양손을 허리춤에 가볍게 얹어줍니다.</li>
                <li><strong>앉아 있을 때:</strong> 팔을 뒤로 젖혀 양쪽 날개뼈(견갑골)가 서로 닿을 정도로 가슴을 활짝 열어줍니다. 상체와 팔의 무게가 허리 뒤쪽으로 자연스럽게 떨어지도록 힘을 빼는 것이 중요합니다.</li>
              </ul>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400 text-lg mb-2 flex items-center gap-2">
                <span className="bg-emerald-200 dark:bg-emerald-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                1단계: 3초 들이쉬기 (코 호흡 & 뒤로 젖히기)
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 mb-3">
                <strong>동작:</strong> 코로 숨을 깊게 들이마시면서 허리를 천천히 뒤로 젖힙니다. 이 동작은 튀어나온 디스크(수핵)를 앞쪽의 안전한 곳으로 밀어 넣고, 찢어진 상처(후방 섬유륜)를 서로 맞붙여 주는 핵심 과정입니다.
              </p>
              <div className="bg-white/60 dark:bg-stone-900/40 p-4 rounded-xl text-sm">
                <p className="font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1"><AlertCircle size={16}/> 통증 주의사항:</p>
                <ul className="space-y-2">
                  <li><span className="text-emerald-600 dark:text-emerald-400 font-bold">좋은 통증:</span> 허리를 펼 때 허리 정가운데가 뻐근하게 아픈 것은 벌어진 상처가 맞붙으면서 생기는 자연스러운 통증입니다. 안심하고 젖힌 자세를 유지하시면 통증이 점차 사라집니다.</li>
                  <li><span className="text-rose-600 dark:text-rose-400 font-bold">나쁜 통증:</span> 만약 허리를 젖힐 때 <strong>엉덩이나 다리로 찌릿하게 뻗쳐가는 통증(방사통)</strong>이 느껴진다면, 절대 무리하지 마시고 그 통증이 느껴지지 않는 범위까지만 허리를 젖히셔야 합니다.</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 text-lg mb-2 flex items-center gap-2">
                <span className="bg-amber-200 dark:bg-amber-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                2단계: 5초 유지하기 (숨 참고 버티기)
              </h3>
              <p className="text-amber-700 dark:text-amber-300">
                <strong>동작:</strong> 숨을 꾹 참은 상태로 젖힌 자세를 5초간 유지합니다. 이때 허리나 배 근육에 억지로 힘을 주어 버티지 마세요. 가슴을 활짝 연 상태에서 상체의 무게를 뒤로 편안하게 떨어뜨리고, 허리 근육에는 힘을 툭 뺀 채 자연스럽게 머무르는 것이 핵심입니다. 가운데 허리가 뻐근하더라도 놀라지 말고 견뎌주세요. 이 5초는 디스크의 찢어진 상처가 서로 맞닿아 힐링되는 아주 중요한 시간입니다.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl">
              <h3 className="font-bold text-blue-800 dark:text-blue-400 text-lg mb-2 flex items-center gap-2">
                <span className="bg-blue-200 dark:bg-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                3단계: 3초 내쉬기 (입 호흡 & 돌아오기)
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                <strong>동작:</strong> 입을 작게 오므려 숨을 천천히 내쉬면서, 뒤로 젖혔던 허리를 곧게 세워 원래 자세로 돌아옵니다.
              </p>
            </div>

            <div className="bg-stone-100 dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
              <h3 className="font-bold text-stone-800 dark:text-stone-200 text-lg mb-2 flex items-center gap-2">
                <Info size={20} /> 권장 세트 및 빈도
              </h3>
              <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-1">
                <li>타이머에 맞춰 한 번에 3~4회 정도 반복한 뒤 원래 하던 동작으로 돌아가는 것이 좋습니다.</li>
                <li>오래 앉아 일하시는 분들은 30분에 한 번씩 꼭 이 신전 동작을 실천해 주세요.</li>
              </ul>
              <p className="text-sm text-stone-500 mt-3">
                (※ 만약 서거나 앉아서 허리를 펴는 것조차 극심하게 아프다면, 무리하지 말고 바닥에 엎드린 채로 심호흡을 하는 '엎드려 하는 신전 동작'을 먼저 권장합니다.)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowInstructions(false)}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Play size={24} fill="currentColor" />
            타이머 시작하기
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
          >
            홈으로 돌아가기
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto w-full pb-12 flex flex-col items-center justify-center min-h-[70vh]"
    >
      <button onClick={() => setShowInstructions(true)} className="self-start flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-12 transition-colors font-medium">
        <ChevronLeft size={20} />
        설명서 보기
      </button>

      <div className="text-center mb-16 h-24">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl md:text-3xl font-extrabold mb-3 whitespace-pre-line leading-tight"
          >
            {current.text}
          </motion.h2>
        </AnimatePresence>
        <p className="text-stone-500 dark:text-stone-400 font-medium">{current.subtext}</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        <motion.div
          animate={{ scale: current.scale }}
          transition={{ duration: phase === 'idle' ? 0.5 : (phase === 'inhale' ? 3 : (phase === 'exhale' ? 3 : 1)), ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full opacity-20 dark:opacity-30 ${current.color} transition-colors duration-1000`}
        />
        <motion.div
          animate={{ scale: current.scale * 0.8 }}
          transition={{ duration: phase === 'idle' ? 0.5 : (phase === 'inhale' ? 3 : (phase === 'exhale' ? 3 : 1)), ease: "easeInOut" }}
          className={`absolute inset-4 rounded-full opacity-40 dark:opacity-50 ${current.color} transition-colors duration-1000`}
        />
        <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-lg ${current.color} ${current.textColor} transition-colors duration-1000`}>
          <span className="text-5xl font-black tabular-nums tracking-tighter">
            {isActive ? timeLeft : <Wind size={48} strokeWidth={1.5} />}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center justify-center gap-2 py-4 px-8 rounded-full font-bold text-lg transition-colors shadow-md ${
            isActive 
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
              : 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900'
          }`}
        >
          {isActive ? (
            <>
              <Square size={20} fill="currentColor" />
              중지하기
            </>
          ) : (
            <>
              <Play size={20} fill="currentColor" />
              타이머 시작
            </>
          )}
        </motion.button>

        <button 
          onClick={onBack}
          className="text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300 text-sm font-medium transition-colors underline-offset-4 hover:underline"
        >
          홈으로 돌아가기
        </button>
      </div>
    </motion.div>
  );
}

const PARTICLES = Array.from({ length: 40 }).map(() => ({
  left: `${Math.random() * 100}vw`,
  top: `${Math.random() * 100}vh`,
  size: Math.random() * 4 + 1,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 10,
  xMove: Math.random() * 100 - 50,
}));

const Wavelength = 400;
const Amplitude = 80;

function DnaStrand({ speed = 20, className = "", reverse = false }) {
  const width = 3200;
  const frequency = (2 * Math.PI) / Wavelength;
  const spacing = 20;
  
  const path1 = [];
  const path2 = [];
  const rungs = [];

  for (let x = 0; x <= width; x += 10) {
    const y1 = Math.sin(x * frequency) * Amplitude;
    const y2 = Math.sin(x * frequency + Math.PI) * Amplitude;
    path1.push(`${x === 0 ? 'M' : 'L'} ${x} ${y1}`);
    path2.push(`${x === 0 ? 'M' : 'L'} ${x} ${y2}`);
  }

  for (let x = 0; x <= width; x += spacing) {
    const y1 = Math.sin(x * frequency) * Amplitude;
    const y2 = Math.sin(x * frequency + Math.PI) * Amplitude;
    const z = Math.cos(x * frequency);
    const rungOpacity = 0.1 + ((z + 1) / 2) * 0.4;
    rungs.push(
      <line key={x} x1={x} y1={y1} x2={x} y2={y2} stroke="currentColor" strokeWidth={1.5} opacity={rungOpacity} />
    );
  }

  return (
    <motion.div
      className={`absolute flex items-center ${className}`}
      animate={{ x: reverse ? [-Wavelength, 0] : [0, -Wavelength] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      <svg width={width} height={Amplitude * 2 + 20} viewBox={`0 ${-Amplitude - 10} ${width} ${Amplitude * 2 + 20}`} className="overflow-visible">
        <path d={path1.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <path d={path2.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.15" />
        {rungs}
      </svg>
    </motion.div>
  );
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0 bg-stone-50/50 dark:bg-stone-950/50">
      {/* Soft Mesh Gradients */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* DNA Strands */}
      <div className="absolute inset-0 flex items-center justify-center transform -rotate-12 scale-110">
        {/* Background blurred strand */}
        <DnaStrand 
          speed={35} 
          className="text-teal-500 dark:text-teal-400 opacity-10 blur-[6px] scale-150" 
          reverse 
        />
        {/* Foreground sharp strand */}
        <DnaStrand 
          speed={18} 
          className="text-emerald-600 dark:text-emerald-400 opacity-20" 
        />
      </div>

      {/* Floating Particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-emerald-500/40 dark:bg-emerald-400/30"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -300],
            x: [0, p.xMove],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'learn' | 'quiz' | 'diagnosis' | 'timer'>('home');
  const [isDark, setIsDark] = useState(true);
  const [unlockedVols, setUnlockedVols] = useState<string[]>(['vol1']);
  const [activeQuiz, setActiveQuiz] = useState<'vol1' | 'vol2' | 'vol3'>('vol1');

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleStartQuiz = (quizId: 'vol1' | 'vol2' | 'vol3') => {
    setActiveQuiz(quizId);
    setView('quiz');
  };

  const handlePassQuiz = (quizId: 'vol1' | 'vol2' | 'vol3') => {
    if (quizId === 'vol1' && !unlockedVols.includes('vol2')) {
      setUnlockedVols([...unlockedVols, 'vol2']);
    } else if (quizId === 'vol2' && !unlockedVols.includes('vol3')) {
      setUnlockedVols([...unlockedVols, 'vol3']);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
      <AnimatedBackground />
      <header className="relative z-10 p-4 md:p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <button onClick={() => setView('home')} className="text-xl font-extrabold tracking-tight">
          백년허리 가이드
        </button>
        <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </header>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView onNavigate={setView} key="home" />}
          {view === 'learn' && <LearnView onBack={() => setView('home')} onStartQuiz={handleStartQuiz} unlockedVols={unlockedVols} key="learn" />}
          {view === 'quiz' && <QuizView onBack={() => setView('learn')} quizId={activeQuiz} onPass={() => handlePassQuiz(activeQuiz)} key="quiz" />}
          {view === 'diagnosis' && <DiagnosisView onBack={() => setView('home')} key="diagnosis" />}
          {view === 'timer' && <TimerView onBack={() => setView('home')} key="timer" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
