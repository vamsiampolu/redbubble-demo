//@flow

import {Size,ById,Thumbnail,Gallery,ByMake,MenuItem,Page,Id,Menu} from '../types'
import map from 'lodash/fp/map'
import curry from 'lodash/fp/curry'
import buildPage from './page'

const getConvertIdToThumbnail = curry(
  ({ byId, size = 'medium' }: { byId:ById, size:Size }, idNumber:string):Thumbnail => {
    const id:Id = byId[idNumber]
    return {
      alt:idNumber,
      src:id.urls[size]
    }
  }
)

export const getGalleryForHome = ({allIds,byId}:{allIds:Array<string>,byId:ById},size:Size = 'medium'):Gallery => {

  const convertIdToThumbnail = getConvertIdToThumbnail({byId,size})
  const thumbnails = map(convertIdToThumbnail,allIds)
  return {
    thumbnails
  }
}

export const getMenuItemForModel = curry(
  (makeName:string,modelName:string):MenuItem => ({
    link: modelName,
    url:`./${makeName}/${modelName}.html`
  })
)

//get the menu for each make and use nested menu items here
export const getMenuItemByMake = curry(
    (byMake:ByMake,makeName:string):MenuItem  => {
    const make = byMake[makeName]
    const { allModels } = make
    const menuItemByModel = getMenuItemForModel(makeName)
    const children = map(menuItemByModel,allModels)
    const link = makeName
    const url = `./${makeName}/index.html`
    return { link, url, children }
  }
)

export const getMenuForHome = ({allMakes,byMake}:{allMakes:Array<string>,byMake:ByMake}):Menu => {
  const menuItemByMake = getMenuItemByMake(byMake)
  const menuItems = map(menuItemByMake,allMakes)
  return {
    title:'Works App',
    menuItems
  }
}

export const buildHomePage = (input:Object,size:string = 'medium'):Page => {
  const allIds = input.allIds.slice(0,10)
  const byId = input.firstTenIds
  const menu = getMenuForHome(input)
  const gallery = getGalleryForHome({byId,allIds},size)
  const title = 'Home Page'
  return {menu,gallery,title}
}

const renderHome = (input:Object,size:string = 'medium'):string => {
  const page = buildHomePage(input,size)
  const pageStr = buildPage(page)
  return pageStr
}

export default renderHome
