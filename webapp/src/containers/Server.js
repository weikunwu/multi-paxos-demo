import React, { useContext } from 'react';

import { Tooltip, Button } from 'antd';
import styled from 'styled-components';

import { SERVER_SIZE } from '../Constants';
import { PaxosContext } from '../PaxosContext';

const Server = ({ className, server }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);
  const serverInfo = `Server ID: ${server.id}\nacceptedValue: ${server.acceptedValue}\npromisedNum: ${server.promisedNum}`;
  const propose = () => {
    const receivers = paxosState.servers.filter(s => s.id !== server.id);

    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...server.broadcastPropose(receivers, 'Prepare', null),
      ];
      return {
        ...prevState,
        packets: newPackets
      }
    });
  }


  return (
    <div className={`server-container ${className}`}>
      <Tooltip title={serverInfo}>
        <Button
          className='server'
          size='large'
          shape="circle"
          onClick={propose}
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