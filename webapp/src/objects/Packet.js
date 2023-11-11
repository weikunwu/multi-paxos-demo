class Packet {
  static #count = 0;

  constructor(from, to) {
    this.type = null; // packet type, 'PREPARE', 'ACCEPT', 'ACK_PREPARE', 'ACK_ACCEPT';
    this.id = Packet.#count++; // packet ID, must be unique;
    this.proposalNum = null; // packet timestamp/proposal number;
    this.value = null; // packet value;


    this.from = from; // server id that send this packet;
    this.to = to; // server id that this packet is sent to;


    this.drop = false; // whether the packet is dropped, type:boolean


    this.acceptedProp = null;
    this.acceptedValue = null;


    this.minProposal = null;
  }
};

export { Packet };