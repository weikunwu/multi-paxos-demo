import { Packet } from './Packet';
import { Server } from './Server';

class ServerAckAcceptNotUpdateMinProp extends Server {
  ackAccept(packetIn) {
    const proposalNum = packetIn.proposalNum;
    const proposalValue = packetIn.value;
    const packetOut = new Packet(this.id, packetIn.from);
    packetOut.type = 'ACK_ACCEPT';
    if (proposalNum >= this.minProposal) {
      // Update server accepted proposal num
      this.acceptedProp = proposalNum;
      // Update server accepted value
      this.acceptedValue = proposalValue;
      // Reply (minProposal)
      packetOut.proposalNum = proposalNum;
      packetOut.minProposal = proposalNum;
      return [packetOut];
    } else {
      // n < minProposal: Ignore accept request
      return []
    }
  }
};

export { ServerAckAcceptNotUpdateMinProp };