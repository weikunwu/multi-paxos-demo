import React from 'react';

import {
  Button,
  Card,
  Descriptions,
} from 'antd';
import styled from 'styled-components';

const PacketTooltip = ({ className, packet, handleDrop }) => {

  const getPacketDetail = () => {
    let l = [
      'type',
      'proposalNum'
    ]
    switch (packet.type) {
      case "PREPARE":
        break;
      case "ACK_PREPARE":
        l = [
          ...l,
          'acceptedProp',
          'acceptedValue'
        ];
        break;
      case "ACCEPT":
        l = [
          ...l,
          'value',
        ];
        break;
      case "ACK_ACCEPT":
        l = [
          ...l,
          'minProposal'
        ]
        break;
      default:
        // Do nothing
        break;
    }
    return l.map(key => {
      return {
        key,
        label: key,
        children: packet[key]
      }
    })
  };
  return (
    <div id='tooltip-container' className={className}>
      <Card
        actions={[
          <Button
            type="primary"
            onClick={handleDrop}
            danger
          >
            {packet.drop ? 'Undo Drop' : 'Drop'}
          </Button>
        ]}
      >
        <Descriptions
          bordered
          size={'small'}
          column={1}
          labelStyle={{
            width: "20%"
          }}
          items={getPacketDetail()}
        />
      </Card>
    </div>
  )
}

export default styled(PacketTooltip)`
  #tooltip-divider {
    // border: white;
  }
`;