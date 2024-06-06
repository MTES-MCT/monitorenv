export type UserAuthorizationData = {
  isSuperUser: boolean
}

export type UserAuthorization = {
  isLogged: boolean | undefined
  isSuperUser: boolean | undefined
  mustReload: boolean | undefined
}
