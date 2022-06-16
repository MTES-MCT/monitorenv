export const infractionFactory = () => {
  return {
    registrationNumber: '',
    vehicle: '',
    size: '',
    owner: '',
    natinf: '',
    infractionType: '',
    formalNotice: '',
    relevantCourt: '',
    toProcess: '',
    observations: ''
  }
}

export const actionFactory = (actionType) => {
  return {
    actionType,
    actionStartDatetimeUtc: new Date(),
    actionEndDatetimeUtc: new Date(),
    actionTheme: '',
    actionNumberOfControls: '',
    actionTargetType: '',
    actionControlType: '',
    infractions: []
  }
}