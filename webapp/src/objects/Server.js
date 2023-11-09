import { Packet } from './Packet';

class Server {
  constructor(name) {
    this.id = name; // server name
    this.x = null; // server x postion
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
    const packet = new Packet(this, server)
    packet.id = id;
    packet.type = 'PREPARE';
    packet.proposalNum = proposalNum;
    return packet;
  }

  ackPrepare(packet) {
    // TODO
    return packet
  }

  ackAccept(packet) {
    // TODO
    return packet
  }

  receivedPacket(packet) {
    const packetNum = packet.proposalNum;
    const packetValue = packet.value;
    const respond = new Packet(this, packet.from);
    switch (packet.type) {
      case 'PREPARE':
        // No accepted value
        if (this.acceptedValue === null) {
          if (this.minProposal < packetNum) {
            // Update server min proposal num
            this.minProposal = packetNum;
            respond.proposalNum = packetNum;
            this.ackPrepare(respond);
          } else { } // Ignore prepare request
        } else {
          // Have accepted value
          respond.proposalNum = this.acceptedProp;
          respond.value = this.acceptedValue;
          this.ackPrepare(respond);
        }
        break;
      case 'ACCEPT':
        // No accepted value
        if (this.acceptedValue === null) {
          if (this.minProposal < packetNum) {
            // Update server min proposal num
            this.minProposal = packetNum;
            this.acceptedProp = packetNum;
            this.acceptedValue = packetValue;
            // Reply (ProposalNum, Value)
            respond.proposalNum = packetNum;
            respond.value = packetValue;
            //ackAccept(respond);
          } else { } // Ignore accept request
        } else {
          // Have accepted value
          respond.proposalNum = this.acceptedProp;
          respond.value = this.acceptedValue;
          //ackAccept(respond);
        }
        break;
      case 'ACK_PREPARE':
        //processAckPrepare();
        break;
      case 'ACK_ACCEPT':
        //processAckAccept();
        break;
      default:
        // Do nothing
        break;
    }
  }
};

export { Server };