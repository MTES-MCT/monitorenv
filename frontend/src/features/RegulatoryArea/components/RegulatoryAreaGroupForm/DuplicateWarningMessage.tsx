import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { Bold } from '@components/style'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '@features/BackOffice/components/BackofficeMenu/constants'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import { Accent, Button, Level, Message } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

export function DuplicateWarningMessage({ id, layerName, location }: RegulatoryArea.RegulatoryAreaGroupToApi) {
  const navigate = useNavigate()
  const { setFieldError } = useFormikContext<RegulatoryArea.RegulatoryAreaGroupToApi>()
  const [hasSeveralDuplicates, setHasSeveralDuplicates] = useState<boolean>(false)
  const [hasOneDuplicate, setHasOneDuplicate] = useState<boolean>(false)
  const { data: layerNames } = useGetLayerNamesQuery()

  const duplicatesCount = useMemo(
    () =>
      layerNames?.filter(
        group =>
          group.group.layerName.toLowerCase().trim() === layerName?.toLowerCase().trim() &&
          group.group.location?.toLowerCase().trim() === location?.toLowerCase().trim() &&
          group.group.id !== id
      )?.length ?? 0,
    [layerNames, layerName, location, id]
  )

  useEffect(() => {
    if (duplicatesCount >= 1) {
      setFieldError('layerName', 'Type and location already exists')
      setFieldError('location', 'Type and location already exists')
      setHasOneDuplicate(duplicatesCount === 1)
      setHasSeveralDuplicates(duplicatesCount > 1)
    }
  }, [duplicatesCount, setFieldError])

  const goToGroup = () => {
    const groupId = layerNames?.find(
      group =>
        group.group.layerName.toLowerCase().trim() === layerName?.toLowerCase().trim() &&
        group.group.location?.toLowerCase().trim() === location?.toLowerCase().trim()
    )?.group.id
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.REGULATORY_AREA_GROUP]}/${groupId}`)
    setHasSeveralDuplicates(false)
    setHasOneDuplicate(false)
  }

  const validateDuplicate = () => {
    setFieldError('layerName', undefined)
    setFieldError('location', undefined)
    setHasOneDuplicate(false)
  }

  return (
    <>
      {hasOneDuplicate && (
        <Message level={Level.WARNING} style={{ marginTop: '16px' }}>
          <p>
            <strong>Attention</strong>
            <br />
            <Bold>1 autre groupe</Bold> avec ce <Bold>même lieu et type</Bold> existe déjà. Êtes-vous sûr de vouloir en
            créer un autre ?
          </p>
          <Actions>
            <Button accent={Accent.WARNING} onClick={validateDuplicate}>
              Oui, je suis sûr•e
            </Button>
            <Button accent={Accent.WARNING} onClick={goToGroup}>
              Non, m&apos;emmener au groupe
            </Button>
          </Actions>
        </Message>
      )}
      {hasSeveralDuplicates && (
        <Message level={Level.WARNING} style={{ marginTop: '16px' }}>
          <p>
            <strong>Attention</strong>
            <br />
            <Bold>{duplicatesCount} autres groupes</Bold> avec ce <Bold>même lieu et type</Bold> existent déjà.
            Êtes-vous sûr de vouloir en créer un autre ?
          </p>
          <Actions>
            <Button accent={Accent.WARNING} onClick={() => {}}>
              Non, annuler la création du groupe
            </Button>
          </Actions>
        </Message>
      )}
    </>
  )
}

const Actions = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  margin-top: 16px;
`
