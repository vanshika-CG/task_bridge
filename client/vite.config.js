import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts:[
      '1274-2409-40c1-302f-f68c-b4bf-4739-130-3bc.ngrok-free.app'
    ]
  }
})
