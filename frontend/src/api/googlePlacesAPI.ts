import _ from 'lodash'
import { useEffect, useState, useMemo, useRef, MutableRefObject } from 'react'

const GOOGLEMAPS_API_KEY = process.env.REACT_APP_GOOGLEMAPS_API_KEY

const GOOGLEMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

export const getPlaceCoordinates = placeId => {
  // @ts-ignore
  // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
  // URLSearchParams() constructor accepts "a record of string keys and string values."
  const queryparams = new URLSearchParams({ key: GOOGLEMAPS_API_KEY, place_id: placeId })
  const queryURL = `${GOOGLEMAPS_GEOCODE_URL}?${queryparams.toString()}`

  return fetch(queryURL)
    .then(r => r.json())
    .then(d => {
      const bbox = d.results[0].geometry.bounds

      return [bbox.southwest.lng, bbox.northeast.lat, bbox.northeast.lng, bbox.southwest.lat]
    })
}

export type Place = {
  description: string
  place_id: number
}
type Options = {
  label: string
  value: string
}

export const useGooglePlacesAPI = search => {
  const [results, setResults] = useState<Options[]>([])
  const abortControlerRef = useRef() as MutableRefObject<AbortController>

  const throttledSearch = useMemo(() => {
    const throttled = _.throttle(
      async query => {
        if (abortControlerRef.current) {
          abortControlerRef.current.abort()
        }
        abortControlerRef.current = new AbortController()

        if (query) {
          const setResultsCallback = (
            // @ts-ignore
            predictions: google.maps.places.QueryAutocompletePrediction[] | null,
            // @ts-ignore
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              return
            }
            setResults(predictions.map(r => ({ label: r.description, value: r.place_id })))
          }

          const service = new google.maps.places.AutocompleteService()

          service.getQueryPredictions({ input: query }, setResultsCallback)

          return
        }
        console.log('reset')
        setResults([])
      },
      500,
      {
        leading: true,
        trailing: true
      }
    )

    return searchUrl => throttled(searchUrl)
  }, [])

  useEffect(() => {
    throttledSearch(search)

    return () => {
      abortControlerRef.current.abort()
    }
  }, [search, throttledSearch])

  return results
}
