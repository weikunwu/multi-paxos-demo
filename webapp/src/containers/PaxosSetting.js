import React, { useContext } from 'react';

import { Button } from 'antd';
import {
  AiOutlineCheck,
  AiOutlineClose,
} from 'react-icons/ai';
import {
  GiRabbit,
  GiTurtleShell,
} from 'react-icons/gi';
import styled from 'styled-components';

import { Server } from '../objects/Server';
import { PaxosContext } from '../PaxosContext';
import LabelIconSlider from './LabelIconSlider';

const PaxosSetting = ({ className }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const handleStartButton = () => {
    setPaxosState(prevState => {
      return {
        ...prevState,
        on: !prevState.on
      };
    });
  };

  const handleSpeedChange = (speed) => {
    setPaxosState({
      ...paxosState,
      speed: speed
    })
  }

  const failure5 = () => {
    for (let i = 0; i < 2; i++) {
      handleAddServer();
    }
    handleStartButton()
    // Hard code packets
    const receivers = [paxosState.servers[2], paxosState.servers[2]];
    const proposer = paxosState.servers[0];
    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...proposer.broadcastPrepare(receivers, 1)
      ];
      return {
        ...prevState,
        packets: newPackets
      }
    })
  }

  const handleDropRateChange = (dropRate) => {
    setPaxosState({
      ...paxosState,
      dropRate: 0.01 * dropRate
    })
  }
  const handleAddServer = () => {
    setPaxosState(prevState => {
      // Clone the current array of servers
      const newServers = [...prevState.servers];

      // Create a new unique identifier for the new server
      const newServerId = `Server-${newServers.length + 1}`;

      // Create a new Server instance with the unique identifier
      const newServer = new Server(newServerId);

      // Calculate position for the new server
      const circleRadius = 200; // Radius of the circle
      const offset = 200; // Center offset for the node
      const totalServers = newServers.length + 1; // Include the new server in count
      const angle = 2 * Math.PI / totalServers; // Angle for positioning servers

      // Position the new server and update positions for existing servers
      newServers.push(newServer);
      newServers.forEach((server, i) => {
        const theta = angle * (i + 1); // New angle for all nodes
        server.x = offset + circleRadius * Math.cos(theta) - 10;
        server.y = offset + circleRadius * Math.sin(theta) - 10;
      });

      // Return the updated state
      return {
        ...prevState,
        servers: newServers,
      };
    });
  };

  return (
    <div className={`paxos-setting-container ${className}`} >
      <Button
        className='start-button'
        onClick={handleStartButton}
      >{paxosState.on ? 'Pause' : 'Start'}</Button>
      <Button
        className='add-button'
        type='primary'
        disabled={
          paxosState.servers.length >= 10 || paxosState.on || paxosState.packets.length > 0
        } onClick={handleAddServer}>Add Node</Button>
      <LabelIconSlider
        leftIcon={<GiTurtleShell />}
        rightIcon={<GiRabbit />}
        label='Speed'
        min={1}
        max={5}
        handleChange={handleSpeedChange}
      />
      <LabelIconSlider
        leftIcon={<AiOutlineCheck />}
        rightIcon={<AiOutlineClose />}
        label='Message Drop Rate'
        min={0}
        max={(100)}
        step={10}
        handleChange={handleDropRateChange}
      />

      <Button
        className='add-button'
        type='primary'
        onClick={failure5}>Failure 5</Button>

    </div>
  )
}

export default styled(PaxosSetting)`
  .start-button, .add-button {
    width: 100%;
    margin: 10px;
  }
`;