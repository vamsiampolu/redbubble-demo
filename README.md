This project was built to implement the requirements provided in the take home test at: http://take-home-test.herokuapp.com/full-stack-engineer

To use the project:

1. Clone the project and install all dependencies:

    https://github.com/vamsiampolu/redbubble-demo.git

    npm install

2. Create the binary using:

    npm run rebuild

This will run `npm link` and create a locally available command line tool.
To install globally instead of locally, run `npm install -g`

3. Run the application:

    redbubble-demo --help

    redbubble-demo -u http://take-home-test.herokuapp.com/api/v1/works.xml -s medium -o www

To run the application with the default arguments shown above, you can use

    npm start

To rebuild the application and run with the default arguments use:

    npm run start:dev

A work diary was maintained for the project, [read it here](https://github.com/vamsiampolu/redbubble-demo/blob/master/work-log.md)

---

This project relies mainly on [purecss](http://purecss.io/) to structure the look and feel of the static site, liberal
use is made of ES2015 constructs include features such as generators with `babel` and `webpack` being used as the transpiler
and module bundler respectively.

I also practice functional programming using lodash/fp with emphasis on currying and composition over chaining. Also, the
use of individual modules is preferred over the import of the entire lodash module. Instead of using raw callbacks or Promises,
use of co-routine style programming is  preffered for asynchronous control flow using `co`.

This project also implements [Facebook flow](https://flowtype.org/) for static type checking, never having had prior experience
with such a system, I was blown away by the experience and would recommend it to everyone especially with the Sublime Text Flow
plugin.

For the command line interface `commander` was used, to generate the colored output `chalk` was added in. Errors are handled within the generators.
Unhandled exceptions and unhandled rejections are also handled properly.

---
