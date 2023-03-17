export const loadGoogleMapScript = (googleMapsScriptBaseUrl, googleMapsScriptUrl) => {
  const isBrowser = typeof window !== 'undefined' && window.document
  if (!isBrowser) {
    return Promise.resolve()
  }

  if (typeof google !== 'undefined') {
    if (google.maps && google.maps.places) {
      return Promise.resolve()
    }
  }

  const scriptElements = document.querySelectorAll(`script[src*="${googleMapsScriptBaseUrl}"]`)

  if (scriptElements && scriptElements.length) {
    return new Promise<void>(resolve => {
      if (typeof google !== 'undefined') {
        resolve()
      }

      scriptElements[0]?.addEventListener('load', () => resolve())
    })
  }

  const scriptUrl = new URL(googleMapsScriptUrl)
  scriptUrl.searchParams.set('callback', '__REACT_GOOGLEMAPS_API_AUTOCOMPLETE_CALLBACK__')
  const el = document.createElement('script')
  el.src = scriptUrl.toString()

  return new Promise(resolve => {
    // __REACT_GOOGLEMAPS_API_AUTOCOMPLETE_CALLBACK__ is called by googleapi script after loading
    // This resolve the promise so we are sure google.maps is initialized
    // @ts-ignore
    // eslint-disable-next-line
    window.__REACT_GOOGLEMAPS_API_AUTOCOMPLETE_CALLBACK__ = resolve
    document.body.appendChild(el)
  })
}
