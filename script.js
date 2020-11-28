// ==UserScript==
// @name         Twitter Cleaner
// @namespace    https://openuserjs.org/scripts/freeos
// @version      1.0.4
// @description  Cleans the Twitter UI
// @copyright    2019, freeos (https://openuserjs.org/users/freeos)
// @license      MIT; https://opensource.org/licenses/MIT
// @include      https://twitter.com/*
// @include      https://twitter.com/i/notifications/*
// @exclude      https://twitter.com/i/moments/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==

/*

Clean up the Twitter UI:

- Left side:
  - more compact
  - remove "Explore"
- Right side:
  - remove Trends, "Who to follow", Footer
- Center:
  - more compact
  - remove "Who to follow"
  - remove list header

*/

let options = {
  hideExplore: true,
  hideListHeader: true
};

this.$ = this.jQuery = jQuery.noConflict(true);


$(document).ready(function () {
  switch (document.domain) {
    case "twitter.com":

      changeCSS();
      cleanUIOnce();

      setInterval(cleanUI, 1000);
      break;
  }
});

function changeCSS() {
  let css = `
    nav[aria-label="Primary"]>a {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }

    nav[aria-label="Primary"]>a>div {
      padding-top: 2px !important;
      padding-bottom: 2px !important;
    }

    nav[aria-label="Footer"] {
      display: none !important;
    }

    .css-1dbjc4n.r-1iusvr4.r-16y2uox.r-5f2r5o.r-m611by:empty {
      display: none !important;
    }

    article div[role="group"] {
      margin-top: 2px !important;
    }
  `;

  GM_addStyle(css);
}

function cleanUI() {

  if (!urlContains("following") && !urlContains("followers")) {

    // remove Who to Follow divs from the feed
    var whoToFollowDivs = $('div.r-1w50u8q[data-testid="UserCell"]');
    if (whoToFollowDivs) {
      whoToFollowDivs.each(function () {
        let that = $(this);
        if (that.parent() && that.parent().parent()) {
          that.parent().parent().hide();
        }
      });
    }

    // remove "Show more" who to follow from the feed
    whoToFollowDivs = $('a[href*="related_users"]');
    if (whoToFollowDivs) {
      whoToFollowDivs.each(function () {
        let that = $(this);
        if (that.parent() && that.parent().parent()) {
          that.parent().parent().hide();
        }
      });
    }

    // remove "Who to follow" line from the feed
    whoToFollowDivs = $('span:contains("Who to follow")');
    if (whoToFollowDivs) {

      whoToFollowDivs.each(function () {
        let that = $(this);
        if (that.parent() && that.parent().parent() && that.parent().parent().parent() &&
          that.parent().parent().parent().parent() && that.parent().parent().parent().parent().parent()) {
          that.parent().parent().parent().parent().parent().hide();
        }
      });
    }

    // remove empty divs
    whoToFollowDivs = $('div.css-1dbjc4n.r-1adg3ll:empty');
    if (whoToFollowDivs) {
      whoToFollowDivs.each(function () {
        let that = $(this);
        if (that.parent()) {
          that.parent().hide();
        }
      });
    }

    // remove empty divs
    whoToFollowDivs = $('div[aria-label*="Tweets"]>div>div>div>div.css-1dbjc4n.r-1adg3ll>.css-1dbjc4n:empty');
    if (whoToFollowDivs) {
      whoToFollowDivs.each(function () {
        let that = $(this);
        if (that.parent() && that.parent().parent()) {
          that.parent().parent().hide();
        }
      });
    }

  }

  // remove Who to Follow divs from the right side
  var whoToFollowRightDivs = $('div.r-1ila09b[data-testid="UserCell"]');
  if (whoToFollowRightDivs) {
    whoToFollowRightDivs.first().parent().parent().parent().remove();
  }

  // remove "Trends for you" on the right side
  let removeDivs = $('span:contains("Trends for you")');
  if (removeDivs) {
    removeDivs.each(function () {
      let that = $(this).closest('section');
      if (that.parent() && that.parent().parent() && that.parent().parent().parent()) {
        that.parent().parent().parent().hide();
      }
    });
  }

  if(options.hideExplore){
    
    // remove "Explore" from the left side
    removeDivs = $('nav[aria-label="Primary"] span:contains("Explore")');
    if (removeDivs) {
      removeDivs.each(function () {
        let that = $(this).closest('a');
        if (that) {
          that.hide();
        }
      });
    }
  }
  
  let isAtTopOfPage = window.pageYOffset === 0;
  if(urlContains("lists") && options.hideListHeader && isAtTopOfPage){
    
    removeDivs = $('div[aria-label*="Timeline: List"]> div:first-child> div:first-child> div:first-child');
    if (removeDivs) {
      removeDivs.each(function () {
        let that = $(this);
        if (that) {
          that.hide();
        }
      });
    }
    
    // image css selector:
    // div[aria-label*="Timeline: List"]> div:first-child> div:first-child> div:first-child> div:first-child> div:first-child
  }
  
}

function hideElement(cssSelector) {
    let removeDivs = $(cssSelector);
    if (removeDivs) {
      removeDivs.each(function () {
        let that = $(this);
        if (that) {
          that.hide();
        }
      });
    }
}

function cleanUIOnce() {
  // keep it for future use
}

function urlContains(strVal) {
  return window.location.href.indexOf(strVal) != -1
}
