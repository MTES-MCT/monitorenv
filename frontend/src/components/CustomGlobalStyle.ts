import { createGlobalStyle } from 'styled-components'

export const CustomGlobalStyle = createGlobalStyle`
body,
html,
* {
  margin: 0;
  font-family: 'Marianne', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body,
html,
#root {
  height: 100%;
}


html {
  overflow-y: hidden;
  overflow-x: hidden;
}

* {
    box-sizing: border-box;
    scroll-behavior: smooth;
    scrollbar-width: thin; /* Firefox */
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background-color: ${p => p.theme.color.lightGray};
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${p => p.theme.color.slateGray};
    }
}

.hide {
    display: none;
  }

  .visible {
    visibility: visible;
  }

  .active-tab {
    background-color: #707785;
  }

  .highlight {
    margin: 0;
    padding: 0;
    background-color: #cccfd6;
    color: rgb(81, 81, 81);
  }

  .collapsed {
    display: none;
  }

  .rs-radio-checker {
    line-height: normal;
  }


  .Field-Checkbox {
    > .rs-checkbox {
        > .rs-checkbox-checker > label {
            line-height: normal !important;
        }
      }
  }

  h2 {
    line-height: normal;
  }

  ul,ol,menu {
    list-style: none;
    padding-left:0;
    margin-bottom: 0;
  }
`
