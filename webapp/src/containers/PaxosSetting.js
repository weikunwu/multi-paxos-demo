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
import { Server6 } from '../objects/Server6';
import { PaxosContext } from '../PaxosContext';
import LabelIconSlider from './LabelIconSlider';

const PaxosSetting = ({ className, faultMode }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

function timeout(delay) {
  return new Promise(res => setTimeout(res, delay));
}

const failure6 = async () => {
  handleStartButton();

  const newServers = [];
  for (let i = 0; i < 5; i++) {
    newServers.push(new Server6(`${i + 1}`));
  }

  const circleRadius = 200; 
  const offset = 200; 
  const totalServers = newServers.length;
  const angle = 2 * Math.PI / totalServers;

  newServers.forEach((server, i) => {
    const theta = angle * (i + 1); 
    server.x = offset + circleRadius * Math.cos(theta) - 10;
    server.y = offset + circleRadius * Math.sin(theta) - 10;
  });

  await setPaxosState((prevState) => ({
    ...prevState,
    servers: newServers
  }));

  await timeout(0);

  setPaxosState((prevState) => {
    const updatedServers = prevState.servers;
    const newPackets = [
      ...prevState.packets,
      ...updatedServers[0].broadcastPrepare(['2', '3'], 20),
    ];

    return {
      ...prevState,
      packets: newPackets
    };
  });

  await timeout(4900);

  setPaxosState((prevState) => {
    const updatedServers = prevState.servers;
    const additionalPackets = [
      ...updatedServers[4].broadcastPrepare(['1', '3'], 10),
    ];

    return {
      ...prevState,
      packets: [...prevState.packets, ...additionalPackets]
    };
  });
};

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

  const handleDropRateChange = (dropRate) => {
    setPaxosState({
      ...paxosState,
      dropRate: 0.01 * dropRate
    })
  }
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
      server.x = offset + circleRadius * Math.cos(theta) - 10;
      server.y = offset + circleRadius * Math.sin(theta) - 10;
    })

    setPaxosState({
      ...paxosState,
      servers: newServers,
    })
  }

  return (
    <div className={`paxos-setting-container ${className}`} >
      {faultMode ?
        <div>
          <Button
            className='add-button'
            type='primary'
            onClick={failure6}>Not Updating MinProposal</Button>
        </div>
        :
        <Button
          className='add-button'
          type='primary'
          disabled={
            paxosState.servers.length >= 10 || paxosState.on || paxosState.packets.length > 0
          } onClick={handleAddServer}>Add Node</Button>
      }
      <Button
        className='start-button'
        onClick={handleStartButton}
      >{paxosState.on ? 'Pause' : 'Start'}</Button>
      <LabelIconSlider
        leftIcon={<GiTurtleShell />}
        rightIcon={<GiRabbit />}
        label='Speed'
        min={1}
        max={5}
        handleChange={handleSpeedChange}
      />
      {!faultMode &&
        <LabelIconSlider
          leftIcon={<AiOutlineCheck />}
          rightIcon={<AiOutlineClose />}
          label='Message Drop Rate'
          min={0}
          max={(100)}
          step={10}
          handleChange={handleDropRateChange}
        />
      }
    </div>
  )
}

export default styled(PaxosSetting)`

  #mode-setting {
    display: flex;
    flex-direction: column;
  }

  button {
    width: 100%;
    margin: 10px;
  }
`;