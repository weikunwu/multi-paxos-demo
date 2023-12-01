import React from 'react';

import { Typography } from 'antd';

import Paxos from './components/Paxos';

const { Title } = Typography;

const App = () => {

  return (
    <div className='app' >
      <div className='main' style={{ width: '70%' }}>
        <Title>
          Paxos Demo
        </Title>
        {/* <Divider /> */}
        <Paxos />
      </div>
    </div>
  );
};

export default App;
