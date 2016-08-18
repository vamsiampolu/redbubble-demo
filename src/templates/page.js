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
      <style type="text/css">
          .custom-wrapper {
              background-color: #ffd390;
              margin-bottom: 1em;
              -webkit-font-smoothing: antialiased;
              height: 2.1em;
              overflow: hidden;
              -webkit-transition: height 0.5s;
              -moz-transition: height 0.5s;
              -ms-transition: height 0.5s;
              transition: height 0.5s;
          }

          .custom-wrapper.open {
              height: 14em;
          }

          .custom-menu-3 {
              text-align: right;
          }

          .custom-toggle {
              width: 34px;
              height: 34px;
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              display: none;
          }

          .custom-toggle .bar {
              background-color: #777;
              display: block;
              width: 20px;
              height: 2px;
              border-radius: 100px;
              position: absolute;
              top: 18px;
              right: 7px;
              -webkit-transition: all 0.5s;
              -moz-transition: all 0.5s;
              -ms-transition: all 0.5s;
              transition: all 0.5s;
          }

          .custom-toggle .bar:first-child {
              -webkit-transform: translateY(-6px);
              -moz-transform: translateY(-6px);
              -ms-transform: translateY(-6px);
              transform: translateY(-6px);
          }

          .custom-toggle.x .bar {
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              transform: rotate(45deg);
          }

          .custom-toggle.x .bar:first-child {
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              transform: rotate(-45deg);
          }

          @media (max-width: 47.999em) {

              .custom-menu-3 {
                  text-align: left;
              }

              .custom-toggle {
                  display: block;
              }
          }

          body {
            background:#623045;
            color:#fffefe;
          }

          .custom-wrapper {
            background:#623045;
          }

          .pure-menu-heading {
            color:#fffefe;
          }

          ul:not(.pure-menu-children) > .pure-menu-item > .pure-menu-link {
            color:#fffefe;
          }

      </style>
    </head>
    <body>
       <div class="custom-wrapper pure-g" id="menu">
        ${menuStr}
       </div>
       <div id="main">
          <div class="header">
            <h1>${page.title}</h1>
          </div>
          <div class="content">
            ${galleryStr}
          </div>
       </div>
       <script>
        (function (window, document) {
        var menu = document.getElementById('menu'),
            WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange':'resize';

           function PureDropdown(dropdownParent) {

        var PREFIX = 'pure-',
            ACTIVE_CLASS_NAME = PREFIX + 'menu-active',
            ARIA_ROLE = 'role',
            ARIA_HIDDEN = 'aria-hidden',
            MENU_OPEN = 0,
            MENU_CLOSED = 1,
            MENU_PARENT_CLASS_NAME = 'pure-menu-has-children',
            MENU_ACTIVE_SELECTOR = '.pure-menu-active',
            MENU_LINK_SELECTOR = '.pure-menu-link',
            MENU_SELECTOR = '.pure-menu-children',
            DISMISS_EVENT = (window.hasOwnProperty &&
                window.hasOwnProperty('ontouchstart')) ?
                    'touchstart' : 'mousedown',

            ARROW_KEYS_ENABLED = true,

            ddm = this; // drop down menu

            this._state = MENU_CLOSED;

            this.show = function () {
                if (this._state !== MENU_OPEN) {
                    this._dropdownParent.classList.add(ACTIVE_CLASS_NAME);
                    this._menu.setAttribute(ARIA_HIDDEN, false);
                    this._state = MENU_OPEN;
                }
            };

            this.hide = function () {
                if (this._state !== MENU_CLOSED) {
                    this._dropdownParent.classList.remove(ACTIVE_CLASS_NAME);
                    this._menu.setAttribute(ARIA_HIDDEN, true);
                    this._link.focus();
                    this._state = MENU_CLOSED;
                }
            };

            this.toggle = function () {
                this[this._state === MENU_CLOSED ? 'show' : 'hide']();
            };

            this.halt = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };

            this._dropdownParent = dropdownParent;
            this._link = this._dropdownParent.querySelector(MENU_LINK_SELECTOR);
            this._menu = this._dropdownParent.querySelector(MENU_SELECTOR);
            this._firstMenuLink = this._menu.querySelector(MENU_LINK_SELECTOR);



            // Toggle on click
            this._link.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                ddm.toggle();
            });

            // Keyboard navigation
            document.addEventListener('keydown', function (e) {
                var currentLink,
                    previousSibling,
                    nextSibling,
                    previousLink,
                    nextLink;

                // if the menu isn't active, ignore
                if (ddm._state !== MENU_OPEN) {
                    return;
                }

                // if the menu is the parent of an open, active submenu, ignore
                if (ddm._menu.querySelector(MENU_ACTIVE_SELECTOR)) {
                    return;
                }

                currentLink = ddm._menu.querySelector(':focus');

                // Dismiss an open menu on ESC
                if (e.keyCode === 27) {
                    /* Esc */
                    ddm.halt(e);
                    ddm.hide();
                }
                // Go to the next link on down arrow
                else if (ARROW_KEYS_ENABLED && e.keyCode === 40) {
                    /* Down arrow */
                    ddm.halt(e);
                    // get the nextSibling (an LI) of the current link's LI
                    nextSibling = (currentLink) ? currentLink.parentNode.nextSibling : null;
                    // if the nextSibling is a text node (not an element), go to the next one
                    while (nextSibling && nextSibling.nodeType !== 1) {
                        nextSibling = nextSibling.nextSibling;
                    }
                    nextLink = (nextSibling) ? nextSibling.querySelector('.pure-menu-link') : null;
                    // if there is no currently focused link, focus the first one
                    if (!currentLink) {
                        ddm._menu.querySelector('.pure-menu-link').focus();
                    }
                    else if (nextLink) {
                        nextLink.focus();
                    }
                }
                // Go to the previous link on up arrow
                else if (ARROW_KEYS_ENABLED && e.keyCode === 38) {
                    /* Up arrow */
                    ddm.halt(e);
                    // get the currently focused link
                    previousSibling = (currentLink) ? currentLink.parentNode.previousSibling : null;
                    while (previousSibling && previousSibling.nodeType !== 1) {
                        previousSibling = previousSibling.previousSibling;
                    }
                    previousLink = (previousSibling) ? previousSibling.querySelector('.pure-menu-link') : null;
                    // if there is no currently focused link, focus the last link
                    if (!currentLink) {
                        ddm._menu.querySelector('.pure-menu-item:last-child .pure-menu-link').focus();
                    }
                    // else if there is a previous item, go to the previous item
                    else if (previousLink) {
                        previousLink.focus();
                    }
                }
            });

            // Dismiss an open menu on outside event
            document.addEventListener(DISMISS_EVENT, function (e) {
                var target = e.target;
                if (target !== ddm._link && !ddm._menu.contains(target)) {
                    ddm.hide();
                    ddm._link.blur();
                }
            });

    }

    function initDropdowns() {
        var dropdownParents = document.querySelectorAll('.pure-menu-has-children');
        for (var i = 0; i < dropdownParents.length; i++) {
            var ddm = new PureDropdown(dropdownParents[i]);
        }
    }

    initDropdowns();

        function toggleHorizontal() {
            [].forEach.call(
                document.getElementById('menu').querySelectorAll('.custom-can-transform'),
                function(el){
                    el.classList.toggle('pure-menu-horizontal');
                }
            );
        };

        function toggleMenu() {
            // set timeout so that the panel has a chance to roll up
            // before the menu switches states
            if (menu.classList.contains('open')) {
                setTimeout(toggleHorizontal, 500);
            }
            else {
                toggleHorizontal();
            }
            menu.classList.toggle('open');
            document.getElementById('toggle').classList.toggle('x');
        };

        function closeMenu() {
            if (menu.classList.contains('open')) {
                toggleMenu();
            }
        }

        document.getElementById('toggle').addEventListener('click', function (e) {
            toggleMenu();
        });

        window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);
        })(this, this.document);

        </script>
    </body>
  </html>`
}

export default buildPage

