import { getBeachesFromAPI } from '@api/beachesAPI'
import { useEffect, useState } from 'react'

type Options = {
  label: string
  value: number
}

export const useBeaches = () => {
  const [options, setOptions] = useState<Options[]>([])
  const [beaches, setBeaches] = useState<any[]>([])
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    getBeachesFromAPI()
      .then(values => {
        setBeaches(values)
        setOptions(
          values.map(value => ({
            label: `${value.properties.name}, ${value.properties.official_name}, ${value.properties.postcode}`,
            value: value.id
          }))
        )
      })
      .catch(() => {
        setError('Erreur lors de la récupération des plages')
      })
  }, [])

  return { beaches, error, options }
}
