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

  }

  broadcastPrepare(servers, value) {
    const proposalNum = Date.now();
    this.proposalNum = proposalNum;
    this.proposalValue = value;

    return servers.map((server) => {
      return this.prepare(server, proposalNum)
    })
  }

  prepare(server, proposalNum) {
    const packet = new Packet(this.id, server)
    packet.type = 'PREPARE';
    packet.proposalNum = proposalNum;
    return packet;
  }

  broadcastAccept(servers, proposalNum) {
    return servers.map((server) => {
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
    if (this.minProposal < proposalNum) {
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

  processAckPrepare() {
    return []
  }

  processAckAccept() {
    return []
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
