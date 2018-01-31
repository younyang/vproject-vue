export default [
  {
    wid: 'edge',
    title: 'Edge Data Transfer',
    types: ['AREA','LINE'],
    searchItems: {
      fromDate: '2018-01-23 00:00',
      toDate: '2018-01-30 23:59',
      q: {
        serviceIdList: ['ALL'],
        serviceTypeList: ['ALL'],
        metricType: 'sum',
        dataType: 'httpTraffic',
        intervalType: 'D',
        intervalValue: 1,
        targetType: 'TOTAL_EDGE',
        chartType: 'AREA',
        peakYn: false,
        mainMode: 'TARGET',
        subMode: 'TIME',
        targetList: []
      }
    }
  }, {
    wid: 'cache',
    title: 'Cache Status',
    types: ['PIE'],
    searchItems: {
      fromDate: '2018-01-23 00:00',
      toDate: '2018-01-30 23:59',
      q: {
        serviceIdList:['ALL'],
        serviceTypeList: ['ALL'],
        metricType: 'sum',
        dataType: 'hits',
        intervalType: 'D',
        intervalValue: 1,
        targetType: 'TOTAL_EDGE',
        chartType: 'PIE',
        peakYn: false,
        mainMode: 'TYPE',
        subMode: '',
        targetList: [],
        typeField : 'cacheStatus'
      }
    }
  }, {
    wid: 'service',
    title: 'Service Type 별 Request',
    types: ['BAR'],
    searchItems: {
      fromDate: '2018-01-23 00:00',
      toDate: '2018-01-30 23:59',
      q: {
        serviceIdList:['ALL'],
        serviceTypeList: ['ALL'],
        metricType: 'sum',
        dataType: 'requestCount',
        intervalType: 'D',
        intervalValue: 1,
        targetType: 'TOTAL_EDGE',
        chartType: 'BAR',
        peakYn: false,
        mainMode: 'TARGET',
        subMode: '',
        targetList: ["Edge-01", "Edge-02", "Edge-03"]
      }
    }
  }, {
    wid: 'request',
    title: 'Request Count',
    types: ['LINE', 'AREA'],
    searchItems: {
      fromDate: '2018-01-23 00:00',
      toDate: '2018-01-30 23:59',
      q: {
        serviceIdList:['ALL'],
        serviceTypeList: ['ALL'],
        metricType: 'sum',
        dataType: 'requestCount',
        intervalType: 'D',
        intervalValue: 1,
        targetType: 'TOTAL_EDGE',
        chartType: 'LINE',
        peakYn: false,
        mainMode: 'TARGET',
        subMode: 'TIME',
        targetList: []
      }
    }
  }, {
    wid: 'map',
    title: '지역별 Data Transfer 현황',
    types: ['MAP'],
    searchItems: {
      fromDate: '2018-01-23 00:00',
      toDate: '2018-01-30 23:59',
      q: {
        serviceIdList:['ALL'],
        serviceTypeList: ['ALL'],
        typeField: '',
        metricType: 'sum',
        dataType: 'requestCount',
        intervalType: 'D',
        intervalValue: 1,
        targetType: 'TOTAL_EDGE',
        chartType: 'MAP',
        peakYn: false,
        mainMode: 'TOTAL',
        subMode: '',
        targetList: []
      }
    }
  }
]


