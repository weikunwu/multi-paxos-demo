import React, { useContext } from 'react';

import {
  Button,
  Tooltip,
} from 'antd';
import styled from 'styled-components';

import { SERVER_SIZE } from '../Constants';
import { PaxosContext } from '../PaxosContext';
import ServerTooltip from './ServerTooltip';

const Server = ({ className, server }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const propose = () => {
    const receivers = paxosState.servers.filter(s => s.id !== server.id).map(s => s.id);
    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...server.broadcastPrepare(receivers, 0)
      ];

      return {
        ...prevState,
        packets: newPackets
      }
    })
  }

  const handleShutDown = () => {

  }
  return (
    <div className={`server-container ${className}`}>
      <Tooltip
        overlayInnerStyle={{
          width: '400px',
        }}
        title={<ServerTooltip
          server={server}
          handlePropose={propose}
          handleShutDown={handleShutDown}
        />}
        trigger={'click'}
      >

        <Button
          className='server'
          size='large'
          shape="circle"
          style={{
            left: `${server.x || 200}px`,
            top: `${server.y || 200}px`
          }}>{server.id}</Button>
      </Tooltip>
    </div>
  )
}

export default styled(Server)`
  position: absolute;
  .server {
    width: ${SERVER_SIZE}px;
    height: ${SERVER_SIZE}px;
    border: 3px solid black;
    z-index: 2;
  }
`;