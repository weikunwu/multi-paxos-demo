import React, { useContext } from 'react';

import {
  Button,
  Popover,
  Table,
  Tag,
} from 'antd';
import styled from 'styled-components';

import { Packet } from '../objects/Packet';
import { PaxosContext } from '../PaxosContext';
import ProposePopover from './ProposePopover';

const ServerTable = ({ className }) => {
  const [paxosState, setPaxosState] = useContext(PaxosContext);

  const handlePropose = (id, val) => {
    const receivers = paxosState.servers.filter(s => s.id !== id).map(s => s.id);
    const proposer = paxosState.servers.find(s => s.id === id);

    setPaxosState((prevState) => {
      const packets = proposer.broadcastPrepare(receivers, val)
      const newPackets = [
        ...prevState.packets,
        ...Packet.filterDrop(packets, paxosState.dropRate),
      ]

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

  const handleShutDown = (id) => {
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%'
    },
    {
      title: 'Status',
      dataIndex: 'down',
      key: 'down',
      width: '10%',
      render: (_, { down }) => {
        const status = down ? "down" : "up";
        const color = status === "up" ? "green" : "volcano";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'MinProposal',
      dataIndex: 'minProposal',
      key: 'minProposal',
      width: '15%'
    },
    {
      title: 'Accepted Proposal Number',
      dataIndex: 'acceptedProp',
      key: 'acceptedProp',
      width: '15%'
    },
    {
      title: 'Accepted Value',
      dataIndex: 'acceptedValue',
      key: 'acceptedValue',
      width: '15%'
    },
    {
      title: 'Learned Value',
      dataIndex: 'learnedValue',
      key: 'learnedValue',
      width: '15%'
    },

    {
      title: 'Action',
      key: 'action',
      width: '20%',
      render: (_, { id, down }) => {

        return (
          <>
            <Popover
              trigger={"click"}
              content={
                <ProposePopover handlePropose={(val) => {
                  handlePropose(id, val);
                }} />
              }
            >
              <Button
                type="primary"
                disabled={down}
              >
                Propose
              </Button>
            </Popover >
            <Button
              type="primary"
              onClick={() => { handleShutDown(id) }}
              danger
            >
              {down ? 'Resume' : 'Shut Down'}
            </Button>
          </>
        )
      }
    }
  ]

  window.onClick = (event) => {
    console.log(event.target);
  }

  const data = paxosState.servers.map(server => {
    return {
      key: server.id,
      id: server.id,
      down: server.down,
      proposalValue: server.proposalValue,
      minProposal: server.minProposal,
      acceptedProp: server.acceptedProp,
      acceptedValue: server.acceptedValue,
      learnedValue: server.learnedValue
    }
  })

  return (
    <Table
      className={className}
      dataSource={data}
      columns={columns}
      pagination={false}
      size="small"
      locale={{ emptyText: "Please Add a Node" }}
    />
  )
};

export default styled(ServerTable)`
  button {
    margin: 10px;
  }
`;