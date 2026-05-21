import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetState } from '../types';

const DEFAULT_PET: PetState = {
  health: 100,
  hunger: 100,
  cleanliness: 80,
  mood: 100,
  level: 1,
  exp: 0,
  coins: 20,
  lastFed: 0,
  lastPetted: 0,
  lastBathed: 0,
};

const HUNGER_DECAY_PER_POINT_MS = 2 * 60 * 1000;
const CLEAN_DECAY_MS = 8 * 60 * 1000;
const FEED_COOLDOWN = 30 * 60 * 1000;
const PET_COOLDOWN = 5 * 60 * 1000;
const BATH_COOLDOWN = 60 * 60 * 1000;

interface PetStore {
  pet: PetState;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;

  tick: () => void;
  feed: () => boolean;
  petAction: () => boolean;
  bathe: () => boolean;
  grantExp: (amount: number) => void;
  getExpForNextLevel: () => number;
  getPetStage: () => 'puppy' | 'adult' | 'mature';
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      pet: { ...DEFAULT_PET },
      panelOpen: false,

      setPanelOpen: (open) => set({ panelOpen: open }),

      tick: () => {
        const { pet } = get();
        if (pet.health <= 0) return;
        const now = Date.now();

        let hunger = pet.hunger;
        let cleanliness = pet.cleanliness;
        let health = pet.health;
        let changes = false;

        const hungerDecay = Math.floor((now - (pet.lastFed || now)) / HUNGER_DECAY_PER_POINT_MS);
        if (hungerDecay > 0 && hunger > 0) {
          hunger = clamp(hunger - hungerDecay, 0, 100);
          changes = true;
        }

        const cleanDecay = Math.floor((now - (pet.lastBathed || now)) / CLEAN_DECAY_MS);
        if (cleanDecay > 0 && cleanliness > 0) {
          cleanliness = clamp(cleanliness - cleanDecay, 0, 100);
          changes = true;
        }

        if (hunger < 10) {
          health = clamp(health - 2, 0, 100);
          changes = true;
        }
        if (cleanliness < 10) {
          health = clamp(health - 1, 0, 100);
          changes = true;
        }

        const mood = clamp(Math.round((hunger + cleanliness) / 2), 0, 100);

        if (changes) {
          set({ pet: { ...pet, hunger, cleanliness, health, mood } });
        }
      },

      feed: () => {
        const { pet } = get();
        if (pet.coins < 10) return false;
        const now = Date.now();
        if (pet.lastFed && now - pet.lastFed < FEED_COOLDOWN) return false;
        set({
          pet: {
            ...pet,
            hunger: clamp(pet.hunger + 30, 0, 100),
            coins: pet.coins - 10,
            lastFed: now,
            mood: clamp(Math.round((clamp(pet.hunger + 30, 0, 100) + pet.cleanliness) / 2), 0, 100),
          },
        });
        return true;
      },

      petAction: () => {
        const { pet } = get();
        const now = Date.now();
        if (pet.lastPetted && now - pet.lastPetted < PET_COOLDOWN) return false;
        const newMood = clamp(pet.mood + 20, 0, 100);
        set({
          pet: {
            ...pet,
            mood: newMood,
            lastPetted: now,
          },
        });
        return true;
      },

      bathe: () => {
        const { pet } = get();
        if (pet.coins < 20) return false;
        const now = Date.now();
        if (pet.lastBathed && now - pet.lastBathed < BATH_COOLDOWN) return false;
        const newClean = clamp(pet.cleanliness + 40, 0, 100);
        set({
          pet: {
            ...pet,
            cleanliness: newClean,
            coins: pet.coins - 20,
            lastBathed: now,
            mood: clamp(Math.round((pet.hunger + newClean) / 2), 0, 100),
          },
        });
        return true;
      },

      grantExp: (expAmount) => {
        const { pet } = get();
        if (pet.health <= 0) return;
        let { exp, level, coins } = pet;
        exp += expAmount;
        coins += expAmount > 5 ? 8 : 3;
        const needed = 100;
        while (exp >= needed) {
          exp -= needed;
          level += 1;
        }
        set({ pet: { ...pet, exp, level, coins } });
      },

      getExpForNextLevel: () => 100,

      getPetStage: () => {
        const { pet } = get();
        if (pet.level < 5) return 'puppy';
        if (pet.level < 15) return 'adult';
        return 'mature';
      },
    }),
    {
      name: 'cutie-pet-state',
      partialize: (state) => ({
        pet: state.pet,
      }),
    },
  ),
);
