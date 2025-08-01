import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { Accent, Button, customDayjs, Icon, Size } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

export function ValidatedAt({
  disabled,
  onValidate,
  readOnly = false,
  validatedAt
}: {
  disabled: boolean
  onValidate: () => void
  readOnly?: boolean
  validatedAt: string | undefined
}) {
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()

  const isSuperUser = useMemo(() => user?.isSuperUser, [user])

  const nbMonths = useMemo(() => {
    const now = customDayjs().utc()
    const validatedAtDate = customDayjs(validatedAt).utc()

    return (
      (now.year() - validatedAtDate.year()) * 12 +
      now.month() -
      validatedAtDate.month() -
      (now.date() > validatedAtDate.date() ? 1 : 0)
    )
  }, [validatedAt])

  return (
    <>
      {validatedAt && (
        <StyledValidatedAt>
          <StyledDates>
            Validée le {customDayjs(validatedAt).utc().format('DD/MM/YY')}.{' '}
            <LastValidation $warning={nbMonths >= 6}>{nbMonths >= 3 && `(${nbMonths} mois)`}</LastValidation>
          </StyledDates>
          {isSuperUser && !readOnly && (
            <Button
              accent={Accent.SECONDARY}
              data-cy="vigilance-area-validate"
              disabled={disabled}
              Icon={Icon.Check}
              onClick={onValidate}
              size={Size.SMALL}
            >
              Revalider
            </Button>
          )}
        </StyledValidatedAt>
      )}
    </>
  )
}

const StyledDates = styled.p<{ $warning?: boolean }>`
  font-style: italic;
  color: ${p => (p.$warning ? p.theme.color.maximumRed : p.theme.color.slateGray)};
`

const LastValidation = styled.span<{ $warning?: boolean }>`
  color: ${p => (p.$warning ? p.theme.color.maximumRed : p.theme.color.slateGray)};
`

const StyledValidatedAt = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
