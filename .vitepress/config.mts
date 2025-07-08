import { defineConfig } from 'vitepress'
import { sidebar } from './utils/setSidBar'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Why Not ?",
  description: "A VitePress Site",
  base: "/iNote/",
  srcDir: "notes",
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/SHgzg/iNote/edit/main/notes/:path'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [

      { text: 'Home', link: '/' },
      // { text: 'Guide', link: '/guide' },
      // { text: 'Config', link: '/config' },
      { text: 'Changelog', link: 'https://github.com/SHgzg/iNote' },
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SHgzg/iNote' }
    ]
  },
  lastUpdated: true
})

