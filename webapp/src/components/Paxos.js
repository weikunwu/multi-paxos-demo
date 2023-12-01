import React from 'react';

import PaxosDisplay from '../containers/PaxoDisplay';
import PaxosSetting from '../containers/PaxosSetting';

const Paxos = () => {

  return (
    <div className="paxos-container">
      <PaxosDisplay />
      <PaxosSetting />
    </div>
  )
}

export default Paxos;