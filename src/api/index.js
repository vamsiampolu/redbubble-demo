//@flow

import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import uniq from 'lodash/fp/uniq'
import compose from 'lodash/fp/compose'
import curry from 'lodash/fp/curry'

import extractMakes,{getAllMakes} from './makes'
import {extractByIdsForFirstTenWorks} from './ids'

import type {Work,WorkUrl,Model,Make,Id,ProcessedInput} from '../types.js'


const getId = (work:Work):string => work.id
const getAllIds = map(getId)


export default function handleWorksResponse ({works:{work}} :{works:{work:Array<Work>}}):ProcessedInput {
  const allMakes:Array<string> = getAllMakes(work)
  const allIds:Array<string> = getAllIds(work)
  const byMake = extractMakes(work)
  const firstTenIds = extractByIdsForFirstTenWorks(work)
  return {
    allMakes,
    allIds,
    byMake,
    firstTenIds
  }
}
