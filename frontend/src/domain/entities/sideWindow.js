export const sideWindowMenu = {
  MISSIONS: {
    code: 'MISSIONS',
    name: 'Missions'
  }
}

// SideWindowRouter doesn't have a switch behavior (i.e. renders all routes that matches)
// be careful to write routes that never collides
// (i.e. 'missions/new' would collide with 'missions/:id' -> rewritten to 'missions_new' or '/missions/new/' used with strict + exact)
export const sideWindowPaths = {
  HOME: '/',
  MISSION: '/missions/:id',
  MISSION_NEW: '/missions/new/',
  MISSIONS: '/missions/'
}
