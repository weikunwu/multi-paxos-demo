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

  const handleAddServer = () => {
    const circleRadius = 200; // radius of the circle
    // const offset = circleContainer.offsetWidth / 2 - 10; // Center offset for the node
    const offset = 200;
    const newServers = [...paxosState.servers]
    newServers.push(new Server(`${paxosState.servers.length + 1}`));
    const totalServers = newServers.length;
    const angle = 2 * Math.PI / totalServers;

    newServers.forEach((server, i) => {
      const theta = angle * (i + 1); // new angle for all nodes
      server.x = `${offset + circleRadius * Math.cos(theta) - 10}px`;
      server.y = `${offset + circleRadius * Math.sin(theta) - 10}px`;
    })
    setPaxosState({
      ...paxosState,
      servers: newServers
    })
  }

  return (
    <div className={`paxos-setting-container ${className}`} >
      <Button className='start-button'>{paxosState.on ? 'Pause' : 'Start'}</Button>
      <Button className='add-button' type='primary' disabled={paxosState.servers.length >= 10} onClick={handleAddServer}>Add Node</Button>
      <LabelIconSlider
        leftIcon={<GiTurtleShell />}
        rightIcon={<GiRabbit />}
        label='Speed'
      />
      <LabelIconSlider
        leftIcon={<AiOutlineClose />}
        rightIcon={<AiOutlineCheck />}
        label='Message Drop Rate'
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