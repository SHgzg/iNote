import { defineConfig } from 'vitepress'
import { sidebar } from './utils/setSidBar'


console.log(import.meta.filename) //当前模块文件名 (__filename));


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  base: "/iNote/",
  srcDir: "notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [

      { text: 'Home', link: '/' },
      // { text: 'Guide', link: '/guide' },
      // { text: 'Config', link: '/config' },
      // { text: 'Changelog', link: 'https://github.com/...' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

