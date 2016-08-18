/*@flow*/
export type WorkUrl = {
  'type':Size,
  '_@ttribute':string
}

export type Size = 'small'|'medium'|'large'

export type Id = {
  urls:{
    allSizes:Array<string>,
    [size:Size]:string
  }
}

export type ById = {
  [id:string]:Id
}

export type WorkExif = {
  model?:string,
  make?:string
}

export type Work = {
  id:string,
  filename:string,
  image_width:number,
  image_height:number,
  urls:{
    url:Array<WorkUrl>,
  },
  exif: WorkExif
}

export type Make = {
  [make:string]:{
    allModels:Array<string>,
    byModel:Array<Model>
  }
}

export type ByMake = {
  [make:string]:Make
}

export type Url = {
  [size:Size]:string
}

export type Urls = {
  urls:{
    allSizes:Array<Size>,
    [size:Size]:string
  }
}

export type Model = {
  [model:string]:{
    allIds:Array<string>,
    [id:string]:{
      urls:Urls
    },
    exif:Object
  }
}

export type ByModel = {
  [model:string]:Model
}

export type MenuItem = {
  children?:Array<MenuItem>,
  link:string,
  url:string
}

export type Menu = {
  title:string,
  menuItems:Array<MenuItem>
}

export type Thumbnail = {
  src:string,
  alt:string
}

export type Gallery = {
  thumbnails:Array<Thumbnail>
}

export type Page = {
  menu:Menu,
  gallery:Gallery,
  title:string
}

export type CliOptions = {
  outputDir:string,
  size:Size,
  url:string
}

export type ProcessedInput = {
  allMakes:Array<string>,
  allIds:Array<string>,
  byMake:ByMake,
  firstTenIds:ById
}
