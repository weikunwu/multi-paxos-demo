import React from 'react';

import {
  Button,
  Card,
  Descriptions,
  Input,
} from 'antd';
import styled from 'styled-components';

const ServerTooltip = ({ className, server, handlePropose, handleShutDown }) => {
  return (
    <div id='tooltip-container' className={className}>
      <Card
        actions={[
          <Input />,
          <Button
            type="primary"
            onClick={() => {
              if (!server.down) {
                handlePropose()
              }
            }}
          >Propose</Button>,
          <Button
            type="primary"
            onClick={handleShutDown}
            danger
          >
            {server.down ? 'Resume' : 'Shut Down'}
          </Button>
        ]}
      >
        <Descriptions
          bordered
          size={'small'}
          column={1}
          items={[
            'id',
            'down',
            'proposalValue',
            'minProposal',
            'acceptedProp',
            'acceptedValue',
          ].map(key => {
            return {
              key,
              label: key,
              children: server[key]
            }
          })}
        />
      </Card>
      {/* <Input />
      <Button
        type="primary"
        onClick={() => {
          if (!serverDown) {
            handlePropose()
          }
        }}
      >Propose</Button>
      <Button
        type="primary"
        onClick={handleShutDown}
        danger>{serverDown ? 'Resume' : 'Shut Down'}</Button> */}
    </div>
  )
}

export default styled(ServerTooltip)`
  #tooltip-divider {
    // border: white;
  }
`;