<template>
    <div class="home">
        <div class="mt20 mb20"><chart /></div>
        <div>
            <img v-for="item in list" v-src="item" alt="" class="img-middle">
        </div>
        <div class="btn-add" @click="add">
            {{mark}}
        </div>
    </div>
</template>
<script>
import chart from "../components/chart";
export default {
    name: 'name',
    data() {
        return {
            list: [
                'https://pic.cr173.com/up/2017-1/201713954335202.png'
            ],
            mark: 0
        }
    },
    components: {
        chart
    },
    methods: {
        add() {
            console.log('触发了？')
            this.mark++
        }
    }
}
</script>
<style lang="sass">
    .home {
        height: 100vh;
        .img-middle {
            height: 200px;
            width: 200px;
            display: inline-block;
        }
    }
</style>

