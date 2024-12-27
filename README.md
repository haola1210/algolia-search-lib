# build:

```
yarn
yarn build
```

u will see the `dist` directory

# setup

U will need these files in `dist`:

- `algoliasearch.css`
- `algoliasearch.umd.cjs`

copy them to your client site and serve as static files (like other assets such as: js files, images,...)

# usage

we have 2 components:

- `search input` (when clicking on it, it will open a modal and we can search products on it)
- `search page` (a big component with search, filters, pagination and so on) i call it advance search page

**how to use these components?**

- at the page u want to use `search input` or `search page`
- add a div element with a unique id
- call a specific function and js will render UI into that div
- more details below

## how to use search input

- add CSS (replace `href` with the path to your `algoliasearch.css` u setup above)

```html
<head>
  <!-- ...OTHER CONTENT ABOVE... -->
  <link href="/PATH/TO/algoliasearch.css" rel="stylesheet" />
  <!-- replace href with the actual path to your algoliasearch.css  -->
</head>
```

- add a div

```html
<div id="search-input"></div>
<!-- place any where and use any id u want -->
```

- add JS (replace `src` with the path to your `algoliasearch.umd.cjs` u setup above)

```html
<body>
  <!-- ... OTHER CONTENT ABOVE ... -->
  <script
    crossorigin
    src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"
  ></script>
  <script
    crossorigin
    src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
  ></script>

  <script src="/PATH/TO/algoliasearch.umd.cjs"></script>
  <!-- replace src with the actual path to your algoliasearch.umd.cjs  -->

  <script>
    // replace with the ID of the div u added
    AlgoliaSearch.AlgoliaSearch.renderSearchModal("search-input", {
      targetUrl: "https://www.cases2go.com/search", // if need, change the URL to the search page
    });
  </script>
</body>
```

**search page has 2 variants**

- `combined mode` (_search box_ and _result container_ will inside **ONE** `div`)
- `splitted mode` (_search box_ in a div and _result container_ in another div) **this one will be useful if u want to render the _search box_ in the page header and the _result container_ in the page body**

## how to use search page - `combined mode`

- add CSS and a div like above
- add JS

```html
<body>
  <!-- ... OTHER CONTENT ABOVE ... -->
  <script
    crossorigin
    src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"
  ></script>
  <script
    crossorigin
    src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
  ></script>

  <script src="/PATH/TO/algoliasearch.umd.cjs"></script>
  <!-- replace src with the actual path to your algoliasearch.umd.cjs  -->

  <script>
    // replace with the ID of the div u added
    AlgoliaSearch.AlgoliaSearch.renderSearchPage("search-page-container", {
      showSideBar: true, // optional props. if u want to show/hide the side bar - Default to TRUE
    });
  </script>
</body>
```

## how to use search page - `splitted mode`

- add CSS like above
- add 2 DIVs

```html
<div id="search-box-container"></div>
<!-- place any where and use any id u want -->
<div id="search-result-container"></div>
<!-- place any where and use any id u want -->
```

- add JS

```html
<body>
  <!-- ... OTHER CONTENT ABOVE ... -->
  <script
    crossorigin
    src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"
  ></script>
  <script
    crossorigin
    src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
  ></script>

  <script src="/PATH/TO/algoliasearch.umd.cjs"></script>
  <!-- replace src with the actual path to your algoliasearch.umd.cjs  -->

  <script>
    // replace with the ID of the div u added
    AlgoliaSearch.AlgoliaSearch.renderSearchPage("search-box-container", {
      showSideBar: true, // optional props. if u want to show/hide the side bar - Default to TRUE
      resultPortalElement: document.getElementById("search-result-container"), // replace with the ID of the div for result container u added
    });
  </script>
</body>
```
