import { useSearchVesselsQuery } from '@api/vesselApi'
import { toOptions } from '@features/Vessel/utils'
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
    setOptions(toOptions(vesselsFound))
  }, [vesselsFound])

  return { options }
}
