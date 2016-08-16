//@flow

import uniq from 'lodash/fp/uniq'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import curry from 'lodash/fp/curry'
import compose from 'lodash/fp/compose'

import extractByIds from './ids'
import type {Work,Model} from '../types'

const modelExists = (work:Work) : boolean => {
  return work.exif.model !=null
}

const pluckModel = (work:Work) : ?string => {
  if(work.exif.model!=null) {
    return work.exif.model
  }
}

const getAllModels = compose(
   uniq,
   map(pluckModel),
   filter(modelExists)
)

const filterByModel = curry((model:?string,work:Work):boolean => {
  if(work.exif.model != null) {
    return work.exif.model === model
  }
  return false
})

const extractIdsByModel = curry((model:string,works:Array<Work>) => {
    return compose(
    extractByIds,
    filter(filterByModel(model))
  )(works)
})

const extractModels = (works:Array<Work>):Model => {

  const aggregateIdsByModel = (state = {},{ id, exif: { model = 'none' } } : { id: string, exif:{ model:string } } ) => {
    if(state[model] == null) {
      state[model] = {}
    }
    if(state[model].allIds == null) {
      state[model].allIds = [id]
    } else {
      state[model].allIds = [...state[model].allIds,id]
    }
    const byId = extractIdsByModel(model,works)
    state[model].byId = byId
    return state
  }

  const byModel = (model:string = 'none') => {
   const getForModels = compose (
      reduce(aggregateIdsByModel,{}),
      filter(filterByModel(model))
  )
   return getForModels(works)
 }

  const allModels:Array<Work> = getAllModels(works)
  const resolveModels = compose(
    uniq,
    map(byModel)
  )

  return Object.assign.apply({},
    resolveModels(allModels)
  )
}

export default extractModels
