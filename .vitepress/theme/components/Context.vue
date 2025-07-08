<template>
  <div class="catalog-container">
    <h1 class="catalog-title">目录</h1>
    {{ notes }}
    <ul class="catalog-list">
      <li v-for="(item, index) in catalogItems" :key="index" class="catalog-item">
        <a :href="item.link" class="catalog-link">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { data as notes } from '../notes.data'
import { useData } from 'vitepress'

const {theme,page} =useData()
console.log(page.value);
// console.log(theme.value.sidebar);
// [
//   { name: '第一章：介绍', link: '#chapter1' },
//   { name: '第二章：基础知识', link: '#chapter2' },
//   { name: '第三章：进阶技巧', link: '#chapter3' },
//   { name: '第四章：实战案例', link: '#chapter4' },
//   { name: '第五章：总结与展望', link: '#chapter5' }
// ]

// 目录数据数组
const catalogItems = computed(()=>{
    const relativePath = page.value.relativePath
    const sidebar = theme.value.sidebar
    const res = Object.keys(sidebar).map(key=>{
        console.log(key);
        
        if (relativePath.match(key)) {
            return sidebar[key]
        }
        return null
    }).filter(Boolean)
    console.log(res);
    

    return res
}
);

</script>

<style scoped>
.catalog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.catalog-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
  position: relative;
}

.catalog-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #4a90e2;
}

.catalog-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.catalog-item {
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.catalog-link {
  display: block;
  padding: 10px 15px;
  color: #4a90e2;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.catalog-link:hover {
  background-color: #e8f0fe;
  color: #2a70c2;
  transform: translateX(5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .catalog-container {
    padding: 15px;
  }
  
  .catalog-title {
    font-size: 1.5rem;
  }
  
  .catalog-link {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
}
</style>