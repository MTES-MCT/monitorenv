import { Link as ALink } from './Link'

export default {
  component: ALink,
  title: 'MonitorEnv/Link'
}

function Template({ name }) {
  return (
    <>
      <ALink>{name}</ALink>
      <br />
      <ALink tagUrl>{name}</ALink>
    </>
  )
}

export const Link = Template.bind({})
Link.args = {
  name: 'Décret n° 2012-507 du 18 avril 2012 créant le Parc national des Calanques'
}
