class Packet {
	constructor(from, to) {
		this.id = null; // packet ID, must be unique;
		this.time = Date.now(); // packet timestamp;
		this.from = from; // server that send this packet;
		this.to = to; // server that this packet is sent to;
	}
};

export { Packet };