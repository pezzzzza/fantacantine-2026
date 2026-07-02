'use client'

import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#14213d]">
      <Loader2 className="h-12 w-12 animate-spin text-[#e8c46a]" />
      <p className="mt-4 text-[#f5efe6]/60 text-sm animate-pulse">
        Caricamento...
      </p>
    </div>
  )
}
