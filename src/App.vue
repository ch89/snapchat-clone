<script setup>
	import Navbar from "./components/Navbar.vue"
	import { ref } from "vue"
	import {
		getAuth,
		onAuthStateChanged,
		signInWithPopup,
		GoogleAuthProvider
	} from "firebase/auth"

	const user = ref(null)

	onAuthStateChanged(getAuth(), u => user.value = u)
</script>

<template>
	<template v-if="user">
		<router-view></router-view>
		<navbar></navbar>
	</template>
	<div v-else class="bg-[yellow] grid place-items-center">
		<img src="/images/logo.png" alt="Logo" class="w-36">
		<button @click="signInWithPopup(getAuth(), new GoogleAuthProvider)" class="font-bold">Login</button>
	</div>
</template>

<style>
	.avatar {
		@apply w-12 h-12 object-cover rounded-full;
	}
</style>