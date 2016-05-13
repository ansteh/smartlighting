var BulbStateSchema = {
  reachable: {
    message: {
      on: 'reachable',
      off: 'out of reach'
    },
    icon: {
      on: 'cast_connected',
      off: 'cast_connected'
    },
    color: {
      on: '',
      off: ''
    }
  },
  on: {
    message: {
      on: 'on',
      off: 'off'
    },
    icon: {
      on: 'power',
      off: 'power'
    },
    color: {
      on: '',
      off: ''
    }
  },
  control: {
    message: {
      on: 'controlled',
      off: ''
    },
    icon: {
      on: 'power_settings_new',
      off: 'power_settings_new'
    },
    color: {
      on: '',
      off: ''
    }
  }
};
