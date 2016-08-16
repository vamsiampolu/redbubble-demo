//@flow

import extractModels from './models'
import uniq from 'lodash/fp/uniq'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import curry from 'lodash/fp/curry'
import compose from 'lodash/fp/compose'

import type {Work,Make} from '../types'

const makeExists = (work:Work) : boolean => work.exif.make != null

const pluckMake = (work:Work) :?string =>  {
  if(work.exif.make != null) {
    return  work.exif.make
  }
}

export const getAllMakes = compose(
  uniq,
  map(pluckMake),
  filter(makeExists)
)


const getByMake = curry((make:?string,work:Work):boolean => {
  if(work!=null && work.exif !=null && work.exif.make != null) {
    return work.exif.make === make
  }
  return false
})

const extractModelsByMake = curry((make:?string,works:Work) => {

  const getModelsByMake = compose(
    extractModels,
    filter(getByMake(make))
  )

  return getModelsByMake(works)
})



const extractMakes = (works:Array<Work>) :Make => {
  const allMakes:Array<string> = getAllMakes(works)
  const reduceByMake = (state = {},{ exif: { model, make ='none'}}:{exif: {model:?string,make:string}}):Make => {
    if(state[make] == null) {
      state[make] ={}
    }
    if(state[make].allModels == null) {
      if(model !=null) {
        state[make].allModels = [model]
      } else {
        state[make].allModels = []
      }
    } else {
      if(model !=null && state[make].allModels.includes(model) === false) {
        state[make].allModels = [
          ...state[make].allModels,
          model
        ]
      }
    }
    const byModel = extractModelsByMake(make)(works)
    state[make].byModel = byModel
    return state
  }

  const byMake = (make:?string) => {
    const getForMakes = compose(
      reduce(reduceByMake,{}),
      filter(getByMake(make))
    )
    return getForMakes(works)
  }

  const fromAllMakes = compose(
    uniq,
    map(byMake)
  )

  return Object.assign.apply({},fromAllMakes(allMakes))
}

export default extractMakes
