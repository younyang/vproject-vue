<script>
import { Doughnut } from 'vue-chartjs'

export default Doughnut.extend({
  mounted () {
    this.renderChart({
      labels: ['유선', '무선'],
      datasets: [
        {
          backgroundColor: [
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
          ],
          data: [30, 70]
        }
      ]
    }, {
      responsive: true,
      maintainAspectRatio: false,
      rotation: 1 * Math.PI,
      circumference: 1 * Math.PI
    })
  }
})
</script>
