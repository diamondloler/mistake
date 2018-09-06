<template>
    <div class="home">
        <div class="mt20 mb20"><chart /></div>
        <div>
            <img v-for="item in list" v-src="item" alt="" class="img-middle">
        </div>
        <div class="btn-add" @click="add">
            {{mark}}
        </div>
        <div class="item" v-for="(item, index) in mockList" :key="index" @click="addOne(index)">{{item}}</div>
    </div>
</template>
<script>
import chart from "../components/chart";
import service from "../service/makeRequest.js";
export default {
    name: 'home',
    props: {
        callee: Function
    },
    data() {
        return {
            list: [
                'https://pic.cr173.com/up/2017-1/201713954335202.png'
            ],
            mark: 0,
            mockList: []
        }
    },
    components: {
        chart
    },
    methods: {
        add() {
            console.log('触发了？')
            this.mark++
        },
        addOne(index) {
            var v = this.mockList[index]
            this.$set(this.mockList, index, ++v)
            this.callee && this.callee(1, 2, 3)
        }
    },
    async mounted() {
        
        var res = await service.getUserinfo()
        console.log(res)
        this.mockList = res.list
    }
}
</script>
<style >
    /* // .home {
    //     height: 100vh;
    //     .img-middle {
    //         height: 200px;
    //         width: 200px;
    //         display: inline-block;
    //     }
    // } */
</style>

