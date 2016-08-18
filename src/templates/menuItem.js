//@flow

import map from 'lodash/fp/map'
import join from 'lodash/fp/join'
import compose from 'lodash/fp/compose'
import type {Menu,MenuItem} from '../types'

const buildSimpleMenuItem = ({link,url}: {link:string,url:string}):string => (`<li class="pure-menu-item"><a class="pure-menu-link" href="${url}">${link}</a></li>`)

  const buildMenuHelper = compose( join(''), map(buildMenuItem) )

// the implementation of build menu item has to change to accomadate the new menu

export function buildMenuItem (menuItem:MenuItem):string {
  let res;

  if(menuItem.children != null && menuItem.children.length) {
    let childMenu = buildMenuHelper(menuItem.children)
    res = `<li class="pure-menu-item pure-menu-has-children">
        <a class="pure-menu-link" href="${menuItem.url}">${menuItem.link}</a>
        <ul class="pure-menu-children">
          ${childMenu}
        </ul>
      </li>`
  } else {
    res = buildSimpleMenuItem(menuItem)
  }
  return res
}

const buildToggle = (title:string) => (`
  <div class="pure-u-1 pure-u-md-1-3">
    <div class="pure-menu">
      <div class="pure-menu-heading custom-brand">${title}</div>
      <a href="#" class="custom-toggle" id="toggle"><s class="bar"></s><s class="bar"></s></a>
    </div>
  </div>
`)




const buildMenu = (menu:Menu):string => {
  const brand = buildToggle(menu.title)
  const children = buildMenuHelper(menu.menuItems)
  return `
      ${brand}
      <div class="pure-u-1 pure-u-md-1-3">
        <div class="pure-menu pure-menu-horizontal custom-menu-3 custom-can-transform" style="position:absolute; top:0.45em;">
          <ul class="pure-menu-list">
            ${children}
          </ul>
        </div>
      </div>
    `
}

export default buildMenu
