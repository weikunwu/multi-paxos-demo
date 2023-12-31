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
import {
  ServerAckAcceptNotUpdateMinProp,
} from '../objects/ServerAckAcceptNotUpdateMinProp';
import { PaxosContext } from '../PaxosContext';
import LabelIconSlider from './LabelIconSlider';

const placeInCircle = (servers) => {
  const newServers = [...servers];

  // Calculate position for the new server
  const circleRadius = 150; // Radius of the circle
  const offset = 150; // Center offset for the node
  const totalServers = newServers.length;
  const angle = 2 * Math.PI / totalServers; // Angle for positioning servers

  // Position the new server and update positions for existing servers
  newServers.forEach((server, i) => {
    const theta = angle * (i + 1);
    server.x = offset + circleRadius * Math.cos(theta) - 10;
    server.y = offset + circleRadius * Math.sin(theta) - 10;
    server.numOfServers = totalServers;
  });

  return newServers;
};

const PaxosSetting = ({ className }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const faultMode = paxosState.tab === "fault"

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  const failure6 = async () => {
    setPaxosState((prevState) => {
      return {
        ...prevState,
        servers: [],
        packets: []
      }
    })

    let newServers = [];
    for (let i = 0; i < 5; i++) {
      newServers.push(new ServerAckAcceptNotUpdateMinProp(`${i + 1}`));
    }

    newServers = placeInCircle(newServers);

    await setPaxosState((prevState) => ({
      ...prevState,
      servers: newServers
    }));

    await timeout(0);

    setPaxosState((prevState) => {
      const updatedServers = prevState.servers;
      const newPackets = [
        ...prevState.packets,
        ...updatedServers[1].broadcastPrepare(['1', '4'], 20),
      ];

      return {
        ...prevState,
        packets: newPackets
      };
    });

    await timeout(500);

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

  const handleReset = () => {
    setPaxosState({
      ...paxosState,
      servers: [],
      packets: [],
      on: false,
    })
  }

  const handleSpeedChange = (speed) => {
    setPaxosState(prevState => {
      return {
        ...prevState,
        speed: speed
      }
    })
  }

  const handleDropRateChange = (dropRate) => {
    setPaxosState(prevState => {
      return {
        ...prevState,
        dropRate: 0.01 * dropRate
      }
    })
  }

  const handleFailure5 = () => {
    const interval = setInterval(async () => {
      setPaxosState((prevState) => {
        const newPackets = [
          ...prevState.packets,
          ...paxosState.servers[0].broadcastPrepare(['4', '5'], 1)
        ];
        console.log(newPackets);
        return {
          ...prevState,
          packets: newPackets,
          on: true
        }
      })
      await timeout(6000);
      setPaxosState((prevState) => {
        const newPackets = [
          ...prevState.packets,
          ...paxosState.servers[1].broadcastPrepare(['3', '4'], 2)
        ];
        return {
          ...prevState,
          packets: newPackets,
          on: true
        }
      })
    }, 10000);
  }

  const failure1 = () => {
    setPaxosState((prevState) => {
      return {
        ...prevState,
        servers: [],
        packets: []
      }
    })
    const totalServers = 4;
    let newServers = new Array(totalServers).fill(null).map((_, i) => {
      return new Server(`${i + 1}`);
    });

    newServers = placeInCircle(newServers);

    setPaxosState((prevState) => {
      const newPackets = [
        ...prevState.packets,
        ...newServers[0].broadcastPreparFailure1(['2', '3', '4'], 10),
        ...newServers[2].broadcastPreparFailure1(['1', '2', '4'], 20)
      ];
      return {
        ...prevState,
        scenario: 'failure1',
        servers: newServers,
        packets: newPackets,
      }
    })
  }

  const handleAddServer = () => {
    setPaxosState(prevState => {
      // Clone the current array of servers
      let newServers = [...prevState.servers];

      // Create a new unique identifier for the new server
      const newServerId = `${newServers.length + 1}`;

      // Create a new Server instance with the unique identifier
      const newServer = new Server(newServerId);

      newServers.push(newServer);

      newServers = placeInCircle(newServers);

      // Return the updated state
      return {
        ...prevState,
        servers: newServers,
      };
    });
  };

  return (
    <div className={`paxos-setting-container ${className}`} >
      {faultMode ?
        <div className="button-group">
          <Button
            type='primary'
            onClick={failure1}>Same Proposal Number</Button>
          <Button
            type='primary'
            onClick={failure6}>Not Updating MinProposal</Button>
        </div>
        :
        <div className="button-group">
          <Button
            className='add-button'
            type='primary'
            disabled={
              paxosState.servers.length >= 6 || paxosState.on || paxosState.packets.length > 0
            } onClick={handleAddServer}>Add Node</Button>
        </div>
      }
      <div className="button-group">
        <Button
          className='start-button'
          onClick={() => {
            if (paxosState.scenario === "failure5") {
              handleFailure5();
            }
            handleStartButton();
          }}
        >{paxosState.on ? 'Pause' : 'Start'}</Button>
        {!faultMode && <Button onClick={handleReset}>Reset</Button>}
      </div>
      <LabelIconSlider
        leftIcon={<GiTurtleShell />}
        rightIcon={<GiRabbit />}
        label='Speed'
        min={1}
        max={5}
        value={paxosState.speed}
        handleChange={handleSpeedChange}
      />
      {
        !faultMode &&
        <LabelIconSlider
          leftIcon={<AiOutlineCheck />}
          rightIcon={<AiOutlineClose />}
          label='Message Drop Rate'
          min={0}
          max={(100)}
          step={10}
          value={paxosState.dropRate * 100}
          handleChange={handleDropRateChange}
        />
      }
    </div >
  )
}

export default styled(PaxosSetting)`

  #mode-setting {
    display: flex;
    flex-direction: column;
  }

  .button-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  button {
    width: 100%;
    margin: 10px;
  }
`;
