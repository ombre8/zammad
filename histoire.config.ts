// Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  setupFile: './app/frontend/stories/support/setupHistoire.ts',
  storyMatch: ['app/frontend/**/*.story.vue'],
  plugins: [HstVue()],
  viteNodeInlineDeps: [/@vue\/apollo-composable/],
  vite: {
    plugins: [
      {
        name: 'inject-fonts',
        transformIndexHtml() {
          return [
            {
              tag: 'link',
              attrs: { rel: 'stylesheet', href: '/assets/frontend/fonts.css' },
            },
          ]
        },
      },
    ],
    server: {
      port: 3074,
      ...(process.env.HISTOIRE_BUILD && {
        hmr: false,
        watch: { ignored: ['**/*'] },
      }),
      open: true,
    },
    logLevel: process.env.HISTOIRE_BUILD ? 'error' : 'info',
  },
  tree: {
    groups: [
      {
        id: 'common',
        title: 'Common',
        include: (file) => file.title.startsWith('Common'),
      },
      {
        id: 'modules',
        title: 'Modules',
      },
      {
        id: 'form',
        title: 'Form',
        include: (file) => file.title.startsWith('Field'),
      },
    ],
  },
})
