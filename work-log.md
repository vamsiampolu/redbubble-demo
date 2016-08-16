44There is an API that exports XML. They expect the application to be structured like this:

```
<Route path="/" component="HomePage">
  <IndexRoute components={indexGallery:IndexGallery, cameraLinks:CameraLinks}/>
  <Route path="/camera/:make" component={MakePage}/>
    <IndexRoute component={CameraMake}
    <Route path="/:model" component={CameraModel}/>
  </Route>
   <Route path="/:id" component={ImagePreview}/>
</Route>
```

> React static site generation tools were not very satisfactory because they need to understand our webpack config

First the data is in xml, it needs to be converted to json.

The data consists of an array of works, each work looks like this:

```
{
  id:Number,
  filename:String,
  image_width:Number,
  image_height:Number
  urls:{
    url:[
      {
        -type:small|medium|large,
        #text:URL
      }
    ]
  },
  exif:{
    model:optional(String),
    make:optional(String),
    ...rest
  }
}
```

Index page:

 + needs to have a Gallery containing the thumbnails provided for the first ten works.
 + needs to have a Navigation containing each make and every model for the make

> The expectation is that the user can get to any make and any model using the navigation provided.

Make page:

+ needs to have a Gallery containing the thumbnails provided for the first ten works for the make

+ needs to have a Navigation containing the models for the camera make

Model page:

 + needs to have a Gallery containing the thumbnails for the first ten works for the model
  + needs to have navigation for the camera make and the index page

So, each Page has a Title, a Navigation and a Gallery component.

The shape of the application state should look like:

```
{
  allMakes:[String]
  [make]:{
    allModels:[String],
    [model]:{
      allIds:[Number]
      [id]:{
        urls:{
          allSizes:[String]
          [size]:URL
        },
        exif:{
          ...all data
        }
      }
    },
  },
  allIds:[Number]
}
```

I have added allIds to the top of the application state because we will be reaching for the first 10 thumbnails from the index page and it would be better if we had that info available at the top of the structure as well as within the application.

If an item has no make or model, it will not be stored seperately within `byMake` or `byModel`, it can be represented within the allIds list and can be retrieved from there as required.

The api has no support for CORS, so I used the heroku `cors-anywhere` endpoint. I also used `co` and generators to flatten out my fetch request, the co library accepts a generator and returns a Promise. I want to use the pure.css tool to build the components for the application.

The module `xml2json` was used to convert the output of the api request from `xml` to `json`.

+ Page

  + Gallery

     + Thumbnail

  + Navigation

     + MenuItem

  + Header

+ ImagePreview
   + Image
   + ExifTable

+ Error
  + Message
  + Navigation to home page if error is recoverable


We can take a model and retrieve a page

First build the app with the mock data, we can follow it up with a set of template string creating functions that can be used to generate the markup.
Once we have the markup generated, we need to write it to a file.

The model is ready and the markup generators exist, I need to wire them up. I need to convert a model to a function, I can then go on and add a navigation to make.

I think the directory structure matters when we are building links between static html pages:

  root directory
    index.html
    makes
      make
        model1.html
        model2.html
        model3.html

In order to navigate to the home page from the model, use the `../../index.html`

In order to navigate to the make page from model, go to the './index.html'

In order to navigate to a model from a make, use `${model.html}`

In order to navigate from a make to the index page use `../../index.html`

The home page is where things truly start to get interesting, here we have a nested side-navigation menu which contains all makes with nested models.
Granted, the menu looks appalling because I spent so little time on it, it will work correctly.

The static site generator will have a command-line-interface where the user has to tell us:

+ what is the url they would like to call for the make by passing in the --url option, the short option can be -u

+ what is the directory where they would like to generate the output to --output, the short option for this should be -o

We need sane defaults for both of these. I pick `./site` for the directory and the url I have been given for the url option.

And ofcourse, as is traditional with cli apps, we need to provide a `--help`, short arg will be `-h`

```
Options
  -h --help
```


I have been recommended `commander` by the good folks on the gitter nodejs channel for building the cli. We might want to add `minimist` later if we needs to parse args
commander generates `help` automatically given the info.
---
