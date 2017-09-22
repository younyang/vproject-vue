<script>
import { Line } from 'vue-chartjs'

export default Line.extend({
  props: ['height'],
  mounted () {
    this.renderChart({
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [{
        label: "Unfilled",
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgb(54, 162, 235)",
        data: [-80,-76,87,-99,27,-56,-80]
      }, {
        label: "Dashed",
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgb(75, 192, 192)",
        borderDash: [5, 5],
        data: [-70,94,61,-85,22,8,67]
      }, {
        label: "Filled",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [11,42,68,-57,49,2,-97],
        fill: true,
      }]
    }, {
      responsive: true,
      title:{
        display:false
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true
        }],
        yAxes: [{
          display: true
        }]
      }
    })
  }
})
</script>
