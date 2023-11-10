class Packet {
	constructor(from, to) {
		this.type = null; // packet type, 'PREPARE', 'ACCEPT', 'ACK_PREPARE', 'ACK_ACCEPT';
		this.id = null; // packet ID, must be unique;
		this.time = Date.now(); // packet timestamp
		this.proposalNum = Date.now(); // packet timestamp/proposal number;
		this.value = null; // packet value;
		this.from = from; // server that send this packet;
		this.to = to; // server that this packet is sent to;
  		this.drop = false; // whether the packet is dropped
 		this.acceptedProp = null;
	    this.acceptedValue = null;
	    this.minProposal = null;
	}
};

export { Packet };