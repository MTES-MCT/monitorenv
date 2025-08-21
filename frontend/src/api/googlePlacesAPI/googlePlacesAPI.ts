import _ from 'lodash'
import { type MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

import { loadGoogleMapScript } from './utils'

const GOOGLEMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const GOOGLEMAPS_SCRIPT_BASEURL = `https://maps.googleapis.com/maps/api/js`
const GOOGLEMAPS_SCRIPT_URL = `${GOOGLEMAPS_SCRIPT_BASEURL}?key=${
  import.meta.env.FRONTEND_GOOGLEMAPS_API_KEY
}&libraries=places`

export const getPlaceCoordinates = (placeId: string) => {
  // @ts-ignore
  // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
  // URLSearchParams() constructor accepts "a record of string keys and string values."
  const queryparams = new URLSearchParams({ key: import.meta.env.FRONTEND_GOOGLEMAPS_API_KEY, place_id: placeId })
  const queryURL = `${GOOGLEMAPS_GEOCODE_URL}?${queryparams.toString()}`

  return fetch(queryURL)
    .then(r => r.json())
    .then(d => {
      if (d.status === 'OK') {
        const bbox = d.results[0].geometry.viewport

        return [bbox.southwest.lng, bbox.southwest.lat, bbox.northeast.lng, bbox.northeast.lat]
      }

      return undefined
    })
}

export type Place = google.maps.places.QueryAutocompletePrediction & {
  description: string
  place_id: number
}

type Options = {
  label: string
  value: number
}

export const useGooglePlacesAPI = search => {
  const autoCompleteService = useRef<google.maps.places.AutocompleteService>()

  const [results, setResults] = useState<Options[]>([])
  const abortControlerRef = useRef() as MutableRefObject<AbortController>

  useEffect(() => {
    loadGoogleMapScript(GOOGLEMAPS_SCRIPT_BASEURL, GOOGLEMAPS_SCRIPT_URL).then(() => {
      autoCompleteService.current = new google.maps.places.AutocompleteService()
    })
  }, [])

  const throttledSearch = useMemo(() => {
    const throttled = _.throttle(
      async query => {
        if (abortControlerRef.current) {
          abortControlerRef.current.abort()
        }
        abortControlerRef.current = new AbortController()

        if (query) {
          const setResultsCallback = (
            predictions: google.maps.places.QueryAutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              return
            }
            setResults(
              predictions
                .filter((p): p is Place => !!p.description && !!p.place_id)
                .map(p => ({ label: p.description, value: p.place_id }))
            )
          }

          autoCompleteService.current?.getQueryPredictions({ input: query }, setResultsCallback)

          return
        }
        setResults([])
      },
      300,
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
