import { expect } from 'chai'
import jsdom from 'jsdom'
import buildGallery, { createThumbnail } from './thumbnails'

describe('thumbnails', function () {
  it('creates a single thumbnail', function () {
    const input = {
      src: 'image',
      alt: 'value'
    }
    const actual = createThumbnail(input)
    jsdom.env(actual, function (error, window) {
      expect(window.document.querySelector('.pure-u-1-4').length).to.equal(1)
      expect(window.document.querySelector('.pure-img-responsive').length).to.equal(1)
      expect(window.document.querySelector('.pure-img-responsive').tagName.toLowerCase()).to.equal('img')
      const image = document.querySelector('img.pure-img-responsive')
      expect(image.getAttribute('src')).to.equal('image')
      expect(image.getAttribute('alt')).to.equal('value')
    })
  })

  it('creates a gallery of thumbnails', function () {
    const input = {
      thumbnails: [
        {
          src: 'image1',
          alt: 'value1'
        },
        {
          src: 'image2',
          alt: 'value2'
        }
      ]
    }
    const actual = buildGallery(input)
    jsdom.env(actual, function (error, window) {
      const document = window.document
      expect(document.querySelector('pure-g').length).to.equal(1)
      const images = document.querySelector('img')
      expect(images.length).to.equal(2)
    })
  })
})
