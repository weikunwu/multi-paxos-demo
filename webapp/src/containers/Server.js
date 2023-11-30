import React, { useContext } from 'react';

import {
  Button,
  Tooltip,
} from 'antd';
import styled from 'styled-components';

import { SERVER_SIZE } from '../Constants';
import { PaxosContext } from '../PaxosContext';
import ServerTooltip from './ServerTooltip';

const Server = ({ className, id }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);
  const server = paxosState.servers.find(s => s.id === id);

  const propose = (val) => {
    const receivers = paxosState.servers.filter(s => s.id !== server.id).map(s => s.id);
    const proposer = paxosState.servers.find(s => s.id === id);
    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...proposer.broadcastPrepare(receivers, val)
      ];

      const newServers = prevState.servers.map((s) => {
        if (s.id === id) {
          return proposer;
        } else {
          return s;
        }
      })

      return {
        ...prevState,
        servers: newServers,
        packets: newPackets
      }
    })
  }

  const handleShutDown = () => {
    setPaxosState((prevState) => {
      const newServers = prevState.servers.map((s) => {
        if (s.id === id) {
          s.down = !s.down
          return s;
        } else {
          return s;
        }
      })

      return {
        ...prevState,
        servers: newServers,
      }
    })
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
          className={`server ${server.down ? "down" : "up"}`}
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
    z-index: 2;
  }
  
  .server.up{
    border: 3px solid black;
  }

  .server.down{
    border-colr: #d9d9d9;
    background-color: #e3e8e7;
    color: rgba(0, 0, 0, 0.25);
  }
`;