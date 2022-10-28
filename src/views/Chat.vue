<script setup>
	import Snap from "../components/Snap.vue"
	import { getAuth, signOut } from "firebase/auth"
	import {
		getFirestore,
		collection,
		onSnapshot,
		doc,
		updateDoc,
		arrayUnion,
		query,
		orderBy
	} from "firebase/firestore"
	import { ref } from "vue"

	const user = getAuth().currentUser
	const snaps = ref([])
	const src = ref(null)
	const show = ref(false)

	let open = snap => {
		src.value = snap.src

		if(! snap.views.includes(user.uid)) {
			updateDoc(doc(getFirestore(), `snaps/${snap.id}`), {
				views: arrayUnion(user.uid)
			})
		}
	}

	onSnapshot(
		query(
			collection(getFirestore(), "snaps"),
			orderBy("timestamp", "desc")
		),
		snapshot => snaps.value = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}))
	)
</script>

<template>
	<div>
		<header @click="signOut(getAuth())" class="p-4 border-b flex items-center justify-between">
			<img :src="user.photoURL" alt="Avatar" class="avatar">
			<h3 class="text-gray-700 text-lg font-bold">Snaps</h3>
			<button class="w-12 h-12 rounded-full bg-gray-100 text-gray-400">
				<i class="fa-solid fa-magnifying-glass"></i>
			</button>
		</header>
		<snap v-for="snap in snaps" :key="snap.id" :snap="snap" @click="open(snap)"></snap>
	</div>
	<transition enter-from-class="opacity-0" leave-to-class="opacity-0" @after-leave="src = null">
		<video :src="src" :poster="src" v-show="show" autoplay @loadeddata="show = true" @click="show = false" @ended="show = false" class="absolute w-full h-full object-cover transition duration-1000"></video>
	</transition>
</template>