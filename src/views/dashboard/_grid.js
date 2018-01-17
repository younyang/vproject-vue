const defaultOption = {
  gridSize: {
    w: 98,
    h: 98
  },
  bubbleUp: false,
  margin: 11,
  boxCount: 4
};


export default {
  template1: {
    ...defaultOption,
    layout: [
      {
        id: 'edge-box',
        hidden: false,
        pinned: false,
        position: {
          x: 0,
          y: 0,
          w: 7,
          h: 3
        }
      },
      {
        id: 'map-box',
        hidden: false,
        pinned: false,
        position: {
          x: 7,
          y: 0,
          w: 4,
          h: 6
        }
      },
      {
        id: 'cache-box',
        hidden: false,
        pinned: false,
        position: {
          x: 0,
          y: 3,
          w: 3,
          h: 3
        }
      },
      {
        id: 'service-box',
        hidden: false,
        pinned: false,
        position: {
          x: 3,
          y: 3,
          w: 4,
          h: 3
        }
      },
      {
        id: 'request-box',
        hidden: false,
        pinned: false,
        position: {
          x: 0,
          y: 6,
          w: 11,
          h: 3
        }
      }
    ]
  },
  template2: {
    ...defaultOption,
    layout: [
      {
        id: 'edge-box',
        hidden: false,
        pinned: false,
        position: {
          x: 4,
          y: 3,
          w: 7,
          h: 3
        }
      },
      {
        id: 'map-box',
        hidden: false,
        pinned: false,
        position: {
          x: 0,
          y: 0,
          w: 4,
          h: 6
        }
      },
      {
        id: 'cache-box',
        hidden: false,
        pinned: false,
        position: {
          x: 4,
          y: 0,
          w: 3,
          h: 3
        }
      },
      {
        id: 'service-box',
        hidden: false,
        pinned: false,
        position: {
          x: 7,
          y: 0,
          w: 4,
          h: 3
        }
      },
      {
        id: 'request-box',
        hidden: false,
        pinned: false,
        position: {
          x: 0,
          y: 6,
          w: 11,
          h: 3
        }
      }
    ]
  }
}


