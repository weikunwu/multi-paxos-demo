class Packet {
	constructor(from, to) {
		this.type = null; // packet type, prepare, proposal, accept;
		this.value = null; // packet value;
		this.id = null; // packet ID, must be unique;
		this.proposalNum = Date.now(); // packet timestamp;
		this.from = from; // server that send this packet;
		this.to = to; // server that this packet is sent to;
	}
};

export { Packet };