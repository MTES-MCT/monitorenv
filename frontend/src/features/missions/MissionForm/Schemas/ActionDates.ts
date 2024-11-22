import * as Yup from 'yup'

export const actionEndDateValidation = (ctx: any) =>
  Yup.string()
    .optional()
    .test({
      message: 'La date de fin doit être postérieure à celle de début de mission',
      test: value => {
        if (!ctx.from || !value) {
          return true
        }

        return new Date(value) > new Date(ctx.from[0].value.startDateTimeUtc)
      }
    })
    .test({
      message: 'La date de fin doit être antérieure à celle de fin de mission',
      test: value => {
        if (!ctx.from) {
          return true
        }
        if (!ctx.from?.[0].value.endDateTimeUtc) {
          return true
        }

        return value ? new Date(value) <= new Date(ctx.from?.[0].value.endDateTimeUtc) : true
      }
    })
    .test({
      message: 'La date de fin doit être postérieure à la date de début',
      test: value => {
        if (!ctx.from || !value) {
          return true
        }

        return new Date(value) > new Date(ctx.value.actionStartDateTimeUtc)
      }
    })

export const actionStartDateValidation = (ctx: any, isControlAction?: boolean) =>
  Yup.string()
    .optional()
    .test({
      message: `La date ${isControlAction ? '' : 'de début'} doit être postérieure à celle de début de mission`,
      test: value => {
        if (!ctx.from?.[0] || !value) {
          return true
        }

        return new Date(value) >= new Date(ctx.from?.[0].value.startDateTimeUtc)
      }
    })
    .test({
      message: `La date ${isControlAction ? '' : 'de début'} doit être antérieure à celle de fin de mission`,
      test: value => {
        if (!ctx.from) {
          return true
        }
        if (!ctx.from?.[0].value.endDateTimeUtc) {
          return true
        }

        return value ? new Date(value) <= new Date(ctx.from?.[0].value.endDateTimeUtc) : true
      }
    })
