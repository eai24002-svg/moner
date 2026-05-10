// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  /** Pin build dir so production build does not redirect to `node_modules/.cache/nuxt/.nuxt` (which breaks `nuxt dev` looking for `.nuxt/dist/server/server.mjs`). */
  buildDir: '.nuxt',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl'
      }
    }
  },
  dir: {
    pages: 'pages',
    layouts: 'layouts',
    assets: 'assets'
  },
  components: [{ path: '~/components', pathPrefix: false }],
  runtimeConfig: {
    mysqlHost: process.env.MYSQL_HOST,
    mysqlPort: Number(process.env.MYSQL_PORT || 3306),
    mysqlUser: process.env.MYSQL_USER,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    mysqlDatabase: process.env.MYSQL_DATABASE,
    adminPassword: process.env.ADMIN_PASSWORD || process.env.ADMIN_ACCESS_KEY || '',
    uploadDir: process.env.UPLOAD_DIR || './storage/uploads',
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'رويدة آرت',
      appNameEn: process.env.NUXT_PUBLIC_APP_NAME_EN || 'Rowaida Art',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      wazeUrl: process.env.NUXT_PUBLIC_WAZE_URL || 'https://waze.com',
      instagramUrl: process.env.NUXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com'
    }
  }
})
