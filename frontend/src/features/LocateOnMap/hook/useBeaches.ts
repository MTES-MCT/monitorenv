import { getBeachesFromAPI } from '@api/beachesAPI'
import { useEffect, useState } from 'react'

type Options = {
  label: string
  value: string
}

export const useBeaches = () => {
  const [options, setOptions] = useState<Options[]>([])
  const [beaches, setBeaches] = useState<any[]>([])

  useEffect(() => {
    getBeachesFromAPI()
      .then(values => {
        setBeaches(values)
        setOptions(
          values.map(value => {
            const label = `${value.properties.name}${
              value.properties.official_name ? `, ${value.properties.official_name}` : ''
            }${value.properties.postcode ? `, ${value.properties.postcode}` : ''}`

            return {
              label,
              value: {
                id: value.id,
                name: label
              }
            }
          })
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [])

  return { beaches, options }
}
