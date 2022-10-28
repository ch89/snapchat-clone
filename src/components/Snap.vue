<script setup>
	import {
		getFirestore,
		doc,
		deleteDoc
	} from "firebase/firestore"
	import {
		getStorage,
		ref,
		deleteObject
	} from "firebase/storage"
	import { getAuth } from "firebase/auth"
	import moment from "moment"

	const props = defineProps(["snap"])
	const { uid } = getAuth().currentUser

	let remove = e => {
		deleteDoc(doc(getFirestore(), `snaps/${props.snap.id}`))
		deleteObject(ref(getStorage(), props.snap.id))
	}
</script>

<template>
	<div class="p-4 border-b flex gap-4 items-center">
		<img @click.stop="remove" :src="snap.photoURL" class="avatar">
		<div>
			<h3 class="text-gray-700 font-bold">{{ snap.displayName }}</h3>
			<span v-if="snap.views.includes(uid)" class="text-sm font-bold text-blue-400">
				<i class="fa-solid fa-comment"></i> Opened
			</span>
			<span v-else class="text-sm font-bold text-red-400">
				<i class="fa-solid fa-stop"></i> New Snap
			</span>
			<span class="text-sm font-bold text-gray-400">⋅ {{ moment(snap.timestamp?.toDate()).fromNow() }}</span>
		</div>
		<!-- <button class="ml-auto text-gray-300">
			<i class="fa-solid fa-camera"></i>
		</button> -->
		<a :href="snap.src" download class="ml-auto text-gray-300">
			<i class="fa-solid fa-camera"></i>
		</a>
	</div>
</template>