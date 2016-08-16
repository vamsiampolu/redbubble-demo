//@flow

import buildMenu from './menuItem'
import createGallery from './thumbnails'
import type {Page} from '../types'

const buildPage = (page:Page):string => {
  const menuStr = buildMenu(page.menu)
  const galleryStr = createGallery(page.gallery)
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>${page.title}</title>
      <meta charset="utf8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css"/>
      <link rel="stylesheet" href="http://purecss.io/css/layouts/side-menu.css"/>
      <style type="text/css">
        .pure-u-1-4 {
          margin-right: 10px;
        }

        .pure-img-responsive {
          position: relative;
        }

        .pure-menu-children {
            left: 0;
            top: 20px;
            margin-top: 20px;
            margin-bottom: 20px;
            background: black !important;
        }
      </style>
    </head>
    <body>
       <a href="#" id="menuLink"><span></span></a>
       <div id="menu">
        ${menuStr}
       </div>
       <div id="main">
          <div class="header">
            <h1>${page.title}</h1>
          </div>
          <div class="content">
            <div class="content-subhead">Thumbnails</div>
            ${galleryStr}
          </div>
       </div>
       <script src="http://purecss.io/combo/1.18.3?/js/menus.js&/js/ui.js"></script>
    </body>
  </html>`
}

export default buildPage

