// Crash Occurs after the server successfully accepts the packet
// and Re-execute with the Same Proposal Number but Different Value
import { Packet } from './Packet';

class Server7 {
  constructor(name) {
    this.id = name; // server name
    this.down = false; // whether server is down
    this.x = null; // server x position
    this.y = null; // server y position
    this.acceptedValue = null; // server accepted value
    this.acceptedProp = null; // server promised number
    this.minProposal = null; // min proposal number
    this.proposalNum = null; // proposer proposal number
    this.proposalValue = null; // proposer proposal value

    this.prepareAcks = 0; // initialize prepare acknowledgments counter
    this.acceptAcks = 0; // initialize accept acknowledgments counter

    this.minAcceptedProp = null;
    this.minAcceptedValue = null;
  }

  broadcastPrepare(otherServers, value) {
    const proposalNum = Date.now();
    this.proposalNum = proposalNum;
    this.proposalValue = value;

    // Deliver the prepare packet at the proposer itself
    this.minProposal = proposalNum;

    // Deliver the ackPrepare packet at the proposer itself
    this.prepareAcks = 1;
    this.minAcceptedProp = this.acceptedProp;
    this.minAcceptedValue = this.acceptedValue;

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

  broadcastAccept(otherServers, proposalNum, proposalValue) {
    // Deliver the accept packet at the proposer itself
    this.acceptedProp = proposalNum;
    this.acceptedValue = proposalValue;

    // Deliver the ackAccept packet at the proposer itself
    this.acceptAcks = 1;

    return otherServers.map((server) => {
      return this.acceptRequest(server, proposalNum, proposalValue)
    })
  }

  acceptRequest(server, proposalNum, proposalValue) {
    const packet = new Packet(this.id, server)
    packet.type = 'ACCEPT';
    packet.proposalNum = proposalNum;
    packet.value = proposalValue;
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
      packetOut.minProposal = proposalNum;
      return [packetOut];
    } else {
      // n < minProposal: Ignore accept request
      return []
    }
  }

  processAckPrepare(otherServers, packet) {
    const proposalNum = packet.proposalNum;
    if (proposalNum > this.minProposal) {
      // Already have other proposer with larger proposal number, drop current packet
      return []
    }

    if (proposalNum < this.minProposal) {
      // Already started a new round with larger proposal number, drop current packet
      return []
    }

    this.prepareAcks += 1;

    if (packet.acceptedProp) {
      if (this.minAcceptedProp) {
        if (packet.acceptedProp > this.minAcceptedProp) {
          this.minAcceptedProp = packet.acceptedProp;
          this.minAcceptedValue = packet.acceptedValue;
        }
      } else {
        this.minAcceptedProp = packet.acceptedProp;
        this.minAcceptedValue = packet.acceptedValue;
      }
    }


    if (this.prepareAcks > (otherServers.length + 1) / 2) {
      const packets = this.broadcastAccept(otherServers, packet.proposalNum, this.minAcceptedValue || this.proposalValue);
      this.prepareAcks = 0;
      return packets; // Return Accept packets to broadcast
    }
    return []; // Return an empty array if the condition is not met
  }

  processAckAccept(otherServers, packet) {
    const proposalNum = packet.proposalNum;
    if (proposalNum > this.minProposal) {
      return []; // Drop current packet if it's from an older proposal
    }

    if (proposalNum < this.minProposal) {
      return []; // Drop current packet if a new round has started
    }

    this.acceptAcks += 1;
    if (this.acceptAcks > (otherServers.length + 1) / 2) {
      // A majority has accepted the proposal
      this.acceptAcks = 0; // Reset the counter

      // Simulate a crash after a majority has accepted the proposal
      this.simulateCrashAndRestart(otherServers, 5000); // Restart after 5 seconds

      return []; // No need to return packets if a value is accepted by a majority
    }

    return []; // Return an empty array if the condition is not met
  }

  simulateCrashAndRestart(servers, delay = 5000) {
    this.simulateCrash();
    setTimeout(() => {
      const newValue = this.generateNewValue();
      this.broadcastPrepare(servers, newValue);
    }, delay);
  }
  
  simulateCrash() {
    // Reset state variables except for proposalNum
    this.acceptedValue = null;
    this.acceptedProp = null;
    this.prepareAcks = 0;
    this.acceptAcks = 0;
    this.minAcceptedProp = null;
    this.minAcceptedValue = null;
    // Do not reset this.proposalNum and this.minProposal to retain the proposal number
  }
  
  generateNewValue() {
    return parseInt(this.proposalValue, 10) + 1;
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

export { Server7 };
