// store/profileStore.ts
import { create } from 'zustand'

type ProfileState = {
    isProfileComplete: boolean
    setProfileComplete: (value: boolean) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
    isProfileComplete: false,
    setProfileComplete: (value) => set({ isProfileComplete: value }),
}))
