import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { initializeApp } from "firebase/app"

initializeApp({
	apiKey: "AIzaSyBJNOpW4uko9YztDAFdn7bHZv3ik4dXddg",
	authDomain: "snapchat-clone-17c72.firebaseapp.com",
	projectId: "snapchat-clone-17c72",
	storageBucket: "snapchat-clone-17c72.appspot.com",
	messagingSenderId: "349974105768",
	appId: "1:349974105768:web:b9bb970e833b9599cb7c9d"
})

const app = createApp(App)

app.use(router)

app.mount('#app')
