export const infractionFactory = () => {
  return {
    natinf: '',
    observations: ''
  }
}

export const actionFactory = () => {
  return {
    actionStartDatetimeUtc: Date.now(),
    actionEndDatetimeUtc: '',
    actionTheme: '',
    actionNumberOfControls: '',
    infractions: []
  }
}