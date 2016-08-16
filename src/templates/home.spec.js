import { expect } from 'chai'
import { getMenuItemByMake, getMenuForHome, getGalleryForHome, buildHomePage } from './home'

const mockData = require('../../mock-processed-response.json')

describe('home page', function () {
  it('builds menu items for a make', function () {
    const makeName = 'Canon'
    const byMake = mockData.byMake
    const actual = getMenuItemByMake(byMake, makeName)
    const expected = {
      link: makeName,
      url: './Canon/index.html',
      children: [
        {
          link: 'Canon EOS 20D',
          url: './Canon/Canon EOS 20D.html'
        },
        {
          link: 'Canon EOS 400D DIGITAL',
          url: './Canon/Canon EOS 400D DIGITAL.html'
        }
      ]
    }

    expect(actual).to.deep.equal(expected)
  })

  it('builds menu items for all makes', function () {
    const input = mockData
    const actual = getMenuForHome(input)
    expect(actual.menuItems.length).to.equal(input.allMakes.length)
    expect(actual.menuItems[0].link).to.equal('NIKON CORPORATION')
    expect(actual.menuItems[0].children).to.deep.equal([
      {
        link: 'NIKON D80',
        url: './NIKON CORPORATION/NIKON D80.html'
      }
    ])
  })

  // we needed to use the first ten ids but we did not...
  it('builds a gallery of the first ten works', function () {
    const input = {
      allIds: mockData.allIds.slice(0, 10),
      byId: mockData.firstTenIds
    }
    const actual = getGalleryForHome(input)
    expect(actual.thumbnails.length).to.equal(10)
    const expectedFragment = {
      alt: '31820',
      src: 'http://ih1.redbubble.net/work.31820.1.flat,300x300,075,f.jpg'
    }
    expect(actual.thumbnails[0]).to.deep.equal(expectedFragment)
    expect(actual.thumbnails[2].alt).to.equal('240509')
  })

  it('builds a representation for the home page', function () {
    const input = mockData
    const input2 = {
      allIds: mockData.allIds.slice(0, 10),
      byId: mockData.firstTenIds
    }
    const expected = {
      menu: getMenuForHome(input),
      gallery: getGalleryForHome(input2)
    }
    const actual = buildHomePage(input)
    expect(actual.gallery).to.deep.equal(expected.gallery)
    expect(actual.menu).to.deep.equal(expected.menu)
    expect(actual.title).to.be.ok
    expect(actual.title).to.be.a('string')
  })
})
