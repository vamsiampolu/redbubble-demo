//@flow
import {writeFile} from 'fs-promise'
import path from 'path'
import renderModel from '../templates/model'
import curry from 'lodash/fp/curry'
import type {ByModel,Model} from '../types'

const getGenerateModelPage =  curry(
  (outputPath:string,byModel:ByModel,modelName:string):Promise<any> => {
    const model:Model = byModel[modelName]
    const modelStr = renderModel('medium',model,modelName)
    const fileName = `${modelName}.html`
    const filePath = path.join(outputPath,fileName)
    return writeFile(filePath,modelStr)
  }
)

export default getGenerateModelPage
