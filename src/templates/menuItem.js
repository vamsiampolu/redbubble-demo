//@flow

import map from 'lodash/fp/map'
import join from 'lodash/fp/join'
import compose from 'lodash/fp/compose'
import type {Menu,MenuItem} from '../types'

const buildSimpleMenuItem = (link:string):string => (`<li class="pure-menu-item">${link}</li>`)

  const buildMenuHelper = compose( join(''), map(buildMenuItem) )

export function buildMenuItem (menuItem:MenuItem):string {
  let res;

  if(menuItem.children != null && menuItem.children.length) {
    let childMenu = buildMenuHelper(menuItem.children)
    res = `<li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <a href="${menuItem.url}">${menuItem.link}</a>
        <ul class="pure-menu-children">
          ${childMenu}
        </ul>
      </li>`
  } else {
    res = buildSimpleMenuItem(menuItem.link)
  }
  return res
}


const buildMenu = (menu:Menu):string => {
  const children = buildMenuHelper(menu.menuItems)
  return `<div class="pure-menu">
      <div class="pure-menu-heading">${menu.title}</div>
      <ul class="pure-menu-list">
        ${children}
      </ul>
    </div>`
}

export default buildMenu
