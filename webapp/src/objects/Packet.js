class Packet {
	constructor(from, to) {
		this.time = Date.now();
		this.from = from;
		this.to = to;
	}
};

export { Packet };