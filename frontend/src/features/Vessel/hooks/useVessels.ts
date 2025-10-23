import { useSearchVesselsQuery } from '@api/vesselApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'

import type { Vessel } from '@features/Vessel/types'

type Options = {
  label: string
  value: Vessel.Identity
}

export const useVessels = (query: string | undefined) => {
  const [options, setOptions] = useState<Options[]>([])
  const { data: vesselsFound } = useSearchVesselsQuery(query && query?.length > 0 ? { searched: query } : skipToken)

  useEffect(() => {
    setOptions(
      (vesselsFound ?? []).map(value => {
        const label = value.shipName ?? 'NOM INCONNU'

        return {
          label,
          value
        }
      })
    )
  }, [vesselsFound])

  return { options }
}
