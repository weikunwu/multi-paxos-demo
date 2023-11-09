import React, { useContext, useState } from 'react';
import { Button, Radio } from 'antd';
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
    const cur = paxosState.on;
    setPaxosState({
      ...paxosState,
      on: !cur
    })
  }

  const handleSpeedChange = (speed) => {
    setPaxosState({
      ...paxosState,
      speed: speed
    })
  }

  const handleAddServer = () => {
    const circleRadius = 200; // radius of the circle
    const offset = 200; // Center offset for the node
    const newServer = new Server(`${paxosState.servers.length + 1}`); // Declare newServer
    
    // Calculate the position for the new server immediately
    const totalServers = paxosState.servers.length + 1; // Include the new server
    const angle = 2 * Math.PI / totalServers; // Angle for the new server
    newServer.x = offset + circleRadius * Math.cos(angle * totalServers) - 10;
    newServer.y = offset + circleRadius * Math.sin(angle * totalServers) - 10;
  
    // Add the new server to the list
    const newServers = [...paxosState.servers, newServer];
  
    // Update the positions for all servers
    newServers.forEach((server, i) => {
      const theta = angle * (i + 1); // New angle for all nodes
      server.x = offset + circleRadius * Math.cos(theta) - 10;
      server.y = offset + circleRadius * Math.sin(theta) - 10;
    });
  
    // Update the state with the new list of servers
    setPaxosState({
      ...paxosState,
      servers: newServers,
    });
  };
  

  const handleMessageDropRateChange = (dropRate) => {
    setPaxosState({
      ...paxosState,
      messageDropRate: dropRate
    });
  }

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
      max={1}
      step={0.1}
      value={paxosState.messageDropRate}
      handleChange={handleMessageDropRateChange}
      disabled={paxosState.on} // Disable when the simulation is on
    />
    </div>
  )
}

export default styled(PaxosSetting)`
  .start-button, .add-button {
    width: 100%;
    margin: 10px;
  }
`;