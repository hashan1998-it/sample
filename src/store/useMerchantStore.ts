// store/useMerchantStore.ts
import { create } from 'zustand'

interface MerchantStore {
    merchantId: string | null
    setMerchantId: (id: string) => void
    clearMerchantId: () => void
}

const useMerchantStore = create<MerchantStore>((set) => ({
    merchantId: '67efb6b174a576558e0aae82',
    setMerchantId: (id) => set({ merchantId: id }),
    clearMerchantId: () => set({ merchantId: null }),
}))

export default useMerchantStore
