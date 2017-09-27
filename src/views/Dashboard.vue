<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-2 col-md-3">
        <b-card>
          <div slot="header">
            동작 상태
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize">
                <i class="icon-reload"></i>
                <span class="sr-only">Reload</span>
              </b-button>
            </div>
          </div>
          <list-action-status></list-action-status>
        </b-card>
        <b-card>
          <div slot="header">
            장애 현황
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize">
                <i class="icon-reload"></i>
                <span class="sr-only">Reload</span>
              </b-button>
            </div>
          </div>
          <list-danger></list-danger>
        </b-card>
        <b-card>
          <div slot="header">
            Content Top5
            <div class="card-actions">
              <b-button size="sm" class="btn-minimize">
                <i class="icon-reload"></i>
                <span class="sr-only">Reload</span>
              </b-button>
            </div>
          </div>
          <list-content></list-content>
        </b-card>
      </div><!--/.col-->
      <div class="col-sm-10 col-md-9">
        <b-card>
          <div class="row">
            <div class="col-sm-5">
              <h4 class="card-title no-header">Monitoring</h4>
            </div>
            <div class="col-sm-7 hidden-sm-down">
              <b-button type="button" variant="primary" class="float-right"><i class="icon-reload"></i></b-button>
              <b-button-toolbar class="float-right" aria-label="Toolbar with button groups">
                <b-button-group class="mr-3" aria-label="Data type">
                  <b-button variant="outline-secondary" :pressed="true">Cache</b-button>
                  <b-button variant="outline-secondary">Streaming</b-button>
                </b-button-group>
              </b-button-toolbar>
            </div>
          </div>

          <!-- Traffic -->
          <div class="chart-section traffic">
            <div class="title">Traffic</div>
            <chart-line-traffic class="chart-wrapper"></chart-line-traffic>
          </div>

          <div class="chart-group d-flex flex-row">
            <!-- HTP -->
            <div class="chart-section htp">
              <div class="title">HTP 요청건수</div>
              <chart-line-traffic class="chart-wrapper"></chart-line-traffic>
            </div>
            <!-- 전송량 -->
            <div class="chart-section send">
              <div class="title">전송량</div>
              <chart-line-traffic class="chart-wrapper"></chart-line-traffic>
            </div>
          </div>
        </b-card>

        <b-card>
          <div class="row">
            <div class="col-sm-5">
              <h4 class="card-title no-header">L/R - Edge 현황</h4>
            </div><!--/.col-->
            <div class="col-sm-7 hidden-sm-down">
              <b-button type="button" variant="primary" class="float-right"><i class="icon-reload"></i></b-button>
              <b-button-toolbar class="float-right" aria-label="Toolbar with button groups">
                <b-button-group class="mr-3" aria-label="Status">
                  <b-button variant="outline-secondary" :pressed="true">L/R</b-button>
                  <b-button variant="outline-secondary">Edge</b-button>
                </b-button-group>
              </b-button-toolbar>
            </div><!--/.col-->
          </div><!--/.row-->

          <div class="chart-wrapper-edge">
            <b-btn block v-b-toggle.accordion1 variant="outline-primary">Accordion 1</b-btn>
            <b-collapse id="accordion1" visible accordion="my-accordion">
              <div class="d-flex justify-content-around">
                <chart-pie-stream />
                <chart-donut-cable />
              </div>
            </b-collapse>
            <b-btn block v-b-toggle.accordion2 variant="outline-primary">Accordion 2</b-btn>
            <b-collapse id="accordion2" accordion="my-accordion">
              <div class="pt-2">
                <b-progress class="progress-md" :value="prValue" show-progress variant="danger"></b-progress>
              </div>
              <div class="pt-2">
                <b-progress class="progress-md" :value="prValue" show-progress variant="warning"></b-progress>
              </div>
              <div class="pt-2">
                <b-progress class="progress-md" :value="prValue" show-progress variant="primary"></b-progress>
              </div>
              <div class="pt-2">
                <b-progress class="progress-md" :value="prValue" show-progress variant="success"></b-progress>
              </div>
            </b-collapse>
            <b-btn block v-b-toggle.accordion3 variant="outline-primary">Accordion 3</b-btn>
            <b-collapse id="accordion3" accordion="my-accordion">
              <p class="card-text">
                Carousel 333
              </p>
            </b-collapse>
          </div>

          <div slot="footer">
            <b-button variant="danger" @click="myModal = true">Modal Test</b-button>
          </div>
        </b-card>
      </div><!--/.col-->
    </div><!--/.row-->

    <!-- Modal Component -->
    <b-modal title="Modal..." v-model="myModal" @ok="myModal = false">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </b-modal>

  </div>
</template>

<script>
import ListActionStatus from './dashboard/ListActionStatus'
import ListDanger from './dashboard/ListDanger'
import ListContent from './dashboard/ListContent'

import ChartLineTraffic from './dashboard/ChartLineTraffic'
import ChartPieStream from './dashboard/ChartPieStream'
import ChartDonutCable from './dashboard/ChartDonutCable'

export default {
  name: 'dashboard',
  components: {
    ListActionStatus,
    ListDanger,
    ListContent,

    ChartLineTraffic,
    ChartPieStream,
    ChartDonutCable
  },

  data (){
    return {
      prValue: 50,
      myModal: false
    }
  }
}
</script>

<style>
.chart-group {
  border-top: 1px solid #e4e4e4;
  margin-left: -1.25rem;
  margin-right: -1.25rem;
  margin-bottom: -1.25rem;
}
.chart-section {
  flex: 1 0 0;
  padding: 1.25rem;
}
.chart-section.traffic {
  margin-left: -1.25rem;
  margin-right: -1.25rem;
}
.chart-section.traffic .chart-wrapper {
  height: 300px;
}
.chart-section.send {
  border-left: 1px solid #e4e4e4;
}
.chart-section .title {
  font-weight:100;
  font-size: 1.25rem;
  color: inherit;
}
.chart-wrapper-edge {
  margin-top: 1.25rem;
}
</style>
