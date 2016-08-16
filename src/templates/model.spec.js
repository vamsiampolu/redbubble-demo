import { expect } from 'chai'
import { getMenuForModel, convertModelToGallery, convertModelToPage } from './model'

var mockProcessedResponse = require('../../mock-processed-response.json')

describe('renders a model as html', function () {
  it('creates a navigation menu for model', function () {
    const modelName = mockProcessedResponse.byMake['NIKON CORPORATION'].allModels[0]
    const actual = getMenuForModel(modelName)
    const expected = {
      menuItems: [
        {
          url: './index.html',
          link: 'Make'
        },
        {
          url: '../../index.html',
          link: 'Home'
        }
      ],
      title: modelName
    }

    expect(actual).to.deep.equal(expected)
  })

  it('creates a thumbnail gallery for the model', function () {
    const expected = {
      thumbnails: [
        {
          src: 'http://ih1.redbubble.net/work.31820.1.flat,300x300,075,f.jpg',
          alt: '31820'
        }
      ]
    }
    const modelName = mockProcessedResponse.byMake['NIKON CORPORATION'].allModels[0]
    const actual = convertModelToGallery(mockProcessedResponse.byMake['NIKON CORPORATION'].byModel[modelName])
    expect(actual).to.deep.equal(expected)
  })

  it('converts a model to a page', function () {
    const modelName = mockProcessedResponse.byMake['NIKON CORPORATION'].allModels[0]
    const expected = {
      menu: {
        menuItems: [
          {
            url: './index.html',
            link: 'Make'
          },
          {
            url: '../../index.html',
            link: 'Home'
          }
        ],
        title: modelName
      },

      gallery: {
        thumbnails: [
          {
            src: 'http://ih1.redbubble.net/work.31820.1.flat,300x300,075,f.jpg',
            alt: '31820'
          }
        ]
      },
      title: modelName
    }
    const actual = convertModelToPage(mockProcessedResponse.byMake['NIKON CORPORATION'].byModel[modelName], 'medium', modelName)
    console.dir(actual)
    expect(actual).to.deep.equal(expected)
  })
})
