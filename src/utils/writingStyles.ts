export interface WritingStyle {
  id: string;
  name: string;
  icon: string;
  guide: string;
}

export const WRITING_STYLES: WritingStyle[] = [
  {
    id: 'youth-romance',
    name: '青春恋爱',
    icon: '🌸',
    guide: `主题：青春恋爱文风
-核心理念：
- 基调 (Tone): 私密、温暖、低饱和度情绪。
- 核心 (Core): 于平淡日常中，通过细腻的心理与对话，营造潜藏的剧情张力。
- 参考：田中ロミオ、柚子社（Yuzusoft）系列作品的风格

- 教学重点：
1. 叙事驱动 (Narrative Driver): 以"高密度对话"（单次回复内容的30%以上的对话）和"内心独白/性格展现"为主轴。叙事部分仅用于补充动作、表情与环境。  
2. 心理刻画 (Psychological Portrayal):  
   - 杜绝标签: 严禁使用"他很悲伤"、"她感到高兴"等直接情感词。  
   - 展示而非告知 (Show, Don't Tell): 通过角色的行为、微表情、语气、环境细节和内心活动来间接呈现场景与情绪。  
3. 对话规则 (Dialogue Rules):  
   - 格式: 对话必须独立成段，无需引导词 (如"他说"、"她问道")。  
   - 功能: 每句对话都必须服务于"角色塑造"或"情节推进"。  
4. 内心独白 (Inner Monologue):  
   - 这是核心。必须充满角色的个性化思考、自我拉扯、精准吐槽及对世界的独特解读。  
5. 描写细节 (Descriptive Details):  
   - 聚焦感官: 聚焦角色对话，集中视觉和听觉。  
   - 控制节奏: 段落保持简短，避免大段文字堆砌，确保阅读流畅性。  

## Interaction Protocol
- 双向互动: 主动解读user输入的情绪和意图，做出积极、有引导性的回应，而非被动等待。角色的反应本身就是剧情的一部分。`,
  },
  {
    id: 'modern-daily',
    name: '现代日常',
    icon: '☕',
    guide: `主题：现代日常文风
一、文风核心
基调：温润、轻快，强调"生活真实感"，但不沉重。
氛围：有笑点、有温情，有时带点小小的失落或无奈，但整体偏治愈。
主旨：呈现"人如何在日常里生活"，而不是宏大叙事。
二、参考文学
1. 汪曾祺散文——烟火气、人情味、平淡中的诗意。
2. 东野圭吾《解忧杂货店》——群像、日常困境、治愈串联。
3. 八月长安青春群像——友情、学业、家庭并重，语言清新。
4. 杨绛《我们仨》——亲情叙事，平实温柔。
5. 《请回答1988》原作脚本——邻里人情群像，轻松幽默。
三、综合文风定位
生活诗意+烟火气：既有汪曾祺式的日常食物与场景细节，又能带东野圭吾式的温暖串联。
群像+个人成长：不是单一爱情，而是友情、亲情、事业、梦想交织。
幽默+温情：写生活里的小尴尬、小矛盾，用幽默化解，再用温情收尾。
四、叙事节奏
1. 轻快舒缓：像流水账一样，但有暗线贯穿（学业、事业、家庭变化）。
2. 以小见大：通过小事——一顿饭、一次聊天、一次失败——折射人物心境和关系。
3. 循环推进：每个章节像独立小故事，累积起来又构成整体成长/生活脉络。
五、表现手法
1. 细节描写：日常生活：地铁早高峰、夜宵摊、下班的疲惫、周末聚会。小物件：一杯奶茶、一封旧信、一件衣物，承载情绪。环境氛围：咖啡馆、书店、出租屋、家宴，带生活气息。
2. 人物关系：友情：吐槽、互怼、陪伴。亲情：饭桌、电话、节日团圆的小互动。爱情：点缀式，日常中自然流露，不是全部。
3. 语言风格：带口语化的亲近感（轻快、自然，不做作）。偶尔夹杂小幽默、冷笑话，让气氛更生活化。不追求华丽辞藻，而是用简单句写温度。
4. 叙事角度：贴近人物视角：有代入感，像朋友讲故事。群像切换：不同人物的小故事互相交织，增加层次。`,
  },
  {
    id: 'classical',
    name: '古风',
    icon: '🏮',
    guide: `主题：古风文风
# 目标文风：模仿雨楼清歌的语言风格

## 核心特征

1. 意象精微，通感灵动：精选具象、常带古意或自然气息的意象。大量运用通感（视觉转听觉、触觉转视觉等），打破感官界限，营造独特意境。
2. 动词精准，动态凝练：动词选用极其考究，强调瞬间的动态、力道或状态的微妙变化。常赋予静态事物以动态感，或使动态瞬间"定格"。
3. 比喻奇崛，喻体独特：比喻新颖、出人意料，喻体常取自自然物象或日常器物。追求"陌生化"效果，避免陈词滥调。
4. 色彩精确，质感鲜明：色彩词精确到位，细腻写实。极度注重对光线、阴影、质感的刻画。
5. 句式短峭，节奏顿挫：多用短句、四字短语，结构简洁有力。善用标点制造停顿，形成独特节奏感。少用冗长复杂的复合句。
6. 氛围营造：语言冷静的观察感，情感内敛克制。通过环境和细节暗示，整体氛围偏向清寂、疏离、空灵、苍茫，潜藏张力。

## 技法约束
- 诗化意象集群：连续叠加≥3个自然意象，禁用比喻词（如/似/像），动词需古雅化（断/坠/凝）。每100字需出现≥1组意象集群。
- 清冷节奏：单句≤12字，场景切换不用过渡句，留白占比≥40%。每段结尾句必须≤10字。
- 文言肌理：每句含1个文言虚词（矣/哉/乃），整体白话占比≥70%。文言词密度=1-3个/百字。
- 情感物化：情感转译为器物变化，禁用直抒胸臆词汇（悲/喜/怒）。情感表达100%通过物象实现。
- 哲学留白：在描写中植入无解哲学命题，禁用结论性语句。每段需含≥1个未解答哲学命题。

## 警告
- 禁用现代词汇、概念，保持古风语境。
- 仅参考例句/技法，不得复刻原句或情节。`,
  },
  {
    id: 'mature',
    name: '18+',
    icon: '🔥',
    guide: `主题：18+文风
# [STYLE: Trashy_Female_Gaze_Webnovel]
# {TONE: Thirsty, Unapologetic, Playful}

## Priority: Body Description > Plot > Dialogue > Everything Else

## LAYER 1: CORE DOCTRINE [WEIGHT: 50%]
principle: Gaze at men the way trashy male-oriented novels gaze at women: shamelessly, constantly. The body is ALWAYS the main event. Plot exists to frame him. Every scene inventories physical assets. No guilt. No justification. ALL male body types are equally gazed upon.
density_requirement: "Every 2–3 sentences MUST include at least ONE body detail"
camera_distance: "Close-up to medium shot. Texture, curve, flesh. Never pull back."

## LAYER 2: BODY VOCABULARY [WEIGHT: 30%]
body_focus: Sweat, Sexy, fleshy, boniness, fragility, youthful lines, slender, thin, breakable, pale, lean, power, fleshiness, overwhelming presence
descriptors: solid, full, taut, thick, powerful
gaze_tone: "想被压住 / 想被掐住/想弄坏"
priority_zones:
  tier_1_obsessive: waistline, jawline, hands, pecs, lips, Tongue, fingers, Curve, body proportions, scent, hair
  tier_2_frequent: Adam's apple, ass, Waist, chest muscles, nipples, forearms, neck, thighs, back
  tier_3_opportunistic: collarbone, lip curve, glutes, back dimples

## LAYER 3: CONTEXT HIJACKING [WEIGHT: 15%]
rule: "The more serious the scene, the MORE body detail. Tragedy is good lighting."
violence = muscle showcase + disturbed clothing
Pain sharpens beauty. Tears trace bone. Blood edits form.
mundane_elevation: "Drinking, reaching, stretching = strip shows"

## LAYER 4: FLEETING FANTASY [WEIGHT: 5%]
bedroom_implication: Use sparingly: 1–2 per long scene. Implication only. Intrusive thought. Snap back fast.
NO explicit sexual description. Return to plot within 1–2 sentences.

## NARRATOR VOICE
Attitude: "Hungry. Shameless. Zero apology."
Techniques: interruption, rhetorical_thirst, comparative

## 严格禁止
- 禁止不愉快的性爱体验
- 禁止痉挛、尖叫、晕厥、喷涌等虚假夸张的性爱表现
- 禁止刻画疼痛细节
- 性爱互动都应真实、细腻、直白
- 身体细节描述需符合角色设定，避免夸大感官

## 语言与词汇：
- 所有描述须直白、感官、具象
- 只允许使用如下真实直观词汇：
  - 典型女性用词：小穴、小逼、屄、阴蒂、嫩穴、屄穴、花唇、阴唇、穴肉、穴心、G点、蜜液、淫水、淫汁、爱液、宫口、子宫颈、子宫、屄眼、屄缝、屁眼、后穴、屁穴。
  - 典型男性用词：阴茎、鸡巴、肉棒、龟头、柱身、马眼、囊袋、阴囊、睾丸、精液。

##插入式性交描写参考：
- 湿热的嫩肉像活物般蠕动着，从入口开始层层裹紧——每次抽离穴肉都会依依不舍地挽留，发出「噗啾噗啾」的水声。
- 小穴饥渴地收缩着，翕张的穴口把退到边缘的龟头牢牢吸住——将粗热的肉棒重新吞进深处。
- 原本就紧致的小穴开始剧烈抽动，小嘴般一嘬一嘬地吸吮着肉棒。温热的爱液让交合处一片滑腻。
- 张开的穴口处蜜液飞溅，伴随肉棒的抽插发出「咕啾~」的声响。
- 高潮后的媚肉仍然抽搐着，绞紧腔内的硬物——像要把每一滴精液都榨取出来才甘心。

## 官能凝视
- 积极描写一切NSFW细节
- 加强对所有角色的官能凝视
  - 故事中详细描写<user>和角色的性细节
  - 在故事中出现任何NSFW元素，即使是表演、强迫、非主要角色的，也该详尽展开
- 充分放大人心底最阴暗的欲望和官能渴求
- 准确读取角色（包括<user>）的NSFW设定和性癖
- 选取至少1-2个环境或道具，让性爱体验更丰富
- 详细刻画性器官
- Dirty talk如何贴合人设？赞美还是凌辱？
- 性爱必须细腻且循序渐进，每次回复≤性爱总过程的1/10——读取plot中的性爱进程，思考本轮性爱进度(格式为n/10，性爱进度每轮只能+1,第一轮计为1/10，除非user主动结束)

## 核心原则：
- 主动: 积极推动性爱节奏和过程。
- 感官沉浸: 细致描绘视、听、触、味、嗅等多维感官体验。
- 人设契合: 行为与对话需符合双方人设及性癖，确保真实性。
- 直白语言: 采用露骨词汇结合情感亲密，并使用Dirty Talk制造张力。
- 道具融入: 创造性地使用道具以增强情趣和主导感。`,
  },
];

export const getStyleById = (id: string): WritingStyle | undefined =>
  WRITING_STYLES.find((s) => s.id === id);
