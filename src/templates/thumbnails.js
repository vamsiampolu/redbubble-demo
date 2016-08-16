import map from 'lodash/fp/map'
import join from 'lodash/fp/join'
import compose from 'lodash/fp/compose'
import type {Thumbnail,Gallery} from '../types'



export const createThumbnail = (thumbnail:Thumbnail):string => (`<div class="pure-u-1-4">
    <img class="pure-img-responsive" src="${thumbnail.src}" alt="${thumbnail.alt}"/>
  </div>`)

const createThumbnailHelper = compose(
  join(''),
  map(createThumbnail)
)

export {createThumbnailHelper as createThumbnails}

const buildGallery = (gallery:Gallery):string => {
  const thumbnailStr = createThumbnailHelper(gallery.thumbnails)
  return `<div class="pure-g">${thumbnailStr}</div>`
}

export default buildGallery
