import { expect } from '@jest/globals'
import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { ReportingDateRangeEnum } from 'domain/entities/dateRange'
import { ControlStatusEnum, ReportingTypeEnum, StatusFilterEnum, type Reporting } from 'domain/entities/reporting'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'

import { filter } from './filterReportings'

describe('filter', () => {
  describe('date range', () => {
    const status = [StatusFilterEnum.IN_PROGRESS]
    it('should return true when reporting is within the day', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(true)
    })

    it('should return false when reporting is not within the day', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(false)
    })

    it('should return true when reporting is within the week', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.WEEK, status })).toEqual(true)
    })

    it('should return false when reporting is not within the week', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().subtract(1, 'week').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.WEEK, status })).toEqual(false)
    })
    it('should return true when reporting is within the month', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.MONTH, status })).toEqual(true)
    })

    it('should return false when reporting is not within the month', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().subtract(1, 'month').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.MONTH, status })).toEqual(false)
    })
    it('should return true when reporting is within the year', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.YEAR, status })).toEqual(true)
    })

    it('should return false when reporting is not within the year', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().subtract(1, 'year').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.YEAR, status })).toEqual(false)
    })

    it('should return true when reporting is within the specific period', async () => {
      // Given
      const period: DateAsStringRange = [
        `${customDayjs().utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        `${customDayjs().utc().add(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      ]
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.CUSTOM, period, status })).toEqual(true)
    })

    it('should return false when reporting is not within the specific period', async () => {
      // Given
      const period: DateAsStringRange = [
        `${customDayjs().utc().subtract(3, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        `${customDayjs().utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm')}:00.000Z`
      ]
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.CUSTOM, period, status })).toEqual(false)
    })
  })
  describe('in progress reporting', () => {
    const status = [StatusFilterEnum.IN_PROGRESS]
    it('should return true when reporting is in progress and within validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        validityTime: 1
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(true)
    })

    it('should return false when reporting is in progress and out of validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().subtract(2, 'hours').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        validityTime: 1
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(false)
    })
  })
  describe('archived reporting', () => {
    const status = [StatusFilterEnum.ARCHIVED]
    it('should return true when reporting is archived and within validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(true)
    })

    it('should return false when reporting is archived and out of validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true,
        validityTime: 1
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(false)
    })
  })

  describe('archived and in progress', () => {
    const status = [StatusFilterEnum.ARCHIVED, StatusFilterEnum.IN_PROGRESS]
    it('should return true when reporting is archived and in progress', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(true)
    })

    it('should return true when reporting is archived and in progress and out of (archived) validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        isArchived: true,
        validityTime: 1
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(true)
    })
    it('should return true when reporting is archived and in progress and out of (in progress) validity time', async () => {
      // Given
      const reporting: Reporting = aReporting({
        createdAt: `${customDayjs().utc().subtract(2, 'hours').format('YYYY-MM-DDTHH:mm')}:00.000Z`,
        validityTime: 1
      })

      // When & then
      expect(filter(reporting, { dateRange: ReportingDateRangeEnum.DAY, status })).toEqual(true)
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
  validityTime: 0,
  vehicleType: undefined,
  withVHFAnswer: undefined,
  ...reporting
})
