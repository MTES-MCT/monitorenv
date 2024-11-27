type TrackEvent = {
  action: string
  category: string
  name: string
}

type Tracking = {
  trackEvent: (event: TrackEvent) => void
  trackPage: (pageTitle: string) => void
}

/**
 * Wrapper of UseMatomo script injected in `index.html`.
 *
 *
 * @see https://developer.matomo.org/guides/tracking-javascript-guide
 */
export function useTracking(): Tracking {
  /* eslint-disable no-underscore-dangle */
  return {
    trackEvent: ({ action, category, name }) => {
      window._paq?.push(['trackEvent', category, action, name])
    },
    trackPage: pageTitle => {
      window._paq?.push(['setDocumentTitle', pageTitle])
      window._paq?.push(['trackPageView'])
    }
  }
  /* eslint-enable no-underscore-dangle */
}
