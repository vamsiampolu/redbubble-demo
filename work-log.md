There is an API that exports XML. They expect the application to be structured like this:

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

Now, I will need to build the directory structure with the options provided by commander. So that would be something of type:

```
export type CLIOptions = {
  size:Size,
  outputDir:string,
  url:string
}
```

I will use this to create a series of directories like:

```
  outputDir
          |_
            index.html
            makes
                |_[make]
                       |_
                          [model.html]
                          index.html

```

Create a file module whose job is to write to the file system, it will consist of:

  + model.js
  + make.js
  + index.js

Now, we need to find a good promise based abstraction over the fs module. The module `fs-promise` sounds promising.
I will not wrap every function I need with a `promisify` call manually. Figure out the `fs` methods that I will need to accomplish my tasks:

fs.stats to check if rootDir exists
fs.mkdir to create a directory
fs.writeFile to write to the output

If a directory already exists we need to recursively remove all of its contents and leave it as an empty directory. One option would be `rimraf` but I want to
allow the user to restore these files if they feel the need to do so. The module `trash` by sindresorhus is promising(pun intended).

All functions within the module will be curried so that they can be used later with composition.
I will use generator functions to work with multiple async operations.

generateModelPage :: dirPath:string -> byModel:ByModel -> modelName:string
generateMakePage :: dirPath:string -> byMake:ByMake -> makeName:string

I added a `home` module inside `file` to create code to build home pages.

generateModelPagesByMake :: dirPath:string -> byMake:ByMake -> makeName:string

The generateModelPage writes a `[model].html` file and returns a Promise. Here we have to assume that
a directory has already been created for the make.

Now, this is where things start getting tricky:

generateModelPageByMake accepts the path of the `[make]` directory and creates all the models within it
by mapping over `allModels` using `generateModelPage` which returns an `Array<Promise>. Here, we wrap the `Array<Promise>`
so that it can resolve only when all models have been written to disk like any sane person would.

Again, we assume that the make directory has been created in the function above. The next step would be to create the make directory.
This is accomplished using the `createDirectoryForMake` directory.

The next step is to build a `generator` that gives me a simple way of workinng with both of the operations above. That is accomplished by generrateMakePage.
I have no idea what the `writeFile` or `mkdir` would return to indicate success of the operation or any issue that resulted in a non-catastrophic failure.

Also, no error handling at the moment. I might have to do something about that but let me finish building the `index.js`:

If we were to return a generator from the default export of `make.js` as originally planned, it would become nessecary to deal with an array of
generators, we have no mechanism that can handle such a construct with ease. Thus, it becomes nessecary to invoke the magic of `co` to convert
the generator to a Promise. And we know how to deal with an Array<Promise>

Also, I renamed `index.js` to `app.js` because it cannot be held responsible for cleaning any files already existing within the directory. The `index.js` module
will rely on `app.js` and `clean.js` to get its work done.

> the functions below are not curried.

generateMakes :: dirPath:string -> {allMakes:Array<string>,byMake:ByMake} -> Promise
createRootDirectory :: string -> Promise
generateApp :: dirPath:string -> {allMakes:Array<string>,byMake:ByMake} -> Promise

generateApp uses both createRootDirectory as well as generateMakes inside a generator function which is then wrrapped by co and returned as a promise.

If a file does not exist, `fs.stat` throws an error of type `ENOENT`, the clean module must assume that `root directory` exists. This would mean that a seperate `clean` module is unnessecary as we can do it as a function within `index.js`. Also, it becomes a simple function that returns a Promise.

I have all the mechanism nessecary for generating a static site except for one, I have yet to build a single line to create the `index.html` file for each `make` and the home page. This is a large oversight and I need to fix this by create a module that writes homepages to disk, I will call it `home`(done)

I can test the whole app now, ATM there are a few worrying things:

1. flow has no clue about currying(so a lot of my types are for ornamental??)

2. I have not unit tested `file` because I have no clue regarding the approach, to be fair
I know sinon is involved and mocking promises is involved with sinon-as-promised.

But the question remains, what should I resolve writeFile to on success and what should I reject it with to simulate an error.
Given that the objective is to create files and directories should we mock that away.

To run a command-line script using `node`, I used:

```
#!/usr/bin/env node
```

at the top of `src/index.js`, it will now be able to run my app on the command line. I can export my app as a command line application using:

```
{
"bin":"./src/index.js"
}
```

However, it will not recognize `import` statements as they are not supported by `node`. This is where webpack steps in, I used this [blog post](http://jlongster.com/Backend-Apps-with-Webpack--Part-I) to set up bundling of the backend using `babel-loader`.

commander works now but we forgot to create the `makes` directory if it did not already exist, there was a stupid issue that I spent too much time debugging, I posted it on stackoverflow and wasted other people's time as well:

http://stackoverflow.com/questions/39008214/issue-with-mkdirp-from-fs-promise-and-co

Had an issue with the makes directory being added twice when creating the makeHomePage. It is sad to notice that fs module returns `undefined` when an operation succeeds.

Not seeing the home page, I get the makes directory with the models underneath it and the models along with it's `index.html`. Fixed that, no issues there.

I will take our static-site for a spin. The menu is abhorrant as expected, I have to change that. There is another unexpected issue though, when loading the make page from home, it goes directly to a `:makeName` folder. Had to fix that, did not update tests to reflect the change.

Also, the make page menu does not have the link to the model page. I have to fix this first before I move on to the other issues. The issue was with the function buildSimpleMenuItem in templates/menuitem only using `link` and not the `url` part of `menuItem`. Fixed that.

FIX THE MENU --> MAKE IT A VERTICAL MENU WITH DROPDOWNS FOR ALL I CARE. The template will change in `page.js`. (Done successfully)

---
