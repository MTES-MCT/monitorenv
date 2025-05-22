import { isEmpty, throttle } from 'lodash-es'
import { useEffect, useState, useMemo, useRef, type MutableRefObject } from 'react'

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search'

export type Place = {
  address: {
    country?: string
    country_code?: string
    county?: string
    hamlet?: string
    house_number?: string
    isolated_dwelling?: string
    municipality?: string
    natural?: string
    place?: string
    quarter?: string
    road?: string
    state?: string
    town?: string
    village?: string
  }
  boundingbox: number[]
  class: string
  display_name: string
  icon: string
  importance: number
  lat: string
  licence: string
  lon: string
  osm_id: number
  osm_type: string
  place_id: number
  type: string
}

export const useNominatimAPI = (search, { limit = 10 } = {}) => {
  const [results, setResults] = useState<Place[]>([])
  const abortControlerRef = useRef() as MutableRefObject<AbortController>

  const throttledSearch = useMemo(() => {
    const throttled = throttle(
      query => {
        if (abortControlerRef.current) {
          abortControlerRef.current.abort()
        }
        abortControlerRef.current = new AbortController()

        if (query) {
          const searchParams = {
            addressdetails: 1,
            countrycodes: 'fr',
            format: 'json',
            limit,
            q: query
          }

          // @ts-ignore
          // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
          // URLSearchParams() constructor accepts "a record of string keys and string values."
          const queryparams = new URLSearchParams(searchParams)
          const queryURL = `${NOMINATIM_API_URL}?${queryparams.toString()}`

          return fetch(queryURL, { signal: abortControlerRef.current.signal })
            .then(r => r.json())
            .then(data => setResults(isEmpty(data) ? [{ display_name: 'Pas de résultats' }] : data))
        }

        return setResults([])
      },
      500,
      {
        leading: true,
        trailing: true
      }
    )

    return searchUrl => throttled(searchUrl)
  }, [limit])

  useEffect(() => {
    throttledSearch(search)

    return () => {
      abortControlerRef.current.abort()
    }
  }, [search, throttledSearch])

  return results
}
