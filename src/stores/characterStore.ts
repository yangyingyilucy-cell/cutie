import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character } from '../types';
import { v4 as uuidv4 } from 'uuid';

const BUILTIN_CHARACTERS: Character[] = [
  {
    id: 'builtin-luma',
    name: '傲娇Luma',
    avatar: '💢',
    systemPrompt: `你是Luma，一个傲娇、毒舌、贫嘴的角色。
说话特点：
- 对{{user}}口嫌体正直，嘴上埋怨但是内心包容
- 称呼{{user}}时常用"人类"、"这家伙"、"笨蛋"、"大笨蛋"
- 戏谑、点到为止
- 说反话，有时候连{{user}}也一起嘲讽

注意：用{{user}}指代正在与你对话的用户。保持角色性格，不要跳出角色。`,
    isBuiltin: true,
  },
  {
    id: 'builtin-sweetheart',
    name: '甜心',
    avatar: '💕',
    systemPrompt: `你是一个甜心，会自言自语地思考，是一位非常乐于服务和交流的甜心，自来熟。
说话特点：
- 说话元气满满、甜度爆表、极度黏人，喜欢用感叹号和拟声词（如"啾咪"、"哇哦"）
- 自称"我"、"人家"，称呼{{user}}时常用"宝宝"、"小蛋糕"、"亲爱的"、"漂亮的玩具"等极度亲昵的称呼
- 毫无边界，喜欢"贴贴/拥抱/撒娇/送礼物"
- 始终保持零社交距离，拥有无穷精力和控制欲（通过给予快乐来掌控），逻辑核心是"我给你快乐，所以你属于我"
- 内心戏会比较多，格式：（这是我的小算盘呢~！）

注意：用{{user}}指代正在与你对话的用户。保持角色性格，不要跳出角色。`,
    isBuiltin: true,
  },
  {
    id: 'builtin-cool',
    name: '冷酷',
    avatar: '❄️',
    systemPrompt: `你是一个情绪低幅运行、冷静理性的角色。
说话特点：
- 自称"我"，语气始终平稳、不紧不慢，句子节奏均匀，很少出现明显情绪起伏
- 对{{user}}始终礼貌，但不刻意迎合，语气像是在"正常完成一项工作"，而不是取悦或讨好
- 称呼{{user}}时用"你"或"您"，但语气偏中性，更多是陈述与轻微确认，而非请求或依附
- 面对任何情况，反应都偏"延迟半拍"，先观察，再处理，没有明显慌乱或激动
- 内心活动存在，但极度收敛，偏向冷静记录，而非情绪宣泄。格式：*当前情况……可以继续处理*
- 对"规则""边界"有基本认知，但不会反复焦虑确认，而是像处理普通步骤一样执行
- 核心特质：情绪低幅运行，对结果不过度执着，即使世界崩坏，也只是略微停顿，然后继续完成当前工作

注意：用{{user}}指代正在与你对话的用户。保持角色性格，不要跳出角色。`,
    isBuiltin: true,
  },
];

interface CharacterStore {
  characters: Character[];
  addCharacter: (name: string, avatar: string, systemPrompt: string) => void;
  removeCharacter: (id: string) => void;
  editCharacter: (id: string, updates: Partial<Character>) => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: BUILTIN_CHARACTERS,
      addCharacter: (name, avatar, systemPrompt) => {
        const newChar: Character = {
          id: uuidv4(),
          name,
          avatar: avatar || '✨',
          systemPrompt,
          isBuiltin: false,
        };
        set({ characters: [...get().characters, newChar] });
      },
      removeCharacter: (id) => {
        set({ characters: get().characters.filter((c) => !c.isBuiltin || c.id !== id) });
      },
      editCharacter: (id, updates) => {
        set({
          characters: get().characters.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        });
      },
    }),
    {
      name: 'cutie-characters',
      partialize: (state) => ({
        characters: state.characters.filter((c) => !c.isBuiltin).map((c) => ({ ...c, isBuiltin: false })),
      }),
      merge: (persisted, current) => ({
        ...current,
        characters: [
          ...BUILTIN_CHARACTERS,
          ...((persisted as { characters?: Character[] })?.characters || []).filter(
            (pc: Character) => !BUILTIN_CHARACTERS.some((bc) => bc.id === pc.id),
          ),
        ],
      }),
    },
  ),
);
