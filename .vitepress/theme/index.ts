import DefaultTheme from 'vitepress/theme'
import Context from './components/Context.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Context', Context)
  }
}