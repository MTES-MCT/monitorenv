export const infractionFactory = () => {
  return {
    natinf: '',
    observations: ''
  }
}

export const actionFactory = (actionType) => {
  return {
    actionType,
    actionStartDatetimeUtc: Date.now(),
    actionEndDatetimeUtc: '',
    actionTheme: '',
    actionNumberOfControls: '',
    infractions: []
  }
}