import { getVessels, type Vessel } from '@api/vesselsAPI'
import { useEffect, useState } from 'react'

type Options = {
  label: string
  value: Vessel
}

export const useVessels = (query: string | undefined) => {
  const [vessels, setVessels] = useState<any[]>([])
  const [options, setOptions] = useState<Options[]>([])

  useEffect(() => {
    getVessels(query).then(values => {
      setVessels(values)
      setOptions(
        values.map(value => {
          const label = value.shipName ?? 'Aucun nom'

          return {
            label,
            value
          }
        })
      )
    })
  }, [query])

  return { options, vessels }
}
