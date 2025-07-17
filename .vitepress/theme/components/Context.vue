<template>
  <div class="simple-catalog">
    <h1 class="simple-title">{{ title }}</h1>
    <ul class="simple-menu">
      <li v-for="(item, index) in menuItems" :key="index" class="simple-menu-item">
        <a :href="item.link" class="simple-menu-link">{{ item.text }}</a>
        <ul v-if="item.items && item.items.length" class="simple-submenu">
          <li v-for="(subItem, subIndex) in item.items" :key="subIndex" class="simple-submenu-item">
            <a :href="subItem.link" class="simple-submenu-link">{{ subItem.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress'
const props = defineProps(['menuItems'])

const { theme, page } = useData()

const title = computed(() => page.value.frontmatter.name)
// 目录数据数组
const menuItems = props?.menuItems ? props.menuItems
  : computed(() => {
    const relativePath = page.value.relativePath
    const sidebar = theme.value.sidebar
    const res = Object.keys(sidebar).map(key => {
      const flag = key.slice(1, -1)
      if (relativePath.startsWith(flag)) {
        return sidebar[key].map(item=>({...item,link:("/iNote" + item.link).replace(/.md/,"")}))
      }
      return null
    })
      .filter(Boolean)
      .flat()
    return res
  });

</script>


<style scoped>
.simple-catalog {
  max-width: 800px;
  height: calc(100vh - 225px);
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.simple-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
  position: relative;
}

.simple-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background-color: rgba(224, 224, 224,.6);
}

.simple-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.simple-menu-item {
  margin-bottom: 12px;
  position: relative;
}

.simple-menu-link {
  display: block;
  padding: 10px 15px;
  color: #4a90e2;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.simple-menu-link:hover {
  background-color: #f5f9ff;
  color: #2a70c2;
  transform: translateX(5px);
}

.simple-submenu {
  list-style-type: none;
  padding-left: 20px;
  margin-top: 5px;
  border-left: 1px dashed #e0e0e0;
}

.simple-submenu-item {
  margin-bottom: 8px;
}

.simple-submenu-link {
  display: block;
  padding: 8px 12px;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.simple-submenu-link:hover {
  background-color: #f5f9ff;
  color: #4a90e2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .simple-catalog {
    padding: 15px;
  }
  
  .simple-title {
    font-size: 1.5rem;
  }
  
  .simple-menu-link {
    padding: 8px 12px;
    font-size: 0.95rem;
  }
  
  .simple-submenu {
    padding-left: 15px;
  }
  
  .simple-submenu-link {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}
</style>