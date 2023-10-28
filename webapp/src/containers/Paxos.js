import React from 'react';

import PaxosDisplay from './PaxoDisplay';
import PaxosSetting from './PaxosSetting';

const Paxos = () => {

  return (
    <div className="paxos-container">
      <PaxosDisplay />
      <PaxosSetting />
    </div>
  )
}

export default Paxos;