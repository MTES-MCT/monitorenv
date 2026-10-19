import { Layout } from '@components/Dsfr/Layout'
import { PageWrapper } from '@components/style'
import styled from 'styled-components'
import '@gouvfr/dsfr/dist/dsfr.min.css'

// For lazy loading
// eslint-disable-next-line import/no-default-export
export default function AccessibilityStatement() {
  return (
    <PageWrapper>
      <Layout>
        <Main className="fr-container fr-py-6w" id="content">
          <h1>Déclaration d’accessibilité</h1>
          <p>
            Établie le <span>14 septembre 2026</span>.
          </p>
          <p>
            <span>
              Le Ministre de la Transition écologique, de la Biodiversité et des Négociations internationales sur le
              climat et la nature
            </span>{' '}
            s’engage à rendre son service accessible, conformément à l’article 47 de la loi n° 2005-102 du 11 février
            2005.
          </p>
          <p>
            Cette déclaration d’accessibilité s’applique à <strong>MonitorEnv </strong>
            <span>
              (<span>https://monitorenv.din.developpement-durable.gouv.fr/</span>)
            </span>
            .
          </p>
          <h2>État de conformité</h2>
          <p>
            <strong>MonitorEnv </strong>
            est{' '}
            <strong>
              <span data-printfilter="lowercase">non conforme</span>
            </strong>{' '}
            avec le <abbr title="Référentiel général d’amélioration de l’accessibilité">RGAA</abbr>.{' '}
            <span>
              Le site n’a encore pas été audité.
              <br />
            </span>
          </p>
          <h2>Amélioration et contact</h2>
          <p>
            Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le responsable de
            <span> MonitorEnv </span>
            pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.
          </p>
          <ul className="basic-information feedback h-card">
            <li>
              E-mail&nbsp;: <a href="mailto:monitor@beta.gouv.fr">monitor@beta.gouv.fr</a>
            </li>

            <li>
              Adresse&nbsp;: <span>40 Av. Louis Bougo, 56410 Étel</span>
            </li>
          </ul>
          <p>
            Nous essayons de répondre dans les
            <span> 2 jours ouvrés</span>.
          </p>
          <h2>Voie de recours</h2>
          <p>
            Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au responsable du site internet
            un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous
            n’avez pas obtenu de réponse satisfaisante.
          </p>
          <p>Vous pouvez&nbsp;:</p>
          <ul>
            <li>
              Écrire un message au <a href="https://formulaire.defenseurdesdroits.fr/">Défenseur des droits</a>
            </li>
            <li>
              Contacter{' '}
              <a href="https://www.defenseurdesdroits.fr/saisir/delegues">
                le délégué du Défenseur des droits dans votre région
              </a>
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:
              <br />
              Défenseur des droits
              <br />
              Libre réponse 71120 75342 Paris CEDEX 07
            </li>
          </ul>
          <hr />
          <p>
            Cette déclaration d’accessibilité a été créée le <span>14 septembre 2026</span> grâce au{' '}
            <a href="https://betagouv.github.io/a11y-generateur-declaration/#create">
              Générateur de Déclaration d’Accessibilité
            </a>
            .
          </p>
        </Main>
      </Layout>
    </PageWrapper>
  )
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
