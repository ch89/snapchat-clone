<script setup>
	import { ref, onBeforeUnmount } from "vue"
	import {
		getFirestore,
		collection,
		doc,
		setDoc,
		serverTimestamp
	} from "firebase/firestore"
	import {
		getStorage,
		ref as storageRef,
		uploadBytes,
		getDownloadURL
	} from "firebase/storage"
	import { getAuth } from "firebase/auth"
	import { useRouter } from "vue-router"

	const { displayName, photoURL } = getAuth().currentUser
	const router = useRouter()
	const webcam = ref()
	const audio = ref()
	const src = ref(null)
	const count = ref(0)
	const loading = ref(false)
	const filters = [null, "grayscale", "invert", "sepia"]
	const index = ref(0)
	let capture, recorder, blob, duration = 5

	let snap = async e => {
		blob = await capture.takePhoto()
		src.value = URL.createObjectURL(blob)
		audio.value.play()
	}

	let record = e => {
		recorder.start()
		count.value = duration

		let timer = setInterval(() => {
			count.value--

			if(count.value == 0) {
				recorder.stop()
				clearInterval(timer)
			}
		}, 1000)
	}

	let send = async e => {
		loading.value = true
		
		let docRef = doc(collection(getFirestore(), "snaps")),
			photoRef = storageRef(getStorage(), docRef.id)

		await uploadBytes(photoRef, blob)

		await setDoc(docRef, {
			displayName,
			photoURL,
			src: await getDownloadURL(photoRef),
			views: [],
			timestamp: serverTimestamp()
		})

		router.push("/chat")
	}

	navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		.then(stream => {
			webcam.value.srcObject = stream
			capture = new ImageCapture(stream.getVideoTracks()[0])
			recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" })
			recorder.addEventListener("dataavailable", e => {
				blob = e.data
				src.value = URL.createObjectURL(e.data)
			})
		})

	onBeforeUnmount(() => {
		webcam.value.srcObject.getTracks().forEach(track => track.stop())
		webcam.value.srcObject = null
	})
</script>

<template>
	<div class="relative text-white">
		<video autoplay muted ref="webcam" class="w-full h-full object-cover"></video>
		<div class="absolute top-4 right-4 text-2xl" v-show="count">{{ count }}</div>
		<div class="absolute top-4 left-4 flex gap-4">
			<img :src="photoURL" alt="Avatar" class="avatar">
			<button class="bg-black/25 w-12 h-12 rounded-full">
				<i class="fa-solid fa-magnifying-glass"></i>
			</button>
		</div>
		<div class="absolute top-4 right-4 bg-black/25 grid gap-4 p-4 rounded-full">
			<i class="fa-solid fa-rotate"></i>
			<i class="fa-solid fa-bolt"></i>
			<i class="fa-solid fa-film"></i>
			<i class="fa-brands fa-itunes-note"></i>
			<i class="fa-solid fa-circle-plus"></i>
		</div>
		<div class="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
			<button @click="record" class="text-xl">
				<i class="fa-solid fa-image"></i>
			</button>
			<button @click="snap" class="text-6xl">
				<i class="fa-regular fa-circle"></i>
			</button>
			<audio src="/sounds/camera.mp3" ref="audio"></audio>
			<button class="text-xl">
				<i class="fa-solid fa-face-smile"></i>
			</button>
		</div>
		<div class="absolute inset-0" v-show="src">
			<video :src="src" :poster="src" autoplay loop class="w-full h-full object-cover" :class="filters[index]"></video>
			<div class="absolute top-4 right-4 grid gap-4 text-xl">
				<i class="fa-solid fa-font"></i>
				<i class="fa-solid fa-pen"></i>
				<i class="fa-solid fa-image" @click="index == filters.length - 1 ? index = 0 : index++"></i>
				<i class="fa-solid fa-cut"></i>
				<i class="fa-solid fa-music"></i>
			</div>
			<button @click="src = null" class="absolute top-4 left-4 text-2xl">
				<i class="fa-solid fa-xmark"></i>
			</button>
			<button @click="send" :disabled="loading" class="absolute bottom-4 right-4 bg-[yellow] px-4 py-2 rounded-full font-bold text-gray-700" :class="{ loading }">
				Send <i class="fa-solid fa-paper-plane"></i>
			</button>
		</div>
	</div>
</template>

<style scoped>
	.loading {
		@apply 
			text-transparent 
			cursor-not-allowed 
			after:absolute 
			after:left-[calc(50%-.5rem)]
			after:top-[calc(50%-.5rem)]
			after:w-4 
			after:h-4 
			after:border-2 
			after:border-black 
			after:rounded-full 
			after:border-r-transparent 
			after:border-t-transparent 
			after:animate-spin;
	}
</style>