import React, { useContext } from 'react';

import { Tabs } from 'antd';
import styled from 'styled-components';

import PaxosDisplay from '../containers/PaxoDisplay';
import PaxosSetting from '../containers/PaxosSetting';
import { PaxosContext } from '../PaxosContext';

const Paxos = ({ className }) => {

  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const modes = ["playground", "fault"];
  const labels = {
    playground: "Playground",
    fault: "Fault Scenarios"
  }

  const handleTabChange = (activeTab) => {
    setPaxosState({
      ...paxosState,
      on: false,
      tab: activeTab,
      scenario: 'fault1',
      servers: [],
      packets: []
    });
  }
  return (
    <div className={`paxos-container ${className}`}>
      <Tabs
        size="large"
        type="card"
        activeKey={paxosState.tab}
        onChange={handleTabChange}
        className='tabs-container'
        style={{ marginBottom: 32 }}
        items={modes.map((key) => {
          return {
            label: labels[key],
            key: key,
            children: (
              <div className="paxos">
                <PaxosDisplay />
                <PaxosSetting faultMode={paxosState.tab === "fault"} />
              </div>
            ),
          };
        })}
      />
    </div>
  )
}

export default styled(Paxos)`
  .tabs-container {
    width: 100%;
  }
  
  .paxos {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
`;