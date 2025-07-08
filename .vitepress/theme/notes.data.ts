import { defineLoader } from 'vitepress'
import { sidebar } from '../utils/setSidBar'

export interface Data {
  // data 类型
}

declare const data: Data
export { data }

export default defineLoader({
  // 类型检查加载器选项
  watch: ['...'],
  async load(): Promise<Data> {
    return sidebar
  }
})