import React from 'react'

import { paths } from '../../paths'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="fr-header" role="banner">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <MinistryLogo />
                  </div>
                </div>
                <div className="fr-header__service">
                  <p className="fr-header__service-title">MonitorEnv</p>
                  <p className="fr-header__service-tagline">
                    Appuyer, orienter et coordiner les unités concourant à la surveillance et au contrôle de
                    l&apos;environnement marin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer className="fr-footer" id="footer" role="contentinfo">
        <div className="fr-container">
          <div className="fr-footer__body">
            <div className="fr-footer__brand">
              <MinistryLogo />
            </div>
            <div className="fr-footer__content">
              <p className="fr-footer__content-desc">
                Centre d&apos;appui au contrôle de l&apos;environnement marin (CACEM)
              </p>
              <ul className="fr-footer__content-list">
                {['info.gouv.fr', 'service-public.fr', 'legifrance.gouv.fr', 'data.gouv.fr'].map(domain => (
                  <li key={domain} className="fr-footer__content-item">
                    <a
                      className="fr-footer__content-link"
                      href={`https://${domain}`}
                      rel="noopener external noreferrer"
                      target="_blank"
                      title={`${domain} - nouvelle fenêtre`}
                    >
                      {domain}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href={paths.accessibilityStatement}>
                  Accessibilité : non conforme
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

function MinistryLogo() {
  return (
    <p className="fr-logo">
      Ministère
      <br />
      chargé de la mer
      <br />
      et de la pêche
    </p>
  )
}
