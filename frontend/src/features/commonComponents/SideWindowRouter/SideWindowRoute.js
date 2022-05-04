import React from 'react'
import { useSelector } from 'react-redux'
import { matchPath } from 'react-router-dom'


// SideWindowRouter doesn't have a switch behavior (i.e. renders all routes that matches)
// be careful to write routes that never collides 
// (i.e. 'missions/new' would collide with 'missions/:id' -> rewritten to 'missions_new' or '/missions/new/' used with strict + exact)

// Unlike original Route component, exact and strict are default to true,
// so it's easier to use non-colliding routes
/**
 * 
 * @param {string} path 
 * @param {boolean} exact 
 * @param {boolean} strict 
 * @returns 
 */
export const SideWindowRoute = ({path, exact = true, strict = true, children}) => {
  const { sideWindowPath } = useSelector(state => state.sideWindowRouter)

  const routeParams = matchPath(sideWindowPath, {
    path,
    exact,
    strict
  })
  
  return routeParams ? 
    React.Children.map(children, (child) =>
      React.cloneElement(child, {routeParams})
    ) 
    : null
}