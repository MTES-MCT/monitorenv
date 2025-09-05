import { useEffect, useState, useMemo, useRef, type MutableRefObject } from 'react'

const GOOGLEMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const GOOGLEMAPS_SCRIPT_BASEURL = `https://places.googleapis.com/v1/places:autocomplete`

export const getPlaceCoordinates = (placeId: string) => {
  const queryparams = new URLSearchParams({ key: import.meta.env.FRONTEND_GOOGLEMAPS_API_KEY, place_id: placeId })
  const queryURL = `${GOOGLEMAPS_GEOCODE_URL}?${queryparams.toString()}`

  return fetch(queryURL)
    .then(r => r.json())
    .then(d => {
      if (d.status === 'OK') {
        const bbox = d.results[0].geometry.viewport

        return {
          bbox: [bbox.southwest.lng, bbox.southwest.lat, bbox.northeast.lng, bbox.northeast.lat]
        }
      }

      return undefined
    })
}

export type Place = {
  placeId: number
  text: {
    text: string
  }
}

type Options = {
  label: string
  value: {
    id: number
    name: string
  }
}

export const useGooglePlacesAPI = search => {
  const [results, setResults] = useState<Options[]>([])
  const abortControlerRef = useRef() as MutableRefObject<AbortController>

  const throttledSearch = useMemo(() => {
    const onSearch = async query => {
      if (abortControlerRef.current) {
        abortControlerRef.current.abort()
      }
      abortControlerRef.current = new AbortController()

      if (query) {
        const setResultsCallback = (suggestions: any[]) => {
          if (!suggestions) {
            return
          }
          setResults(
            suggestions
              .filter(
                ({ placePrediction }: { placePrediction: Place }) =>
                  !!placePrediction.text.text && !!placePrediction.placeId
              )
              .map(({ placePrediction }: { placePrediction: Place }) => ({
                label: placePrediction.text.text,
                value: {
                  id: placePrediction.placeId,
                  name: placePrediction.text.text
                }
              }))
          )
        }
        fetch(GOOGLEMAPS_SCRIPT_BASEURL, {
          body: JSON.stringify({ input: query }),
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': import.meta.env.FRONTEND_GOOGLEMAPS_API_KEY
          },
          method: 'POST'
        })
          .then(response => {
            if (response.status !== 200) {
              return undefined
            }

            return response.json()
          })
          .then(data => {
            if (!data) {
              setResults([])

              return
            }

            const { suggestions } = data
            setResultsCallback(suggestions)
          })

        return
      }
      setResults([])
    }

    return searchQuery => onSearch(searchQuery)
  }, [])

  useEffect(() => {
    throttledSearch(search)

    return () => {
      abortControlerRef.current.abort()
    }
  }, [search, throttledSearch])

  return results
}
