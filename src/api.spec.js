/* eslint-env mocha */
import { expect } from 'chai'
const mockData = require('../mock-data.json')
import handleWorksResponse from './api/index.js'

describe('handleWorksResponse', function () {
  it('retrieves a deduplicated list of all makes', () => {
    const response = handleWorksResponse(mockData)
    const actual = response['allMakes']
    const expected = ['NIKON CORPORATION', 'Canon', 'FUJIFILM', 'LEICA', 'FUJI PHOTO FILM CO., LTD.', 'Panasonic']
    expect(actual).to.deep.equal(expected)
  })

  it('retrieves a list of all ids', () => {
    const response = handleWorksResponse(mockData)
    const actual = response.allIds
    const expected = [
      '31820',
      '2041',
      '240509',
      '26583',
      '2729606',
      '2828069',
      '3201430',
      '3502552',
      '3745978',
      '3775226',
      '512919',
      '4250369',
      '777577',
      '867035'
    ]

    expect(actual).to.deep.equal(expected)
  })

  it('retrieves a deduplicated list of all models by make', function () {
    const response = handleWorksResponse(mockData)
    const allMakes = ['NIKON CORPORATION', 'Canon', 'FUJIFILM', 'LEICA', 'FUJI PHOTO FILM CO., LTD.', 'Panasonic']
    const actual = response.byMake
    const modelsByMake = {
      'NIKON CORPORATION': {
        allModels: [
          'NIKON D80'
        ]
      },
      'Canon': {
        allModels: [
          'Canon EOS 20D',
          'Canon EOS 400D DIGITAL'
        ]
      },
      'FUJIFILM': {
        allModels: [
          'FinePix S6500fd'
        ]
      },
      'LEICA': {
        allModels: [
          'D-LUX 3'
        ]
      },
      'FUJI PHOTO FILM CO., LTD.': {
        allModels: [
          'SLP1000SE'
        ]
      },
      'Panasonic': {
        allModels: [
          'DMC-FZ30'
        ]
      }
    }
    allMakes.map(function (make) {
      expect(actual[make].allModels).to.deep.equal(modelsByMake[make].allModels)
    })
  })

  it('has a nested object for each model within the make', function () {
    const response = handleWorksResponse(mockData)
    expect(response.byMake['NIKON CORPORATION'].byModel['NIKON D80']).to.be.ok
    expect(response.byMake['NIKON CORPORATION'].byModel['NIKON D80'].allIds).to.be.instanceOf(Array)
    expect(response.byMake['NIKON CORPORATION'].byModel['NIKON D80'].allIds).to.deep.equal(['31820'])
  })

  it('has a nested object for all ids for each model within make', function () {
    const response = handleWorksResponse(mockData)
    const model = response.byMake['LEICA'].byModel['D-LUX 3']
    const byId = model.byId
    expect(model.allIds.length).to.equal(5)
    model.allIds.map(id => {
      expect(byId[id]).to.be.ok
      expect(byId[id].urls).to.be.ok
      expect(byId[id].urls.allSizes.length).to.equal(3)
      expect(byId[id].urls.allSizes).to.deep.equal(['small', 'medium', 'large'])
      const allSizes = byId[id].urls.allSizes
      allSizes.map(size => {
        expect(byId[id].urls[size]).to.be.ok
      })
    })
  })
})
