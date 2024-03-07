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
  
`
