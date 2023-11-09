import { Packet } from './Packet';

class Server {
  constructor(name) {
    this.id = name; // server name
    this.down = false;// whether server is down 
    this.x = null; // server x position
    this.y = null; // server y position
    this.minPropNum = null; // server accepted min proposal number
    this.acceptedProp = null; // server accepted proposal number
    this.acceptedValue = null; // server accepted value
  }

  sendMessage(packet) {
    if (this.shouldDropMessage()) {
      // Simulates message drop and logs it for debugging purposes.
      console.log(`Message with ID ${packet.id} dropped.`);
      return null; // Returning null to indicate the message was dropped.
    }
    return packet; // The message is sent normally.
  }

  shouldDropMessage() {
    // Use the message drop rate from the context/state
    return Math.random() < this.messageDropRate;
  }

  // Modify existing methods to use sendMessage
  broadcastPropose(servers, value) {
    const id = Date.now();
    return servers.map((server, i) => {
      const proposalPacket = this.propose(server, id + i, value);
      return this.sendMessage(proposalPacket);
    }).filter(packet => packet !== null); // Filter out null values (dropped messages)
  }

  // broadcastPropose(servers, value) {
  //   const id = Date.now();
  //   return servers.map((server, i) => {
  //     return this.propose(server, id + i, value)
  //   })
  // }

  propose(server, id, value) {
    const packet = new Packet(this, server)
    packet.id = id;
    return packet;
  }

  // [Packet] broadcastAccept(servers, proposalNum, value) to All
  // broadcast accept packets to all acceptors
  broadcastAccept(servers, proposalNum, value) {
    return servers.map(server => {
      // Only broadcast to servers that are not down
      if (!server.down) {
        return this.accept(server, proposalNum, value);
      }
    }).filter(packet => packet !== undefined); // Filter out undefined values (from servers that are down)
  }

  accept(server, proposalNum, value) {
    const packet = new Packet(this, server);
    packet.type = 'ACCEPT'; // Setting the packet type to 'ACCEPT'
    packet.proposalNum = proposalNum;
    packet.value = value;
    // The `drop` field should be determined by some condition or external input, not set directly here.
    return packet;
  }

  // [Packet] ackPrepare(packet) to one
  // send ackPrepare pkt back with accepted ProposalNum and value if any.
  ackPrepare(packet) {
    if (!this.minPropNum || packet.proposalNum > this.minPropNum) {
      this.minPropNum = packet.proposalNum;
      const ackPacket = new Packet(this, packet.from); // using 'from' in Packet as it's the origin
      ackPacket.type = 'ACK_PREPARE';
      ackPacket.proposalNum = this.minPropNum;
      ackPacket.acceptedProp = this.acceptedProp;
      ackPacket.acceptedValue = this.acceptedValue;
      // other properties like 'drop' are not set here as they might be used elsewhere in the logic
      return ackPacket;
    }
    // If the packet's proposal number is less than the highest promised, no ack is sent
  }

  //[Packet] ackAccept(packet) to one
  // send ackAccept pkt back with accepted Proposal Num and value
  ackAccept(packet) {
    if (packet.proposalNum >= this.minPropNum) {
      this.acceptedProp = packet.proposalNum;
      this.acceptedValue = packet.value;
      const ackPacket = new Packet(this, packet.from);
      ackPacket.type = 'ACK_ACCEPT';
      ackPacket.proposalNum = this.acceptedProp;
      ackPacket.value = this.acceptedValue;
      // again, 'drop' is not set here
      return ackPacket;
    }
    // If the packet's proposal number is less than the highest promised, no ack is sent
  }

  processAckPrepare(numOfServers, packet) {
    // This function would process an ack for a prepare message.
    // It should track the number of acks received and determine if it has reached a majority.
    // If a majority is reached, it should call broadcastAccept.
    
    // Tracking acks for the prepare phase would typically involve incrementing a count stored in the state
    this.prepareAcks = (this.prepareAcks || 0) + 1;
    if (this.prepareAcks > numOfServers / 2) {
      // Majority of acks received, can proceed to the accept phase
      // Assuming the value to be proposed is stored in this.proposalValue
      this.broadcastAccept(this.servers, packet.proposalNum, this.proposalValue);
      // Reset prepareAcks for future proposals
      this.prepareAcks = 0;
    }
  }

  processAckAccept(numOfServers, packet) {    
    // Tracking acks for the accept phase would typically involve incrementing a count stored in the state
    this.acceptAcks = (this.acceptAcks || 0) + 1;
    if (this.acceptAcks > numOfServers / 2) {
      // Majority of acks received, consensus has been reached
      this.commitValue(packet.value);
      this.acceptAcks = 0;
    }
  }
  
  commitValue(value) {
    // Logic to commit the value to the state machine
  }
  
};



export { Server };