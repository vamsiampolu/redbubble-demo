import { expect } from 'chai'
import { buildMenuItem } from './menuItem'
import jsdom from 'jsdom'

describe('build menu items', function () {
  it('creates a menu item without children', function () {
    const link = 'godzilla'
    const expected = `<li class="pure-menu-item">godzilla</li>`
    const actual = buildMenuItem(link)
  })

  it('creates a pure menu with children', function () {
    const link = 'monsters'
    const children = [
      {
        link: 'godzilla'
      },
      {
        link: 'yeti'
      },
      {
        link: 'loch ness'
      }
    ]
    const input = {
      link,
    children}
    let actual = buildMenuItem(input)
    jsdom.env(actual, function (error, window) {
      expect(window.querySelector('.pure-menu-has-children').length).to.equal(1)
      expect(window.querySelector('.pure-menu-has-children')[0].classList.contains('pure-menu-allow-hover')).to.equal(true)
      expect(window.querySelector('.pure-menu-children').length).to.equal(1)
    })
  })

  it('can build an entire menu', function () {
    const link = 'monsters'
    const menuItems = [
      {
        link: 'godzilla',
        children: [
          {
            link: 'Godzilla(1954)'
          }
        ]
      },
      {
        link: 'yeti'
      },
      {
        link: 'loch ness'
      }
    ]
    const input = {
      link,
    menuItems}
    let actual = buildMenuItem(input)
    jsdom.env(actual, function (error, window) {
      expect(window.document.querySelector('.pure-menu').length).to.equal(1)
      expect(window.document.querySelector('.pure-menu-title')[0].tagName).to.equal('a')
      expect(window.document.querySelector('.pure-menu-title')[0].innerText).to.equal(link)
      expect(window.document.querySelector('.pure-menu-list').length).to.equal(1)
      const firstMenuItem = window.document.querySelector('.pure-menu-item')[0]
      const firstMenuItemChildren = firstMenuItem.querySelector('.pure-menu-children')
      const firstChild = firstMenuItemChildren.querySelector('li')[0]
      expect(firstMenuItemChildren.tagName).to.equal('ul')
      expect(firstMenuItemChildren.querySelector('li').length).equals(1)
      expect(firstChild.querySelector('a').innerText).equals('Godzilla(1954)')
      expect(firstMenuItem.classList.contains('pure-menu-has-children')).to.equal(true)
      expect(firstMenuItem.classList.contains('pure-menu-allow-hover')).to.equal(true)

      expect(window.document.querySelector('.pure-menu-children').length).to.equal(1)
    })
  })
})
