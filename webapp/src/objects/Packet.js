class Packet {
	constructor(from, to) {
		this.type = null; // packet type, 'PREPARE', 'ACCEPT', 'ACK_PREPARE', 'ACK_ACCEPT';
		this.id = null; // packet ID, must be unique;
		this.proposalNum = Date.now(); // packet timestamp;
		this.from = from; // server id that send this packet;
		this.to = to; // server id that this packet is sent to;
	}
 };
 
export { Packet };