import { expect } from 'chai'
import { buildMenuForMake, convertMakeToGallery, buildPageFromMake } from './make'

const processedResponse = require('../../mock-processed-response.json')

describe('template for make', function () {
  it('creates a side navigation menu for all models', function () {
    const makeName = processedResponse.allMakes[0]
    const make = processedResponse.byMake[makeName]
    const modelName = make.allModels[0]
    const actual = buildMenuForMake(makeName, make)
    const expected = {
      title: makeName,
      menuItems: [
        {
          link: modelName,
          url: `./${modelName}.html`
        }
      ]
    }
    expect(actual).to.deep.equal(expected)
  })

  it('creates a gallery for all ids for the make', function () {
    const makeName = processedResponse.allMakes[0]
    const make = processedResponse.byMake[makeName]
    const actual = convertMakeToGallery(make, 'medium')
    const expected = {
      thumbnails: [
        {
          src: 'http://ih1.redbubble.net/work.31820.1.flat,300x300,075,f.jpg',
          alt: '31820'
        }
      ]
    }
    expect(expected).to.deep.equal(actual)
  })

  it('creates a page for the given make', function () {
    const makeName = processedResponse.allMakes[0]
    const make = processedResponse.byMake[makeName]
    const modelName = make.allModels[0]

    const expected = {
      menu: {
        title: makeName,
        menuItems: [
          {
            link: modelName,
            url: `./${modelName}.html`
          }
        ]
      },
      gallery: {
        thumbnails: [
          {
            src: 'http://ih1.redbubble.net/work.31820.1.flat,300x300,075,f.jpg',
            alt: '31820'
          }
        ]
      },
      title: makeName
    }

    const actual = buildPageFromMake('medium', make, makeName)
    expect(actual).to.deep.equal(expected)
  })
})
