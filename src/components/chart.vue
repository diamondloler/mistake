<template>
  <div>
    <p class="mb20">被点击日期：{{ name }}</p>
    <!-- <ve-pie
      :data="chartData"
      :settings="chartSettings"
      :events="chartEvents"
     
      >
    </ve-pie> -->
  </div>
</template>

<script>
  // import VeLine from 'v-charts/lib/line.common'
  export default {
    // components: {
    //     've-pie': VeLine
    // },
    data () {
      this.chartSettings = {
        selectedMode: 'single',
        hoverAnimation: false,
        metrics: ['下单用户'],
        type: 'pie'
      }
      var self = this
      this.chartEvents = {
        click: function (e) {
          self.name = e.name
          console.log(e)
        }
      }
      return {
        chartData: {
          columns: ['日期', '访问用户', '下单用户'],
          rows: [
            { '日期': '2018-05-22', '访问用户': 32371, '下单用户': 19810 },
            { '日期': '2018-05-23', '访问用户': 12328, '下单用户': 4398 },
            { '日期': '2018-05-24', '访问用户': 92381, '下单用户': 52910 }
          ]
        },
        name: ''
      }
    }
  }
</script>