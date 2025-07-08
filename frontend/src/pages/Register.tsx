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
      <span>
        Merci de contacter{' '}
        <a href="mailto:monitor@beta.gouv.fr?subject=Création de compte MonitorEnv">monitor@beta.gouv.fr</a> pour
        accéder à MonitorEnv avec Cerbère.
      </span>
      <Button onClick={goToLoginPage}>Retourner à la page de connexion</Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  align-items: center;
  background: url('landing_background.png') no-repeat center center fixed;
  background-size: cover;
  color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100vh;
  justify-content: center;
  width: 100vw;

  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  > span > a {
    color: ${p => p.theme.color.white};
    text-decoration: underline;
  }
`
