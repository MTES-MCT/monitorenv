import { expect } from '@jest/globals'
import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { ControlStatusEnum, ReportingTypeEnum, StatusFilterEnum, type Reporting } from 'domain/entities/reporting'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'

import { filterReportings } from './filterReportings'

describe('filterReportings', () => {
  const today = customDayjs().utc()
  const type = ReportingTypeEnum.INFRACTION_SUSPICION

  describe('date range', () => {
    const status = [StatusFilterEnum.IN_PROGRESS]
    it('should return true when reporting is within the day', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })

    it('should return false when reporting is not within the day', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.subtract(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(false)
    })

    it('should return true when reporting is within the week', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.WEEK, status, type })).toEqual(true)
    })

    it('should return false when reporting is not within the week', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.subtract(1, 'week').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.WEEK, status, type })).toEqual(false)
    })
    it('should return true when reporting is within the month', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.MONTH, status, type })).toEqual(true)
    })

    it('should return false when reporting is not within the month', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.subtract(1, 'month').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.MONTH, status, type })).toEqual(false)
    })
    it('should return true when reporting is within the year', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.YEAR, status, type })).toEqual(true)
    })

    it('should return false when reporting is not within the year', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.subtract(1, 'year').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.YEAR, status, type })).toEqual(false)
    })

    it('should return true when reporting is within the specific period', async () => {
      // Given
      const period: DateAsStringRange = [
        `${today.subtract(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        `${today.add(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      ]
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.CUSTOM, period, status, type })).toEqual(true)
    })

    it('should return false when reporting is not within the specific period', async () => {
      // Given
      const period: DateAsStringRange = [
        `${today.subtract(3, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        `${today.subtract(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      ]
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.CUSTOM, period, status, type })).toEqual(false)
    })
  })
  describe('in progress reporting', () => {
    const status = [StatusFilterEnum.IN_PROGRESS]
    it('should return true when reporting is in progress and within validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        validityTime: 1
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })

    it('should return false when reporting is in progress and out of validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.subtract(2, 'hours').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        validityTime: 1
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(false)
    })
  })
  describe('archived reporting', () => {
    const status = [StatusFilterEnum.ARCHIVED]
    it('should return true when reporting is archived and within validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })

    it('should return true when reporting is archived and out of validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true,
        validityTime: 2
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })
  })

  describe('archived and in progress', () => {
    const status = [StatusFilterEnum.ARCHIVED, StatusFilterEnum.IN_PROGRESS]
    it('should return true when reporting is archived and in progress', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })

    it('should return true when reporting is archived and in progress and out of (archived) validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true,
        validityTime: 1
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })
    it('should return true when reporting is archived and in progress and out of (in progress) validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${today.subtract(1, 'hours').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: false,
        validityTime: 1
      })

      // When & then
      expect(filterReportings(reporting, { dateRange: DateRangeEnum.DAY, status, type })).toEqual(true)
    })
  })
})

const aReporting = (reporting?: Partial<Reporting>) => ({
  actionTaken: undefined,
  attachedEnvActionId: '',
  attachedMission: undefined,
  attachedToMissionAtUtc: undefined,
  controlStatus: ControlStatusEnum.CONTROL_TO_BE_DONE,
  createdAt: '',
  description: undefined,
  detachedFromMissionAtUtc: undefined,
  geom: undefined,
  hasNoUnitAvailable: undefined,
  id: '',
  isArchived: false,
  isControlRequired: undefined,
  isInfractionProven: false,
  missionId: undefined,
  openBy: '',
  reportingId: undefined,
  reportingSources: [],
  reportType: ReportingTypeEnum.INFRACTION_SUSPICION,
  subThemeIds: [],
  targetDetails: [],
  targetType: ReportingTargetTypeEnum.COMPANY,
  themeId: 0,
  updatedAtUtc: undefined,
  validityTime: 1,
  vehicleType: undefined,
  withVHFAnswer: undefined,
  ...reporting
})
