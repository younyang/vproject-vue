<script>
import { Pie } from 'vue-chartjs'

export default Pie.extend({
  mounted () {
    this.renderChart({
      labels: ['HLS', 'Dash', 'RTSP'],
      datasets: [
        {
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(54, 162, 235)'
          ],
          data: [40, 30, 80]
        }
      ]
    }, {responsive: true, maintainAspectRatio: false})
  }
})
</script>
