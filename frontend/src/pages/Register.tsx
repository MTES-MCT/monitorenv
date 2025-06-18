import { Button } from '@mtes-mct/monitor-ui'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

export function Register() {
  const navigate = useNavigate()
  const goToLoginPage = () => {
    navigate('/login')
  }

  return (
    <Wrapper>
      Merci de contacter{' '}
      <a href="mailto:monitor@beta.gouv.fr?subject=Création de compte MonitorEnv">monitor@beta.gouv.fr</a> pour accéder
      à MonitorEnv avec Cerbère.
      <Button onClick={goToLoginPage}>Retourner à la page de connexion</Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  color: white;
  font-size: 13px;
  text-align: center;
  width: 100vw;
  padding-top: 43vh;
  height: 100vh;
  overflow: hidden;

  background: url('landing_background.png') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`
