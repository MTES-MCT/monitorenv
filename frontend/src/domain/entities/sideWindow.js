export const sideWindowMenu = {
  MISSIONS: {
    name: 'Missions',
    code: 'MISSIONS'
  },
}


// SideWindowRouter doesn't have a switch behavior (i.e. renders all routes that matches)
// be careful to write routes that never collides 
// (i.e. 'missions/new' would collide with 'missions/:id' -> rewritten to 'missions_new' or '/missions/new/' used with strict + exact)
export const sideWindowPaths = {
  HOME: '/',
  MISSIONS: '/missions/',
  MISSION: '/missions/:id',
  NEW_MISSION: '/missions/new/',
}
