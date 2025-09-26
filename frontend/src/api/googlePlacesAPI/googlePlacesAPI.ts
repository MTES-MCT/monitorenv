import { debounce } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

export const useGooglePlacesAPI = (search: string | undefined) => {
  const [results, setResults] = useState<Options[]>([])

  const runSearch = useCallback((query: string | undefined) => {
    const onSearch = () => {
      if (query) {
        const setResultsAsOptions = (suggestions: any[]) => {
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
          body: JSON.stringify({
            includedRegionCodes: ['fr', 'gf', 'pf', 'tf', 'nc', 'bl', 're', 'mf', 'pm', 'wf'],
            input: query
          }),
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
            setResultsAsOptions(suggestions)
          })

        return
      }
      setResults([])
    }

    onSearch()
  }, [])

  const debouncedSearch = useMemo(() => debounce(runSearch, 300), [runSearch])

  useEffect(() => {
    debouncedSearch(search)

    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch, search])

  return results
}
