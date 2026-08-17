"use strict";
const TOOLS = [
    { id: "hatchet", name: "손도끼", description: "목재 수집과 근접 전투에 유용하다.", consumable: false },
    { id: "crowbar", name: "쇠지렛대", description: "잠긴 문과 무너진 잔해를 안전하게 벌린다.", consumable: false },
    { id: "rope", name: "등반용 밧줄", description: "높거나 불안정한 장소에서 사용하면 소모된다.", consumable: true },
    { id: "medkit", name: "응급처치 가방", description: "탐사 중 큰 부상을 한 차례 치료하고 소모된다.", consumable: true },
    { id: "flare", name: "신호탄", description: "구조 신호를 보내거나 야생동물을 쫓고 소모된다.", consumable: true },
    { id: "trap", name: "사냥 덫", description: "야생동물을 안전하게 잡는 대신 소모된다.", consumable: true },
    { id: "ember-lantern", name: "재 속의 등불", description: "꺼지지 않는 미약한 불빛이 눈보라 속 길을 드러낸다.", consumable: false, special: true },
    { id: "hunter-knife", name: "붉은 사냥칼", description: "야생동물과의 전투 성공률을 크게 높인다.", consumable: false, special: true },
    { id: "silken-line", name: "금빛 머리끈", description: "가늘지만 끊어지지 않아 밧줄 대신 반복해서 사용할 수 있다.", consumable: false, special: true },
    { id: "giant-belt", name: "일곱의 허리띠", description: "무거운 물자를 운반할 때 추가 전리품을 확보한다.", consumable: false, special: true },
    { id: "golden-feather", name: "황금빛 깃털", description: "치명적인 탐사 부상을 한 차례 막아낸다.", consumable: true, special: true }
];
const toolById = (id) => TOOLS.find(tool => tool.id === id);
const HIDDEN_BURN_REWARDS = {
    "헨젤과 그레텔": "ember-lantern",
    "빨간 망토": "hunter-knife",
    "라푼젤": "silken-line",
    "용감한 꼬마 재봉사": "giant-belt",
    "황금새": "golden-feather"
};
const EXPEDITION_STORIES = [
    { id: "grocer", title: "얼어붙은 식료품점", scene: "깨진 간판 아래로 통조림 몇 개가 보인다. 천장은 내려앉았지만 입구 쪽 진열대는 아직 손이 닿는다.", choices: [{ label: "입구만 뒤진다", hint: "눈앞의 물자만 안전하게 챙긴다", food: 1, result: "서리에 붙은 통조림 하나를 떼어냈다. 많지는 않지만 온전하다." }, { label: "창고까지 들어간다", hint: "붕괴 위험을 감수한다", chance: .58, food: 3, result: "무너진 선반 뒤에서 먹을 수 있는 통조림 세 개를 찾아냈다.", failure: "천장이 내려앉기 시작해 몸만 간신히 빼냈다.", failureHealth: -12 }] },
    { id: "wood-shed", title: "눈에 잠긴 장작 창고", scene: "지붕만 눈 밖으로 드러난 창고가 있다. 안쪽에는 마른 장작 냄새가 희미하게 남아 있다.", choices: [{ label: "보이는 장작만 뽑는다", hint: "확실한 수확", wood: 2, result: "눈가에 걸린 장작 두 개를 무사히 꺼냈다." }, { label: "문을 파낸다", hint: "체력을 써서 더 많이 찾는다", wood: 5, health: -6, result: "손가락 감각이 사라질 때까지 파낸 끝에 장작 다섯 개를 묶었다." }] },
    { id: "ice-pack", title: "얼음 아래의 배낭", scene: "투명한 얼음층 아래에 붉은 배낭이 갇혀 있다. 안에는 아직 무언가 묵직하게 들어 있다.", choices: [{ label: "얼음을 깨뜨린다", hint: "내용물과 부상의 가능성", chance: .65, food: 2, wood: 1, result: "얼음이 갈라지며 배낭이 떠올랐다. 식량과 불쏘시개가 들어 있다.", failure: "얼음 파편이 손등을 깊게 베었다. 배낭은 더 아래로 가라앉았다.", failureHealth: -10 }, { label: "표식만 남긴다", hint: "아무것도 얻지 않고 지나간다", result: "돌무더기로 위치를 표시하고 발길을 돌렸다." }] },
    { id: "camp", title: "버려진 야영지", scene: "천막은 찢겼지만 재 속에는 아직 온기가 남아 있다. 한 쌍의 발자국이 북쪽 폐허로 이어진다.", choices: [{ label: "남은 물자를 챙긴다", hint: "작은 확정 보상", food: 1, wood: 1, result: "버려진 식량과 덜 탄 장작을 챙겼다." }, { label: "발자국을 따라간다", hint: "누군가의 흔적을 추적한다", chance: .5, food: 3, result: "눈구덩이에 숨겨둔 비상식량을 발견했다.", failure: "발자국은 매복지로 이어졌다. 빈손으로 달아나는 동안 돌에 얻어맞았다.", failureHealth: -9 }, { label: "불씨 옆에서 쉰다", hint: "체력을 조금 회복한다", health: 8, result: "남은 열을 몸에 품었다. 굳어 있던 관절이 조금 풀렸다." }] },
    { id: "warm-fire", title: "아직 따뜻한 모닥불", scene: "눈보라 한가운데 모닥불이 타고 있다. 주변에는 사람이 없지만, 눈 위의 자리는 방금 전까지 누군가 앉아 있던 듯하다.", choices: [{ label: "불씨를 가져간다", hint: "땔감을 얻는다", wood: 2, result: "타다 남은 숯과 불씨를 금속통에 담았다. 끝내 주인은 돌아오지 않았다." }, { label: "주인을 기다린다", hint: "시간을 들여 뜻밖의 도움을 기다린다", chance: .55, food: 2, result: "흰 망토를 쓴 생존자가 돌아와 기다려 준 대가로 식량을 건넸다.", failure: "불은 꺼졌고 아무도 오지 않았다. 추위만 몸속에 남았다.", failureHealth: -5 }] },
    { id: "signal", title: "눈 속의 구조 신호", scene: "붕괴한 건물 옥상에서 붉은 천이 일정한 간격으로 흔들린다. 바람의 움직임이라고 보기에는 너무 규칙적이다.", choices: [{ label: "신호에 답한다", hint: "구조자 또는 약탈자와 조우한다", chance: .55, food: 2, result: "고립된 생존자를 끌어냈다. 그는 답례로 비상식량을 내놓았다.", failure: "도움을 외친 자들은 약탈자였다. 도망치며 전리품을 흘렸다.", failureHealth: -8, failureFood: -1 }, { label: "멀리서 관찰한다", hint: "위험을 피한다", result: "잠시 뒤 신호가 끊겼다. 무엇이 기다렸는지는 알 수 없다." }] },
    { id: "white-deer", title: "흰 사슴", scene: "빛바랜 겨울 털 때문에 거의 흰색으로 보이는 사슴이 길을 가로지른다. 굶주린 듯 비틀거리며 낮은 골짜기로 내려간다.", choices: [{ label: "흔적을 따라간다", hint: "먹이터 주변을 수색한다", wood: 3, result: "사슴이 내려간 골짜기는 바람이 약했다. 눈 밖으로 드러난 마른 나뭇가지를 모았다." }, { label: "사냥한다", hint: "큰 보상과 실패 위험", chance: .45, food: 4, result: "긴 추격 끝에 사슴을 쓰러뜨려 상당한 식량을 얻었다.", failure: "사슴을 놓치고 얼어붙은 비탈에서 넘어져 무릎을 다쳤다.", failureHealth: -13 }, { label: "쫓지 않고 쉰다", hint: "체력을 조금 회복한다", health: 3, result: "바람이 약한 바위 뒤에서 호흡을 고르고 젖은 장갑을 말렸다." }] },
    { id: "train", title: "멈춰버린 기차", scene: "검은 객차들이 얼음 평원에 길게 누워 있다. 식당칸, 화물칸, 객실 중 한 곳만 살필 시간이 있다.", choices: [{ label: "식당칸을 수색한다", hint: "식량을 찾는다", food: 2, result: "얼어붙었지만 밀봉된 식재료를 찾아냈다." }, { label: "화물칸을 연다", hint: "땔감을 찾는다", wood: 3, result: "부서진 화물 상자를 쪼개 쓸 만한 목재로 만들었다." }, { label: "객실을 조사한다", hint: "물자는 적지만 몸을 추스를 수 있다", health: 6, result: "좌석 아래에서 담요를 찾아 잠시 몸을 녹였다. 창에는 안쪽에서 쓴 이름들이 남아 있었다." }] },
    { id: "greenhouse", title: "얼어붙은 온실", scene: "유리벽 대부분이 깨졌지만 중앙 화분 하나에는 푸른 잎이 살아 있다. 선반에는 마른 종자 봉투와 낡은 구급함이 놓여 있다.", choices: [{ label: "먹을 수 있는 잎을 거둔다", hint: "즉시 식량 획득", food: 2, result: "쓴맛이 강하지만 먹을 수 있는 잎을 조심스럽게 거뒀다." }, { label: "종자와 선반을 챙긴다", hint: "식량과 땔감을 조금씩 얻는다", food: 1, wood: 2, result: "씨앗 일부와 마른 선반 조각을 챙겼다. 언젠가 흙을 되찾을 날을 생각했다." }, { label: "구급함을 확인한다", hint: "상처를 처치한다", health: 4, result: "얼지 않은 소독약과 붕대가 조금 남아 있었다. 바람을 피해 상처를 다시 감았다." }] },
    { id: "whiteout", title: "얼어붙은 안개", scene: "희뿌연 안개가 발목에서부터 차올라 모든 방향을 지운다. 자신의 발자국마저 몇 초 만에 사라진다.", choices: [{ label: "땔감으로 횃불을 만든다", hint: "전리품 땔감 1을 써서 길을 확보한다", result: "불꽃이 안개 속에서 작은 구멍을 냈다. 그 빛을 따라 안전하게 빠져나왔다.", wood: -1 }, { label: "감각만 믿고 걷는다", hint: "부상 위험", chance: .45, result: "벽을 짚듯 바람의 결을 따라 안개 밖으로 나왔다.", failure: "같은 곳을 맴돌다 얼음 계단에서 굴러 떨어졌다.", failureHealth: -11 }] },
    { id: "black-snow", title: "검은 눈", scene: "재가 섞인 검은 눈이 내린다. 멀리서 붉은 불기둥이 솟고, 타는 냄새 속에 기름 냄새가 섞여 있다.", choices: [{ label: "불기둥으로 향한다", hint: "큰 수확과 큰 부상 위험", chance: .48, wood: 5, result: "불타는 창고 가장자리에서 마른 연료를 끌어냈다.", failure: "연료통이 폭발했다. 폭풍이 몸을 내던지고 옷자락을 태웠다.", failureHealth: -18 }, { label: "검은 눈을 피해 우회한다", hint: "안전하게 지나친다", result: "검게 물든 풍경을 등지고 먼 길을 택했다." }] },
    { id: "church", title: "무너진 예배당", scene: "지붕이 무너진 예배당에서 느슨해진 종이 강풍에 간헐적으로 울린다. 제단 아래 저장고 문은 반쯤 열려 있다.", choices: [{ label: "제단 주변을 살핀다", hint: "작은 보급품을 찾는다", food: 1, result: "촛대 뒤에서 누군가 남긴 비상식량을 발견했다." }, { label: "지하 저장고로 내려간다", hint: "큰 보상과 붕괴 위험", chance: .55, food: 2, wood: 3, result: "지하에는 피난민들이 남긴 식량과 장작이 보존되어 있었다.", failure: "썩은 계단이 꺼지며 잔해에 깔렸다. 아무것도 들고 나오지 못했다.", failureHealth: -15 }, { label: "종을 울려 신호를 보낸다", hint: "주변 생존자에게 위치가 드러난다", chance: .6, health: 7, result: "종소리를 들은 생존자 한 명이 나타났다. 그는 적의가 없음을 확인한 뒤 상처를 소독하고 붕대를 나눠주었다.", failure: "종소리에 굶주린 들개들이 몰려왔다. 달아나다 깨진 유리에 손을 베었다.", failureHealth: -6 }] },
    { id: "wrong-tracks", title: "낯익은 발자국", scene: "눈 덮인 골목에 자신의 것과 같은 규격의 장화 자국이 남아 있다. 누군가 같은 보급소에서 장비를 지급받은 생존자일지 모른다.", choices: [{ label: "발자국을 따라간다", hint: "다른 생존자의 흔적을 추적한다", chance: .55, food: 2, wood: 2, result: "무너진 검문소에서 버려진 보급 가방을 발견했다. 주인의 흔적은 더 이어지지 않았다.", failure: "자국은 약탈자들이 만든 유인로였다. 급히 담을 넘다가 팔을 긁혔다.", failureHealth: -7 }, { label: "접촉을 피하고 우회한다", hint: "안전하지만 먼 길을 택한다", health: -3, result: "낯선 생존자와 마주치지 않도록 긴 우회로를 택했다. 추위 속에서 체력이 조금 소진됐다." }] },
    { id: "empty-village", title: "사람이 떠난 식탁", scene: "폐가의 식탁에는 급히 자리를 뜬 흔적이 남아 있다. 굳은 빵과 밀봉된 병 몇 개가 놓였지만 보관 상태는 확실하지 않다.", choices: [{ label: "먹을 것을 챙긴다", hint: "많이 얻지만 상했을 가능성이 있다", chance: .55, food: 3, result: "밀봉이 온전한 식량을 골라 배낭에 넣었다.", failure: "상한 음식을 잘못 맛본 뒤 심한 복통이 시작됐다.", failureHealth: -8 }, { label: "장작만 뜯어낸다", hint: "가구를 해체해 땔감을 얻는다", wood: 2, result: "식량에는 손대지 않고 부서진 의자와 마른 식탁 다리를 챙겼다." }, { label: "잠시 쉬었다 떠난다", hint: "보상 없이 위험을 피한다", result: "문을 걸어 잠그고 바람이 잦아들 때까지 기다린 뒤 다시 길을 나섰다." }] },
    { id: "hardware-store", title: "무너진 철물점", scene: "깨진 진열장 아래로 녹슨 공구들이 흩어져 있다. 안쪽 벽은 금이 갔고 바닥에는 새로 떨어진 콘크리트 가루가 쌓여 있다.", choices: [{ label: "진열장만 뒤진다", hint: "손도끼를 찾는다", grantTool: "hatchet", result: "날에 녹이 슬었지만 손잡이가 온전한 손도끼를 찾아냈다." }, { label: "잠긴 보관함을 연다", hint: "희귀한 공구와 붕괴 위험", chance: .55, grantTool: "crowbar", result: "보관함에서 튼튼한 쇠지렛대를 꺼냈다.", failure: "보관함을 당기는 순간 벽 일부가 무너져 어깨를 다쳤다.", failureHealth: -11 }, { label: "건물을 떠난다", hint: "붕괴 위험을 피한다", result: "더 무너지기 전에 철물점을 빠져나왔다." }] },
    { id: "rescue-cache", title: "산악 구조함", scene: "붉은색 구조함이 눈에 반쯤 묻혀 있다. 유리는 깨졌지만 내부의 방수 포장은 아직 닫혀 있다.", choices: [{ label: "의료 포장을 챙긴다", hint: "응급처치 가방 획득", grantTool: "medkit", result: "소독약과 압박 붕대가 든 응급처치 가방을 챙겼다." }, { label: "신호 장비를 챙긴다", hint: "신호탄 획득", grantTool: "flare", result: "습기를 피한 신호탄 하나가 발사기와 함께 남아 있었다." }, { label: "함의 목재를 뜯는다", hint: "땔감 2 획득", wood: 2, result: "쓸 수 있는 장비는 두고 구조함의 마른 덮개만 떼어냈다." }] },
    { id: "hunter-hide", title: "사냥꾼의 은신처", scene: "나뭇가지로 위장한 낮은 천막 안에 오래된 짐승 가죽과 철제 장치가 남아 있다. 주인은 오래전에 떠난 듯하다.", choices: [{ label: "철제 장치를 조사한다", hint: "사냥 덫 획득", grantTool: "trap", result: "기름칠한 천에 싸인 사냥 덫을 발견했다. 작동 상태도 나쁘지 않다." }, { label: "천막의 끈을 푼다", hint: "등반용 밧줄 획득", grantTool: "rope", result: "천막을 고정하던 긴 밧줄을 풀어 배낭에 묶었다." }, { label: "남은 고기를 찾는다", hint: "식량을 얻지만 상했을 수 있다", chance: .5, food: 2, result: "소금에 절여 둔 고기 일부가 아직 먹을 만했다.", failure: "고기는 이미 상해 있었다. 냄새를 맡는 순간부터 속이 뒤집혔다.", failureHealth: -7 }] },
    { id: "collapsed-ambulance", title: "전복된 구급차", scene: "눈둑 아래로 구급차 한 대가 옆으로 쓰러져 있다. 뒷문은 찌그러졌고 차체는 비탈 아래로 조금씩 미끄러진다.", choices: [{ label: "쇠지렛대로 뒷문을 연다", hint: "도구를 사용해 의료 장비를 확보", requiredTool: "crowbar", grantTool: "medkit", health: 5, result: "찌그러진 문을 벌리고 안으로 들어갔다. 상처를 처치한 뒤 남은 구급품도 챙겼다." }, { label: "창문으로 기어 들어간다", hint: "부상을 감수하고 수색한다", health: -8, grantTool: "medkit", result: "깨진 창틀에 옷과 피부가 찢겼지만 응급처치 가방 하나를 건졌다." }, { label: "미끄러지기 전에 떠난다", hint: "아무것도 얻지 않는다", result: "차체가 눈 아래로 사라지기 전에 비탈을 벗어났다." }] },
    { id: "cold-snap", title: "살을 에는 돌풍", scene: "계곡을 빠져나오기도 전에 기온이 급격히 떨어진다. 젖은 옷자락이 순식간에 갑옷처럼 얼어붙는다.", choices: [{ label: "이를 악물고 전진한다", hint: "피할 수 없는 추위", health: -9, result: "쉴 곳 하나 없는 벌판을 건넜다. 손끝의 감각이 돌아오지 않는다." }] }
];
const TOOL_STORY_CHOICES = {
    "wood-shed": [{ label: "손도끼로 안쪽 목재를 해체한다", hint: "손도끼 필요 · 추가 땔감", requiredTool: "hatchet", wood: 7, result: "얼어붙은 이음새를 도끼로 쪼개 마른 골조까지 분해했다. 상당한 장작을 확보했다." }],
    "ice-pack": [{ label: "쇠지렛대로 얼음을 벌린다", hint: "쇠지렛대 필요 · 부상 없이 회수", requiredTool: "crowbar", food: 2, wood: 1, result: "갈라진 틈에 지렛대를 넣어 얼음판을 들어 올렸다. 배낭을 손상 없이 꺼냈다." }],
    "signal": [{ label: "신호탄으로 위치를 알린다", hint: "신호탄 소모 · 구조 성공", requiredTool: "flare", consumeTool: true, food: 3, result: "붉은 신호가 눈보라 위로 솟았다. 근처 생존자들이 응답해 식량을 나누어 주었다." }],
    "white-deer": [{ label: "이동로에 사냥 덫을 놓는다", hint: "사냥 덫 소모 · 안전한 사냥", requiredTool: "trap", consumeTool: true, food: 4, result: "사슴이 되돌아오는 길목을 읽고 덫을 설치했다. 추격과 부상 없이 고기를 확보했다." }],
    "train": [{ label: "쇠지렛대로 정비함을 연다", hint: "쇠지렛대 필요 · 새 도구 발견", requiredTool: "crowbar", grantTool: "rope", result: "잠긴 정비함을 열자 작업용 밧줄과 고정 고리가 남아 있었다." }],
    "church": [{ label: "밧줄을 묶고 저장고로 내려간다", hint: "밧줄 소모 · 붕괴 위험 제거", requiredTool: "rope", consumeTool: true, food: 2, wood: 3, result: "기둥에 밧줄을 고정하고 무너진 계단을 피해 내려갔다. 저장 물자를 안전하게 끌어올렸다." }]
};
const ROUTE_VARIANTS = {
    safe: [
        { title: "바람이 깎은 평지", clue: "눈 표면이 단단하고 멀리까지 시야가 트여 있다. 숨을 곳도 없지만 매복할 곳도 적다.", tendency: "별일 없이 이동할 가능성이 높다", risk: "낮음" },
        { title: "얼어붙은 도로", clue: "도로 표지판이 눈 밖으로 이어진다. 균열은 있지만 우회할 만한 공간이 충분하다.", tendency: "안전한 이동 · 적은 보상", risk: "낮음" },
        { title: "낮은 방풍벽", clue: "무너진 방풍벽이 길을 따라 이어진다. 오래된 발자국은 이미 눈에 덮였다.", tendency: "추위를 피하며 전진", risk: "낮음" }
    ],
    ruins: [
        { title: "지붕이 드러난 폐허", clue: "눈더미 사이로 여러 건물의 지붕과 굴뚝이 보인다. 안쪽에서 금속이 부딪치는 소리가 난다.", tendency: "땔감과 도구 발견 가능", risk: "보통" },
        { title: "무너진 상점가", clue: "찢어진 차양 아래에 잠긴 출입문들이 줄지어 있다. 일부 건물은 금방이라도 내려앉을 듯하다.", tendency: "생활 물자 · 붕괴 위험", risk: "보통" },
        { title: "눈에 잠긴 차량 행렬", clue: "도로를 막은 차량들 사이로 열 수 있는 적재함이 보인다. 바닥의 얼음은 고르지 않다.", tendency: "도구와 보급품 가능", risk: "보통" }
    ],
    tracks: [
        { title: "숲으로 향하는 발자국", clue: "작은 발자국과 큰 발자국이 뒤섞여 숲 안쪽으로 이어진다. 몇 군데에는 마른 핏자국이 남았다.", tendency: "식량 가능 · 야생동물 위험", risk: "높음" },
        { title: "부러진 나뭇가지", clue: "사람 키 높이의 가지가 연달아 꺾여 있다. 눈 아래에서는 짐승 냄새가 희미하게 올라온다.", tendency: "사냥감 또는 포식자", risk: "높음" },
        { title: "버려진 사냥 표식", clue: "나무마다 붉은 천 조각이 묶여 있다. 오래된 덫 자국과 최근의 배설물이 함께 보인다.", tendency: "식량과 사냥 장비 가능", risk: "높음" }
    ],
    signal: [
        { title: "멀리 깜박이는 불빛", clue: "폐허 너머에서 약한 불빛이 일정하지 않은 간격으로 나타났다 사라진다.", tendency: "생존자·희귀 기록 가능", risk: "불명" },
        { title: "눈 위의 종이 조각", clue: "글자가 적힌 종이들이 바람을 거슬러 한 골목 안쪽에 모여 있다.", tendency: "책 발견 가능 · 정체불명", risk: "불명" },
        { title: "붉은 천이 걸린 탑", clue: "높은 구조물에 붉은 천이 매달려 있다. 구조 신호인지 경고 표식인지는 알 수 없다.", tendency: "큰 보상 또는 큰 위험", risk: "불명" }
    ]
};
const ROUTE_STORY_POOLS = {
    safe: ["whiteout", "cold-snap", "camp"],
    ruins: ["grocer", "wood-shed", "ice-pack", "train", "greenhouse", "church", "empty-village", "hardware-store", "collapsed-ambulance"],
    tracks: ["camp", "white-deer", "hunter-hide", "warm-fire"],
    signal: ["signal", "warm-fire", "black-snow", "wrong-tracks", "rescue-cache", "church"]
};
const SAVE_KEY = "winter-library-save-v1";
const CATALOG_TITLES = [
    "개구리 왕, 혹은 철의 하인리히", "소름을 배우러 떠난 사나이", "늑대와 7마리 아기염소", "라푼젤", "헨젤과 그레텔", "어부와 그의 아내", "신데렐라", "홀레 아주머니", "일곱마리 까마귀", "빨간 망토", "브레멘 음악대", "노래하는 뼈", "대부가 된 죽음의 신", "노간주나무", "여섯 마리 백조", "들장미 공주", "백설공주", "룸펠슈틸츠헨", "황금새", "황금 거위", "고양이와 쥐의 공동 생활", "성모 마리아의 아이", "충신 요하네스", "떠돌이 악사", "오누이", "숲 속의 세 난쟁이", "실 잣는 세 여인", "하얀 뱀", "용감한 꼬마 재봉사", "수수께끼", "손 없는 왕비", "요술 식탁, 황금 당나귀, 자루 속의 몽둥이", "엄지둥이", "꼬마 요정", "강도 사위"
];
const BOOK_TAGS = {
    "개구리 왕, 혹은 철의 하인리히": ["왕실", "변신", "약속"], "소름을 배우러 떠난 사나이": ["죽음", "기지"],
    "늑대와 7마리 아기염소": ["가족", "동물", "기지"], "라푼젤": ["왕실", "가족", "구원"],
    "헨젤과 그레텔": ["숲", "가족", "기지"], "어부와 그의 아내": ["마법", "탐욕", "변신"],
    "신데렐라": ["왕실", "노동", "구원"], "홀레 아주머니": ["마법", "노동", "구원"],
    "일곱마리 까마귀": ["가족", "변신", "동물"], "빨간 망토": ["숲", "가족", "동물"],
    "브레멘 음악대": ["동물", "기지", "구원"], "노래하는 뼈": ["죽음", "배신", "마법"],
    "대부가 된 죽음의 신": ["죽음", "약속", "배신"], "노간주나무": ["가족", "죽음", "변신"],
    "여섯 마리 백조": ["가족", "변신", "구원"], "들장미 공주": ["왕실", "마법", "구원"],
    "백설공주": ["왕실", "숲", "배신"], "룸펠슈틸츠헨": ["황금", "노동", "약속"],
    "황금새": ["황금", "동물", "왕실"], "황금 거위": ["황금", "동물", "기지"],
    "고양이와 쥐의 공동 생활": ["동물", "탐욕", "배신"], "성모 마리아의 아이": ["약속", "배신", "구원"],
    "충신 요하네스": ["왕실", "약속", "구원"], "떠돌이 악사": ["동물", "숲", "기지"],
    "오누이": ["가족", "숲", "변신"], "숲 속의 세 난쟁이": ["숲", "마법", "구원"],
    "실 잣는 세 여인": ["노동", "기지", "구원"], "하얀 뱀": ["동물", "마법", "기지"],
    "용감한 꼬마 재봉사": ["노동", "기지", "왕실"], "수수께끼": ["기지", "왕실", "약속"],
    "손 없는 왕비": ["가족", "구원", "배신"], "요술 식탁, 황금 당나귀, 자루 속의 몽둥이": ["황금", "마법", "탐욕"],
    "엄지둥이": ["가족", "기지", "숲"], "꼬마 요정": ["마법", "노동", "구원"], "강도 사위": ["배신", "죽음", "기지"]
};
const SYNERGY_EMOTIONS = { 황금: "분노", 숲: "불안", 가족: "애착", 왕실: "희망", 변신: "불안", 약속: "애착", 노동: "희망", 죽음: "슬픔", 동물: "공포", 마법: "공포", 기지: "희망", 탐욕: "분노", 구원: "희망", 배신: "불안" };
const EMOTIONS = ["희망", "불안", "공포", "슬픔", "분노", "애착"];
const OBSERVATIONS = {
    "개구리 왕, 혹은 철의 하인리히": "우물가에서 시작된 약속은 너무 가볍게 버려졌고, 축축한 발자국은 끝내 왕궁의 식탁까지 이어졌다. 마지막 장을 덮을 때 철로 조인 누군가의 심장이 풀려나는 소리를 들었다.",
    "고양이와 쥐의 공동 생활": "겨울을 함께 견디자던 두 존재가 항아리 하나를 맡겼다. 그러나 빈 그릇보다 먼저 사라진 것은 신뢰였다. 책등에서는 아직도 달콤한 기름 냄새가 난다.",
    "성모 마리아의 아이": "금지된 문 하나와 끝까지 인정하지 못한 진실이 한 아이의 목소리를 앗아갔다. 침묵한 문장마다 금빛 열쇠 자국이 남아 있다.",
    "소름을 배우러 떠난 사나이": "두려움을 알지 못하는 사내는 남들이 피한 밤을 일부러 찾아다녔다. 유령보다 기묘한 것은, 공포를 배우려는 그의 지나치게 맑은 눈이었다.",
    "늑대와 7마리 아기염소": "문밖의 목소리는 다정했지만 문틈 아래의 발은 하얗게 위장되어 있었다. 살아남은 아이들의 떨림이 종이 사이에서 일곱 갈래로 나뉜다.",
    "라푼젤": "창문 하나뿐인 높은 방에서 누군가는 머리카락을 밧줄처럼 내려 보냈다. 탑 밖을 향한 그리움이 페이지 위로 길게 자라난다.",
    "헨젤과 그레텔": "굶주린 아이들은 빵 부스러기로 귀환로를 만들었지만 숲은 그것마저 삼켰다. 달콤한 집의 문장은 유난히 따뜻하고, 그 온기가 오히려 불길하다.",
    "빨간 망토": "붉은 천을 두른 작은 방문자는 숲길에서 너무 오래 낯선 목소리와 이야기했다. 마지막 기록에는 침대 위 존재의 눈과 이빨만 반복해서 묘사되어 있다.",
    "브레멘 음악대": "버려진 네 동물이 도시를 향해 걷다가 도둑들의 불빛을 발견했다. 서로의 등에 올라선 순간, 외로운 울음은 하나의 위협적인 노래가 되었다.",
    "어부와 그의 아내": "바다가 내준 소원은 작은 오두막을 궁전으로 바꾸었지만, 만족을 가르쳐 주지는 않았다. 요구가 커질 때마다 책 속 파도도 더 검게 일렁인다.",
    "신데렐라": "재투성이로 불리던 아이는 죽은 어머니의 나무 아래에서 도움을 구했다. 유리처럼 빛나는 밤보다 내 눈에 오래 남은 것은, 끝까지 그녀를 알아본 작은 신발이었다.",
    "홀레 아주머니": "우물 아래의 세계에서는 성실함과 게으름이 각기 다른 모습으로 몸에 달라붙었다. 책을 털면 금가루와 검은 역청이 번갈아 떨어진다.",
    "일곱마리 까마귀": "성급한 저주가 일곱 형제를 검은 날개로 바꾸었다. 막내는 그들을 되찾으려 세상의 끝까지 걸었고, 작은 손가락 하나까지 길의 대가로 내놓았다.",
    "노래하는 뼈": "괴물을 쓰러뜨린 공은 살아 있는 자가 훔쳤지만, 땅에 묻힌 뼈는 진실을 잊지 않았다. 페이지를 넘기면 멀리서 피리 같은 고발이 들린다.",
    "대부가 된 죽음의 신": "죽음은 누구에게나 공평하다는 이유로 한 아이의 대부가 되었다. 그러나 촛불로 표시된 수명을 속이려 한 순간, 의술은 거래가 되고 약속은 판결이 되었다.",
    "노간주나무": "가족의 식탁 아래 감춰진 죄가 한 마리 새의 노래로 돌아왔다. 책에서는 노간주 향과 함께, 너무 늦게 되찾은 아이의 온기가 느껴진다.",
    "여섯 마리 백조": "백조가 된 여섯 오빠를 되돌리기 위해 누이는 오랜 침묵 속에서 가시 돋친 옷을 짰다. 마지막 소매가 끝나지 않아 남은 날개 하나가 유난히 서늘하다.",
    "들장미 공주": "왕국 전체가 한순간에 잠들었고, 성을 감싼 가시는 백 년 동안 시간을 지켰다. 이 책 가까이에서는 불꽃조차 천천히 흔들린다.",
    "백설공주": "거울의 대답 하나가 한 아이를 숲으로 몰았다. 난쟁이들의 집에서 찾은 평온도 독이 밴 선물 앞에서는 오래가지 못했다.",
    "룸펠슈틸츠헨": "짚을 금으로 만들 수 있다는 거짓말이 이름 모를 존재와의 계약으로 이어졌다. 마지막 장의 이름은 잉크가 아니라 긁힌 자국으로 남아 있다.",
    "황금새": "밤마다 사라지는 황금 사과를 따라 막내 왕자가 길을 나섰다. 충고를 어길 때마다 여정은 꼬였지만, 말하는 여우는 이상하리만큼 그를 포기하지 않았다.",
    "황금 거위": "보잘것없다 여겨진 막내가 친절의 대가로 황금 거위를 얻었다. 욕심으로 깃털을 잡은 이들은 줄줄이 붙었고, 그 우스운 행렬이 마침내 웃지 않던 얼굴을 움직였다.",
    "충신 요하네스": "왕을 지키기 위해 돌이 될 운명까지 감수한 신하의 기록이다. 경고를 입 밖에 낼 때마다 몸에서 온기가 빠져나간 흔적이 페이지에 남아 있다.",
    "떠돌이 악사": "혼자 연주하고 싶었던 악사는 숲의 동물들을 차례로 불러냈다가 속임수로 떼어 놓았다. 마지막 선율에는 버림받은 이들의 발소리가 섞여 있다.",
    "오누이": "저주받은 샘물을 마신 남동생은 사슴이 되었고, 누이는 숲속 집에서 그를 숨겼다. 문밖 사냥 나팔이 울릴 때마다 종이가 가늘게 떨린다.",
    "숲 속의 세 난쟁이": "눈밭에서 딸기를 찾던 아이가 작은 집의 세 주인에게 가진 것을 나누었다. 친절과 탐욕이 각각 금화와 두꺼비의 모습으로 입에서 흘러나왔다.",
    "실 잣는 세 여인": "실을 잣지 못하는 처녀 앞에 기이하게 변형된 몸의 세 여인이 나타났다. 그들의 노동 흔적은 결혼식 날, 평생의 의무를 끊는 증거가 되었다.",
    "하얀 뱀": "왕의 비밀 음식을 맛본 하인이 동물들의 말을 듣게 되었다. 작은 생명들에게 베푼 도움은 길 끝에서 인간의 지혜보다 정확한 답으로 돌아왔다.",
    "용감한 꼬마 재봉사": "파리 일곱을 한 번에 잡았다는 허풍이 거인과 왕국 전체를 움직였다. 작은 허리띠의 문구가 사실보다 거대한 힘을 얻는 과정을 기록했다.",
    "수수께끼": "죽음의 여관을 빠져나온 여행자는 독이 밴 말고기를 단서로 수수께끼를 만들었다. 답을 훔치려는 발소리가 세 밤 동안 침대 곁을 맴돈다.",
    "손 없는 왕비": "아버지의 거래로 두 손을 잃은 여인이 은빛 팔과 왕관을 얻고도 다시 숲으로 쫓겨났다. 책장을 만지면 보이지 않는 손자국이 잉크 위에 생긴다.",
    "요술 식탁, 황금 당나귀, 자루 속의 몽둥이": "세 형제는 각기 음식, 금화, 응징을 내놓는 물건을 얻었다. 빼앗긴 보물을 되찾게 한 것은 가장 보잘것없어 보이던 자루였다.",
    "엄지둥이": "손가락만 한 아이가 말의 귀와 늑대의 배 속을 지나 집으로 돌아왔다. 작은 목소리는 좁은 페이지 틈에서도 이상할 만큼 또렷하다.",
    "꼬마 요정": "밤마다 구두를 완성하던 작은 손들은 보답으로 받은 옷을 입고 작업대를 떠났다. 마지막 구두 한 켤레에는 이별을 축하하는 발자국이 찍혀 있다.",
    "강도 사위": "신부가 될 여인은 숲속 집에서 자신의 결혼 상대가 숨긴 본모습을 목격했다. 잘린 손가락과 금반지가 침묵보다 확실한 증거로 남았다."
};
const BOOK_PUZZLES = {
    "개구리 왕, 혹은 철의 하인리히": { scene: "얼어붙은 우물가에서 작은 왕관을 쓴 개구리가 금빛 공을 물고 있다. ‘약속한 자만이 돌려받을 수 있다’고 낮은 목소리로 말한다.", choices: ["공을 빼앗는다", "개구리와 식탁을 나누겠다고 약속한다", "우물에 동전을 던진다"], correct: 1, success: "개구리가 공을 내려놓자 철이 끊어지는 소리와 함께 책이 모습을 드러냈다.", failure: "지키지 못할 약속을 알아챈 개구리가 공과 이야기 모두를 물속으로 가져갔다." },
    "소름을 배우러 떠난 사나이": { scene: "폐허의 종탑 아래, 유령 셋이 줄에 매달린 채 묻는다. ‘네가 가장 두려워하는 것을 말해라.’ 그러나 그들은 공포의 냄새를 맡는 듯하다.", choices: ["두렵지 않다고 솔직히 말한다", "유령인 척 소리친다", "눈을 감고 도망친다"], correct: 0, success: "유령들은 처음 보는 인간이라며 웃었고, 그 웃음 사이에서 책 한 권이 떨어졌다.", failure: "거짓 공포가 들통나자 종탑과 유령은 눈보라 속으로 사라졌다." },
    "늑대와 7마리 아기염소": { scene: "잠긴 오두막 안에서 일곱 목소리가 암호를 요구한다. 문 아래로 보이는 것은 밀가루처럼 흰 발이지만, 숨소리는 지나치게 거칠다.", choices: ["문을 두드려 아이들을 재촉한다", "문 아래 발자국과 목소리를 다시 확인한다", "늑대 울음으로 대답한다"], correct: 1, success: "가짜 흰 발을 닦아내자 검은 털이 드러났다. 늑대가 달아난 자리에 책이 남았다.", failure: "문이 열리는 순간 검은 주둥이가 기록을 물고 숲으로 사라졌다." },
    "라푼젤": { scene: "창문 하나뿐인 얼음탑에서 긴 금빛 머리카락이 내려온다. 탑 아래에는 잘린 밧줄과 가시덤불이 함께 놓여 있다.", choices: ["머리카락을 힘껏 잡아당긴다", "탑의 이름을 세 번 외친다", "머리카락에 무게를 싣기 전 위의 주인에게 신호한다"], correct: 2, success: "위에서 조심스러운 대답이 돌아왔고, 머리카락 끝에 묶인 책이 내려왔다.", failure: "금빛 머리카락은 가시로 변했고 탑은 안개 뒤로 숨어버렸다." },
    "헨젤과 그레텔": { scene: "과자로 지은 작은 집에서 따뜻한 냄새가 난다. 바닥에는 새들이 먹지 못한 흰 자갈이 숲 쪽으로 이어진다.", choices: ["과자 벽을 뜯어 먹는다", "자갈을 따라 집 뒤편을 살핀다", "굴뚝에 불을 더 지핀다"], correct: 1, success: "자갈 끝의 재 더미에서 타지 않은 책을 찾아냈다.", failure: "달콤한 냄새에 정신을 잃은 사이 집과 책은 흔적도 없이 사라졌다." },
    "어부와 그의 아내": { scene: "검은 바다가 소원을 하나 말해 보라며 출렁인다. 물 위에는 금빛 물고기와 다 쓰러진 오두막의 그림자가 함께 비친다.", choices: ["궁전을 요구한다", "바다를 다스릴 힘을 요구한다", "아무것도 원하지 않는다고 답한다"], correct: 2, success: "파도가 잔잔해지며 모래 위에 젖지 않은 책 한 권을 밀어 올렸다.", failure: "욕망을 들은 바다가 검게 솟구쳐 책과 해안을 함께 삼켰다." },
    "신데렐라": { scene: "재투성이 무도회장에 똑같아 보이는 세 짝의 신발이 놓여 있다. 창밖에서는 비둘기들이 한 켤레만 바라보고 있다.", choices: ["가장 화려한 신발을 고른다", "비둘기가 바라보는 소박한 신발을 고른다", "모든 신발을 불에 던진다"], correct: 1, success: "신발이 정확히 맞아들자 재 속에서 은빛 표지의 책이 나타났다.", failure: "맞지 않는 신발에서 피가 번졌고 무도회장은 자정과 함께 무너졌다." },
    "홀레 아주머니": { scene: "깊은 우물 아래에서 깃털 이불이 눈처럼 흩날린다. 화덕의 빵과 사과나무가 차례로 도움을 청한다.", choices: ["금이 있는 집부터 찾는다", "빵을 꺼내고 사과를 털어 준다", "이불만 훔쳐 달아난다"], correct: 1, success: "마친 일을 본 노파가 금 대신 오래된 책 한 권을 건넸다.", failure: "검은 역청이 손을 뒤덮었고 책장은 서로 붙어 다시 열리지 않았다." },
    "일곱마리 까마귀": { scene: "유리산 안에서 일곱 까마귀가 빈 접시를 둘러싸고 있다. 문에는 아주 작은 열쇠 구멍만 있고 열쇠는 보이지 않는다.", choices: ["문을 부순다", "반지를 열쇠 대신 넣어 본다", "까마귀에게 먹이를 던진다"], correct: 1, success: "반지가 맞물리자 문이 열리고 일곱 날개 아래 숨겨진 책이 드러났다.", failure: "유리산에 금이 가며 까마귀와 기록이 더 깊은 곳으로 떨어졌다." },
    "빨간 망토": { scene: "침대 위의 그림자가 이불을 끌어당긴다. 목소리는 할머니를 흉내 내지만 문밖의 눈에는 커다란 발자국이 찍혀 있다.", choices: ["가까이 다가가 얼굴을 확인한다", "커튼을 열어 햇빛을 들인다", "문을 잠그고 침대와 거리를 둔다"], correct: 2, success: "이빨을 드러낸 그림자가 창문으로 달아났고 베개 아래에서 책을 찾았다.", failure: "질문을 마치기도 전에 이불 속의 입이 책째로 모든 것을 삼켰다." },
    "브레멘 음악대": { scene: "도둑들이 점거한 오두막을 늙은 동물 넷이 바라본다. 각자의 울음은 작지만 서로의 등을 빌릴 수 있을 만큼 가까이 서 있다.", choices: ["한 마리씩 창문으로 보낸다", "서로의 등에 올라 동시에 소리치게 한다", "도둑과 거래한다"], correct: 1, success: "기묘한 합창에 도둑들이 달아났고 식탁 위에 악보 같은 책이 남았다.", failure: "흩어진 울음은 눈보라에 묻혔고 도둑들이 책을 챙겨 달아났다." },
    "노래하는 뼈": { scene: "다리 밑에서 발견한 뼈피리가 살인자의 이름을 노래하려 한다. 하지만 불면 노래가 아니라 비명이 날 것 같다.", choices: ["피리를 부러뜨린다", "물에 씻은 뒤 조심스럽게 분다", "흙으로 다시 덮는다"], correct: 1, success: "맑아진 음이 진실을 노래했고 강바닥에서 책 한 권이 떠올랐다.", failure: "왜곡된 비명에 다리가 무너져 뼈와 기록이 급류에 휩쓸렸다." },
    "대부가 된 죽음의 신": { scene: "수많은 촛불의 방에서 죽음이 환자의 촛불을 가리킨다. 거의 꺼진 불꽃을 다른 초에 옮길 기회가 한 번뿐이다.", choices: ["몰래 긴 촛불과 바꾼다", "죽음에게 대가를 제안한다", "촛불의 순서를 그대로 둔다"], correct: 2, success: "죽음은 약속을 지킨 자에게 기록을 맡기고 조용히 길을 열었다.", failure: "바꾼 초가 손안에서 꺼지자 방과 책이 완전한 어둠에 잠겼다." },
    "노간주나무": { scene: "노간주나무 위의 새가 금사슬과 맷돌을 내려다보며 같은 노래를 반복한다. 나무뿌리 아래에서는 아이의 목소리가 들린다.", choices: ["새를 잡는다", "노래가 끝날 때까지 듣고 뿌리를 파 본다", "맷돌을 집으로 가져간다"], correct: 1, success: "마지막 노랫말과 함께 나무가 갈라지고 잃어버린 이야기책이 나타났다.", failure: "노래를 끊자 새가 기록을 물고 검은 하늘로 날아갔다." },
    "여섯 마리 백조": { scene: "말없이 가시풀 옷을 짜는 여인 곁에 소매 하나가 완성되지 않은 옷 여섯 벌이 놓여 있다.", choices: ["침묵을 깨고 사정을 묻는다", "남은 소매를 대신 이어 짠다", "가시풀을 불태운다"], correct: 1, success: "마지막 매듭을 묶자 여섯 날개가 흩어지고 그 아래에서 책이 떨어졌다.", failure: "침묵이 깨진 순간 옷들이 깃털이 되어 멀리 날아갔다." },
    "들장미 공주": { scene: "가시덩굴이 잠든 성의 문을 막고 있다. 오래된 시계는 백 년째 마지막 한 칸을 남겨 두고 멈춰 있다.", choices: ["가시를 칼로 벤다", "시계가 마지막 칸을 움직일 때까지 기다린다", "성벽에 불을 놓는다"], correct: 1, success: "정해진 시간이 오자 가시가 꽃으로 변했고 잠든 서고의 문이 열렸다.", failure: "때 이른 침입을 막으려는 가시가 책을 성 안쪽으로 끌고 갔다." },
    "백설공주": { scene: "난쟁이의 집에 사과와 빗, 허리끈이 놓여 있다. 거울 속 여인은 셋 모두 선물이라 말하지만 사과 한쪽만 붉다.", choices: ["붉은 쪽을 잘라 맛본다", "창문을 닫고 선물을 모두 밖에 둔다", "거울에게 가장 아름다운 이를 묻는다"], correct: 1, success: "거울이 갈라지며 그 뒤에 감춰져 있던 책이 모습을 드러냈다.", failure: "선물에 밴 독기가 번지며 책의 글자들이 검게 죽어버렸다." },
    "룸펠슈틸츠헨": { scene: "작은 남자가 짚을 금으로 바꾸며 자신의 이름을 맞히면 계약을 거두겠다고 한다. 불가에는 그의 이름을 흥얼대는 발자국이 남아 있다.", choices: ["황금을 더 요구한다", "노랫말 속 이름을 그대로 부른다", "계약서를 찢는다"], correct: 1, success: "이름을 들은 존재가 땅을 구르다 사라졌고 물레에 책 한 권이 남았다.", failure: "틀린 이름을 비웃는 소리와 함께 금실과 기록이 한꺼번에 풀려버렸다." },
    "황금새": { scene: "황금 사과나무 아래에 화려한 여관과 초라한 여관이 마주 서 있다. 붉은 여우가 초라한 쪽을 가리키며 아무 말 없이 기다린다.", choices: ["화려한 여관에서 정보를 모은다", "여우의 충고대로 초라한 여관에 든다", "여우를 사냥한다"], correct: 1, success: "아침이 되자 여우가 황금 깃털과 함께 책이 있는 길을 알려 주었다.", failure: "밤새 흥청거리는 사이 황금새가 책을 물고 먼 성으로 날아갔다." },
    "황금 거위": { scene: "황금 거위를 붙잡은 사람들이 긴 행렬로 달라붙어 있다. 성의 공주는 어떤 광대에게도 웃지 않았지만 이 광경을 내려다보고 있다.", choices: ["사람들을 억지로 떼어낸다", "행렬을 그대로 성 앞까지 이끈다", "황금 깃털을 뽑는다"], correct: 1, success: "공주의 첫 웃음과 함께 모두가 풀려났고 거위가 책 한 권을 내려놓았다.", failure: "욕심내어 손을 댄 순간 행렬에 붙잡혀 책을 놓치고 말았다." },
    "고양이와 쥐의 공동 생활": { scene: "겨울용 기름 항아리가 제단 아래 숨겨져 있다. 고양이는 세례식에 다녀왔다며 입가의 기름을 핥고, 쥐는 항아리의 양이 줄었다고 속삭인다.", choices: ["고양이의 말을 믿는다", "항아리를 함께 확인하자고 한다", "남은 기름을 혼자 먹는다"], correct: 1, success: "거짓 이름들이 드러나자 고양이가 달아났고 항아리 밑에서 책이 나왔다.", failure: "서로를 의심하는 사이 고양이가 기름과 기록을 모두 삼켰다." },
    "성모 마리아의 아이": { scene: "열세 개의 황금문 중 마지막 문만 잠겨 있다. 손가락에는 이미 금빛 가루가 묻었고, 누군가 문을 열었느냐고 묻는다.", choices: ["끝까지 열지 않았다고 부정한다", "문을 열었다고 고백한다", "열쇠를 몰래 돌려놓는다"], correct: 1, success: "진실을 말하자 잃었던 목소리와 함께 문 뒤의 책이 돌아왔다.", failure: "부정하는 말이 입술에서 얼어붙으며 문과 기록이 하늘로 사라졌다." },
    "충신 요하네스": { scene: "돌이 되어 가는 신하가 왕에게 세 가지 재앙을 경고하려 한다. 진실을 말하면 온몸이 돌이 되지만 침묵하면 왕이 죽는다.", choices: ["왕에게 모든 경고를 전한다", "자신만 살기 위해 침묵한다", "왕을 성 밖으로 쫓아낸다"], correct: 0, success: "마지막 경고와 함께 몸은 돌이 되었지만 손안의 책은 온기를 유지했다.", failure: "경고받지 못한 재앙이 왕과 기록을 한꺼번에 덮쳤다." },
    "떠돌이 악사": { scene: "늑대와 여우와 토끼가 악사의 곁에서 함께 연주하길 기다린다. 악사는 혼자이고 싶다며 세 동물을 함정 쪽으로 유인한다.", choices: ["동물들을 차례로 속인다", "함께 한 곡을 끝까지 연주한다", "악기를 부순다"], correct: 1, success: "네 소리가 화음을 이루자 악기 안에서 접혀 있던 책이 펼쳐졌다.", failure: "깨진 합주가 분노한 울음으로 변하며 책은 발톱 아래 찢어졌다." },
    "오누이": { scene: "사슴이 된 소년이 사냥 나팔을 듣고 문밖으로 나가려 한다. 누이는 문을 열 때 사용할 비밀 문장을 정해 두었다.", choices: ["곧바로 문을 열어 준다", "비밀 문장을 확인한 뒤 문을 연다", "사슴을 사냥꾼에게 넘긴다"], correct: 1, success: "가짜 목소리가 물러가고 사슴의 목걸이에서 책이 풀려 나왔다.", failure: "잘못된 목소리에 문을 열자 사냥꾼의 그림자가 기록을 낚아챘다." },
    "숲 속의 세 난쟁이": { scene: "눈 덮인 숲에서 세 난쟁이가 마지막 빵 한 조각을 바라본다. 소녀의 바구니에도 그것 외에는 아무것도 없다.", choices: ["빵을 혼자 먹는다", "빵을 셋과 나누어 먹는다", "딸기를 찾아오라고 시킨다"], correct: 1, success: "나눈 빵이 네 조각으로 다시 채워졌고 그 아래 책이 놓여 있었다.", failure: "빈 바구니에서 두꺼비 울음만 남고 난쟁이와 책은 사라졌다." },
    "실 잣는 세 여인": { scene: "끝없이 쌓인 아마 앞에 엄지와 입술과 발이 기이한 세 여인이 앉아 있다. 그들은 결혼식에 자신들을 친척으로 불러 달라고 한다.", choices: ["모습이 흉하다며 거절한다", "약속하고 도움을 청한다", "아마 더미에 불을 붙인다"], correct: 1, success: "세 여인이 밤새 실을 끝내고 물레 아래 책을 남겼다.", failure: "약속을 거부하자 실이 뱀처럼 얽혀 책을 끌고 갔다." },
    "하얀 뱀": { scene: "길 위에서 물고기와 개미와 까마귀 새끼가 차례로 도움을 청한다. 멀리서는 세 가지 불가능한 시험을 알리는 종이 울린다.", choices: ["시간을 아끼려 지나친다", "작은 생명들을 하나씩 돕는다", "동물들에게 답을 강요한다"], correct: 1, success: "도움을 받은 동물들이 시험의 답과 함께 책을 가져왔다.", failure: "혼자 시험장에 도착했지만 어떤 목소리도 답을 알려 주지 않았다." },
    "용감한 꼬마 재봉사": { scene: "거인이 허리띠의 ‘한 번에 일곱’을 보고 힘을 증명하라며 돌을 쥐어짠다. 재봉사의 주머니에는 치즈와 작은 새가 있다.", choices: ["진짜 돌을 쥐어짠다", "치즈를 돌처럼 짜고 새를 던진다", "허리띠의 진실을 고백한다"], correct: 1, success: "거인이 겁에 질려 달아나며 보물 사이의 책을 두고 갔다.", failure: "허풍이 무너지자 거인이 재봉사와 책을 숲 밖으로 내던졌다." },
    "수수께끼": { scene: "공주가 여행자의 수수께끼를 맞히려 밤마다 하인을 보낸다. 침대 곁에는 옷자락을 붙잡을 수 있는 단단한 손이 기다린다.", choices: ["정답을 큰 소리로 말한다", "엿들은 자의 겉옷을 증거로 붙잡는다", "새 수수께끼로 바꾼다"], correct: 1, success: "훔친 답의 증거가 드러나자 공주가 약속과 책을 내놓았다.", failure: "정답만 빼앗긴 채 수수께끼와 기록의 주인이 바뀌었다." },
    "손 없는 왕비": { scene: "손을 잃은 여인이 배나무 아래에서 열매를 바라본다. 보이지 않는 울타리는 사람의 손으로는 열리지 않는다고 적혀 있다.", choices: ["울타리를 억지로 부순다", "기도하며 허락을 구한다", "은으로 만든 손을 훔친다"], correct: 1, success: "울타리가 스스로 열리고 가지 끝의 배와 함께 책이 내려왔다.", failure: "허락받지 않은 손길에 나무가 얼어붙으며 기록도 나무껍질 속에 갇혔다." },
    "요술 식탁, 황금 당나귀, 자루 속의 몽둥이": { scene: "여관 주인이 요술 식탁과 황금 당나귀를 바꿔치기했다. 막내의 낡은 자루 안에서는 몽둥이가 명령을 기다린다.", choices: ["여관 주인에게 값을 더 준다", "자루 속 몽둥이에게 나오라고 명한다", "빈손으로 돌아간다"], correct: 1, success: "몽둥이가 훔친 물건과 책까지 모두 되찾아 왔다.", failure: "마지막 보물마저 바꿔치기당해 여관의 비밀방으로 사라졌다." },
    "엄지둥이": { scene: "작은 아이의 목소리가 늑대의 배 속에서 들린다. 늑대는 먹을 것이 많은 집으로 자신을 안내하면 아이를 꺼내 주겠다고 한다.", choices: ["낯선 집으로 안내한다", "자기 집의 창고로 유인해 가족에게 알린다", "배 속에서 조용히 숨는다"], correct: 1, success: "가족이 늑대를 붙잡아 아이와 함께 삼켜진 책을 구해냈다.", failure: "잘못된 길 끝에서 늑대가 기록까지 소화하고 눈밭으로 달아났다." },
    "꼬마 요정": { scene: "가난한 구두장이의 작업대에 밤마다 완성된 구두가 놓인다. 숨어 보니 옷 한 벌 없는 작은 요정 둘이 가죽을 꿰매고 있다.", choices: ["요정들을 붙잡아 일을 시킨다", "작은 옷과 신발을 만들어 둔다", "가죽을 모두 숨긴다"], correct: 1, success: "선물을 입은 요정들이 춤추며 마지막 구두 속에 책을 남겼다.", failure: "고마움을 돌려받지 못한 작은 손들이 작업장과 기록을 영영 떠났다." },
    "강도 사위": { scene: "숲속 집에서 노파가 신부를 큰 통 뒤에 숨긴다. 강도들이 돌아왔고, 금반지가 끼워진 손가락 하나가 숨은 곳으로 굴러온다.", choices: ["즉시 비명을 지른다", "손가락을 증거로 챙겨 조용히 빠져나간다", "강도들과 거래한다"], correct: 1, success: "결혼 잔치에서 증거가 드러나자 강도들이 붙잡히고 책이 반환되었다.", failure: "소리를 들은 강도들이 통을 열었고 증거와 기록은 불길 속에 사라졌다." }
};
const MIDGAME_CRISES = [
    { id: "knocking", title: "문을 두드리는 소리", emotions: ["공포", "희망"], omen: "해가 진 뒤부터 현관 경첩이 일정한 간격으로 떨린다. 눈밭에는 다가온 흔적도, 돌아간 흔적도 없다.", scene: "한밤중, 세 번의 노크가 멈췄다가 정확히 같은 간격으로 다시 시작된다. 문틈 아래에는 사람의 그림자 대신 검은 서리만 번지고 있다.", choices: [{ label: "희망의 불빛을 문밖으로 비춘다", description: "희망 에너지로 안과 밖의 경계를 고정한다.", cost: { 희망: 5 }, result: "화로의 빛이 문틈을 통과하자 노크는 멀어졌다. 아침까지 문은 다시 울리지 않았다." }, { label: "숨을 죽이고 아침까지 기다린다", description: "무엇이든 스스로 떠나기를 바란다.", result: "노크는 새벽까지 이어졌다. 문 너머의 공포가 잠든 사이 집 안으로 스며들었다.", effect: { health: -28, warmth: -20 } }] },
    { id: "visitor", title: "얼어붙은 방문객", emotions: ["애착", "희망"], omen: "현관 앞 눈더미에서 희미한 체온이 감지된다. 바람 사이로 누군가 이를 부딪치는 소리가 들린다.", scene: "문밖에 한 사람이 거의 얼어붙은 채 쓰러져 있다. 눈을 뜨지는 못하지만 품에는 오래된 가족사진을 꼭 쥐고 있다.", choices: [{ label: "애착의 온기로 살려낸다", description: "애착 4와 희망 3을 사용해 체온을 되돌린다.", cost: { 애착: 4, 희망: 3 }, result: "낯선 이는 새벽에 눈을 떴다. 떠나기 전 식량과 아직 사람이 남은 장소의 지도를 건넸다.", effect: { food: 3 } }, { label: "문을 열지 않는다", description: "거점의 자원을 지키지만 방문객을 포기한다.", result: "아침이 되자 문앞에는 사진만 남았다. 그날 이후 화로의 온기가 좀처럼 몸에 닿지 않는다.", effect: { health: -22, warmth: -25 } }] },
    { id: "blank-book", title: "빈 책", emotions: ["불안", "공포"], omen: "서가 목록에 등록하지 않은 일련번호가 나타났다. 번호 뒤에는 사흘 후의 날짜만 적혀 있다.", scene: "처음 보는 흰 책이 서가 한가운데 꽂혀 있다. 마지막 장에는 오늘 날짜와 아직 일어나지 않은 주인공의 부상이 기록되어 있다.", choices: [{ label: "불안 에너지로 다음 문장을 읽는다", description: "불안 5를 사용해 기록의 가능성을 분리한다.", cost: { 불안: 5 }, result: "문장은 확정된 미래가 아니라 경고였음이 드러났다. 페이지를 찢자 예정된 상처도 사라졌다." }, { label: "책을 덮어 원래 자리에 둔다", description: "기록이 스스로 사라지기를 기다린다.", result: "밤사이 마지막 문장이 완성되었다. 기록된 상처가 몸 위에 그대로 나타났다.", effect: { health: -32 } }] },
    { id: "whispers", title: "책들의 속삭임", emotions: ["공포", "슬픔"], omen: "서로 다른 책에서 같은 문장 조각이 발견된다. 읽을 때마다 목소리의 수가 하나씩 늘어난다.", scene: "자정이 되자 모든 서가가 한 문장을 동시에 중얼거린다. ‘우리를 기억하지 못한다면, 너도 기록에서 지워질 것이다.’", choices: [{ label: "슬픔을 받아들여 목소리를 듣는다", description: "슬픔 6을 소모해 잊힌 결말들을 애도한다.", cost: { 슬픔: 6 }, result: "끝까지 들어 준 뒤 속삭임은 각자의 이야기로 돌아갔다. 서가는 다시 고요해졌다." }, { label: "책들을 강제로 격리한다", description: "목소리가 새어 나오지 못하게 서가를 봉쇄한다.", result: "억눌린 감정이 한꺼번에 폭발했다. 책 한 권이 완전히 백지가 되고 충격이 몸을 덮쳤다.", effect: { health: -20, loseBook: true } }] },
    { id: "forgotten", title: "잊힌 제목", emotions: ["슬픔", "애착"], omen: "도감의 한 칸이 비어 있는데 전체 권수는 줄지 않았다. 빈 칸을 오래 보면 누군가의 이름이 떠오를 듯하다.", scene: "책 한 권의 제목과 내용이 사라졌다. 손에 든 무게와 낡은 모서리는 익숙하지만 무엇을 지키려 했는지조차 기억나지 않는다.", choices: [{ label: "애착으로 남은 흔적을 붙잡는다", description: "애착 6을 사용해 책과 맺은 기억을 복원한다.", cost: { 애착: 6 }, result: "손때와 접힌 자국에서 문장들이 되살아났다. 제목이 다시 책등에 새겨졌다." }, { label: "빈 책으로 분류한다", description: "알 수 없는 기록을 포기하고 자리를 비운다.", result: "책은 가벼운 재가 되어 사라졌다. 보존했던 이야기 한 권을 영구히 잃었다.", effect: { loseBook: true } }] },
    { id: "unburnable", title: "불타지 않는 책", emotions: ["공포", "슬픔"], omen: "땔감 더미가 평소보다 빠르게 줄어든다. 불꽃은 특정 서가를 향할 때마다 푸르게 식는다.", scene: "거대한 한파가 닥친 밤, 화로에 넣은 책이 타지 않는다. 오히려 불꽃을 삼키며 방 안의 온도를 빠르게 낮춘다.", choices: [{ label: "공포 에너지로 책을 봉인한다", description: "공포 5를 소모해 책이 화로를 인식하지 못하게 한다.", cost: { 공포: 5 }, result: "검은 표지가 닫히자 불꽃이 다시 붉어졌다. 남은 밤은 간신히 버틸 수 있었다." }, { label: "땔감을 더 쏟아붓는다", description: "일반 자원으로 책의 냉기를 밀어낸다.", result: "불은 살아났지만 비축한 땔감을 막대하게 소모했고 몸에도 냉기가 남았다.", effect: { firewood: -6, health: -18, warmth: -30 } }] },
    { id: "second-plate", title: "식탁의 두 번째 접시", emotions: ["불안", "공포"], omen: "밤마다 식탁 의자가 조금씩 뒤로 빠져 있다. 식량 장부와 실제 재고가 맞지 않기 시작한다.", scene: "아침 식탁에 사용한 흔적이 있는 접시가 하나 더 놓여 있다. 따뜻한 국물 자국 옆에는 주인공의 필체로 ‘잘 먹었다’고 쓰여 있다.", choices: [{ label: "불안의 흐름을 따라 침입자를 찾는다", description: "불안 4를 사용해 사라진 식량의 감정 흔적을 추적한다.", cost: { 불안: 4 }, result: "흔적은 벽 속 작은 틈에서 끝났다. 틈을 봉하자 두 번째 식사는 더 나타나지 않았다." }, { label: "접시 하나를 계속 차려 둔다", description: "정체를 확인하지 않은 채 공존을 택한다.", result: "매일 접시가 깨끗이 비워졌다. 보름치에 가까운 식량이 빠르게 사라졌다.", effect: { food: -5 } }] },
    { id: "distant-light", title: "눈 속의 불빛", emotions: ["희망", "불안"], omen: "서쪽 폐허에서 밤마다 같은 간격으로 빛이 깜박인다. 우연이라기에는 지나치게 규칙적이다.", scene: "폭설 너머의 불빛이 오늘은 집 가까이까지 다가왔다. 구조 신호처럼 보이지만 빛 아래에는 사람의 그림자가 없다.", choices: [{ label: "희망을 신호로 되돌려 보낸다", description: "희망 5를 소모해 살아 있는 자만 알아볼 빛을 보낸다.", cost: { 희망: 5 }, result: "진짜 생존자들이 응답했다. 그들은 구조 물자 일부를 문앞에 남기고 떠났다.", effect: { food: 4, firewood: 3 } }, { label: "직접 불빛을 따라간다", description: "준비 없이 정체를 확인하러 나선다.", result: "불빛은 얼음 틈 위에 놓인 미끼였다. 추락을 피했지만 심한 부상을 입었다.", effect: { health: -35 } }] },
    { id: "book-burners", title: "책을 태우는 생존자들", emotions: ["분노", "슬픔"], omen: "바람을 타고 탄 종이 냄새와 읽을 수 없는 문장 조각이 날아온다. 검은 연기는 사흘째 같은 곳에서 오른다.", scene: "다른 생존자들이 책을 난방용으로 태우고 있다. 불길 속 표지들은 도감에서 비어 있는 제목들과 닮아 있다.", choices: [{ label: "분노를 힘으로 바꿔 책을 빼앗는다", description: "분노 6을 소모해 무리를 물러나게 한다.", cost: { 분노: 6 }, result: "감정이 터져 나오자 생존자들은 책을 내려놓고 달아났다. 불길에서 몇 권과 땔감을 건졌다.", effect: { firewood: 2 } }, { label: "그들에게서 땔감을 거래한다", description: "이야기보다 당장의 생존을 택한다.", result: "따뜻한 밤을 얻었지만 타는 문장을 바라본 대가가 오래 남았다.", effect: { firewood: 5, health: -24 } }] },
    { id: "longest-night", title: "가장 긴 밤", emotions: ["공포", "희망"], omen: "해 뜨는 시각이 매일 조금씩 늦어진다. 시계는 정상인데 새벽의 푸른빛만 오지 않는다.", scene: "해가 떠야 할 시간이 한참 지났지만 하늘은 완전히 검다. 기온은 계속 내려가고 화로의 불꽃도 그림자를 만들지 못한다.", choices: [{ label: "희망으로 인공의 새벽을 밝힌다", description: "희망 8을 사용해 집 안에 아침의 기억을 재현한다.", cost: { 희망: 8 }, result: "가짜 새벽을 따라 시간이 다시 움직였다. 창밖에도 마침내 흐린 빛이 번졌다." }, { label: "남은 연료로 밤을 버틴다", description: "밤이 끝날 때까지 화로에 모든 것을 건다.", result: "아침은 돌아왔지만 땔감과 체온 대부분을 잃었다.", effect: { firewood: -8, health: -30, warmth: -45 } }] },
    { id: "shelf-revolt", title: "서가의 반란", emotions: ["공포", "분노", "슬픔"], omen: "서로 다른 이야기의 문장이 한 페이지에 뒤섞인다. 방을 지날 때마다 배경과 가구의 위치가 잠깐씩 달라진다.", scene: "자정, 집 전체가 서른다섯 이야기의 무대로 갈라진다. 늑대와 가시덤불, 황금실과 검은 바다가 동시에 서가 밖으로 쏟아진다.", choices: [{ label: "세 감정을 균형 있게 방출한다", description: "공포·분노·슬픔을 각각 4씩 사용해 이야기의 경계를 복원한다.", cost: { 공포: 4, 분노: 4, 슬픔: 4 }, result: "각 감정이 자신의 책으로 돌아가며 집이 원래 형태를 되찾았다." }, { label: "서가를 물리적으로 봉쇄한다", description: "문과 책장을 묶어 폭주가 끝나기를 기다린다.", result: "아침까지 집이 뒤틀렸다. 책 한 권이 유실되고 시설과 몸이 크게 손상됐다.", effect: { loseBook: true, health: -32, firewood: -5, warmth: -25 } }] },
    { id: "last-ember", title: "마지막 불씨", emotions: ["희망", "애착", "분노"], omen: "화로의 재 속에서 살아 있는 불씨가 하나씩 사라진다. 어떤 땔감을 넣어도 불꽃이 전보다 작다.", scene: "거대한 한파가 집을 눌러 화로의 마지막 불씨가 꺼져 간다. 밤을 넘기려면 저장한 감정이나 생존 자원 중 하나를 크게 희생해야 한다.", choices: [{ label: "모든 감정의 일부를 불씨에 건넨다", description: "여섯 감정 에너지를 각각 3씩 소모한다.", cost: { 희망: 3, 불안: 3, 공포: 3, 슬픔: 3, 분노: 3, 애착: 3 }, result: "여섯 빛이 하나의 불꽃으로 합쳐졌다. 화로는 이전보다 강하게 타올랐다.", effect: { warmth: 35 } }, { label: "가구와 비축물을 태운다", description: "감정 대신 집의 실물 자원을 희생한다.", result: "밤은 넘겼지만 서고 일부와 비축 자원이 잿더미가 되었다.", effect: { firewood: -8, food: -4, health: -20 } }] }
];
function catalogBook(index) { const title = CATALOG_TITLES[index]; return { id: `khm-${index + 1}`, title, emotion: EMOTIONS[index % EMOTIONS.length], description: OBSERVATIONS[title] || `이 기록에는 ${title}라 불린 사건의 흔적이 남아 있다. 아직 모든 문장을 해독하지 못했지만, 등장인물들이 끝까지 놓지 못한 감정이 종이 깊숙이 얼어붙어 있다.`, energy: 1 + (index % 4), risk: 1 + (index % 3), contained: true }; }
const emptyEmotionEnergy = () => ({ 희망: 0, 불안: 0, 공포: 0, 슬픔: 0, 분노: 0, 애착: 0 });
function createCrisisState(day = 15) { return { nextDay: day, eventId: MIDGAME_CRISES[Math.floor(Math.random() * MIDGAME_CRISES.length)].id, warned: false }; }
const initialState = () => { const firstBook = catalogBook(0); firstBook.shelfId = 0; return { day: 1, health: 100, food: 8, firewood: 7, energy: 3, emotionEnergy: Object.assign(Object.assign({}, emptyEmotionEnergy()), { 희망: 3 }), warmth: 68, houseLevel: 1, shelves: 1, shelfRooms: [1], books: [firstBook], discoveredBookIds: [firstBook.id], tools: [], crisis: createCrisisState() }; };
let state = null;
const app = document.querySelector("#app");
let characterX = 360;
let cameraX = 0;
let selectedRoom = 0;
let selectedCatalogIndex = 0;
let booksView = "shelves";
let selectedBookShelfId = 0;
let prepFood = 1;
let prepWood = 1;
let prepBookIds = [];
let prepToolIds = [];
let expedition = null;
function saveGame() { if (state)
    localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function loadGame() { const raw = localStorage.getItem(SAVE_KEY); if (!raw)
    return null; try {
    const saved = JSON.parse(raw);
    if (!saved.books.some(book => book.id.startsWith("khm-")))
        saved.books = [catalogBook(0)];
    if (!saved.emotionEnergy)
        saved.emotionEnergy = Object.assign(Object.assign({}, emptyEmotionEnergy()), { 희망: saved.energy || 0 });
    if (!saved.shelfRooms || saved.shelfRooms.length !== saved.shelves)
        saved.shelfRooms = Array.from({ length: saved.shelves }, (_, index) => 1 + Math.floor(index / 2));
    saved.books.forEach((book, index) => { if (typeof book.shelfId !== "number" || book.shelfId >= saved.shelves)
        book.shelfId = Math.min(saved.shelves - 1, Math.floor(index / 4)); });
    if (!Array.isArray(saved.tools))
        saved.tools = [];
    if (typeof saved.health !== "number")
        saved.health = 100;
    if (!saved.crisis)
        saved.crisis = createCrisisState(Math.max(15, Math.ceil((saved.day + 1) / 15) * 15));
    saved.energy = EMOTIONS.reduce((sum, emotion) => sum + (saved.emotionEnergy[emotion] || 0), 0);
    return saved;
}
catch (_a) {
    localStorage.removeItem(SAVE_KEY);
    return null;
} }
function svg(name) { const paths = { book: '<path d="M5 4.5A3.5 3.5 0 0 1 8.5 1H19v18H8.5A3.5 3.5 0 0 0 5 22.5z"/><path d="M5 4.5A3.5 3.5 0 0 0 1.5 1H1v18h.5A3.5 3.5 0 0 1 5 22.5"/>', fire: '<path d="M13 22c4-1 7-4 7-8 0-3-2-6-5-8 0 3-1 5-3 6 0-5-2-8-5-11 0 5-4 8-4 13 0 4 3 7 7 8-2-2-2-5 1-7 0 3 3 4 2 7z"/>', food: '<path d="M4 11h16c0 6-3 10-8 10s-8-4-8-10z"/><path d="M7 7c0-2 1-3 2-4m4 4c0-2 1-3 2-4"/>', home: '<path d="m2 11 10-9 10 9"/><path d="M5 9v12h14V9M9 21v-7h6v7"/>', snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 3 3-3M9 20l3-3 3 3"/>' }; return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`; }
function toast(message) { const el = document.createElement("div"); el.className = "toast"; el.textContent = message; document.body.append(el); window.setTimeout(() => el.remove(), 2200); }
function renderMenu() {
    var _a, _b, _c;
    const hasSave = Boolean(loadGame());
    app.innerHTML = `<main class="menu-screen"><div class="snow-layer"></div><section class="title-block"><p class="eyebrow">THE LAST SHELTER ARCHIVE</p><h1>겨울의<br><span>도서관</span></h1><p class="subtitle">이야기가 사라지면, 온기도 사라진다.</p></section><nav class="menu-panel"><button class="primary" data-action="new">새 게임 <span>처음부터 이야기를 시작합니다</span></button><button data-action="continue" ${hasSave ? "" : "disabled"}>이어서 플레이 <span>${hasSave ? "마지막으로 머문 밤부터" : "저장된 기록이 없습니다"}</span></button><button data-action="reset" ${hasSave ? "" : "disabled"}>데이터 초기화 <span>모든 기록을 지웁니다</span></button></nav><p class="menu-foot">얼어붙은 세계의 작은 피난처</p></main>`;
    (_a = app.querySelector('[data-action="new"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => { if (hasSave && !confirm("기존 기록을 덮어쓰고 새 게임을 시작할까요?"))
        return; state = initialState(); saveGame(); renderHouse(); });
    (_b = app.querySelector('[data-action="continue"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { state = loadGame(); if (state)
        renderHouse(); });
    (_c = app.querySelector('[data-action="reset"]')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => { if (!confirm("저장된 모든 기록을 지울까요?"))
        return; localStorage.removeItem(SAVE_KEY); renderMenu(); });
}
function renderHouse() {
    if (!state)
        return renderMenu();
    return renderInteractiveHouse();
    /* Legacy dashboard kept temporarily while the spatial house is evaluated. */
    if (state) {
        // @ts-ignore Unreachable legacy renderer retained for quick A/B comparison.
        if (!state)
            return renderMenu();
        const capacity = state.shelves * 4;
        const production = state.books.filter(b => b.contained).reduce((n, b) => n + b.energy, 0);
        const houseName = state.houseLevel === 1 ? "작은 겨울집" : state.houseLevel === 2 ? "확장된 서고" : "이야기의 도서관";
        // @ts-ignore Unreachable legacy renderer retained for quick A/B comparison.
        app.innerHTML = `<main class="game-screen"><header class="topbar"><button class="brand" data-action="menu">${svg("book")}<span>겨울의 도서관<small>WINTER LIBRARY</small></span></button><div class="day"><span>생존 기록</span><strong>제 ${state.day}일</strong></div><div class="weather">${svg("snow")}<span>폭설<small>외부 기온 -31°C</small></span></div></header><section class="resource-bar"><div>${svg("food")}<span>식량<small>하루 1 소모</small></span><strong>${state.food}</strong></div><div>${svg("fire")}<span>땔감<small>오늘 밤 2 필요</small></span><strong>${state.firewood}</strong></div><div>${svg("book")}<span>감정 에너지<small>하루 +${production} 생산</small></span><strong>${state.energy}</strong></div><div class="warmth"><span>실내 온기</span><strong>${state.warmth}%</strong><i><b style="width:${state.warmth}%"></b></i></div></section><section class="house-view"><div class="house-copy"><p class="eyebrow">당신의 피난처 · 규모 ${state.houseLevel}</p><h2>${houseName}</h2><p>바깥에서는 눈보라가 벽을 긁고 있습니다.<br>화로의 불빛만이 아직 이곳을 살아 있게 합니다.</p></div><div class="room"><div class="window"><span></span><span></span><span></span><span></span></div><div class="shelf shelf-one"><i></i><i></i><i></i><i></i></div>${state.shelves > 1 ? '<div class="shelf shelf-two"><i></i><i></i><i></i></div>' : ""}${state.shelves > 2 ? '<div class="shelf shelf-three"><i></i><i></i><i></i></div>' : ""}<div class="fireplace"><div class="flame"></div></div><div class="desk"><span></span></div></div></section><section class="action-grid"><button data-action="books"><span class="action-icon">${svg("book")}</span><span><strong>책 관리</strong><small>${state.books.length}권 보관 중 · 수용량 ${state.books.length}/${capacity}</small></span><em>열기</em></button><button data-action="shelf"><span class="action-icon">${svg("book")}</span><span><strong>책장 추가</strong><small>책 4권을 더 보관할 수 있습니다</small></span><em>땔감 ${3 + state.shelves}</em></button><button data-action="expand"><span class="action-icon">${svg("home")}</span><span><strong>집 증축</strong><small>새 공간과 책장 한 칸을 확보합니다</small></span><em>땔감 ${7 + state.houseLevel * 3}</em></button><button class="disabled-feature" disabled><span class="action-icon">${svg("snow")}</span><span><strong>탐사 준비</strong><small>눈보라 너머의 기록을 찾습니다</small></span><em>준비 중</em></button></section><footer class="day-footer"><p><strong>오늘 밤</strong> 식량 1과 땔감 2가 필요합니다.</p><button data-action="next">하루를 마친다 <span>→</span></button></footer></main>`;
        bindHouseActions();
    }
}
function furnaceReach() { return state ? 2 + Math.floor(state.energy / 7) : 2; }
function bookShelfRoom(book) { var _a, _b; return (_b = state === null || state === void 0 ? void 0 : state.shelfRooms[(_a = book.shelfId) !== null && _a !== void 0 ? _a : 0]) !== null && _b !== void 0 ? _b : 1; }
function bookIsPowered(book) { return book.contained && bookShelfRoom(book) < furnaceReach(); }
function shelfLabel(shelfId) { var _a; if (!state)
    return `책장 ${shelfId + 1}`; const room = (_a = state.shelfRooms[shelfId]) !== null && _a !== void 0 ? _a : 1; const order = state.shelfRooms.slice(0, shelfId + 1).filter(value => value === room).length; return `${room === 1 ? "첫 번째 서고" : `${room}번째 서고`} · 책장 ${order}`; }
function firstAvailableShelf(pending = []) { if (!state)
    return -1; for (let shelfId = 0; shelfId < state.shelves; shelfId++) {
    const used = [...state.books, ...pending].filter(book => { var _a; return ((_a = book.shelfId) !== null && _a !== void 0 ? _a : 0) === shelfId; }).length;
    if (used < 4)
        return shelfId;
} return -1; }
function activeShelfSynergies() {
    if (!state)
        return [];
    const candidates = new Map();
    for (let shelfId = 0; shelfId < state.shelves; shelfId++) {
        const books = state.books.filter(book => { var _a; return ((_a = book.shelfId) !== null && _a !== void 0 ? _a : 0) === shelfId && bookIsPowered(book); });
        const counts = new Map();
        books.forEach(book => (BOOK_TAGS[book.title] || []).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1)));
        counts.forEach((count, tag) => { if (count < 2)
            return; const bonus = count >= 4 ? 4 : count === 3 ? 2 : 1; const synergy = { tag, shelfId, count, bonus, emotion: SYNERGY_EMOTIONS[tag] }; const list = candidates.get(tag) || []; list.push(synergy); candidates.set(tag, list); });
    }
    return [...candidates.values()].map(entries => entries.sort((a, b) => b.count - a.count || a.shelfId - b.shelfId)[0]);
}
function synergiesForShelf(shelfId) { return activeShelfSynergies().filter(synergy => synergy.shelfId === shelfId); }
function shelfSynergyCandidates(shelfId) {
    if (!state)
        return [];
    const counts = new Map();
    state.books.filter(book => { var _a; return ((_a = book.shelfId) !== null && _a !== void 0 ? _a : 0) === shelfId && bookIsPowered(book); }).forEach(book => (BOOK_TAGS[book.title] || []).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return [...counts.entries()].filter(([, count]) => count >= 2).map(([tag, count]) => ({ tag, shelfId, count, bonus: count >= 4 ? 4 : count === 3 ? 2 : 1, emotion: SYNERGY_EMOTIONS[tag] }));
}
function emotionProduction() {
    const production = emptyEmotionEnergy();
    if (!state)
        return production;
    state.books.filter(bookIsPowered).forEach(book => production[book.emotion] += book.energy);
    activeShelfSynergies().forEach(synergy => production[synergy.emotion] += synergy.bonus);
    return production;
}
function renderInteractiveHouse() {
    if (!state)
        return renderMenu();
    ensureDiscoveryHistory();
    if (state.health <= 0)
        return renderGameOver("이 피난처의 마지막 생존 기록은 여기에서 끝났다.");
    if (state.crisis.nextDay <= 90 && state.day >= state.crisis.nextDay)
        return renderMidgameCrisis();
    if (state.crisis.nextDay <= 90 && state.day >= state.crisis.nextDay - 3 && !state.crisis.warned)
        return renderCrisisWarning();
    const productionMap = emotionProduction();
    const production = EMOTIONS.reduce((sum, emotion) => sum + productionMap[emotion], 0);
    const crisisLocked = state.crisis.warned && state.day < state.crisis.nextDay;
    const rooms = Math.max(2, state.houseLevel + 1, Math.max(1, ...state.shelfRooms) + 1);
    const activeRoomCount = Math.min(rooms, furnaceReach());
    const worldWidth = rooms * 720;
    const roomShelfCounts = new Map();
    const shelfPositions = state.shelfRooms.map(room => { const slot = roomShelfCounts.get(room) || 0; roomShelfCounts.set(room, slot + 1); return room * 720 + 135 + slot * 285; });
    const selectedRoomShelfCount = state.shelfRooms.filter(room => room === selectedRoom).length;
    app.innerHTML = `<main class="game-screen spatial-screen">
    <header class="topbar spatial-top"><button class="brand" data-action="menu">${svg("book")}<span>겨울의 도서관<small>WINTER LIBRARY</small></span></button><div class="day"><span>생존 기록</span><strong>제 ${state.day}일</strong></div><div class="compact-resources"><span class="health-resource">♥ 체력 <b>${state.health}</b></span><span>${svg("food")} 식량 <b>${state.food}</b></span><span>${svg("fire")} 땔감 <b>${state.firewood}</b></span><span>${svg("book")} 화로 범위 <b>${furnaceReach()}방</b></span></div></header>
    <section class="house-hud"><div><p class="eyebrow">YOUR SHELTER · 규모 ${state.houseLevel}</p><h2>집 안을 둘러보세요</h2><p>마우스로 드래그하거나 바닥을 클릭해 이동할 수 있습니다.</p></div><div class="house-hud-actions"><button class="catalog-button" data-action="catalog">${svg("book")} 책 도감 <span>${state.books.length}/${CATALOG_TITLES.length}</span></button><button data-action="next">제 ${state.day}일을 마친다 <span>→</span></button></div></section>
    <section class="house-viewport" aria-label="집 내부"><div class="drag-hint">↔ 드래그하여 둘러보기</div><div class="house-world" style="width:${worldWidth}px;transform:translateX(${-cameraX}px)">
      ${Array.from({ length: rooms }, (_, index) => `<button class="room-zone ${selectedRoom === index ? "selected" : ""}" data-room="${index}" style="left:${index * 720}px;width:720px"><span>${index === 0 ? "화롯방" : index === 1 ? "서고" : `빈 방 ${index}`} · ${index < activeRoomCount ? "에너지 공급 중" : "에너지 단절"}</span></button><div class="room-space room-${index} ${index < activeRoomCount ? "energized" : "unpowered"}" style="left:${index * 720}px;width:720px"><div class="wall-lines"></div>${index === 0 ? '<div class="big-window"><i></i><i></i><i></i><i></i></div><div class="hearth"><div class="flame"></div></div><div class="table-prop"></div><div class="exit-door"><span>밖으로</span></div>' : '<div class="frost-window"></div><div class="crate-prop"></div>'}</div>`).join("")}
      <div class="energy-conduit" style="width:${activeRoomCount * 720}px"><i></i></div>
      ${shelfPositions.map((x, index) => { var _a; const powered = ((_a = state.shelfRooms[index]) !== null && _a !== void 0 ? _a : 1) < activeRoomCount; const resonances = synergiesForShelf(index); const label = resonances.length ? ` · ${resonances.map(synergy => `${synergy.tag}×${synergy.count}`).join("+")}` : ""; return `<div class="world-shelf ${powered ? "powered" : "unpowered"} ${resonances.length ? "resonating" : ""}" style="left:${x}px" data-shelf="${index}"><div class="shelf-books"></div><span>책장 ${index + 1} · ${powered ? "활성" : "비활성"}${label}</span></div>`; }).join("")}
      <div class="character" style="left:${characterX}px"><div class="character-head"></div><div class="character-body"></div><div class="character-shadow"></div></div>
      <div class="floor-line"></div>
    </div></section>
    <div class="proximity-prompt book-prompt" hidden><span>책장 가까이에 있습니다</span><button data-action="books">책장 보기 <kbd>E</kbd></button></div><div class="proximity-prompt hearth-prompt" hidden><span>화로에서 감정이 타오릅니다</span><button data-action="energy-flow">에너지 흐름 보기 <kbd>E</kbd></button></div><div class="proximity-prompt door-prompt" hidden><span>${crisisLocked ? `위기가 제 ${state.crisis.nextDay}일에 다가옵니다` : "문밖에는 눈보라가 몰아칩니다"}</span><button data-action="prepare" ${crisisLocked ? "disabled" : ""}>${crisisLocked ? "탐사 불가" : "탐사 준비"} <kbd>E</kbd></button></div>
    <aside class="room-panel"><button class="close-room" aria-label="선택 해제">×</button><p class="eyebrow">선택한 공간</p><h3>${selectedRoom === 0 ? "화롯방" : selectedRoom === 1 ? "서고" : `빈 방 ${selectedRoom}`}</h3><p>${selectedRoom === 0 ? "화로가 집 전체에 온기를 보냅니다." : `이 공간에는 책장이 ${selectedRoomShelfCount}/2개 배치되어 있습니다.`}</p><button data-action="shelf" ${selectedRoom === 0 || selectedRoomShelfCount >= 2 ? "disabled" : ""}>${svg("book")}<span><strong>책장 추가</strong><small>${selectedRoom === 0 ? "서고에만 배치할 수 있습니다" : selectedRoomShelfCount >= 2 ? "이 방의 책장 한도에 도달했습니다" : `이 방 ${selectedRoomShelfCount}/2 · 수용량 +4`}</small></span><em>땔감 ${3 + state.shelves}</em></button><button data-action="expand">${svg("home")}<span><strong>집 증축</strong><small>새로운 방 추가</small></span><em>땔감 ${7 + state.houseLevel * 3}</em></button></aside>
    <div class="spatial-status"><span>실내 온기 <b>${state.warmth}%</b></span><i><b style="width:${state.warmth}%"></b></i><span>책 ${state.books.length}/${state.shelves * 4}</span><span>일일 생산 +${production}</span><span>화로 도달 <b>${activeRoomCount}/${rooms}개 방</b></span><span>다음 확장까지 <b>${7 - state.energy % 7} 에너지</b></span></div>
  </main>`;
    bindSpatialActions(worldWidth, shelfPositions);
}
function bindSpatialActions(worldWidth, shelfPositions) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const viewport = app.querySelector(".house-viewport");
    const world = app.querySelector(".house-world");
    const character = app.querySelector(".character");
    const prompt = app.querySelector(".book-prompt");
    const hearthPrompt = app.querySelector(".hearth-prompt");
    const doorPrompt = app.querySelector(".door-prompt");
    const panel = app.querySelector(".room-panel");
    let startPointerX = 0;
    let startCamera = cameraX;
    let dragged = false;
    const maxCamera = () => Math.max(0, worldWidth - viewport.clientWidth);
    const paint = () => { cameraX = Math.max(0, Math.min(maxCamera(), cameraX)); world.style.transform = `translateX(${-cameraX}px)`; character.style.left = `${characterX}px`; const nearDoor = Math.abs(characterX - 588) < 80; const nearHearth = !nearDoor && Math.abs(characterX - 458) < 92; const nearShelf = !nearDoor && !nearHearth && shelfPositions.some(x => Math.abs(characterX - (x + 65)) < 115); prompt.hidden = !nearShelf; hearthPrompt.hidden = !nearHearth; doorPrompt.hidden = !nearDoor; };
    viewport.addEventListener("pointerdown", event => { if (event.target.closest(".room-zone"))
        return; startPointerX = event.clientX; startCamera = cameraX; dragged = false; viewport.setPointerCapture(event.pointerId); });
    viewport.addEventListener("pointermove", event => { if (!viewport.hasPointerCapture(event.pointerId))
        return; const delta = event.clientX - startPointerX; if (Math.abs(delta) > 5)
        dragged = true; cameraX = startCamera - delta; paint(); });
    viewport.addEventListener("pointerup", event => { if (!dragged) {
        const rect = viewport.getBoundingClientRect();
        characterX = Math.max(55, Math.min(worldWidth - 55, cameraX + event.clientX - rect.left));
        character.classList.add("walking");
        window.setTimeout(() => character.classList.remove("walking"), 550);
        paint();
    } });
    app.querySelectorAll("[data-room]").forEach(room => room.addEventListener("click", () => { selectedRoom = Number(room.dataset.room); const count = state.shelfRooms.filter(shelfRoom => shelfRoom === selectedRoom).length; app.querySelectorAll(".room-zone").forEach(el => el.classList.remove("selected")); room.classList.add("selected"); panel.classList.add("open"); panel.querySelector("h3").textContent = selectedRoom === 0 ? "화롯방" : selectedRoom === 1 ? "서고" : `빈 방 ${selectedRoom}`; panel.querySelector("h3 + p").textContent = selectedRoom === 0 ? "화로가 집 전체에 온기를 보냅니다." : `이 공간에는 책장이 ${count}/2개 배치되어 있습니다.`; const shelfButton = panel.querySelector('[data-action="shelf"]'); shelfButton.disabled = selectedRoom === 0 || count >= 2; shelfButton.querySelector("small").textContent = selectedRoom === 0 ? "서고에만 배치할 수 있습니다" : count >= 2 ? "이 방의 책장 한도에 도달했습니다" : `이 방 ${count}/2 · 수용량 +4`; }));
    (_a = app.querySelector(".close-room")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => panel.classList.remove("open"));
    (_b = app.querySelector('[data-action="menu"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", renderMenu);
    (_c = app.querySelector('[data-action="books"]')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", renderBooks);
    (_d = app.querySelector('[data-action="catalog"]')) === null || _d === void 0 ? void 0 : _d.addEventListener("click", renderCatalog);
    (_e = app.querySelector('[data-action="prepare"]')) === null || _e === void 0 ? void 0 : _e.addEventListener("click", renderExpeditionPrep);
    (_f = app.querySelector('[data-action="energy-flow"]')) === null || _f === void 0 ? void 0 : _f.addEventListener("click", renderEnergyFlow);
    (_g = app.querySelector('[data-action="next"]')) === null || _g === void 0 ? void 0 : _g.addEventListener("click", endDay);
    (_h = app.querySelector('[data-action="shelf"]')) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => { if (!state)
        return; if (selectedRoom === 0)
        return toast("책장은 서고에만 놓을 수 있습니다."); if (state.shelfRooms.filter(room => room === selectedRoom).length >= 2)
        return toast("한 방에는 책장을 두 개까지만 놓을 수 있습니다."); const cost = 3 + state.shelves; if (state.firewood < cost)
        return toast(`땔감이 ${cost - state.firewood}만큼 부족합니다.`); state.firewood -= cost; state.shelves++; state.shelfRooms.push(selectedRoom); saveGame(); renderInteractiveHouse(); toast("선택한 서고에 새 책장을 놓았습니다."); });
    (_j = app.querySelector('[data-action="expand"]')) === null || _j === void 0 ? void 0 : _j.addEventListener("click", () => { if (!state)
        return; const cost = 7 + state.houseLevel * 3; if (state.firewood < cost)
        return toast(`땔감이 ${cost - state.firewood}만큼 부족합니다.`); state.firewood -= cost; state.houseLevel++; saveGame(); renderInteractiveHouse(); toast("집 끝에 빈 방이 생겼습니다. 책장은 별도로 설치해야 합니다."); });
    window.onkeydown = event => { if (event.key.toLowerCase() === "e") {
        if (!doorPrompt.hidden && !(state.crisis.warned && state.day < state.crisis.nextDay))
            return renderExpeditionPrep();
        if (!hearthPrompt.hidden)
            return renderEnergyFlow();
        if (!prompt.hidden)
            return renderBooks();
    } if (["a", "arrowleft", "d", "arrowright"].includes(event.key.toLowerCase())) {
        const direction = ["a", "arrowleft"].includes(event.key.toLowerCase()) ? -1 : 1;
        characterX = Math.max(55, Math.min(worldWidth - 55, characterX + direction * 45));
        cameraX = characterX - viewport.clientWidth / 2;
        paint();
    } };
    paint();
}
function bindHouseActions() {
    var _a, _b, _c, _d, _e;
    (_a = app.querySelector('[data-action="menu"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderMenu);
    (_b = app.querySelector('[data-action="books"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", renderBooks);
    (_c = app.querySelector('[data-action="shelf"]')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => { if (!state)
        return; const cost = 3 + state.shelves; if (state.firewood < cost)
        return toast(`땔감이 ${cost - state.firewood}만큼 부족합니다.`); state.firewood -= cost; state.shelves++; saveGame(); renderHouse(); toast("새 책장을 완성했습니다."); });
    (_d = app.querySelector('[data-action="expand"]')) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => { if (!state)
        return; const cost = 7 + state.houseLevel * 3; if (state.firewood < cost)
        return toast(`땔감이 ${cost - state.firewood}만큼 부족합니다.`); state.firewood -= cost; state.houseLevel++; state.shelves++; saveGame(); renderHouse(); toast("집이 한층 넓어졌습니다."); });
    (_e = app.querySelector('[data-action="next"]')) === null || _e === void 0 ? void 0 : _e.addEventListener("click", endDay);
}
function endDay() {
    if (!state)
        return;
    const hadFood = state.food >= 1;
    const hadWood = state.firewood >= 2;
    state.day++;
    state.food = Math.max(0, state.food - 1);
    const wood = Math.min(2, state.firewood);
    state.firewood -= wood;
    const production = emotionProduction();
    EMOTIONS.forEach(emotion => state.emotionEnergy[emotion] += production[emotion]);
    state.energy = EMOTIONS.reduce((sum, emotion) => sum + state.emotionEnergy[emotion], 0);
    state.warmth = Math.max(10, Math.min(100, state.warmth + wood * 14 - 20));
    if (!hadFood)
        state.warmth = Math.max(10, state.warmth - 8);
    const hungerDamage = hadFood ? 0 : 12;
    const coldDamage = state.warmth < 20 ? 26 : state.warmth < 35 ? 18 : 0;
    const totalDamage = hungerDamage + coldDamage;
    state.health = totalDamage ? Math.max(0, state.health - totalDamage) : Math.min(100, state.health + 6);
    saveGame();
    if (state.health <= 0)
        return renderGameOver(coldDamage ? "화로가 식은 밤, 저체온증이 마지막 온기를 빼앗았다." : "굶주림 속에서 더는 아침을 맞지 못했다.");
    renderHouse();
    toast(totalDamage ? `${!hadWood ? "땔감 부족으로 온기가 떨어졌습니다. " : ""}${coldDamage ? `저체온증 ${coldDamage}, ` : ""}${hungerDamage ? `굶주림 ${hungerDamage}, ` : ""}총 체력 ${totalDamage} 감소.` : `안전한 밤을 보내 체력이 6 회복되었습니다.`);
}
function ensureDiscoveryHistory() {
    if (!state)
        return;
    if (!Array.isArray(state.discoveredBookIds))
        state.discoveredBookIds = [];
    state.books.forEach(book => { if (!state.discoveredBookIds.includes(book.id))
        state.discoveredBookIds.push(book.id); });
}
function renderCatalog() {
    var _a;
    if (!state)
        return;
    ensureDiscoveryHistory();
    saveGame();
    const discoveredIds = new Set(state.discoveredBookIds);
    const acquiredCount = CATALOG_TITLES.filter((_, index) => discoveredIds.has(`khm-${index + 1}`)).length;
    const selectedTemplate = catalogBook(selectedCatalogIndex);
    const selectedOwned = state.books.find(book => book.id === selectedTemplate.id);
    const selectedDiscovered = discoveredIds.has(selectedTemplate.id);
    const displayBook = selectedOwned || selectedTemplate;
    app.innerHTML = `<main class="game-screen catalog-screen">
    <header class="section-header catalog-header"><button class="back" data-action="back">← 집으로</button><div><p class="eyebrow">KINDER- UND HAUSMÄRCHEN</p><h2>책 도감</h2></div><p>발견 기록 ${acquiredCount} / ${CATALOG_TITLES.length}</p></header>
    <section class="catalog-layout"><div class="catalog-list"><div class="catalog-progress"><span>발견한 이야기</span><i><b style="width:${acquiredCount / CATALOG_TITLES.length * 100}%"></b></i><strong>${Math.round(acquiredCount / CATALOG_TITLES.length * 100)}%</strong></div><div class="catalog-grid">${CATALOG_TITLES.map((title, index) => { const id = `khm-${index + 1}`; const unlocked = discoveredIds.has(id); const owned = state.books.some(book => book.id === id); return `<button class="catalog-entry ${unlocked ? "unlocked" : "locked"} ${selectedCatalogIndex === index ? "selected" : ""}" data-catalog="${index}"><span>${String(index + 1).padStart(2, "0")}</span><i>${unlocked ? "◆" : "◇"}</i><strong>${title}</strong><small>${unlocked ? owned ? "현재 보관 중" : "발견 기록 · 원본 소실" : "내용 비공개"}</small></button>`; }).join("")}</div></div>
    <aside class="catalog-detail ${selectedDiscovered ? "unlocked" : "locked"}">${selectedDiscovered ? `<div class="catalog-book"><span>KHM ${String(selectedCatalogIndex + 1).padStart(3, "0")}</span><strong>${displayBook.title}</strong><small>WINTER ARCHIVE</small></div><p class="catalog-state">${selectedOwned ? `원본 보관 중 · 안정화 ${selectedOwned.contained ? "진행 중" : "중단됨"}` : "발견 기록 보존됨 · 원본 소실"}</p><h3>${displayBook.title}</h3><div class="catalog-stats"><div><span>에너지 생산량</span><strong>+${displayBook.energy} / 일</strong></div><div><span>위험도</span><strong>${"◆".repeat(displayBook.risk)}${"◇".repeat(3 - displayBook.risk)}</strong></div><div><span>감정 분류</span><strong>${displayBook.emotion}</strong></div></div><div class="observation"><span>관찰 기록 ${String(selectedCatalogIndex + 1).padStart(2, "0")}</span><p>“${displayBook.description}”</p><small>— 피난처 기록자의 수기</small></div>` : `<div class="sealed-book"><span>?</span></div><p class="catalog-state">미획득 기록</p><h3>${selectedTemplate.title}</h3><div class="catalog-stats obscured"><div><span>에너지 생산량</span><strong>???</strong></div><div><span>위험도</span><strong>◇◇◇</strong></div><div><span>감정 분류</span><strong>미확인</strong></div></div><div class="observation sealed"><span>관찰 기록 잠김</span><p>이 책을 탐사에서 발견해야 내용을 읽을 수 있습니다.</p></div>`}</aside></section>
  </main>`;
    (_a = app.querySelector('[data-action="back"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderInteractiveHouse);
    app.querySelectorAll("[data-catalog]").forEach(button => button.addEventListener("click", () => { selectedCatalogIndex = Number(button.dataset.catalog); renderCatalog(); }));
}
function renderEnergyFlow() {
    var _a, _b;
    if (!state)
        return;
    const production = emotionProduction();
    const maxProduction = Math.max(1, ...EMOTIONS.map(emotion => production[emotion]));
    const center = 200;
    const radius = 118;
    const point = (index, distance) => { const angle = (-90 + index * 60) * Math.PI / 180; return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`; };
    const rings = [1, .66, .33].map(scale => EMOTIONS.map((_, index) => point(index, radius * scale)).join(" "));
    const dataPoints = EMOTIONS.map((emotion, index) => point(index, production[emotion] ? 18 + production[emotion] / maxProduction * 100 : 5)).join(" ");
    const colors = { 희망: "#e0b866", 불안: "#82a9a6", 공포: "#816b9e", 슬픔: "#668aa8", 분노: "#b85f4d", 애착: "#a87978" };
    app.innerHTML = `<main class="game-screen energy-screen"><header class="section-header"><button class="back" data-action="back">← 화롯방으로</button><div><p class="eyebrow">EMOTIONAL FURNACE</p><h2>감정 에너지 흐름</h2></div><p>화로 도달 ${furnaceReach()}개 방</p></header><section class="energy-layout"><div class="radar-panel"><div class="furnace-orbit"><div class="furnace-core"></div><svg viewBox="0 0 400 400" role="img" aria-label="감정 에너지 생산 다각형 그래프">${rings.map(points => `<polygon points="${points}" class="radar-ring"/>`).join("")}${EMOTIONS.map((_, index) => `<line x1="200" y1="200" x2="${point(index, radius).split(",")[0]}" y2="${point(index, radius).split(",")[1]}"/>`).join("")}<polygon points="${dataPoints}" class="radar-data"/>${EMOTIONS.map((emotion, index) => { const coords = point(index, 155).split(","); return `<text x="${coords[0]}" y="${coords[1]}" text-anchor="middle" dominant-baseline="middle">${emotion} +${production[emotion]}</text>`; }).join("")}</svg></div><p>다각형은 현재 안정화된 책들이 하루 동안 생산하는 감정 에너지의 구성을 나타냅니다.</p></div><aside class="energy-ledger"><p class="eyebrow">DAILY PRODUCTION</p><h3>생산 중인 감정</h3><div class="emotion-list">${EMOTIONS.map(emotion => `<div style="--emotion:${colors[emotion]}"><i></i><span><strong>${emotion}</strong><small>활성 책의 현재 출력</small></span><em>+${production[emotion]} / 일</em></div>`).join("")}</div><div class="energy-total"><span>오늘 예상 생산량</span><strong>+${EMOTIONS.reduce((sum, emotion) => sum + production[emotion], 0)}</strong></div><p>위기 대응은 이 일일 생산량으로 판정합니다. 누적 출력은 화로의 도달 거리를 넓히는 데에만 사용됩니다.</p><button data-action="books">안정화된 책 관리</button></aside></section></main>`;
    (_a = app.querySelector('[data-action="back"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderInteractiveHouse);
    (_b = app.querySelector('[data-action="books"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", renderBooks);
}
function renderCrisisWarning() {
    var _a;
    if (!state)
        return;
    const crisis = MIDGAME_CRISES.find(entry => entry.id === state.crisis.eventId) || MIDGAME_CRISES[0];
    state.crisis.warned = true;
    saveGame();
    const remaining = Math.max(0, state.crisis.nextDay - state.day);
    app.innerHTML = `<main class="crisis-screen warning"><section><p class="eyebrow">ANOMALOUS SIGN · 제 ${state.day}일</p><span class="omen-mark">${"◇".repeat(crisis.emotions.length)}</span><h1>무언가 다가오고 있습니다</h1><p class="crisis-prose">${crisis.omen}</p><div class="omen-meta"><span>예상 발생</span><strong>${remaining}일 후 · 제 ${state.crisis.nextDay}일</strong><small>관련 감정의 흐름이 불안정해지고 있습니다.</small></div><div class="emotion-tags">${crisis.emotions.map(emotion => `<span>${emotion}</span>`).join("")}</div><p class="lock-notice">위기가 해결될 때까지 새로운 탐사를 시작할 수 없습니다.</p><button data-action="acknowledge">징조를 기록한다 <span>→</span></button></section></main>`;
    (_a = app.querySelector('[data-action="acknowledge"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderInteractiveHouse);
}
function canMeetProduction(cost) {
    if (!state || !cost)
        return true;
    const production = emotionProduction();
    return EMOTIONS.every(emotion => production[emotion] >= (cost[emotion] || 0));
}
function arbitraryProductionRequirement(cost) {
    if (!cost)
        return 0;
    return EMOTIONS.reduce((sum, emotion) => sum + (cost[emotion] || 0), 0) * 2;
}
function canMeetArbitraryProduction(cost) {
    const production = emotionProduction();
    const total = EMOTIONS.reduce((sum, emotion) => sum + production[emotion], 0);
    return total >= arbitraryProductionRequirement(cost);
}
function crisisTier(day) { return Math.max(1, Math.min(6, Math.round(day / 15))); }
function scaledCrisisCost(cost, day) {
    if (!cost)
        return undefined;
    const tier = crisisTier(day);
    const multipliers = [.35, .5, .65, .8, 1, 1.25];
    const maxTypes = tier <= 2 ? 1 : tier <= 4 ? 2 : 6;
    const result = {};
    EMOTIONS.filter(emotion => (cost[emotion] || 0) > 0).slice(0, maxTypes).forEach(emotion => result[emotion] = Math.max(1, Math.ceil((cost[emotion] || 0) * multipliers[tier - 1])));
    return result;
}
function scaledCrisisEffect(effect, day) {
    if (!effect)
        return {};
    const factors = [.45, .6, .75, .9, 1, 1.15];
    const factor = factors[crisisTier(day) - 1];
    const scale = (value) => value === undefined ? undefined : value < 0 ? -Math.max(1, Math.ceil(Math.abs(value) * factor)) : value;
    return { health: scale(effect.health), food: scale(effect.food), firewood: scale(effect.firewood), warmth: scale(effect.warmth), loseBook: effect.loseBook && crisisTier(day) >= 3 };
}
function specificCrisisAdvantage(effect, day) {
    const tier = crisisTier(day);
    const advantaged = Object.assign({}, effect);
    if ((advantaged.food || 0) > 0)
        advantaged.food = (advantaged.food || 0) + Math.max(1, Math.ceil(tier / 2));
    if ((advantaged.firewood || 0) > 0)
        advantaged.firewood = (advantaged.firewood || 0) + Math.max(1, Math.ceil(tier / 2));
    if ((advantaged.warmth || 0) > 0)
        advantaged.warmth = Math.min(45, (advantaged.warmth || 0) + 5 + tier);
    if (!advantaged.food && !advantaged.firewood && !advantaged.warmth && !advantaged.health)
        advantaged.warmth = 5 + tier;
    return advantaged;
}
function arbitraryCrisisEffect(day) {
    if (Math.random() < .35)
        return {};
    const tier = crisisTier(day);
    return { health: -(2 + tier * 2), warmth: -(3 + tier * 2) };
}
function formatEmotionCost(cost) {
    if (!cost)
        return "감정 생산 요구 없음";
    return EMOTIONS.filter(emotion => cost[emotion]).map(emotion => `${emotion} +${cost[emotion]}/일`).join(" · ");
}
function describeCrisisAftermath(effect, fatal) {
    if (fatal)
        return "사건이 잦아든 뒤에도 주인공은 다시 일어나지 못했다. 화로의 불빛은 한동안 빈 방을 비추다가, 기록의 마지막 문장과 함께 천천히 작아졌다.";
    const lines = [];
    if ((effect.health || 0) < 0)
        lines.push("몸에 남은 상처는 사건이 환상이 아니었음을 증명했다. 숨을 고를 때마다 그날의 냉기와 소리가 되살아났다.");
    if ((effect.food || 0) < 0 || (effect.firewood || 0) < 0)
        lines.push("창고에는 눈에 띄는 빈자리가 생겼다. 다음 며칠은 평소보다 훨씬 신중하게 배급해야 한다.");
    if ((effect.warmth || 0) < 0)
        lines.push("벽과 바닥에 밴 냉기는 화로를 다시 지핀 뒤에도 쉽게 물러나지 않았다.");
    if ((effect.food || 0) > 0 || (effect.firewood || 0) > 0)
        lines.push("위기가 남긴 것 중에는 쓸 만한 물자도 있었다. 뜻밖의 수확이 다음 밤을 버틸 작은 여유가 되었다.");
    if ((effect.warmth || 0) > 0)
        lines.push("되살아난 불꽃이 방마다 번지며 오래 얼어 있던 벽을 천천히 녹였다.");
    if (effect.loseBook)
        lines.push("서가에 생긴 빈칸은 다른 책을 옮겨도 감춰지지 않았다. 사라진 이야기가 있던 자리만 유난히 차갑다.");
    return lines.join(" ") || "긴 밤이 지나자 집은 다시 평소의 침묵을 되찾았다. 하지만 이전과 완전히 같은 침묵은 아니었다.";
}
function renderMidgameCrisis() {
    if (!state)
        return;
    const crisis = MIDGAME_CRISES.find(entry => entry.id === state.crisis.eventId) || MIDGAME_CRISES[0];
    const tier = crisisTier(state.crisis.nextDay);
    const production = emotionProduction();
    const totalProduction = EMOTIONS.reduce((sum, emotion) => sum + production[emotion], 0);
    app.innerHTML = `<main class="crisis-screen active"><section><p class="eyebrow">MIDGAME CRISIS · 제 ${state.day}일 · 위기 강도 ${"Ⅰ".repeat(tier)}</p><span class="omen-mark">◆</span><h1>${crisis.title}</h1><p class="crisis-prose">${crisis.scene}</p><div class="emotion-tags">${crisis.emotions.map(emotion => `<span>${emotion}</span>`).join("")}</div><p class="lock-notice">현재 전체 감정 생산량 +${totalProduction}/일 · 저장량이 아닌 활성 책의 일일 생산량으로 대응합니다.</p><div class="crisis-choices">${crisis.choices.map((choice, index) => { const scaledCost = scaledCrisisCost(choice.cost, state.crisis.nextDay); if (!scaledCost)
        return `<button data-crisis-choice="${index}" data-crisis-mode="none"><strong>${choice.label}</strong><p>${choice.description}</p><small>대응 실패 · 큰 피해 예상</small></button>`; const specificReady = canMeetProduction(scaledCost); const arbitraryRequired = arbitraryProductionRequirement(scaledCost); const arbitraryReady = canMeetArbitraryProduction(scaledCost); return `<button data-crisis-choice="${index}" data-crisis-mode="specific" ${specificReady ? "" : "disabled"}><strong>${choice.label}</strong><p>위기에 맞는 감정으로 완전히 제어해 추가 이득을 얻는다.</p><small>${formatEmotionCost(scaledCost)}${specificReady ? " · 유리한 결과" : " · 생산량 부족"}</small></button><button data-crisis-choice="${index}" data-crisis-mode="arbitrary" ${arbitraryReady ? "" : "disabled"}><strong>다른 감정을 끌어모은다</strong><p>위기를 무마하지만 감정 충돌로 작은 후유증이 생길 수 있다.</p><small>아무 감정 합계 +${arbitraryRequired}/일${arbitraryReady ? " · 피해 없음 또는 경미" : " · 현재 생산량 부족"}</small></button>`; }).join("")}</div></section></main>`;
    app.querySelectorAll("[data-crisis-choice]").forEach(button => button.addEventListener("click", () => resolveMidgameCrisis(Number(button.dataset.crisisChoice), button.dataset.crisisMode || "none")));
}
function resolveMidgameCrisis(choiceIndex, mode) {
    var _a, _b;
    if (!state)
        return;
    const crisis = MIDGAME_CRISES.find(entry => entry.id === state.crisis.eventId) || MIDGAME_CRISES[0];
    const choice = crisis.choices[choiceIndex];
    const eventDay = state.crisis.nextDay;
    const actualCost = scaledCrisisCost(choice.cost, eventDay);
    if (mode === "specific" && !canMeetProduction(actualCost))
        return toast("필요한 감정의 일일 생산량이 부족합니다.");
    if (mode === "arbitrary" && !canMeetArbitraryProduction(actualCost))
        return toast("전체 감정 일일 생산량이 부족합니다.");
    const baseEffect = scaledCrisisEffect(choice.effect, eventDay);
    const effect = mode === "specific" ? specificCrisisAdvantage(baseEffect, eventDay) : mode === "arbitrary" ? arbitraryCrisisEffect(eventDay) : baseEffect;
    state.health = Math.max(0, Math.min(100, state.health + (effect.health || 0)));
    state.food = Math.max(0, state.food + (effect.food || 0));
    state.firewood = Math.max(0, state.firewood + (effect.firewood || 0));
    state.warmth = Math.max(0, Math.min(100, state.warmth + (effect.warmth || 0)));
    let lostBook = "";
    if (effect.loseBook && state.books.length) {
        const lost = state.books.splice(Math.floor(Math.random() * state.books.length), 1)[0];
        lostBook = ` ‘${lost.title}’의 기록을 영구적으로 잃었다.`;
    }
    else if (mode === "none" && ((_a = choice.effect) === null || _a === void 0 ? void 0 : _a.loseBook))
        lostBook = " 그러나 위기의 강도가 아직 낮았기에, 흩어진 문장 대부분을 아슬아슬하게 다시 묶어낼 수 있었다.";
    const resolvedDay = eventDay;
    const nextDay = resolvedDay + 15;
    const previousId = crisis.id;
    if (nextDay <= 90) {
        const candidates = MIDGAME_CRISES.filter(entry => entry.id !== previousId);
        state.crisis = { nextDay, eventId: candidates[Math.floor(Math.random() * candidates.length)].id, warned: false };
    }
    else
        state.crisis = { nextDay: 105, eventId: "", warned: false };
    saveGame();
    const fatal = state.health <= 0;
    const resolutionText = mode === "arbitrary" ? `${crisis.title}에 맞는 감정은 아니었지만, 화로에 흐르는 모든 감정을 한꺼번에 밀어 넣었다. 서로 다른 감정이 충돌하며 불꽃이 거칠게 흔들렸고, 사건은 더 커지지 않은 채 가까스로 잦아들었다.${Object.keys(effect).length ? " 그 과정에서 몸과 집에 작은 후유증이 남았다." : " 다행히 이번에는 별다른 피해 없이 밤을 넘겼다."}` : mode === "specific" ? `${choice.result} 위기에 정확히 맞는 감정이 흐르자 화로에는 평소보다 강한 여력이 남았다.` : choice.result;
    app.innerHTML = `<main class="crisis-screen result ${fatal ? "fatal" : ""}"><section><p class="eyebrow">${fatal ? "THE FINAL CONSEQUENCE" : "CRISIS RESOLVED"}</p><span class="omen-mark">◇</span><h1>${crisis.title}</h1><p class="crisis-prose">${resolutionText}${lostBook}</p><p class="aftermath-text">${describeCrisisAftermath(effect, fatal)}</p><div class="crisis-damage"><span>현재 체력 <strong>${state.health}</strong></span><span>식량 <strong>${state.food}</strong></span><span>땔감 <strong>${state.firewood}</strong></span><span>온기 <strong>${state.warmth}%</strong></span></div><button data-action="continue">${fatal ? "마지막 기록을 덮는다" : "남은 흔적을 정리한다"} <span>→</span></button></section></main>`;
    (_b = app.querySelector('[data-action="continue"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => fatal ? renderGameOver(`${crisis.title} 사건이 피난처의 마지막 기록이 되었다.`) : renderInteractiveHouse());
}
function renderExpeditionPrep() {
    var _a, _b;
    if (!state)
        return;
    prepFood = Math.min(prepFood, state.food);
    prepWood = Math.min(prepWood, state.firewood);
    const estimatedTurns = Math.min(15, 2 + prepFood * 2 + prepWood);
    app.innerHTML = `<main class="game-screen prep-screen"><header class="section-header"><button class="back" data-action="back">← 집으로</button><div><p class="eyebrow">EXPEDITION LOADOUT</p><h2>탐사 준비</h2></div><p>예상 ${estimatedTurns}턴 · 약 ${Math.ceil(estimatedTurns / 3)}일</p></header><section class="prep-layout"><div class="prep-main"><div class="prep-warning"><span>외부 기온 -31°C</span><p>챙긴 식량과 땔감이 많을수록 더 오래 탐사할 수 있습니다. 준비한 물자는 출발할 때 거점에서 차감됩니다.</p></div><h3>생존 물자</h3><div class="supply-row"><span class="supply-icon">${svg("food")}</span><div><strong>식량</strong><small>한 단위마다 탐사 가능 턴 +2</small></div><div class="stepper"><button data-supply="food" data-delta="-1">−</button><b>${prepFood}</b><button data-supply="food" data-delta="1">+</button></div><em>보유 ${state.food}</em></div><div class="supply-row"><span class="supply-icon">${svg("fire")}</span><div><strong>땔감</strong><small>한 단위마다 탐사 가능 턴 +1</small></div><div class="stepper"><button data-supply="wood" data-delta="-1">−</button><b>${prepWood}</b><button data-supply="wood" data-delta="1">+</button></div><em>보유 ${state.firewood}</em></div><h3>동행할 책 <small>최대 2권</small></h3><div class="loadout-books">${state.books.map(book => `<button class="loadout-book ${prepBookIds.includes(book.id) ? "selected" : ""}" data-loadout-book="${book.id}">${svg("book")}<span><strong>${book.title}</strong><small>${book.emotion} · 출력 ${book.energy}</small></span><i>${prepBookIds.includes(book.id) ? "선택됨" : "선택"}</i></button>`).join("")}</div><h3>도구</h3><div class="tool-slots"><button disabled><span>+</span><strong>도구 슬롯 1</strong><small>추후 구현 예정</small></button><button disabled><span>+</span><strong>도구 슬롯 2</strong><small>추후 구현 예정</small></button></div></div><aside class="departure-card"><p class="eyebrow">탐사 예상치</p><div class="turn-estimate"><strong>${estimatedTurns}</strong><span>탐사 가능 턴</span></div><dl><div><dt>예상 경과</dt><dd>${Math.ceil(estimatedTurns / 3)}일</dd></div><div><dt>식량</dt><dd>${prepFood}개</dd></div><div><dt>땔감</dt><dd>${prepWood}개</dd></div><div><dt>책</dt><dd>${prepBookIds.length}권</dd></div></dl><p>탐사 중에는 언제든 귀환할 수 있습니다. 체력을 모두 잃으면 전리품 일부를 잃고 강제 귀환합니다.</p><button data-action="depart">문을 열고 출발한다 <span>→</span></button></aside></section></main>`;
    const toolSlots = app.querySelector(".tool-slots");
    toolSlots.innerHTML = state.tools.length ? state.tools.map(id => { const tool = toolById(id); if (!tool)
        return ""; const selected = prepToolIds.includes(id); return `<button class="tool-loadout ${selected ? "selected" : ""}" data-loadout-tool="${id}"><span>${tool.special ? "◆" : "+"}</span><strong>${tool.name}</strong><small>${tool.description}${tool.consumable ? " · 소모품" : ""}</small></button>`; }).join("") : `<div class="empty-tools"><strong>보유한 도구가 없습니다.</strong><small>탐사 중 폐허와 생존자의 흔적에서 발견할 수 있습니다.</small></div>`;
    (_a = app.querySelector('[data-action="back"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderInteractiveHouse);
    app.querySelectorAll("[data-supply]").forEach(button => button.addEventListener("click", () => { const delta = Number(button.dataset.delta); if (button.dataset.supply === "food")
        prepFood = Math.max(0, Math.min(state.food, prepFood + delta));
    else
        prepWood = Math.max(0, Math.min(state.firewood, prepWood + delta)); renderExpeditionPrep(); }));
    app.querySelectorAll("[data-loadout-book]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.loadoutBook; if (prepBookIds.includes(id))
        prepBookIds = prepBookIds.filter(entry => entry !== id);
    else if (prepBookIds.length < 2)
        prepBookIds.push(id);
    else
        return toast("책은 두 권까지만 가져갈 수 있습니다."); renderExpeditionPrep(); }));
    app.querySelectorAll("[data-loadout-tool]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.loadoutTool; if (prepToolIds.includes(id))
        prepToolIds = prepToolIds.filter(entry => entry !== id);
    else if (prepToolIds.length < 2)
        prepToolIds.push(id);
    else
        return toast("도구는 두 개까지만 챙길 수 있습니다."); renderExpeditionPrep(); }));
    (_b = app.querySelector('[data-action="depart"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", startExpedition);
}
function startExpedition() {
    if (!state)
        return;
    state.food -= prepFood;
    state.firewood -= prepWood;
    expedition = { totalTurns: Math.min(15, 2 + prepFood * 2 + prepWood), turn: 1, hp: state.health, packedFood: prepFood, packedWood: prepWood, selectedBookIds: [...prepBookIds], selectedToolIds: [...prepToolIds], consumedToolIds: [], lootToolIds: [], lootFood: 0, lootWood: 0, lootBooks: [], event: "none", phase: "route", resultText: "" };
    saveGame();
    beginTurn();
}
function hasExpeditionTool(id) {
    if (!expedition)
        return false;
    if (id === "rope" && expedition.selectedToolIds.includes("silken-line"))
        return true;
    return expedition.selectedToolIds.includes(id) && !expedition.consumedToolIds.includes(id);
}
function consumeExpeditionTool(id) {
    if (!expedition)
        return;
    if (id === "rope" && expedition.selectedToolIds.includes("silken-line"))
        return;
    if (!expedition.consumedToolIds.includes(id))
        expedition.consumedToolIds.push(id);
}
function createRouteOptions() {
    const kinds = ["safe", "ruins", "tracks", "signal"];
    for (let index = kinds.length - 1; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1));
        [kinds[index], kinds[swap]] = [kinds[swap], kinds[index]];
    }
    return kinds.slice(0, 3).map((kind, index) => { const variants = ROUTE_VARIANTS[kind]; const variant = variants[Math.floor(Math.random() * variants.length)]; const misleading = Math.random() < .12; const alternatives = kinds.filter(entry => entry !== kind); const actualKind = misleading ? alternatives[Math.floor(Math.random() * alternatives.length)] : kind; return Object.assign(Object.assign({}, variant), { id: `${(expedition === null || expedition === void 0 ? void 0 : expedition.turn) || 1}-${index}-${kind}`, kind, actualKind }); });
}
function weightedEvent(kind) {
    const tables = {
        safe: [["none", .5], ["story", .2], ["resource", .12], ["avalanche", .08], ["animal", .07], ["book", .03]],
        ruins: [["story", .4], ["resource", .25], ["none", .12], ["avalanche", .1], ["animal", .08], ["book", .05]],
        tracks: [["animal", .38], ["story", .3], ["none", .12], ["resource", .1], ["avalanche", .07], ["book", .03]],
        signal: [["story", .34], ["book", .2], ["animal", .16], ["avalanche", .12], ["none", .1], ["resource", .08]]
    };
    const roll = Math.random();
    let cursor = 0;
    for (const [event, weight] of tables[kind]) {
        cursor += weight;
        if (roll <= cursor)
            return event;
    }
    return "none";
}
function chooseRoute(routeId) {
    var _a;
    if (!expedition)
        return;
    const route = (_a = expedition.routes) === null || _a === void 0 ? void 0 : _a.find(entry => entry.id === routeId);
    if (!route)
        return;
    expedition.chosenRoute = route;
    expedition.event = weightedEvent(route.actualKind);
    expedition.phase = "encounter";
    expedition.resultText = "";
    expedition.storyId = undefined;
    expedition.discovery = undefined;
    expedition.bookChoiceOrder = undefined;
    if (expedition.event === "animal")
        expedition.animal = ["토끼", "늑대", "곰"][Math.floor(Math.random() * 3)];
    if (expedition.event === "book") {
        const owned = new Set([...((state === null || state === void 0 ? void 0 : state.books) || []), ...expedition.lootBooks].map(book => book.id));
        const locked = CATALOG_TITLES.map((_, index) => catalogBook(index)).filter(book => !owned.has(book.id));
        expedition.discovery = locked[Math.floor(Math.random() * locked.length)];
        if (!expedition.discovery)
            expedition.event = "resource";
        else {
            const order = [0, 1, 2];
            for (let index = order.length - 1; index > 0; index--) {
                const swap = Math.floor(Math.random() * (index + 1));
                [order[index], order[swap]] = [order[swap], order[index]];
            }
            expedition.bookChoiceOrder = order;
        }
    }
    if (expedition.event === "story") {
        const pool = ROUTE_STORY_POOLS[route.actualKind];
        expedition.storyId = pool[Math.floor(Math.random() * pool.length)];
    }
    renderExpedition();
}
function beginTurn() {
    if (!expedition)
        return;
    if (expedition.hp <= 0 && hasExpeditionTool("golden-feather")) {
        consumeExpeditionTool("golden-feather");
        expedition.hp = 18;
        expedition.resultText = "황금빛 깃털이 부서지며 눈 위에 빛을 흩뿌렸다. 의식을 잃기 직전, 몸을 일으킬 마지막 힘이 돌아왔다.";
    }
    if (expedition.hp <= 0) {
        if (state) {
            state.health = 0;
            saveGame();
        }
        return renderGameOver("눈보라 속에서 입은 상처를 끝내 견디지 못했다.");
    }
    if (expedition.turn > expedition.totalTurns)
        return renderSettlement();
    expedition.event = "none";
    expedition.phase = "route";
    expedition.resultText = "";
    expedition.storyId = undefined;
    expedition.routes = createRouteOptions();
    expedition.chosenRoute = undefined;
    renderRouteSelection();
}
function renderRouteSelection() {
    var _a;
    if (!expedition)
        return;
    const progress = (expedition.turn - 1) / expedition.totalTurns * 100;
    app.innerHTML = `<main class="expedition-screen route-screen"><header class="expedition-top"><div><p class="eyebrow">CHOOSE YOUR PATH</p><strong>빙결 지대 탐사</strong></div><div class="expedition-meter"><span>진행 ${expedition.turn} / ${expedition.totalTurns}</span><i><b style="width:${progress}%"></b></i><small>흔적은 단서일 뿐, 확실한 약속은 아닙니다</small></div><div class="explorer-health"><span>체력</span><strong>${expedition.hp}</strong><i><b style="width:${expedition.hp}%"></b></i></div></header><section class="route-stage"><div class="route-heading"><p class="event-index">탐사 기록 ${String(expedition.turn).padStart(2, "0")}</p><h1>어느 방향으로 향할까?</h1><p>바람이 잠시 잦아들며 세 갈래의 흔적이 드러났다. 한 곳을 고르면 되돌아오기 어렵다.</p></div><div class="route-cards">${(expedition.routes || []).map((route, index) => `<button class="route-card route-${route.kind}" data-route="${route.id}"><span class="route-number">0${index + 1}</span><div class="route-symbol">${route.kind === "safe" ? "○" : route.kind === "ruins" ? "▥" : route.kind === "tracks" ? "⌁" : "◇"}</div><p>${route.risk} 위험</p><h2>${route.title}</h2><blockquote>${route.clue}</blockquote><small>${route.tendency}</small><em>이 길을 택한다 <b>→</b></em></button>`).join("")}</div><aside class="route-inventory"><div><span>현재 전리품</span><strong>식량 ${expedition.lootFood} · 땔감 ${expedition.lootWood} · 책 ${expedition.lootBooks.length} · 도구 ${expedition.lootToolIds.length}</strong></div><div><span>장착 도구</span><strong>${expedition.selectedToolIds.map(id => { var _a; return ((_a = toolById(id)) === null || _a === void 0 ? void 0 : _a.name) || id; }).join(" · ") || "없음"}</strong></div><button data-route-return>지금 전리품을 들고 귀환한다</button></aside></section></main>`;
    app.querySelectorAll("[data-route]").forEach(button => button.addEventListener("click", () => chooseRoute(button.dataset.route)));
    (_a = app.querySelector("[data-route-return]")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderSettlement);
}
function renderExpedition() {
    var _a, _b, _c;
    if (!expedition)
        return;
    const puzzle = expedition.discovery ? BOOK_PUZZLES[expedition.discovery.title] : undefined;
    const storyId = expedition.storyId;
    const story = EXPEDITION_STORIES.find(entry => entry.id === storyId);
    const eventCopy = { none: ["아무 일도 일어나지 않았다", "한 턴 동안 눈 덮인 길을 돌아다녔지만 특별한 흔적도, 마주친 존재도 없었다. 시간과 보급만 조용히 줄어든다."], avalanche: ["산이 울리기 시작했다", "머리 위 설벽에 금이 번진다. 잠시 뒤 눈과 얼음이 굉음을 내며 비탈을 덮친다."], animal: [`${expedition.animal}와 마주쳤다`, expedition.animal === "토끼" ? "눈더미 사이에서 굶주린 토끼가 몸을 낮춘 채 도망칠 길을 찾고 있다." : expedition.animal === "늑대" ? "앙상한 늑대가 낮게 으르렁댄다. 갈비뼈가 드러날 만큼 굶주렸지만 눈빛은 날카롭다." : "거대한 곰이 얼어붙은 사체 옆에서 몸을 일으킨다. 흰 입김이 눈보라보다 거칠다."], resource: ["검게 드러난 잔해", "무너진 건물 틈에서 아직 쓸 수 있을 법한 목재 더미를 발견했다. 지붕은 위태롭게 기울어져 있다."], book: [((_a = expedition.discovery) === null || _a === void 0 ? void 0 : _a.title) || "눈 속의 문장", (puzzle === null || puzzle === void 0 ? void 0 : puzzle.scene) || "눈 속에서 정체를 알 수 없는 책 한 권을 발견했다."], story: [(story === null || story === void 0 ? void 0 : story.title) || "눈 속의 흔적", (story === null || story === void 0 ? void 0 : story.scene) || "낯선 흔적이 길을 가로막는다."] };
    const encounter = expedition.phase === "encounter";
    const decision = expedition.phase === "decision";
    app.innerHTML = `<main class="expedition-screen event-${expedition.event}"><header class="expedition-top"><div><p class="eyebrow">BEYOND THE SHELTER</p><strong>빙결 지대 탐사</strong></div><div class="expedition-meter"><span>진행 ${expedition.turn} / ${expedition.totalTurns}</span><i><b style="width:${(expedition.turn - 1) / expedition.totalTurns * 100}%"></b></i><small>3턴마다 하루 경과</small></div><div class="explorer-health"><span>체력</span><strong>${expedition.hp}</strong><i><b style="width:${expedition.hp}%"></b></i></div></header><section class="event-stage"><div class="event-weather">❄</div><article class="event-card"><p class="event-index">탐사 기록 ${String(expedition.turn).padStart(2, "0")}</p><h1>${encounter || decision ? eventCopy[expedition.event][0] : "일어난 일"}</h1><p class="event-description">${encounter || decision ? eventCopy[expedition.event][1] : expedition.resultText}</p>${encounter ? renderEncounterAction() : decision ? renderDecisionActions() : `<button class="wide-action" data-choice="next">다음으로 <span>→</span></button>`}</article><aside class="expedition-loot"><p class="eyebrow">현재 전리품</p><div><span>${svg("food")} 식량</span><strong>${expedition.lootFood}</strong></div><div><span>${svg("fire")} 땔감</span><strong>${expedition.lootWood}</strong></div><div><span>${svg("book")} 책</span><strong>${expedition.lootBooks.length}</strong></div><button data-choice="return">지금 귀환한다</button></aside></section></main>`;
    const returnButton = app.querySelector('.expedition-loot [data-choice="return"]');
    (_b = app.querySelector(".event-index")) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML("beforebegin", `<p class="route-origin">선택한 경로 · ${((_c = expedition.chosenRoute) === null || _c === void 0 ? void 0 : _c.title) || "알 수 없는 길"}</p>`);
    returnButton === null || returnButton === void 0 ? void 0 : returnButton.insertAdjacentHTML("beforebegin", `<div class="tool-loot"><span>도구</span><strong>${expedition.lootToolIds.length}</strong><small>${expedition.selectedToolIds.map(id => { var _a; return `${((_a = toolById(id)) === null || _a === void 0 ? void 0 : _a.name) || id}${expedition.consumedToolIds.includes(id) ? "(소모)" : ""}`; }).join(" · ") || "미장착"}</small></div>`);
    const eventChoices = app.querySelector(".event-choices");
    if (decision && eventChoices && expedition.hp < 100 && hasExpeditionTool("medkit"))
        eventChoices.insertAdjacentHTML("beforeend", `<button data-choice="use-medkit"><strong>응급처치를 한다</strong><small>응급처치 가방 소모 · 체력 25 회복</small></button>`);
    if (decision && eventChoices && expedition.event === "animal" && hasExpeditionTool("flare"))
        eventChoices.insertAdjacentHTML("beforeend", `<button data-choice="animal-flare"><strong>신호탄을 발사한다</strong><small>신호탄 소모 · 동물을 확실히 쫓아낸다</small></button>`);
    if (decision && eventChoices && expedition.event === "animal" && hasExpeditionTool("trap"))
        eventChoices.insertAdjacentHTML("beforeend", `<button data-choice="animal-trap"><strong>사냥 덫으로 유인한다</strong><small>사냥 덫 소모 · 피해 없이 식량 획득</small></button>`);
    if (decision && eventChoices && expedition.event === "avalanche" && hasExpeditionTool("rope"))
        eventChoices.insertAdjacentHTML("beforeend", `<button data-choice="avalanche-rope"><strong>몸을 밧줄로 고정한다</strong><small>${hasExpeditionTool("silken-line") ? "금빛 머리끈 사용" : "등반용 밧줄 소모"} · 피해 경감</small></button>`);
    app.querySelectorAll("[data-choice]").forEach(button => button.addEventListener("click", () => handleExpeditionChoice(button.dataset.choice)));
}
function renderEncounterAction() {
    if (!expedition)
        return "";
    if (expedition.event === "none")
        return `<button class="wide-action" data-choice="next">계속 걷는다 <span>→</span></button>`;
    return `<button class="wide-action" data-choice="observe">상황을 살핀다 <span>→</span></button>`;
}
function renderDecisionActions() {
    if (!expedition)
        return "";
    if (expedition.event === "avalanche")
        return `<div class="event-choices"><button data-choice="brace"><strong>몸을 웅크린다</strong><small>충격에 대비한다</small></button><button data-choice="run"><strong>바위 뒤로 달린다</strong><small>눈사태 범위에서 벗어나 본다</small></button></div>`;
    if (expedition.event === "animal")
        return `<div class="event-choices"><button data-choice="fight"><strong>싸운다</strong><small>책의 힘으로 맞선다 · 전투는 임시 판정</small></button><button data-choice="flee"><strong>도망간다</strong><small>동물에 따라 추격 확률이 달라진다</small></button></div>`;
    if (expedition.event === "resource")
        return `<div class="event-choices"><button data-choice="search"><strong>잔해 안으로 들어간다</strong><small>쓸 만한 땔감을 찾아본다</small></button><button data-choice="leave"><strong>그대로 지나친다</strong><small>위험해 보이는 구조물을 피한다</small></button></div>`;
    if (expedition.event === "story") {
        const storyId = expedition.storyId;
        const story = EXPEDITION_STORIES.find(entry => entry.id === storyId);
        const choices = [...((story === null || story === void 0 ? void 0 : story.choices) || []), ...(TOOL_STORY_CHOICES[storyId || ""] || [])];
        return `<div class="event-choices">${choices.map((entry, index) => { const available = !entry.requiredTool || hasExpeditionTool(entry.requiredTool); const tool = entry.requiredTool ? toolById(entry.requiredTool) : undefined; return `<button data-choice="story-${index}" ${available ? "" : "disabled"}><strong>${entry.label}</strong><small>${available ? entry.hint : `${(tool === null || tool === void 0 ? void 0 : tool.name) || "필요한 도구"}를 챙기지 않음`}</small></button>`; }).join("")}</div>`;
    }
    const hasBookSpace = state ? state.books.length + expedition.lootBooks.length < state.shelves * 4 : false;
    if (!hasBookSpace)
        return `<div class="event-choices book-choices no-space"><button data-choice="book-leave"><strong>책을 두고 지나간다</strong><small>남은 책장 공간이 없어 새로운 기록을 보관할 수 없다</small></button></div>`;
    const puzzle = expedition.discovery ? BOOK_PUZZLES[expedition.discovery.title] : undefined;
    const originalChoices = (puzzle === null || puzzle === void 0 ? void 0 : puzzle.choices) || ["책에 손을 댄다", "기다린다", "돌아선다"];
    const choices = (expedition.bookChoiceOrder || [0, 1, 2]).map(index => originalChoices[index]);
    return `<div class="event-choices book-choices">${choices.map((text, index) => `<button data-choice="book-${index}">${text}</button>`).join("")}</div>`;
}
function handleExpeditionChoice(choice) {
    if (!expedition)
        return;
    if (choice === "return")
        return renderSettlement();
    if (choice === "next") {
        expedition.turn++;
        return beginTurn();
    }
    if (choice === "observe") {
        expedition.phase = "decision";
        return renderExpedition();
    }
    let text = "";
    const toolChoice = ["use-medkit", "animal-flare", "animal-trap", "avalanche-rope"].includes(choice);
    if (choice === "use-medkit") {
        consumeExpeditionTool("medkit");
        expedition.hp = Math.min(100, expedition.hp + 25);
        text = "바람을 막을 곳을 찾아 상처를 소독하고 압박 붕대를 감았다. 체력이 25 회복되었다.";
    }
    else if (choice === "animal-flare") {
        consumeExpeditionTool("flare");
        text = `붉은 불꽃과 폭음에 ${expedition.animal}가 몸을 돌려 달아났다.`;
    }
    else if (choice === "animal-trap") {
        consumeExpeditionTool("trap");
        const food = expedition.animal === "토끼" ? 1 : expedition.animal === "늑대" ? 2 : 4;
        expedition.lootFood += food;
        text = `접근로에 덫을 설치해 직접 싸우지 않고 ${expedition.animal}를 제압했다. 식량 ${food}개를 얻었다.`;
    }
    else if (choice === "avalanche-rope") {
        consumeExpeditionTool("rope");
        const damage = 2 + Math.floor(Math.random() * 4);
        expedition.hp = Math.max(0, expedition.hp - damage);
        text = `몸을 단단히 고정해 눈사태에 휩쓸리는 것을 피했다. 체력이 ${damage} 감소했다.`;
    }
    if (toolChoice) {
        expedition.phase = "result";
        expedition.resultText = text;
        return renderExpedition();
    }
    if (expedition.event === "avalanche") {
        let damage = choice === "brace" ? 5 + Math.floor(Math.random() * 7) : 3 + Math.floor(Math.random() * 15);
        if (hasExpeditionTool("ember-lantern"))
            damage = Math.max(1, Math.ceil(damage / 2));
        expedition.hp = Math.max(0, expedition.hp - damage);
        text = choice === "brace" ? `눈더미가 등을 짓눌렀지만 자세를 지켰다. 체력이 ${damage} 감소했다.${hasExpeditionTool("ember-lantern") ? " 등불이 빈 공간을 비춰 질식을 피했다." : ""}` : `비탈을 달렸으나 얼음 조각이 옆구리를 때렸다. 체력이 ${damage} 감소했다.`;
    }
    if (expedition.event === "resource") {
        if (choice === "search") {
            const found = 1 + Math.floor(Math.random() * 3) + (hasExpeditionTool("giant-belt") ? 2 : 0);
            expedition.lootWood += found;
            text = `기울어진 지붕 아래에서 마른 목재 ${found}개를 꺼냈다.${hasExpeditionTool("giant-belt") ? " 허리띠가 무거운 목재의 무게를 받아냈다." : ""}`;
        }
        else
            text = "무너지는 소리를 등 뒤로 남기고 길을 재촉했다. 얻은 것도, 잃은 것도 없다.";
    }
    if (expedition.event === "animal") {
        const animal = expedition.animal;
        const food = animal === "토끼" ? 1 : animal === "늑대" ? 2 : 4;
        const fightChance = (animal === "토끼" ? .9 : animal === "늑대" ? .62 : .38) + expedition.selectedBookIds.length * .12 + (hasExpeditionTool("hunter-knife") ? .25 : 0);
        const fleeChance = animal === "토끼" ? .95 : animal === "늑대" ? .55 : .3;
        if (choice === "flee" && Math.random() < fleeChance)
            text = `${animal}의 시야에서 벗어났다. 한동안 발자국을 지우며 우회했다.`;
        else {
            const won = Math.random() < fightChance;
            if (won) {
                expedition.lootFood += food;
                text = choice === "flee" ? `도망치던 중 따라잡혀 싸울 수밖에 없었다. 간신히 승리해 식량 ${food}개를 얻었다.` : `책과 장비를 이용해 ${animal}를 쓰러뜨리고 식량 ${food}개를 얻었다.`;
            }
            else {
                const damage = animal === "토끼" ? 4 : animal === "늑대" ? 16 : 28;
                expedition.hp = Math.max(0, expedition.hp - damage);
                text = `${animal}를 막아내지 못하고 물러났다. 체력이 ${damage} 감소했다. 전투 시스템은 추후 상세 구현된다.`;
            }
        }
    }
    if (expedition.event === "story") {
        const storyId = expedition.storyId;
        const story = EXPEDITION_STORIES.find(entry => entry.id === storyId);
        const choices = [...((story === null || story === void 0 ? void 0 : story.choices) || []), ...(TOOL_STORY_CHOICES[storyId || ""] || [])];
        const picked = choices[Number(choice.split("-")[1])];
        if (picked && (!picked.requiredTool || hasExpeditionTool(picked.requiredTool))) {
            const success = picked.chance === undefined || Math.random() < picked.chance;
            const food = success ? picked.food || 0 : picked.failureFood || 0;
            const wood = success ? picked.wood || 0 : picked.failureWood || 0;
            const health = success ? picked.health || 0 : picked.failureHealth || 0;
            expedition.lootFood = Math.max(0, expedition.lootFood + food);
            expedition.lootWood = Math.max(0, expedition.lootWood + wood);
            expedition.hp = Math.max(0, Math.min(100, expedition.hp + health));
            if (success && picked.consumeTool && picked.requiredTool)
                consumeExpeditionTool(picked.requiredTool);
            if (success && picked.grantTool && !expedition.lootToolIds.includes(picked.grantTool) && !(state === null || state === void 0 ? void 0 : state.tools.includes(picked.grantTool)))
                expedition.lootToolIds.push(picked.grantTool);
            text = success ? picked.result : picked.failure || "선택은 기대한 결과로 이어지지 않았다.";
        }
    }
    if (expedition.event === "book") {
        if (choice === "book-leave")
            text = "가져갈 자리가 없다는 것을 알면서도 한동안 책 앞을 떠나지 못했다. 결국 눈 위의 이야기를 뒤로하고 발걸음을 옮겼다.";
        else {
            const displayedIndex = Number(choice.split("-")[1]);
            const picked = (expedition.bookChoiceOrder || [0, 1, 2])[displayedIndex];
            const puzzle = BOOK_PUZZLES[expedition.discovery.title];
            if (picked === puzzle.correct) {
                expedition.lootBooks.push(expedition.discovery);
                text = `${puzzle.success} ‘${expedition.discovery.title}’을 획득했다.`;
            }
            else
                text = puzzle.failure;
        }
    }
    expedition.phase = "result";
    expedition.resultText = text;
    renderExpedition();
}
function renderSettlement() {
    var _a, _b;
    if (!expedition || !state)
        return;
    if (expedition.hp <= 0) {
        state.health = 0;
        saveGame();
        return renderGameOver("탐사에서 입은 치명상을 이겨내지 못했다.");
    }
    const completedTurns = Math.min(expedition.turn, expedition.totalTurns);
    const days = Math.max(1, Math.ceil(completedTurns / 3));
    const keptFood = expedition.lootFood;
    const keptWood = expedition.lootWood;
    const keptBooks = expedition.lootBooks;
    state.day += days;
    state.health = expedition.hp;
    state.food += keptFood;
    state.firewood += keptWood;
    state.tools = state.tools.filter(id => !expedition.consumedToolIds.includes(id));
    expedition.lootToolIds.forEach(id => { if (!state.tools.includes(id))
        state.tools.push(id); });
    const newBooks = [];
    keptBooks.filter(book => !state.books.some(owned => owned.id === book.id)).forEach(book => { const shelfId = firstAvailableShelf(newBooks); if (shelfId >= 0) {
        book.shelfId = shelfId;
        newBooks.push(book);
    } });
    ensureDiscoveryHistory();
    newBooks.forEach(book => { if (!state.discoveredBookIds.includes(book.id))
        state.discoveredBookIds.push(book.id); });
    state.books.push(...newBooks);
    saveGame();
    app.innerHTML = `<main class="settlement-screen"><section><p class="eyebrow">EXPEDITION COMPLETE</p><h1>피난처의 불빛이 보인다</h1><p>문을 닫자 바깥의 바람 소리가 멀어진다. 상처는 남았지만 가져온 물건은 모두 지켜냈다.</p><div class="settlement-summary"><div><span>경과 시간</span><strong>${days}일</strong><small>${completedTurns}턴 탐사</small></div><div><span>남은 체력</span><strong>${expedition.hp}</strong><small>거점에서도 유지됨</small></div></div><h2>획득 아이템 정산</h2><div class="settlement-loot"><div>${svg("food")}<span>식량</span><strong>+${keptFood}</strong></div><div>${svg("fire")}<span>땔감</span><strong>+${keptWood}</strong></div><div>${svg("book")}<span>새로운 책</span><strong>+${keptBooks.length}</strong></div></div>${keptBooks.length ? `<div class="found-books">${keptBooks.map(book => `<span>새 기록 해금</span><strong>${book.title}</strong>`).join("")}</div>` : ""}<button data-action="home">집으로 돌아간다 <span>→</span></button></section></main>`;
    if (expedition.lootToolIds.length)
        (_a = app.querySelector(".settlement-loot")) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("afterend", `<div class="found-tools"><span>새로운 도구</span>${expedition.lootToolIds.map(id => { var _a; return `<strong>${((_a = toolById(id)) === null || _a === void 0 ? void 0 : _a.name) || id}</strong>`; }).join("")}</div>`);
    (_b = app.querySelector('[data-action="home"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { expedition = null; prepBookIds = []; prepToolIds = []; renderInteractiveHouse(); });
}
function renderGameOver(reason) {
    var _a, _b;
    window.onkeydown = null;
    app.innerHTML = `<main class="game-over-screen"><section><p class="eyebrow">THE LAST RECORD</p><div class="dead-flame"></div><h1>이야기가 끝났습니다</h1><p>${reason}</p><div class="final-record"><span>마지막 생존 기록</span><strong>제 ${(state === null || state === void 0 ? void 0 : state.day) || 1}일</strong><small>보존한 책 ${(state === null || state === void 0 ? void 0 : state.books.length) || 0}권</small></div><button data-action="restart">새로운 기록을 시작한다</button><button class="quiet" data-action="menu">메인 메뉴로</button></section></main>`;
    (_a = app.querySelector('[data-action="restart"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => { state = initialState(); expedition = null; prepFood = 1; prepWood = 1; prepBookIds = []; prepToolIds = []; saveGame(); renderInteractiveHouse(); });
    (_b = app.querySelector('[data-action="menu"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", renderMenu);
}
function bookManagementCard(book, reach, compact = false) {
    var _a;
    if (!state)
        return "";
    const powered = bookIsPowered(book);
    const shelfId = (_a = book.shelfId) !== null && _a !== void 0 ? _a : 0;
    const tags = BOOK_TAGS[book.title] || [];
    const activeTags = new Set(synergiesForShelf(shelfId).map(synergy => synergy.tag));
    const placementOptions = state.shelfRooms.map((_, index) => {
        const shelfBooks = state.books.filter(entry => { var _a; return ((_a = entry.shelfId) !== null && _a !== void 0 ? _a : 0) === index; });
        const status = `${state.shelfRooms[index] < reach ? "활성" : "단절"}`;
        if (index === shelfId)
            return `<option value="stay" selected>${shelfLabel(index)} · ${shelfBooks.length}/4 · ${status}</option>`;
        if (shelfBooks.length < 4)
            return `<option value="move:${index}">${shelfLabel(index)} · ${shelfBooks.length}/4 · ${status}</option>`;
        return `<optgroup label="${shelfLabel(index)} · 가득 참 — 교환할 책">${shelfBooks.map(target => `<option value="swap:${target.id}">↔ ${target.title}</option>`).join("")}</optgroup>`;
    }).join("");
    return `<article class="book-card ${compact ? "compact-book" : ""} ${book.contained ? "active" : ""} ${powered ? "powered" : "unpowered"} ${tags.some(tag => activeTags.has(tag)) ? "synergy-active" : ""}"><div class="book-cover"><span>Ⅰ</span><strong>${book.title}</strong><small>WINTER ARCHIVE</small></div><div class="book-info"><p class="emotion">${book.emotion}의 기록</p><h3>${book.title}</h3><div class="book-tags">${tags.map(tag => `<span class="${activeTags.has(tag) ? "resonant" : ""}">${tag}</span>`).join("")}</div>${compact ? "" : `<p>${book.description}</p>`}<dl><div><dt>출력</dt><dd>${powered ? `+${book.energy} / 일` : "비활성"}</dd></div><div><dt>위험도</dt><dd>${"◆".repeat(book.risk)}${"◇".repeat(3 - book.risk)}</dd></div><div><dt>화로</dt><dd>${bookShelfRoom(book) < reach ? "도달" : "단절"}</dd></div></dl></div><div class="book-actions"><label>배치 책장<select data-move-book="${book.id}">${placementOptions}</select></label><button data-book="${book.id}">${book.contained ? "책 격리" : "책 안정화"}<small>${!book.contained ? "현재 격리됨" : powered ? "에너지 생산 중" : "도달 범위 밖"}</small></button><button class="burn-book" data-burn-book="${book.id}">책을 화로에 넣는다<small>영구 소실 · 온기 +25</small></button></div></article>`;
}
function renderBooks() {
    var _a;
    if (!state)
        return;
    selectedBookShelfId = Math.max(0, Math.min(state.shelves - 1, selectedBookShelfId));
    const production = emotionProduction();
    const gain = EMOTIONS.reduce((sum, emotion) => sum + production[emotion], 0);
    const reach = furnaceReach();
    const activeSynergies = activeShelfSynergies();
    const selectedBooks = state.books.filter(book => { var _a; return ((_a = book.shelfId) !== null && _a !== void 0 ? _a : 0) === selectedBookShelfId; });
    const localSynergies = shelfSynergyCandidates(selectedBookShelfId);
    const isWinning = (synergy) => activeSynergies.some(active => active.tag === synergy.tag && active.shelfId === synergy.shelfId);
    const shelfView = `<section class="shelf-manager"><nav class="shelf-navigation">${state.shelfRooms.map((room, shelfId) => { const books = state.books.filter(book => { var _a; return ((_a = book.shelfId) !== null && _a !== void 0 ? _a : 0) === shelfId; }); const synergies = shelfSynergyCandidates(shelfId); return `<button class="${selectedBookShelfId === shelfId ? "selected" : ""}" data-shelf-view="${shelfId}"><span>책장 ${shelfId + 1}</span><strong>${shelfLabel(shelfId)}</strong><small>${books.length}/4권 · ${room < reach ? "화로 연결" : "에너지 단절"}</small>${synergies.length ? `<em>${synergies.map(synergy => `${synergy.tag}×${synergy.count}`).join(" · ")}</em>` : ""}</button>`; }).join("")}</nav><div class="selected-shelf"><header><div><p class="eyebrow">SELECTED SHELF</p><h2>${shelfLabel(selectedBookShelfId)}</h2><span>${selectedBooks.length}/4권 배치 · ${state.shelfRooms[selectedBookShelfId] < reach ? "에너지 공급 중" : "에너지 단절"}</span></div><div class="shelf-resonances">${localSynergies.length ? localSynergies.map(synergy => `<span class="${isWinning(synergy) ? "applied" : "suppressed"}"><strong>${synergy.tag} ×${synergy.count}</strong><small>${isWinning(synergy) ? `${synergy.emotion} +${synergy.bonus}/일 적용` : "더 높은 동일 공명으로 억제"}</small></span>`).join("") : `<p>동일 태그 책을 2권 이상 배치하면 공명이 발생합니다.</p>`}</div></header><div class="shelf-slots">${Array.from({ length: 4 }, (_, index) => selectedBooks[index] ? `<div class="shelf-slot occupied"><span class="slot-number">${index + 1}</span>${bookManagementCard(selectedBooks[index], reach, true)}</div>` : `<div class="shelf-slot empty"><span class="slot-number">${index + 1}</span><div><strong>빈 자리</strong><small>전체 책 탭에서 책장을 변경해 배치할 수 있습니다.</small></div></div>`).join("")}</div></div></section>`;
    const allView = `<section class="all-books-view"><div class="all-books-heading"><div><p class="eyebrow">ALL PRESERVED BOOKS</p><h2>전체 배치 도서</h2></div><p>모든 책의 태그와 현재 책장을 비교하고 배치를 변경할 수 있습니다.</p></div><div class="book-list">${state.books.length ? state.books.map(book => bookManagementCard(book, reach)).join("") : `<p class="empty-library">보관 중인 책이 없습니다.</p>`}</div></section>`;
    app.innerHTML = `<main class="game-screen books-screen redesigned-books"><header class="section-header"><button class="back" data-action="back">← 집으로</button><div><p class="eyebrow">ARCHIVE MANAGEMENT</p><h2>책장 관리</h2></div><p>${state.books.length} / ${state.shelves * 4}권 · 일일 생산 +${gain}</p></header><nav class="book-view-tabs"><button class="${booksView === "shelves" ? "selected" : ""}" data-books-view="shelves"><strong>책장 배치</strong><small>책장별 구성과 공명</small></button><button class="${booksView === "all" ? "selected" : ""}" data-books-view="all"><strong>전체 책</strong><small>보유 도서와 배치 변경</small></button></nav>${booksView === "shelves" ? shelfView : allView}<aside class="global-resonance"><span>현재 적용 중인 공명</span><div>${activeSynergies.length ? activeSynergies.map(synergy => `<i>${synergy.tag}×${synergy.count} · ${synergy.emotion} +${synergy.bonus}</i>`).join("") : `<i>없음</i>`}</div><small>동일 태그 공명은 가장 높은 책장 하나만 적용됩니다.</small></aside></main>`;
    (_a = app.querySelector('[data-action="back"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", renderHouse);
    app.querySelectorAll("[data-books-view]").forEach(button => button.addEventListener("click", () => { booksView = button.dataset.booksView; renderBooks(); }));
    app.querySelectorAll("[data-shelf-view]").forEach(button => button.addEventListener("click", () => { selectedBookShelfId = Number(button.dataset.shelfView); renderBooks(); }));
    app.querySelectorAll("[data-book]").forEach(button => button.addEventListener("click", () => { if (!state)
        return; const book = state.books.find(entry => entry.id === button.dataset.book); if (!book)
        return; book.contained = !book.contained; saveGame(); renderBooks(); }));
    app.querySelectorAll("[data-move-book]").forEach(select => select.addEventListener("change", () => {
        var _a, _b;
        if (!state || select.value === "stay")
            return;
        const book = state.books.find(entry => entry.id === select.dataset.moveBook);
        if (!book)
            return;
        const sourceShelf = (_a = book.shelfId) !== null && _a !== void 0 ? _a : 0;
        const [action, value] = select.value.split(":");
        if (action === "move") {
            const destination = Number(value);
            const used = state.books.filter(entry => { var _a; return ((_a = entry.shelfId) !== null && _a !== void 0 ? _a : 0) === destination; }).length;
            if (used >= 4) {
                toast("그 사이 선택한 책장이 가득 찼습니다.");
                return renderBooks();
            }
            book.shelfId = destination;
            saveGame();
            renderBooks();
            toast(`${shelfLabel(destination)}으로 책을 옮겼습니다.`);
            return;
        }
        if (action === "swap") {
            const target = state.books.find(entry => entry.id === value);
            if (!target || target.id === book.id)
                return renderBooks();
            const destination = (_b = target.shelfId) !== null && _b !== void 0 ? _b : 0;
            book.shelfId = destination;
            target.shelfId = sourceShelf;
            saveGame();
            renderBooks();
            toast(`‘${target.title}’과 자리를 교환했습니다.`);
        }
    }));
    app.querySelectorAll("[data-burn-book]").forEach(button => button.addEventListener("click", () => burnBook(button.dataset.burnBook)));
}
function burnBook(bookId) {
    if (!state)
        return;
    ensureDiscoveryHistory();
    const book = state.books.find(entry => entry.id === bookId);
    if (!book || !confirm(`‘${book.title}’을 화로에 넣을까요? 원본 책은 영구적으로 사라지지만 도감의 발견 기록은 남습니다.`))
        return;
    state.books = state.books.filter(entry => entry.id !== bookId);
    state.warmth = Math.min(100, state.warmth + 25);
    const rewardId = HIDDEN_BURN_REWARDS[book.title];
    let message = `‘${book.title}’이 타오르며 온기가 25 증가했습니다.`;
    if (rewardId && !state.tools.includes(rewardId)) {
        state.tools.push(rewardId);
        const tool = toolById(rewardId);
        message = `책장이 모두 재가 된 뒤에도 ${(tool === null || tool === void 0 ? void 0 : tool.name) || "정체불명의 장비"}만은 불 속에 남았습니다.`;
    }
    saveGame();
    renderBooks();
    toast(message);
}
renderMenu();
