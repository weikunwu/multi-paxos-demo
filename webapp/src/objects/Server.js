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
    this.numOfServers = 0;
    this.prepareAcks = 0; // initialize prepare acknowledgments counter
    this.acceptAcks = 0; // initialize accept acknowledgments counter
    this.servers = []; // store the list of serverIds
  }

  broadcastPrepare(servers, proposalNum) {
    const id = Date.now();
    this.numOfServers = servers.length; 
    return servers.map((server, i) => {
      return this.prepare(server, id + i, proposalNum)
    })
  }

   // Step 2: Proposer broadcasts Prepare(n) to all servers (acceptors)
   broadcastPrepare(servers, proposalNum) {
    const id = Date.now();
    return servers.map((server, i) => {
      return this.prepare(server, id + i, proposalNum);
    });
  }
  
  // Step 3: Acceptor responds to Prepare(n)
  respondToPrepare(packet) {
    if (packet.proposalNum >= this.minProposal) {
      this.minProposal = packet.proposalNum;
      const responsePacket = new Packet(this, packet.from); // Assuming 'from' indicates the origin
      responsePacket.type = "ACK_PREPARE";
      responsePacket.acceptedProp = this.minProposal;
      responsePacket.acceptedValue = this.acceptedValue;
      // Send the responsePacket back to the proposer
      return responsePacket;
    }
    // If packet.proposalNum < this.minProposal, no action is taken (or a NACK could be sent)
  }

  // Step 4: Proposer handles responses to Prepare(n)
  handlePrepareResponses(responses) {
    let highestAcceptedPropNum = null;
    let valueToPropose = this.value; // This value should be initialized elsewhere in the class

    // Count the number of acceptors who acknowledged the prepare
    const acks = responses.filter(response => response.type === "ACK_PREPARE");
    const majority = Math.floor(responses.length / 2) + 1;

    if (acks.length >= majority) {
      // Find the highest accepted proposal number and corresponding value
      acks.forEach(packet => {
        if (packet.acceptedProp && (highestAcceptedPropNum === null || packet.acceptedProp > highestAcceptedPropNum)) {
          highestAcceptedPropNum = packet.acceptedProp;
          valueToPropose = packet.acceptedValue || valueToPropose;
        }
      });

      // If there was an accepted proposal with a value, propose that value
      if (highestAcceptedPropNum !== null) {
        this.value = valueToPropose;
      }

      // Now broadcast the accept request with the chosen proposal number and value
      return this.broadcastAccept(responses.map(response => response.from), this.proposalNum, this.value);
    } else {
      // Not enough acks to proceed, handle appropriately, e.g., retry or abort
    }
  }

  // Step 5: Proposer broadcasts Accept(n, value) to all servers (acceptors)
  broadcastAccept(servers, proposalNum, value) {
    servers.map(server => {
      return this.accept(server, proposalNum, value);
    });
    // Code to send accept packets to all servers
  }

  // Helper method to create an accept packet
  accept(server, proposalNum, value) {
    const packet = new Packet(this, server);
    packet.type = "ACCEPT";
    packet.proposalNum = proposalNum;
    packet.value = value; // The value want to be accepted
    return packet;
  }

  // Step 6: Acceptor responds to Accept(n, value)
  respondToAccept(packet) {
    if (packet.proposalNum >= this.minProposal) {
      this.minProposal = packet.proposalNum;
      this.acceptedProp = packet.proposalNum;
      this.acceptedValue = packet.value;
      const responsePacket = new Packet(this, packet.from);
      responsePacket.type = "ACK_ACCEPT";
      responsePacket.acceptedProp = this.acceptedProp;
      responsePacket.acceptedValue = this.acceptedValue;
      // Send the responsePacket back to the proposer
      return responsePacket; // or only return minProposal
    }
    // If packet.proposalNum < this.minProposal, no action is taken (or a NACK could be sent)
  }


  // Step 7: Broadcast chosen value to all servers (learners)
  broadcastLearner(servers) {
    const acceptedValue = this.acceptedValue;
    servers.map(server => {
      return this.valueChosen(server, acceptedValue);
    });
  }
  // Helper method to choose value
  valueChosen(server, acceptedValue) {
    const packet = new Packet(this, server)
    packet.proposalNum = acceptedValue;
    return packet;
  }

  ackPrepare(packet) {
    const className = "ackPrepare";
    const ackPacket = new Packet(className, packet.from); // Assuming 'from' is the origin server
    ackPacket.type = "ACK_PREPARE";
    // Include accepted proposal number and value, if any
    return ackPacket;
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
      return ackPacket;
    }
    // If the packet's proposal number is less than the highest promised, no ack is sent
  }

  processAckPrepare(servers, packet) {
    this.prepareAcks += 1;
    if (this.prepareAcks > this.numOfServers / 2) {
      this.broadcastAccept(this.servers, packet.proposalNum, this.value);
      this.prepareAcks = 0;
      return [packet]; // Return the acknowledged prepare packet
    }
    return []; // Return an empty array if the condition is not met
  }
  
  processAckAccept(servers, packet) {
    this.acceptAcks += 1;
    if (this.acceptAcks > this.numOfServers / 2) {
      this.acceptAcks = 0;
      this.acceptedValue = packet.value;
      return [packet]; // Return the acknowledged accept packet
    }
    return []; // Return an empty array if the condition is not met
  }  
  
  receivedPacket(packet) {
    const packetNum = packet.proposalNum;
    const packetValue = packet.value;
    const respond = new Packet(this, packet.from);
    switch (packet.type) {
      case "PREPARE":
        return this.ackPrepare(packet);
      case "ACCEPT":
        return this.ackAccept(packet);
      case 'ACK_PREPARE':
        return this.processAckPrepare(this.servers, packet);
      case 'ACK_ACCEPT':
        return this.processAckAccept(this.servers, packet);
      default:
        // Do nothing
        break;
    }
  }
};

export { Server };

