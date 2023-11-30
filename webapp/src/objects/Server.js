import { Packet } from './Packet';

class Server {
  constructor(name) {
    this.id = name; // server name
    this.down = null; // whether server is down  type=boolean
    this.x = null; // server x position
    this.y = null; // server y position
    this.acceptedValue = null; // server accepted value
    this.acceptedProp = null; // server promised number
    this.minProposal = null; // min proposal number
    this.proposalNum = null; // proposer proposal number
    this.proposalValue = null; // proposer proposal value
    this.numOfServers = 0;

    // The server itself is counted as one vote
    this.prepareAcks = 1; // initialize prepare acknowledgments counter
    this.acceptAcks = 1; // initialize accept acknowledgments counter

  }

  broadcastPrepare(otherServers, value) {
    const proposalNum = Date.now();
    this.proposalNum = proposalNum;
    this.proposalValue = value;

    // Deliver the prepare packet at the proposer itself
    this.minProposal = proposalNum;

    
    return otherServers.map((server) => {
      return this.prepare(server, proposalNum)
    })
  }

  prepare(server, proposalNum) {
    const packet = new Packet(this.id, server)
    packet.type = 'PREPARE';
    packet.proposalNum = proposalNum;
    return packet;
  }

  broadcastAccept(otherServers, proposalNum) {
    return otherServers.map((server) => {
      return this.acceptRequest(server, proposalNum)
    })
  }

  acceptRequest(server, proposalNum) {
    const packet = new Packet(this.id, server)
    packet.type = 'ACCEPT';
    packet.proposalNum = proposalNum;
    packet.value = this.proposalValue;
    return packet;
  }

  ackPrepare(packetIn) {
    const proposalNum = packetIn.proposalNum;
    const packetOut = new Packet(this.id, packetIn.from);
    if (this.minProposal < proposalNum) {
      // Update server min proposal num
      this.minProposal = proposalNum;
      packetOut.type = 'ACK_PREPARE';
      packetOut.proposalNum = proposalNum;
      packetOut.acceptedProp = this.acceptedProp;
      packetOut.acceptedValue = this.acceptedValue;
      return [packetOut];
    } else {
      // n < minProposal: Ignore prepare request
      return []
    }
  }

  ackAccept(packetIn) {
    const proposalNum = packetIn.proposalNum;
    const proposalValue = packetIn.value;
    const packetOut = new Packet(this.id, packetIn.from);
    packetOut.type = 'ACK_ACCEPT';
    if (proposalNum >= this.minProposal) {
      // Update server min proposal num
      this.minProposal = proposalNum;
      // Update server accepted proposal num
      this.acceptedProp = proposalNum;
      // Update server accepted value
      this.acceptedValue = proposalValue;
      // Reply (minProposal)
      packetOut.proposalNum = proposalNum;
      packetOut.value = proposalValue;
      return [packetOut];
    } else {
      // n < minProposal: Ignore accept request
      return []
    }
  }

  processAckPrepare(otherServers, packet) {
    this.prepareAcks += 1;
    if (this.prepareAcks > (otherServers.length + 1) / 2) {
      const packets = this.broadcastAccept(otherServers, packet.proposalNum, this.proposalValue);
      this.prepareAcks = 1;
      return packets; // Return Accept packets to broadcast
    }
    return []; // Return an empty array if the condition is not met
  }

  processAckAccept(otherServers, packet) {
    this.acceptAcks += 1;
    if (this.acceptAcks > (otherServers.length + 1) / 2) {
      this.acceptAcks = 1;
      this.acceptedValue = packet.value;
      return []; // No need to return packets if a value is accepted by a majority
    }
    return []; // Return an empty array if the condition is not met
  }

  receivePacket(servers, packet) {
    switch (packet.type) {
      case 'PREPARE':
        return this.ackPrepare(packet);
      case 'ACCEPT':
        return this.ackAccept(packet);
      case 'ACK_PREPARE':
        return this.processAckPrepare(servers, packet);
      case 'ACK_ACCEPT':
        return this.processAckAccept(servers, packet);
      default:
        // Do nothing
        break;
    }
  }
};

export { Server };
