import React, { useContext } from 'react';

import { Button } from 'antd';
import styled from 'styled-components';

import { SERVER_SIZE } from '../Constants';
import { PaxosContext } from '../PaxosContext';

const Server = ({ className, server }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const propose = () => {
    const receivers = paxosState.servers.filter(s => s.name !== server.name);
    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...server.broadcastPropose(receivers, 0)
      ];

      return {
        ...prevState,
        packets: newPackets
      }
    })
  }
  return (
    <div className={`server-container ${className}`}>
      <Button
        className='server'
        size='large'
        shape="circle"
        onClick={propose}
        style={{
          left: `${server.x || 200}px`,
          top: `${server.y || 200}px`
        }}>{server.name}</Button>
    </div>
  )
}

export default styled(Server)`
  position: absolute;
  .server {
    width: ${SERVER_SIZE}px;
    height: ${SERVER_SIZE}px;
    border: 3px solid black;
  }
`;