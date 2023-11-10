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

  }

  broadcastPrepare(servers, proposalNum) {
    const id = Date.now();
    return servers.map((server, i) => {
      return this.prepare(server, id + i, proposalNum)
    })
  }

  prepare(server, id, proposalNum) {
    const packet = new Packet(this.id, server)
    packet.id = id;
    packet.type = 'PREPARE';
    packet.proposalNum = proposalNum;
    return packet;
  }

  broadcastAccept(servers, proposalNum) {
    const id = Date.now();
    return servers.map((server, i) => {
      return this.acceptRequest(server, id + i, proposalNum)
    })
  }

  acceptRequest(server, id, proposalNum) {
    const packet = new Packet(this.id, server)
    packet.id = id;
    packet.type = 'ACCEPT';
    packet.proposalNum = proposalNum;
    packet.value = this.id;
    return packet;
  }

  ackPrepare(packetIn) {
    const proposalNum = packetIn.proposalNum;
    const packetOut = new Packet(this.id, packetIn.from);
    if (this.acceptedValue === null) {
      if (this.minProposal < proposalNum) {
        // Update server min proposal num
        this.minProposal = proposalNum;
        packetOut.proposalNum = proposalNum;
        return packetOut;
      } else { } // n < minProposal: Ignore prepare request
    } else {
      // Have accepted value
      packetOut.proposalNum = this.acceptedProp;
      packetOut.value = this.acceptedValue;
      return packetOut;
    }
  }

  ackAccept(packetIn) {
    const proposalNum = packetIn.proposalNum;
    const proposalValue = packetIn.value;
    const packetOut = new Packet(this.id, packetIn.from);
    // No accepted value
    if (this.acceptedValue === null) {
      if (this.minProposal < proposalNum) {
        // Update server min proposal num
        this.minProposal = proposalNum;
        // Update server accepted proposal num
        this.acceptedProp = proposalNum;
        // Update server accepted value
        this.acceptedValue = proposalValue;
        // Reply (ProposalNum, Value)
        packetOut.proposalNum = proposalNum;
        packetOut.value = proposalValue;
        return packetOut;
      } else { } // n < minProposal: Ignore accept request
    } else {
      // Have accepted value
      packetOut.proposalNum = this.acceptedProp;
      packetOut.value = this.acceptedValue;
      return packetOut;
    }
  }

  receivedPacket(servers, packet) {
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