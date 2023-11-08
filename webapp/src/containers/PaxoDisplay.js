import React, { useContext } from 'react';

import styled from 'styled-components';

import { PaxosContext } from '../PaxosContext';
import Packet from './Packet';
import Server from './Server';

const PaxosDisplay = ({ className }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  return (
    <div className={`paxos-display-container ${className}`}>
      <div className='server-circle-container'>
        {paxosState.servers.map((server) => {
          return (
            <Server key={server.id} server={server} 
              style={{
                transform: `translate(${server.x}px, ${server.y}px)`
              }}
            />
          );
        })}
        {paxosState.packets.map((packet) => {
          return <Packet key={packet.id} packet={packet} />
        })}
      </div>
    </div>
  )
}

export default styled(PaxosDisplay)`
  display: flex;
  justify-content: center;
  .server-circle-container {
    position: relative;
    width: 400px;
    height: 400px;
  }
`;