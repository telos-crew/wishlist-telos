<template>
	<div class="slideshowWrap">
		<q-carousel
			v-model="slide"
			swipeable
			animated
			control-type="flat"
			control-color="primary"
			padding
			arrows
			height="300px"
			class="text-purple rounded-borders"
		>
			<q-carousel-slide
				v-for="imageUrl in props.imageUrls"
				v-bind:key="imageUrl"
				:name="imageUrl"
				class="column no-wrap flex-center slide"
			>
				<!-- <div
					class="image"
					:style="{ backgroundImage: 'url(' + imageUrl + ')' }"
				/> -->
				<q-img
					:src="imageUrl"
					spinner-color="grey"
					class="image"
					fit="contain"
				>
				</q-img>
			</q-carousel-slide>
		</q-carousel>
	</div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
const props = defineProps(['imageUrls']);
const slide = ref(props.imageUrls[0]);
</script>

<style lang="scss" scoped>
.slideshowWrap {
	flex: 1;
	.slide {
		display: flex;
		justify-content: center;
		align-items: center;

		.image {
			max-width: 100%;

			// background-size: contain;
			// background-repeat: no-repeat;
			// background-position: center;
		}
	}

	.q-carousel__control .q-carousel__navigation {
		display: none;
	}
}
</style>
