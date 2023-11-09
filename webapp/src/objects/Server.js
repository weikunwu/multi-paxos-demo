import { Packet } from './Packet';

class Server {
  constructor(name) {
    this.id = name; // server name
    this.down = null; // whether server is down  type=boolean
    this.x = null; // server x position
    this.y = null; // server y position
    this.minPropNum = null; // server accepted min proposal number
    this.acceptedProp = null; // server accepted proposal number
    this.acceptedValue = null; // server accepted value
  }

  broadcastPropose(servers, value) {
    const id = Date.now();
    return servers.map((server, i) => {
      return this.propose(server, id + i, value)
    })
  }

  // Step 1: Choose new proposal number and create packet
  prepare(server, id, proposalNum) {
    const packet = new Packet(this, server)
    packet.id = id;
    packet.type = "PREPARE";
    packet.proposalNum = proposalNum;
    return packet;
  }

   // Step 2: Proposer broadcasts Prepare(n) to all servers (acceptors)
  broadcastPrepare(servers, proposalNum) {
    const id = Date.now();
    return servers.map((server, i) => {
      return this.prepare(server, id + i, proposalNum)
    })
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







  
  ackAccept(packet) {
    // Similar to ackPrepare, but for ACK_ACCEPT packets
  }

  processAckPrepare(numOfServers, packet) {
    // Implement the logic for processing ACK_PREPARE packets
    // Potentially call broadcastAccept() based on algorithm's conditions
  }

  processAckAccept(numOfServers, packet) {
    // Implement the logic for processing ACK_ACCEPT packets
  }

    // check packet type, 
  // and call the corresponding method to process the packet
  receivePacket(packet) {
    switch (packet.type) {
      case "PREPARE":
        return this.ackPrepare(packet);
      case "ACCEPT":
        return this.ackAccept(packet);
      // Add cases for other packet types as needed
      default:
        // Handle unknown packet type
        break;
    }
  }

  ackPrepare(packet) {
    const className = "ackPrepare";
    const ackPacket = new Packet(className, packet.from); // Assuming 'from' is the origin server
    ackPacket.type = "ACK_PREPARE";
    // Include accepted proposal number and value, if any
    return ackPacket;
  }
};

export { Server };